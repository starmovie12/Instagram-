/**
 * Table-driven router contract — PRD §7.6.2 routing table, §7.6.3 normalize rules,
 * AC-33…AC-38 and the "Manual Test Links" list. One `test()` per case (≥ 45).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveRoute, type Route } from "./router";
import { extractLinks, MAX_INPUT_CHARS, MAX_LINKS } from "./detect";

type Expect =
  | { type: "app"; path: string; kind?: string; url?: string | RegExp }
  | { type: "batch"; count: number; truncated?: boolean }
  | { type: "soon"; platform: string }
  | { type: "unsupported" | "incomplete"; platform: string }
  | { type: "rejected"; reason: "self" | "scheme" }
  | { type: "unknown" | "empty" | "notlink" };

const IG = "/instagram-downloader";
const CASES: [name: string, input: string, expect: Expect, opts?: { grab?: boolean }][] = [
  // §7.6.2 Instagram
  ["IG reel", "https://www.instagram.com/reel/C1abcDEF/", { type: "app", path: IG, kind: "reel" }],
  ["IG reels plural", "https://instagram.com/reels/C1abcDEF/", { type: "app", path: IG, kind: "reel" }],
  ["IG story", "https://www.instagram.com/stories/natgeo/3312345678901234567/", { type: "app", path: IG, kind: "story" }],
  ["IG highlights before stories", "https://www.instagram.com/stories/highlights/17912345678901234/", { type: "app", path: IG, kind: "highlights" }],
  ["IG post", "https://www.instagram.com/p/C1abcDEF/", { type: "app", path: IG, kind: "post" }],
  ["IG tv", "https://www.instagram.com/tv/C1abcDEF/", { type: "app", path: IG, kind: "video" }],
  ["IG profile link", "https://www.instagram.com/natgeo/", { type: "app", path: IG, kind: "profile", url: "@natgeo" }],
  ["IG username/p/code form", "https://www.instagram.com/natgeo/p/C1abcDEF/", { type: "app", path: IG, kind: "post" }],
  ["@username", "@travel.diaries", { type: "app", path: IG, kind: "profile", url: "@travel.diaries" }],
  ["bare username on Grab", "travel.diaries", { type: "app", path: IG, kind: "profile" }, { grab: true }],
  ["bare username on paste is not routed", "travel_diaries", { type: "notlink" }],
  ["m. subdomain", "https://m.instagram.com/reel/C1abcDEF/", { type: "app", path: IG, kind: "reel" }],
  ["instagr.am short host", "https://instagr.am/p/C1abcDEF/", { type: "app", path: IG, kind: "post" }],
  // §7.6.2 other platforms
  ["FB reel", "https://www.facebook.com/reel/1234567890123456", { type: "app", path: "/facebook-downloader", kind: "reel" }],
  ["FB watch", "https://www.facebook.com/watch/?v=1234567890", { type: "app", path: "/facebook-downloader", kind: "video" }],
  ["FB videos path", "https://www.facebook.com/natgeo/videos/1234567890/", { type: "app", path: "/facebook-downloader", kind: "video" }],
  ["fb.watch", "https://fb.watch/abcDEF123/", { type: "app", path: "/facebook-downloader", kind: "video" }],
  ["FB photo", "https://www.facebook.com/photo/?fbid=1234567890", { type: "app", path: "/facebook-downloader", kind: "photo" }],
  ["FB stories unsupported", "https://www.facebook.com/stories/1234567890/", { type: "unsupported", platform: "facebook" }],
  ["FB album unsupported", "https://www.facebook.com/media/set/?set=a.123", { type: "unsupported", platform: "facebook" }],
  ["TikTok video", "https://www.tiktok.com/@user/video/7300000000000000000", { type: "app", path: "/tiktok-downloader", kind: "video" }],
  ["TikTok vm short", "https://vm.tiktok.com/ZMabc123/", { type: "app", path: "/tiktok-downloader", kind: "video" }],
  ["TikTok vt short", "https://vt.tiktok.com/ZSabc123/", { type: "app", path: "/tiktok-downloader", kind: "video" }],
  ["Pinterest pin", "https://www.pinterest.com/pin/123456789/", { type: "app", path: "/pinterest-downloader" }],
  ["Pinterest ccTLD", "https://in.pinterest.com/pin/123456789/", { type: "app", path: "/pinterest-downloader" }],
  ["pin.it short", "https://pin.it/abcDEF", { type: "app", path: "/pinterest-downloader" }],
  ["X status", "https://x.com/user/status/1790000000000000000", { type: "app", path: "/twitter-downloader" }],
  ["twitter.com status", "https://twitter.com/user/status/1790000000000000000", { type: "app", path: "/twitter-downloader" }],
  ["Threads .net post", "https://www.threads.net/@user/post/C1abcDEF", { type: "app", path: "/threads-downloader" }],
  ["Threads .com post", "https://www.threads.com/@user/post/C1abcDEF", { type: "app", path: "/threads-downloader" }],
  ["YouTube watch → thumbnail", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", { type: "app", path: "/youtube-thumbnail-downloader", kind: "thumbnail" }],
  ["youtu.be → thumbnail", "https://youtu.be/dQw4w9WgXcQ", { type: "app", path: "/youtube-thumbnail-downloader", kind: "thumbnail" }],
  ["YouTube shorts → thumbnail", "https://www.youtube.com/shorts/abcDEF12345", { type: "app", path: "/youtube-thumbnail-downloader", kind: "thumbnail" }],
  // soon apps (§7.6.9)
  ["Snapchat soon", "https://www.snapchat.com/add/someone", { type: "soon", platform: "snapchat" }],
  ["Reddit soon", "https://www.reddit.com/r/pics/comments/abc/x/", { type: "soon", platform: "reddit" }],
  ["redd.it soon", "https://redd.it/abc123", { type: "soon", platform: "reddit" }],
  ["LinkedIn soon", "https://www.linkedin.com/posts/someone_123", { type: "soon", platform: "linkedin" }],
  ["Telegram soon", "https://t.me/channel/123", { type: "soon", platform: "telegram" }],
  ["Twitch soon", "https://www.twitch.tv/videos/123", { type: "soon", platform: "twitch" }],
  ["Vimeo soon", "https://vimeo.com/123456", { type: "soon", platform: "vimeo" }],
  // §7.6.3 normalize rules + AC-36
  ["share text with emoji", "Dekh ye reel 🔥 https://www.instagram.com/reel/C1abcDEF/?igsh=abc123 mast hai", { type: "app", path: IG, kind: "reel", url: /\/reel\/C1abcDEF\/$/ }],
  ["scheme-less IG post", "instagram.com/p/C1abcDEF", { type: "app", path: IG, kind: "post" }],
  ["scheme-less fb.watch", "fb.watch/abc123", { type: "app", path: "/facebook-downloader", kind: "video" }],
  ["fbclid stripped", "https://www.facebook.com/reel/123456?fbclid=XYZ", { type: "app", path: "/facebook-downloader", kind: "reel", url: "https://www.facebook.com/reel/123456" }],
  ["utm stripped, v kept", "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=x&si=abc", { type: "app", path: "/youtube-thumbnail-downloader", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }],
  ["l.facebook.com wrapper", "https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Freel%2FC1abcDEF%2F&h=AT0", { type: "app", path: IG, kind: "reel" }],
  ["l.instagram.com wrapper", "https://l.instagram.com/?u=https%3A%2F%2Fwww.tiktok.com%2F%40u%2Fvideo%2F123", { type: "app", path: "/tiktok-downloader" }],
  ["trailing punctuation", "(https://www.instagram.com/p/C1abcDEF/).", { type: "app", path: IG, kind: "post", url: "https://www.instagram.com/p/C1abcDEF/" }],
  // AC-37 safety
  ["lookalike instagram.com.evil.com", "https://instagram.com.evil.com/reel/C1abcDEF/", { type: "unknown" }],
  ["lookalike notinstagram.com", "https://notinstagram.com/reel/C1abcDEF/", { type: "unknown" }],
  ["javascript: rejected", "javascript:alert(1)", { type: "rejected", reason: "scheme" }],
  ["data: rejected", "data:text/html,<script>alert(1)</script>", { type: "rejected", reason: "scheme" }],
  ["dropbox is not X (A19)", "https://www.dropbox.com/s/abc/file.mp4", { type: "unknown" }],
  ["fedex is not X", "https://www.fedex.com/track?id=1", { type: "unknown" }],
  ["bit.ly short link unknown", "https://bit.ly/3abcDEF", { type: "unknown" }],
  ["t.co unknown", "https://t.co/abcDEF", { type: "unknown" }],
  ["self link", "https://instagrabs.vercel.app/tools", { type: "rejected", reason: "self" }],
  // E-1…E-3
  ["empty", "   ", { type: "empty" }],
  ["plain text", "hello how are you", { type: "notlink" }],
  ["IG home page is incomplete", "https://www.instagram.com/", { type: "incomplete", platform: "instagram" }],
  ["IG /p/ without code is incomplete", "https://www.instagram.com/p/", { type: "incomplete", platform: "instagram" }],
  ["TikTok home is incomplete", "tiktok.com", { type: "incomplete", platform: "tiktok" }],
  // §7.6.7 multi-link
  ["2 IG links → batch", "https://www.instagram.com/p/AAA111/ https://www.instagram.com/reel/BBB222/", { type: "batch", count: 2 }],
  ["IG + TikTok → first link", "https://www.instagram.com/p/AAA111/ https://www.tiktok.com/@u/video/1", { type: "app", path: IG, kind: "post" }],
];

const norm = (r: Route) => r;
for (const [name, input, exp, opts] of CASES) {
  test(`route: ${name}`, () => {
    const r = norm(resolveRoute(input, { allowBareUsername: Boolean(opts?.grab), selfHosts: ["instagrabs.vercel.app"] }));
    assert.equal(r.type, exp.type, `${input} → ${JSON.stringify(r)}`);
    if (r.type === "app" && exp.type === "app") {
      assert.equal(r.path, exp.path);
      if (exp.kind) assert.equal(r.kind, exp.kind);
      if (typeof exp.url === "string") assert.equal(r.url, exp.url);
      if (exp.url instanceof RegExp) assert.match(r.url, exp.url);
      assert.ok(r.path.startsWith("/") && !r.path.startsWith("//"), "destination is always an internal path (no open redirect)");
    }
    if (r.type === "batch" && exp.type === "batch") assert.equal(r.urls.length, exp.count);
    if ((r.type === "soon" || r.type === "unsupported" || r.type === "incomplete") && "platform" in exp) assert.equal(r.platform, exp.platform);
    if (r.type === "rejected" && exp.type === "rejected") assert.equal(r.reason, exp.reason);
  });
}

test("route: ≥ 21 Instagram links → first 20 + truncated flag (router.notice.capped)", () => {
  const many = Array.from({ length: 25 }, (_, i) => `https://www.instagram.com/p/CODE${i}/`).join("\n");
  const r = resolveRoute(many);
  assert.equal(r.type, "batch");
  if (r.type === "batch") { assert.equal(r.urls.length, 20); assert.equal(r.truncated, true); }
});

test("route: mixed apps report the extra links count", () => {
  const r = resolveRoute("https://www.instagram.com/p/AAA/ and https://vimeo.com/1 plus https://www.tiktok.com/@u/video/2");
  assert.equal(r.type, "app");
  if (r.type === "app") assert.ok((r.extraLinks ?? 0) >= 1);
});

test("extractLinks: 10,000-char adversarial input stays linear (≤ 50 ms) and capped", () => {
  const nasty = ("a.".repeat(2500) + "x ".repeat(2500) + "https://" + "a".repeat(4000)).slice(0, MAX_INPUT_CHARS + 5000);
  const t0 = performance.now();
  const links = extractLinks(nasty);
  const ms = performance.now() - t0;
  assert.ok(ms <= 50, `took ${ms.toFixed(1)} ms`);
  assert.ok(links.length <= MAX_LINKS);
});

test("extractLinks: never returns more than 21 links", () => {
  const text = Array.from({ length: 60 }, (_, i) => `https://www.instagram.com/p/X${i}/`).join(" ");
  assert.equal(extractLinks(text).length, MAX_LINKS);
});
