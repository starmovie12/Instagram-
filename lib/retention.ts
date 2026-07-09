"use client";
/**
 * Tiny localStorage-backed retention helpers: which tools you used recently.
 * Everything stays on-device — nothing is sent to a server (privacy USP).
 */

const RECENT_KEY = "ig.recentTools";
const RECENT_MAX = 8;

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full / private mode — retention is best-effort */
  }
}

/** Record a visit to a tool page (href like "/reels-downloader"). */
export function recordToolVisit(href: string) {
  const list = read(RECENT_KEY).filter((h) => h !== href);
  list.unshift(href);
  write(RECENT_KEY, list.slice(0, RECENT_MAX));
}

/** Most-recently-used tool hrefs, newest first. */
export function getRecentTools(): string[] {
  return read(RECENT_KEY);
}

const STREAK_KEY = "ig.streak";

function localDay(offsetDays = 0): string {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Bump today's visit streak and return the current count (H4 — subtle gamification). */
export function bumpStreak(): number {
  try {
    const today = localDay();
    const raw = localStorage.getItem(STREAK_KEY);
    const s: { last: string; count: number } | null = raw ? JSON.parse(raw) : null;
    if (s?.last === today) return s.count;
    const count = s?.last === localDay(-1) ? s.count + 1 : 1;
    localStorage.setItem(STREAK_KEY, JSON.stringify({ last: today, count }));
    return count;
  } catch {
    return 0;
  }
}
