import { motion } from "framer-motion";
import { useState } from "react";

const bands = [
  { label: "Controlling Stakes", value: 64, color: "#C5A059", text: "text-oki-black" },
  { label: "Significant Minority", value: 24, color: "#991B1B", text: "text-oki-text" },
  { label: "Passive Positions", value: 12, color: "var(--chart-n2)", text: "text-oki-muted" },
];

export default function ControlSpectrum() {
  const [active, setActive] = useState(null);

  return (
    <div data-testid="control-spectrum-chart">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Control Spectrum</p>
      <div className="group mt-8 flex h-20 w-full overflow-hidden border border-white/10">
        {bands.map((b, i) => (
          <motion.div
            key={b.label}
            data-testid={`spectrum-band-${i}`}
            className="relative flex cursor-default items-center justify-center"
            style={{ backgroundColor: b.color, transformOrigin: "center" }}
            initial={{ width: 0 }}
            whileInView={{ width: `${b.value}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.2 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scaleY: 1.18 }}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <span
              className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.15em] transition-opacity duration-300 md:text-xs ${b.text} ${
                active === null || active === i ? "opacity-100" : "opacity-30"
              }`}
            >
              {active === i ? `${b.label} · ${b.value}%` : `${b.value}%`}
            </span>
            <span
              className={`pointer-events-none absolute inset-0 border-2 transition-opacity duration-300 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
              style={{ borderColor: "var(--oki-gold)" }}
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
        {bands.map((b, i) => (
          <button
            key={b.label}
            data-testid={`spectrum-legend-${i}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              active === null || active === i ? "opacity-100" : "opacity-40"
            }`}
          >
            <span className="h-2 w-2" style={{ backgroundColor: b.color }} />
            <span className="text-xs uppercase tracking-[0.2em] text-oki-muted">{b.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-8 max-w-xl text-sm leading-relaxed text-oki-faint">
        Control is not a preference. It is the operating principle. OKI Inc. structures positions to govern outcomes, not to observe them.
      </p>
    </div>
  );
}
