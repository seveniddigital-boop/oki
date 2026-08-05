import { KineticLines, Reveal, SectionTag, PhotoReveal } from "@/components/Kinetic";
import DonutChart from "@/components/charts/DonutChart";
import GeoBars from "@/components/charts/GeoBars";
import GrowthLine from "@/components/charts/GrowthLine";

const assetClasses = [
  {
    title: "Equity Holdings",
    desc: "Controlling and anchor positions in operating companies across North America, Europe, and Asia-Pacific. Acquired to be held, not traded.",
    tag: "42% of Portfolio",
    img: "https://images.unsplash.com/photo-1526642591341-bcfc36ffae2f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBkaXN0cmljdCUyMGR1c2t8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Strategic Real Assets",
    desc: "Income-critical infrastructure, industrial land, and energy-adjacent real property in supply-constrained corridors.",
    tag: "28% of Portfolio",
    img: "https://images.unsplash.com/photo-1558120985-abcafafcae16?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwzfHxjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZSUyMGRhcmt8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Intellectual Property & Intangibles",
    desc: "Patent estates, proprietary data, and brand portfolios with durable pricing power and compounding royalty streams.",
    tag: "18% of Portfolio",
    img: "https://images.unsplash.com/photo-1592659762303-90081d34b277?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxjaXJjdWl0JTIwYm9hcmQlMjBkYXJrfGVufDB8fHx8MTc4NTg5MjMyNnww&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Private Credit & Special Situations",
    desc: "Senior-secured direct lending and dislocation-driven acquisitions where structure, not sentiment, determines return.",
    tag: "12% of Portfolio",
    img: "https://images.unsplash.com/photo-1582139329536-e7284fece509?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxiYW5rJTIwdmF1bHR8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
];

export default function Holdings() {
  return (
    <main data-testid="holdings-page">
      <section className="relative overflow-hidden pb-20 pt-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1664353655151-9d94a9170eb0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmUlMjBuaWdodCUyMGRhcmt8ZW58MHx8fHwxNzg1ODEyODQyfDA&ixlib=rb-4.1.0&q=85)" }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
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
        </div>
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
              className="card-glow group bg-oki-black transition-colors duration-500 hover:bg-oki-elevated"
            >
              <PhotoReveal src={a.img} alt={a.title} delay={i * 0.1} className="h-44 w-full border-b border-white/10" />
              <div className="p-10 md:p-14">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-gold">{a.tag}</p>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-oki-text md:text-3xl">{a.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">{a.desc}</p>
                <div className="mt-8 h-px w-full bg-white/5 transition-colors duration-500 group-hover:bg-oki-gold/30" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
