import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

export function requireCustomer(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Login required" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "customer") throw new Error();
    req.customer = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired — please login again" });
  }
}

// Optional: attaches req.customer if a valid customer token is present, else continues
export function optionalCustomer(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (payload.role === "customer") req.customer = payload;
    } catch { /* ignore */ }
  }
  next();
}

export { Customer };
