import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiRotateCcw } from "react-icons/fi";
import { api } from "../../utils/api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function cellColor(available, total) {
  if (total === 0) return "bg-gray-100";
  const ratio = available / total;
  if (ratio === 0) return "bg-red-200 text-red-900";
  if (ratio <= 0.34) return "bg-amber-200 text-amber-900";
  return "bg-green-100 text-green-900";
}

// ── Ek room ka editable row (day panel me) ──────────────────
function RoomAdjust({ date, room, onSaved }) {
  const [adj, setAdj] = useState(room.adjustment);
  const [note, setNote] = useState(room.note);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setAdj(room.adjustment);
    setNote(room.note);
    setError("");
  }, [room]);

  const preview = Math.min(Math.max(room.totalUnits - room.booked + adj, 0), room.totalUnits);
  const dirty = adj !== room.adjustment || note !== room.note;

  const save = async (value = adj, noteValue = note) => {
    setSaving(true);
    setError("");
    try {
      await api.saveAdjustment({ date, roomSlug: room.slug, adjustment: value, note: noteValue });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-gold-pale/60 px-3 py-2.5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-maroon-deep">{room.name}</p>
        <span
          className={`text-[11px] px-2 py-0.5 border ${
            preview === 0
              ? "bg-red-100 text-red-800 border-red-300"
              : "bg-green-100 text-green-800 border-green-300"
          }`}
        >
          {preview === 0 ? "Full" : `${preview} khaali`}
        </span>
      </div>

      <div className="mt-2 h-1.5 bg-cream-dark">
        <div
          className={`h-full ${preview === 0 ? "bg-red-400" : "bg-gold"}`}
          style={{ width: `${((room.totalUnits - preview) / room.totalUnits) * 100}%` }}
        />
      </div>
      <p className="text-[11px] text-muted mt-1">
        {room.booked} booking(s) · total {room.totalUnits} rooms
        {room.adjustment !== 0 && (
          <span className="text-maroon-deep font-medium">
            {" "}· adjusted {room.adjustment > 0 ? `+${room.adjustment}` : room.adjustment}
          </span>
        )}
      </p>

      {/* stepper */}
      <div className="mt-2 flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-muted">Adjust:</span>
        <button
          onClick={() => setAdj((a) => Math.max(a - 1, -room.totalUnits))}
          className="border border-gold-pale bg-white p-1 hover:border-gold"
          title="1 room block karo"
        >
          <FiMinus size={12} />
        </button>
        <span className={`w-8 text-center text-sm font-medium ${adj > 0 ? "text-green-700" : adj < 0 ? "text-red-700" : "text-muted"}`}>
          {adj > 0 ? `+${adj}` : adj}
        </span>
        <button
          onClick={() => setAdj((a) => Math.min(a + 1, room.totalUnits))}
          className="border border-gold-pale bg-white p-1 hover:border-gold"
          title="1 room khaali karo"
        >
          <FiPlus size={12} />
        </button>
        {room.adjustment !== 0 && (
          <button
            onClick={() => { setAdj(0); setNote(""); save(0, ""); }}
            disabled={saving}
            className="ml-auto flex items-center gap-1 text-[11px] text-muted hover:text-maroon-deep"
            title="Adjustment hatao — automatic pe wapas"
          >
            <FiRotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {dirty && (
        <div className="mt-2 space-y-2">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (e.g. AC repair / early checkout)"
            className="w-full border border-gold-pale bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-gold"
          />
          <button
            onClick={() => save()}
            disabled={saving}
            className="w-full bg-maroon-deep text-cream py-1.5 text-xs tracking-widest uppercase hover:bg-maroon disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
      {!dirty && room.note && (
        <p className="text-[11px] text-muted mt-1.5 italic">“{room.note}”</p>
      )}
      {error && <p className="text-[11px] text-red-700 mt-1.5">{error}</p>}
    </div>
  );
}

export default function AdminAvailability() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    api
      .getAvailability(year, month)
      .then(setData)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    setSelectedDate(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const prev = () => (month === 1 ? (setMonth(12), setYear(year - 1)) : setMonth(month - 1));
  const next = () => (month === 12 ? (setMonth(1), setYear(year + 1)) : setMonth(month + 1));

  const firstDayOffset = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0=Sun
  const selected = data?.days.find((d) => d.date === selectedDate) || null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <button onClick={prev} className="border border-gold-pale bg-white p-2 hover:border-gold"><FiChevronLeft /></button>
        <p className="font-display text-xl text-maroon-deep w-48 text-center">{MONTHS[month - 1]} {year}</p>
        <button onClick={next} className="border border-gold-pale bg-white p-2 hover:border-gold"><FiChevronRight /></button>

        <div className="ml-auto flex gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-100 border border-green-300 inline-block" /> Available</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-200 border border-amber-300 inline-block" /> Almost Full</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-200 border border-red-300 inline-block" /> Fully Booked</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-maroon-deep inline-block" /> Adjusted</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 mb-4">{error}</p>}

      {!data ? (
        <p className="text-muted">Loading calendar...</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar grid */}
          <div className="border border-gold-pale bg-white p-4 flex-1 shadow-sm">
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-muted mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e${i}`} />)}
              {data.days.map((day) => {
                const dayNum = parseInt(day.date.slice(8));
                const isSelected = selectedDate === day.date;
                const hasAdj = day.rooms.some((r) => r.adjustment !== 0);
                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`relative aspect-square p-1 flex flex-col items-center justify-center text-sm border transition-all
                      ${cellColor(day.totalAvailable, day.totalUnits)}
                      ${isSelected ? "border-maroon-deep ring-1 ring-maroon-deep" : "border-transparent hover:border-gold"}`}
                  >
                    {hasAdj && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-maroon-deep" />}
                    <span className="font-medium">{dayNum}</span>
                    <span className="text-[10px] opacity-75">{day.totalAvailable}/{day.totalUnits}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day detail + edit panel */}
          <div className="border border-gold-pale bg-white p-5 lg:w-96 shrink-0 shadow-sm">
            {!selected ? (
              <p className="text-sm text-muted">
                Kisi date par click karein — wahan har room ka breakdown dikhega aur aap
                <strong> +/− se availability correct</strong> kar sakte hain (early checkout par
                room khaali karna ho ya maintenance ke liye block karna ho).
              </p>
            ) : (
              <>
                <p className="font-display text-xl text-maroon-deep mb-1">
                  {new Date(selected.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p className="text-[11px] text-muted mb-4">
                  <strong>+</strong> = room khaali karo · <strong>−</strong> = room block karo · booking se apne aap sync rehta hai
                </p>
                <div className="space-y-3">
                  {selected.rooms.map((r) => (
                    <RoomAdjust key={r.slug} date={selected.date} room={r} onSaved={load} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
