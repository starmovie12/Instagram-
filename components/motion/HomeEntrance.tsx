"use client";
import { useLayoutEffect } from "react";

let mountedOnce = false;

/**
 * M1 page entrance: the stagger plays only on the first Home view of a session
 * (`sessionStorage["ig.entered"]`, decided before first paint in app/layout.tsx);
 * later visits — including client-side navigations back to Home — get a 200 ms fade.
 * The hidden start state exists only under `html.js-motion` (set by the pre-paint
 * script), so content is visible if JS never runs.
 */
export default function HomeEntrance() {
  useLayoutEffect(() => {
    if (mountedOnce) document.documentElement.dataset.entrance = "fade";
    mountedOnce = true;
    try { sessionStorage.setItem("ig.entered", "1"); } catch { /* private mode */ }
  }, []);
  return null;
}
