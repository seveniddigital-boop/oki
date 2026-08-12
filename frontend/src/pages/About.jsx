import { motion } from "framer-motion";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const leadership = [
  { title: "Office of the Chairman", scope: "Corporate Direction & Strategy" },
  { title: "Chief Markets Office", scope: "Research, Data & Publications" },
  { title: "General Counsel & Corporate Secretary", scope: "Governance, Compliance & Delaware Charter" },
  { title: "Office of the Comptroller", scope: "Reporting & Corporate Discipline" },
];

const layers = [
  { label: "OKI Inc.", detail: "Delaware C-Corporation — The Corporate Seat", accent: true },
  { label: "Market Intelligence", detail: "Live Data · Research · Publications", accent: false },
  { label: "Coverage", detail: "Bitcoin · Equities · Indices · Macro", accent: false },
];

export default function About() {
  return (
    <motion.main data-testid="about-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <LazyBg
          src="https://images.unsplash.com/photo-1565626424178-c699f6601afd?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Geometric concrete corporate architecture"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionTag index="A/01" label="About / Architecture" />
          <KineticLines
            lines={["Corporate", "Architecture."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <KineticLines
              animate={false}
              lines={["A young corporation,", "built in Delaware,", "aimed at the top."]}
              lineClassName="font-display text-3xl font-medium leading-[1.1] tracking-tighter text-oki-text md:text-5xl"
            />
            <Reveal delay={0.3} className="mt-10 max-w-xl space-y-6 text-sm leading-relaxed text-oki-muted">
              <p>
                OKI Inc. is incorporated in the State of Delaware — the most settled corporate legal environment in the world. Two centuries of case law, a dedicated Court of Chancery, and statutory clarity make it the jurisdiction of record for companies that intend to last.
              </p>
              <p>
                From its corporate seat in New York, OKI is building a public market-intelligence platform: live Bitcoin data, global equity indices, and commentary — published in the open, from day one. The ambition is not hidden. Neither is the work.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <div className="border border-white/10">
              {layers.map((l, i) => (
                <Reveal key={l.label} delay={i * 0.15} className={`border-b border-white/10 p-8 last:border-b-0 ${l.accent ? "bg-oki-elevated" : "bg-oki-surface"}`}>
                  <div className="flex items-center justify-between">
                    <p className={`font-display text-xl font-medium tracking-tight ${l.accent ? "text-oki-gold" : "text-oki-text"}`}>{l.label}</p>
                    <span className="font-mono text-[10px] text-oki-faint">L{i}</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-oki-faint">{l.detail}</p>
                </Reveal>
              ))}
              <div className="relative flex justify-center gap-1 bg-oki-black py-6">
                <motion.span
                  className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-oki-gold/60 to-transparent"
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-oki-faint">Capital flows downward · Control flows upward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10">
        <LazyBg
          src="https://images.unsplash.com/photo-1703639948834-342fc34900f8?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 opacity-20 bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="A/02" label="Governance" />
          <KineticLines
            animate={false}
            lines={["Institutions endure.", "Individuals serve."]}
            lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
          />
          <div className="mt-16 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
            {leadership.map((l, i) => (
              <Reveal key={l.title} delay={i * 0.1} className="bg-oki-black/90 p-10">
                <h3 className="font-display text-lg font-medium tracking-tight text-oki-text">{l.title}</h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">{l.scope}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-12 max-w-2xl">
            <p className="text-sm leading-relaxed text-oki-muted">
              Leadership at OKI Inc. is presented institutionally, by design. Authority resides in offices, not personalities. Discipline is enforced by charter, reviewed by counsel, and measured against a generational mandate.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <SectionTag index="A/03" label="Corporate Headquarters" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <Reveal>
            <p className="font-display text-3xl font-medium leading-snug tracking-tight text-oki-text md:text-4xl">
              One World Trade Center, 85th Floor<br />
              New York, NY 10007<br />
              <span className="text-oki-muted">United States of America</span>
            </p>
            <a href="tel:+12122208443" data-testid="about-phone-link" className="mt-6 inline-block font-mono text-sm tracking-[0.2em] text-oki-gold transition-colors duration-300 hover:text-oki-text">
              +1 (212) 220-8443
            </a>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="max-w-md text-sm leading-relaxed text-oki-muted">
              Corporate communications and investor relations are conducted from the headquarters at One World Trade Center. OKI Inc. is incorporated in the State of Delaware and operates in good standing under the Delaware General Corporation Law.
            </p>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-gold">Filed · Maintained · Permanent</p>
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/api/deck`}
              data-testid="about-download-deck-btn"
              className="group mt-10 inline-flex items-center gap-2 border border-oki-gold/50 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold transition-colors duration-500 hover:bg-oki-gold hover:text-oki-black"
            >
              Download Corporate Deck (PDF)
            </a>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
}
