import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const links = [
  { to: "/holdings", label: "Holdings", id: "nav-holdings-link" },
  { to: "/strategy", label: "Strategy", id: "nav-strategy-link" },
  { to: "/about", label: "Architecture", id: "nav-architecture-link" },
];

export default function Nav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, "change", (v) => setVisible(v > 60));

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
              </NavLink>
            ))}
            <Link
              to="/contact"
              data-testid="nav-access-link"
              className="group flex items-center gap-2 border border-white/15 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-oki-text transition-colors duration-300 hover:border-oki-gold/60 hover:text-oki-gold"
            >
              Investor Access
              <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </nav>
          <button
            data-testid="nav-menu-toggle"
            onClick={() => setOpen(!open)}
            className="text-oki-text md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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
            {[...links, { to: "/contact", label: "Investor Access", id: "mobile-nav-access-link" }].map((l, i) => (
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
