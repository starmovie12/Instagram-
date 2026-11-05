"use client";
/**
 * Haptics + success celebration (PRD §3.5 haptic mapping, M9).
 * Haptics run only when Settings → Haptic feedback is ON and `navigator.vibrate`
 * exists (Android Chrome; iOS Safari has no Vibration API → graceful no-op).
 * Users with `prefers-reduced-motion: reduce` get haptics OFF unless they
 * explicitly turned them on (stored pref wins).
 */
import { getPrefs, isSoundOn, lsGet, K } from "./storage";
import { cssToken } from "./css-token";

export const Haptic = {
  Selection: [8],
  Light: [10],
  Medium: [20],
  Rigid: [30],
  Heavy: [45],
  Success: [12, 40, 12],
  Warning: [30, 60, 30],
  Error: [40, 50, 40, 50, 40],
} as const;
export type HapticName = keyof typeof Haptic;

function reducedMotion(): boolean {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
/** True when the device can vibrate (used to disable the Settings toggle on iOS). */
export function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

/** Fire a named haptic pattern (no-op when disabled / unsupported). */
export function haptic(name: HapticName | number = "Light") {
  try {
    if (!canVibrate()) return;
    const explicit = lsGet(K.prefs)?.includes('"haptics"');
    const on = getPrefs().haptics && (explicit || !reducedMotion());
    if (!on) return;
    navigator.vibrate(typeof name === "number" ? name : [...Haptic[name]]);
  } catch { /* ignore */ }
}

let coinCtx: AudioContext | null = null;
/** Optional success chime (Settings → Download sound, default OFF — §3.5.3). */
function chime() {
  if (!isSoundOn()) return;
  try {
    const Ctor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    coinCtx = coinCtx ?? new Ctor();
    const o = coinCtx.createOscillator();
    const g = coinCtx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(988, coinCtx.currentTime);
    o.frequency.setValueAtTime(1319, coinCtx.currentTime + 0.08);
    g.gain.setValueAtTime(0.0001, coinCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.12, coinCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, coinCtx.currentTime + 0.35);
    o.connect(g).connect(coinCtx.destination);
    o.start();
    o.stop(coinCtx.currentTime + 0.36);
  } catch { /* ignore */ }
}

/**
 * M9 success celebration: ≤ 24 particles (transform + opacity only), colours
 * from the Instagram spectrum tokens, 700 ms decelerate; haptic Success.
 * Reduced motion → no particles (state is still announced by the caller).
 */
export function celebrate(x: number, y: number) {
  haptic("Success");
  chime();
  if (reducedMotion() || typeof document === "undefined") return;
  const colours = ["--ig-yellow", "--ig-orange", "--ig-pink", "--ig-purple", "--ig-blue"].map(cssToken).filter(Boolean);
  const n = 24;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const dist = 28 + Math.random() * 36;
    p.setAttribute("aria-hidden", "true");
    p.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:6px;height:6px;border-radius:99px;pointer-events:none;z-index:var(--z-notification);background:${colours[i % colours.length] ?? "currentColor"};will-change:transform,opacity;transition:transform 700ms var(--ease-decelerate),opacity 700ms var(--ease-decelerate);`;
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.2)`;
      p.style.opacity = "0";
    });
    setTimeout(() => p.remove(), 760);
  }
}

export function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iP(hone|ad|od)/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
