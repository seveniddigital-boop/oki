import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COIN_NAMES = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  solana: "Select L1 · Solana",
};

const W = 560, H = 200, PAD = 12;

export default function CryptoChart({ coin, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    let mounted = true;
    axios
      .get(`${API}/crypto-chart`, { params: { id: coin, days: 7 } })
      .then(({ data }) => mounted && setData(data))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [coin]);

  const chart = useMemo(() => {
    if (!data?.prices?.length) return null;
    const raw = data.prices;
    const step = Math.max(1, Math.floor(raw.length / 72));
    const pts = raw.filter((_, i) => i % step === 0).map((p) => p[1]);
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;
    const x = (i) => PAD + (i * (W - PAD * 2)) / (pts.length - 1);
    const y = (v) => H - PAD - ((v - min) / range) * (H - PAD * 2);
    const line = pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const area = `${line} L${x(pts.length - 1)},${H - PAD} L${PAD},${H - PAD} Z`;
    const first = pts[0];
    const last = pts[pts.length - 1];
    return { line, area, min, max, first, last, change: ((last - first) / first) * 100 };
  }, [data]);

  const up = (chart?.change ?? 0) >= 0;

  return (
    <motion.div
      data-testid={`crypto-chart-${coin}`}
      initial={{ opacity: 0, y: 16, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 16, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 overflow-hidden border border-white/10 bg-oki-black"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold">{COIN_NAMES[coin]}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-oki-faint">7D · USD</span>
        </div>
        <button onClick={onClose} data-testid="crypto-chart-close" aria-label="Close chart" className="text-oki-faint transition-colors duration-200 hover:text-oki-text">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-5">
        {chart ? (
          <>
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-display text-2xl font-semibold tracking-tight text-oki-text">
                ${chart.last.toLocaleString("en-US", { maximumFractionDigits: chart.last < 10 ? 2 : 0 })}
              </span>
              <span className={`flex items-center gap-1 font-mono text-xs ${up ? "text-oki-gold" : "text-oki-crimsonbright"}`}>
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(chart.change).toFixed(2)}%
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              <defs>
                <linearGradient id={`chartFill-${coin}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0.33, 0.66].map((f) => (
                <line key={f} x1={PAD} x2={W - PAD} y1={H * f} y2={H * f} stroke="var(--chart-grid)" />
              ))}
              <motion.path
                d={chart.area}
                fill={`url(#chartFill-${coin})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
              <motion.path
                d={chart.line}
                fill="none"
                stroke="#C5A059"
                strokeWidth="1.75"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-oki-faint">
              <span>L ${chart.min.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
              <span>H ${chart.max.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
            </div>
          </>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <span className="h-px w-24 animate-pulse-slow bg-oki-gold/50" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
