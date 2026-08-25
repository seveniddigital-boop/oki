import { useEffect, useRef, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import Telemetry from "@/components/Telemetry";
import BackToTop from "@/components/BackToTop";
import { playClick } from "@/utils/clickSound";
import Home from "@/pages/Home";
import Markets from "@/pages/Markets";
import Acquisitions from "@/pages/Acquisitions";
import Strategy from "@/pages/Strategy";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Insights from "@/pages/Insights";

function europeanTheme() {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hour: "numeric", hour12: false }).format(new Date()),
      10
    );
    return hour >= 7 && hour < 19 ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function systemTheme() {
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  } catch {
    return null;
  }
}

function currentTheme() {
  return localStorage.getItem("oki-theme") || systemTheme() || europeanTheme();
}

const PAGE_META = {
  "/": ["OKI Inc. — International Investment & Strategic Holdings", "OKI Inc. is an international investment and strategic holdings corporation — acquiring, holding, and managing businesses and assets, from operating companies and real assets to technology and digital platforms."],
  "/acquisitions": ["Acquisitions — OKI Inc.", "The OKI mandate: operating businesses, technology, digital and online assets, brands & IP, real estate, and strategic holdings. Criteria, process, and portfolio philosophy — stated plainly."],
  "/markets": ["Market Intelligence — OKI Inc.", "The research arm behind the acquisition mandate: live Bitcoin data, major indices, and selected equities — published openly by OKI Inc."],
  "/strategy": ["Strategy — OKI Inc.", "The OKI method: watch continuously, study structure before sentiment, and publish in the open. Attention is the strategy."],
  "/about": ["Corporate Architecture — OKI Inc.", "OKI Inc. is a Delaware C-Corporation headquartered at One World Trade Center, New York. Governance, leadership offices, and headquarters."],
  "/insights": ["Perspectives — OKI Inc.", "Essays on ownership, markets, and corporate architecture from OKI Inc."],
  "/contact": ["Contact — OKI Inc.", "One office, one line. Headquarters, phone, and corporate details of OKI Inc. — One World Trade Center, 85th Floor, New York."],
};

function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, desc] = PAGE_META[pathname] || PAGE_META["/"];
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", desc);
  }, [pathname]);
  return null;
}

const EASE = [0.22, 1, 0.36, 1];

const VEIL_BG =
  "https://images.unsplash.com/photo-1601923112035-3e4819c82317?q=85&w=1600&auto=format&fit=crop";

function TransitionVeil() {
  const { pathname } = useLocation();
  const [veilKey, setVeilKey] = useState(null);
  const prev = useRef(pathname);

  useEffect(() => {
    if (prev.current !== pathname) {
      prev.current = pathname;
      setVeilKey(`${pathname}-${Date.now()}`);
    }
  }, [pathname]);

  useEffect(() => {
    if (!veilKey) return;
    const t = setTimeout(() => setVeilKey(null), 1500);
    return () => clearTimeout(t);
  }, [veilKey]);

  return (
    <AnimatePresence>
      {veilKey && (
        <motion.div
          key={veilKey}
          data-testid="page-transition-veil"
          className="pointer-events-none fixed inset-0 z-[150] overflow-hidden"
          style={{ backgroundColor: "var(--oki-bg)" }}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${VEIL_BG})` }} />
          <div className="absolute inset-0" style={{ backgroundColor: "var(--oki-bg-80)" }} />
          <div className="hero-bottom-fade absolute inset-0" />
          <div className="relative flex h-full items-center justify-center">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
                className="flex flex-col items-center gap-5"
              >
                <LogoMark size={52} />
                <LogoWordmark className="text-base tracking-[0.5em]" />
                <p className="font-mono text-[9px] uppercase tracking-[0.45em] text-oki-faint">
                  Private Capital · Strategic Acquisitions · Long-Term Value
                </p>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-oki-gold"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.div
      data-testid="scroll-progress"
      className="fixed left-0 top-0 z-[140] h-0.5 w-full origin-left bg-oki-gold"
      style={{ scaleX }}
    />
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/acquisitions" element={<Acquisitions />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/strategy" element={<Strategy />} />
        <Route path="/about" element={<About />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = currentTheme();
    };
    apply();
    const id = setInterval(apply, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.closest("a, button, [role='button']")) playClick();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <RouteMeta />
        <CustomCursor />
        <ScrollProgress />
        <Telemetry />
        <BackToTop />
        <TransitionVeil />
        <SmoothScroll>
          <Nav />
          <AnimatedRoutes />
          <Footer />
        </SmoothScroll>
      </BrowserRouter>
    </div>
  );
}

export default App;
