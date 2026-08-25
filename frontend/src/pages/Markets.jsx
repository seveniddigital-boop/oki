import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { KineticLines, Reveal, SectionTag, PhotoReveal, pageAnim } from "@/components/Kinetic";
import MarketTicker from "@/components/MarketTicker";
import MarketBoard from "@/components/MarketBoard";
import MarketChart from "@/components/MarketChart";
import MarketSearch from "@/components/MarketSearch";
import DataSkyline from "@/components/DataSkyline";
import LazyBg from "@/components/LazyBg";

const HEADER_IMG =
  "https://images.unsplash.com/photo-1664353655151-9d94a9170eb0?q=80&w=1200&auto=format&fit=crop";

const quick = [
  { label: "Bitcoin", id: "bitcoin", type: "crypto", name: "Bitcoin" },
  { label: "Ethereum", id: "ethereum", type: "crypto", name: "Ethereum" },
  { label: "S&P 500", id: "^GSPC", type: "stock", name: "S&P 500", badge: "Index" },
];

const lenses = [
  { t: "Macro Structure", d: "Interest rates, capital flows, and sovereign policy — the weather system every market trades inside. Structure first." },
  { t: "Network Fundamentals", d: "For digital assets: settlement volume, developer gravity, and security budgets — never sentiment." },
  { t: "Liquidity Cycles", d: "Markets breathe. Prices are read where liquidity leaves, and understood where it returns." },
  { t: "Risk Awareness", d: "Volatility is information, not noise. Every chart here is a map of how the world prices uncertainty." },
];

const focusAreas = [
  {
    title: "Equity Markets",
    note: "The major indices and the companies that move them — tracked live, every session.",
    img: "https://images.unsplash.com/photo-1526642591341-bcfc36ffae2f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Digital Assets",
    note: "Bitcoin, Ethereum, and select networks — read as emerging financial infrastructure.",
    img: "https://images.unsplash.com/photo-1623227413711-25ee4388dae3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Global Indices",
    note: "S&P 500, NASDAQ, and the Dow — the scoreboard of American enterprise.",
    img: "https://images.unsplash.com/photo-1558120985-abcafafcae16?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Macro & Commodities",
    note: "Rates, currencies, and hard assets — the backdrop against which everything is priced.",
    img: "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function Markets() {
  const [active, setActive] = useState(null);
  const { hash } = useLocation();

  return (
    <motion.main data-testid="markets-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <LazyBg src={HEADER_IMG} className="absolute inset-0 bg-cover bg-center" role="img" aria-label="New York skyline at night" />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-bottom-fade absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[20vh]">
          <DataSkyline />
        </div>
        <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
          <SectionTag index="M/01" label="Market Intelligence" />
          <KineticLines
            lines={["Market", "Intelligence."]}
            lineClassName="font-display text-6xl font-semibold leading-[0.9] tracking-tighter text-oki-text md:text-9xl"
          />
          <Reveal delay={0.4} className="mt-10 max-w-xl">
            <p className="text-sm leading-relaxed text-oki-muted">
              The research arm behind the acquisition mandate. A living view of the markets OKI Inc. studies — public equities, digital networks, and the indices that price them. Updated continuously.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pt-16 md:px-12">
        <MarketTicker />
      </section>

      <section id="board" className="mx-auto max-w-[1600px] px-6 pt-24 md:px-12">
        <SectionTag index="M/02" label="The Board" />
        <KineticLines
          animate={false}
          lines={["One board.", "Both markets."]}
          lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
        />
        <Reveal delay={0.2} className="mt-8 max-w-xl">
          <p className="text-sm leading-relaxed text-oki-muted">
            Crypto on the left, stocks on the right. Flip between live prices and full charts — every cell on the board is selectable.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12">
          <div id="charts">
            <MarketBoard key={hash || "default"} initialView={hash === "#charts" ? "charts" : "prices"} />
          </div>
        </Reveal>
      </section>

      <section id="window" className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <SectionTag index="M/03" label="The Market Window" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <KineticLines
              animate={false}
              lines={["Watch the world", "reprice itself."]}
              lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-5xl"
            />
            <Reveal delay={0.2} className="mt-8 max-w-md">
              <p className="text-sm leading-relaxed text-oki-muted">
                Search any stock, ETF, index, or digital asset. Read its trajectory across a day, a week, or a month. This is the same window through which OKI watches the world — now open to you.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                {quick.map((c) => (
                  <button
                    key={c.id}
                    data-testid={`chip-${c.id === "^GSPC" ? "spx" : c.id}`}
                    onClick={() => setActive(active?.id === c.id ? null : c)}
                    className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                      active?.id === c.id
                        ? "border-oki-gold bg-oki-gold text-oki-black"
                        : "border-oki-gold/30 text-oki-gold hover:border-oki-gold/70"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
                <MarketSearch onSelect={(m) => setActive(m)} />
              </div>
              <AnimatePresence>
                {active && (
                  <MarketChart key={`${active.type}-${active.id}`} id={active.id} type={active.type} name={active.name} badge={active.badge} onClose={() => setActive(null)} />
                )}
              </AnimatePresence>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 gap-px self-start border border-white/10 bg-white/10 sm:grid-cols-2 md:col-span-7">
            {lenses.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.1} className="card-glow bg-oki-black p-8 transition-colors duration-500 hover:bg-oki-elevated">
                <h3 className="font-display text-lg font-medium tracking-tight text-oki-gold">{f.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-oki-muted">{f.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-oki-surface">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="M/04" label="Focus Areas" />
          <KineticLines
            animate={false}
            lines={["What OKI", "watches."]}
            lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
          />
          <Reveal delay={0.2} className="mt-8 max-w-xl">
            <p className="text-sm leading-relaxed text-oki-muted">
              Four arenas, one standard. OKI Inc. is building its market intelligence in public — studying each market deeply and publishing what it sees.
            </p>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
            {focusAreas.map((a, i) => (
              <Reveal
                key={a.title}
                delay={i * 0.1}
                className="card-glow group bg-oki-black transition-colors duration-500 hover:bg-oki-elevated"
              >
                <PhotoReveal src={a.img} alt={a.title} delay={i * 0.1} className="h-44 w-full border-b border-white/10" />
                <div className="p-10 md:p-12">
                  <h3 className="font-display text-2xl font-medium tracking-tight text-oki-text md:text-3xl">{a.title}</h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">{a.note}</p>
                  <div className="mt-8 h-px w-full bg-white/5 transition-colors duration-500 group-hover:bg-oki-gold/30" />
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 font-mono text-[9px] uppercase leading-relaxed tracking-[0.25em] text-oki-faint">
            Live public market data — delayed where applicable · Nothing on this page constitutes investment advice
          </p>
        </div>
      </section>
    </motion.main>
  );
}
