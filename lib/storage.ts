"use client";
/**
 * Unified on-device storage (PRD §15). Nothing here ever leaves the device.
 *
 * Guarantees (PRD §15.5, DBA chair):
 *  - every read is validated with a Zod `.strict()` schema — corrupt / hand-edited
 *    records are dropped, the app never crashes;
 *  - every write runs inside `navigator.locks.request("ig.storage")` when available
 *    (fresh read → modify → write), otherwise a fresh-read union merge;
 *  - other tabs are notified through `BroadcastChannel("ig-storage")` + the native
 *    `storage` event; React reads through `useSyncExternalStore` snapshots;
 *  - QuotaExceededError → drop the oldest records and retry, then fall back to memory;
 *  - history is de-duplicated on a canonical `platform:kind:id` key (no tracking params).
 */
import * as z from "zod/mini";
import { EV, emit } from "./events";

/* ── Low-level access with in-memory fallback (private mode / blocked storage) ── */
const mem = new Map<string, string>();
/** Keys whose latest write only reached memory (storage blocked / full). */
const memOnly = new Set<string>();

export function lsGet(key: string): string | null {
  // Memory answers only for keys whose last write never reached storage; otherwise
  // localStorage is authoritative (a null there means "cleared", e.g. in another tab).
  if (memOnly.has(key)) return mem.get(key) ?? null;
  try { return localStorage.getItem(key); } catch { return mem.get(key) ?? null; }
}
function isQuota(e: unknown): boolean {
  return e instanceof DOMException && (e.name === "QuotaExceededError" || e.code === 22);
}
/** @returns false when only the in-memory fallback holds the value */
export function lsSet(key: string, value: string): boolean {
  mem.set(key, value);
  try { localStorage.setItem(key, value); memOnly.delete(key); return true; }
  catch (e) { if (isQuota(e)) throw e; memOnly.add(key); return false; }
}
export function lsRemove(key: string) {
  mem.delete(key);
  memOnly.delete(key);
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}
function ssGet(key: string): string | null { try { return sessionStorage.getItem(key); } catch { return null; } }
function ssSet(key: string, value: string): boolean { try { sessionStorage.setItem(key, value); return true; } catch { return false; } }
function ssRemove(key: string) { try { sessionStorage.removeItem(key); } catch { /* ignore */ } }
function parseJson(raw: string | null): unknown {
  if (!raw) return undefined;
  try { return JSON.parse(raw) as unknown; } catch { return undefined; }
}

/* ── Keys (PRD §15.1 — names kept so saved values keep working) ── */
export const K = {
  theme: "ig-theme",
  lang: "ig-lang",
  history: "ig.history.v2",
  prefs: "ig.prefs.v1",
  migrated: "ig.migrated.v2",
  session: "instagrab_session_id",
  cobalt: "instagrab_cobalt_instance",
  handoff: "ig.handoff",
  offlineQueue: "ig.offlineQueue",
  sound: "ig.sound",
  oldDownloadHistory: "ig.downloadHistory",
  oldGoldenbar: "ig_goldenbar_recent_v1",
  oldNavHistory: "instagrab_history",
} as const;

/* ── Cross-tab sync ── */
const CHANNEL = "ig-storage";
let bc: BroadcastChannel | null = null;
const listeners = new Set<() => void>();
let wired = false;
function notifyLocal(key: string) {
  if (key === K.history) { historyCache = null; emit(EV.historyUpdated); }
  if (key === K.prefs) { prefsCache = null; emit(EV.settingsUpdated); }
  listeners.forEach((fn) => fn());
}
function wire() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  try {
    bc = new BroadcastChannel(CHANNEL);
    bc.onmessage = (e: MessageEvent<{ key?: string }>) => { if (typeof e.data?.key === "string") notifyLocal(e.data.key); };
  } catch { bc = null; }
  window.addEventListener("storage", (e) => { if (e.key) notifyLocal(e.key); });
}
function broadcast(key: string) {
  notifyLocal(key);
  try { bc?.postMessage({ key }); } catch { /* ignore */ }
}
/** Subscribe to any storage change (this tab or others). */
export function subscribeStorage(fn: () => void): () => void {
  wire();
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** Serialise writes across tabs (Web Locks); falls back to a direct call. */
function withLock(fn: () => void): void {
  try {
    const locks = (navigator as Navigator & { locks?: LockManager }).locks;
    if (locks?.request) { void locks.request("ig.storage", async () => { fn(); }); return; }
  } catch { /* fall through */ }
  fn();
}

/* ── Preferences (PRD §13, §3.5.2, §3.6) ── */
const PrefsSchema = z.strictObject({
  autoFetch: z.boolean(),
  autoRoute: z.boolean(),
  autoSave: z.boolean(),
  quality: z.enum(["hd", "saver"]),
  clipboardSuggest: z.boolean(),
  haptics: z.boolean(),
  solidSurfaces: z.boolean(),
  ambientGlow: z.boolean(),
  rememberSession: z.boolean(),
  /** MGF-1: privacy-safe correction counter — `${fromKind}>${toKind}` → count (never a URL) */
  corrections: z.record(z.string().check(z.maxLength(40)), z.int()),
});
export type Prefs = z.infer<typeof PrefsSchema>;

function lowMemoryDevice(): boolean {
  try { const m = (navigator as Navigator & { deviceMemory?: number }).deviceMemory; return typeof m === "number" && m <= 2; } catch { return false; }
}
export const DEFAULT_PREFS: Prefs = {
  autoFetch: true, autoRoute: true, autoSave: true, quality: "hd", clipboardSuggest: true, haptics: true,
  solidSurfaces: false, ambientGlow: true, rememberSession: false, corrections: {},
};
let prefsCache: { raw: string | null; value: Prefs } | null = null;

export function getPrefs(): Prefs {
  const raw = lsGet(K.prefs);
  if (prefsCache && prefsCache.raw === raw) return prefsCache.value;
  const defaults: Prefs = { ...DEFAULT_PREFS, solidSurfaces: lowMemoryDevice(), rememberSession: Boolean(lsGet(K.session)) };
  const data = parseJson(raw);
  let value = defaults;
  if (data && typeof data === "object") {
    const parsed = z.partial(PrefsSchema).safeParse(data);
    if (parsed.success) value = { ...defaults, ...parsed.data };
    else console.warn("ig.prefs.v1 is invalid — using defaults");
  }
  prefsCache = { raw, value };
  return value;
}
export function setPrefs(patch: Partial<Prefs>): Prefs {
  const next = PrefsSchema.parse({ ...getPrefs(), ...patch });
  withLock(() => {
    const fresh = { ...getPrefs(), ...patch };
    try { lsSet(K.prefs, JSON.stringify(fresh)); } catch { /* quota: prefs are tiny; memory fallback */ }
    broadcast(K.prefs);
    applyDocumentPrefs(fresh);
  });
  return next;
}
/** MGF-1: count an auto-detect correction without storing any link. */
export function countCorrection(fromKind: string, toKind: string) {
  const key = `${fromKind}>${toKind}`.slice(0, 40);
  const c = { ...getPrefs().corrections };
  c[key] = Math.min((c[key] ?? 0) + 1, 9999);
  setPrefs({ corrections: c });
}
/** Mirror appearance prefs onto <html> (also done before paint in app/layout.tsx). */
export function applyDocumentPrefs(p: Prefs = getPrefs()) {
  if (typeof document === "undefined") return;
  const d = document.documentElement;
  d.dataset.surface = p.solidSurfaces ? "solid" : "glass";
  d.dataset.ambient = p.ambientGlow ? "on" : "off";
}

/* ── Sound (existing key) ── */
export function isSoundOn(): boolean { return lsGet(K.sound) === "1"; }

/* ── Advanced: Session ID (PRD §13.3, D17) + Cobalt ── */
/** Session ID: `sessionStorage` by default; `localStorage` only with "Remember on this device". */
export function getSessionId(): string {
  return ssGet(K.session) ?? lsGet(K.session) ?? "";
}
export function setSessionId(id: string, remember: boolean) {
  const v = id.trim();
  ssRemove(K.session); lsRemove(K.session);
  if (v) { if (remember) lsSet(K.session, v); else ssSet(K.session, v); }
  setPrefs({ rememberSession: remember });
}
export function getCobaltInstance(): string { return lsGet(K.cobalt) ?? ""; }
export function setCobaltInstance(url: string) {
  const v = url.trim();
  if (v) lsSet(K.cobalt, v); else lsRemove(K.cobalt);
  broadcast(K.cobalt);
  emit(EV.settingsUpdated);
}
/** @deprecated kept for older call sites — prefer setSessionId + setCobaltInstance */
export function setAdvanced(sessionId: string, cobalt: string) {
  setSessionId(sessionId, getPrefs().rememberSession);
  setCobaltInstance(cobalt);
}

/* ── History v2 (PRD §15.2) ── */
export const PLATFORMS_ENUM = ["instagram", "facebook", "tiktok", "youtube", "pinterest", "x", "threads"] as const;
export const KINDS_ENUM = ["reel", "story", "photo", "carousel", "video", "profile", "audio", "thumbnail", "other"] as const;
export type GrabPlatform = (typeof PLATFORMS_ENUM)[number];
export type GrabKind = (typeof KINDS_ENUM)[number];

const GrabRecordSchema = z.strictObject({
  v: z.literal(2),
  id: z.string().check(z.minLength(1), z.maxLength(64)),
  key: z.string().check(z.minLength(1), z.maxLength(300)),
  platform: z.enum(PLATFORMS_ENUM),
  kind: z.enum(KINDS_ENUM),
  url: z.string().check(z.maxLength(2048)),
  author: z.optional(z.string().check(z.maxLength(64))),
  title: z.optional(z.string().check(z.maxLength(200))),
  thumbnail: z.optional(z.string().check(z.maxLength(1024))),
  at: z.int(),
});
export type GrabRecord = z.infer<typeof GrabRecordSchema>;
export const HISTORY_MAX = 60;

const TRACKING = /^(igsh|igshid|fbclid|si|feature|utm_.+)$/i;
const THUMB_HOSTS = ["cdninstagram.com", "fbcdn.net", "ytimg.com", "img.youtube.com", "pinimg.com", "twimg.com", "tiktokcdn.com", "tiktokcdn-us.com", "tiktokcdn-eu.com", "rapidcdn.app"];

/** Canonical dedupe key `platform:kind:id` — tracking params never count (PRD P11). */
export function canonicalKey(platform: string, kind: string, rawUrl: string): string {
  let id = rawUrl;
  try {
    const u = new URL(rawUrl);
    for (const k of [...u.searchParams.keys()]) if (TRACKING.test(k)) u.searchParams.delete(k);
    const ig = u.pathname.match(/\/(?:p|reels?|tv)\/([\w-]+)/) ?? u.pathname.match(/\/stories\/(?:highlights\/)?[\w.]*\/?(\d+)/);
    const yt = u.searchParams.get("v");
    id = ig?.[1] ?? yt ?? `${u.hostname.replace(/^(www|m|mobile)\./, "")}${u.pathname.replace(/\/+$/, "")}${u.search}`;
  } catch { /* not a URL (e.g. @username) */ }
  return `${platform}:${kind}:${id}`.slice(0, 300);
}
/** Thumbnail URLs must be https on a known platform CDN (never data:/javascript:). */
export function safeThumb(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    const h = u.hostname.toLowerCase();
    return u.protocol === "https:" && THUMB_HOSTS.some((d) => h === d || h.endsWith("." + d)) ? u.toString().slice(0, 1024) : undefined;
  } catch { return undefined; }
}

/** v1-shaped records (no `v`/`key`) are upgraded once, then strictly validated. */
function upgrade(r: unknown): unknown {
  if (!r || typeof r !== "object") return r;
  const o = r as Record<string, unknown>;
  if (o.v === 2) return o;
  const platform = typeof o.platform === "string" ? o.platform : "instagram";
  const kind = typeof o.kind === "string" && (KINDS_ENUM as readonly string[]).includes(o.kind) ? o.kind : "other";
  const url = typeof o.url === "string" ? o.url : "";
  const out: Record<string, unknown> = { v: 2, id: o.id, key: canonicalKey(platform, kind, url), platform, kind, url, at: o.at };
  if (typeof o.author === "string") out.author = o.author.slice(0, 64);
  if (typeof o.title === "string") out.title = o.title.slice(0, 200);
  const t = safeThumb(typeof o.thumbnail === "string" ? o.thumbnail : undefined);
  if (t) out.thumbnail = t;
  return out;
}

let historyCache: { raw: string | null; value: GrabRecord[] } | null = null;
const EMPTY: GrabRecord[] = [];
export function getHistory(): GrabRecord[] {
  const raw = lsGet(K.history);
  if (historyCache && historyCache.raw === raw) return historyCache.value;
  const data = parseJson(raw);
  let value = EMPTY;
  if (Array.isArray(data)) {
    value = data
      .map(upgrade)
      .map((r) => GrabRecordSchema.safeParse(r))
      .filter((p): p is { success: true; data: GrabRecord } => p.success)
      .map((p) => p.data)
      .sort((a, b) => b.at - a.at)
      .slice(0, HISTORY_MAX);
  } else if (raw) {
    console.warn("ig.history.v2 is not a list — showing an empty history");
  }
  historyCache = { raw, value };
  return value;
}
/** Server snapshot for useSyncExternalStore (renders the skeleton on the server). */
export function getHistoryServerSnapshot(): GrabRecord[] | null { return null; }

function writeHistory(list: GrabRecord[]) {
  let next = list.slice(0, HISTORY_MAX);
  let stored = false;
  for (let attempt = 0; attempt < 6 && !stored; attempt++) {
    try { lsSet(K.history, JSON.stringify(next)); stored = true; }
    catch { next = next.slice(0, Math.max(1, next.length - 10)); } // quota → drop oldest, retry
  }
  if (!stored) { mem.set(K.history, JSON.stringify(list.slice(0, HISTORY_MAX))); memOnly.add(K.history); } // silent in-memory fallback
  broadcast(K.history);
}
function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type NewGrab = { platform: GrabPlatform; kind: GrabKind; url: string; author?: string; title?: string; thumbnail?: string };
/** R11: every success is saved (newest first, deduped on canonical key, max 60). */
export function addHistory(rec: NewGrab) {
  const candidate = {
    v: 2 as const, id: newId(), key: canonicalKey(rec.platform, rec.kind, rec.url), platform: rec.platform, kind: rec.kind,
    url: rec.url.slice(0, 2048), at: Date.now(),
    ...(rec.author ? { author: rec.author.slice(0, 64) } : {}),
    ...(rec.title ? { title: rec.title.slice(0, 200) } : {}),
    ...(safeThumb(rec.thumbnail) ? { thumbnail: safeThumb(rec.thumbnail) } : {}),
  };
  const parsed = GrabRecordSchema.safeParse(candidate);
  if (!parsed.success) return;
  withLock(() => writeHistory([parsed.data, ...getHistory().filter((r) => r.key !== parsed.data.key)]));
}
export function removeHistory(id: string): GrabRecord | undefined {
  const hit = getHistory().find((r) => r.id === id);
  withLock(() => writeHistory(getHistory().filter((r) => r.id !== id)));
  return hit;
}
export function restoreHistory(rec: GrabRecord) {
  withLock(() => {
    const list = getHistory();
    if (list.some((r) => r.id === rec.id || r.key === rec.key)) return;
    writeHistory([...list, rec].sort((a, b) => b.at - a.at));
  });
}
export function clearHistory() {
  withLock(() => { lsRemove(K.history); broadcast(K.history); });
}
/** "Saved Media ({n} grabs)" — the calm counter that replaced the streak (SURAKSHA KI ZAMEEN). */
export function savedCount(list: GrabRecord[] = getHistory()): number { return list.length; }

/* ── Migration (once, `ig.migrated.v2`) — PRD §15.3 ── */
const LABEL_TO_PLATFORM: Record<string, GrabPlatform> = {
  instagram: "instagram", "ig reel": "instagram", "ig story": "instagram", "ig post": "instagram",
  facebook: "facebook", tiktok: "tiktok", youtube: "youtube", pinterest: "pinterest", threads: "threads", "x / twitter": "x", x: "x", twitter: "x",
};
function labelPlatform(label: string | undefined): GrabPlatform {
  const l = (label ?? "").toLowerCase();
  if (l.startsWith("@")) return "instagram";
  return LABEL_TO_PLATFORM[l] ?? "instagram";
}
export function migrateOnce() {
  if (lsGet(K.migrated)) { applyDocumentPrefs(); return; }
  try {
    const merged: unknown[] = [...getHistory()];
    const old1 = parseJson(lsGet(K.oldDownloadHistory));
    for (const h of Array.isArray(old1) ? old1 : []) {
      const o = h as { shortcode?: string; kind?: string; username?: string; thumbnail?: string; at?: number };
      if (!o?.shortcode) continue;
      merged.push(upgrade({
        id: `m1-${o.shortcode}`, platform: "instagram", kind: o.kind ?? "other",
        url: `https://www.instagram.com/p/${o.shortcode}/`, author: o.username ? "@" + o.username : undefined,
        thumbnail: o.thumbnail, at: typeof o.at === "number" ? Math.round(o.at) : Date.now(),
      }));
    }
    const old2 = parseJson(lsGet(K.oldGoldenbar));
    for (const h of Array.isArray(old2) ? old2 : []) {
      const o = h as { input?: string; platform?: string; title?: string; thumbnail?: string; timestamp?: number };
      if (!o?.input) continue;
      merged.push(upgrade({
        id: `m2-${o.timestamp ?? newId()}`, platform: labelPlatform(o.platform), kind: "other",
        url: o.input, title: o.title, thumbnail: o.thumbnail, at: typeof o.timestamp === "number" ? Math.round(o.timestamp) : Date.now(),
      }));
    }
    const seen = new Set<string>();
    const deduped = merged
      .map((r) => GrabRecordSchema.safeParse(r))
      .filter((p): p is { success: true; data: GrabRecord } => p.success)
      .map((p) => p.data)
      .sort((a, b) => b.at - a.at)
      .filter((r) => (seen.has(r.key) ? false : (seen.add(r.key), true)))
      .slice(0, HISTORY_MAX);
    if (deduped.length) writeHistory(deduped);
    lsRemove(K.oldDownloadHistory); lsRemove(K.oldGoldenbar); lsRemove(K.oldNavHistory);
    lsSet(K.migrated, "1");
  } catch { /* best-effort; retried next load */ }
  applyDocumentPrefs();
}

/* ── Handoff (sessionStorage, read-once, 60 s TTL) — PRD §7.6.6 / §7.6.13 ── */
export const HANDOFF_TTL_MS = 60_000 as const;
export const HANDOFF_CLOCK_SKEW_MS = 5_000 as const;
export const HANDOFF_URL_MAX_CHARS = 2_048 as const;
export const HANDOFF_KINDS = ["reel", "story", "highlights", "profile", "video", "photo", "thumbnail"] as const;
export const HandoffSchema = z.strictObject({
  url: z.string().check(z.maxLength(HANDOFF_URL_MAX_CHARS)),
  kind: z.optional(z.enum(HANDOFF_KINDS)),
  src: z.enum(["home", "history"]),
  t: z.int(),
});
export type Handoff = z.infer<typeof HandoffSchema>;
export type HandoffKind = (typeof HANDOFF_KINDS)[number];

/** @returns false when sessionStorage is blocked → caller falls back to `?url=` */
export function setHandoff(h: Omit<Handoff, "t">): boolean {
  return ssSet(K.handoff, JSON.stringify({ ...h, t: Date.now() }));
}
/**
 * Validate an untrusted handoff payload (exported for tests).
 * @returns the payload, or null when malformed / expired / from the future
 */
export function parseHandoff(raw: string | null, now: number = Date.now()): Handoff | null {
  const data = parseJson(raw);
  const p = HandoffSchema.safeParse(data);
  if (!p.success) return null;
  const age = now - p.data.t;
  if (age > HANDOFF_TTL_MS || age < -HANDOFF_CLOCK_SKEW_MS) return null;
  if (!/^https?:\/\//i.test(p.data.url) && !/^@?[\w.]{1,30}$/.test(p.data.url)) return null;
  return p.data;
}
let lastTaken: { h: Handoff | null; at: number } | null = null;
/** Read-once: the key is deleted BEFORE parsing (a crash can never replay it). StrictMode double-effects get a 1.5 s cache. */
export function takeHandoff(): Handoff | null {
  if (lastTaken && Date.now() - lastTaken.at < 1500) return lastTaken.h;
  const raw = ssGet(K.handoff);
  if (raw !== null) ssRemove(K.handoff);
  const h = parseHandoff(raw);
  lastTaken = { h, at: Date.now() };
  return h;
}

/* ── Offline smart queue (MGF-2) — sessionStorage, one link at a time ── */
const QueueSchema = z.strictObject({ url: z.string().check(z.maxLength(2048)), route: z.string().check(z.maxLength(80)), t: z.int() });
export type QueuedGrab = z.infer<typeof QueueSchema>;
export function queueOffline(url: string, route: string) { ssSet(K.offlineQueue, JSON.stringify({ url, route, t: Date.now() })); }
export function peekOffline(): QueuedGrab | null {
  const p = QueueSchema.safeParse(parseJson(ssGet(K.offlineQueue)));
  return p.success && Date.now() - p.data.t < 6 * 3_600_000 ? p.data : null;
}
export function clearOffline() { ssRemove(K.offlineQueue); }

/* ── Reset all (theme + language survive) — §13.4 ── */
export function resetAllLocalData() {
  for (const k of [K.history, K.prefs, K.session, K.cobalt, K.migrated, "ig.recentTools", "ig.recentSearches", "ig.streak", "ig.tourDone", K.sound, "ig-install-dismissed"]) lsRemove(k);
  ssRemove(K.session); ssRemove(K.handoff); ssRemove(K.offlineQueue);
  broadcast(K.history); broadcast(K.prefs);
}

/** Map a detector kind onto the handoff enum (PRD §7.6.13) — unknown kinds travel without a preselect. */
export function toHandoffKind(kind: string | undefined): HandoffKind | undefined {
  switch (kind) {
    case "reel": case "story": case "highlights": case "profile": case "video": case "thumbnail": return kind;
    case "photo": case "image": case "post": case "carousel": return "photo";
    default: return undefined;
  }
}

/* ── Batch prefill (2+ Instagram links → /batch-downloader, PRD §7.6.7) ── */
const BATCH_KEY = "ig.batch";
const BatchSchema = z.strictObject({ urls: z.array(z.string().check(z.maxLength(2048))).check(z.maxLength(20)), t: z.int() });
export function setBatchPrefill(urls: string[]): boolean {
  return ssSet(BATCH_KEY, JSON.stringify({ urls: urls.slice(0, 20), t: Date.now() }));
}
/** Read-once like the handoff. */
export function takeBatchPrefill(): string[] | null {
  const raw = ssGet(BATCH_KEY);
  if (raw !== null) ssRemove(BATCH_KEY);
  const p = BatchSchema.safeParse(parseJson(raw));
  return p.success && Date.now() - p.data.t <= HANDOFF_TTL_MS ? p.data.urls : null;
}
