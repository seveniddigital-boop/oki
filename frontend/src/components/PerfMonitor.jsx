import { useEffect, useRef, useState } from "react";
import { useMarketData } from "@/lib/marketStore";
import { perfEnabled, getPerfTier } from "@/lib/perf";

// Dev-only diagnostics HUD. Enable with ?perf=1 or localStorage.oki-perf=1.
export default function PerfMonitor() {
  const enabled = perfEnabled();
  const [stats, setStats] = useState({ fps: 0, frame: 0, mem: 0 });
  const { status } = useMarketData();
  const raf = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;
    let frames = 0;
    let last = performance.now();
    let prev = last;
    let worst = 0;
    const loop = (now) => {
      raf.current = requestAnimationFrame(loop);
      const dt = now - prev;
      prev = now;
      if (dt > worst) worst = dt;
      frames += 1;
      const acc = now - last;
      if (acc >= 500) {
        const fps = Math.round((frames * 1000) / acc);
        const mem = performance.memory
          ? Math.round(performance.memory.usedJSHeapSize / 1048576)
          : 0;
        setStats({ fps, frame: +worst.toFixed(1), mem });
        frames = 0;
        last = now;
        worst = 0;
      }
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      data-testid="perf-monitor"
      className="pointer-events-none fixed bottom-5 right-6 z-[210] select-none border border-oki-gold/40 bg-oki-black/85 px-3 py-2 font-mono text-[9px] leading-relaxed tracking-[0.15em] text-oki-gold backdrop-blur"
    >
      <div data-testid="perf-fps">FPS {stats.fps}</div>
      <div data-testid="perf-frame">FRAME {stats.frame}ms</div>
      <div data-testid="perf-mem">MEM {stats.mem}MB</div>
      <div data-testid="perf-feed">FEED {String(status).toUpperCase()}</div>
      <div>TIER {getPerfTier().toUpperCase()}</div>
    </div>
  );
}
