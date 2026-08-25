import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";
import LazyBg from "@/components/LazyBg";

const ESSAYS = [
  {
    id: "digital-assets-infrastructure",
    date: "AUG 2026",
    category: "Markets",
    title: "Bitcoin, Read Like Infrastructure",
    excerpt: "Price is the loudest signal and the least interesting one. How OKI reads the network instead.",
    body: [
      "Most coverage of Bitcoin begins and ends with price. OKI's read starts elsewhere: settlement volume, security budget, developer gravity — the structural signals that describe what the network is, not what it costs.",
      "This is not advocacy and it is not advice. It is the lens this platform publishes from: infrastructure first, sentiment last. The chart shows the weather; the fundamentals show the climate.",
    ],
  },
  {
    id: "ownership-is-the-strategy",
    date: "JUL 2026",
    category: "Platform",
    title: "Why We Publish in Public",
    excerpt: "A young corporation's shortcut to trust: show the work.",
    body: [
      "OKI Inc. was founded in 2026 with no legacy and no legacy bias. What it has instead is a method — and the willingness to publish it. Every price on this site is live, public, and ungated.",
      "Transparency is not a marketing posture. It is the strategy. Corporations used to build reputation over decades of private dealing. This one intends to build it in the open, one accurate data point at a time.",
    ],
  },
  {
    id: "why-delaware",
    date: "JUN 2026",
    category: "Architecture",
    title: "Why Delaware, Why Always",
    excerpt: "Two centuries of settled corporate law is not a detail. It is the foundation.",
    body: [
      "OKI Inc. is domiciled within a Delaware C-Corporation framework. The choice is deliberate: the Delaware General Corporation Law and the Court of Chancery offer the most predictable corporate jurisprudence in the world.",
      "Predictability is not administration. It is defense. When governance questions arise — and over long enough horizons, they always arise — they are resolved against two hundred years of precedent, not against the mood of a foreign regulator. Structure is how a company survives its own success.",
    ],
  },
  {
    id: "compounding-of-control",
    date: "MAY 2026",
    category: "Markets",
    title: "The Compounding of Attention",
    excerpt: "An index read once is trivia. Read daily for a decade, it becomes judgment.",
    body: [
      "Markets reward the prepared, and preparation is mostly repetition. The same indices, the same networks, the same questions — asked every session until the answers start arriving before the questions.",
      "That is the compounding this platform is built on: not leverage, not access, but accumulated understanding — published so anyone can compound alongside.",
    ],
  },
  {
    id: "institutions-endure",
    date: "APR 2026",
    category: "Governance",
    title: "Institutions Endure. Individuals Serve.",
    excerpt: "Authority at OKI Inc. resides in offices, not personalities.",
    body: [
      "OKI Inc. presents its leadership institutionally — by office, not by photograph. The Chairman, the Chief Markets Office, the General Counsel, the Comptroller: roles with mandates, charters, and succession discipline.",
      "Personalities are cyclical. Institutions are structural. A corporation built to last generations cannot depend on any single generation of people. The charter outlives the steward. That is the point of the charter.",
    ],
  },
];

function Essay({ essay, idx, open, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        data-testid={`essay-toggle-${essay.id}`}
        className="group flex w-full items-center justify-between gap-6 py-8 text-left"
      >
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
          <span className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">
            <span className={open ? "text-oki-gold" : ""}>{String(idx + 1).padStart(2, "0")}</span> · {essay.date}
          </span>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold">{essay.category}</span>
            <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-oki-text transition-colors duration-300 group-hover:text-oki-gold md:text-2xl">
              {essay.title}
            </h3>
            <p className="mt-1 text-sm text-oki-muted">{essay.excerpt}</p>
          </div>
        </div>
        <Plus className={`h-4 w-4 shrink-0 text-oki-gold transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl space-y-5 pb-10 md:pl-[7.5rem]">
              {essay.body.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-oki-muted">
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Insights() {
  const [openId, setOpenId] = useState(ESSAYS[0].id);

  return (
    <motion.main data-testid="insights-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <LazyBg
          src="https://images.unsplash.com/photo-1496588152823-86ff7695e68f?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Global skyline at dusk"
        />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionTag index="P/01" label="Perspectives" />
          <KineticLines
            lines={["Doctrine,", "in writing."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 max-w-xl">
            <p className="text-sm leading-relaxed text-oki-muted">
              Essays and announcements from OKI Inc. on markets, architecture, and the long climb. Published when there is something worth saying — not before.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <div className="flex items-baseline justify-between pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Index of Essays</p>
          <p className="font-mono text-[10px] tracking-[0.3em] text-oki-gold">{String(ESSAYS.length).padStart(2, "0")} Published</p>
        </div>
        <div className="border-t border-white/10">
          {ESSAYS.map((e, i) => (
            <Essay key={e.id} essay={e} idx={i} open={openId === e.id} onToggle={() => setOpenId(openId === e.id ? null : e.id)} />
          ))}
        </div>
      </section>
    </motion.main>
  );
}
