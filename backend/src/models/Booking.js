import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    roomSlug: { type: String, required: true },
    roomName: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    specialRequests: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    amount: { type: Number, default: 0 }, // price/night * nights (snapshot)
    nights: { type: Number, default: 1 },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    cancelReason: { type: String, default: "" },
    createdVia: { type: String, enum: ["website", "admin"], default: "website" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ roomSlug: 1, checkIn: 1, checkOut: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);
