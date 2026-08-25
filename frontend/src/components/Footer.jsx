import { Link } from "react-router-dom";
import { LogoMark, LogoWordmark } from "@/components/Logo";

const nav = [
  { to: "/acquisitions", label: "Investments", id: "footer-acquisitions-link" },
  { to: "/markets", label: "Intelligence", id: "footer-markets-link" },
  { to: "/strategy", label: "Strategy", id: "footer-strategy-link" },
  { to: "/about", label: "Architecture", id: "footer-architecture-link" },
  { to: "/insights", label: "Perspectives", id: "footer-insights-link" },
  { to: "/contact", label: "Contact", id: "footer-access-link" },
];

const plat = [
  { to: "/markets#board", label: "Live Board", id: "footer-plat-board-link" },
  { to: "/markets#window", label: "Asset Search", id: "footer-plat-search-link" },
  { to: "/markets#charts", label: "Working Charts", id: "footer-plat-charts-link" },
];

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
          <div className="md:col-span-5">
            <LogoMark size={64} />
            <LogoWordmark gold className="mt-6 text-2xl tracking-[0.3em]" />
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.4em] text-oki-faint">
              International Holdings &amp; Investments · Private Capital
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-oki-faint">
              An international corporation built around ownership — operating companies, real assets, and digital platforms, acquired and managed for the long term. Just getting started. Going to the top.
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Navigate</p>
            <div className="mt-6 flex flex-col gap-3">
              {nav.map((l) => (
                <Link key={l.id} to={l.to} data-testid={l.id} className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-oki-faint">Platform</p>
            <div className="mt-6 flex flex-col gap-3">
              {plat.map((l) => (
                <Link key={l.id} to={l.to} data-testid={l.id} className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">
                  {l.label}
                </Link>
              ))}
              <a
                href={`${process.env.REACT_APP_BACKEND_URL}/api/deck`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-deck-link"
                className="text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold"
              >
                Corporate Deck (PDF)
              </a>
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
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@okiinc.global&su=Inquiry%20for%20OKI%20Inc." target="_blank" rel="noopener noreferrer" data-testid="footer-email-link" className="mt-2 block text-sm text-oki-muted transition-colors duration-300 hover:text-oki-gold">
              contact@okiinc.global
            </a>
            <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">Incorporated in Delaware</p>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-white/5 pt-8 lg:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">OKI Inc. · Delaware C-Corporation · Established 2026, New York</p>
          <p className="max-w-xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-oki-faint">
            Live public market data · Delayed where applicable · Nothing on this site constitutes investment advice
          </p>
        </div>
      </div>
    </footer>
  );
}
