import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const AREAS = [
  { n: "01", title: "Operating Businesses", text: "Established private companies with durable cash flow — services, distribution, consumer, and industrial operations.", img: "https://images.unsplash.com/photo-1565626424178-c699f6601afd?q=80&w=1200&auto=format&fit=crop" },
  { n: "02", title: "Technology & Software", text: "Software companies, technology businesses, and the infrastructure beneath them.", img: "https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?q=80&w=1200&auto=format&fit=crop" },
  { n: "03", title: "Digital & Online Assets", text: "Internet-based operations — platforms, e-commerce, communities, and scalable digital properties.", img: "https://images.unsplash.com/photo-1689732888407-310424e3a372?q=80&w=1200&auto=format&fit=crop" },
  { n: "04", title: "Brands & Intellectual Property", text: "Brands, media, licensing, and commercially valuable IP.", img: "https://images.unsplash.com/photo-1723023505659-fde32810e0d1?q=80&w=1200&auto=format&fit=crop" },
  { n: "05", title: "Real Estate & Real Assets", text: "Strategic real estate and selected tangible assets where appropriate.", img: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?q=80&w=1200&auto=format&fit=crop" },
  { n: "06", title: "Strategic Holdings", text: "Minority or majority interests in businesses with strong long-term potential.", img: "https://images.unsplash.com/photo-1703639948834-342fc34900f8?q=80&w=1200&auto=format&fit=crop" },
];

const CRITERIA = [
  "Strong fundamentals",
  "Growth potential",
  "Strategic value",
  "Scalability",
  "Sustainable cash generation",
  "Brand potential",
  "Operational upside",
  "Long-term ownership potential",
];

const PROCESS = [
  { n: "01", t: "Opportunity Identification", d: "Continuous scanning across industries, markets, and networks. Most opportunities are found before they are offered." },
  { n: "02", t: "Initial Review", d: "Fundamentals first: revenue quality, market position, defensibility, and fit with the mandate. Most opportunities end here." },
  { n: "03", t: "Due Diligence", d: "Financial, operational, technical, and legal examination. The analysis is finished before any commitment is voiced." },
  { n: "04", t: "Structuring", d: "Terms, governance, and corporate architecture — engineered under Delaware law for clean, durable ownership." },
  { n: "05", t: "Acquisition", d: "Deliberate execution. Private, patient capital moving on the schedule the work sets — not the market's mood." },
  { n: "06", t: "Growth & Management", d: "Ownership is where the work begins: modernization, operational discipline, and long-term development." },
];

const VALUE = [
  "Strategic direction",
  "Technology modernization",
  "Operational optimization",
  "Branding",
  "International expansion",
  "Capital allocation",
  "Business development",
  "Digital transformation",
];

const PILLARS = [
  { title: "Long-Term Ownership", text: "Sustainable value creation over short-term speculation. Assets are acquired to be held, improved, and compounded." },
  { title: "Strategic Growth", text: "Acquired businesses are developed — improved, scaled, and expanded beyond what they could reach alone." },
  { title: "Diversification", text: "Exposure built across operating businesses, real assets, and digital operations — balanced by design." },
  { title: "Operational Value Creation", text: "Technology, strategy, capital, and management applied directly — ownership is never passive." },
];

function AreaPanels() {
  const [active, setActive] = useState(0);
  return (
    <>
      <div data-testid="acquisition-areas-desktop" className="hidden h-[540px] gap-px border border-white/10 bg-white/10 md:flex">
        {AREAS.map((a, i) => {
          const on = active === i;
          return (
            <button
              key={a.n}
              data-testid={`area-panel-${i}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="relative overflow-hidden bg-oki-black text-left"
              style={{ flexGrow: on ? 4 : 1, flexBasis: 0, transition: "flex-grow 0.7s cubic-bezier(0.22,1,0.36,1)" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
                style={{ backgroundImage: `url(${a.img})`, opacity: on ? 0.4 : 0.1 }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
              <span className={`absolute left-5 top-6 font-mono text-xs tracking-[0.3em] transition-colors duration-500 ${on ? "text-oki-gold" : "text-oki-faint"}`}>
                {a.n}
              </span>
              <span
                className={`absolute left-4 top-16 whitespace-nowrap font-display text-lg font-medium tracking-tight text-oki-muted transition-opacity duration-300 [writing-mode:vertical-rl] ${on ? "opacity-0" : "opacity-100"}`}
              >
                {a.title}
              </span>
              <div className={`absolute bottom-0 left-0 right-0 p-7 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}>
                <h3 className="whitespace-nowrap font-display text-2xl font-medium tracking-tighter text-white lg:text-3xl">{a.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">{a.text}</p>
              </div>
            </button>
          );
        })}
      </div>
      <div data-testid="acquisition-areas-mobile" className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:hidden">
        {AREAS.map((a) => (
          <div key={a.n} className="relative overflow-hidden bg-oki-black">
            <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${a.img})` }} aria-hidden="true" />
            <div className="relative p-8">
              <p className="font-mono text-[10px] tracking-[0.3em] text-oki-gold">{a.n}</p>
              <h3 className="mt-3 font-display text-2xl font-medium tracking-tighter text-oki-text">{a.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-oki-muted">{a.text}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Acquisitions() {
  return (
    <motion.main data-testid="acquisitions-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <LazyBg
          src="https://images.unsplash.com/photo-1565043534426-8a67ac8671e2?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Long exposure of a corporate tower at night"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionTag index="AQ/01" label="The Mandate" />
          <KineticLines
            lines={["Acquiring Assets.", "Building Value."]}
            lineClassName="font-display text-5xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 max-w-2xl">
            <p className="text-sm leading-relaxed text-oki-muted md:text-base">
              OKI Inc. acquires businesses and assets, and manages them as a long-term owner. The mandate is evenly weighted across the real and digital economy: established operating companies, technology and online operations, brands and intellectual property, real assets, and strategic holdings — acquired to be held, managed, and compounded.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 md:py-32">
        <SectionTag index="AQ/02" label="Acquisition Areas" />
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <KineticLines
            animate={false}
            lines={["Where the mandate", "operates."]}
            lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
          />
          <Reveal delay={0.2} className="max-w-sm">
            <p className="text-sm leading-relaxed text-oki-muted">
              Six arenas, one standard: assets with strong fundamentals and room to compound under disciplined ownership.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="mt-14">
          <AreaPanels />
        </Reveal>
      </section>

      <section className="border-t border-white/10 bg-oki-surface">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="AQ/03" label="Acquisition Criteria" />
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="md:sticky md:top-32">
                <KineticLines
                  animate={false}
                  lines={["What earns", "attention."]}
                  lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-5xl"
                />
                <Reveal delay={0.2} className="mt-8 max-w-xs">
                  <p className="text-sm leading-relaxed text-oki-muted">
                    Opportunities are weighed against eight factors. Stories and momentum are not among them.
                  </p>
                </Reveal>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-px self-start border border-white/10 bg-white/10 sm:grid-cols-2 md:col-span-8">
              {CRITERIA.map((cr, i) => (
                <Reveal key={cr} delay={i * 0.06} className="group flex items-baseline gap-5 bg-oki-black p-8 transition-colors duration-500 hover:bg-oki-elevated">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-oki-faint transition-colors duration-300 group-hover:text-oki-gold">
                    C/{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg font-medium tracking-tight text-oki-text transition-colors duration-300 group-hover:text-oki-gold md:text-xl">
                    {cr}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
        <SectionTag index="AQ/04" label="The Process" />
        <KineticLines
          animate={false}
          lines={["Six steps.", "No shortcuts."]}
          lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
        />
        <div className="relative mt-16 ml-2 border-l border-white/10 md:ml-6">
          <motion.span
            aria-hidden="true"
            className="absolute -left-px top-0 w-px bg-gradient-to-b from-oki-gold to-transparent"
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />
          {PROCESS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="group relative pb-16 pl-10 last:pb-0 md:pl-16">
              <span aria-hidden="true" className="absolute -left-[5px] top-3 h-2.5 w-2.5 rotate-45 border border-oki-gold bg-oki-black transition-colors duration-300 group-hover:bg-oki-gold" />
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-10">
                <span className="text-outline w-20 shrink-0 font-display text-5xl font-semibold md:text-6xl">{s.n}</span>
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-oki-text transition-colors duration-300 group-hover:text-oki-gold md:text-3xl">{s.t}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-oki-muted">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10">
        <LazyBg
          src="https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center opacity-15"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="AQ/05" label="After the Acquisition" />
          <div data-testid="value-creation-band" className="flex flex-wrap items-center gap-4 md:gap-8">
            {["Acquire", "Improve", "Scale", "Compound"].map((w, i) => (
              <Reveal key={w} delay={i * 0.12} className="flex items-center gap-4 md:gap-8">
                <span className="font-display text-3xl font-medium tracking-tighter text-oki-text md:text-6xl">{w}</span>
                {i < 3 && <ArrowRight aria-hidden="true" className="h-5 w-5 text-oki-gold md:h-8 md:w-8" />}
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3} className="mt-10 max-w-2xl">
            <p className="text-sm leading-relaxed text-oki-muted md:text-base">
              OKI is not a passive owner. After acquisition, the corporation applies capital, technology, and management directly — the same discipline that found the asset is used to grow it.
            </p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
            {VALUE.map((v, i) => (
              <Reveal key={v} delay={i * 0.05} className="bg-oki-black/90 p-6 md:p-8">
                <p className="font-mono text-[9px] tracking-[0.3em] text-oki-gold">V/{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-sm text-oki-text">{v}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-oki-surface">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="AQ/06" label="Portfolio Philosophy" />
          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1} className="card-glow group bg-oki-black p-10 transition-colors duration-500 hover:bg-oki-elevated md:p-14">
                <h3 className="font-display text-2xl font-medium tracking-tighter text-oki-text transition-colors duration-500 group-hover:text-oki-gold md:text-3xl">{p.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">{p.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2} className="mt-10">
            <p data-testid="acquisitions-disclosure" className="max-w-3xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.25em] text-oki-faint">
              OKI Inc. is an emerging corporation. It does not publish portfolio contents, transaction values, assets under management, or performance figures — and it will not fabricate them. What it publishes is the mandate, the criteria, and the discipline.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 text-center md:px-12">
        <KineticLines
          animate={false}
          lines={["Own something worth", "bringing to the table?"]}
          lineClassName="font-display text-3xl font-medium leading-[1.1] tracking-tighter text-oki-text md:text-6xl"
        />
        <Reveal delay={0.3} className="mt-12 flex flex-col items-center justify-center gap-6 md:flex-row">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@okiinc.global&su=Acquisition%20Opportunity%20for%20OKI%20Inc."
            target="_blank"
            rel="noopener noreferrer"
            data-testid="acquisitions-propose-btn"
            className="group relative inline-flex overflow-hidden border border-oki-gold/50 px-10 py-5 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold transition-colors duration-500 hover:text-oki-black"
          >
            <span className="absolute inset-0 -translate-x-full bg-oki-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
            <span className="relative flex items-center gap-2">
              Propose an Opportunity
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
          <Link
            to="/contact"
            data-testid="acquisitions-contact-link"
            className="border-b border-white/20 pb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-muted transition-colors duration-300 hover:border-oki-text hover:text-oki-text"
          >
            Corporate Contact
          </Link>
        </Reveal>
      </section>
    </motion.main>
  );
}
