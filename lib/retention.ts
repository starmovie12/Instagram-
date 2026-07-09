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
