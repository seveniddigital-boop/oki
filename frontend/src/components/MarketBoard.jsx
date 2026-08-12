import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

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

const cellCls = "border-white/10 bg-oki-black";
const labelCls = "font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint";

export default function MarketBoard({ onSelect }) {
  const items = useMarketItems();
  const btc = items.find((i) => i.symbol === "BTC");
  const others = items.filter((i) => i.type === "crypto" && i.symbol !== "BTC");
  const indices = items.filter((i) => i.type === "index");
  const equities = items.filter((i) => i.type === "stock");

  const pick = (it) =>
    onSelect({ id: it.id, type: it.type === "crypto" ? "crypto" : "stock", name: it.name, badge: it.type === "index" ? "Index" : undefined });

  return (
    <div data-testid="market-board" className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 lg:grid-cols-12">
      {/* Bitcoin panel */}
      <button
        type="button"
        data-testid="board-btc-panel"
        onClick={() => btc && pick(btc)}
        className={`group relative flex h-full flex-col p-8 text-left transition-colors duration-500 hover:bg-oki-elevated md:p-10 lg:col-span-5 ${cellCls}`}
      >
        <div className="flex items-center justify-between">
          <p className={labelCls}>Bitcoin · BTC/USD</p>
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-oki-gold">
            <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-oki-gold" />
            Live
          </span>
        </div>
        {btc ? (
          <>
            <p data-testid="board-btc-price" className="mt-6 font-display text-5xl font-semibold tracking-tighter text-oki-text md:text-6xl">
              ${fmtPrice(btc.price)}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Change value={btc.change} />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-oki-faint">24h change</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-px border border-white/10 bg-white/10">
              <div className="bg-oki-black p-4">
                <p className={labelCls}>Market Cap</p>
                <p data-testid="board-btc-mcap" className="mt-2 font-mono text-sm text-oki-text">{fmtBig(btc.market_cap)}</p>
              </div>
              <div className="bg-oki-black p-4">
                <p className={labelCls}>24h Volume</p>
                <p data-testid="board-btc-volume" className="mt-2 font-mono text-sm text-oki-text">{fmtBig(btc.volume)}</p>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Connecting…</p>
        )}
        <span className="mt-auto flex items-center gap-2 pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Open chart <ArrowUpRight className="h-3 w-3" />
        </span>
      </button>

      {/* Stocks panel */}
      <div className={`p-8 md:p-10 lg:col-span-7 ${cellCls}`}>
        <p className={labelCls}>Stocks · Indices & Majors</p>

        <div className="mt-6 grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
          {indices.length === 0 && (
            <p className="col-span-3 bg-oki-black p-5 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Connecting…</p>
          )}
          {indices.map((it) => (
            <button
              key={it.symbol}
              type="button"
              data-testid={`board-index-${it.symbol}`}
              onClick={() => pick(it)}
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
              onClick={() => pick(it)}
              className="group flex w-full items-center justify-between gap-4 border-b border-white/10 bg-oki-black px-5 py-4 text-left transition-colors duration-300 last:border-b-0 hover:bg-oki-elevated"
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
            <p className="bg-oki-black px-5 py-6 font-mono text-[10px] uppercase tracking-[0.3em] text-oki-faint">Connecting…</p>
          )}
        </div>

        <p className="mt-6 font-mono text-[9px] uppercase leading-relaxed tracking-[0.25em] text-oki-faint">
          Yahoo Finance · CoinGecko — delayed where applicable · Information only
        </p>
      </div>

      {/* Secondary crypto strip */}
      {others.length > 0 && (
        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:col-span-12">
          {others.map((it) => (
            <button
              key={it.symbol}
              type="button"
              data-testid={`board-crypto-${it.symbol}`}
              onClick={() => pick(it)}
              className="flex items-center justify-between gap-4 bg-oki-black px-6 py-4 text-left transition-colors duration-300 hover:bg-oki-elevated"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-xs tracking-[0.2em] text-oki-gold">{it.symbol}</span>
                <span className="text-sm text-oki-muted">{it.name}</span>
              </span>
              <span className="flex items-center gap-4">
                <span className="font-mono text-sm text-oki-text">${fmtPrice(it.price)}</span>
                <Change value={it.change} />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
