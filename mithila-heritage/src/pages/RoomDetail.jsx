import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiWifi, FiTv, FiWind, FiDroplet, FiClock, FiUsers,
  FiChevronLeft, FiChevronRight, FiCalendar, FiMinus, FiPlus, FiCamera,
} from "react-icons/fi";
import { rooms, getRoomBySlug } from "../data/rooms";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import Divider from "../components/ui/Divider";
import Button from "../components/ui/Button";

const amenityIcons = {
  "High-Speed Wi-Fi": FiWifi,
  "Smart TV": FiTv,
  "Air Conditioning": FiWind,
  "Luxury Bathroom": FiDroplet,
  "Room Service 24/7": FiClock,
  "King Size Bed": FiUsers,
  "Mini Bar": FiDroplet,
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function formatDate(d) {
  if (!d) return "Select date";
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export default function RoomDetail() {
  const { roomId } = useParams();
  const room = getRoomBySlug(roomId) || rooms[0];
  const navigate = useNavigate();

  const toISO = (d) => {
    if (!d) return "";
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [tab, setTab] = useState("overview");

  const cells = useMemo(() => buildCalendar(viewYear, viewMonth), [viewYear, viewMonth]);

  const changeMonth = (dir) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const clicked = new Date(viewYear, viewMonth, day);
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(clicked);
      setCheckOut(null);
    } else if (clicked > checkIn) {
      setCheckOut(clicked);
    } else {
      setCheckIn(clicked);
      setCheckOut(null);
    }
  };

  const isSelected = (day) => {
    if (!day) return { isIn: false, isOut: false, inRange: false };
    const d = new Date(viewYear, viewMonth, day).getTime();
    const isIn = checkIn && d === checkIn.getTime();
    const isOut = checkOut && d === checkOut.getTime();
    const inRange = checkIn && checkOut && d > checkIn.getTime() && d < checkOut.getTime();
    return { isIn, isOut, inRange };
  };

  const nights = checkIn && checkOut ? Math.round((checkOut - checkIn) / 86400000) : 0;
  const subtotal = nights * room.price;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const otherRooms = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  const whatsappMessage = encodeURIComponent(
    `Hi, I'd like to inquire about booking the ${room.name}${nights ? ` for ${nights} night(s)` : ""}.`
  );

  return (
    <div className="bg-cream pb-24">
      <PageHero image={room.img} kicker={room.tagline} title={room.name} height="min-h-[300px] md:min-h-[380px]" />
      <MithilaBorder />

      {/* Photo gallery */}
      <div className="max-w-8xl mx-auto px-4 md:px-10 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto md:row-span-2 overflow-hidden">
            <img src={room.img} alt={room.name} className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-maroon-deep/90 text-cream text-xs px-3 py-1.5">
              <FiCamera size={12} /> 360° View
            </span>
          </div>
          {room.gallery.slice(0, 2).map((img, i) => (
            <div key={i} className="relative aspect-[4/3] overflow-hidden">
              <img src={img} alt={`${room.name} view ${i + 1}`} className="w-full h-full object-cover" />
              {i === 1 && (
                <span className="absolute bottom-3 right-3 bg-maroon-deep/90 text-cream text-[11px] px-2.5 py-1">
                  +8 photos
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 md:px-10 mt-10 grid lg:grid-cols-3 gap-10">
        {/* Left: details */}
        <div className="lg:col-span-2">
          <span className="text-xs tracking-[0.3em] uppercase text-gold">{room.tagline}</span>
          <h2 className="font-display text-3xl md:text-4xl text-maroon-deep mt-2">{room.name}</h2>
          <p className="text-muted mt-2">
            From <span className="text-maroon-deep font-medium">₹{room.price.toLocaleString("en-IN")}</span> / night
            &nbsp;·&nbsp; Up to {room.occupancy} guests
          </p>
          <Divider className="mt-6 mb-2 justify-start" />

          {/* Tabs */}
          <div className="flex gap-8 mt-6 border-b border-gold-pale">
            {["overview", "amenities", "policies"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-sm tracking-wide capitalize border-b-2 transition-colors ${
                  tab === t ? "border-maroon-deep text-maroon-deep font-medium" : "border-transparent text-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="mt-8">
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: room.bedType },
                  { label: room.size },
                  { label: `${room.occupancy} Guests` },
                ].map((s) => (
                  <div key={s.label} className="bg-cream-dark border border-gold-pale px-4 py-3 text-center text-sm text-charcoal/80">
                    {s.label}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {room.amenities.map((a) => {
                  const Icon = amenityIcons[a] || FiWifi;
                  return (
                    <div key={a} className="flex items-center gap-3 border border-gold-pale px-4 py-3">
                      <Icon className="text-gold shrink-0" />
                      <span className="text-sm text-charcoal/80">{a}</span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-maroon-deep p-5 flex items-start gap-4 mb-8">
                <span className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <FiCamera className="text-gold-light" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-cream">Virtual 360° Room Tour</p>
                  <p className="text-cream/70 text-sm mt-1">Walk through the room before you arrive.</p>
                </div>
                <button className="text-xs tracking-wide uppercase border border-gold text-gold-light px-4 py-2 hover:bg-gold hover:text-charcoal transition-colors shrink-0">
                  Launch Tour
                </button>
              </div>

              <p className="text-muted leading-relaxed">{room.longDesc}</p>
            </div>
          )}

          {tab === "amenities" && (
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {room.features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-gold text-[10px]">◆</span>
                  <span className="text-muted text-sm">{f}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "policies" && (
            <div className="mt-8 space-y-4 text-muted text-sm leading-relaxed">
              <p><span className="text-charcoal font-medium">Check-in:</span> 2:00 PM onward</p>
              <p><span className="text-charcoal font-medium">Check-out:</span> 11:00 AM</p>
              <p><span className="text-charcoal font-medium">Cancellation:</span> Free cancellation up to 48 hours before check-in.</p>
              <p><span className="text-charcoal font-medium">ID Proof:</span> Valid government-issued photo ID required at check-in.</p>
              <p><span className="text-charcoal font-medium">Children:</span> Children of all ages are welcome.</p>
            </div>
          )}
        </div>

        {/* Right: booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 border border-gold-pale">
            <div className="bg-maroon-deep px-6 py-5">
              <h3 className="font-display text-xl text-cream">Book This Room</h3>
            </div>

            <div className="bg-cream p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="border border-gold-pale px-3 py-2.5">
                  <span className="block text-[10px] tracking-wider uppercase text-muted mb-1">Check-in</span>
                  <span className="flex items-center gap-1.5 text-sm text-charcoal">
                    <FiCalendar className="text-gold" size={13} /> {formatDate(checkIn)}
                  </span>
                </div>
                <div className="border border-gold-pale px-3 py-2.5">
                  <span className="block text-[10px] tracking-wider uppercase text-muted mb-1">Check-out</span>
                  <span className="flex items-center gap-1.5 text-sm text-charcoal">
                    <FiCalendar className="text-gold" size={13} /> {formatDate(checkOut)}
                  </span>
                </div>
              </div>

              {/* Calendar */}
              <div className="border border-gold-pale p-4 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="text-muted hover:text-maroon-deep">
                    <FiChevronLeft />
                  </button>
                  <span className="text-sm font-display text-maroon-deep">
                    {MONTH_NAMES[viewMonth]} {viewYear}
                  </span>
                  <button onClick={() => changeMonth(1)} aria-label="Next month" className="text-muted hover:text-maroon-deep">
                    <FiChevronRight />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted mb-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, i) => {
                    const { isIn, isOut, inRange } = isSelected(day);
                    return (
                      <button
                        key={i}
                        disabled={!day}
                        onClick={() => handleDateClick(day)}
                        className={`aspect-square text-xs flex items-center justify-center transition-colors ${
                          !day ? "" :
                          isIn || isOut ? "bg-maroon-deep text-cream font-medium" :
                          inRange ? "bg-gold-pale text-maroon-deep" :
                          "text-charcoal/80 hover:bg-cream-dark"
                        }`}
                      >
                        {day || ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guests */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="border border-gold-pale px-3 py-2.5">
                  <span className="block text-[10px] tracking-wider uppercase text-muted mb-1.5">Adults</span>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setAdults((v) => Math.max(1, v - 1))} className="text-maroon-deep"><FiMinus size={14} /></button>
                    <span className="text-sm">{adults}</span>
                    <button onClick={() => setAdults((v) => Math.min(6, v + 1))} className="text-maroon-deep"><FiPlus size={14} /></button>
                  </div>
                </div>
                <div className="border border-gold-pale px-3 py-2.5">
                  <span className="block text-[10px] tracking-wider uppercase text-muted mb-1.5">Children</span>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setChildren((v) => Math.max(0, v - 1))} className="text-maroon-deep"><FiMinus size={14} /></button>
                    <span className="text-sm">{children}</span>
                    <button onClick={() => setChildren((v) => Math.min(4, v + 1))} className="text-maroon-deep"><FiPlus size={14} /></button>
                  </div>
                </div>
              </div>

              {/* Price */}
              {nights > 0 ? (
                <div className="border-t border-gold-pale pt-4 mb-5 space-y-2 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>₹{room.price.toLocaleString("en-IN")} × {nights} night{nights > 1 ? "s" : ""}</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Taxes &amp; fees (12%)</span>
                    <span>₹{taxes.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-maroon-deep font-medium text-base pt-2 border-t border-gold-pale">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-xs mb-5">Select check-in and check-out dates to see pricing.</p>
              )}

              <Button
                onClick={() =>
                  navigate("/booking", {
                    state: {
                      roomSlug: room.slug,
                      checkIn: toISO(checkIn),
                      checkOut: toISO(checkOut),
                      guests: adults + children,
                    },
                  })
                }
                variant="solid"
                className="w-full justify-center mb-3"
                showArrow={false}
              >
                Confirm &amp; Book
              </Button>
              <a
                href={`https://wa.me/917295848999?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center border border-maroon-deep text-maroon-deep text-xs tracking-[0.15em] uppercase py-3.5 hover:bg-maroon-deep hover:text-cream transition-colors"
              >
                Send Inquiry via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Other rooms */}
      {otherRooms.length > 0 && (
        <div className="max-w-8xl mx-auto px-4 md:px-10 mt-24">
          <h3 className="font-display text-2xl md:text-3xl text-maroon-deep text-center">
            You May Also <span className="italic text-gold">Like</span>
          </h3>
          <Divider className="mt-5 mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {otherRooms.map((r, i) => (
              <motion.div
                key={r.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={`/rooms/${r.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={r.img}
                      alt={r.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="bg-cream-dark p-5">
                    <h4 className="font-display text-lg text-maroon-deep">{r.name}</h4>
                    <p className="text-muted text-sm mt-1">From ₹{r.price.toLocaleString("en-IN")} / night</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}