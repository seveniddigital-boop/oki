import { KineticLines, Reveal, SectionTag } from "@/components/Kinetic";

const leadership = [
  { title: "Office of the Chairman", scope: "Corporate Direction & Capital Allocation" },
  { title: "Chief Investment Office", scope: "Global Asset Acquisition & Structuring" },
  { title: "General Counsel & Corporate Secretary", scope: "Governance, Compliance & Delaware Charter" },
  { title: "Office of the Comptroller", scope: "Consolidated Reporting & Capital Discipline" },
];

const layers = [
  { label: "OKI Inc.", detail: "Delaware C-Corporation — Ultimate Parent", accent: true },
  { label: "Holding Entities", detail: "Jurisdiction-Optimized Subsidiaries", accent: false },
  { label: "Operating Assets", detail: "Equity · Real Assets · IP · Private Credit", accent: false },
];

export default function About() {
  return (
    <main data-testid="about-page" className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-12">
        <SectionTag index="A/01" label="About / Architecture" />
        <KineticLines
          lines={["Corporate", "Architecture."]}
          lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
        />
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <KineticLines
              animate={false}
              lines={["The Delaware C-Corporation is", "the optimal vehicle for", "international asset ownership."]}
              lineClassName="font-display text-3xl font-medium leading-[1.1] tracking-tighter text-oki-text md:text-5xl"
            />
            <Reveal delay={0.3} className="mt-10 max-w-xl space-y-6 text-sm leading-relaxed text-oki-muted">
              <p>
                OKI Inc. is incorporated in the State of Delaware — the most settled corporate legal environment in the world. Two centuries of case law, a dedicated Court of Chancery, and statutory clarity make it the jurisdiction of record for capital that intends to remain capital.
              </p>
              <p>
                From this single center of gravity, the corporation directs holding entities across twelve jurisdictions — each position insulated, each structure deliberate. Governance is centralized. Exposure is not.
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
              <div className="flex justify-center gap-1 bg-oki-black py-3">
                {[0, 1].map((i) => (
                  <span key={i} className="h-px w-8 bg-oki-gold/40" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1703639948834-342fc34900f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxtb29keSUyMHRhbGwlMjBkYXJrJTIwdG93ZXIlMjBsb29raW5nJTIwdXB8ZW58MHx8fHwxNzg1ODEyNjIzfDA&ixlib=rb-4.1.0&q=85)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
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
              Leadership at OKI Inc. is presented institutionally, by design. Authority resides in offices, not personalities. Capital discipline is enforced by charter, reviewed by counsel, and measured against a generational mandate.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
        <SectionTag index="A/03" label="Registered Office" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <Reveal>
            <p className="font-display text-3xl font-medium leading-snug tracking-tight text-oki-text md:text-4xl">
              16192 Coastal Highway<br />
              Lewes, Delaware 19958<br />
              <span className="text-oki-muted">United States of America</span>
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="max-w-md text-sm leading-relaxed text-oki-muted">
              All corporate filings, service of process, and governance records are maintained at the registered office. OKI Inc. operates in good standing under the Delaware General Corporation Law.
            </p>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-gold">Filed · Maintained · Permanent</p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
