import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function MarketSearch({ onSelect }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [nonce, setNonce] = useState(0);
  const ref = useRef(null);
  const debounce = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  useEffect(() => {
    clearTimeout(debounce.current);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      setSearchError(false);
      try {
        const { data } = await axios.get(`${API}/market-search`, { params: { q } });
        setResults(data.results || []);
      } catch {
        setResults([]);
        setSearchError(true);
      }
      setSearching(false);
    }, 350);
    return () => clearTimeout(debounce.current);
  }, [q, nonce]);

  return (
    <div ref={ref} className="relative">
      <button
        data-testid="market-search-toggle"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
          open ? "border-oki-gold bg-oki-gold text-oki-black" : "border-oki-gold/30 text-oki-gold hover:border-oki-gold/70"
        }`}
      >
        <Search className="h-3 w-3" />
        Search Markets
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="market-search-window"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-40 mt-3 w-80 max-w-[85vw] border border-white/10 bg-oki-elevated shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">
                <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-oki-gold" />
                Market Search
              </span>
              <button onClick={() => setOpen(false)} data-testid="market-search-close" aria-label="Close search" className="text-oki-faint transition-colors duration-200 hover:text-oki-text">
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="border-b border-white/10 px-4 py-3">
              <input
                data-testid="market-search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Stocks or crypto — e.g. apple, solana"
                autoFocus
                className="w-full bg-transparent font-mono text-xs text-oki-text placeholder:text-oki-faint focus:outline-none"
              />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {q.trim().length < 2 && (
                <p className="px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-oki-faint">EQUITIES · ETFS · INDICES · 10,000+ DIGITAL ASSETS</p>
              )}
              {searching && <p className="px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-oki-faint">SEARCHING…</p>}
              {searchError && !searching && (
                <button
                  data-testid="market-search-retry"
                  onClick={() => setNonce((n) => n + 1)}
                  className="w-full px-4 py-3 text-left font-mono text-[10px] tracking-[0.2em] text-oki-gold"
                >
                  SEARCH UNAVAILABLE — TAP TO RETRY
                </button>
              )}
              {!searching && !searchError && q.trim().length >= 2 && results.length === 0 && (
                <p className="px-4 py-3 font-mono text-[10px] tracking-[0.2em] text-oki-faint">NO MARKETS FOUND</p>
              )}
              {results.map((r) => (
                <button
                  key={`${r.type}-${r.id}`}
                  data-testid={`market-result-${r.id}`}
                  onClick={() => {
                    onSelect({ id: r.id, name: r.name, type: r.type, symbol: r.symbol });
                    setOpen(false);
                    setQ("");
                    setResults([]);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-oki-gold/10"
                >
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-oki-text">{r.name}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="font-mono text-[10px] uppercase text-oki-faint">
                      {r.symbol}
                      {r.rank ? ` · #${r.rank}` : ""}
                    </span>
                    <span
                      className={`border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] ${
                        r.type === "stock" ? "border-oki-crimsonbright/50 text-oki-crimsonbright" : "border-oki-gold/50 text-oki-gold"
                      }`}
                    >
                      {r.type === "stock" ? "Stock" : "Crypto"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
