import { Link } from "react-router-dom";
import { LogoMark, LogoWordmark } from "@/components/Logo";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative overflow-hidden border-t border-white/10 bg-oki-black">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-semibold leading-none tracking-tighter text-outline opacity-60"
      >
        OKI INC.
      </div>
      <div className="relative mx-auto max-w-[1600px] px-6 pb-10 pt-20 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <LogoMark size={64} />
            <LogoWordmark gold className="mt-6 text-2xl tracking-[0.3em]" />
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-oki-faint">
              Global Market Intelligence · Live Public Data
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-oki-faint">
              A young Delaware C-Corporation publishing a clean, live window into Bitcoin and world equity markets. Just getting started. Going to the top.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Navigate</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/markets" data-testid="footer-markets-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Market Window</Link>
              <Link to="/strategy" data-testid="footer-strategy-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Strategy</Link>
              <Link to="/about" data-testid="footer-architecture-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Architecture</Link>
              <Link to="/contact" data-testid="footer-access-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Contact</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Corporate Headquarters</p>
            <p className="mt-6 text-sm leading-relaxed text-oki-muted">
              One World Trade Center, 85th Floor<br />
              New York, NY 10007<br />
              United States of America
            </p>
            <a href="tel:+12122208443" data-testid="footer-phone-link" className="mt-3 inline-block text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">
              +1 (212) 220-8443
            </a>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">Incorporated in Delaware</p>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">OKI Inc. · Delaware C-Corporation</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Established 2026 · New York</p>
        </div>
      </div>
    </footer>
  );
}
