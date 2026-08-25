import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { KineticLines, Reveal, SectionTag, PhotoReveal, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const phases = [
  {
    n: "01",
    title: "Watch",
    subtitle: "Continuous market observation",
    text: "Bitcoin, the major indices, and the companies that move them — tracked every session, without interruption. The corporation that sees everything early can afford to move deliberately. Attention is the raw material of every OKI decision.",
    img: "https://images.unsplash.com/photo-1725362364605-21960b69d981?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHw0fHxhZXJpYWwlMjBjaXR5JTIwbmlnaHR8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    n: "02",
    title: "Study",
    subtitle: "Structure before sentiment",
    text: "Liquidity cycles, network fundamentals, earnings quality, sovereign policy. The analysis is finished before the opinion is voiced. OKI does not react to markets — it reads them.",
    img: "https://images.unsplash.com/photo-1565626424178-c699f6601afd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8MTc4NTg5MjMyNnww&ixlib=rb-4.1.0&q=85",
  },
  {
    n: "03",
    title: "Publish",
    subtitle: "An open window",
    text: "The same live window OKI reads internally is published on this site — free, ungated, and continuously updated. A young corporation builds trust the old way: by showing its work.",
    img: "https://images.unsplash.com/photo-1565043534426-8a67ac8671e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwxfHxsb25nJTIwZXhwb3N1cmUlMjBza3lzY3JhcGVyJTIwbmlnaHR8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
];

const principles = [
  { title: "Global Coverage", text: "Markets across every timezone, read from a single desk in New York." },
  { title: "Published Intelligence", text: "The market view behind OKI's decisions is published openly. The data is public; the discipline is the edge." },
  { title: "Generational Horizon", text: "A young corporation, compounding knowledge for decades. The climb is the strategy." },
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
            lines={["Attention is", "the Strategy."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 max-w-xl">
            <p className="text-sm leading-relaxed text-oki-muted">
              Three disciplines. One direction. The OKI method converts observation into understanding, and understanding into acquisition-grade conviction.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        {phases.map((p, i) => (
          <Reveal key={p.n} className="group relative border-t border-white/10 py-16 first:border-t-0 first:pt-0 md:py-24">
            <span
              aria-hidden="true"
              className="text-outline pointer-events-none absolute right-0 top-8 select-none font-display text-[7rem] font-semibold leading-none transition-opacity duration-700 group-hover:opacity-50 md:top-12 md:text-[13rem]"
            >
              {p.n}
            </span>
            <div className={`relative grid grid-cols-1 gap-10 lg:grid-cols-12 ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
              <div className="lg:col-span-7 lg:[direction:ltr]">
                <p className="font-mono text-sm tracking-[0.3em] text-oki-gold">{p.n}</p>
                <h3 className="mt-4 font-display text-4xl font-medium tracking-tighter text-oki-text md:text-7xl">{p.title}</h3>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-faint">{p.subtitle}</p>
                <p className="mt-8 max-w-2xl text-sm leading-relaxed text-oki-muted md:text-base">{p.text}</p>
              </div>
              <div className="lg:col-span-5 lg:[direction:ltr]">
                <PhotoReveal
                  src={p.img}
                  alt={`${p.title} — ${p.subtitle}`}
                  delay={0.15}
                  className="h-56 w-full border border-white/10 md:h-80"
                />
              </div>
            </div>
          </Reveal>
        ))}
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
          <Reveal delay={0.3} className="mt-16">
            <Link
              to="/markets"
              data-testid="strategy-open-markets-link"
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold"
            >
              See the method live — open the board
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
}
