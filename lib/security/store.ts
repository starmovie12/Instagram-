/**
 * Tiny shared store for the security layer (PRD §21.2). Upstash Redis over REST when
 * UPSTASH_REDIS_REST_URL/TOKEN are set (shared by every instance and the edge middleware),
 * otherwise a bounded in-memory map per instance. Fails open: a store outage never blocks users.
 * Edge-safe (fetch only).
 */
import { env } from "../env";

type Entry = { v: unknown; exp: number };
const mem = new Map<string, Entry>();
const MEM_MAX = 50_000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 30_000 && mem.size < MEM_MAX) return;
  lastSweep = now;
  for (const [k, e] of mem) if (e.exp <= now) mem.delete(k);
  while (mem.size > MEM_MAX) mem.delete(mem.keys().next().value as string);
}
function mget(k: string, now = Date.now()): unknown {
  const e = mem.get(k);
  if (!e) return null;
  if (e.exp <= now) { mem.delete(k); return null; }
  return e.v;
}
function mset(k: string, v: unknown, ttlMs: number, now = Date.now()) { sweep(now); mem.set(k, { v, exp: now + ttlMs }); }

function upstash(): { url: string; token: string } | null {
  const e = env();
  return e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN ? { url: e.UPSTASH_REDIS_REST_URL.replace(/\/+$/, ""), token: e.UPSTASH_REDIS_REST_TOKEN } : null;
}
let downUntil = 0;
/** One round trip for several commands. Returns null when Redis is not configured / unreachable. */
async function pipeline(cmds: (string | number)[][]): Promise<unknown[] | null> {
  const u = upstash();
  if (!u || Date.now() < downUntil) return null;
  try {
    const res = await fetch(`${u.url}/pipeline`, {
      method: "POST", headers: { Authorization: `Bearer ${u.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(cmds), cache: "no-store", signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) throw new Error(String(res.status));
    const out = (await res.json()) as { result?: unknown; error?: string }[];
    return out.map((r) => (r && "result" in r ? r.result : null));
  } catch {
    downUntil = Date.now() + 30_000; // back off; memory store covers the gap
    return null;
  }
}
export function sharedStore(): boolean { return upstash() !== null; }

/** Sliding-window counter (two fixed windows, weighted). Increments and returns the estimate. */
export async function slidingHit(key: string, windowMs: number, now = Date.now()): Promise<number> {
  const idx = Math.floor(now / windowMs);
  const cur = `${key}:${idx}`;
  const prev = `${key}:${idx - 1}`;
  const weight = 1 - (now % windowMs) / windowMs;
  const r = await pipeline([["SET", cur, 0, "PX", windowMs * 2, "NX"], ["INCR", cur], ["GET", prev]]);
  let c: number; let p: number;
  if (r) { c = Number(r[1] ?? 0); p = Number(r[2] ?? 0); }
  else {
    c = (Number(mget(cur, now)) || 0) + 1; mset(cur, c, windowMs * 2, now);
    p = Number(mget(prev, now)) || 0;
  }
  return c + Math.floor(p * weight);
}

/** Plain counter with TTL (penalty streaks). */
export async function incr(key: string, ttlMs: number): Promise<number> {
  const r = await pipeline([["SET", key, 0, "PX", ttlMs, "NX"], ["INCR", key]]);
  if (r) return Number(r[1] ?? 0);
  const n = (Number(mget(key)) || 0) + 1;
  mset(key, n, ttlMs);
  return n;
}

export async function getJson<T>(key: string): Promise<T | null> {
  const r = await pipeline([["GET", key]]);
  if (r) { try { return typeof r[0] === "string" ? (JSON.parse(r[0]) as T) : null; } catch { return null; } }
  return (mget(key) as T | null) ?? null;
}
export async function setJson(key: string, value: unknown, ttlMs: number): Promise<void> {
  const r = await pipeline([["SET", key, JSON.stringify(value), "PX", ttlMs]]);
  if (!r) mset(key, value, ttlMs);
}

/** Capped list (newest first) with TTL — behaviour signals. */
export async function pushList(key: string, item: unknown, ttlMs: number, max = 50): Promise<void> {
  const r = await pipeline([["LPUSH", key, JSON.stringify(item)], ["LTRIM", key, 0, max - 1], ["PEXPIRE", key, ttlMs]]);
  if (r) return;
  const list = ((mget(key) as unknown[] | null) ?? []).slice(0, max - 1);
  mset(key, [item, ...list], ttlMs);
}
export async function readList<T>(key: string, max = 50): Promise<T[]> {
  const r = await pipeline([["LRANGE", key, 0, max - 1]]);
  if (r) return (Array.isArray(r[0]) ? r[0] : []).flatMap((s) => { try { return [JSON.parse(String(s)) as T]; } catch { return []; } });
  return ((mget(key) as T[] | null) ?? []).slice(0, max);
}

/** Test hook. */
export function resetMemoryStore() { mem.clear(); downUntil = 0; }
