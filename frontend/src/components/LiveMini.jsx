import { useEffect, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function useBtc() {
  const [btc, setBtc] = useState(null);
  useEffect(() => {
    let on = true;
    const load = () =>
      axios
        .get(`${API}/market-prices`)
        .then(({ data }) => {
          const b = data?.items?.find((i) => i.symbol === "BTC");
          if (on && b) setBtc(b);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 60000);
    return () => {
      on = false;
      clearInterval(id);
    };
  }, []);
  return btc;
}

export function nyseStatus() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const mins = parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10);
    return !["Sat", "Sun"].includes(get("weekday")) && mins >= 570 && mins < 960;
  } catch {
    return false;
  }
}

export function BtcMini({ className = "", testId = "nav-btc-ticker" }) {
  const btc = useBtc();
  if (!btc) return null;
  const up = btc.change >= 0;
  return (
    <span data-testid={testId} className={`items-baseline gap-2 font-mono text-[10px] tracking-[0.15em] ${className}`}>
      <span className="text-oki-faint">BTC</span>
      <span className="text-oki-text">${Math.round(btc.price).toLocaleString("en-US")}</span>
      <span className={up ? "text-oki-gold" : "text-oki-crimsonbright"}>
        {up ? "▲" : "▼"} {Math.abs(btc.change).toFixed(2)}%
      </span>
    </span>
  );
}
