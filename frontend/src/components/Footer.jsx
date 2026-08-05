import { Link } from "react-router-dom";
import { LogoMark } from "@/components/Logo";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="relative border-t border-white/10 bg-oki-black">
      <div className="mx-auto max-w-[1600px] px-6 pb-10 pt-20 md:px-12">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <LogoMark size={64} />
            <p className="mt-6 font-display text-2xl font-semibold tracking-[0.3em] text-oki-text">
              OKI <span className="text-oki-gold">INC.</span>
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-oki-faint">
              International Asset Holdings · Strategic Investments
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-oki-faint">
              A Delaware C-Corporation engineered for international asset ownership. Quiet power. Long-term control. Absolute precision.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Navigate</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/holdings" data-testid="footer-holdings-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Holdings & Assets</Link>
              <Link to="/strategy" data-testid="footer-strategy-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Strategy</Link>
              <Link to="/about" data-testid="footer-architecture-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Architecture</Link>
              <Link to="/contact" data-testid="footer-access-link" className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">Investor Access</Link>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Registered Office</p>
            <p className="mt-6 text-sm leading-relaxed text-oki-muted">
              16192 Coastal Highway<br />
              Lewes, Delaware 19958<br />
              United States of America
            </p>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">© 2026 OKI Inc. All rights reserved.</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Delaware C-Corporation · Established for Permanence</p>
        </div>
      </div>
    </footer>
  );
}
