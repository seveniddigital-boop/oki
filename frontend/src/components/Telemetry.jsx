import { useEffect, useState } from "react";

export default function Telemetry() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      data-testid="hud-telemetry"
      className="pointer-events-none fixed bottom-5 left-6 z-40 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-oki-faint lg:flex"
    >
      <span className="h-1 w-1 animate-pulse-slow rounded-full bg-oki-gold" />
      <span>40.7127°N 74.0134°W</span>
      <span className="text-oki-gold">NYC {time}</span>
    </div>
  );
}
