#!/usr/bin/env node
/**
 * CI gate (PRD AC-62 / Law 2): no raw colour literal (#hex, rgb()/rgba()/hsl() with
 * numbers) outside app/tokens.css. Allowed exceptions are listed below with reasons.
 *   node scripts/check-colors.mjs           → exit 1 on violations
 *   node scripts/check-colors.mjs --count   → just print counts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const SCAN = ["app", "components", "lib", "public/sw.js"];
const EXT = /\.(tsx?|css|svg|js|mjs)$/;
const ALLOW = new Map([
  ["app/tokens.css", "single source of truth"],
  ["lib/design-tokens.generated.ts", "generated from tokens.css (npm run tokens)"],
  ["app/icon.svg", "generated from tokens.css (npm run icons)"],
  ["components/PlatformIcons.tsx", "third-party brand logos (official colours)"],
  ["lib/tokens-parse.ts", "parser test vectors only"],
  ["lib/contrast-pairs.ts", "parser constants (white/black backdrops)"],
  ["components/DmLinkGenerator.tsx", "QR fallback when tokens are unavailable"],
]);
const RAW = /#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(?:rgba?|hsla?)\(\s*\d/g;

function walk(p, out) {
  const s = statSync(p);
  if (s.isDirectory()) for (const f of readdirSync(p)) walk(join(p, f), out);
  else if (EXT.test(p)) out.push(p);
  return out;
}
const files = SCAN.flatMap((d) => { try { return walk(join(ROOT, d), []); } catch { return []; } });
let total = 0;
const report = [];
for (const f of files) {
  const rel = relative(ROOT, f);
  if (ALLOW.has(rel)) continue;
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments
    const hits = line.match(RAW);
    if (hits) { total += hits.length; report.push(`${rel}:${i + 1}: ${hits.join(" ")}`); }
  });
}
if (process.argv.includes("--count")) {
  const per = {};
  for (const r of report) { const f = r.split(":")[0]; per[f] = (per[f] || 0) + 1; }
  console.log(per, "total", total);
  process.exit(0);
}
if (total) {
  console.error(report.join("\n"));
  console.error(`\n${total} raw colour literal(s) outside app/tokens.css`);
  process.exit(1);
}
console.log("OK — no raw colour literals outside app/tokens.css (allow-list: " + [...ALLOW.keys()].join(", ") + ")");
