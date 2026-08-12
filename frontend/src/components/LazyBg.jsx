import { useEffect, useRef, useState } from "react";

export default function LazyBg({ src, className = "", style = {}, children, ...props }) {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={load ? { ...style, backgroundImage: `url(${src})` } : style}
      {...props}
    >
      {children}
    </div>
  );
}
