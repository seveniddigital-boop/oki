import { motion } from "framer-motion";
import { KineticLines, Reveal, SectionTag, PhotoReveal, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const phases = [
  {
    n: "01",
    title: "Identify",
    subtitle: "High-conviction global assets",
    text: "We search across markets and eras for assets whose value is structural, not cyclical. Conviction is built slowly and acted on completely. When OKI moves, the analysis is already finished.",
    img: "https://images.unsplash.com/photo-1725362364605-21960b69d981?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHw0fHxhZXJpYWwlMjBjaXR5JTIwbmlnaHR8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    n: "02",
    title: "Structure",
    subtitle: "Delaware holding architecture",
    text: "Every acquisition is domiciled within a Delaware C-Corporation framework — liability-insulated, treaty-aware, and jurisdiction-optimized. Structure is not administration. Structure is defense.",
    img: "https://images.unsplash.com/photo-1565626424178-c699f6601afd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8MTc4NTg5MjMyNnww&ixlib=rb-4.1.0&q=85",
  },
  {
    n: "03",
    title: "Hold",
    subtitle: "Long-duration control orientation",
    text: "We hold with a generational horizon. No exit mandates, no fund-life pressure, no quarterly theater. Time is the one advantage that cannot be replicated.",
    img: "https://images.unsplash.com/photo-1565043534426-8a67ac8671e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxsb25nJTIwZXhwb3N1cmUlMjBza3lzY3JhcGVyJTIwbmlnaHR8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
];

const principles = [
  { title: "International Reach", text: "Positions on four continents, directed from a single corporate center of gravity." },
  { title: "Liability Insulation", text: "Compartmentalized holding structures ensure no single position can compromise the whole." },
  { title: "Generational Ownership", text: "Capital disciplined to outlast its stewards. Decisions are measured in decades." },
];

export default function Strategy() {
  return (
    <motion.main data-testid="strategy-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <LazyBg
          src="https://images.unsplash.com/photo-1725362364605-21960b69d981?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Aerial view of a global city at night"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionTag index="S/01" label="Strategy" />
          <KineticLines
            lines={["Ownership is", "the Strategy."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 max-w-xl">
            <p className="text-sm leading-relaxed text-oki-muted">
              Three movements. One doctrine. The OKI approach converts conviction into structure, and structure into permanence.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <LazyBg
          src="https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?q=80&w=1200&auto=format&fit=crop"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
        />
        <div className="relative ml-2 border-l border-white/10 md:ml-6">
          {phases.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.12} className="relative pb-24 pl-10 last:pb-0 md:pl-16">
              <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rotate-45 border border-oki-gold bg-oki-black" />
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <p className="font-mono text-sm tracking-[0.3em] text-oki-gold">{p.n}</p>
                  <h3 className="mt-4 font-display text-4xl font-medium tracking-tighter text-oki-text md:text-6xl">{p.title}</h3>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-faint">{p.subtitle}</p>
                  <p className="mt-6 max-w-2xl text-sm leading-relaxed text-oki-muted md:text-base">{p.text}</p>
                </div>
                <PhotoReveal
                  src={p.img}
                  alt={`${p.title} — ${p.subtitle}`}
                  delay={0.2 + i * 0.1}
                  className="h-48 w-full shrink-0 border border-white/10 lg:w-80"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-oki-surface">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="S/02" label="Operating Principles" />
          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.12} className="card-glow bg-oki-black p-10 transition-colors duration-500 hover:bg-oki-elevated md:p-12">
                <h3 className="font-display text-xl font-medium tracking-tight text-oki-gold">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-oki-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
