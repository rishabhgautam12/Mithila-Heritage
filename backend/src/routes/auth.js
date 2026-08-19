import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/Admin.js";
import { requireAdmin } from "../middleware/auth.js";
import { sendOtpEmail } from "../utils/mailer.js";

const router = Router();

// POST /api/auth/login  { email, password }
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const admin = await Admin.findOne({ email: email?.toLowerCase() });
    if (!admin || !(await admin.checkPassword(password || "")))
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ role: "admin", id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    res.json({ token, email: admin.email });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me — current admin email (for Settings page)
router.get("/me", requireAdmin, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("email");
    res.json({ email: admin?.email });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/request-change — sends 6-digit OTP to CURRENT admin email
router.post("/request-change", requireAdmin, async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const otp = String(crypto.randomInt(100000, 999999));
    admin.otpHash = await bcrypt.hash(otp, 10);
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await admin.save();

    await sendOtpEmail(admin.email, otp);
    res.json({ message: `Verification code sent to ${admin.email}` });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/confirm-change  { otp, newEmail?, newPassword? }
router.post("/confirm-change", requireAdmin, async (req, res, next) => {
  try {
    const { otp, newEmail, newPassword } = req.body || {};
    if (!otp) return res.status(400).json({ message: "Verification code required" });
    if (!newEmail && !newPassword)
      return res.status(400).json({ message: "Nothing to update" });
    if (newPassword && newPassword.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const admin = await Admin.findById(req.admin.id);
    if (!admin?.otpHash || !admin.otpExpires || admin.otpExpires < new Date())
      return res.status(400).json({ message: "Code expired — request a new one" });
    if (!(await bcrypt.compare(String(otp), admin.otpHash)))
      return res.status(400).json({ message: "Incorrect verification code" });

    if (newEmail) admin.email = newEmail.toLowerCase();
    if (newPassword) admin.passwordHash = await bcrypt.hash(newPassword, 10);
    admin.otpHash = "";
    admin.otpExpires = null;
    await admin.save();

    res.json({ message: "Credentials updated — please login again", email: admin.email });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email already in use" });
    next(err);
  }
});

export default router;
