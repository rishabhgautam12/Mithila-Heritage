// Ornamental divider echoing the Mithila peacock-eye motif seen across the brand references.
// Three-part: line — eye mark — line, with a small radiating sun/lotus mark centered.
export default function Divider({ tone = "gold", className = "" }) {
  const stroke = tone === "cream" ? "#F5E9C8" : "#C9A84C";

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <svg width="72" height="10" viewBox="0 0 72 10" className="opacity-80">
        <line x1="0" y1="5" x2="56" y2="5" stroke={stroke} strokeWidth="1" />
        <ellipse cx="62" cy="5" rx="6" ry="3" fill="none" stroke={stroke} strokeWidth="1" />
        <circle cx="62" cy="5" r="1.2" fill={stroke} />
      </svg>
      <svg width="18" height="18" viewBox="0 0 18 18">
        <g stroke={stroke} strokeWidth="1" fill="none">
          <circle cx="9" cy="9" r="2.4" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x1 = 9 + Math.cos(angle) * 4;
            const y1 = 9 + Math.sin(angle) * 4;
            const x2 = 9 + Math.cos(angle) * 8;
            const y2 = 9 + Math.sin(angle) * 8;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
      </svg>
      <svg width="72" height="10" viewBox="0 0 72 10" className="opacity-80">
        <line x1="16" y1="5" x2="72" y2="5" stroke={stroke} strokeWidth="1" />
        <ellipse cx="10" cy="5" rx="6" ry="3" fill="none" stroke={stroke} strokeWidth="1" />
        <circle cx="10" cy="5" r="1.2" fill={stroke} />
      </svg>
    </div>
  );
}
