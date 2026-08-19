import { useEffect, useState, useCallback } from "react";
import { FiRefreshCw, FiTrash2, FiSearch, FiPlus } from "react-icons/fi";
import { api } from "../../utils/api";
import {
  Modal, Field, InfoRow, StatusBadge, PayBadge, inputCls, fmtDate, fmtMoney,
} from "../../components/admin/ui";
import BookingForm from "../../components/admin/BookingForm";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({ status: "", search: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);   // booking detail modal
  const [cancelling, setCancelling] = useState(null); // booking being cancelled
  const [cancelReason, setCancelReason] = useState("");
  const [creating, setCreating] = useState(false);   // new booking modal
  const [rebookFrom, setRebookFrom] = useState(null); // prefill data

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getBookings(filters);
      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status, reason = "") => {
    try {
      await api.updateStatus(id, status, reason);
      setSelected(null);
      setCancelling(null);
      setCancelReason("");
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this booking permanently? (History se bhi hat jaayegi — normally Cancel use karein)")) return;
    try {
      await api.deleteBooking(id);
      setSelected(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input
            placeholder="Search name / phone / email"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="border border-gold-pale bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gold w-64"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="border border-gold-pale bg-white px-3 py-2 text-sm focus:outline-none focus:border-gold"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={load} className="flex items-center gap-2 text-sm text-muted hover:text-maroon-deep px-2">
          <FiRefreshCw className={loading ? "animate-spin" : ""} size={14} /> Refresh
        </button>
        <button
          onClick={() => { setRebookFrom(null); setCreating(true); }}
          className="ml-auto flex items-center gap-2 bg-maroon-deep text-cream px-4 py-2 text-sm tracking-wide hover:bg-maroon"
        >
          <FiPlus size={14} /> New Booking
        </button>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-4">{error}</p>}

      <div className="border border-gold-pale bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-dark text-left text-xs uppercase tracking-wider text-muted">
              {["Guest", "Room", "Dates", "Amount", "Payment", "Status", "Source"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">Loading...</td></tr>
            ) : bookings.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">No bookings found</td></tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b._id}
                  onClick={() => setSelected(b)}
                  className="border-t border-gold-pale/50 hover:bg-cream/60 cursor-pointer"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium text-maroon-deep">{b.name}</p>
                    <p className="text-xs text-muted">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{b.roomName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                    <p className="text-xs text-muted">{b.nights}N · {b.guests} guest(s)</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{fmtMoney(b.amount)}</td>
                  <td className="px-4 py-3"><PayBadge paid={b.paymentStatus === "paid"} id={b.razorpayPaymentId} /></td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-xs text-muted capitalize">{b.createdVia || "website"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Booking detail modal ───────────────────────────── */}
      {selected && !cancelling && (
        <Modal title={`Booking — ${selected.name}`} onClose={() => setSelected(null)}>
          <div className="mb-4 flex gap-2">
            <StatusBadge status={selected.status} />
            <PayBadge paid={selected.paymentStatus === "paid"} id={selected.razorpayPaymentId} />
          </div>

          <InfoRow label="Guest" value={selected.name} />
          <InfoRow label="Phone" value={selected.phone} />
          <InfoRow label="Email" value={selected.email} />
          <InfoRow label="Room" value={selected.roomName} />
          <InfoRow label="Stay" value={`${fmtDate(selected.checkIn)} → ${fmtDate(selected.checkOut)} (${selected.nights} nights)`} />
          <InfoRow label="Guests" value={selected.guests} />
          <InfoRow label="Amount" value={fmtMoney(selected.amount)} />
          {selected.razorpayPaymentId && <InfoRow label="Payment ID" value={selected.razorpayPaymentId} />}
          <InfoRow label="Booked on" value={fmtDate(selected.createdAt)} />
          <InfoRow label="Source" value={selected.createdVia === "admin" ? "Admin / Walk-in" : "Website"} />
          {selected.specialRequests && <InfoRow label="Requests" value={selected.specialRequests} />}
          {selected.status === "cancelled" && selected.cancelReason && (
            <InfoRow label="Cancel reason" value={selected.cancelReason} />
          )}

          <div className="flex flex-wrap gap-2 mt-6">
            {selected.status !== "confirmed" && (
              <button
                onClick={() => changeStatus(selected._id, "confirmed")}
                className="bg-green-700 text-white px-4 py-2 text-sm hover:bg-green-800"
              >
                Confirm
              </button>
            )}
            {selected.status !== "cancelled" && (
              <button
                onClick={() => setCancelling(selected)}
                className="border border-red-300 text-red-700 px-4 py-2 text-sm hover:bg-red-50"
              >
                Cancel Booking
              </button>
            )}
            <button
              onClick={() => {
                setRebookFrom(selected);
                setSelected(null);
                setCreating(true);
              }}
              className="border border-gold text-maroon-deep px-4 py-2 text-sm hover:bg-gold/10"
            >
              Rebook Guest
            </button>
            <button
              onClick={() => remove(selected._id)}
              className="ml-auto text-muted hover:text-red-600 px-2"
              title="Delete permanently"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </Modal>
      )}

      {/* ── Cancel with reason ─────────────────────────────── */}
      {cancelling && (
        <Modal title="Cancel Booking" onClose={() => { setCancelling(null); setCancelReason(""); }}>
          <p className="text-sm text-muted mb-4">
            <strong className="text-maroon-deep">{cancelling.name}</strong> — {cancelling.roomName},{" "}
            {fmtDate(cancelling.checkIn)} → {fmtDate(cancelling.checkOut)}
          </p>
          <Field label="Reason (guest ko record ke liye)">
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className={`${inputCls} resize-none`}
              placeholder="e.g. Guest requested cancellation / payment refunded via Razorpay dashboard"
            />
          </Field>
          {cancelling.paymentStatus === "paid" && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 mt-3">
              Is booking ka payment ho chuka hai ({fmtMoney(cancelling.amount)}). Refund Razorpay
              dashboard se process karein — yahan cancel karne se sirf room free hota hai.
            </p>
          )}
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => changeStatus(cancelling._id, "cancelled", cancelReason)}
              className="bg-red-700 text-white px-4 py-2 text-sm hover:bg-red-800"
            >
              Confirm Cancellation
            </button>
            <button
              onClick={() => { setCancelling(null); setCancelReason(""); }}
              className="border border-gold-pale px-4 py-2 text-sm text-muted hover:border-gold"
            >
              Back
            </button>
          </div>
        </Modal>
      )}

      {/* ── New / Rebooking modal ──────────────────────────── */}
      {creating && (
        <BookingForm
          prefill={rebookFrom}
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); load(); }}
        />
      )}
    </div>
  );
}
