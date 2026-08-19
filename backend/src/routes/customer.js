import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Customer from "../models/Customer.js";
import Booking from "../models/Booking.js";
import { requireCustomer } from "../middleware/customerAuth.js";
import { sendCustomerOtpEmail } from "../utils/mailer.js";
import { sendOtpSms } from "../utils/sms.js";

const router = Router();

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s) => /^\+?\d{10,13}$/.test(String(s).replace(/[\s-]/g, ""));
const normPhone = (s) => String(s).replace(/\D/g, "").slice(-10);

async function issueOtp(customer, via, target) {
  const otp = String(crypto.randomInt(100000, 999999));
  customer.otpHash = await bcrypt.hash(otp, 10);
  customer.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  customer.otpAttempts = 0;
  await customer.save();
  if (via === "email") await sendCustomerOtpEmail(target, otp);
  else await sendOtpSms(target, otp);
}

// POST /api/customer/request-otp  { identifier }  (email ya phone)
router.post("/request-otp", async (req, res, next) => {
  try {
    const identifier = String(req.body?.identifier || "").trim();
    let customer, via, target;

    if (isEmail(identifier)) {
      via = "email";
      target = identifier.toLowerCase();
      customer =
        (await Customer.findOne({ email: target })) || new Customer({ email: target });
    } else if (isPhone(identifier)) {
      via = "phone";
      target = normPhone(identifier);
      customer =
        (await Customer.findOne({ phone: target })) || new Customer({ phone: target });
    } else {
      return res.status(400).json({ message: "Valid email ya 10-digit phone number daalein" });
    }

    await issueOtp(customer, via, target);
    res.json({
      message:
        via === "email"
          ? `OTP bheja gaya ${target} par`
          : `OTP bheja gaya +91 ${target} par`,
      via,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/customer/verify-otp  { identifier, otp }
router.post("/verify-otp", async (req, res, next) => {
  try {
    const identifier = String(req.body?.identifier || "").trim();
    const otp = String(req.body?.otp || "");
    const query = isEmail(identifier)
      ? { email: identifier.toLowerCase() }
      : { phone: normPhone(identifier) };

    const customer = await Customer.findOne(query);
    if (!customer?.otpHash || !customer.otpExpires || customer.otpExpires < new Date())
      return res.status(400).json({ message: "OTP expire ho gaya — naya request karein" });
    if (customer.otpAttempts >= 5)
      return res.status(429).json({ message: "Too many attempts — naya OTP request karein" });

    if (!(await bcrypt.compare(otp, customer.otpHash))) {
      customer.otpAttempts += 1;
      await customer.save();
      return res.status(400).json({ message: "Galat OTP" });
    }

    customer.otpHash = "";
    customer.otpExpires = null;
    await customer.save();

    // Link past bookings made with this email/phone before account existed
    const or = [];
    if (customer.email) or.push({ email: customer.email });
    if (customer.phone) or.push({ phone: { $regex: customer.phone + "$" } });
    if (or.length)
      await Booking.updateMany({ $or: or, customer: null }, { customer: customer._id });

    const token = jwt.sign({ role: "customer", id: customer._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({ token, profile: { name: customer.name, email: customer.email, phone: customer.phone } });
  } catch (err) {
    next(err);
  }
});

// GET /api/customer/me — profile + all bookings
router.get("/me", requireCustomer, async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.customer.id).select("name email phone createdAt");
    if (!customer) return res.status(404).json({ message: "Account not found" });

    const or = [{ customer: customer._id }];
    if (customer.email) or.push({ email: customer.email });
    if (customer.phone) or.push({ phone: { $regex: customer.phone + "$" } });
    const bookings = await Booking.find({ $or: or })
      .sort({ checkIn: -1 })
      .select("-razorpayOrderId")
      .lean();

    res.json({ profile: customer, bookings });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/customer/me  { name }
router.patch("/me", requireCustomer, async (req, res, next) => {
  try {
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ message: "Name required" });
    const customer = await Customer.findByIdAndUpdate(
      req.customer.id,
      { name },
      { new: true }
    ).select("name email phone");
    res.json({ profile: customer });
  } catch (err) {
    next(err);
  }
});

// POST /api/customer/request-update — OTP goes to the NEW email/phone
router.post("/request-update", requireCustomer, async (req, res, next) => {
  try {
    const { newEmail, newPhone } = req.body || {};
    const customer = await Customer.findById(req.customer.id);
    if (!customer) return res.status(404).json({ message: "Account not found" });

    if (newEmail) {
      if (!isEmail(newEmail)) return res.status(400).json({ message: "Valid email daalein" });
      const taken = await Customer.findOne({ email: newEmail.toLowerCase() });
      if (taken && !taken._id.equals(customer._id))
        return res.status(400).json({ message: "Ye email pehle se registered hai" });
      customer.pendingEmail = newEmail.toLowerCase();
      customer.pendingPhone = "";
      await issueOtp(customer, "email", customer.pendingEmail);
      return res.json({ message: `OTP bheja gaya naye email ${customer.pendingEmail} par` });
    }
    if (newPhone) {
      if (!isPhone(newPhone)) return res.status(400).json({ message: "Valid phone number daalein" });
      const p = normPhone(newPhone);
      const taken = await Customer.findOne({ phone: p });
      if (taken && !taken._id.equals(customer._id))
        return res.status(400).json({ message: "Ye number pehle se registered hai" });
      customer.pendingPhone = p;
      customer.pendingEmail = "";
      await issueOtp(customer, "phone", p);
      return res.json({ message: `OTP bheja gaya naye number +91 ${p} par` });
    }
    res.status(400).json({ message: "newEmail ya newPhone bhejein" });
  } catch (err) {
    next(err);
  }
});

// POST /api/customer/confirm-update  { otp }
router.post("/confirm-update", requireCustomer, async (req, res, next) => {
  try {
    const otp = String(req.body?.otp || "");
    const customer = await Customer.findById(req.customer.id);
    if (!customer?.otpHash || !customer.otpExpires || customer.otpExpires < new Date())
      return res.status(400).json({ message: "OTP expire ho gaya — naya request karein" });
    if (!(await bcrypt.compare(otp, customer.otpHash)))
      return res.status(400).json({ message: "Galat OTP" });

    if (customer.pendingEmail) customer.email = customer.pendingEmail;
    if (customer.pendingPhone) customer.phone = customer.pendingPhone;
    customer.pendingEmail = "";
    customer.pendingPhone = "";
    customer.otpHash = "";
    customer.otpExpires = null;
    await customer.save();

    res.json({
      message: "Update ho gaya",
      profile: { name: customer.name, email: customer.email, phone: customer.phone },
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email/phone already in use" });
    next(err);
  }
});

export default router;
