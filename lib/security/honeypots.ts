/** Honeypot paths (PRD §21.3) — shared by middleware.ts and app/robots.ts. No real page lives here. */
export const HONEYPOT_PATHS = [
  "/wp-admin/", "/wp-login.php", "/.env", "/.git/config", "/phpmyadmin/",
  "/api/debug", "/api/internal/dump", "/api/v1/users/.json",
] as const;

export function isHoneypot(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return HONEYPOT_PATHS.some((h) => (h.endsWith("/") ? p === h.slice(0, -1) || p.startsWith(h) : p === h || p.startsWith(h + "/")));
}
