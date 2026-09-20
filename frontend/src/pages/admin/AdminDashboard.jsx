import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLogIn, FiLogOut } from "react-icons/fi";
import { api } from "../../utils/api";
import { StatCard, StatusBadge, fmtDate, fmtMoney } from "../../components/admin/ui";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error)
    return <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">{error}</p>;
  if (!data) return <p className="text-muted">Loading dashboard...</p>;

  const occPct = data.occupancy.totalUnits
    ? Math.round((data.occupancy.occupied / data.occupancy.totalUnits) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={fmtMoney(data.revenue)} sub="All paid bookings" />
        <StatCard label="Total Bookings" value={data.total} sub={`${data.cancelled} cancelled`} />
        <StatCard label="Pending" value={data.pending} accent="text-amber-600" sub="Awaiting action" />
        <StatCard
          label="Occupancy Today"
          value={`${occPct}%`}
          accent={occPct >= 80 ? "text-red-600" : "text-green-700"}
          sub={`${data.occupancy.occupied} of ${data.occupancy.totalUnits} rooms`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="border border-gold-pale bg-white shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gold-pale">
            <FiLogIn className="text-green-700" />
            <p className="font-display text-lg text-maroon-deep">Today's Check-ins</p>
            <span className="ml-auto text-xs text-muted">{data.todayCheckIns.length}</span>
          </div>
          {data.todayCheckIns.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">Aaj koi check-in nahi hai.</p>
          ) : (
            data.todayCheckIns.map((b) => (
              <div key={b._id} className="px-5 py-3 border-b border-gold-pale/40 flex justify-between text-sm">
                <div>
                  <p className="font-medium text-maroon-deep">{b.name}</p>
                  <p className="text-xs text-muted">{b.roomName} · {b.guests} guest(s)</p>
                </div>
                <p className="text-xs text-muted">{b.phone}</p>
              </div>
            ))
          )}
        </div>

        <div className="border border-gold-pale bg-white shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gold-pale">
            <FiLogOut className="text-amber-600" />
            <p className="font-display text-lg text-maroon-deep">Today's Check-outs</p>
            <span className="ml-auto text-xs text-muted">{data.todayCheckOuts.length}</span>
          </div>
          {data.todayCheckOuts.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted">Aaj koi check-out nahi hai.</p>
          ) : (
            data.todayCheckOuts.map((b) => (
              <div key={b._id} className="px-5 py-3 border-b border-gold-pale/40 flex justify-between text-sm">
                <div>
                  <p className="font-medium text-maroon-deep">{b.name}</p>
                  <p className="text-xs text-muted">{b.roomName}</p>
                </div>
                <p className="text-xs text-muted">{b.phone}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="border border-gold-pale bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gold-pale">
          <p className="font-display text-lg text-maroon-deep">Recent Bookings</p>
          <Link to="/admin/bookings" className="text-xs text-gold hover:text-maroon-deep flex items-center gap-1">
            View all <FiArrowRight size={12} />
          </Link>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {data.recent.map((b) => (
              <tr key={b._id} className="border-b border-gold-pale/40">
                <td className="px-5 py-3 font-medium text-maroon-deep">{b.name}</td>
                <td className="px-5 py-3 text-muted">{b.roomName}</td>
                <td className="px-5 py-3 text-muted whitespace-nowrap">
                  {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">{fmtMoney(b.amount)}</td>
                <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
