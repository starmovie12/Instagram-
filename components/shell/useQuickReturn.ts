"use client";
import { useEffect, useState } from "react";

/**
 * Quick Return (PRD v18 STEP 2, R-V18-9): on long screens hide chrome after
 * scrolling down > 24 px, show it again after scrolling up 12 px.
 * Returns `false` (always visible) when disabled.
 */
export function useQuickReturn(enabled: boolean): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!enabled) { setHidden(false); return; }
    let last = window.scrollY;
    let anchor = last;
    let dir: 1 | -1 = 1;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = Math.max(0, window.scrollY);
        const d: 1 | -1 = y > last ? 1 : -1;
        if (d !== dir) { dir = d; anchor = last; }
        if (y < 8) setHidden(false);
        else if (dir === 1 && y - anchor > 24) setHidden(true);
        else if (dir === -1 && anchor - y > 12) setHidden(false);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [enabled]);
  return hidden;
}

/** Keyboard open (visualViewport shrinks > 150 px) → collapse the Island in 100 ms (R-V18-10). */
export function useKeyboardOpen(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onVv = () => setOpen(window.innerHeight - vv.height > 150);
    vv.addEventListener("resize", onVv);
    return () => vv.removeEventListener("resize", onVv);
  }, []);
  return open;
}
