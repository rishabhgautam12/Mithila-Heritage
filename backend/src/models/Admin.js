import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    otpHash: { type: String, default: "" },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

adminSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const Admin = mongoose.model("Admin", adminSchema);

// First-run seed from .env — after that, DB is the source of truth.
export async function ensureAdmin() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    });
    console.log("✅ Admin account seeded from .env");
  }
}

export default Admin;
