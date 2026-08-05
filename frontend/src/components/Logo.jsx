export function LogoMark({ size = 30, className = "" }) {
  return (
    <svg
      width={size * 2}
      height={size}
      viewBox="0 0 120 60"
      fill="none"
      className={className}
      role="img"
      aria-label="OKI Inc. logo mark"
    >
      <defs>
        <linearGradient id="okiMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--logo-1)" }} />
          <stop offset="55%" style={{ stopColor: "var(--logo-2)" }} />
          <stop offset="100%" style={{ stopColor: "var(--logo-3)" }} />
        </linearGradient>
      </defs>
      <rect x="7" y="9" width="38" height="38" stroke="url(#okiMark)" strokeWidth="7" />
      <path d="M45 40 L54 49 L45 49 Z" fill="url(#okiMark)" />
      <path d="M84 9 L60 28 L84 47" stroke="url(#okiMark)" strokeWidth="8" fill="none" />
      <rect x="99" y="9" width="9" height="38" fill="url(#okiMark)" />
    </svg>
  );
}

export function LogoWordmark({ className = "", gold = false }) {
  return (
    <span
      className={`font-display text-sm font-semibold tracking-[0.35em] ${
        gold ? "text-oki-gold" : "text-oki-text"
      } ${className}`}
    >
      OKI<span className="text-oki-gold">_</span>INC.
    </span>
  );
}

export default function Logo({ size = 30, withWordmark = true, className = "" }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      {withWordmark && <LogoWordmark />}
    </span>
  );
}
