/**
 * The contrast contract (PRD §3.2.1 / AC-53 / AC-76) expressed against
 * app/tokens.css. Shared by lib/contrast.test.ts and scripts/contrast-audit.ts.
 */
import { collectTokens, composite, contrast, parseColor, resolveTokens, toHex, type RGBA, type Theme, type TokenMap } from "./tokens-parse";

export type PairKind = "text" | "ui";
export type Pair = { theme: Theme; fg: string; bg: string; kind: PairKind; use: string; fgHex: string; bgHex: string; ratio: number; min: number };

const TEXT_MIN = 4.5;
const UI_MIN = 3;

/** Paint a (possibly translucent) colour token onto an opaque backdrop. */
function paint(tokens: TokenMap, name: string, backdrop: RGBA): RGBA {
  const c = parseColor(tokens[name] ?? "");
  if (!c) throw new Error(`token ${name} is not a plain colour: "${tokens[name]}"`);
  return c.a < 1 ? composite(c, backdrop) : c;
}

/** Colour stops of a linear-gradient() value (in order). */
function gradientStops(value: string): RGBA[] {
  const out: RGBA[] = [];
  for (const m of value.matchAll(/#[0-9a-f]{3,6}\b|rgba?\([^)]*\)/gi)) {
    const c = parseColor(m[0]);
    if (c) out.push(c);
  }
  return out;
}

/** 101 samples along a multi-stop gradient — returns the darkest/lightest worst case vs `fg`. */
function worstOnGradient(fg: RGBA, stops: RGBA[]): { ratio: number; at: RGBA } {
  let worst = { ratio: Infinity, at: stops[0] ?? fg };
  const seg = stops.length - 1;
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const pos = Math.min(seg - 1, Math.floor(t * seg));
    const local = t * seg - pos;
    const a = stops[pos] ?? fg;
    const b = stops[pos + 1] ?? a;
    const c: RGBA = { r: Math.round(a.r + (b.r - a.r) * local), g: Math.round(a.g + (b.g - a.g) * local), b: Math.round(a.b + (b.b - a.b) * local), a: 1 };
    const r = contrast(fg, c);
    if (r < worst.ratio) worst = { ratio: r, at: c };
  }
  return worst;
}

/** Build every audited pair for one theme. */
export function pairsFor(css: string, theme: Theme): Pair[] {
  const t = resolveTokens(collectTokens(css, theme));
  const base = paint(t, "--bg-base", { r: 255, g: 255, b: 255, a: 1 });
  const surface = paint(t, "--bg-surface", base);
  // Glass worst case: the opposite page colour behind the translucent bar (PRD §3.2.1).
  const opposite: RGBA = theme === "dark" ? { r: 255, g: 255, b: 255, a: 1 } : { r: 0, g: 0, b: 0, a: 1 };
  const out: Pair[] = [];
  const add = (fg: string, bgName: string, bg: RGBA, kind: PairKind, use: string) => {
    const f = paint(t, fg, bg);
    out.push({ theme, fg, bg: bgName, kind, use, fgHex: toHex(f), bgHex: toHex(bg), ratio: contrast(f, bg), min: kind === "text" ? TEXT_MIN : UI_MIN });
  };
  const surfaces: [string, RGBA][] = [
    ["--bg-base", base],
    ["--bg-surface", surface],
    ["--bg-surface-elevated", paint(t, "--bg-surface-elevated", base)],
    ["--bg-surface-sunken", paint(t, "--bg-surface-sunken", base)],
    ["--bg-surface-2", paint(t, "--bg-surface-2", base)],
  ];
  for (const [n, c] of surfaces) {
    add("--text-primary", n, c, "text", "Body, headings");
    add("--text-secondary", n, c, "text", "Muted text, inactive tab label, helper");
    add("--text-brand", n, c, "text", "Links, active tab, detected chip");
  }
  for (const n of ["--bg-base", "--bg-surface"] as const) {
    const c = n === "--bg-base" ? base : surface;
    for (const s of ["--color-destructive", "--color-success", "--color-warning", "--color-info", "--accent-ink"]) add(s, n, c, "text", "Status / accent text");
    add("--border-strong", n, c, "ui", "Focus ring");
    add("--color-primary", n, c, "ui", "Toggle ON track, progress fill");
  }
  // Tinted fills under brand / status text
  const tinted = (bgToken: string, fgToken: string, use: string) => {
    const bg = paint(t, bgToken, surface);
    add(fgToken, `${bgToken} over --bg-surface`, bg, "text", use);
  };
  tinted("--color-primary-subtle", "--text-brand", "Selected pill / chip label");
  tinted("--color-destructive-subtle", "--color-destructive", "Error banner");
  tinted("--color-success-subtle", "--color-success", "Saved locally badge");
  tinted("--color-warning-subtle", "--color-warning", "Session-ID warning box");
  tinted("--color-info-subtle", "--color-info", "Offline pill");
  // Glass surfaces, worst case backdrop
  for (const g of ["--bg-glass-island", "--bg-blur-layer"]) {
    const bg = paint(t, g, opposite);
    for (const f of ["--text-primary", "--text-secondary", "--text-brand"]) add(f, `${g} (worst case)`, bg, "text", "Island / Rail / Header text");
  }
  // White label on brand fills (CTA, tiles)
  for (const fill of ["--cta-start", "--cta-mid", "--cta-end", "--color-primary", "--color-primary-hover", "--ig-pink", "--ig-purple", "--ig-blue"]) {
    add("--text-on-primary", fill, paint(t, fill, base), "text", "CTA / tile label");
  }
  const white = paint(t, "--text-on-primary", base);
  const cta = worstOnGradient(white, gradientStops(t["--cta-gradient"] ?? ""));
  out.push({ theme, fg: "--text-on-primary", bg: "--cta-gradient (101 samples, min)", kind: "text", use: "CTA label — worst point of gradient", fgHex: toHex(white), bgHex: toHex(cta.at), ratio: cta.ratio, min: TEXT_MIN });
  // Hero banner copy over each hero background stop
  for (const stop of gradientStops(t["--hero-bg"] ?? "")) {
    for (const f of ["--hero-ink", "--hero-ink-2", "--text-brand"]) add(f, `--hero-bg stop ${toHex(stop)}`, stop, "text", "Hero banner copy");
  }
  return out;
}

export function allPairs(css: string): Pair[] {
  return [...pairsFor(css, "light"), ...pairsFor(css, "dark")];
}
