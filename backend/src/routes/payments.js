import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";
import { sendBookingNotification, sendGuestConfirmation } from "../utils/mailer.js";

const router = Router();

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/verify
// Called by frontend after Razorpay checkout success.
// Verifies the signature server-side, then confirms the booking + sends emails.
router.post("/verify", async (req, res, next) => {
  try {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body || {};

    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      return res.status(400).json({ message: "Missing payment details" });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.razorpayOrderId !== razorpay_order_id)
      return res.status(400).json({ message: "Order mismatch" });

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature)
      return res.status(400).json({ message: "Payment verification failed" });

    booking.paymentStatus = "paid";
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.status = "confirmed";
    await booking.save();

    // Emails only after successful payment — never block the response
    Promise.allSettled([sendBookingNotification(booking), sendGuestConfirmation(booking)]).then(
      (results) =>
        results.forEach(
          (r) => r.status === "rejected" && console.error("Email failed:", r.reason?.message)
        )
    );

    res.json({ message: "Payment verified — booking confirmed", status: "confirmed" });
  } catch (err) {
    next(err);
  }
});

export default router;
