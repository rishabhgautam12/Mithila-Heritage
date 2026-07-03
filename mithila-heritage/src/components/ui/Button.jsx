import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const base =
  "inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm tracking-[0.15em] uppercase font-ui font-medium transition-colors duration-300";

const variants = {
  solid: "bg-gold text-charcoal hover:bg-gold-light",
  outline: "border border-cream/70 text-cream hover:bg-cream/10",
  outlineDark: "border border-maroon-deep text-maroon-deep hover:bg-maroon-deep hover:text-cream",
};

export default function Button({
  children,
  to,
  href,
  onClick,
  variant = "solid",
  showArrow = true,
  className = "",
  type = "button",
}) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {showArrow && <FiArrowRight aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
