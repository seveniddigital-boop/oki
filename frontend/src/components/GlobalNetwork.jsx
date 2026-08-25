import { useEffect, useRef } from "react";

function hexA(hex, a) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const D2R = Math.PI / 180;
const HUBS = [
  [40.7, -74.0], [51.5, -0.1], [1.35, 103.8], [35.7, 139.7],
  [25.2, 55.3], [-33.9, 151.2], [52.5, 13.4], [-23.6, -46.6],
];
const LINKS = [[0, 1], [0, 2], [1, 3], [2, 4], [0, 5], [1, 6], [0, 7], [2, 3]];

function ll2v([lat, lon]) {
  const la = lat * D2R, lo = lon * D2R;
  return [Math.cos(la) * Math.cos(lo), Math.sin(la), Math.cos(la) * Math.sin(lo)];
}

function slerp(a, b, t) {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  dot = Math.min(1, Math.max(-1, dot));
  const th = Math.acos(dot);
  if (th < 1e-4) return a;
  const s = Math.sin(th);
  const w1 = Math.sin((1 - t) * th) / s;
  const w2 = Math.sin(t * th) / s;
  return [a[0] * w1 + b[0] * w2, a[1] * w1 + b[1] * w2, a[2] * w1 + b[2] * w2];
}

function fibSphere(n) {
  const pts = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = ga * i;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return pts;
}

export default function GlobalNetwork({ className = "" }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dots = fibSphere(620);
    const hubs = HUBS.map(ll2v);
    let raf;
    let visible = true;
    const start = performance.now();

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      return {
        gold: s.getPropertyValue("--oki-gold").trim() || "#c5a059",
        text: s.getPropertyValue("--oki-text").trim() || "#f5f5f5",
      };
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
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const rot = (v, ry, rx) => {
      const [x, y, z] = v;
      const cy = Math.cos(ry), sy = Math.sin(ry);
      let x1 = x * cy - z * sy;
      let z1 = x * sy + z * cy;
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const y1 = y * cx - z1 * sx;
      z1 = y * sx + z1 * cx;
      return [x1, y1, z1];
    };

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const t = (now - start) / 1000;
      const R = (Math.min(w, h) / 2) * 0.9;
      const cx = w / 2;
      const cy = h / 2;
      const ry = t * 0.07 + (mouseRef.current.x - 0.5) * 0.5;
      const rx = -0.28 + (mouseRef.current.y - 0.5) * 0.25;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = hexA(colors.text, 0.07);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      for (const p of dots) {
        const [x, y, z] = rot(p, ry, rx);
        const a = 0.04 + ((z + 1) / 2) * 0.24;
        ctx.fillStyle = hexA(colors.text, a);
        const s = z > 0 ? 1.3 : 0.9;
        ctx.fillRect(cx + x * R - s / 2, cy - y * R - s / 2, s, s);
      }

      LINKS.forEach(([ai, bi], li) => {
        const a = hubs[ai];
        const b = hubs[bi];
        ctx.strokeStyle = hexA(colors.gold, 0.22);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        let started = false;
        const SEG = 36;
        for (let s = 0; s <= SEG; s++) {
          const f = s / SEG;
          const p = slerp(a, b, f);
          const lift = 1 + Math.sin(Math.PI * f) * 0.16;
          const [x, y, z] = rot([p[0] * lift, p[1] * lift, p[2] * lift], ry, rx);
          if (z > -0.05) {
            const px = cx + x * R;
            const py = cy - y * R;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else ctx.lineTo(px, py);
          } else started = false;
        }
        ctx.stroke();

        const pf = (t * 0.14 + li * 0.23) % 1;
        const pp = slerp(a, b, pf);
        const lift = 1 + Math.sin(Math.PI * pf) * 0.16;
        const [px, py, pz] = rot([pp[0] * lift, pp[1] * lift, pp[2] * lift], ry, rx);
        if (pz > 0) {
          ctx.fillStyle = hexA(colors.gold, 0.9);
          ctx.beginPath();
          ctx.arc(cx + px * R, cy - py * R, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      hubs.forEach((hv, i) => {
        const [x, y, z] = rot(hv, ry, rx);
        if (z <= 0) return;
        const px = cx + x * R;
        const py = cy - y * R;
        ctx.fillStyle = hexA(colors.gold, 0.95);
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        const ring = ((t * 0.5 + i * 0.37) % 1);
        ctx.strokeStyle = hexA(colors.gold, (1 - ring) * 0.5);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(px, py, 3 + ring * 12, 0, Math.PI * 2);
        ctx.stroke();
      });
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

  return <canvas ref={canvasRef} aria-hidden="true" data-testid="global-network" className={`block h-full w-full ${className}`} />;
}
