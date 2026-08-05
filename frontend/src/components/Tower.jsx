const blocks = [
  { x: 10, y: 500, w: 220, h: 140 },
  { x: 36, y: 392, w: 168, h: 108 },
  { x: 57, y: 292, w: 126, h: 100 },
  { x: 75, y: 212, w: 90, h: 80 },
  { x: 91, y: 92, w: 58, h: 120 },
  { x: 103, y: 62, w: 34, h: 30 },
];

function WindowLines({ x, y, w, h }) {
  const lines = [];
  for (let lx = x + 7; lx < x + w - 4; lx += 9) {
    lines.push(
      <line key={lx} x1={lx} y1={y + 6} x2={lx} y2={y + h - 6} stroke="rgba(245,245,245,0.07)" strokeWidth="1.5" />
    );
  }
  return <>{lines}</>;
}

export default function Tower({ className = "" }) {
  return (
    <svg viewBox="0 0 240 640" className={className} aria-label="OKI tower" data-testid="hero-tower">
      <defs>
        <linearGradient id="towerBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="50%" stopColor="#101010" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="towerFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050505" stopOpacity="0" />
          <stop offset="100%" stopColor="#050505" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="towerCrimson" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C62828" />
          <stop offset="100%" stopColor="#7A1414" />
        </linearGradient>
      </defs>

      <line x1="120" y1="4" x2="120" y2="62" stroke="#C5A059" strokeWidth="2.5" />
      <circle cx="120" cy="6" r="3" fill="#C62828">
        <animate attributeName="opacity" values="1;0.25;1" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="url(#towerBody)" stroke="rgba(197,160,89,0.3)" strokeWidth="1" />
          <WindowLines {...b} />
          <line x1={b.x + 1} y1={b.y} x2={b.x + 1} y2={b.y + b.h} stroke="rgba(227,200,136,0.5)" strokeWidth="1.5" />
        </g>
      ))}

      <rect x="117" y="92" width="3" height="120" fill="url(#towerCrimson)" opacity="0.85" />
      <rect x="10" y="500" width="220" height="4" fill="#C5A059" opacity="0.55" />

      <rect x="0" y="540" width="240" height="100" fill="url(#towerFade)" />
    </svg>
  );
}
