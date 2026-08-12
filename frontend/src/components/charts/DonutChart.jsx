import { useRef } from "react";
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
const GAP = 1.2;

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

  let acc = 0;
  const arcs = segments.map((s, i) => {
    const start = acc + GAP / 2;
    const end = acc + s.value - GAP / 2;
    acc += s.value;
    const len = ((end - start) / 100) * CIRC;
    return { ...s, d: arcPath(start, end), len, delay: 0.2 + i * 0.22 };
  });

  return (
    <div data-testid="allocation-donut-chart" className="flex h-full flex-col">
      <div ref={ref} className="mt-2 flex flex-1 flex-col items-center justify-center gap-10 lg:flex-row">
        <div className="relative">
          <svg width="220" height="220" viewBox="0 0 200 200">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--chart-grid)" strokeWidth="14" />
            {arcs.map((a) => (
              <path
                key={a.label}
                d={a.d}
                fill="none"
                stroke={a.color}
                strokeWidth="14"
                style={{
                  strokeDasharray: a.len,
                  strokeDashoffset: inView ? 0 : a.len,
                  transition: `stroke-dashoffset 1.2s ${a.delay}s cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold text-oki-text">
              100<span className="text-oki-gold">%</span>
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">Deployed</span>
          </div>
        </div>
        <ul className="w-full max-w-xs space-y-4">
          {segments.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              className="flex items-center justify-between border-b border-white/5 pb-3"
            >
              <span className="flex items-center gap-3 text-sm text-oki-muted">
                <span className="h-2 w-2" style={{ backgroundColor: s.color }} />
                {s.label}
              </span>
              <span className="font-mono text-sm text-oki-text">{s.value}%</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
