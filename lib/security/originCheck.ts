/**
 * Same-origin check for API calls (PRD §21.1 step 2). Allowed: Sec-Fetch-Site same-origin/none,
 * or an Origin whose host is this deployment / NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_SITE_URL /
 * Vercel URLs. Neither header present (scripts, old clients) → allowed with half budget.
 */
import { env } from "../env";

export type OriginVerdict = { ok: true; halfBudget: boolean } | { ok: false };

function hostOf(v: string | undefined | null): string | null {
  if (!v) return null;
  try { return new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).host.toLowerCase(); } catch { return null; }
}
export function allowedHosts(h: Headers): Set<string> {
  const e = env();
  return new Set([
    h.get("x-forwarded-host"), h.get("host"),
    e.NEXT_PUBLIC_APP_URL, e.NEXT_PUBLIC_SITE_URL, e.VERCEL_PROJECT_PRODUCTION_URL, e.VERCEL_URL, e.VERCEL_BRANCH_URL,
  ].map((v) => hostOf(v)).filter((x): x is string => Boolean(x)));
}

export function checkOrigin(h: Headers): OriginVerdict {
  const site = h.get("sec-fetch-site");
  const origin = h.get("origin");
  if (site === "same-origin" || site === "none") return { ok: true, halfBudget: false };
  if (origin && origin !== "null") {
    const host = hostOf(origin);
    return host && allowedHosts(h).has(host) ? { ok: true, halfBudget: false } : { ok: false };
  }
  if (site === "cross-site" || site === "same-site") return { ok: false };
  return { ok: true, halfBudget: true };
}
