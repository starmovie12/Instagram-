import { NextRequest, NextResponse } from "next/server";
import { withGuard } from "@/lib/security/guard";
import { isRateLimited } from "@/lib/rate-limit";

/** Fields we read from cdn.syndication.twimg.com (everything optional — third-party JSON). */
type SyndicationVariant = { content_type?: string; url?: string; bitrate?: number };
type SyndicationMedia = { type?: string; media_url_https?: string; video_info?: { variants?: SyndicationVariant[] } };
type SyndicationTweet = {
  __typename?: string;
  mediaDetails?: SyndicationMedia[];
  photos?: { url?: string }[];
  text?: string;
  user?: { screen_name?: string; name?: string };
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * G3 — Twitter/X video & photo extractor via the public tweet syndication
 * endpoint (the one that powers embedded tweets — no API key needed).
 */
const TWEET_ID_RE = /(?:twitter\.com|x\.com)\/\w+\/status(?:es)?\/(\d+)/i;

/** The syndication endpoint requires a token derived from the tweet id. */
function syndicationToken(id: string): string {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
}

type MediaOut = { type: "video" | "image"; url: string; thumbnail: string; label?: string };

async function handlePOST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited("tw:" + ip, 15)) {
    return NextResponse.json({ error: "Too many requests — wait a minute." }, { status: 429 });
  }

  let url = "";
  try {
    const body = await req.json();
    url = String(body?.url ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = url.match(TWEET_ID_RE)?.[1];
  if (!id) {
    return NextResponse.json({ error: "That doesn't look like a tweet link (twitter.com/…/status/… or x.com/…)." }, { status: 400 });
  }

  try {
    const endpoint = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${syndicationToken(id)}`;
    const res = await fetch(endpoint, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: res.status === 404 ? "Tweet not found — deleted, private, or age-restricted." : `Twitter returned HTTP ${res.status} — try again.` },
        { status: 502 }
      );
    }
    const json = (await res.json().catch(() => null)) as SyndicationTweet | null;
    if (!json || json.__typename === "TweetTombstone") {
      return NextResponse.json({ error: "This tweet is unavailable (deleted or restricted)." }, { status: 404 });
    }

    const media: MediaOut[] = [];
    for (const m of json?.mediaDetails ?? []) {
      if (m?.type === "video" || m?.type === "animated_gif") {
        const variants = (m?.video_info?.variants ?? [])
          .filter((v) => v?.content_type === "video/mp4" && v?.url)
          .sort((a, b) => (b?.bitrate ?? 0) - (a?.bitrate ?? 0));
        if (variants[0]) {
          media.push({ type: "video", url: variants[0].url ?? "", thumbnail: m?.media_url_https ?? "", label: m?.type === "animated_gif" ? "GIF (MP4)" : "Video" });
        }
      } else if (m?.type === "photo" && m?.media_url_https) {
        media.push({ type: "image", url: `${m.media_url_https}?name=orig`, thumbnail: m.media_url_https });
      }
    }
    // Photos-only tweets sometimes expose media via `photos` instead.
    if (!media.length) {
      for (const p of json?.photos ?? []) {
        if (p?.url) media.push({ type: "image", url: `${p.url}?name=orig`, thumbnail: p.url });
      }
    }
    if (!media.length) {
      return NextResponse.json({ error: "No downloadable media on this tweet — is it text-only?" }, { status: 404 });
    }

    return NextResponse.json({
      media,
      text: String(json?.text ?? ""),
      username: String(json?.user?.screen_name ?? ""),
      name: String(json?.user?.name ?? ""),
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach Twitter — try again in a moment." }, { status: 502 });
  }
}

/* PRD §21.1 perimeter: origin · ban · tarpit · rate limit · headers · structured log */
export const POST = withGuard("/api/twitter", { profile: "og", methods: ["POST"] }, handlePOST);
