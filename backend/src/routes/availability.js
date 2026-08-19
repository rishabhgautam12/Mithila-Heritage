import { Router } from "express";
import Booking from "../models/Booking.js";
import AvailabilityAdjustment from "../models/AvailabilityAdjustment.js";
import { ROOMS } from "../config/rooms.js";
import { requireAdmin } from "../middleware/auth.js";
import { activePaymentFilter } from "./bookings.js";

const router = Router();
const MS_DAY = 24 * 60 * 60 * 1000;

// GET /api/availability?year=2026&month=7  (month = 1-12)
router.get("/", async (req, res, next) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || now.getMonth() + 1;

    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 1)); // exclusive
    const daysInMonth = Math.round((monthEnd - monthStart) / MS_DAY);

    const monthPrefix = `${year}-${String(month).padStart(2, "0")}`;
    const [bookings, adjustments] = await Promise.all([
      Booking.find({
        status: { $ne: "cancelled" },
        checkIn: { $lt: monthEnd },
        checkOut: { $gt: monthStart },
        ...activePaymentFilter(),
      })
        .select("roomSlug checkIn checkOut")
        .lean(),
      AvailabilityAdjustment.find({ date: { $regex: `^${monthPrefix}` } }).lean(),
    ]);

    const adjMap = {};
    adjustments.forEach((a) => {
      adjMap[`${a.date}|${a.roomSlug}`] = a;
    });

    const days = [];
    for (let i = 0; i < daysInMonth; i++) {
      const t = monthStart.getTime() + i * MS_DAY;
      const date = new Date(t).toISOString().slice(0, 10);
      const rooms = ROOMS.map((room) => {
        const booked = bookings.filter(
          (b) =>
            b.roomSlug === room.slug &&
            b.checkIn.getTime() <= t &&
            b.checkOut.getTime() > t
        ).length;
        const adj = adjMap[`${date}|${room.slug}`];
        const adjustment = adj?.adjustment || 0;
        // adjustment: +N = extra rooms khaali (early checkout / correction)
        //             -N = rooms blocked (maintenance / offline booking)
        const available = Math.min(
          Math.max(room.totalUnits - booked + adjustment, 0),
          room.totalUnits
        );
        return {
          slug: room.slug,
          name: room.name,
          totalUnits: room.totalUnits,
          booked,
          adjustment,
          note: adj?.note || "",
          available,
        };
      });
      const totalAvailable = rooms.reduce((s, r) => s + r.available, 0);
      const totalUnits = rooms.reduce((s, r) => s + r.totalUnits, 0);
      days.push({ date, rooms, totalAvailable, totalUnits });
    }

    res.json({ year, month, days, roomTypes: ROOMS });
  } catch (err) {
    next(err);
  }
});

// ADMIN — PUT /api/availability/adjustment  { date, roomSlug, adjustment, note }
// adjustment 0 → record delete, wapas automatic calculation.
router.put("/adjustment", requireAdmin, async (req, res, next) => {
  try {
    const { date, roomSlug, adjustment, note } = req.body || {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || ""))
      return res.status(400).json({ message: "Invalid date" });
    const room = ROOMS.find((r) => r.slug === roomSlug);
    if (!room) return res.status(400).json({ message: "Invalid room" });
    const adj = parseInt(adjustment);
    if (Number.isNaN(adj))
      return res.status(400).json({ message: "Invalid adjustment value" });
    if (Math.abs(adj) > room.totalUnits)
      return res
        .status(400)
        .json({ message: `Adjustment ±${room.totalUnits} se zyada nahi ho sakta` });

    if (adj === 0) {
      await AvailabilityAdjustment.findOneAndDelete({ date, roomSlug });
      return res.json({ message: "Adjustment hata diya — ab automatic calculation" });
    }

    const saved = await AvailabilityAdjustment.findOneAndUpdate(
      { date, roomSlug },
      { adjustment: adj, note: note || "" },
      { upsert: true, new: true }
    );
    res.json({ message: "Adjustment saved", adjustment: saved });
  } catch (err) {
    next(err);
  }
});

export default router;
