"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal driver. Any server-rendered element with class
 * `reveal` (optionally data-reveal="left|right|scale|blur" and
 * style={{ "--d": "120ms" }}) fades/slides in when it enters the viewport.
 * Mounted once in the root layout — keeps pages as server components.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => {
      // already-visible elements (above the fold) reveal immediately
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add("in");
      else io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
