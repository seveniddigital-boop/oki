import { useEffect, useRef, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { LogoMark, LogoWordmark } from "@/components/Logo";
import Home from "@/pages/Home";
import Holdings from "@/pages/Holdings";
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

function currentTheme() {
  return localStorage.getItem("oki-theme") || europeanTheme();
}

const PAGE_META = {
  "/": ["OKI Inc. — International Asset Holdings", "OKI Inc. is a Delaware C-Corporation engineered for international asset ownership. We acquire, structure, and hold strategic assets across borders. Ownership is the strategy."],
  "/holdings": ["Holdings & Assets — OKI Inc.", "A consolidated view of the OKI Inc. portfolio: equity holdings, strategic real assets, intellectual property, and private credit — structured for control and held on a generational horizon."],
  "/strategy": ["Strategy — OKI Inc.", "The OKI doctrine: identify high-conviction global assets, structure them through Delaware holding architecture, and hold with long-duration control orientation."],
  "/about": ["Corporate Architecture — OKI Inc.", "OKI Inc. is a Delaware C-Corporation — the optimal vehicle for international asset ownership. Governance, leadership offices, and the registered office at 16192 Coastal Highway, Lewes, Delaware."],
  "/insights": ["Perspectives — OKI Inc.", "Doctrine, architecture, and capital discipline — essays and announcements from OKI Inc."],
  "/contact": ["Investor Access — OKI Inc.", "Serious capital and strategic conversations only. All inquiries are reviewed by the Chief Investment Office of OKI Inc."],
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
                  International Asset Holdings · Strategic Investments
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

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/holdings" element={<Holdings />} />
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

  return (
    <div className="App grain">
      <BrowserRouter>
        <RouteMeta />
        <CustomCursor />
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
