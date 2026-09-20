import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit2, FiLogOut, FiCheck, FiX } from "react-icons/fi";
import PageHero from "../components/ui/PageHero";
import MithilaBorder from "../components/ui/MithilaBorder";
import { api, getCustToken, clearCustToken } from "../utils/api";

import heroImage from "../assets/images/room-suite.jpg";

const inputCls =
  "w-full border border-gold-pale bg-cream px-4 py-2.5 text-sm focus:outline-none focus:border-gold";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-300",
  confirmed: "bg-green-50 text-green-800 border-green-300",
  cancelled: "bg-red-50 text-red-700 border-red-300",
};

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  // name edit
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  // email/phone change
  const [changing, setChanging] = useState(null); // "email" | "phone" | null
  const [newValue, setNewValue] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api
      .custMe()
      .then(setData)
      .catch((err) => {
        setError(err.message);
        if (!getCustToken()) navigate("/login");
      });

  useEffect(() => {
    if (!getCustToken()) {
      navigate("/login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    clearCustToken();
    navigate("/");
  };

  const saveName = async () => {
    if (!nameInput.trim()) return;
    setBusy(true);
    try {
      await api.custUpdateName(nameInput.trim());
      setEditingName(false);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const requestChange = async () => {
    setBusy(true);
    setMsg("");
    try {
      const payload = changing === "email" ? { newEmail: newValue } : { newPhone: newValue };
      const d = await api.custRequestUpdate(payload);
      setMsg(d.message);
      setOtpStep(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmChange = async () => {
    setBusy(true);
    try {
      await api.custConfirmUpdate(otp);
      setChanging(null);
      setOtpStep(false);
      setOtp("");
      setNewValue("");
      setMsg("");
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!data)
    return (
      <>
        <PageHero image={heroImage} kicker="Guest Account" title="My Profile" />
        <MithilaBorder />
        <section className="bg-cream py-20 text-center text-muted">
          {error || "Loading..."}
        </section>
      </>
    );

  const upcoming = data.bookings.filter(
    (b) => b.status !== "cancelled" && new Date(b.checkOut) >= new Date()
  );
  const past = data.bookings.filter(
    (b) => b.status === "cancelled" || new Date(b.checkOut) < new Date()
  );

  return (
    <>
      <PageHero image={heroImage} kicker="Guest Account" title="My Profile" />
      <MithilaBorder />

      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          {/* ── Profile card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gold bg-cream-dark p-6 md:p-8"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className={`${inputCls} w-56`}
                      placeholder="Your name"
                    />
                    <button onClick={saveName} disabled={busy} className="text-green-700 hover:text-green-800"><FiCheck size={18} /></button>
                    <button onClick={() => setEditingName(false)} className="text-muted hover:text-red-600"><FiX size={18} /></button>
                  </div>
                ) : (
                  <p className="font-display text-2xl text-maroon-deep flex items-center gap-2">
                    {data.profile.name || "Guest"}
                    <button
                      onClick={() => { setNameInput(data.profile.name || ""); setEditingName(true); }}
                      className="text-muted hover:text-gold"
                      title="Edit name"
                    >
                      <FiEdit2 size={14} />
                    </button>
                  </p>
                )}
                <p className="text-xs text-muted mt-1">Guest since {fmt(data.profile.createdAt)}</p>
              </div>
              <button onClick={logout} className="flex items-center gap-2 text-sm text-muted hover:text-maroon-deep">
                <FiLogOut size={14} /> Logout
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                ["email", "Email", data.profile.email],
                ["phone", "Phone", data.profile.phone ? `+91 ${data.profile.phone}` : null],
              ].map(([key, label, value]) => (
                <div key={key} className="border border-gold-pale bg-cream px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
                    <p className="truncate">{value || <span className="text-muted">Not added</span>}</p>
                  </div>
                  <button
                    onClick={() => { setChanging(key); setNewValue(""); setOtpStep(false); setOtp(""); setMsg(""); }}
                    className="text-xs text-gold hover:text-maroon-deep shrink-0"
                  >
                    {value ? "Change" : "Add"}
                  </button>
                </div>
              ))}
            </div>

            {/* change email/phone inline panel */}
            {changing && (
              <div className="mt-4 border border-gold-pale bg-cream p-4 space-y-3">
                {!otpStep ? (
                  <>
                    <label className="block text-[11px] uppercase tracking-wider text-muted">
                      New {changing === "email" ? "email address" : "phone number"} (OTP isi par jaayega)
                    </label>
                    <input
                      type={changing === "email" ? "email" : "tel"}
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className={inputCls}
                      placeholder={changing === "email" ? "new@example.com" : "10-digit mobile number"}
                    />
                    <div className="flex gap-2">
                      <button onClick={requestChange} disabled={busy || !newValue} className="bg-maroon-deep text-cream px-4 py-2 text-xs tracking-widest uppercase hover:bg-maroon disabled:opacity-60">
                        {busy ? "Sending..." : "Send OTP"}
                      </button>
                      <button onClick={() => setChanging(null)} className="text-xs text-muted hover:text-maroon-deep px-2">Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    {msg && <p className="text-xs text-green-800 bg-green-50 border border-green-300 px-3 py-2">{msg}</p>}
                    <input
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className={`${inputCls} text-center text-xl tracking-[8px] font-display`}
                      placeholder="······"
                    />
                    <div className="flex gap-2">
                      <button onClick={confirmChange} disabled={busy || otp.length !== 6} className="bg-maroon-deep text-cream px-4 py-2 text-xs tracking-widest uppercase hover:bg-maroon disabled:opacity-60">
                        {busy ? "Verifying..." : "Verify & Update"}
                      </button>
                      <button onClick={() => { setOtpStep(false); setOtp(""); }} className="text-xs text-muted hover:text-maroon-deep px-2">Back</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>

          {/* ── Bookings ── */}
          {[
            ["Upcoming Stays", upcoming, "Aapki koi upcoming booking nahi hai."],
            ["Past & Cancelled", past, "Abhi tak koi purani booking nahi."],
          ].map(([title, list, empty]) => (
            <div key={title}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-xl text-maroon-deep">{title}</h2>
                {title === "Upcoming Stays" && (
                  <Link to="/booking" className="text-xs tracking-widest uppercase text-gold hover:text-maroon-deep">
                    + Book a Stay
                  </Link>
                )}
              </div>
              {list.length === 0 ? (
                <p className="text-sm text-muted border border-gold-pale bg-white px-4 py-5">{empty}</p>
              ) : (
                <div className="space-y-3">
                  {list.map((b) => (
                    <div key={b._id} className="border border-gold-pale bg-white p-4 flex flex-wrap items-center gap-3">
                      <div className="flex-1 min-w-[200px]">
                        <p className="font-medium text-maroon-deep">{b.roomName}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {fmt(b.checkIn)} → {fmt(b.checkOut)} · {b.nights} night(s) · {b.guests} guest(s)
                        </p>
                        {b.status === "cancelled" && b.cancelReason && (
                          <p className="text-xs text-red-600 mt-1">Reason: {b.cancelReason}</p>
                        )}
                      </div>
                      <p className="text-sm font-medium">₹{b.amount?.toLocaleString("en-IN")}</p>
                      <span className={`text-[11px] uppercase tracking-wider px-2.5 py-1 border ${b.paymentStatus === "paid" ? "bg-green-50 text-green-800 border-green-300" : "bg-gray-50 text-gray-500 border-gray-300"}`}>
                        {b.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </span>
                      <span className={`text-[11px] uppercase tracking-wider px-2.5 py-1 border ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
