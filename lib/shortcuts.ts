"use client";
/**
 * Linear-style keyboard model (PRD §6.1, D28, AC-67): `G` then `H/T/R/S` within
 * 1 000 ms jumps to Home / Tools / History (Recent) / Settings. Chords are ignored
 * while typing (input / textarea / select / contenteditable) or with modifiers.
 * `⌘/Ctrl+K` and `/` are owned by the Command Palette.
 */
import { useEffect } from "react";

export const GO_CHORDS: Record<string, string> = { h: "/", t: "/tools", r: "/history", s: "/settings" };
export const CHORD_WINDOW_MS = 1000;

export function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  return /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

/**
 * Pure chord state machine (unit-tested).
 * @returns the route to open, or null; `armed` tells whether `G` is pending
 */
export function chordStep(state: { armedAt: number | null }, key: string, now: number): { route: string | null; armedAt: number | null } {
  const k = key.toLowerCase();
  if (state.armedAt !== null && now - state.armedAt <= CHORD_WINDOW_MS && GO_CHORDS[k]) return { route: GO_CHORDS[k] ?? null, armedAt: null };
  if (k === "g") return { route: null, armedAt: now };
  return { route: null, armedAt: null };
}

export function useGoChords(navigate: (href: string) => void) {
  useEffect(() => {
    let state: { armedAt: number | null } = { armedAt: null };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || isTypingTarget(e.target)) return;
      const next = chordStep(state, e.key, Date.now());
      state = { armedAt: next.armedAt };
      if (next.route) { e.preventDefault(); navigate(next.route); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
}
