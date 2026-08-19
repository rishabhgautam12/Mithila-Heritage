import mongoose from "mongoose";

// Admin manual correction per date + room type.
// adjustment: +N (extra rooms khaali, e.g. early checkout) / -N (rooms band, e.g. maintenance)
const adjustmentSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // "YYYY-MM-DD"
    roomSlug: { type: String, required: true },
    adjustment: { type: Number, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

adjustmentSchema.index({ date: 1, roomSlug: 1 }, { unique: true });

export default mongoose.model("AvailabilityAdjustment", adjustmentSchema);
