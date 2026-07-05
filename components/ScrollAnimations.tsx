"use client";

import { useEffect } from "react";

/**
 * Minimal, calm scroll-reveal (editorial system — no progress bars, no
 * spotlights). Elements with `.reveal` gently fade + rise on entering view.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) el.classList.add("in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
