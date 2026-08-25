import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, LayoutGrid, LineChart } from "lucide-react";
import MarketChart from "@/components/MarketChart";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtPrice = (p) =>
  p >= 1000
    ? Math.round(p).toLocaleString("en-US")
    : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

const fmtBig = (n) => {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${Math.round(n).toLocaleString("en-US")}`;
};

const EASE = [0.22, 1, 0.36, 1];
const labelCls = "font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint";

function Change({ value }) {
  const up = value >= 0;
  return (
    <span className={`flex items-center gap-1 font-mono text-[11px] ${up ? "text-oki-gold" : "text-oki-crimsonbright"}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {up ? "+" : "−"}{Math.abs(value).toFixed(2)}%
    </span>
  );
}

function useMarketItems() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await axios.get(`${API}/market-prices`);
        if (mounted && data?.items) setItems(data.items);
      } catch {
        /* keep last known prices */
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);
  return items;
}

function ViewToggle({ view, onChange }) {
  const options = [
    { key: "prices", label: "Prices", Icon: LayoutGrid },
    { key: "chart", label: "Charts", Icon: LineChart },
  ];
  return (
    <div data-testid="board-view-toggle" className="flex border border-white/15">
      {options.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          data-testid={`board-view-${key}`}
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors duration-300 ${
            view === key ? "bg-oki-gold text-oki-black" : "text-oki-faint hover:text-oki-gold"
          }`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}

function SelectorRow({ it, active, onSelect }) {
  return (
    <button
      type="button"
      data-testid={`board-select-${it.symbol}`}
      onClick={() => onSelect(it)}
      className={`flex w-full items-center justify-between gap-3 border-l-2 px-4 py-3 text-left transition-colors duration-300 ${
        active ? "border-oki-gold bg-oki-gold/10" : "border-transparent hover:bg-oki-elevated"
      }`}
    >
      <span className="flex items-baseline gap-2.5">
        <span className={`font-mono text-[11px] tracking-[0.15em] ${active ? "text-oki-gold" : "text-oki-muted"}`}>{it.symbol}</span>
        <span className="hidden text-xs text-oki-faint sm:inline">{it.name}</span>
      </span>
      <span className="flex items-center gap-3">
        <span className="font-mono text-xs text-oki-text">${fmtPrice(it.price)}</span>
        <Change value={it.change} />
      </span>
    </button>
  );
}

export default function MarketBoard({ initialView = "prices" }) {
  const items = useMarketItems();
  const [view, setView] = useState(initialView);
  const [selectedId, setSelectedId] = useState("bitcoin");

  const crypto = items.filter((i) => i.type === "crypto");
  const btc = crypto.find((i) => i.symbol === "BTC");
  const alts = crypto.filter((i) => i.symbol !== "BTC");
  const indices = items.filter((i) => i.type === "index");
  const equities = items.filter((i) => i.type === "stock");
  const all = [...crypto, ...indices, ...equities];
  const selected = all.find((i) => i.id === selectedId) || btc || all[0] || null;

  const openChart = (it) => {
    setSelectedId(it.id);
    setView("chart");
  };

  const loading = items.length === 0;

  return (
    <div data-testid="market-board" className="border border-white/10 bg-oki-black">
      {/* Board header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">
          <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-oki-gold" />
          The Board · Live
        </span>
        <ViewToggle view={view} onChange={setView} />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "prices" ? (
          <motion.div
            key="prices"
            data-testid="board-prices-view"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="grid grid-cols-1 gap-px bg-white/10 lg:grid-cols-12">
              {/* Crypto — left */}
              <div className="bg-oki-black p-6 md:p-8 lg:col-span-5">
                <p className={labelCls}>Crypto</p>
                {btc ? (
                  <button
                    type="button"
                    data-testid="board-btc-panel"
                    onClick={() => openChart(btc)}
                    className="group mt-5 block w-full text-left"
                  >
                    <p data-testid="board-btc-price" className="font-display text-5xl font-semibold tracking-tighter text-oki-text transition-colors duration-300 group-hover:text-oki-gold md:text-6xl">
                      ${fmtPrice(btc.price)}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <Change value={btc.change} />
                      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-oki-faint">Bitcoin · 24h</span>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
                      <div className="bg-oki-black p-4">
                        <p className={labelCls}>Market Cap</p>
                        <p data-testid="board-btc-mcap" className="mt-2 font-mono text-sm text-oki-text">{fmtBig(btc.market_cap)}</p>
                      </div>
                      <div className="bg-oki-black p-4">
                        <p className={labelCls}>24h Volume</p>
                        <p data-testid="board-btc-volume" className="mt-2 font-mono text-sm text-oki-text">{fmtBig(btc.volume)}</p>
                      </div>
                    </div>
                    <span className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Open chart <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </button>
                ) : (
                  <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Connecting…</p>
                )}
                <div className="mt-6 border-t border-white/10">
                  {alts.map((it) => (
                    <button
                      key={it.symbol}
                      type="button"
                      data-testid={`board-crypto-${it.symbol}`}
                      onClick={() => openChart(it)}
                      className="group flex w-full items-center justify-between gap-4 border-b border-white/10 py-4 text-left transition-colors duration-300 last:border-b-0"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-xs tracking-[0.2em] text-oki-gold">{it.symbol}</span>
                        <span className="text-sm text-oki-muted transition-colors duration-300 group-hover:text-oki-text">{it.name}</span>
                      </span>
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-sm text-oki-text">${fmtPrice(it.price)}</span>
                        <Change value={it.change} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stocks — right */}
              <div className="bg-oki-black p-6 md:p-8 lg:col-span-7">
                <p className={labelCls}>Stocks · Indices & Majors</p>
                <div className="mt-5 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
                  {indices.length === 0 && (
                    <p className="col-span-3 bg-oki-black p-5 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Connecting…</p>
                  )}
                  {indices.map((it) => (
                    <button
                      key={it.symbol}
                      type="button"
                      data-testid={`board-index-${it.symbol}`}
                      onClick={() => openChart(it)}
                      className="bg-oki-black p-5 text-left transition-colors duration-300 hover:bg-oki-elevated"
                    >
                      <p className={labelCls}>{it.name}</p>
                      <p className="mt-3 font-display text-xl font-semibold tracking-tight text-oki-text">{fmtPrice(it.price)}</p>
                      <div className="mt-2"><Change value={it.change} /></div>
                    </button>
                  ))}
                </div>
                <div className="mt-px border border-white/10">
                  {equities.map((it) => (
                    <button
                      key={it.symbol}
                      type="button"
                      data-testid={`board-equity-${it.symbol}`}
                      onClick={() => openChart(it)}
                      className="group flex w-full items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-left transition-colors duration-300 last:border-b-0 hover:bg-oki-elevated"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-xs tracking-[0.2em] text-oki-gold">{it.symbol}</span>
                        <span className="text-sm text-oki-muted transition-colors duration-300 group-hover:text-oki-text">{it.name}</span>
                      </span>
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-sm text-oki-text">${fmtPrice(it.price)}</span>
                        <Change value={it.change} />
                      </span>
                    </button>
                  ))}
                  {equities.length === 0 && (
                    <p className="px-5 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Connecting…</p>
                  )}
                </div>
              </div>
            </div>
            <p className="border-t border-white/10 px-6 py-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.25em] text-oki-faint">
              Yahoo Finance · CoinGecko — delayed where applicable · Information only
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            data-testid="board-chart-view"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Selector rail */}
              <div className="border-b border-white/10 lg:col-span-4 lg:border-b-0 lg:border-r">
                {[
                  ["Crypto", crypto],
                  ["Indices", indices],
                  ["Equities", equities],
                ].map(([group, list]) => (
                  <div key={group}>
                    <p className={`${labelCls} border-b border-white/10 px-4 pb-2 pt-5`}>{group}</p>
                    {list.map((it) => (
                      <SelectorRow key={it.symbol} it={it} active={selected?.id === it.id} onSelect={(v) => setSelectedId(v.id)} />
                    ))}
                  </div>
                ))}
                {loading && (
                  <p className="px-4 py-8 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Connecting…</p>
                )}
              </div>
              {/* Chart panel */}
              <div className="lg:col-span-8" data-testid="board-chart-panel">
                {selected ? (
                  <MarketChart
                    key={selected.id}
                    id={selected.id}
                    type={selected.type === "crypto" ? "crypto" : "stock"}
                    name={selected.name}
                    badge={selected.type === "index" ? "Index" : undefined}
                    onClose={() => setView("prices")}
                    embedded
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <span className="h-px w-24 animate-pulse-slow bg-oki-gold/50" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
