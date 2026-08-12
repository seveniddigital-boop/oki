import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { KineticLines, Reveal, SectionTag, PhotoReveal, pageAnim } from "@/components/Kinetic";
import CryptoTicker from "@/components/CryptoTicker";
import CryptoChart from "@/components/CryptoChart";
import CryptoSearch from "@/components/CryptoSearch";
import LazyBg from "@/components/LazyBg";

function ChartDisclosure({ title, testid, defaultOpen = false, className = "", children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bg-oki-surface ${className}`}>
      <button
        data-testid={testid}
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between px-8 py-6 text-left md:px-12"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint transition-colors duration-300 group-hover:text-oki-gold">
          {title}
        </span>
        <ChevronDown className={`h-4 w-4 text-oki-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
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
            <div className="px-8 pb-10 md:px-12 md:pb-12">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
import DonutChart from "@/components/charts/DonutChart";
import GeoBars from "@/components/charts/GeoBars";
import GrowthLine from "@/components/charts/GrowthLine";

const assetClasses = [
  {
    title: "Equity Holdings",
    desc: "Controlling and anchor positions in operating companies across North America, Europe, and Asia-Pacific. Acquired to be held, not traded.",
    tag: "36% of Portfolio",
    img: "https://images.unsplash.com/photo-1526642591341-bcfc36ffae2f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBkaXN0cmljdCUyMGR1c2t8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Strategic Real Assets",
    desc: "Income-critical infrastructure, industrial land, and energy-adjacent real property in supply-constrained corridors.",
    tag: "24% of Portfolio",
    img: "https://images.unsplash.com/photo-1558120985-abcafafcae16?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwzfHxjb25jcmV0ZSUyMGFyY2hpdGVjdHVyZSUyMGRhcmt8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Intellectual Property & Intangibles",
    desc: "Patent estates, proprietary data, and brand portfolios with durable pricing power and compounding royalty streams.",
    tag: "14% of Portfolio",
    img: "https://images.unsplash.com/photo-1592659762303-90081d34b277?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxjaXJjdWl0JTIwYm9hcmQlMjBkYXJrfGVufDB8fHx8MTc4NTg5MjMyNnww&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Private Credit & Special Situations",
    desc: "Senior-secured direct lending and dislocation-driven acquisitions where structure, not sentiment, determines return.",
    tag: "10% of Portfolio",
    img: "https://images.unsplash.com/photo-1582139329536-e7284fece509?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxiYW5rJTIwdmF1bHR8ZW58MHx8fHwxNzg1ODkyMzI2fDA&ixlib=rb-4.1.0&q=85",
    locked: true,
  },
  {
    title: "Digital Assets & Crypto Holdings",
    desc: "Bitcoin, Ethereum, and select L1 infrastructure held as permanent balance-sheet assets — institutional custody, multi-signature governance, cold-storage majority. No leverage. No trading desk.",
    tag: "16% of Portfolio",
    img: "https://images.unsplash.com/photo-1623227413711-25ee4388dae3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYml0Y29pbiUyMGdvbGR8ZW58MHx8fHwxNzg1ODk5MzE3fDA&ixlib=rb-4.1.0&q=85&w=1600",
    wide: true,
  },
];

export default function Holdings() {
  const [activeCoin, setActiveCoin] = useState(null);

  return (
    <motion.main data-testid="holdings-page" {...pageAnim}>
      <section className="relative overflow-hidden pb-20 pt-40">
        <LazyBg
          src="https://images.unsplash.com/photo-1664353655151-9d94a9170eb0?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center"
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
              A consolidated view of the OKI Inc. portfolio. Every position is acquired to be owned outright — and held beyond any market cycle.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
          <ChartDisclosure title="Global Asset Allocation" testid="disclosure-allocation" defaultOpen>
            <DonutChart />
          </ChartDisclosure>
          <ChartDisclosure title="Geographic Control" testid="disclosure-geographic">
            <GeoBars />
          </ChartDisclosure>
          <ChartDisclosure title="Asset Growth Trajectory" testid="disclosure-growth" className="lg:col-span-2">
            <GrowthLine />
          </ChartDisclosure>
        </div>
        <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.25em] text-oki-faint">
          Allocation figures reflect the corporate mandate structure. Market data: CoinGecko · Charts update continuously · Private positions disclosed under NDA only
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12">
        <SectionTag index="H/02" label="Asset Classes" />
        <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-2">
          {assetClasses.map((a, i) => (
            <Reveal
              key={a.title}
              delay={i * 0.1}
              className={`card-glow group bg-oki-black transition-colors duration-500 hover:bg-oki-elevated ${a.wide ? "md:col-span-2" : ""}`}
            >
              <PhotoReveal src={a.img} alt={a.title} delay={i * 0.1} className={`w-full border-b border-white/10 ${a.wide ? "h-56" : "h-44"}`} />
              <div className="p-10 md:p-14">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-gold">{a.tag}</p>
                  {a.locked && <Lock className="h-3.5 w-3.5 text-oki-gold" data-testid={`lock-icon-${a.title.replace(/\s+/g, "-").toLowerCase()}`} />}
                </div>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-oki-text md:text-3xl">{a.title}</h3>
                {a.locked ? (
                  <div className="mt-4 max-w-md">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-crimsonbright">Restricted Position</p>
                    <p className="mt-3 text-sm leading-relaxed text-oki-muted">
                      Detailed exposure, counterparties, and terms are disclosed only under executed NDA through the Chief Investment Office.
                    </p>
                    <Link
                      to="/contact"
                      data-testid="locked-request-access"
                      className="group mt-5 inline-flex items-center gap-2 border-b border-oki-gold/40 pb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold transition-colors duration-300 hover:border-oki-gold"
                    >
                      Request Access
                      <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                ) : (
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">{a.desc}</p>
                )}
                <div className="mt-8 h-px w-full bg-white/5 transition-colors duration-500 group-hover:bg-oki-gold/30" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-oki-surface">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <SectionTag index="H/03" label="Digital Asset Management" />
          <CryptoTicker />
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <KineticLines
                animate={false}
                lines={["Crypto, held like", "infrastructure."]}
                lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-5xl"
              />
              <Reveal delay={0.2} className="mt-8 max-w-md">
                <p className="text-sm leading-relaxed text-oki-muted">
                  Digital assets are governed by the same doctrine as every OKI position: acquired with conviction, structured through the Delaware architecture, and held with no intention to sell. Custody is institutional. Keys are distributed. The majority of the position never touches an internet-connected device.
                </p>
              </Reveal>
              <Reveal delay={0.3} className="mt-8">
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { label: "Bitcoin", id: "bitcoin", name: "Bitcoin" },
                    { label: "Ethereum", id: "ethereum", name: "Ethereum" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      data-testid={`chip-${c.id}`}
                      onClick={() => setActiveCoin(activeCoin?.id === c.id ? null : c)}
                      className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                        activeCoin?.id === c.id
                          ? "border-oki-gold bg-oki-gold text-oki-black"
                          : "border-oki-gold/30 text-oki-gold hover:border-oki-gold/70"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                  <CryptoSearch onSelect={(coin) => setActiveCoin(coin)} />
                </div>
                <AnimatePresence>
                  {activeCoin && (
                    <CryptoChart key={activeCoin.id} coin={activeCoin.id} name={activeCoin.name} onClose={() => setActiveCoin(null)} />
                  )}
                </AnimatePresence>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 gap-px self-start border border-white/10 bg-white/10 sm:grid-cols-2 md:col-span-7">
              {[
                { t: "Institutional Custody", d: "Qualified custodians and audited storage arrangements. No exchange balances held overnight." },
                { t: "Multi-Signature Governance", d: "No single keyholder can move assets. Transactions require quorum across offices and geographies." },
                { t: "Cold-Storage Majority", d: "The dominant share of the position is held in air-gapped, geographically distributed vaults." },
                { t: "Treasury Deployment", d: "Selective staking and protocol participation where yield is structural — never leveraged, never directional." },
              ].map((f, i) => (
                <Reveal key={f.t} delay={i * 0.1} className="card-glow bg-oki-black p-8 transition-colors duration-500 hover:bg-oki-elevated">
                  <h3 className="font-display text-lg font-medium tracking-tight text-oki-gold">{f.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-oki-muted">{f.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
