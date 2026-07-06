import { NextRequest, NextResponse } from "next/server";
import {
  extract,
  extractStories,
  extractHighlightItems,
  ExtractError,
} from "@/lib/instagram-extractor";
import {
  coreToUi,
  storyItemsToUi,
  toUiErrorCode,
  statusForUiError,
} from "@/lib/extract-ui";
import { isRateLimited } from "@/lib/rate-limit";
import { IG_CONFIG } from "@/lib/instagram-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function errorResponse(code: ReturnType<typeof toUiErrorCode> | "RATE_LIMITED", message: string) {
  return NextResponse.json({ error: { code, message } }, { status: statusForUiError(code) });
}

/** instagram.com/stories/<username>/<id?> and instagram.com/stories/highlights/<id> */
const STORY_RE = /instagram\.com\/stories\/([\w.]+)(?:\/(\d+))?/i;

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isRateLimited(ip, IG_CONFIG.rateLimitPerMinute)) {
    return errorResponse("RATE_LIMITED", "Too many requests — please wait a minute and try again.");
  }

  let url: string;
  try {
    const body = await req.json();
    url = String(body?.url ?? "").trim();
  } catch {
    return errorResponse("INVALID_URL", "Invalid request body.");
  }
  if (!url) {
    return errorResponse("INVALID_URL", "Please paste an Instagram link.");
  }

  try {
    const storyMatch = url.match(STORY_RE);
    if (storyMatch) {
      const [, segment, id] = storyMatch;
      if (segment.toLowerCase() === "highlights" && id) {
        const items = await extractHighlightItems(id);
        if (!items.length) {
          return errorResponse("STORY_EXPIRED", "This highlight has no items or doesn't exist.");
        }
        return NextResponse.json({ data: storyItemsToUi(items, "", `highlight-${id}`) });
      }
      const stories = await extractStories(segment);
      return NextResponse.json({
        data: storyItemsToUi(stories.items, stories.username, `story-${stories.username}`),
      });
    }

    const result = await extract(url);
    return NextResponse.json({ data: coreToUi(result) });
  } catch (err) {
    if (err instanceof ExtractError) {
      return errorResponse(toUiErrorCode(err.code), err.message);
    }
    console.error("extract failed:", err);
    return errorResponse("EXTRACTOR_DOWN", "Something went wrong on our side. Please try again.");
  }
}
