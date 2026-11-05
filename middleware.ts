/**
 * Edge middleware (PRD §21.3, §22.2) — deliberately narrow:
 *  • honeypot paths → HONEYPOT_TRIP signal (24 h ban), 4–8 s tarpit, generic 500
 *  • /api/*        → early ban check when bans are shared (Upstash); otherwise each route's guard checks
 * Pages, assets and everything else never pass through here.
 */
import { NextResponse, type NextRequest } from "next/server";
import { isHoneypot } from "@/lib/security/honeypots";
import { subjectOf } from "@/lib/security/ipHash";
import { recordSignal, signalsOf } from "@/lib/security/behavior";
import { activeBan, applyBanIfNeeded, retryAfterSec } from "@/lib/security/banHammer";
import { tarpit } from "@/lib/security/tarpit";
import { sharedStore } from "@/lib/security/store";
import { newTraceId } from "@/lib/security/log";
import { tarpitMaxMs } from "@/lib/env";

export const config = {
  matcher: ["/api/:path*", "/wp-admin/:path*", "/wp-login.php", "/.env", "/.git/:path*", "/phpmyadmin/:path*"],
};

const NO_STORE = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (isHoneypot(path)) {
    const traceId = newTraceId();
    const s = await subjectOf(req.headers);
    try {
      await recordSignal(s.ipHash, "HONEYPOT_TRIP");
      await applyBanIfNeeded(s.ipHash, await signalsOf(s.ipHash));
    } catch { /* store outage never changes the response */ }
    await tarpit(s.ipHash, Math.min(4000 + Math.round(Math.random() * 4000), tarpitMaxMs()));
    console.warn(JSON.stringify({ level: "warn", route: "honeypot", status: 500, correlationId: traceId, outcome: "HONEYPOT_TRIP" }));
    return NextResponse.json({ error: "Request unavailable", traceId }, { status: 500, headers: { ...NO_STORE, "X-Trace-Id": traceId } });
  }

  if (path.startsWith("/api/") && sharedStore()) {
    const s = await subjectOf(req.headers);
    const ban = await activeBan(s.ipHash);
    if (ban) {
      const traceId = newTraceId();
      return NextResponse.json(
        { error: "Temporarily blocked — unusual traffic from your network.", code: "BANNED", traceId },
        { status: 403, headers: { ...NO_STORE, "Retry-After": String(retryAfterSec(ban)), "X-Trace-Id": traceId } },
      );
    }
  }
  return NextResponse.next();
}
