"use client";

import { useEffect } from "react";

/**
 * Global animation driver, mounted once in the layout:
 *  1. Scroll-reveal — elements with .reveal fade/slide in on entering
 *     the viewport (supports --d delay + staggered children via CSS).
 *  2. Scroll progress — thin gold bar at the very top of the page.
 *  3. Card spotlight — tracks pointer x for .tool-card hover glow.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* 1 — reveal on scroll */
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    let io: IntersectionObserver | null = null;
    if (reduce) {
      els.forEach((el) => el.classList.add("in"));
    } else if (els.length) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) el.classList.add("in");
        else io!.observe(el);
      });
    }

    /* 2 — scroll progress bar */
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* 3 — spotlight hover on tool cards */
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".tool-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    };
    if (!reduce) document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      bar.remove();
    };
  }, []);

  return null;
}
