import { motion } from "framer-motion";

const points = [
  { year: "2025", v: 100 },
  { year: "2026", v: 118 },
  { year: "2027", v: 141 },
  { year: "2028", v: 172 },
  { year: "2029", v: 208 },
  { year: "2030", v: 255 },
  { year: "2031", v: 312 },
];

const W = 720, H = 300, PAD = 40;
const maxV = 320, minV = 90;

const x = (i) => PAD + (i * (W - PAD * 2)) / (points.length - 1);
const y = (v) => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2);

const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.v)}`).join(" ");
const areaPath = `${linePath} L${x(points.length - 1)},${H - PAD} L${PAD},${H - PAD} Z`;

export default function GrowthLine() {
  return (
    <div data-testid="asset-growth-chart" className="flex h-full flex-col">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Asset Growth Trajectory</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold">Projected · Indexed 100</p>
      </div>
      <div className="mt-6 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#991B1B" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={PAD} x2={W - PAD} y1={PAD + (H - PAD * 2) * f} y2={PAD + (H - PAD * 2) * f} stroke="var(--chart-grid)" />
          ))}
          <motion.path
            d={areaPath} fill="url(#growthFill)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, delay: 1 }}
          />
          <motion.path
            d={linePath} fill="none" stroke="#C5A059" strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          />
          {points.map((p, i) => (
            <g key={p.year}>
              <motion.circle
                cx={x(i)} cy={y(p.v)} r="4" fill="#050505" stroke="#C5A059" strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.25, duration: 0.4 }}
              />
              <text x={x(i)} y={H - PAD + 22} textAnchor="middle" fontSize="11" className="fill-oki-faint font-mono">{p.year}</text>
            </g>
          ))}
          <motion.text
            x={x(points.length - 1)} y={y(312) - 14} textAnchor="end" fontSize="14"
            className="fill-oki-gold font-mono"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.2 }}
          >
            312
          </motion.text>
        </svg>
      </div>
    </div>
  );
}
