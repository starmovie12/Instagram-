"use client";

import { useEffect, useRef, useState } from "react";

/** Animated count-up that fires when scrolled into view (cubic ease-out). */
export default function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1900,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / duration);
            const ease = 1 - Math.pow(1 - t, 3);
            setVal(to * ease);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="num">
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}
