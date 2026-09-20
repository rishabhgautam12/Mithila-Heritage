import { Link } from "react-router-dom";
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from "react-icons/fi";
import MithilaBorder from "../ui/MithilaBorder";
import logo from "../../assets/images/logo.jpeg";

const explore = [
  { label: "Rooms", to: "/rooms" },
  { label: "Restaurant", to: "/restaurant" },
  { label: "Banquet Hall", to: "/banquet" },
  { label: "Conference", to: "/conference" },
  { label: "Gallery", to: "/gallery" },
];

const guest = [
  { label: "About Us", to: "/about" },
  { label: "Offers & Packages", to: "/offers" },
  { label: "Careers", to: "/careers" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/90">
      <div className="max-w-8xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="The Mithila Heritage crest" className="w-12 h-12 object-contain rounded-full" />
            <span className="font-display text-xl text-cream">The Mithila Heritage</span>
          </div>
          <p className="mt-4 text-sm text-cream/70 leading-relaxed max-w-xs">
            Where legacy meets luxury — a destination rooted in the art and warmth of the Mithila region.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-cream/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <FiInstagram size={15} />
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-cream/30 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
              <FiFacebook size={15} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs tracking-[0.25em] uppercase text-gold-light mb-5">Explore</h3>
          <ul className="space-y-3">
            {explore.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-cream/75 hover:text-gold-light transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs tracking-[0.25em] uppercase text-gold-light mb-5">Guest Info</h3>
          <ul className="space-y-3">
            {guest.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-cream/75 hover:text-gold-light transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs tracking-[0.25em] uppercase text-gold-light mb-5">Reach Us</h3>
          <ul className="space-y-4 text-sm text-cream/75">
            <li className="flex gap-3"><FiMapPin className="shrink-0 mt-0.5 text-gold" /> Mithila Road, Bihar, India</li>
            <li className="flex gap-3"><FiPhone className="shrink-0 mt-0.5 text-gold" /> +91 72958 48999</li>
            <li className="flex gap-3"><FiMail className="shrink-0 mt-0.5 text-gold" /> info@mithilaheritage.in</li>
          </ul>
        </div>
      </div>

      <MithilaBorder className="opacity-60" />

      <div className="max-w-8xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-cream/50">
        <span>© {new Date().getFullYear()} The Mithila Heritage. All rights reserved.</span>
        <span>Crafted with care for timeless hospitality.</span>
      </div>
    </footer>
  );
}