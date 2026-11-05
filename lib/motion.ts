"use client";
/**
 * One place that decides whether decorative motion may run (PRD §3.5.2 / AC-69):
 * reduced motion, low-memory devices, Data Saver, "Solid surfaces", "Ambient glow",
 * plus tab visibility. Components still pause themselves when off-screen.
 */
import { useEffect, useState } from "react";
import { getPrefs, subscribeStorage } from "./storage";

export type MotionGate = { reduced: boolean; ambient: boolean; visible: boolean };

function read(): MotionGate {
  if (typeof window === "undefined") return { reduced: false, ambient: true, visible: true };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const lowEnd = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
  const saveData = Boolean(nav.connection?.saveData);
  const p = getPrefs();
  return { reduced, ambient: p.ambientGlow && !p.solidSurfaces && !lowEnd && !saveData && !reduced, visible: document.visibilityState !== "hidden" };
}

export function useMotionGate(): MotionGate {
  const [gate, setGate] = useState<MotionGate>({ reduced: false, ambient: false, visible: true });
  useEffect(() => {
    const update = () => setGate(read());
    update();
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", update);
    document.addEventListener("visibilitychange", update);
    const off = subscribeStorage(update);
    return () => { mq.removeEventListener?.("change", update); document.removeEventListener("visibilitychange", update); off(); };
  }, []);
  return gate;
}
