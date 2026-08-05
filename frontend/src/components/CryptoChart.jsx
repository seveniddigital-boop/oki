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

const TIMEFRAMES = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
];

export default function CryptoChart({ coin, onClose }) {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    setData(null);
    let mounted = true;
    axios
      .get(`${API}/crypto-chart`, { params: { id: coin, days } })
      .then(({ data }) => mounted && setData(data))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [coin, days]);

  const chart = useMemo(() => {
    if (!data?.prices?.length) return null;
    const raw = data.prices;
    const step = Math.max(1, Math.floor(raw.length / 72));
    const pts = raw.filter((_, i) => i % step === 0).map((p) => ({ t: p[0], v: p[1] }));
    const values = pts.map((p) => p.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const x = (i) => PAD + (i * (W - PAD * 2)) / (pts.length - 1);
    const y = (v) => H - PAD - ((v - min) / range) * (H - PAD * 2);
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
    const area = `${line} L${x(pts.length - 1)},${H - PAD} L${PAD},${H - PAD} Z`;
    const first = values[0];
    const last = values[values.length - 1];
    return { line, area, min, max, first, last, change: ((last - first) / first) * 100, pts, x, y };
  }, [data]);

  const [hover, setHover] = useState(null);

  const onMove = (e) => {
    if (!chart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bd = Infinity;
    chart.pts.forEach((_, i) => {
      const d = Math.abs(chart.x(i) - svgX);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    setHover(best);
  };

  const formatTime = (t) =>
    days === 1
      ? new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });

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
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold">{COIN_NAMES[coin]}</span>
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.label}
                data-testid={`timeframe-${tf.label}`}
                onClick={() => setDays(tf.days)}
                className={`px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                  days === tf.days ? "bg-oki-gold text-oki-black" : "text-oki-faint hover:text-oki-gold"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
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
            <div className="relative">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-crosshair" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
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
                {hover !== null && (
                  <g data-testid="chart-crosshair">
                    <line
                      x1={chart.x(hover)} y1={PAD} x2={chart.x(hover)} y2={H - PAD}
                      stroke="#C5A059" strokeOpacity="0.4" strokeDasharray="3 3"
                    />
                    <circle cx={chart.x(hover)} cy={chart.y(chart.pts[hover].v)} r="4" fill="#050505" stroke="#C5A059" strokeWidth="2" />
                  </g>
                )}
              </svg>
              {hover !== null && (
                <div
                  data-testid="chart-tooltip"
                  className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap border border-oki-gold/30 bg-oki-black px-3 py-1.5 font-mono text-[10px] tracking-wide text-oki-text"
                  style={{ left: `${(chart.x(hover) / W) * 100}%` }}
                >
                  ${chart.pts[hover].v.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  <span className="ml-2 text-oki-faint">{formatTime(chart.pts[hover].t)}</span>
                </div>
              )}
            </div>
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
