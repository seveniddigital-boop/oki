import { TrendingUp, TrendingDown } from "lucide-react";
import { useMarketData } from "@/lib/marketStore";

export default function MarketTicker() {
  const { items } = useMarketData();

  const fmt = (p) =>
    p >= 1000
      ? Math.round(p).toLocaleString("en-US")
      : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <div
      data-testid="market-ticker"
      className="mb-12 flex flex-wrap items-center gap-x-10 gap-y-3 border border-white/10 bg-oki-black px-6 py-4"
    >
      <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">
        <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-oki-gold" />
        Live Markets
      </span>
      {items.length === 0 && (
        <span className="font-mono text-[10px] tracking-[0.25em] text-oki-faint">CONNECTING…</span>
      )}
      {items.slice(0, 8).map((it) => {
        const up = it.change >= 0;
        return (
          <span key={it.symbol} data-testid={`ticker-${it.symbol}`} className="flex items-baseline gap-2.5 font-mono text-xs">
            <span className="tracking-[0.2em] text-oki-faint">{it.symbol}</span>
            <span className="text-sm text-oki-text">${fmt(it.price)}</span>
            <span className={`flex items-center gap-1 ${up ? "text-oki-gold" : "text-oki-crimsonbright"}`}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(it.change).toFixed(2)}%
            </span>
          </span>
        );
      })}
      <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.25em] text-oki-faint md:block">
        Live Feed · Streaming
      </span>
    </div>
  );
}
