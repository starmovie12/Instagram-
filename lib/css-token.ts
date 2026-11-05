/**
 * Read a design token (CSS custom property from app/tokens.css) at runtime.
 * For code that cannot use `var(--x)` directly: <canvas> drawing, QR codes.
 * Custom properties are computed with var() already substituted, so aliases
 * resolve to their final value.
 * @param name   token name including the leading `--`
 * @returns      the computed value, or "" during SSR / when undefined
 */
export function cssToken(name: string): string {
  if (typeof window === "undefined" || typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** `var(--x)` reference for a token name (inline styles that need the live, theme-aware value). */
export function cssVar(name: string): string {
  return `var(${name})`;
}
