import { motion } from "framer-motion";

const bands = [
  { label: "Controlling Stakes", value: 64, color: "#C5A059", text: "text-oki-black" },
  { label: "Significant Minority", value: 24, color: "#991B1B", text: "text-oki-text" },
  { label: "Passive Positions", value: 12, color: "var(--chart-n2)", text: "text-oki-muted" },
];

export default function ControlSpectrum() {
  return (
    <div data-testid="control-spectrum-chart">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Control Spectrum</p>
      <div className="mt-8 flex h-16 w-full overflow-hidden border border-white/10">
        {bands.map((b, i) => (
          <motion.div
            key={b.label}
            className="flex items-center justify-center"
            style={{ backgroundColor: b.color }}
            initial={{ width: 0 }}
            whileInView={{ width: `${b.value}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.2 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={`font-mono text-xs ${b.text}`}>{b.value}%</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
        {bands.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="h-2 w-2" style={{ backgroundColor: b.color }} />
            <span className="text-xs uppercase tracking-[0.2em] text-oki-muted">{b.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-xl text-sm leading-relaxed text-oki-faint">
        Control is not a preference. It is the operating principle. OKI Inc. structures positions to govern outcomes, not to observe them.
      </p>
    </div>
  );
}
