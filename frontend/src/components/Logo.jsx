export function LogoMark({ size = 30, className = "" }) {
  return (
    <svg
      width={size * 2}
      height={size}
      viewBox="0 0 120 60"
      fill="none"
      className={className}
      aria-label="OKI Inc. logo"
    >
      <defs>
        <linearGradient id="okiGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E3C888" />
          <stop offset="55%" stopColor="#C5A059" />
          <stop offset="100%" stopColor="#8A6D3B" />
        </linearGradient>
        <linearGradient id="okiCrimson" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#7A1414" />
        </linearGradient>
      </defs>
      <rect x="7" y="9" width="38" height="38" stroke="url(#okiGold)" strokeWidth="7" />
      <path d="M45 40 L54 49 L45 49 Z" fill="url(#okiGold)" />
      <path d="M84 9 L60 28 L84 47" stroke="url(#okiGold)" strokeWidth="8" fill="none" />
      <rect x="99" y="9" width="9" height="38" fill="url(#okiCrimson)" />
    </svg>
  );
}

export default function Logo({ size = 30, withWordmark = true, className = "" }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && (
        <span className="font-display text-sm font-semibold tracking-[0.35em] text-oki-text">
          OKI <span className="text-oki-gold">INC.</span>
        </span>
      )}
    </span>
  );
}
