import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiSmartphone, FiArrowLeft, FiShield, FiCheckCircle } from "react-icons/fi";
import { api, setCustToken, getCustToken } from "../utils/api";
import logo from "../assets/images/logo.jpeg";

import heroImage from "../assets/images/room-suite.jpg";

const inputCls =
  "w-full border border-gold-pale bg-cream px-4 py-3.5 text-sm focus:outline-none focus:border-gold transition-colors";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("email"); // email | phone
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState(1); // 1 = identifier, 2 = otp
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (getCustToken()) return <Navigate to="/account" replace />;

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const d = await api.custRequestOtp(identifier.trim());
      setMsg(d.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setLoading(true);
    try {
      const d = await api.custRequestOtp(identifier.trim());
      setMsg(d.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const d = await api.custVerifyOtp(identifier.trim(), otp);
      setCustToken(d.token);
      navigate(location.state?.from || "/account", { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background image + overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-maroon-deep/85 to-charcoal/90" />
      </div>

      {/* Logo — top left, same lockup as main navbar */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-3"
      >
        <img src={logo} alt="The Mithila Heritage crest" className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full" />
        <span className="leading-tight hidden sm:block">
          <span className="block text-[10px] tracking-[0.3em] uppercase text-gold-light">
            The
          </span>
          <span className="block font-display text-lg tracking-wide text-cream">
            MITHILA HERITAGE
          </span>
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Brand header */}
        <div className="text-center mb-6">
          <p className="font-display text-3xl text-cream">The Mithila Heritage</p>
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mt-1">Guest Sign In</p>
        </div>

        <div className="border border-gold/40 bg-cream shadow-2xl">
          {/* decorative top strip */}
          <div className="h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold" />

          <div className="p-8 md:p-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="font-display text-2xl text-maroon-deep text-center mb-1">Welcome</p>
                  <p className="text-sm text-muted text-center mb-6">
                    Sign in with a one-time code — no password needed.
                  </p>

                  <div className="grid grid-cols-2 border border-gold-pale mb-6">
                    {[
                      ["email", "Email", FiMail],
                      ["phone", "Phone", FiSmartphone],
                    ].map(([m, label, Icon]) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setMode(m); setIdentifier(""); setError(""); }}
                        className={`flex items-center justify-center gap-2 py-3 text-xs tracking-widest uppercase transition-colors ${
                          mode === m ? "bg-maroon-deep text-cream" : "bg-white text-muted hover:text-maroon-deep"
                        }`}
                      >
                        <Icon size={13} /> {label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={sendOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        {mode === "email" ? "Email Address" : "Phone Number"}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold">
                          {mode === "email" ? <FiMail size={15} /> : <FiSmartphone size={15} />}
                        </span>
                        <input
                          required
                          autoFocus
                          type={mode === "email" ? "email" : "tel"}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className={`${inputCls} pl-11`}
                          placeholder={mode === "email" ? "you@example.com" : "10-digit mobile number"}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5"
                      >
                        {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-maroon-deep text-cream py-3.5 text-sm tracking-[0.15em] uppercase hover:bg-maroon transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>

                    <p className="text-[11px] text-muted text-center flex items-center justify-center gap-1.5">
                      <FiShield size={12} className="text-gold" /> First time? Your account is created automatically.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <button
                    onClick={() => { setStep(1); setOtp(""); setError(""); setMsg(""); }}
                    className="flex items-center gap-1.5 text-xs text-muted hover:text-maroon-deep mb-5"
                  >
                    <FiArrowLeft size={13} /> Back
                  </button>

                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/15 mb-3">
                      <FiCheckCircle className="text-gold" size={26} />
                    </div>
                    <p className="font-display text-xl text-maroon-deep">Enter Verification Code</p>
                    <p className="text-sm text-muted mt-1">
                      Sent to <strong className="text-charcoal">{identifier}</strong>
                    </p>
                  </div>

                  <form onSubmit={verify} className="space-y-5">
                    {msg && (
                      <p className="text-xs text-green-800 bg-green-50 border border-green-300 px-4 py-2.5 text-center">{msg}</p>
                    )}
                    <input
                      required
                      autoFocus
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className={`${inputCls} text-center text-3xl tracking-[14px] font-display`}
                      placeholder="······"
                    />

                    {error && (
                      <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full bg-maroon-deep text-cream py-3.5 text-sm tracking-[0.15em] uppercase hover:bg-maroon transition-colors disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify & Sign In"}
                    </button>

                    <button
                      type="button"
                      onClick={resend}
                      disabled={loading}
                      className="w-full text-xs text-gold hover:text-maroon-deep tracking-wide"
                    >
                      Resend Code
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-cream/70 hover:text-gold tracking-wide">
            ← Back to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
