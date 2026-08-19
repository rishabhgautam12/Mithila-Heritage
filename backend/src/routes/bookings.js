import { Router } from "express";
import Booking from "../models/Booking.js";
import { ROOMS, roomBySlug } from "../config/rooms.js";
import { requireAdmin } from "../middleware/auth.js";
import { razorpay } from "./payments.js";
import { sendBookingNotification, sendGuestConfirmation } from "../utils/mailer.js";
import Customer from "../models/Customer.js";
import AvailabilityAdjustment from "../models/AvailabilityAdjustment.js";
import { optionalCustomer } from "../middleware/customerAuth.js";

const router = Router();

const MS_DAY = 24 * 60 * 60 * 1000;
const toUTCDate = (s) => {
  const d = new Date(s);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

// Unpaid bookings older than this stop blocking rooms (abandoned checkouts)
export const UNPAID_HOLD_MINUTES = 30;
export const activePaymentFilter = () => ({
  $or: [
    { paymentStatus: "paid" },
    { status: "confirmed" },
    { createdAt: { $gte: new Date(Date.now() - UNPAID_HOLD_MINUTES * 60 * 1000) } },
  ],
});

// Minimum available units of this room across every night in [checkIn, checkOut),
// counting overlapping bookings AND admin manual adjustments.
async function minAvailable(room, checkIn, checkOut, excludeId = null) {
  const query = {
    roomSlug: room.slug,
    status: { $ne: "cancelled" },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
    ...activePaymentFilter(),
  };
  if (excludeId) query._id = { $ne: excludeId };

  const [overlapping, adjustments] = await Promise.all([
    Booking.find(query).select("checkIn checkOut").lean(),
    AvailabilityAdjustment.find({
      roomSlug: room.slug,
      date: {
        $gte: checkIn.toISOString().slice(0, 10),
        $lt: checkOut.toISOString().slice(0, 10),
      },
    }).lean(),
  ]);
  const adjMap = new Map(adjustments.map((a) => [a.date, a.adjustment]));

  let min = Infinity;
  for (let t = checkIn.getTime(); t < checkOut.getTime(); t += MS_DAY) {
    const booked = overlapping.filter(
      (b) => b.checkIn.getTime() <= t && b.checkOut.getTime() > t
    ).length;
    const adj = adjMap.get(new Date(t).toISOString().slice(0, 10)) || 0;
    const avail = Math.max(room.totalUnits - booked + adj, 0);
    if (avail < min) min = avail;
  }
  return min === Infinity ? room.totalUnits : min;
}

// PUBLIC — create booking
router.post("/", optionalCustomer, async (req, res, next) => {
  try {
    const { name, phone, email, roomSlug, checkIn, checkOut, guests, specialRequests } =
      req.body || {};

    if (!name || !phone || !email || !roomSlug || !checkIn || !checkOut || !guests)
      return res.status(400).json({ message: "All required fields must be filled" });

    const room = roomBySlug(roomSlug);
    if (!room) return res.status(400).json({ message: "Invalid room selected" });

    const inDate = toUTCDate(checkIn);
    const outDate = toUTCDate(checkOut);
    const today = toUTCDate(new Date());

    if (inDate < today) return res.status(400).json({ message: "Check-in date is in the past" });
    if (outDate <= inDate)
      return res.status(400).json({ message: "Check-out must be after check-in" });

    if ((await minAvailable(room, inDate, outDate)) < 1)
      return res.status(409).json({
        message: `Sorry, ${room.name} is fully booked for these dates. Please try different dates or another room.`,
      });

    const nights = Math.round((outDate - inDate) / MS_DAY);
    const booking = await Booking.create({
      name,
      phone,
      email,
      roomSlug,
      roomName: room.name,
      checkIn: inDate,
      checkOut: outDate,
      guests,
      specialRequests: specialRequests || "",
      nights,
      amount: nights * room.price,
    });

    // Create Razorpay order (amount in paise)
    let order;
    try {
      order = await razorpay.orders.create({
        amount: booking.amount * 100,
        currency: "INR",
        receipt: booking._id.toString(),
        notes: { room: room.name, guest: name },
      });
    } catch (err) {
      await Booking.findByIdAndDelete(booking._id);
      console.error("Razorpay order failed:", err);
      return res.status(502).json({ message: "Payment gateway error — please try again" });
    }

    booking.razorpayOrderId = order.id;

    // Link to logged-in customer, ya email se account auto-create/link
    try {
      let customerId = req.customer?.id;
      if (!customerId) {
        const existing =
          (await Customer.findOne({ email: booking.email })) ||
          (await Customer.create({ email: booking.email, name: booking.name }));
        customerId = existing._id;
        if (!existing.name) {
          existing.name = booking.name;
          await existing.save();
        }
      }
      booking.customer = customerId;
    } catch (e) {
      console.error("Customer link failed:", e.message);
    }

    await booking.save();

    res.status(201).json({
      message: "Proceed to payment",
      bookingId: booking._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      roomName: room.name,
      nights,
      checkIn: inDate,
      checkOut: outDate,
    });
  } catch (err) {
    next(err);
  }
});

// ADMIN — list bookings with filters: ?status=&roomSlug=&from=&to=&search=
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const { status, roomSlug, from, to, search } = req.query;
    const q = {};
    if (status) q.status = status;
    if (roomSlug) q.roomSlug = roomSlug;
    if (from || to) {
      q.checkIn = {};
      if (from) q.checkIn.$gte = toUTCDate(from);
      if (to) q.checkIn.$lte = toUTCDate(to);
    }
    if (search)
      q.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];

    const bookings = await Booking.find(q).sort({ createdAt: -1 }).lean();

    // quick stats for dashboard cards
    const [total, pending, confirmed] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "confirmed" }),
    ]);

    res.json({ bookings, stats: { total, pending, confirmed } });
  } catch (err) {
    next(err);
  }
});


// ADMIN — dashboard summary
router.get("/dashboard", requireAdmin, async (_req, res, next) => {
  try {
    const today = toUTCDate(new Date());
    const tomorrow = new Date(today.getTime() + MS_DAY);

    const [totalRevenueAgg, counts, todayCheckIns, todayCheckOuts, recent, staying] =
      await Promise.all([
        Booking.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Promise.all([
          Booking.countDocuments(),
          Booking.countDocuments({ status: "pending" }),
          Booking.countDocuments({ status: "confirmed" }),
          Booking.countDocuments({ status: "cancelled" }),
        ]),
        Booking.find({ status: "confirmed", checkIn: { $gte: today, $lt: tomorrow } }).lean(),
        Booking.find({ status: "confirmed", checkOut: { $gte: today, $lt: tomorrow } }).lean(),
        Booking.find().sort({ createdAt: -1 }).limit(6).lean(),
        Booking.countDocuments({
          status: "confirmed",
          checkIn: { $lte: today },
          checkOut: { $gt: today },
        }),
      ]);

    const totalUnits = ROOMS.reduce((s, r) => s + r.totalUnits, 0);
    res.json({
      revenue: totalRevenueAgg[0]?.total || 0,
      total: counts[0],
      pending: counts[1],
      confirmed: counts[2],
      cancelled: counts[3],
      todayCheckIns,
      todayCheckOuts,
      recent,
      occupancy: { occupied: staying, totalUnits },
    });
  } catch (err) {
    next(err);
  }
});

// ADMIN — create booking directly (rebooking / walk-in / phone booking)
router.post("/admin", requireAdmin, async (req, res, next) => {
  try {
    const { name, phone, email, roomSlug, checkIn, checkOut, guests, specialRequests, markPaid } =
      req.body || {};
    if (!name || !phone || !email || !roomSlug || !checkIn || !checkOut || !guests)
      return res.status(400).json({ message: "All required fields must be filled" });

    const room = roomBySlug(roomSlug);
    if (!room) return res.status(400).json({ message: "Invalid room selected" });

    const inDate = toUTCDate(checkIn);
    const outDate = toUTCDate(checkOut);
    if (outDate <= inDate)
      return res.status(400).json({ message: "Check-out must be after check-in" });

    if ((await minAvailable(room, inDate, outDate)) < 1)
      return res.status(409).json({ message: `${room.name} is fully booked for these dates` });

    const nights = Math.round((outDate - inDate) / MS_DAY);
    const booking = await Booking.create({
      name, phone, email, roomSlug,
      roomName: room.name,
      checkIn: inDate,
      checkOut: outDate,
      guests,
      specialRequests: specialRequests || "",
      nights,
      amount: nights * room.price,
      status: "confirmed",
      paymentStatus: markPaid ? "paid" : "unpaid",
      createdVia: "admin",
    });

    Promise.allSettled([sendBookingNotification(booking), sendGuestConfirmation(booking)]).then(
      (results) =>
        results.forEach(
          (r) => r.status === "rejected" && console.error("Email failed:", r.reason?.message)
        )
    );

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
});

// ADMIN — update status
router.patch("/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status, cancelReason } = req.body || {};
    if (!["pending", "confirmed", "cancelled"].includes(status))
      return res.status(400).json({ message: "Invalid status" });
    const update = { status };
    update.cancelReason = status === "cancelled" ? cancelReason || "" : "";
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ booking });
  } catch (err) {
    next(err);
  }
});

// ADMIN — delete booking
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
