import { NextRequest, NextResponse } from "next/server";
import { withGuard } from "@/lib/security/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * CSP violation sink (PRD §21.6, AC-61). Accepts the legacy `application/csp-report` body and the
 * Reporting API `application/reports+json` list. Logs only the directive and the blocked origin —
 * never full URLs, query strings or the page path.
 */
function originOf(v: unknown): string {
  if (typeof v !== "string") return "";
  if (["inline", "eval", "self", "data", "blob"].includes(v)) return v;
  try { return new URL(v).origin; } catch { return ""; }
}

async function handlePOST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const reports = Array.isArray(body) ? body : body && typeof body === "object" ? [body] : [];
  for (const r of reports.slice(0, 10)) {
    const o = r as Record<string, unknown>;
    const csp = (o["csp-report"] ?? o.body ?? {}) as Record<string, unknown>;
    const directive = String(csp["effective-directive"] ?? csp.effectiveDirective ?? csp["violated-directive"] ?? "").slice(0, 60);
    const blocked = originOf(csp["blocked-uri"] ?? csp.blockedURL);
    console.warn(JSON.stringify({ level: "warn", route: "/api/csp-report", directive, blocked }));
  }
  return new NextResponse(null, { status: 204 });
}

/* Browsers send reports without a page Origin guarantee → origin "any"; small bodies, light budget. */
export const POST = withGuard("/api/csp-report", { profile: "light", methods: ["POST"], origin: "any", json: false, maxBody: 16384 }, handlePOST);
