import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { chartKey, getCachedChart, setCachedChart } from "@/lib/chartCache";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ASSET_BRIEFS = {
  bitcoin: "The original digital network — tracked here as live public market data, not advice.",
  ethereum: "The settlement layer for programmable value — followed as emerging financial infrastructure.",
  solana: "A high-throughput network on the OKI watchlist — live data, no noise.",
  "^GSPC": "The benchmark of American enterprise — the index every session is measured against.",
};

const W = 560, H = 200, PAD = 12;

const TIMEFRAMES = [
  { label: "24H", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
];

export default function MarketChart({ id, type, name, badge, onClose, embedded }) {
  const [data, setData] = useState(() => getCachedChart(chartKey(type, id, 7)));
  const [error, setError] = useState(false);
  const [days, setDays] = useState(7);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    const key = chartKey(type, id, days);
    const cached = getCachedChart(key);
    if (cached) {
      setData(cached);
      setError(false);
      return undefined;
    }
    setData(null);
    setError(false);
    const ctrl = new AbortController();
    fetch(`${API}/market-chart?id=${encodeURIComponent(id)}&type=${type}&days=${days}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("chart");
        return r.json();
      })
      .then((d) => {
        setCachedChart(key, d);
        setData(d);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => ctrl.abort();
  }, [id, type, days, reloadNonce]);

  const chart = useMemo(() => {
    if (!data?.prices?.length) return null;
    const raw = data.prices;
    const step = Math.max(1, Math.floor(raw.length / 72));
    const pts = raw.filter((_, i) => i % step === 0).map((p) => ({ t: p[0], v: p[1] }));
    const values = pts.map((p) => p.v);
    let min = Infinity;
    let max = -Infinity;
    for (const v of values) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
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
  const svgRef = useRef(null);
  const rectRef = useRef(null);
  const rafRef = useRef(0);

  // Cache the SVG rect on pointer entry / resize instead of measuring every move.
  const cacheRect = () => {
    rectRef.current = svgRef.current?.getBoundingClientRect() || null;
  };

  useEffect(() => {
    const invalidate = () => {
      rectRef.current = null;
    };
    window.addEventListener("resize", invalidate);
    return () => {
      window.removeEventListener("resize", invalidate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onMove = (e) => {
    if (!chart) return;
    if (!rectRef.current) cacheRect();
    const rect = rectRef.current;
    if (!rect) return;
    const clientX = e.clientX;
    if (rafRef.current) return; // coalesce to one update per frame
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const n = chart.pts.length;
      const svgX = ((clientX - rect.left) / rect.width) * W;
      let idx = Math.round(((svgX - PAD) / (W - PAD * 2)) * (n - 1));
      idx = Math.max(0, Math.min(n - 1, idx));
      setHover(idx);
    });
  };

  const onLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    setHover(null);
  };

  const formatTime = (t) =>
    days === 1
      ? new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const fmt = (p) =>
    p >= 1000
      ? Math.round(p).toLocaleString("en-US")
      : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const up = (chart?.change ?? 0) >= 0;

  return (
    <motion.div
      data-testid={`market-chart-${id}`}
      initial={{ opacity: 0, y: 16, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: 16, height: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={embedded ? "h-full overflow-hidden bg-oki-black" : "mt-6 overflow-hidden border border-white/10 bg-oki-black"}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold">{name}</span>
          <span
            className={`border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] ${
              type === "stock" ? "border-oki-crimsonbright/50 text-oki-crimsonbright" : "border-oki-gold/50 text-oki-gold"
            }`}
          >
            {badge || (type === "stock" ? "Stock" : "Crypto")}
          </span>
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
        <button onClick={onClose} data-testid="market-chart-close" aria-label="Close chart" className="text-oki-faint transition-colors duration-200 hover:text-oki-text">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="border-b border-white/10 px-5 py-2.5">
        <p className="font-mono text-[9px] leading-relaxed tracking-[0.15em] text-oki-faint">
          {ASSET_BRIEFS[id] || `${name} — live public market data. Nothing here is investment advice.`}
        </p>
      </div>
      <div className="p-5">
        {chart ? (
          <>
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-display text-2xl font-semibold tracking-tight text-oki-text">${fmt(chart.last)}</span>
              <span className={`flex items-center gap-1 font-mono text-xs ${up ? "text-oki-gold" : "text-oki-crimsonbright"}`}>
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(chart.change).toFixed(2)}%
              </span>
            </div>
            <div className="relative">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="w-full cursor-crosshair"
                onMouseEnter={cacheRect}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
              >
                <defs>
                  <linearGradient id={`chartFill-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C5A059" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#C5A059" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0.33, 0.66].map((f) => (
                  <line key={f} x1={PAD} x2={W - PAD} y1={H * f} y2={H * f} stroke="var(--chart-grid)" />
                ))}
                <motion.path
                  d={chart.area}
                  fill={`url(#chartFill-${id})`}
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
                {hover !== null && chart.pts[hover] && (
                  <g data-testid="chart-crosshair">
                    <line
                      x1={chart.x(hover)} y1={PAD} x2={chart.x(hover)} y2={H - PAD}
                      stroke="#C5A059" strokeOpacity="0.4" strokeDasharray="3 3"
                    />
                    <circle cx={chart.x(hover)} cy={chart.y(chart.pts[hover].v)} r="4" fill="#050505" stroke="#C5A059" strokeWidth="2" />
                  </g>
                )}
              </svg>
              {hover !== null && chart.pts[hover] && (
                <div
                  data-testid="chart-tooltip"
                  className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap border border-oki-gold/30 bg-oki-black px-3 py-1.5 font-mono text-[10px] tracking-wide text-oki-text"
                  style={{ left: `${(chart.x(hover) / W) * 100}%` }}
                >
                  ${fmt(chart.pts[hover].v)}
                  <span className="ml-2 text-oki-faint">{formatTime(chart.pts[hover].t)}</span>
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-oki-faint">
              <span>L ${fmt(chart.min)}</span>
              <span>H ${fmt(chart.max)}</span>
            </div>
          </>
        ) : error ? (
          <div className="flex h-40 flex-col items-center justify-center gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Feed unavailable</p>
            <button
              onClick={() => setReloadNonce((n) => n + 1)}
              data-testid="chart-retry"
              className="border border-oki-gold/40 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-oki-gold transition-colors duration-300 hover:bg-oki-gold hover:text-oki-black"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center">
            <span className="h-px w-24 animate-pulse-slow bg-oki-gold/50" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
