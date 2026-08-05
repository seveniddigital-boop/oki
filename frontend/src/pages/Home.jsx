import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import Tower from "@/components/Tower";
import { KineticLines, Reveal, SectionTag } from "@/components/Kinetic";
import EditorialMarquee from "@/components/Marquee";

const EASE = [0.22, 1, 0.36, 1];

function Preloader({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          data-testid="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-oki-black"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex flex-col items-center gap-5"
            >
              <LogoMark size={44} />
              <p className="font-display text-sm font-medium tracking-[0.5em] text-oki-text">
                OKI <span className="text-oki-gold">INC.</span>
              </p>
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-oki-gold"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const towerY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      data-testid="hero-section"
      className="relative flex min-h-screen flex-col items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="hero-grid animate-grid-drift absolute inset-0" />
        <div className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_55%)]" />
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(153,27,27,0.14)_0%,transparent_60%)]" />
        <div className="hero-bottom-fade absolute inset-0" />
      </div>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-0 mt-24 text-center md:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.9, ease: EASE }}
          className="mb-6 flex items-center justify-center gap-5"
        >
          <LogoMark size={30} />
          <p
            className="font-mono text-[11px] uppercase tracking-[0.5em] text-oki-gold"
            data-testid="hero-overline"
          >
            Delaware C-Corporation
          </p>
        </motion.div>
        <h1 className="font-display font-semibold leading-[0.82] tracking-tighter" data-testid="hero-headline">
          <KineticLines
            lines={["OKI"]}
            delay={1.7}
            lineClassName="text-[34vw] md:text-[23vw] text-oki-text"
          />
          <KineticLines
            lines={["INC."]}
            delay={1.85}
            lineClassName="text-[34vw] md:text-[23vw] text-outline-gold"
          />
        </h1>
      </motion.div>

      <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          initial={{ y: "55%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ delay: 2.1, duration: 1.6, ease: EASE }}
        >
          <motion.div style={{ y: towerY }}>
            <Tower className="h-[62vh] w-auto md:h-[74vh]" />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 md:bottom-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.9, ease: EASE }}
        >
          <Link
            to="/holdings"
            data-testid="hero-explore-holdings-btn"
            className="group flex items-center gap-3 whitespace-nowrap rounded-full border border-white/25 bg-oki-black/60 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-text backdrop-blur-md transition-colors duration-500 hover:border-oki-gold hover:text-oki-gold"
          >
            Explore Holdings
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 0.9, ease: EASE }}
        className="absolute bottom-10 left-6 z-20 hidden max-w-xs md:left-12 lg:block"
      >
        <p className="font-display text-lg font-medium tracking-tight text-oki-text" data-testid="hero-subheadline">
          International Asset Holdings. Global Control.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-oki-muted" data-testid="hero-statement">
          We acquire, structure, and hold strategic assets across borders. Ownership is the strategy.
        </p>
        <Link
          to="/contact"
          data-testid="hero-investor-access-btn"
          className="mt-4 inline-block border-b border-white/20 pb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-muted transition-colors duration-300 hover:border-oki-text hover:text-oki-text"
        >
          Investor Access
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute bottom-10 right-6 z-20 hidden items-center gap-3 md:right-12 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-oki-faint">Scroll</span>
        <ArrowDown className="h-3 w-3 animate-pulse-slow text-oki-gold" />
      </motion.div>
    </section>
  );
}

const chapters = [
  { n: "01", title: "Acquire", text: "High-conviction assets are identified across continents — equity positions, real assets, intellectual property, private credit. We move before consensus forms." },
  { n: "02", title: "Structure", text: "Every position is held through Delaware holding architecture — liability-insulated, jurisdiction-optimized, engineered for permanence." },
  { n: "03", title: "Hold", text: "Long-duration control orientation. We do not trade. We do not exit. Ownership compounds; everything else is noise." },
];

const allocation = [
  { label: "Equity Holdings", value: "42%", span: "md:col-span-7" },
  { label: "Strategic Real Assets", value: "28%", span: "md:col-span-5" },
  { label: "IP & Intangibles", value: "18%", span: "md:col-span-5" },
  { label: "Private Credit & Special Situations", value: "12%", span: "md:col-span-7" },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <main data-testid="home-page">
      <Preloader done={loaded} />
      <Hero />
      <EditorialMarquee />

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
        <SectionTag index="01" label="The Position" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <KineticLines
              animate={false}
              lines={["A next-generation global holding company,", "engineered to control high-value assets", "across continents."]}
              lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
            />
            <Reveal delay={0.3} className="mt-10 max-w-xl">
              <p className="text-sm leading-relaxed text-oki-muted md:text-base">
                OKI Inc. is a Delaware C-Corporation organized for the acquisition, structuring, and long-duration ownership of strategic assets across international markets. The corporation operates under a single mandate: disciplined control that compounds across generations.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.2} className="group relative overflow-hidden border border-white/10">
              <div
                className="aspect-[3/4] w-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: "url(https://images.unsplash.com/photo-1723023505659-fde32810e0d1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBkYXJrJTIwdG93ZXIlMjBmYWNhZGUlMjBkZXRhaWx8ZW58MHx8fHwxNzg1ODEyNjIzfDA&ixlib=rb-4.1.0&q=85)" }}
              />
              <div className="absolute inset-0 bg-black/20" />
              <p className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/60">Fig. 01 — Vertical Dominance</p>
            </Reveal>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          {[
            { k: "Continents", v: "04" },
            { k: "Jurisdictions", v: "12" },
            { k: "Time Horizon", v: "Generational" },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 0.12} className="bg-oki-surface p-10">
              <p className="font-display text-4xl font-semibold tracking-tight text-oki-gold md:text-5xl">{s.v}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">{s.k}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-oki-surface">
        <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionTag index="02" label="Holdings Preview" />
              <KineticLines
                animate={false}
                lines={["Where capital", "is deployed."]}
                lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
              />
            </div>
            <Reveal delay={0.2}>
              <Link
                to="/holdings"
                data-testid="home-view-holdings-link"
                className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold"
              >
                Full Holdings Dashboard
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-px border border-white/10 bg-white/10 md:grid-cols-12">
            {allocation.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.1} className={`${a.span} card-glow group bg-oki-black p-10 transition-colors duration-500 hover:bg-oki-elevated`}>
                <p className="font-display text-5xl font-semibold tracking-tighter text-oki-text transition-colors duration-500 group-hover:text-oki-gold md:text-6xl">{a.value}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">{a.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
        <SectionTag index="03" label="The Doctrine" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <KineticLines
              animate={false}
              lines={["Ownership", "is the", "strategy."]}
              lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-5xl"
            />
          </div>
          <div className="md:col-span-8">
            {chapters.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.1} className="group flex gap-8 border-b border-white/10 py-10 first:pt-0">
                <span className="font-mono text-sm text-oki-gold">{c.n}</span>
                <div>
                  <h3 className="font-display text-2xl font-medium tracking-tight text-oki-text transition-colors duration-300 group-hover:text-oki-gold">{c.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-oki-muted">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1588312744377-2adfb7b8578a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwxfHxkYXJrJTIwc2t5bGluZSUyMHNpbGhvdWV0dGUlMjBuaWdodHxlbnwwfHx8fDE3ODU4MTI2MjN8MA&ixlib=rb-4.1.0&q=85)" }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(153,27,27,0.15)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-36 text-center md:px-12">
          <KineticLines
            animate={false}
            lines={["The outcome is", "already decided."]}
            lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-7xl"
          />
          <Reveal delay={0.3} className="mt-12">
            <Link
              to="/contact"
              data-testid="home-cta-access-btn"
              className="group relative inline-flex overflow-hidden border border-oki-gold/50 px-10 py-5 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold transition-colors duration-500 hover:text-oki-black"
            >
              <span className="absolute inset-0 -translate-x-full bg-oki-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2">
                Request Investor Access
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
