import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Download proxy: Instagram CDN blocks cross-origin fetches, so the browser
 * can't save the file directly. This route streams the media through with a
 * Content-Disposition header so the browser downloads instead of playing it.
 * Only Instagram/Facebook CDN hosts are allowed — this is NOT an open proxy.
 */
const ALLOWED_HOST_RE = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/;

function safeFilename(name: string, fallback: string): string {
  const cleaned = name.replace(/[^\w.-]+/g, "_").slice(0, 80);
  return cleaned || fallback;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited("dl:" + ip, 30)) {
    return NextResponse.json({ error: "Too many downloads — slow down a bit." }, { status: 429 });
  }

  const src = req.nextUrl.searchParams.get("url") ?? "";
  const requestedName =
    req.nextUrl.searchParams.get("filename") ??
    req.nextUrl.searchParams.get("name") ??
    "";

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid media URL." }, { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOST_RE.test(target.hostname)) {
    return NextResponse.json({ error: "URL not allowed." }, { status: 403 });
  }

  const upstream = await fetch(target.toString(), {
    headers: { "User-Agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Media expired — please extract the link again." },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  const ext = contentType.includes("video") ? "mp4" : "jpg";
  let filename = safeFilename(requestedName, `instagrab-${Date.now()}.${ext}`);
  if (!/\.(mp4|jpe?g|png|webp|heic)$/i.test(filename)) filename += `.${ext}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      ...(upstream.headers.get("content-length")
        ? { "Content-Length": upstream.headers.get("content-length")! }
        : {}),
    },
  });
}
