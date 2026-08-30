import { useEffect, useRef } from "react";
import { chartKey, getCachedChart, setCachedChart } from "@/lib/chartCache";
import { getPerfTier, prefersReducedMotion } from "@/lib/perf";

function hexA(hex, a) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function resample(values, n) {
  if (values.length < 2) return Array(n).fill(1);
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = (i / (n - 1)) * (values.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.min(values.length - 1, Math.ceil(idx));
    out.push(values[lo] + (values[hi] - values[lo]) * (idx - lo));
  }
  return out;
}

function fallbackWalk(n) {
  const out = [];
  let v = 100;
  for (let i = 0; i < n; i++) {
    v += Math.sin(i * 0.37) * 2 + Math.sin(i * 0.11) * 3.4 + (((i * 2654435761) % 97) / 97 - 0.5) * 3;
    out.push(v);
  }
  return out;
}

export default function DataSkyline({ className = "" }) {
  const canvasRef = useRef(null);
  const dataRef = useRef(null);
  const mouseRef = useRef(-1);

  useEffect(() => {
    let on = true;
    const key = chartKey("crypto", "bitcoin", 30);
    const cached = getCachedChart(key);
    if (cached?.prices?.length > 10) {
      dataRef.current = cached.prices.map((p) => p[1]);
      return () => {
        on = false;
      };
    }
    const ctrl = new AbortController();
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/market-chart?id=bitcoin&type=crypto&days=30&symbol=BTC`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!on) return;
        if (d?.prices?.length > 10) {
          dataRef.current = d.prices.map((p) => p[1]);
          setCachedChart(key, d);
        }
      })
      .catch(() => {});
    return () => {
      on = false;
      ctrl.abort();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    const tier = getPerfTier();
    const dprCap = tier === "low" ? 1.25 : tier === "mid" ? 1.5 : 2;

    let raf = 0;
    let running = false;
    let visible = true;
    let gradient = null;
    const start = performance.now();

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      return { gold: s.getPropertyValue("--oki-gold").trim() || "#c5a059" };
    };
    let colors = readColors();

    const buildGradient = () => {
      const h = canvas.offsetHeight || 1;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, hexA(colors.gold, 0.45));
      g.addColorStop(0.35, hexA(colors.gold, 0.13));
      g.addColorStop(1, hexA(colors.gold, 0.02));
      gradient = g;
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGradient();
    };

    const drawFrame = (now) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const t = reduced ? 999 : (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      const gap = 3;
      const bw = Math.max(5, Math.floor(w / 110));
      const n = Math.max(24, Math.floor(w / (bw + gap)));
      const vals = resample(dataRef.current || fallbackWalk(120), n);
      let min = Infinity;
      let max = -Infinity;
      for (let i = 0; i < n; i++) {
        if (vals[i] < min) min = vals[i];
        if (vals[i] > max) max = vals[i];
      }
      const range = max - min || 1;
      const mx = reduced ? -1 : mouseRef.current;
      for (let i = 0; i < n; i++) {
        const norm = 0.14 + ((vals[i] - min) / range) * 0.72;
        const enter = reduced ? 1 : Math.min(1, Math.max(0, (t - i * 0.012) / 1.1));
        const eased = 1 - Math.pow(1 - enter, 3);
        const breathe = reduced ? 1 : 1 + Math.sin(t * 0.6 + i * 0.35) * 0.012;
        let glow = 0;
        if (mx >= 0) glow = Math.max(0, 1 - Math.abs(i / n - mx) * 7);
        const hgt = h * norm * eased * breathe * (1 + glow * 0.05);
        const x = i * (bw + gap);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, h - hgt, bw, hgt);
        ctx.fillStyle = hexA(colors.gold, 0.7 + glow * 0.3);
        ctx.fillRect(x, h - hgt, bw, 1.5);
      }
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      drawFrame(now);
    };
    const startLoop = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const evaluate = () => {
      if (reduced) {
        drawFrame(0);
        return;
      }
      if (visible && !document.hidden) startLoop();
      else stopLoop();
    };

    fit();

    const ro = new ResizeObserver(() => {
      fit();
      if (reduced) drawFrame(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      evaluate();
    });
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      colors = readColors();
      buildGradient();
      if (reduced) drawFrame(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = (e.clientX - r.left) / r.width;
    };
    if (!reduced) window.addEventListener("mousemove", onMove, { passive: true });

    const onVisibility = () => evaluate();
    document.addEventListener("visibilitychange", onVisibility);

    evaluate();

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" data-testid="data-skyline" className={`block h-full w-full ${className}`} />;
}
