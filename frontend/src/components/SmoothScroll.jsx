import Lenis from "lenis";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

let lenis = null;

export default function SmoothScroll({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}
