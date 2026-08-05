import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import Counter from "@/components/Counter";
import Magnetic from "@/components/Magnetic";
import { KineticLines, Reveal, SectionTag, PhotoReveal, pageAnim } from "@/components/Kinetic";
import EditorialMarquee from "@/components/Marquee";

const EASE = [0.22, 1, 0.36, 1];

const HERO_DARK =
  "https://images.unsplash.com/photo-1593427995298-cad6731716d8?q=85&w=1600&auto=format&fit=crop";
const HERO_LIGHT =
  "https://images.unsplash.com/photo-1515937228207-a2a00c751c3d?q=85&w=1600&auto=format&fit=crop";
const INTERLUDE_DARK =
  "https://images.unsplash.com/photo-1506383631675-0b110111327b?q=85&w=1600&auto=format&fit=crop";
const INTERLUDE_LIGHT =
  "https://images.unsplash.com/photo-1490800869828-a00247402454?q=85&w=1600&auto=format&fit=crop";

function Preloader({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          data-testid="preloader"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(https://images.unsplash.com/photo-1601923112035-3e4819c82317?q=85&w=1600&auto=format&fit=crop)" }}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: EASE }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: "var(--oki-bg-80)" }} />
          <div className="hero-bottom-fade absolute inset-0" />
          <div className="relative overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex flex-col items-center gap-5"
            >
              <LogoMark size={52} />
              <LogoWordmark className="text-base tracking-[0.5em]" />
              <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-oki-faint">
                International Asset Holdings · Strategic Investments
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
        <motion.div style={{ y: towerY }} className="absolute inset-x-0 -inset-y-[15%] will-change-transform">
          <motion.div
            initial={{ scale: 1.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.7, duration: 2.2, ease: EASE }}
            className="relative h-full w-full"
          >
            <div
              className="tower-dark absolute inset-0 bg-cover bg-[center_bottom]"
              style={{ backgroundImage: `url(${HERO_DARK})`, filter: "brightness(0.95) saturate(0.9)" }}
            />
            <div
              className="tower-light absolute inset-0 bg-cover bg-[center_25%]"
              style={{ backgroundImage: `url(${HERO_LIGHT})`, filter: "brightness(1.05)" }}
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="hero-grid animate-grid-drift absolute -inset-[120px]" />
        <div className="hero-top-fade absolute inset-0" />
        <div className="hero-bottom-fade absolute inset-0" />
      </div>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mt-24 text-center will-change-transform md:mt-16">
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

      <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 md:bottom-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.9, ease: EASE }}
        >
          <Magnetic>
            <Link
              to="/holdings"
              data-testid="hero-explore-holdings-btn"
              className="group flex items-center gap-3 whitespace-nowrap rounded-full border border-white/25 bg-oki-black/60 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-text backdrop-blur-md transition-colors duration-500 hover:border-oki-gold hover:text-oki-gold"
            >
              Explore Holdings
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
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

const INTERLUDE_LINES = ["We do not trade.", "We do not exit.", "We own time."];

function InterludeLine({ progress, index, line }) {
  const s = index / INTERLUDE_LINES.length;
  const opacity = useTransform(progress, [s + 0.03, s + 0.13, s + 0.25, s + 0.32], [0, 1, 1, 0]);
  const y = useTransform(progress, [s + 0.03, s + 0.32], [36, -36]);
  return (
    <motion.p
      style={{ opacity, y }}
      className="absolute inset-x-0 px-6 text-center font-display text-4xl font-medium tracking-tighter text-oki-text md:text-6xl"
    >
      {line}
    </motion.p>
  );
}

function TowerInterlude() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  return (
    <section ref={ref} data-testid="tower-interlude" className="relative h-[260vh] border-t border-white/10">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-x-0 -inset-y-[10%] will-change-transform">
          <div
            className="tower-dark absolute inset-0 bg-cover bg-[center_30%]"
            style={{ backgroundImage: `url(${INTERLUDE_DARK})`, filter: "brightness(0.7) saturate(0.8)" }}
          />
          <div
            className="tower-light absolute inset-0 bg-cover bg-[center_30%]"
            style={{ backgroundImage: `url(${INTERLUDE_LIGHT})` }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        </motion.div>
        <div className="relative z-10 h-24 w-full">
          {INTERLUDE_LINES.map((line, i) => (
            <InterludeLine key={line} progress={scrollYProgress} index={i} line={line} />
          ))}
        </div>
      </div>
    </section>
  );
}

const chapters = [
  { n: "01", title: "Acquire", text: "Conviction before consensus. Positions are taken whole — equity, real assets, intellectual property, private credit, digital networks — and taken to keep." },
  { n: "02", title: "Structure", text: "Every asset is domiciled under Delaware law, insulated by design and defended by precedent. Jurisdiction is chosen the way generals choose terrain." },
  { n: "03", title: "Hold", text: "Permanence as policy. Capital that never has to sell ends up owning what others cannot afford to keep." },
];

const allocation = [
  { label: "Equity Holdings", value: "36%", span: "md:col-span-5" },
  { label: "Strategic Real Assets", value: "24%", span: "md:col-span-7" },
  { label: "Digital Assets & Crypto", value: "16%", span: "md:col-span-4" },
  { label: "IP & Intangibles", value: "14%", span: "md:col-span-4" },
  { label: "Private Credit & Special Situations", value: "10%", span: "md:col-span-4" },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.main data-testid="home-page" {...pageAnim}>
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
                OKI Inc. is a Delaware C-Corporation organized for the acquisition, structuring, and long-duration ownership of strategic assets across international markets. The corporation operates under a single mandate: disciplined control that compounds without expiry.
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
            { k: "Continents", n: 4 },
            { k: "Jurisdictions", n: 12 },
            { k: "Time Horizon", v: "Generational" },
          ].map((s, i) => (
            <Reveal key={s.k} delay={i * 0.12} className="bg-oki-surface p-10">
              {s.n ? (
                <Counter to={s.n} className="font-display text-4xl font-semibold tracking-tight text-oki-gold md:text-5xl" />
              ) : (
                <p className="font-display text-4xl font-semibold tracking-tight text-oki-gold md:text-5xl">{s.v}</p>
              )}
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

      <TowerInterlude />

      <section className="relative overflow-hidden border-t border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Global skyline at dusk — OKI Inc. international reach"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1496588152823-86ff7695e68f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwxfHxza3lsaW5lJTIwcGFub3JhbWElMjBkdXNrfGVufDB8fHx8MTc4NTg5MjMyNnww&ixlib=rb-4.1.0&q=85)" }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-veil)" }} />
        <div className="relative mx-auto max-w-[1600px] px-6 py-32 text-center md:px-12 md:py-40">
          <KineticLines
            animate={false}
            lines={["Structure is the moat.", "Time is the multiplier."]}
            lineClassName="font-display text-3xl font-medium leading-[1.1] tracking-tighter text-oki-text md:text-5xl"
          />
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
          <Reveal delay={0.3} className="mt-12 flex flex-col items-center justify-center gap-6 md:flex-row">
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
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/api/deck`}
              data-testid="home-download-deck-btn"
              className="border-b border-white/20 pb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-muted transition-colors duration-300 hover:border-oki-text hover:text-oki-text"
            >
              Corporate Deck (PDF)
            </a>
          </Reveal>
        </div>
      </section>
    </motion.main>
  );
}
