import { motion } from "framer-motion";

const segments = [
  { label: "Equity Holdings", value: 42, color: "#C5A059" },
  { label: "Strategic Real Assets", value: 28, color: "#991B1B" },
  { label: "IP & Intangibles", value: 18, color: "rgba(237,237,237,0.5)" },
  { label: "Private Credit & Special Situations", value: 12, color: "rgba(237,237,237,0.15)" },
];

export default function DonutChart() {
  let acc = 0;
  return (
    <div data-testid="allocation-donut-chart" className="flex h-full flex-col">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Global Asset Allocation</p>
      <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-10 lg:flex-row">
        <div className="relative">
          <svg width="220" height="220" viewBox="0 0 200 200" className="-rotate-90">
            <circle cx="100" cy="100" r="84" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
            {segments.map((s, i) => {
              const start = acc;
              acc += s.value;
              return (
                <motion.circle
                  key={s.label}
                  cx="100" cy="100" r="84" fill="none"
                  stroke={s.color} strokeWidth="14"
                  pathLength={100}
                  strokeDasharray="100 100"
                  initial={{ strokeDashoffset: 100 }}
                  whileInView={{ strokeDashoffset: 100 - s.value }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, delay: 0.2 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                  transform={`rotate(${start * 3.6} 100 100)`}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl font-semibold text-oki-text">100<span className="text-oki-gold">%</span></span>
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
