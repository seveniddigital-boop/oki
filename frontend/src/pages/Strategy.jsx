import { KineticLines, Reveal, SectionTag } from "@/components/Kinetic";
import ControlSpectrum from "@/components/charts/ControlSpectrum";

const phases = [
  {
    n: "01",
    title: "Identify",
    subtitle: "High-conviction global assets",
    text: "We scan across continents and cycles for assets whose value is structural, not cyclical. Conviction is built slowly and acted on completely. When OKI moves, the analysis is already finished.",
  },
  {
    n: "02",
    title: "Structure",
    subtitle: "Delaware holding architecture",
    text: "Every acquisition is domiciled within a Delaware C-Corporation framework — liability-insulated, treaty-aware, and jurisdiction-optimized. Structure is not administration. Structure is defense.",
  },
  {
    n: "03",
    title: "Hold",
    subtitle: "Long-duration control orientation",
    text: "We hold with a generational horizon. No exit mandates, no fund-life pressure, no quarterly theater. Time is the one advantage that cannot be replicated — and we own it.",
  },
];

const principles = [
  { title: "International Reach", text: "Assets across four continents and twelve jurisdictions, governed from a single corporate center of gravity." },
  { title: "Liability Insulation", text: "Compartmentalized holding structures ensure no single position can compromise the whole." },
  { title: "Generational Ownership", text: "Capital disciplined to outlast its stewards. Decisions are measured in decades." },
];

export default function Strategy() {
  return (
    <main data-testid="strategy-page" className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-12">
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
      </section>

      <section className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1517241034903-9a4c3ab12f00?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRhcmslMjBnZW9tZXRyaWMlMjBsdXh1cnl8ZW58MHx8fHwxNzg1ODExMzU3fDA&ixlib=rb-4.1.0&q=85)",
            backgroundSize: "cover",
          }}
        />
        <div className="relative ml-2 border-l border-white/10 md:ml-6">
          {phases.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.12} className="relative pb-24 pl-10 last:pb-0 md:pl-16">
              <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rotate-45 border border-oki-gold bg-oki-black" />
              <p className="font-mono text-sm tracking-[0.3em] text-oki-gold">{p.n}</p>
              <h3 className="mt-4 font-display text-4xl font-medium tracking-tighter text-oki-text md:text-6xl">{p.title}</h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-faint">{p.subtitle}</p>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-oki-muted md:text-base">{p.text}</p>
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

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <SectionTag index="S/03" label="Position of Control" />
        <Reveal>
          <ControlSpectrum />
        </Reveal>
      </section>
    </main>
  );
}
