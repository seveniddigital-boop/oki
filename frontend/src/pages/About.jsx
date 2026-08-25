import { motion } from "framer-motion";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const layers = [
  { label: "OKI Inc.", detail: "Delaware C-Corporation — The Corporate Seat", accent: true },
  { label: "Strategic Holdings", detail: "Acquisitions · Ownership · Development", accent: false },
  { label: "Market Intelligence", detail: "Live Data · Research · Publications", accent: false },
  { label: "Coverage", detail: "Digital Assets · Equities · Indices · Macro", accent: false },
];

const record = [
  { y: "2026", t: "Incorporated", d: "Chartered as a C-Corporation under the Delaware General Corporation Law." },
  { y: "2026", t: "Corporate seat established", d: "Headquarters set at One World Trade Center, 85th Floor, New York." },
  { y: "2026", t: "The window opens", d: "Live market platform published — Bitcoin, indices, and equities, free and ungated." },
  { y: "2026", t: "The mandate published", d: "Acquisition doctrine stated in the open: operating businesses, technology, brands, real assets, and strategic holdings." },
  { y: "Ahead", t: "The climb continues", d: "First acquisitions, deeper coverage, wider mandate. The direction has not changed: up." },
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
                From its corporate seat in New York, OKI operates as a holdings and investments corporation — acquiring and investing in businesses and assets across the real and digital economy, and managing them for the long term. The ambition is not hidden. Neither is the work.
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

      <section data-testid="about-record-section" className="border-t border-white/10 bg-oki-surface">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="A/02" label="The Record" />
          <KineticLines
            animate={false}
            lines={["Short history.", "Long intent."]}
            lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
          />
          <div className="mt-16 border-t border-white/10">
            {record.map((r, i) => (
              <Reveal key={`${r.y}-${r.t}`} delay={i * 0.1} className="group grid grid-cols-1 gap-4 border-b border-white/10 py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                <span className={`font-mono text-sm tracking-[0.3em] md:col-span-2 ${r.y === "Ahead" ? "text-oki-gold" : "text-oki-faint"}`}>{r.y}</span>
                <span className="flex items-center gap-4 md:col-span-4">
                  <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 border border-oki-gold bg-transparent transition-colors duration-300 group-hover:bg-oki-gold" />
                  <span className="font-display text-xl font-medium tracking-tight text-oki-text transition-colors duration-300 group-hover:text-oki-gold md:text-2xl">{r.t}</span>
                </span>
                <span className="text-sm leading-relaxed text-oki-muted md:col-span-6">{r.d}</span>
              </Reveal>
            ))}
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
          <SectionTag index="A/03" label="Governance & Discretion" />
          <KineticLines
            animate={false}
            lines={["Institutions endure.", "Individuals serve."]}
            lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
          />
          <div className="mt-16 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
            <Reveal data-testid="governance-privacy-card" className="bg-oki-black/90 p-10 md:p-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold">Governance by Charter</p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-oki-muted">
                Authority at OKI resides in offices, not personalities. Roles are defined by charter, reviewed by counsel, and measured against a generational mandate — under the Delaware General Corporation Law.
              </p>
            </Reveal>
            <Reveal delay={0.12} data-testid="governance-privacy-card" className="bg-oki-black/90 p-10 md:p-12">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold">Privacy by Policy</p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-oki-muted">
                OKI does not publish the names of its officers, counterparties, or advisers. Corporate matters are disclosed privately, in the course of business. Discretion is not secrecy — it is professionalism.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <SectionTag index="A/04" label="Corporate Headquarters" />
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
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@okiinc.global&su=Inquiry%20for%20OKI%20Inc." target="_blank" rel="noopener noreferrer" data-testid="about-email-link" className="mt-3 block font-mono text-sm tracking-[0.15em] text-oki-gold transition-colors duration-300 hover:text-oki-text">
              contact@okiinc.global
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
