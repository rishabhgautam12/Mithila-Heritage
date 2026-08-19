import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import bookingRoutes from "./routes/bookings.js";
import availabilityRoutes from "./routes/availability.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import customerRoutes from "./routes/customer.js";
import customerAuthRoutes from "./routes/customer.js";
import { ensureAdmin } from "./models/Admin.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "*" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customer", customerAuthRoutes);

// central error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await ensureAdmin();
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
});
