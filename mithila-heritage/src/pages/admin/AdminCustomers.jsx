import { useEffect, useState, useCallback } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { api } from "../../utils/api";
import { Modal, InfoRow, StatusBadge, PayBadge, StatCard, fmtDate, fmtMoney } from "../../components/admin/ui";
import BookingForm from "../../components/admin/BookingForm";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null); // { profile, bookings }
  const [rebooking, setRebooking] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getCustomers(search);
      setCustomers(data.customers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openProfile = async (email) => {
    try {
      setProfile(await api.getCustomer(email));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="relative mb-6 max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gold-pale bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gold"
        />
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-4">{error}</p>}

      <div className="border border-gold-pale bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream-dark text-left text-xs uppercase tracking-wider text-muted">
              {["Customer", "Contact", "Stays", "Nights", "Total Spent", "Last Booking", "Upcoming"].map((h) => (
                <th key={h} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted">No customers yet</td></tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c.email}
                  onClick={() => openProfile(c.email)}
                  className="border-t border-gold-pale/50 hover:bg-cream/60 cursor-pointer"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="font-medium text-maroon-deep">{c.name}</p>
                    {c.totalBookings >= 3 && (
                      <span className="text-[10px] uppercase tracking-wider text-gold">★ Repeat Guest</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p>{c.phone}</p>
                    <p className="text-xs text-muted">{c.email}</p>
                  </td>
                  <td className="px-4 py-3">{c.confirmedStays}<span className="text-xs text-muted">/{c.totalBookings}</span></td>
                  <td className="px-4 py-3">{c.totalNights}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{fmtMoney(c.totalSpent)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">{fmtDate(c.lastBooking)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {c.nextCheckIn ? (
                      <span className="text-xs text-green-800 bg-green-50 border border-green-300 px-2 py-1">
                        {fmtDate(c.nextCheckIn)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Customer profile modal ─────────────────────────── */}
      {profile && !rebooking && (
        <Modal title={`Guest Profile — ${profile.profile.name}`} onClose={() => setProfile(null)} wide>
          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatCard label="Total Stays" value={profile.profile.totalBookings} />
            <StatCard label="Total Nights" value={profile.profile.totalNights} />
            <StatCard label="Lifetime Spent" value={fmtMoney(profile.profile.totalSpent)} />
          </div>

          <InfoRow label="Phone" value={profile.profile.phone} />
          <InfoRow label="Email" value={profile.profile.email} />
          <InfoRow label="Guest since" value={fmtDate(profile.profile.memberSince)} />

          <div className="flex items-center justify-between mt-6 mb-2">
            <p className="font-display text-lg text-maroon-deep">Booking History</p>
            <button
              onClick={() => setRebooking(profile)}
              className="flex items-center gap-2 bg-maroon-deep text-cream px-4 py-2 text-sm hover:bg-maroon"
            >
              <FiPlus size={13} /> New Booking
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto border border-gold-pale/60">
            {profile.bookings.map((b) => (
              <div key={b._id} className="px-4 py-3 border-b border-gold-pale/40 flex items-center gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-maroon-deep">{b.roomName}</p>
                  <p className="text-xs text-muted">
                    {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.nights}N · {fmtMoney(b.amount)}
                  </p>
                  {b.cancelReason && <p className="text-xs text-red-600 mt-0.5">Reason: {b.cancelReason}</p>}
                </div>
                <PayBadge paid={b.paymentStatus === "paid"} id={b.razorpayPaymentId} />
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── Rebook from profile ────────────────────────────── */}
      {rebooking && (
        <BookingForm
          prefill={{
            name: rebooking.profile.name,
            phone: rebooking.profile.phone,
            email: rebooking.profile.email,
            roomSlug: rebooking.bookings[0]?.roomSlug || "",
            guests: rebooking.bookings[0]?.guests || 2,
          }}
          onClose={() => setRebooking(null)}
          onCreated={() => {
            setRebooking(null);
            setProfile(null);
            load();
          }}
        />
      )}
    </div>
  );
}
