import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export const pageAnim = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.5, ease: EASE },
};

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

export function Reveal({ children, className = "", delay = 0, y = 24, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
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

export function PhotoReveal({ src, alt, className = "", delay = 0 }) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      <motion.div
        role="img"
        aria-label={alt}
        className="h-full w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: EASE, delay }}
      />
    </motion.div>
  );
}
