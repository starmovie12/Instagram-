"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionGate } from "@/lib/motion";

/**
 * M10 Aurora — three pre-rendered radial glows (no blur filter, GPU cost ~0) behind
 * the top of Home / Tools (whole viewport on desktop). Drift pauses when: tab hidden,
 * glow zone off-screen, Solid surfaces ON, Ambient glow OFF, deviceMemory ≤ 2,
 * Data Saver, or reduced motion (PRD §3.5.2) — paused = static gradient.
 */
export default function AuroraBackdrop() {
  const gate = useMotionGate();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e?.isIntersecting ?? true));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const running = gate.ambient && gate.visible && inView;
  return (
    <div ref={ref} className="aurora" aria-hidden="true" data-running={running ? "true" : "false"}>
      <span className="aurora__a" />
      <span className="aurora__b" />
      <span className="aurora__c" />
    </div>
  );
}
