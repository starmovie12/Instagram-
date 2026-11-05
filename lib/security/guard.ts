/**
 * API perimeter (PRD §21.1). Every /api route handler is wrapped:
 *   1 method · content-type · body cap → 405 / 415 / 413
 *   2 Origin / Sec-Fetch-Site → 403 FORBIDDEN_ORIGIN (+ signal)
 *   3 ban check → 403 BANNED + Retry-After
 *   4 behaviour score → tarpit delay
 *   5 rate limit → 429 RATE_LIMITED + Retry-After (+ penalty delay on repeats)
 *   6–8 validation / allowlists / outbound limits stay in the handler (it can raise signals via ctx)
 *  10 structured log (route, status, durationMs, correlationId) — never URLs, bodies or Session IDs
 *  11 no-store + nosniff + X-Trace-Id on every response; unexpected errors → generic 500 + traceId
 * The handler's own per-route limits (lib/rate-limit.ts) keep working inside.
 */
import { NextRequest, NextResponse } from "next/server";
import { subjectOf } from "./ipHash";
import { checkOrigin } from "./originCheck";
import { activeBan, applyBanIfNeeded, retryAfterSec } from "./banHammer";
import { rapidCadence, recordSignal, scoreOf, signalsOf, tarpitDelayMs, type SignalType } from "./behavior";
import { checkRate, PROFILES, type ProfileName } from "./rateLimit";
import { penaltyMs, tarpit } from "./tarpit";
import { incr } from "./store";
import { logApi, newTraceId } from "./log";

export type GuardOptions = {
  profile: ProfileName;
  /** Allowed methods (405 otherwise). */
  methods?: string[];
  /** POST/PUT bodies must be JSON (415 otherwise). Default true. */
  json?: boolean;
  /** Body cap in bytes (413 otherwise). Default 4096. */
  maxBody?: number;
  /** "same" (default) enforces the origin check; "any" for webhooks, short links, CSP reports. */
  origin?: "same" | "any";
  /** Error body shape the route's existing clients parse. "object" = { error: { code, message } }. */
  errorShape?: "string" | "object";
};
export type GuardContext = { traceId: string; ipHash: string; signal: (type: SignalType) => Promise<void> };
type Handler<P> = (req: NextRequest, ctx: GuardContext, route: P) => Promise<Response> | Response;

const MESSAGES: Record<string, string> = {
  METHOD_NOT_ALLOWED: "Method not allowed.",
  UNSUPPORTED_MEDIA_TYPE: "Send the request as JSON.",
  PAYLOAD_TOO_LARGE: "Request too large.",
  FORBIDDEN_ORIGIN: "This request isn't allowed from another site.",
  BANNED: "Temporarily blocked — unusual traffic from your network.",
  RATE_LIMITED: "Too many requests — please wait a moment and try again.",
  INTERNAL: "Request unavailable",
};

export function guardError(code: string, status: number, traceId: string, shape: "string" | "object" = "string", headers: Record<string, string> = {}) {
  const message = MESSAGES[code] ?? MESSAGES.INTERNAL;
  const body = shape === "object" ? { error: { code, message }, traceId } : { error: message, code, traceId };
  return NextResponse.json(body, { status, headers });
}

function harden(res: Response, traceId: string): Response {
  if (!res.headers.has("Cache-Control")) res.headers.set("Cache-Control", "no-store");
  // Routes keep their own per-minute limiters; every 429 still tells the client when to retry (AC-47).
  if (res.status === 429 && !res.headers.has("Retry-After")) res.headers.set("Retry-After", "60");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Trace-Id", traceId);
  return res;
}

export function withGuard<P = unknown>(route: string, opts: GuardOptions, handler: Handler<P>) {
  const profile = PROFILES[opts.profile];
  const shape = opts.errorShape ?? "string";
  const maxBody = opts.maxBody ?? 4096;
  return async (req: NextRequest, routeCtx: P): Promise<Response> => {
    const t0 = Date.now();
    const traceId = newTraceId();
    const done = (res: Response, outcome?: string) => {
      harden(res, traceId);
      logApi({ route, status: res.status, durationMs: Date.now() - t0, correlationId: traceId, ...(outcome ? { outcome } : {}) });
      return res;
    };
    const fail = (code: string, status: number, headers: Record<string, string> = {}) => done(guardError(code, status, traceId, shape, headers), code);

    // 1 — method, content type, size
    const method = req.method.toUpperCase();
    if (opts.methods && !opts.methods.includes(method)) return fail("METHOD_NOT_ALLOWED", 405, { Allow: opts.methods.join(", ") });
    let forward = req;
    const hasBody = method !== "GET" && method !== "HEAD" && method !== "DELETE";
    if (hasBody) {
      if ((opts.json ?? true) && !(req.headers.get("content-type") ?? "").toLowerCase().includes("json")) return fail("UNSUPPORTED_MEDIA_TYPE", 415);
      const declared = Number(req.headers.get("content-length") ?? "NaN");
      if (Number.isFinite(declared) && declared > maxBody) return fail("PAYLOAD_TOO_LARGE", 413);
      const text = await req.text();
      if (new TextEncoder().encode(text).length > maxBody) return fail("PAYLOAD_TOO_LARGE", 413);
      forward = new NextRequest(req.url, { method: req.method, headers: req.headers, body: text });
    }

    const subject = await subjectOf(req.headers);
    const signal = async (type: SignalType) => {
      try {
        await recordSignal(subject.ipHash, type);
        await applyBanIfNeeded(subject.ipHash, await signalsOf(subject.ipHash));
      } catch { /* the store never blocks a response */ }
    };

    // 2 — origin
    const origin = opts.origin === "any" ? { ok: true as const, halfBudget: false } : checkOrigin(req.headers);
    if (!origin.ok) { await signal("ORIGIN_VIOLATION"); return fail("FORBIDDEN_ORIGIN", 403); }

    // 3 — ban
    const ban = await activeBan(subject.ipHash);
    if (ban) return fail("BANNED", 403, { "Retry-After": String(retryAfterSec(ban)) });

    // 4 — behaviour → tarpit
    if (rapidCadence(subject.ipHash)) await signal("RAPID_REQUEST_CADENCE");
    const delay = tarpitDelayMs(scoreOf(await signalsOf(subject.ipHash)));
    if (delay) await tarpit(subject.ipHash, delay);

    // 5 — rate limit
    const rate = await checkRate(route, profile, subject, origin.halfBudget);
    if (rate.limited) {
      await signal("RATE_LIMITED");
      const n = await incr(`pen:${subject.ipHash}`, 600_000);
      await tarpit(subject.ipHash, penaltyMs(n - 1));
      return fail("RATE_LIMITED", 429, { "Retry-After": String(rate.retryAfter) });
    }

    try {
      const res = await handler(forward, { traceId, ipHash: subject.ipHash, signal }, routeCtx);
      return done(res);
    } catch {
      return fail("INTERNAL", 500);
    }
  };
}
