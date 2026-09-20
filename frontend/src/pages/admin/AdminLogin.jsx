import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken, getToken } from "../../utils/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (getToken()) {
    navigate("/admin/bookings", { replace: true });
    return null;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      navigate("/admin/bookings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full border border-gold-pale bg-cream px-4 py-3 text-sm focus:outline-none focus:border-gold";

  return (
    <div className="min-h-screen bg-maroon-deep flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-cream border border-gold p-8 space-y-5">
        <div className="text-center mb-2">
          <p className="font-display text-2xl text-maroon-deep">The Mithila Heritage</p>
          <p className="text-[11px] tracking-[3px] uppercase text-gold mt-1">Admin Login</p>
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-2">Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs tracking-wider uppercase text-muted mb-2">Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        </div>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maroon-deep text-cream py-3 text-sm tracking-widest uppercase hover:bg-maroon-deep/90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
