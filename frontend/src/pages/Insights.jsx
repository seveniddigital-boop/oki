import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";

const ESSAYS = [
  {
    id: "digital-assets-infrastructure",
    date: "AUG 2026",
    category: "Capital",
    title: "Digital Assets, Held Like Infrastructure",
    excerpt: "Bitcoin and select networks enter the permanent portfolio — with custody, not conviction theater.",
    body: [
      "OKI Inc. now holds digital assets as a formal allocation: sixteen percent of the portfolio, concentrated in Bitcoin, Ethereum, and select layer-one infrastructure. The position is not a trade. It is balance-sheet architecture for a century in which value increasingly settles on open networks.",
      "The doctrine does not bend for a new asset class. Custody is institutional, keys are multi-signature and geographically distributed, the majority of the position sits in cold storage, and nothing is leveraged. We do not watch the price. We own the network.",
    ],
  },
  {
    id: "ownership-is-the-strategy",
    date: "JUL 2026",
    category: "Doctrine",
    title: "Ownership Is the Strategy",
    excerpt: "Why OKI Inc. does not trade, does not exit, and does not apologize for it.",
    body: [
      "Most capital is managed against a clock. Fund lives expire, quarters close, and positions built with care are sold to satisfy a calendar. OKI Inc. was organized to remove the clock from the equation entirely.",
      "When an asset enters the OKI portfolio, it enters permanently. This is not passivity — it is the most aggressive posture available to capital. Every competitor must eventually sell. We never must. Over decades, that asymmetry compounds into something no quarterly model can replicate.",
    ],
  },
  {
    id: "why-delaware",
    date: "JUN 2026",
    category: "Architecture",
    title: "Why Delaware, Why Always",
    excerpt: "Two centuries of settled corporate law is not a detail. It is the foundation.",
    body: [
      "Every OKI position is domiciled within a Delaware C-Corporation framework. The choice is deliberate: the Delaware General Corporation Law and the Court of Chancery offer the most predictable corporate jurisprudence in the world.",
      "Predictability is not administration. It is defense. When governance questions arise — and over generational horizons, they always arise — they are resolved against two hundred years of precedent, not against the mood of a foreign regulator. Structure is how capital survives its own success.",
    ],
  },
  {
    id: "compounding-of-control",
    date: "MAY 2026",
    category: "Capital",
    title: "The Compounding of Control",
    excerpt: "Minority positions observe outcomes. Controlling positions author them.",
    body: [
      "Sixty-four percent of the OKI portfolio is held in controlling stakes. This is the operating principle, not a preference. A minority investor reads the outcome; a controlling owner writes it.",
      "Control compounds quietly: pricing decisions, capital allocation, management selection, timing. Each lever seems modest in isolation. Across twelve jurisdictions and a generational horizon, the levers multiply one another. That multiplication is the return.",
    ],
  },
  {
    id: "institutions-endure",
    date: "APR 2026",
    category: "Governance",
    title: "Institutions Endure. Individuals Serve.",
    excerpt: "Authority at OKI Inc. resides in offices, not personalities.",
    body: [
      "OKI Inc. presents its leadership institutionally — by office, not by photograph. The Chairman, the Chief Investment Office, the General Counsel, the Comptroller: roles with mandates, charters, and succession discipline.",
      "Personalities are cyclical. Institutions are structural. A corporation engineered to hold assets for generations cannot depend on any single generation of people. The charter outlives the steward. That is the point of the charter.",
    ],
  },
];

function Essay({ essay, open, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        data-testid={`essay-toggle-${essay.id}`}
        className="group flex w-full items-center justify-between gap-6 py-8 text-left"
      >
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
          <span className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">{essay.date}</span>
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
        <div
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Global skyline at dusk"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1496588152823-86ff7695e68f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxza3lsaW5lJTIwcGFub3JhbWElMjBkdXNrfGVufDB8fHx8MTc4NTg5MjMyNnww&ixlib=rb-4.1.0&q=85)" }}
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
              Essays and announcements from OKI Inc. on ownership, architecture, and capital discipline. Published when there is something worth saying — not before.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <div className="border-t border-white/10">
          {ESSAYS.map((e) => (
            <Essay key={e.id} essay={e} open={openId === e.id} onToggle={() => setOpenId(openId === e.id ? null : e.id)} />
          ))}
        </div>
      </section>
    </motion.main>
  );
}
