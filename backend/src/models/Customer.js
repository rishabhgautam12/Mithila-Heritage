import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    email: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
    phone: { type: String, trim: true, sparse: true, unique: true },
    otpHash: { type: String, default: "" },
    otpExpires: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 },
    // pending identifier change (verified by OTP sent to the NEW identifier)
    pendingEmail: { type: String, default: "" },
    pendingPhone: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
