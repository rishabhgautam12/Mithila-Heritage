import { FiX } from "react-icons/fi";

export const inputCls =
  "w-full border border-gold-pale bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors";

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const fmtMoney = (n) => "₹" + (n || 0).toLocaleString("en-IN");

export function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-50 text-amber-800 border-amber-300",
    confirmed: "bg-green-50 text-green-800 border-green-300",
    cancelled: "bg-red-50 text-red-700 border-red-300",
  };
  return (
    <span className={`inline-block text-[11px] uppercase tracking-wider px-2.5 py-1 border ${styles[status]}`}>
      {status}
    </span>
  );
}

export function PayBadge({ paid, id }) {
  return (
    <span
      title={id || ""}
      className={`inline-block text-[11px] uppercase tracking-wider px-2.5 py-1 border ${
        paid ? "bg-green-50 text-green-800 border-green-300" : "bg-gray-50 text-gray-500 border-gray-300"
      }`}
    >
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}

export function StatCard({ label, value, sub, accent = "text-maroon-deep" }) {
  return (
    <div className="border border-gold-pale bg-white px-5 py-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-[2px] text-muted">{label}</p>
      <p className={`font-display text-3xl mt-1.5 ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/60 flex items-start justify-center overflow-y-auto p-4 md:p-10"
      onClick={onClose}
    >
      <div
        className={`bg-cream border border-gold w-full ${wide ? "max-w-3xl" : "max-w-lg"} shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-maroon-deep">
          <p className="font-display text-xl text-cream">{title}</p>
          <button onClick={onClose} className="text-cream/70 hover:text-cream"><FiX size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] tracking-wider uppercase text-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-gold-pale/50 text-sm">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-right font-medium text-charcoal">{value}</span>
    </div>
  );
}
