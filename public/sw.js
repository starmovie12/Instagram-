/* InstaGrab service worker (PRD §14.2, §22.2).
 *  • never touches /api/*, other origins or non-GET requests
 *  • static build assets & icons  → cache-first (hashed, immutable)
 *  • page navigations             → network-first (3.5 s), cached by PATH ONLY — a pasted
 *                                    ?url=… link is never written into the cache. Not SWR:
 *                                    stale HTML after a deploy would point at chunk hashes
 *                                    the new deployment no longer serves.
 *  • Next.js RSC / data requests  → network only (per-navigation payloads)
 *  • offline navigation           → cached page, else a redirect to /offline
 * Shell precache (≈ 350 KB of HTML) stays under the 500 KB budget.
 */
const VERSION = "instagrab-v4";  // bump to purge every cache on the next deploy
const SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const SHELL = ["/", "/tools", "/settings", "/how-to-download", "/history", "/offline", "/quick-action"];
const MAX_PAGES = 40;
const MAX_STATIC = 250;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE)
      .then((c) => Promise.all(SHELL.map((p) => fetch(p, { credentials: "same-origin" }).then((r) => (r.ok ? c.put(p, r) : null)).catch(() => null))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, max) {
  const c = await caches.open(cacheName);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

function isStatic(url) {
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/") ||
    /\.(?:woff2?|png|jpg|jpeg|webp|avif|svg|ico)$/i.test(url.pathname);
}

async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) {
    const c = await caches.open(STATIC_CACHE);
    await c.put(req, res.clone());
    trim(STATIC_CACHE, MAX_STATIC);
  }
  return res;
}

async function page(req, url) {
  const key = url.origin + url.pathname; // query (e.g. ?url=, ?src=) never becomes part of the cache
  const fromCache = async () =>
    (await caches.match(key, { cacheName: PAGE_CACHE })) || (await caches.match(url.pathname, { cacheName: SHELL_CACHE }));
  const network = fetch(req).then(async (res) => {
    if (res.ok && res.type === "basic") {
      const c = await caches.open(PAGE_CACHE);
      await c.put(key, res.clone());
      trim(PAGE_CACHE, MAX_PAGES);
    }
    return res;
  });
  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 3500));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
    return (await fromCache()) || (await network);
  } catch {
    // Uncached page while offline → go to /offline itself (serving its HTML under another URL
    // would leave the App Router waiting forever for that URL's data).
    return (await fromCache()) || (url.pathname === "/offline" ? Response.error() : Response.redirect(self.location.origin + "/offline", 302));
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/s/") || url.pathname.startsWith("/_vercel/")) return;
  if (req.headers.get("RSC") === "1" || url.searchParams.has("_rsc")) return; // App Router data
  if (isStatic(url)) { e.respondWith(cacheFirst(req)); return; }
  if (req.mode === "navigate") { e.respondWith(page(req, url)); return; }
});
