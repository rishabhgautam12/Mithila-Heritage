import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import { api, clearToken } from "../../utils/api";
import { Field, inputCls } from "../../components/admin/ui";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState("");
  const [step, setStep] = useState(1); // 1 = form, 2 = OTP
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getMe().then((d) => setCurrentEmail(d.email)).catch(() => {});
  }, []);

  const requestOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!newEmail && !newPassword) return setError("Kuch to change karein — email ya password");
    if (newPassword && newPassword.length < 8) return setError("Password kam se kam 8 characters ka ho");
    if (newPassword && newPassword !== confirmPassword) return setError("Passwords match nahi kar rahe");
    setLoading(true);
    try {
      const d = await api.requestCredentialChange();
      setMsg(d.message);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmChange = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.confirmCredentialChange({
        otp,
        newEmail: newEmail || undefined,
        newPassword: newPassword || undefined,
      });
      alert("Credentials update ho gaye — ab naye credentials se login karein.");
      clearToken();
      navigate("/admin/login");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="border border-gold-pale bg-white shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FiShield className="text-gold" />
          <p className="font-display text-lg text-maroon-deep">Admin Account</p>
        </div>
        <p className="text-sm text-muted">
          Current login email: <strong className="text-charcoal">{currentEmail || "..."}</strong>
        </p>
      </div>

      <div className="border border-gold-pale bg-white shadow-sm p-6">
        <p className="font-display text-lg text-maroon-deep mb-1">Change Email / Password</p>
        <p className="text-xs text-muted mb-5">
          Security ke liye ek 6-digit verification code aapke <strong>current email</strong> ({currentEmail}) par bheja
          jaayega. Jo field change nahi karna, use khaali chhod dein.
        </p>

        {step === 1 ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <Field label="New Email (optional)">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={`${inputCls} pl-9`} placeholder="naya-email@example.com" />
              </div>
            </Field>
            <Field label="New Password (optional, min 8 chars)">
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputCls} pl-9`} placeholder="••••••••" />
              </div>
            </Field>
            {newPassword && (
              <Field label="Confirm New Password">
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} placeholder="••••••••" />
              </Field>
            )}
            {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-maroon-deep text-cream px-5 py-2.5 text-sm tracking-wide hover:bg-maroon disabled:opacity-60"
            >
              {loading ? "Sending code..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmChange} className="space-y-4">
            {msg && <p className="text-sm text-green-800 bg-green-50 border border-green-300 px-4 py-2.5">{msg}</p>}
            <Field label="6-digit Verification Code">
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className={`${inputCls} text-center text-2xl tracking-[10px] font-display`}
                placeholder="······"
              />
            </Field>
            {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="bg-maroon-deep text-cream px-5 py-2.5 text-sm tracking-wide hover:bg-maroon disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Update"}
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(""); setError(""); setMsg(""); }}
                className="border border-gold-pale px-5 py-2.5 text-sm text-muted hover:border-gold"
              >
                Back
              </button>
            </div>
            <p className="text-xs text-muted">Code 10 minute mein expire ho jaata hai. Nahi mila? Back karke dobara bhejein (spam folder bhi check karein).</p>
          </form>
        )}
      </div>
    </div>
  );
}
