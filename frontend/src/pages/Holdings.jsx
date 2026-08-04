import { KineticLines, Reveal, SectionTag } from "@/components/Kinetic";
import DonutChart from "@/components/charts/DonutChart";
import GeoBars from "@/components/charts/GeoBars";
import GrowthLine from "@/components/charts/GrowthLine";

const assetClasses = [
  {
    title: "Equity Holdings",
    desc: "Controlling and anchor positions in operating companies across North America, Europe, and Asia-Pacific. Acquired to be held, not traded.",
    tag: "42% of Portfolio",
  },
  {
    title: "Strategic Real Assets",
    desc: "Income-critical infrastructure, industrial land, and energy-adjacent real property in supply-constrained corridors.",
    tag: "28% of Portfolio",
  },
  {
    title: "Intellectual Property & Intangibles",
    desc: "Patent estates, proprietary data, and brand portfolios with durable pricing power and compounding royalty streams.",
    tag: "18% of Portfolio",
  },
  {
    title: "Private Credit & Special Situations",
    desc: "Senior-secured direct lending and dislocation-driven acquisitions where structure, not sentiment, determines return.",
    tag: "12% of Portfolio",
  },
];

export default function Holdings() {
  return (
    <main data-testid="holdings-page" className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionTag index="H/01" label="Holdings & Assets" />
        <KineticLines
          lines={["Strategic", "Assets."]}
          lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
        />
        <Reveal delay={0.4} className="mt-10 max-w-xl">
          <p className="text-sm leading-relaxed text-oki-muted">
            A consolidated view of the OKI Inc. portfolio. Every position is structured for control, insulated by architecture, and held on a generational horizon.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
          <Reveal className="bg-oki-surface p-8 md:p-12">
            <DonutChart />
          </Reveal>
          <Reveal delay={0.15} className="relative bg-oki-surface p-8 md:p-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1727610542348-9636c3b65d2a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w7NDk1ODB8MHwxfHNlYXJjaHwzfHxkYXJrJTIwZ2xvYmFsJTIwYnVzaW5lc3MlMjBtYXB8ZW58MHx8fHwxNzg1ODExMzU3fDA&ixlib=rb-4.1.0&q=85)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative">
              <GeoBars />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="bg-oki-surface p-8 md:p-12 lg:col-span-2">
            <GrowthLine />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12">
        <SectionTag index="H/02" label="Asset Classes" />
        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          {assetClasses.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 0.1}
              className="card-glow group bg-oki-black p-10 transition-colors duration-500 hover:bg-oki-elevated md:p-14"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-gold">{a.tag}</p>
              <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-oki-text md:text-3xl">{a.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">{a.desc}</p>
              <div className="mt-8 h-px w-full bg-white/5 transition-colors duration-500 group-hover:bg-oki-gold/30" />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
