import { NavLink, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiGrid, FiUsers, FiCalendar, FiSettings, FiLogOut } from "react-icons/fi";
import { getToken, clearToken } from "../../utils/api";

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiHome },
  { to: "/admin/bookings", label: "Bookings", icon: FiGrid },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/availability", label: "Availability", icon: FiCalendar },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  if (!getToken()) return <Navigate to="/admin/login" replace />;

  const current = NAV.find((n) => location.pathname.startsWith(n.to));

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3 text-sm tracking-wide transition-colors ${
      isActive
        ? "bg-gold/15 text-gold border-r-2 border-gold"
        : "text-cream/70 hover:text-cream hover:bg-white/5"
    }`;

  const logout = () => {
    clearToken();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-60 shrink-0 bg-maroon-deep flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="font-display text-xl text-cream">Mithila Heritage</p>
          <p className="text-[11px] tracking-[3px] uppercase text-gold mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkCls}>
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-4 text-sm text-cream/70 hover:text-cream border-t border-white/10"
        >
          <FiLogOut size={15} /> Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gold-pale px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-10">
          <p className="font-display text-2xl text-maroon-deep">{current?.label || "Admin"}</p>
          <p className="text-xs text-muted hidden sm:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </header>
        <main className="flex-1 p-6 md:p-10 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
