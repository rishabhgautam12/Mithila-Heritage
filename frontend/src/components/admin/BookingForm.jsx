import { useState } from "react";
import { api } from "../../utils/api";
import { Modal, Field, inputCls } from "./ui";
import { rooms } from "../../data/rooms";

export default function BookingForm({ prefill, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: prefill?.name || "",
    phone: prefill?.phone || "",
    email: prefill?.email || "",
    roomSlug: prefill?.roomSlug || "",
    checkIn: "",
    checkOut: "",
    guests: prefill?.guests || 2,
    specialRequests: "",
    markPaid: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const room = rooms.find((r) => r.slug === form.roomSlug);
  const nights =
    form.checkIn && form.checkOut
      ? Math.max(Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000), 0)
      : 0;
  const estAmount = room && nights > 0 ? room.price * nights : 0;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.adminCreateBooking({ ...form, guests: Number(form.guests) });
      onCreated();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      title={prefill ? `Rebook — ${prefill.name}` : "New Booking (Walk-in / Phone)"}
      onClose={onClose}
      wide
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Guest Name">
            <input required value={form.name} onChange={set("name")} className={inputCls} />
          </Field>
          <Field label="Phone">
            <input required value={form.phone} onChange={set("phone")} className={inputCls} />
          </Field>
        </div>
        <Field label="Email">
          <input required type="email" value={form.email} onChange={set("email")} className={inputCls} />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Check-in">
            <input required type="date" value={form.checkIn} onChange={set("checkIn")} className={inputCls} />
          </Field>
          <Field label="Check-out">
            <input required type="date" min={form.checkIn} value={form.checkOut} onChange={set("checkOut")} className={inputCls} />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Room Type">
            <select required value={form.roomSlug} onChange={set("roomSlug")} className={inputCls}>
              <option value="" disabled>Select a room</option>
              {rooms.map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name} — ₹{r.price.toLocaleString("en-IN")}/night
                </option>
              ))}
            </select>
          </Field>
          <Field label="Guests">
            <input required type="number" min="1" value={form.guests} onChange={set("guests")} className={inputCls} />
          </Field>
        </div>
        <Field label="Special Requests">
          <textarea rows={2} value={form.specialRequests} onChange={set("specialRequests")} className={`${inputCls} resize-none`} />
        </Field>

        <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
          <input type="checkbox" checked={form.markPaid} onChange={set("markPaid")} className="accent-maroon-deep" />
          Payment received (cash / UPI at hotel) — mark as <strong>Paid</strong>
        </label>
        <p className="text-xs text-muted -mt-2">
          Unchecked rahe to booking <strong>confirmed but unpaid</strong> banegi (pay at hotel).
        </p>

        {estAmount > 0 && (
          <p className="text-sm bg-cream-dark border border-gold-pale px-4 py-2.5">
            {nights} night(s) × ₹{room.price.toLocaleString("en-IN")} ={" "}
            <strong className="text-maroon-deep">₹{estAmount.toLocaleString("en-IN")}</strong>
          </p>
        )}

        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="bg-maroon-deep text-cream px-5 py-2.5 text-sm tracking-wide hover:bg-maroon disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Confirmed Booking"}
          </button>
          <button type="button" onClick={onClose} className="border border-gold-pale px-5 py-2.5 text-sm text-muted hover:border-gold">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
