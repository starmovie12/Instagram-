import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withGuard, type GuardContext } from "@/lib/security/guard";
import {
  extractProfile,
  extractProfileFeed,
  extractStories,
  extractHighlights,
  extractHighlightItems,
  ExtractError,
} from "@/lib/instagram-extractor";
import { isRateLimited } from "@/lib/rate-limit";
import { IG_CONFIG } from "@/lib/instagram-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function statusFor(code: string): number {
  switch (code) {
    case "INVALID_USERNAME":
      return 400;
    case "PRIVATE":
    case "NOT_FOUND":
    case "NO_STORIES":
    case "NO_HIGHLIGHTS":
      return 404;
    default:
      return 503;
  }
}

type ProfileRequest = {
  type: string;
  username: string;
  highlightId: string;
  sessionId: string | null;
};

async function handle(req: NextRequest, r: ProfileRequest) {
  const ip = clientIp(req);
  if (isRateLimited(ip, IG_CONFIG.rateLimitPerMinute)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute and try again." },
      { status: 429 }
    );
  }
  const { type, username, highlightId, sessionId } = r;

  try {
    switch (type) {
      case "dp": {
        const profile = await extractProfile(username, { sessionId });
        return NextResponse.json(profile);
      }
      case "feed": {
        return NextResponse.json(await extractProfileFeed(username, { sessionId }));
      }
      case "stories": {
        return NextResponse.json(await extractStories(username, { sessionId }));
      }
      case "highlights": {
        return NextResponse.json(await extractHighlights(username, { sessionId }));
      }
      case "highlight-items": {
        return NextResponse.json({ items: await extractHighlightItems(highlightId, { sessionId }) });
      }
      default:
        return NextResponse.json({ error: "Unknown request type." }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof ExtractError) {
      return NextResponse.json({ error: err.message, code: err.code }, { status: statusFor(err.code) });
    }
    console.error(JSON.stringify({ level: "error", route: "/api/profile", error: (err as Error)?.name ?? "Error" }));
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}

/** GET /api/profile?username=xyz  (purana GoldenBar flow pehle GET try karta hai) → DP/profile */
async function handleGET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") ?? "";
  return handle(req, { type: "dp", username, highlightId: "", sessionId: null });
}

/** PRD §21.1 step 6 — bounded fields; unknown keys are dropped (≈15 tools call this route). */
const BodySchema = z.object({
  type: z.enum(["dp", "feed", "stories", "highlights", "highlight-items", ""]).optional(),
  username: z.string().max(64).optional(),
  highlightId: z.string().max(40).regex(/^[0-9]*$/).optional(),
  sessionId: z.string().max(512).regex(/^[A-Za-z0-9%._:-]*$/).optional(),
});

async function handlePOST(req: NextRequest, ctx: GuardContext) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    await ctx.signal("VALIDATION_FAIL");
    return NextResponse.json({ error: "Invalid request.", code: "INVALID_URL" }, { status: 400 });
  }
  const username = parsed.data.username ?? "";
  // Purana GoldenBar sirf { username } bhejta hai (type nahi) — usse DP maano.
  const type = parsed.data.type || (username ? "dp" : "");
  // Session ID: sirf POST body, log/store/echo nahi
  return handle(req, { type, username, highlightId: parsed.data.highlightId ?? "", sessionId: parsed.data.sessionId || null });
}

/* PRD §21.1 perimeter: origin · ban · tarpit · rate limit · headers · structured log */
export const GET = withGuard("/api/profile", { profile: "extract", methods: ["GET", "POST"] }, handleGET);
export const POST = withGuard("/api/profile", { profile: "extract", methods: ["GET", "POST"] }, handlePOST);
