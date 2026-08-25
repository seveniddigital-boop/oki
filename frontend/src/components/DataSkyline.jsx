import { useEffect, useRef } from "react";

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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/market-chart?id=bitcoin&type=crypto&days=30`)
      .then((r) => r.json())
      .then((d) => {
        if (on && d?.prices?.length > 10) dataRef.current = d.prices.map((p) => p[1]);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let visible = true;
    const start = performance.now();

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      return { gold: s.getPropertyValue("--oki-gold").trim() || "#c5a059" };
    };
    let colors = readColors();
    const mo = new MutationObserver(() => {
      colors = readColors();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener("resize", fit);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = (e.clientX - r.left) / r.width;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      const gap = 3;
      const bw = Math.max(5, Math.floor(w / 110));
      const n = Math.max(24, Math.floor(w / (bw + gap)));
      const vals = resample(dataRef.current || fallbackWalk(120), n);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const range = max - min || 1;
      const mx = mouseRef.current;
      for (let i = 0; i < n; i++) {
        const norm = 0.14 + ((vals[i] - min) / range) * 0.72;
        const enter = Math.min(1, Math.max(0, (t - i * 0.012) / 1.1));
        const eased = 1 - Math.pow(1 - enter, 3);
        const breathe = 1 + Math.sin(t * 0.6 + i * 0.35) * 0.012;
        let glow = 0;
        if (mx >= 0) glow = Math.max(0, 1 - Math.abs(i / n - mx) * 7);
        const hgt = h * norm * eased * breathe * (1 + glow * 0.05);
        const x = i * (bw + gap);
        const grad = ctx.createLinearGradient(0, h - hgt, 0, h);
        grad.addColorStop(0, hexA(colors.gold, 0.45 + glow * 0.4));
        grad.addColorStop(0.35, hexA(colors.gold, 0.13 + glow * 0.1));
        grad.addColorStop(1, hexA(colors.gold, 0.02));
        ctx.fillStyle = grad;
        ctx.fillRect(x, h - hgt, bw, hgt);
        ctx.fillStyle = hexA(colors.gold, 0.7 + glow * 0.3);
        ctx.fillRect(x, h - hgt, bw, 1.5);
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
      window.removeEventListener("mousemove", onMove);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" data-testid="data-skyline" className={`block h-full w-full ${className}`} />;
}
