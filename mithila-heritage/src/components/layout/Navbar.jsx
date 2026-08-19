import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiPhone, FiMail, FiChevronDown, FiUser } from "react-icons/fi";
import logo from "../../assets/images/logo.jpeg";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Rooms", to: "/rooms" },
  { label: "Banquet Hall", to: "/banquet" },
  { label: "Restaurant", to: "/restaurant" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact" },
];

const MORE_LINKS = [
  { label: "Rooftop & Pool", to: "/rooftop" },
  { label: "Conference", to: "/conference" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Offers & Packages", to: "/offers" },
  { label: "Careers", to: "/careers" },
  { label: "Blog", to: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
    setMobileMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const solid = scrolled || menuOpen;
  const isMoreActive = MORE_LINKS.some((l) => l.to === pathname);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid ? "bg-cream/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      {/* Top contact strip — hides on scroll for a cleaner sticky bar */}
      <div
        className={`hidden md:flex justify-end items-center gap-6 px-8 text-[11px] tracking-wider overflow-hidden transition-all duration-500 ${
          solid ? "max-h-0 opacity-0" : "max-h-8 opacity-100 py-2 text-cream/90"
        }`}
      >
        <span className="flex items-center gap-2">
          <FiPhone size={12} /> +91 72958 48999
        </span>
        <span className="flex items-center gap-2">
          <FiMail size={12} /> info@mithilaheritage.in
        </span>
      </div>

      <nav className="flex items-center justify-between px-5 md:px-8 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="The Mithila Heritage crest"
            className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full"
          />
          <span className="leading-tight">
            <span
              className={`block text-[10px] tracking-[0.3em] uppercase ${
                solid ? "text-gold" : "text-gold-light"
              }`}
            >
              The
            </span>
            <span
              className={`block font-display text-lg tracking-wide ${
                solid ? "text-maroon-deep" : "text-cream"
              }`}
            >
              MITHILA HERITAGE
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-xs tracking-[0.15em] uppercase pb-1 border-b transition-colors duration-300 ${
                  isActive
                    ? "border-gold " + (solid ? "text-maroon-deep" : "text-cream")
                    : "border-transparent " +
                      (solid ? "text-charcoal/80 hover:text-maroon-deep" : "text-cream/85 hover:text-cream")
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex items-center gap-1 text-xs tracking-[0.15em] uppercase pb-1 border-b transition-colors duration-300 ${
                isMoreActive
                  ? "border-gold " + (solid ? "text-maroon-deep" : "text-cream")
                  : "border-transparent " +
                    (solid ? "text-charcoal/80 hover:text-maroon-deep" : "text-cream/85 hover:text-cream")
              }`}
            >
              More
              <FiChevronDown className={`transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`} size={12} />
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-3 w-56 bg-cream border border-gold-pale shadow-lg py-2"
                >
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block px-5 py-2.5 text-xs tracking-wide uppercase text-charcoal/80 hover:bg-cream-dark hover:text-maroon-deep transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to={localStorage.getItem("mh_cust_token") ? "/account" : "/login"}
            aria-label="My Account"
            className={`text-xl transition-colors ${solid ? "text-maroon-deep hover:text-gold" : "text-cream hover:text-gold"}`}
          >
            <FiUser />
          </Link>
          <Link
            to="/booking"
            className="hidden md:inline-flex px-6 py-2.5 bg-gold text-charcoal text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold-light transition-colors"
          >
            Reservation
          </Link>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className={`lg:hidden text-2xl ${solid ? "text-maroon-deep" : "text-cream"}`}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-cream border-t border-gold-pale max-h-[80vh] overflow-y-auto"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="py-3 text-sm tracking-wider uppercase text-charcoal/85 border-b border-cream-dark"
                >
                  {link.label}
                </NavLink>
              ))}

              <button
                onClick={() => setMobileMoreOpen((v) => !v)}
                className="flex items-center justify-between py-3 text-sm tracking-wider uppercase text-charcoal/85 border-b border-cream-dark"
              >
                More
                <FiChevronDown className={`transition-transform duration-300 ${mobileMoreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {mobileMoreOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-cream-dark"
                  >
                    {MORE_LINKS.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block pl-4 py-3 text-sm tracking-wider uppercase text-charcoal/70 border-b border-cream last:border-0"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <Link
                to="/booking"
                className="mt-4 text-center px-6 py-3 bg-gold text-charcoal text-xs tracking-[0.15em] uppercase font-medium"
              >
                Reservation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}