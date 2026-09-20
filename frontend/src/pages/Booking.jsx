import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSend, FiCheckCircle, FiHome, FiUser, FiCalendar, FiMoon } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import Button from "../components/ui/Button";
import { rooms } from "../data/rooms";
import { api, getCustToken } from "../utils/api";

import heroImage from "../assets/images/room-suite.jpg";

const inputCls =
  "w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : "—";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state || {};
  const [submitted, setSubmitted] = useState(null); // holds confirmation summary
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    checkIn: prefill.checkIn || "",
    checkOut: prefill.checkOut || "",
    roomSlug: prefill.roomSlug || "",
    guests: prefill.guests || 2,
    specialRequests: "",
  });

  useEffect(() => {
    if (!getCustToken()) return;
    api
      .custMe()
      .then(({ profile }) =>
        setForm((f) => ({
          ...f,
          name: f.name || profile.name || "",
          email: f.email || profile.email || "",
          phone: f.phone || (profile.phone ? profile.phone : ""),
        }))
      )
      .catch(() => {});
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const today = new Date().toISOString().slice(0, 10);
  const selectedRoom = rooms.find((r) => r.slug === form.roomSlug);
  const nightsPreview =
    form.checkIn && form.checkOut
      ? Math.max(Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000), 0)
      : 0;
  const cameFromRoomPage = Boolean(prefill.roomSlug);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Create booking + Razorpay order on server
      const order = await api.createBooking({ ...form, guests: Number(form.guests) });

      // 2. Open Razorpay checkout
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Payment gateway load nahi hua — internet check karke retry karein");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "The Mithila Heritage",
        description: `${order.roomName} — ${form.checkIn} to ${form.checkOut}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#4a0e0e" },
        handler: async (response) => {
          // 3. Verify payment on server → booking confirmed
          try {
            await api.verifyPayment({
              bookingId: order.bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setSubmitted({
              bookingId: order.bookingId,
              paymentId: response.razorpay_payment_id,
              roomName: order.roomName,
              checkIn: order.checkIn || form.checkIn,
              checkOut: order.checkOut || form.checkOut,
              nights: order.nights || nightsPreview,
              amount: order.amount / 100,
              guestName: form.name,
              guests: form.guests,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment poora nahi hua. Booking confirm karne ke liye payment zaroori hai — dobara try karein.");
          },
        },
      });
      rzp.on("payment.failed", (resp) => {
        setLoading(false);
        setError(resp.error?.description || "Payment failed — please try again");
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // ── Success screen (MakeMyTrip-style confirmation) ─────────────────────
  if (submitted) {
    return (
      <>
        <PageHero image={heroImage} kicker="Reservation" title="Booking Confirmed" />
        <MithilaBorder />
        <section className="bg-cream py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="border border-gold bg-white shadow-lg"
            >
              {/* Success banner */}
              <div className="bg-maroon-deep px-8 py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4"
                >
                  <FiCheckCircle className="text-gold" size={34} />
                </motion.div>
                <p className="font-display text-3xl text-cream">Booking Confirmed!</p>
                <p className="text-cream/70 text-sm mt-2">
                  Booking ID: <span className="text-gold tracking-wider">{submitted.bookingId?.slice(-8).toUpperCase()}</span>
                </p>
              </div>

              {/* Details */}
              <div className="p-8 space-y-5">
                <p className="text-sm text-muted text-center">
                  Thank you, <strong className="text-maroon-deep">{submitted.guestName}</strong>! Your payment was
                  successful and a confirmation email has been sent to you.
                </p>

                <div className="border border-gold-pale bg-cream-dark p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted flex items-center gap-2"><FiHome size={13} /> Room</span>
                    <span className="font-medium text-maroon-deep">{submitted.roomName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted flex items-center gap-2"><FiCalendar size={13} /> Check-in</span>
                    <span className="font-medium">{fmtDate(submitted.checkIn)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted flex items-center gap-2"><FiCalendar size={13} /> Check-out</span>
                    <span className="font-medium">{fmtDate(submitted.checkOut)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted flex items-center gap-2"><FiMoon size={13} /> Duration</span>
                    <span className="font-medium">{submitted.nights} night{submitted.nights > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted flex items-center gap-2"><FiUser size={13} /> Guests</span>
                    <span className="font-medium">{submitted.guests}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gold-pale">
                    <span className="text-sm uppercase tracking-wider text-maroon-deep font-medium">Amount Paid</span>
                    <span className="font-display text-2xl text-maroon-deep">₹{submitted.amount?.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-2 bg-maroon-deep text-cream py-3 text-xs tracking-[0.15em] uppercase hover:bg-maroon transition-colors"
                  >
                    <FiHome size={14} /> Back to Home
                  </Link>
                  <Link
                    to="/account"
                    className="flex items-center justify-center gap-2 border border-gold text-maroon-deep py-3 text-xs tracking-[0.15em] uppercase hover:bg-gold/10 transition-colors"
                  >
                    View My Bookings
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  // ── Booking form ────────────────────────────────────────────────────
  return (
    <>
      <PageHero image={heroImage} kicker="Reservation" title="Book Your Stay" />
      <MithilaBorder />

      <section className="bg-cream py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          {/* Summary card — shown when arriving from a Room Detail page */}
          {cameFromRoomPage && selectedRoom && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 border border-gold bg-cream-dark overflow-hidden flex flex-col sm:flex-row"
            >
              <img src={selectedRoom.img} alt={selectedRoom.name} className="w-full sm:w-40 h-32 sm:h-auto object-cover" />
              <div className="p-5 flex-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-1">Your Selection</p>
                <p className="font-display text-xl text-maroon-deep">{selectedRoom.name}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-muted">
                  <span>{fmtDate(form.checkIn)} → {fmtDate(form.checkOut)}</span>
                  {nightsPreview > 0 && <span>{nightsPreview} night{nightsPreview > 1 ? "s" : ""}</span>}
                  <span>{form.guests} guest{Number(form.guests) > 1 ? "s" : ""}</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Full Name</label>
                <input required type="text" value={form.name} onChange={set("name")} className={inputCls} placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Phone Number</label>
                <input required type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+91" />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-muted mb-2">Email Address</label>
              <input required type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.com" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Check-in</label>
                <input required type="date" min={today} value={form.checkIn} onChange={set("checkIn")} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Check-out</label>
                <input required type="date" min={form.checkIn || today} value={form.checkOut} onChange={set("checkOut")} className={inputCls} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Room Type</label>
                <select required value={form.roomSlug} onChange={set("roomSlug")} className={inputCls}>
                  <option value="" disabled>Select a room</option>
                  {rooms.map((r) => (
                    <option key={r.slug} value={r.slug}>{r.name} — ₹{r.price.toLocaleString("en-IN")}/night</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-muted mb-2">Guests</label>
                <input required type="number" min="1" value={form.guests} onChange={set("guests")} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider uppercase text-muted mb-2">Special Requests (Optional)</label>
              <textarea rows={4} value={form.specialRequests} onChange={set("specialRequests")} className={`${inputCls} resize-none`} placeholder="Any preferences we should know about..." />
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
            )}

            <Button type="submit" variant="solid" showArrow={false} disabled={loading} className="w-full justify-center">
              <span className="flex items-center gap-2">
                {loading ? "Processing..." : "Proceed to Payment"} <FiSend size={14} />
              </span>
            </Button>
          </motion.form>
        </div>
      </section>
    </>
  );
}
