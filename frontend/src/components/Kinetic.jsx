import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export function KineticLines({ lines, className = "", lineClassName = "", delay = 0, animate = true }) {
  const trigger = animate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once: true, margin: "-5%" } };
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.span key={i} className="block overflow-hidden" initial="hidden" {...trigger}>
          <motion.span
            className={`block ${lineClassName}`}
            variants={{
              hidden: { y: "110%" },
              visible: { y: "0%", transition: { duration: 1.1, ease: EASE, delay: delay + i * 0.13 } },
            }}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </div>
  );
}

export function Reveal({ children, className = "", delay = 0, y = 24 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTag({ index, label }) {
  return (
    <Reveal className="mb-10 flex items-center gap-4">
      <span className="font-mono text-[11px] tracking-[0.3em] text-oki-gold">{index}</span>
      <span className="h-px w-12 bg-oki-gold/40" />
      <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-oki-faint">{label}</span>
    </Reveal>
  );
}
