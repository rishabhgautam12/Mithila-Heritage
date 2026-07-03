// Ornamental repeating gold band used as a transition strip between
// alternating cream/maroon sections. Pure SVG pattern — no images.
export default function MithilaBorder({ flip = false, className = "" }) {
  const patternId = flip ? "mithila-band-flip" : "mithila-band";

  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={`block w-full h-6 md:h-7 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#C9A84C" strokeWidth="1.4">
            <path d="M60 30 C 52 18, 68 18, 60 6 C 52 18, 68 18, 60 30 Z" />
            <circle cx="60" cy="30" r="3" />
            <path d="M60 30 L 50 22 M60 30 L 70 22 M60 30 L 46 30 M60 30 L 74 30 M60 30 L 50 38 M60 30 L 70 38" />
            <path d="M14 30 q 10 -10 22 0 q -10 10 -22 0 z" />
            <circle cx="18" cy="30" r="0.9" fill="#C9A84C" />
            <path d="M106 30 q -10 -10 -22 0 q 10 10 22 0 z" />
            <circle cx="102" cy="30" r="0.9" fill="#C9A84C" />
            <path d="M2 46 q 8 -10 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0" />
            <path d="M2 14 q 8 10 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0 t 16 0" />
            <g fill="#C9A84C" stroke="none">
              <circle cx="60" cy="52" r="1" />
              <circle cx="60" cy="8" r="1" />
              <circle cx="30" cy="30" r="0.8" />
              <circle cx="90" cy="30" r="0.8" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect
        width="1200"
        height="60"
        fill={`url(#${patternId})`}
        className={flip ? "rotate-180 origin-center" : ""}
      />
    </svg>
  );
}