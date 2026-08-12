import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const segments = [
  { label: "Equity Holdings", value: 36, color: "#C5A059" },
  { label: "Strategic Real Assets", value: 24, color: "#991B1B" },
  { label: "Digital Assets & Crypto", value: 16, color: "#E3C888" },
  { label: "IP & Intangibles", value: 14, color: "var(--chart-n1)" },
  { label: "Private Credit & Special Situations", value: 10, color: "var(--chart-n2)" },
];

const CX = 100, CY = 100, R = 84;
const CIRC = 2 * Math.PI * R;
const GAP = 1.4;

function polar(angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
}

function arcPath(startPct, endPct) {
  const [x1, y1] = polar((startPct / 100) * 360);
  const [x2, y2] = polar((endPct / 100) * 360);
  const large = endPct - startPct > 50 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export default function DonutChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [active, setActive] = useState(null);

  let acc = 0;
  const arcs = segments.map((s, i) => {
    const start = acc + GAP / 2;
    const end = acc + s.value - GAP / 2;
    acc += s.value;
    const len = ((end - start) / 100) * CIRC;
    return { ...s, d: arcPath(start, end), len, delay: 0.2 + i * 0.22, i };
  });

  return (
    <div data-testid="allocation-donut-chart" className="flex h-full flex-col">
      <div ref={ref} className="mt-2 flex flex-1 flex-col items-center justify-center gap-10 lg:flex-row">
        <div className="relative">
          <svg width="220" height="220" viewBox="0 0 200 200">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--chart-grid)" strokeWidth="10" />
            {arcs.map((a) => (
              <path
                key={a.label}
                d={a.d}
                fill="none"
                stroke={a.color}
                strokeWidth={active === null ? 12 : active === a.i ? 17 : 9}
                style={{
                  strokeDasharray: a.len,
                  strokeDashoffset: inView ? 0 : a.len,
                  opacity: active === null || active === a.i ? 1 : 0.3,
                  transition: `stroke-dashoffset 1.2s ${a.delay}s cubic-bezier(0.22, 1, 0.36, 1), stroke-width 0.3s ease, opacity 0.3s ease`,
                }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold text-oki-text">
              {active !== null ? segments[active].value : 100}
              <span className="text-oki-gold">%</span>
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">
              {active !== null ? segments[active].label : "Deployed"}
            </span>
          </div>
        </div>
        <ul className="w-full max-w-sm space-y-1">
          {segments.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`flex cursor-default items-center justify-between gap-4 border-b px-2 py-2.5 transition-colors duration-300 ${
                active === i ? "border-oki-gold/40 bg-oki-gold/5" : "border-white/5"
              }`}
            >
              <span className={`flex min-w-0 flex-1 items-center gap-3 text-xs leading-snug md:text-sm ${active === i ? "text-oki-text" : "text-oki-muted"}`}>
                <span className="h-2 w-2 shrink-0" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="shrink-0 font-mono text-xs text-oki-text md:text-sm">{s.value}%</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
