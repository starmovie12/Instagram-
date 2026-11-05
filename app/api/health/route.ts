import { NextResponse } from "next/server";
import { sharedStore } from "@/lib/security/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Liveness probe (PRD §22.4). No secrets, no upstream calls — safe for uptime monitors. */
export function GET() {
  return NextResponse.json(
    { status: "ok", time: new Date().toISOString(), region: process.env.VERCEL_REGION ?? "local", sharedSecurityStore: sharedStore() },
    { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } },
  );
}
