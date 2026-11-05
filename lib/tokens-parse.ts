/**
 * Pure parser for app/tokens.css — the single source of truth for colour.
 * Used by scripts/gen-tokens.ts (build-time consumers: OG image, manifest,
 * viewport theme-color, icons) and by lib/contrast.test.ts (WCAG audit).
 * No DOM, no fs — callers pass the CSS text in.
 */

export type Theme = "light" | "dark";
export type TokenMap = Record<string, string>;

const BLOCK_RE = /([^{}]+)\{([^{}]*)\}/g;
const DECL_RE = /(--[\w-]+)\s*:\s*([^;]+);/g;

function stripComments(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    // drop @supports / @media wrappers with one nested level (fallback blocks)
    .replace(/@(?:supports|media)[^{]*\{(?:[^{}]*\{[^{}]*\})*\s*\}/g, "");
}

/**
 * Collect custom properties that apply to <html> in the given theme.
 * Order matters: later blocks override earlier ones, exactly like the cascade
 * (all selectors involved have equal specificity).
 * @param css    contents of app/tokens.css
 * @param theme  "light" (the default, `:root`) or "dark" (`[data-theme="dark"]`)
 * @returns      raw (unresolved) declarations
 */
export function collectTokens(css: string, theme: Theme): TokenMap {
  const out: TokenMap = {};
  const src = stripComments(css);
  for (const m of src.matchAll(BLOCK_RE)) {
    const selector = (m[1] ?? "").trim();
    if (selector.startsWith("@")) continue;
    // @supports fallback blocks only matter for browsers without linear(); skip for audits
    const selectors = selector.split(",").map((s) => s.trim());
    const applies = selectors.some((s) =>
      s === ":root" || (theme === "light" && s === '[data-theme="light"]') || (theme === "dark" && s === '[data-theme="dark"]'),
    );
    if (!applies) continue;
    for (const d of (m[2] ?? "").matchAll(DECL_RE)) {
      const name = d[1];
      const value = d[2];
      if (name && value) out[name] = value.trim();
    }
  }
  return out;
}

/**
 * Resolve var() references recursively (max depth 20, cycle-safe).
 * @returns a map where every value has its var(--x) / var(--x, fallback) substituted
 */
export function resolveTokens(raw: TokenMap): TokenMap {
  const cache: TokenMap = {};
  const resolve = (name: string, depth: number): string => {
    if (cache[name] !== undefined) return cache[name];
    const v = raw[name];
    if (v === undefined || depth > 20) return "";
    const out = v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_m, ref: string, fb?: string) => {
      const r = resolve(ref, depth + 1);
      return r !== "" ? r : (fb ?? "").trim();
    });
    cache[name] = out;
    return out;
  };
  const result: TokenMap = {};
  for (const k of Object.keys(raw)) result[k] = resolve(k, 0);
  return result;
}

export type RGBA = { r: number; g: number; b: number; a: number };

/** Parse `#rgb`, `#rrggbb`, `rgb(r g b / a)` or `rgb(r, g, b)` into channels. */
export function parseColor(value: string): RGBA | null {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1] ?? "";
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 };
  }
  const fn = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[/,]\s*([\d.]+%?))?\s*\)$/i);
  if (fn) {
    const alphaRaw = fn[4];
    const a = alphaRaw === undefined ? 1 : alphaRaw.endsWith("%") ? parseFloat(alphaRaw) / 100 : parseFloat(alphaRaw);
    return { r: Number(fn[1]), g: Number(fn[2]), b: Number(fn[3]), a };
  }
  return null;
}

/** Alpha-composite `fg` over an opaque `bg` (sRGB, like browsers paint). */
export function composite(fg: RGBA, bg: RGBA): RGBA {
  const a = fg.a;
  return { r: Math.round(fg.r * a + bg.r * (1 - a)), g: Math.round(fg.g * a + bg.g * (1 - a)), b: Math.round(fg.b * a + bg.b * (1 - a)), a: 1 };
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance. */
export function luminance(c: RGBA): number {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

/** WCAG 2.x contrast ratio between two opaque colours. */
export function contrast(a: RGBA, b: RGBA): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function toHex(c: RGBA): string {
  return "#" + [c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
}
