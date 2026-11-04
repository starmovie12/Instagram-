#!/usr/bin/env node
/**
 * Route inventory — snapshot every route of a built Next.js app.
 *
 * Usage (after `npm run build`):
 *   node scripts/route-inventory.mjs --log build.log --out docs/migration/routes-before.json
 *   node scripts/route-inventory.mjs --diff before.json after.json
 *
 * It reads `.next/` manifests, parses the build log's route table (size /
 * first-load JS), then boots `next start` and fetches every concrete page
 * path to record: HTTP status, <title>, meta description, canonical,
 * JSON-LD block count/types, <html lang>, and whether the path is in
 * /sitemap.xml. API routes are listed but never called (they hit upstreams).
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

if (args[0] === "--diff") {
  process.exit(diff(args[1], args[2]));
}

const NEXT_DIR = resolve(".next");
const PORT = Number(arg("port", "3123"));
const OUT = arg("out", "routes.json");
const LOG = arg("log");
const SAMPLE_SHORT_CODE = "/s/zzzzzz"; // unknown code → must still resolve (redirect / 404 page)

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function parseBuildLog(file) {
  const table = {};
  if (!file || !existsSync(file)) return table;
  const re = /^[┌├└]\s+([○●ƒλ])\s+(\/\S*)\s+([\d.]+\s?k?B)\s+([\d.]+\s?k?B)/;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(re);
    if (m) table[m[2]] = { kind: m[1], size: m[3], firstLoad: m[4] };
  }
  return table;
}

const pick = (html, re) => {
  const m = html.match(re);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim() : null;
};

function inspectHtml(html) {
  const ld = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  const types = new Set();
  for (const [, body] of ld) {
    try {
      const walk = (n) => {
        if (Array.isArray(n)) return n.forEach(walk);
        if (n && typeof n === "object") {
          if (n["@type"]) [].concat(n["@type"]).forEach((t) => types.add(t));
          if (n["@graph"]) walk(n["@graph"]);
        }
      };
      walk(JSON.parse(body));
    } catch {
      types.add("<unparseable>");
    }
  }
  return {
    lang: pick(html, /<html[^>]*\slang="([^"]*)"/),
    title: pick(html, /<title[^>]*>([\s\S]*?)<\/title>/),
    description: pick(html, /<meta\s+name="description"\s+content="([^"]*)"/),
    canonical: pick(html, /<link\s+rel="canonical"\s+href="([^"]*)"/),
    ogTitle: pick(html, /<meta\s+property="og:title"\s+content="([^"]*)"/),
    robots: pick(html, /<meta\s+name="robots"\s+content="([^"]*)"/),
    jsonLdCount: ld.length,
    jsonLdTypes: [...types].sort(),
  };
}

async function waitForServer(base, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(base + "/robots.txt");
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("next start did not come up");
}

async function main() {
  const routeManifest = readJson(`${NEXT_DIR}/app-path-routes-manifest.json`);
  const prerender = readJson(`${NEXT_DIR}/prerender-manifest.json`);
  const table = parseBuildLog(LOG);

  const patterns = [...new Set(Object.values(routeManifest))].sort();
  const routes = Object.entries(routeManifest)
    .map(([file, pattern]) => ({
      pattern,
      type: file.endsWith("/route") ? "route" : "page",
      ...(table[pattern] || {}),
    }))
    .sort((a, b) => a.pattern.localeCompare(b.pattern));

  const isDynamic = (p) => p.includes("[");
  const isApi = (p) => p.startsWith("/api/");
  const isAsset = (p) => /\.(xml|txt|svg|png|ico|webmanifest)$/.test(p) || /opengraph-image|twitter-image|\/icon$|apple-icon/.test(p);

  const concrete = new Set();
  for (const r of routes) {
    if (r.type === "page" && !isDynamic(r.pattern) && r.pattern !== "/_not-found") concrete.add(r.pattern);
  }
  for (const p of Object.keys(prerender.routes || {})) {
    if (!isApi(p) && !isAsset(p) && p !== "/_not-found" && !p.startsWith("/_")) concrete.add(p);
  }

  const child = spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "start", "-p", String(PORT)], { stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, NODE_ENV: "production" } });
  let serverLog = "";
  child.stdout.on("data", (d) => (serverLog += d));
  child.stderr.on("data", (d) => (serverLog += d));
  const base = `http://127.0.0.1:${PORT}`;
  try {
    await waitForServer(base);

    const sitemapRes = await fetch(base + "/sitemap.xml");
    const sitemapXml = await sitemapRes.text();
    const sitemap = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map(([, u]) => { try { return new URL(u).pathname.replace(/\/$/, "") || "/"; } catch { return u; } })
      .sort();
    const sitemapSet = new Set(sitemap);
    for (const p of sitemap) if (!isAsset(p)) concrete.add(p); // crawl sitemap-only paths too

    const pages = {};
    const paths = [...concrete, SAMPLE_SHORT_CODE].sort();
    for (const p of paths) {
      let res;
      try {
        res = await fetch(base + p, { redirect: "manual", headers: { "user-agent": "route-inventory" }, signal: AbortSignal.timeout(20000) });
      } catch (e) {
        pages[p] = { status: 0, error: String(e && e.message), inSitemap: sitemapSet.has(p) };
        continue;
      }
      if (process.env.VERBOSE) console.log(res.status, p);
      const entry = { status: res.status, inSitemap: sitemapSet.has(p) };
      if (res.status >= 300 && res.status < 400) entry.location = res.headers.get("location");
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("text/html")) Object.assign(entry, inspectHtml(await res.text()));
      else await res.arrayBuffer();
      pages[p] = entry;
    }

    const assets = {};
    for (const r of routes) {
      if (r.type === "route" && !isApi(r.pattern) && !isDynamic(r.pattern)) {
        const res = await fetch(base + r.pattern, { redirect: "manual", signal: AbortSignal.timeout(20000) });
        await res.arrayBuffer();
        assets[r.pattern] = { status: res.status, contentType: res.headers.get("content-type") };
      }
    }

    const shared = LOG && existsSync(LOG) ? (readFileSync(LOG, "utf8").match(/First Load JS shared by all\s+([\d.]+\s?k?B)/) || [])[1] : null;
    const out = { generatedAt: new Date().toISOString(), sharedFirstLoad: shared, routes, pages, assets, sitemap };
    mkdirSync(dirname(resolve(OUT)), { recursive: true });
    writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
    console.log(`routes=${routes.length} pages=${Object.keys(pages).length} sitemap=${sitemap.length} → ${OUT}`);
  } catch (e) {
    console.error(serverLog.slice(-2000));
    throw e;
  } finally {
    child.kill("SIGTERM");
  }
}

function diff(beforeFile, afterFile) {
  const a = readJson(beforeFile);
  const b = readJson(afterFile);
  const problems = [];
  const lines = [];
  const bPatterns = new Set(b.routes.map((r) => r.pattern));
  const aPatterns = new Set(a.routes.map((r) => r.pattern));
  for (const p of aPatterns) if (!bPatterns.has(p)) problems.push(`ROUTE LOST: ${p}`);
  for (const p of bPatterns) if (!aPatterns.has(p)) lines.push(`route added: ${p}`);

  for (const [p, before] of Object.entries(a.pages)) {
    const after = b.pages[p];
    if (!after) { problems.push(`PAGE NOT CRAWLED AFTER: ${p}`); continue; }
    if (before.status !== after.status) {
      const okRedirect = before.status === after.status || (before.status >= 300 && before.status < 400 && after.status >= 300 && after.status < 400);
      (okRedirect ? lines : problems).push(`status ${p}: ${before.status} → ${after.status}`);
    }
    if (before.title && !after.title) problems.push(`TITLE LOST: ${p}`);
    if (before.description && !after.description) problems.push(`DESCRIPTION LOST: ${p}`);
    if (before.canonical && !after.canonical) problems.push(`CANONICAL LOST: ${p}`);
    if (before.canonical && after.canonical && before.canonical !== after.canonical) lines.push(`canonical changed ${p}: ${before.canonical} → ${after.canonical}`);
    if ((before.jsonLdCount || 0) > (after.jsonLdCount || 0)) problems.push(`JSON-LD DROPPED ${p}: ${before.jsonLdCount} → ${after.jsonLdCount}`);
    const lostTypes = (before.jsonLdTypes || []).filter((t) => !(after.jsonLdTypes || []).includes(t));
    if (lostTypes.length) problems.push(`JSON-LD TYPES LOST ${p}: ${lostTypes.join(", ")}`);
    if (before.inSitemap && !after.inSitemap) problems.push(`SITEMAP ENTRY LOST: ${p}`);
    if (before.title && after.title && before.title !== after.title) lines.push(`title changed ${p}: "${before.title}" → "${after.title}"`);
  }
  const bSitemap = new Set(b.sitemap);
  for (const s of a.sitemap) if (!bSitemap.has(s)) problems.push(`SITEMAP LOST: ${s}`);
  for (const s of b.sitemap) if (!new Set(a.sitemap).has(s)) lines.push(`sitemap added: ${s}`);

  console.log(`before: ${a.routes.length} routes / ${Object.keys(a.pages).length} pages / ${a.sitemap.length} sitemap urls`);
  console.log(`after:  ${b.routes.length} routes / ${Object.keys(b.pages).length} pages / ${b.sitemap.length} sitemap urls`);
  for (const l of lines) console.log("  " + l);
  if (problems.length) {
    console.log(`\n${problems.length} PROBLEM(S):`);
    for (const p of problems) console.log("  ✗ " + p);
    return 1;
  }
  console.log("\nOK — zero routes, metadata, JSON-LD or sitemap entries lost.");
  return 0;
}

if (args[0] !== "--diff") {
  main().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
