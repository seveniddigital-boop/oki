import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, Sun, Moon, Volume2, VolumeX } from "lucide-react";
import Logo from "@/components/Logo";
import { isSoundOn, setSound } from "@/utils/clickSound";

const links = [
  { to: "/markets", label: "Markets", id: "nav-markets-link" },
  { to: "/strategy", label: "Strategy", id: "nav-strategy-link" },
  { to: "/about", label: "Architecture", id: "nav-architecture-link" },
  { to: "/insights", label: "Perspectives", id: "nav-insights-link" },
];

export default function Nav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [sound, setSoundState] = useState(true);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 60));

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
    setSoundState(isSoundOn());
  }, []);

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setSoundState(next);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("oki-theme", next);
    document.documentElement.dataset.theme = next;
    setTheme(next);
  };

  const show = visible || pathname !== "/" || open;

  return (
    <>
      <motion.header
        data-testid="main-nav"
        initial={false}
        animate={{ y: show ? 0 : -80, opacity: show ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-oki-black/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-12">
          <Link to="/" data-testid="nav-logo-link" aria-label="OKI Inc. home">
            <Logo size={22} />
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-testid={l.id}
                className={({ isActive }) =>
                  `group relative font-mono text-[11px] uppercase tracking-[0.3em] transition-colors duration-300 ${
                    isActive ? "text-oki-gold" : "text-oki-muted hover:text-oki-text"
                  }`
                }
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-oki-gold transition-[width] duration-300 group-hover:w-full" />
              </NavLink>
            ))}
            <button
              onClick={toggleSound}
              data-testid="sound-toggle"
              aria-label="Toggle click sounds"
              title="Turn click sounds on or off"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-oki-muted transition-colors duration-300 hover:border-oki-gold/60 hover:text-oki-gold"
            >
              {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle"
              aria-label="Toggle dark and light theme"
              title="Theme follows European day/night by default — tap to override"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-oki-muted transition-colors duration-300 hover:border-oki-gold/60 hover:text-oki-gold"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <Link
              to="/contact"
              data-testid="nav-access-link"
              className="group flex items-center gap-2 border border-white/15 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-text transition-colors duration-300 hover:border-oki-gold/60 hover:text-oki-gold"
            >
              Contact
              <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleSound}
              data-testid="sound-toggle-mobile"
              aria-label="Toggle click sounds"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-oki-muted transition-colors duration-300 hover:border-oki-gold/60 hover:text-oki-gold"
            >
              {sound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-mobile"
              aria-label="Toggle dark and light theme"
              className="flex h-9 w-9 items-center justify-center border border-white/15 text-oki-muted transition-colors duration-300 hover:border-oki-gold/60 hover:text-oki-gold"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
            <button
              data-testid="nav-menu-toggle"
              onClick={() => setOpen(!open)}
              className="text-oki-text"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-oki-black/95 px-8 backdrop-blur-xl md:hidden"
          >
            {[...links, { to: "/contact", label: "Contact", id: "mobile-nav-access-link" }].map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <NavLink
                  to={l.to}
                  data-testid={l.id.replace("nav-", "mobile-nav-")}
                  onClick={() => setOpen(false)}
                  className="block border-b border-white/10 py-6 font-display text-3xl font-medium tracking-tight text-oki-text"
                >
                  {l.label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
