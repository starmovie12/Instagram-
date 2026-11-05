import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import * as S from "./storage";

/** Minimal Web Storage for node:test (quota can be simulated). */
class MemStorage {
  map = new Map<string, string>();
  quota = Infinity;
  getItem(k: string) { return this.map.has(k) ? this.map.get(k)! : null; }
  setItem(k: string, v: string) {
    if (v.length > this.quota) throw new DOMException("full", "QuotaExceededError");
    this.map.set(k, String(v));
  }
  removeItem(k: string) { this.map.delete(k); }
  clear() { this.map.clear(); }
}
const ls = new MemStorage();
const ss = new MemStorage();
// storage.ts only touches Web Storage inside functions, so installing the fakes here is early enough.
Object.assign(globalThis, { localStorage: ls, sessionStorage: ss });


beforeEach(() => { ls.clear(); ss.clear(); ls.quota = Infinity; });

test("corrupt ig.history.v2 JSON → empty list, no crash (AC-52)", () => {
  ls.setItem(S.K.history, "{not json");
  assert.deepEqual(S.getHistory(), []);
  ls.setItem(S.K.history, JSON.stringify({ not: "a list" }));
  assert.deepEqual(S.getHistory(), []);
});

test("invalid records are dropped, valid ones kept (Zod .strict())", () => {
  const good = { v: 2, id: "a", key: "instagram:reel:ABC", platform: "instagram", kind: "reel", url: "https://www.instagram.com/reel/ABC/", at: 1 };
  ls.setItem(S.K.history, JSON.stringify([good, { ...good, id: "b", platform: "myspace" }, { ...good, id: "c", extra: true }, null, 42]));
  const list = S.getHistory();
  assert.equal(list.length, 1);
  assert.equal(list[0]?.id, "a");
});

test("v1 records (no v/key) are upgraded and get a canonical key", () => {
  ls.setItem(S.K.history, JSON.stringify([{ id: "x", platform: "instagram", kind: "reel", url: "https://www.instagram.com/reel/XYZ/?igsh=abc", at: 5 }]));
  const [r] = S.getHistory();
  assert.equal(r?.v, 2);
  assert.equal(r?.key, "instagram:reel:XYZ");
});

test("history dedupes on the canonical key — tracking params never create duplicates (P11)", async () => {
  S.addHistory({ platform: "instagram", kind: "reel", url: "https://www.instagram.com/reel/AAA/?igsh=1" });
  S.addHistory({ platform: "instagram", kind: "reel", url: "https://instagram.com/reel/AAA/?utm_source=x" });
  await new Promise((r) => setTimeout(r, 5));
  assert.equal(S.getHistory().length, 1);
});

test("history is capped at 60, newest first", async () => {
  for (let i = 0; i < 70; i++) S.addHistory({ platform: "tiktok", kind: "video", url: `https://www.tiktok.com/@u/video/${i}` });
  await new Promise((r) => setTimeout(r, 5));
  const list = S.getHistory();
  assert.equal(list.length, 60);
  assert.ok(list[0]!.at >= list[59]!.at);
});

test("quota exceeded → oldest records dropped and write retried", async () => {
  for (let i = 0; i < 30; i++) S.addHistory({ platform: "x", kind: "video", url: `https://x.com/u/status/${i}` });
  await new Promise((r) => setTimeout(r, 5));
  ls.quota = 3000; // force a quota error on the next write
  S.addHistory({ platform: "x", kind: "video", url: "https://x.com/u/status/new" });
  await new Promise((r) => setTimeout(r, 5));
  const raw = ls.getItem(S.K.history) ?? "";
  assert.ok(raw.length <= 3000, "persisted payload fits the quota");
  assert.equal(S.getHistory()[0]?.url, "https://x.com/u/status/new");
});

test("thumbnails: https on a platform CDN only (no data:/javascript:/http)", () => {
  assert.equal(S.safeThumb("data:image/png;base64,AAA"), undefined);
  assert.equal(S.safeThumb("javascript:alert(1)"), undefined);
  assert.equal(S.safeThumb("http://scontent.cdninstagram.com/a.jpg"), undefined);
  assert.equal(S.safeThumb("https://evil.example/a.jpg"), undefined);
  assert.equal(S.safeThumb("https://scontent-bom1-1.cdninstagram.com/a.jpg"), "https://scontent-bom1-1.cdninstagram.com/a.jpg");
});

test("handoff: tampered / expired / future / javascript: payloads are ignored (AC-51)", () => {
  const now = 1_000_000;
  const ok = { url: "https://www.instagram.com/reel/A/", kind: "reel", src: "home", t: now };
  assert.ok(S.parseHandoff(JSON.stringify(ok), now));
  assert.equal(S.parseHandoff(JSON.stringify({ ...ok, evil: 1 }), now), null, "unknown key (strict)");
  assert.equal(S.parseHandoff(JSON.stringify({ ...ok, kind: "batch" }), now), null, "kind outside enum");
  assert.equal(S.parseHandoff(JSON.stringify({ ...ok, t: now - 61_000 }), now), null, "older than 60 s");
  assert.equal(S.parseHandoff(JSON.stringify({ ...ok, t: now + 10_000 }), now), null, "from the future");
  assert.equal(S.parseHandoff(JSON.stringify({ ...ok, url: "javascript:alert(1)" }), now), null, "script url");
  assert.equal(S.parseHandoff(JSON.stringify({ ...ok, url: "x".repeat(3000) }), now), null, "too long");
  assert.equal(S.parseHandoff("{oops", now), null, "not json");
});

test("handoff is read-once: key deleted before parsing", () => {
  assert.ok(S.setHandoff({ url: "https://www.instagram.com/p/B/", kind: "photo", src: "home" }));
  const first = S.takeHandoff();
  assert.equal(first?.url, "https://www.instagram.com/p/B/");
  assert.equal(ss.getItem(S.K.handoff), null);
});

test("Session ID: sessionStorage by default, localStorage only with Remember (D17)", () => {
  S.setSessionId("abc%3A123", false);
  assert.equal(ss.getItem(S.K.session), "abc%3A123");
  assert.equal(ls.getItem(S.K.session), null);
  S.setSessionId("abc%3A123", true);
  assert.equal(ls.getItem(S.K.session), "abc%3A123");
  assert.equal(ss.getItem(S.K.session), null);
  assert.equal(S.getSessionId(), "abc%3A123");
});

test("prefs: invalid stored value falls back to defaults; corrections never store links", () => {
  ls.setItem(S.K.prefs, JSON.stringify({ autoSave: "yes" }));
  assert.equal(S.getPrefs().autoSave, true);
  S.countCorrection("reel", "story");
  S.countCorrection("reel", "story");
  assert.equal(S.getPrefs().corrections["reel>story"], 2);
  assert.ok(!(ls.getItem(S.K.prefs) ?? "").includes("http"));
});
