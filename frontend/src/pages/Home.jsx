import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
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
            <motion.p
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="font-display text-2xl font-medium tracking-[0.4em] text-oki-text"
            >
              OKI<span className="text-oki-gold">.</span>
            </motion.p>
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
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 60, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3, 3]), { stiffness: 60, damping: 20 });

  const onMouseMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      data-testid="hero-section"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden"
      style={{ perspective: 1200 }}
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="hero-grid animate-grid-drift absolute inset-0" />
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(153,27,27,0.18)_0%,transparent_60%)]" />
        <div className="absolute -bottom-60 -left-40 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#050505_5%,transparent_60%)]" />
      </motion.div>

      <motion.div style={{ rotateX, rotateY, opacity: fade }} className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-24 md:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 1 }}
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.5em] text-oki-gold"
          data-testid="hero-overline"
        >
          Delaware C-Corporation
        </motion.p>

        <h1 className="font-display font-semibold leading-[0.82] tracking-tighter" data-testid="hero-headline">
          <KineticLines
            lines={["OKI"]}
            delay={1.7}
            lineClassName="text-[26vw] md:text-[19vw] text-oki-text"
          />
          <KineticLines
            lines={["INC."]}
            delay={1.85}
            lineClassName="text-[26vw] md:text-[19vw] text-outline-gold"
          />
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <KineticLines
              lines={["International Asset Holdings.", "Global Control."]}
              delay={2.1}
              lineClassName="font-display text-2xl font-medium tracking-tight text-oki-text md:text-3xl"
            />
          </div>
          <div className="md:col-span-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.9, ease: EASE }}
              className="max-w-sm text-sm leading-relaxed text-oki-muted"
              data-testid="hero-statement"
            >
              We acquire, structure, and hold strategic assets across borders. Ownership is the strategy.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.9, ease: EASE }}
            className="flex items-end gap-4 md:col-span-3 md:justify-end"
          >
            <Link
              to="/holdings"
              data-testid="hero-explore-holdings-btn"
              className="group relative overflow-hidden border border-oki-gold/50 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-gold transition-colors duration-500 hover:text-oki-black"
            >
              <span className="absolute inset-0 -translate-x-full bg-oki-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2">
                Explore Holdings
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
            <Link
              to="/contact"
              data-testid="hero-investor-access-btn"
              className="border-b border-white/20 pb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-muted transition-colors duration-300 hover:border-oki-text hover:text-oki-text"
            >
              Investor Access
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 hidden items-center gap-3 md:right-12 lg:flex"
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
        <KineticLines
          animate={false}
          lines={["A next-generation global holding company,", "engineered to control high-value assets", "across continents."]}
          lineClassName="font-display text-4xl font-medium leading-[1.05] tracking-tighter text-oki-text md:text-6xl"
        />
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
