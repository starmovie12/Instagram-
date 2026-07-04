import { NextRequest, NextResponse } from "next/server";
import { extract, ExtractError } from "@/lib/instagram-extractor";
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

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isRateLimited(ip, IG_CONFIG.rateLimitPerMinute)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a minute and try again." },
      { status: 429 }
    );
  }

  let url: string;
  try {
    const body = await req.json();
    url = String(body?.url ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!url) {
    return NextResponse.json({ error: "Please paste an Instagram link." }, { status: 400 });
  }

  try {
    const result = await extract(url);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ExtractError) {
      const status =
        err.code === "INVALID_URL" ? 400 :
        err.code === "PRIVATE" || err.code === "NOT_FOUND" ? 404 :
        err.code === "STORY_UNSUPPORTED" ? 422 : 503;
      return NextResponse.json({ error: err.message, code: err.code }, { status });
    }
    console.error("extract failed:", err);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}
