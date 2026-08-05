import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const COINS = [
  { id: "bitcoin", sym: "BTC" },
  { id: "ethereum", sym: "ETH" },
  { id: "solana", sym: "SOL" },
];

export default function CryptoTicker() {
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await axios.get(`${API}/crypto-prices`);
        if (mounted) setPrices(data);
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

  return (
    <div
      data-testid="crypto-ticker"
      className="mb-12 flex flex-wrap items-center gap-x-10 gap-y-3 border border-white/10 bg-oki-black px-6 py-4"
    >
      <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint">
        <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-oki-gold" />
        Live Market
      </span>
      {COINS.map((c) => {
        const d = prices?.[c.id];
        const change = d?.usd_24h_change ?? 0;
        const up = change >= 0;
        return (
          <span key={c.id} data-testid={`ticker-${c.id}`} className="flex items-baseline gap-2.5 font-mono text-xs">
            <span className="tracking-[0.2em] text-oki-faint">{c.sym}</span>
            <span className="text-sm text-oki-text">
              {d ? `$${Math.round(d.usd).toLocaleString("en-US")}` : "—"}
            </span>
            {d && (
              <span className={`flex items-center gap-1 ${up ? "text-oki-gold" : "text-oki-crimsonbright"}`}>
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(change).toFixed(2)}%
              </span>
            )}
          </span>
        );
      })}
      <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.25em] text-oki-faint md:block">
        CoinGecko · 60s refresh
      </span>
    </div>
  );
}
