import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import Magnetic from "@/components/Magnetic";
import LazyBg from "@/components/LazyBg";
import DataSkyline from "@/components/DataSkyline";
import FAQ from "@/components/FAQ";
import { BtcMini, nyseStatus } from "@/components/LiveMini";
import { KineticLines, Reveal, SectionTag, pageAnim } from "@/components/Kinetic";
import EditorialMarquee from "@/components/Marquee";

const EASE = [0.22, 1, 0.36, 1];

const HERO_DARK =
  "https://images.unsplash.com/photo-1593427995298-cad6731716d8?q=85&w=1600&auto=format&fit=crop";
const HERO_LIGHT =
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833?q=85&w=1600&auto=format&fit=crop";
const INTERLUDE_DARK =
  "https://images.unsplash.com/photo-1506383631675-0b110111327b?q=80&w=1200&auto=format&fit=crop";
const INTERLUDE_LIGHT =
  "https://images.unsplash.com/photo-1490800869828-a00247402454?q=80&w=1200&auto=format&fit=crop";

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
                Global Market Intelligence · Live Public Data
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

function HeroHud({ delay }) {
  const open = nyseStatus();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: EASE }}
      data-testid="hero-hud"
      className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em]"
    >
      <span className="flex items-center gap-2 text-oki-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${open ? "animate-pulse-slow bg-oki-gold" : "bg-oki-faint"}`} />
        NYSE {open ? "Open" : "Closed"}
      </span>
      <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 sm:block" />
      <BtcMini testId="hero-btc-ticker" className="flex" />
      <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 sm:block" />
      <span className="hidden text-oki-faint sm:block">Live Public Feed</span>
    </motion.div>
  );
}

function Hero({ instant }) {
  const D = (b) => (instant ? Math.max(0, b - 1.7) : b);
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
            transition={{ delay: D(1.7), duration: 2.2, ease: EASE }}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: D(2.4), duration: 1.4, ease: EASE }}
          className="absolute inset-x-0 bottom-0 h-[30vh] md:h-[36vh]"
        >
          <DataSkyline />
        </motion.div>
      </div>

      <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 mt-24 text-center will-change-transform md:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D(1.8), duration: 0.9, ease: EASE }}
          className="mb-6 flex items-center justify-center gap-5"
        >
          <LogoMark size={30} />
          <motion.p
            initial={{ opacity: 0, letterSpacing: "1.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ delay: D(1.8), duration: 1.4, ease: EASE }}
            className="font-mono text-[11px] uppercase text-oki-gold"
            data-testid="hero-overline"
          >
            Delaware C-Corporation
          </motion.p>
        </motion.div>
        <h1 className="font-display font-semibold leading-[0.82] tracking-tighter" data-testid="hero-headline">
          <KineticLines
            lines={["OKI"]}
            delay={D(1.7)}
            lineClassName="text-[34vw] md:text-[23vw] text-oki-text"
          />
          <KineticLines
            lines={["INC."]}
            delay={D(1.85)}
            lineClassName="text-[34vw] md:text-[23vw] text-outline-gold"
          />
        </h1>
        <HeroHud delay={D(2.5)} />
      </motion.div>

      <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 md:bottom-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: D(2.9), duration: 0.9, ease: EASE }}
        >
          <Magnetic>
            <Link
              to="/markets"
              data-testid="hero-explore-markets-btn"
              className="group flex items-center gap-3 whitespace-nowrap rounded-full border border-white/25 bg-oki-black/60 px-8 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-text backdrop-blur-md transition-colors duration-500 hover:border-oki-gold hover:text-oki-gold"
            >
              Explore Markets
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: D(2.6), duration: 0.9, ease: EASE }}
        className="absolute bottom-16 left-6 z-20 hidden max-w-xs md:left-12 lg:block"
      >
        <p className="font-display text-lg font-medium tracking-tight text-oki-text" data-testid="hero-subheadline">
          Global Markets. One Window. Zero Noise.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-oki-muted" data-testid="hero-statement">
          A young Delaware corporation publishing a clean, live read of Bitcoin and world equity markets. Just getting started. Going to the top.
        </p>
        <Link
          to="/contact"
          data-testid="hero-investor-access-btn"
          className="mt-4 inline-block border-b border-white/20 pb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-muted transition-colors duration-300 hover:border-oki-text hover:text-oki-text"
        >
          Contact
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: D(3.2), duration: 1 }}
        className="absolute bottom-10 right-6 z-20 hidden flex-col items-end gap-2 md:right-12 lg:flex"
      >
        <span className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-oki-faint">Scroll</span>
          <ArrowDown className="h-3 w-3 animate-pulse-slow text-oki-gold" />
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-oki-faint">BTC/USD · 30 Sessions</span>
      </motion.div>
    </section>
  );
}

const INTERLUDE_LINES = ["Think long.", "Move wisely.", "Leave a legacy."];

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
          <LazyBg
            src={INTERLUDE_DARK}
            className="tower-dark absolute inset-0 bg-cover bg-[center_30%]"
            style={{ filter: "brightness(0.7) saturate(0.8)" }}
          />
          <LazyBg
            src={INTERLUDE_LIGHT}
            className="tower-light absolute inset-0 bg-cover bg-[center_30%]"
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

const platform = [
  {
    n: "01",
    title: "Live Market Board",
    desc: "Crypto on the left, stocks on the right — one board, both markets. Every cell flips into a full working chart.",
    to: "/markets",
    img: "https://images.unsplash.com/photo-1689732888407-310424e3a372?q=80&w=1200&auto=format&fit=crop",
    tag: "Prices ⇄ Charts",
  },
  {
    n: "02",
    title: "Unified Search",
    desc: "Ten thousand digital assets and every listed equity, reachable through a single field. Type it, read it.",
    to: "/markets",
    img: "https://images.unsplash.com/photo-1526642591341-bcfc36ffae2f?q=80&w=1200&auto=format&fit=crop",
    tag: "Stocks + Crypto",
  },
  {
    n: "03",
    title: "Working Charts",
    desc: "Timeframes, crosshair, session ranges — the same instruments the desk reads, published without the noise.",
    to: "/markets",
    img: "https://images.unsplash.com/photo-1623227413711-25ee4388dae3?q=80&w=1200&auto=format&fit=crop",
    tag: "24H · 7D · 30D",
  },
  {
    n: "04",
    title: "Perspectives",
    desc: "Doctrine in writing. Essays on markets, corporate architecture, and the long climb — published when there is something worth saying.",
    to: "/insights",
    img: "https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?q=80&w=1200&auto=format&fit=crop",
    tag: "Essays",
  },
];

function PlatformSection() {
  const [hovered, setHovered] = useState(0);
  return (
    <section className="border-t border-white/10 bg-oki-surface">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionTag index="02" label="The Platform" />
            <KineticLines
              animate={false}
              lines={["Built like a terminal.", "Open like a window."]}
              lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
            />
          </div>
          <Reveal delay={0.2}>
            <Link
              to="/markets"
              data-testid="home-view-markets-link"
              className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold"
            >
              Open the Market Window
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="border-t border-white/10 lg:col-span-7">
            {platform.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <Link
                  to={p.to}
                  data-testid={`platform-row-${i}`}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  className="group flex items-center gap-6 border-b border-white/10 py-10 md:gap-10"
                >
                  <span className={`font-mono text-sm tracking-[0.2em] transition-colors duration-300 ${hovered === i ? "text-oki-gold" : "text-oki-faint"}`}>
                    {p.n}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl font-medium tracking-tighter text-oki-text transition-[transform,color] duration-500 ease-out group-hover:translate-x-2 group-hover:text-oki-gold md:text-4xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-oki-muted">{p.desc}</p>
                  </div>
                  <span className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-oki-faint transition-colors duration-300 group-hover:text-oki-gold sm:block">
                    {p.tag}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-oki-gold opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <Reveal delay={0.2} className="sticky top-32">
              <div data-testid="platform-preview" className="relative aspect-[4/5] overflow-hidden border border-white/10">
                {platform.map((p, i) => (
                  <div
                    key={p.n}
                    aria-hidden={hovered !== i}
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
                    style={{ backgroundImage: `url(${p.img})`, opacity: hovered === i ? 1 : 0 }}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 bg-black/30" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/10 bg-oki-black/70 px-5 py-3 backdrop-blur-md">
                  <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/70">
                    {platform[hovered].n} — {platform[hovered].title}
                  </p>
                  <span className="h-1.5 w-1.5 rotate-45 bg-oki-gold" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const edges = [
  { n: "E/01", title: "Ungated by design", text: "No account, no paywall, no velvet rope. Every price, chart, and essay on this platform is open — the way public data should be.", span: "md:col-span-7" },
  { n: "E/02", title: "Both markets, one desk", text: "Digital assets and equities are read side by side, not in silos. The correlations live where the screens meet.", span: "md:col-span-5" },
  { n: "E/03", title: "Structure before sentiment", text: "Liquidity, fundamentals, and policy come first. The opinion is voiced only after the analysis is finished.", span: "md:col-span-5" },
  { n: "E/04", title: "Built in public", text: "Founded 2026, publishing from day one. A young corporation earns trust the old way — by showing its work, every session.", span: "md:col-span-7" },
];

function EdgeSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
      <SectionTag index="03" label="Why OKI" />
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <KineticLines
              animate={false}
              lines={["The edge is", "the openness."]}
              lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-5xl"
            />
            <Reveal delay={0.2} className="mt-8 max-w-xs">
              <p className="text-sm leading-relaxed text-oki-muted">
                Four commitments, stated plainly. Everything else on this site follows from them.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px self-start border border-white/10 bg-white/10 md:col-span-8 md:grid-cols-12">
          {edges.map((e, i) => (
            <Reveal key={e.n} delay={i * 0.1} className={`${e.span} card-glow group bg-oki-black p-10 transition-colors duration-500 hover:bg-oki-elevated md:p-12`}>
              <p className="font-mono text-[10px] tracking-[0.3em] text-oki-faint transition-colors duration-300 group-hover:text-oki-gold">{e.n}</p>
              <h3 className="mt-6 font-display text-2xl font-medium tracking-tighter text-oki-text transition-colors duration-500 group-hover:text-oki-gold md:text-3xl">{e.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-oki-muted">{e.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const chapters = [
  { n: "01", title: "Watch", text: "Every index, every network, every session. The corporation maintains a continuous read of global markets — because attention, compounded daily, is an advantage in itself." },
  { n: "02", title: "Study", text: "Structure before sentiment. Liquidity cycles, network fundamentals, earnings quality — the analysis is finished before the opinion is voiced." },
  { n: "03", title: "Publish", text: "The window is open. The same live view OKI reads internally is published here — free, ungated, and built in public on the way to the top." },
];

function MethodSection() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
        <SectionTag index="04" label="The Method" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-32">
              <KineticLines
                animate={false}
                lines={["Information", "is the", "edge."]}
                lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-5xl"
              />
              <Reveal delay={0.2} className="mt-8">
                <Link
                  to="/strategy"
                  data-testid="home-method-strategy-link"
                  className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold"
                >
                  Read the full doctrine
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </Reveal>
            </div>
          </div>
          <div className="md:col-span-8">
            {chapters.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.1} className="group relative border-b border-white/10 py-12 pl-20 first:pt-0 last:border-b-0 md:py-14 md:pl-36">
                <span
                  aria-hidden="true"
                  className="text-outline pointer-events-none absolute left-0 top-6 select-none font-display text-6xl font-semibold leading-none transition-opacity duration-500 group-hover:opacity-40 md:text-8xl"
                >
                  {c.n}
                </span>
                <h3 className="font-display text-2xl font-medium tracking-tight text-oki-text transition-colors duration-300 group-hover:text-oki-gold md:text-3xl">{c.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-oki-muted md:text-base">{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const facts = [
  { k: "Founded", v: "2026" },
  { k: "Headquarters", v: "New York" },
  { k: "Incorporated", v: "Delaware" },
  { k: "Coverage", v: "BTC · Indices · Equities" },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [entered] = useState(() => sessionStorage.getItem("oki-entered") === "1");
  useEffect(() => {
    if (entered) {
      setLoaded(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("oki-entered", "1");
      setLoaded(true);
    }, 1700);
    return () => clearTimeout(t);
  }, [entered]);

  return (
    <motion.main data-testid="home-page" {...pageAnim}>
      {!entered && <Preloader done={loaded} />}
      <Hero instant={entered} />
      <EditorialMarquee />

      <section className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-44">
        <SectionTag index="01" label="The Position" />
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <KineticLines
              animate={false}
              lines={["A next-generation markets company,", "building the clearest public window", "into Bitcoin and world equities."]}
              lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
            />
            <Reveal delay={0.3} className="mt-10 max-w-xl">
              <p className="text-sm leading-relaxed text-oki-muted md:text-base">
                OKI Inc. is a Delaware C-Corporation headquartered in New York, organized around a single belief: the corporation that reads markets best rises fastest. We publish what we watch — live prices, indices, and commentary — in the open.
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
        <div className="mt-16 grid grid-cols-2 gap-px border border-white/10 bg-white/10 md:grid-cols-4">
          {facts.map((s, i) => (
            <Reveal key={s.k} delay={i * 0.1} className="bg-oki-surface p-8 md:p-10">
              <p className="font-display text-2xl font-semibold tracking-tight text-oki-gold md:text-4xl">{s.v}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">{s.k}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <PlatformSection />
      <EdgeSection />
      <MethodSection />
      <TowerInterlude />
      <FAQ />

      <section className="relative overflow-hidden border-t border-white/10">
        <LazyBg
          src="https://images.unsplash.com/photo-1588312744377-2adfb7b8578a?q=80&w=1200&auto=format&fit=crop"
          className="absolute inset-0 bg-cover bg-center"
          role="img"
          aria-label="Dark skyline silhouette"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(153,27,27,0.15)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-[1600px] px-6 py-36 text-center md:px-12">
          <KineticLines
            animate={false}
            lines={["Just getting started.", "Going to the top."]}
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
                Start a Conversation
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
