import { motion } from "framer-motion";

const regions = [
  { label: "North America", value: 38, color: "#C5A059" },
  { label: "Europe", value: 27, color: "#991B1B" },
  { label: "Asia-Pacific", value: 22, color: "rgba(237,237,237,0.5)" },
  { label: "Emerging Markets", value: 13, color: "rgba(237,237,237,0.15)" },
];

const H = 220;
const BASE = 250;

export default function GeoBars() {
  return (
    <div data-testid="geographic-control-chart" className="flex h-full flex-col">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Geographic Control</p>
      <div className="mt-8 flex flex-1 items-end">
        <svg viewBox="0 0 480 290" className="w-full">
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="0" x2="480" y1={BASE - H * f} y2={BASE - H * f} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          {regions.map((r, i) => {
            const h = (r.value / 40) * H;
            const x = 30 + i * 115;
            return (
              <g key={r.label}>
                <motion.rect
                  x={x} width="56" rx="0"
                  fill={r.color}
                  initial={{ height: 0, y: BASE }}
                  whileInView={{ height: h, y: BASE - h }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.text
                  x={x + 28} y={BASE - h - 12}
                  textAnchor="middle"
                  fill="#F5F5F5"
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="15"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + i * 0.15 }}
                >
                  {`${r.value}%`}
                </motion.text>
                <text x={x + 28} y={BASE + 22} textAnchor="middle" fontSize="10" className="fill-oki-faint font-mono uppercase" letterSpacing="1">
                  {r.label.split(" ")[0]}
                </text>
                <text x={x + 28} y={BASE + 36} textAnchor="middle" fontSize="10" className="fill-oki-faint font-mono uppercase" letterSpacing="1">
                  {r.label.split(" ").slice(1).join(" ")}
                </text>
              </g>
            );
          })}
          <line x1="0" x2="480" y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
