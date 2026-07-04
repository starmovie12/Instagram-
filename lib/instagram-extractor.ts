/**
 * Instagram extraction layer — saara Instagram-specific logic YAHIN hai.
 * Config (doc_id, headers) `lib/instagram-config.ts` me hai; toote to wahi patch karo.
 */
import { IG_CONFIG } from "./instagram-config";

export type MediaItem = {
  type: "video" | "image";
  /** Direct CDN URL of the media */
  url: string;
  /** Poster/preview image */
  thumbnail: string;
  width?: number;
  height?: number;
};

export type ExtractResult = {
  type: "video" | "image" | "carousel";
  shortcode: string;
  username: string;
  fullName: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  thumbnail: string;
  media: MediaItem[];
};

export class ExtractError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_URL"
      | "PRIVATE"
      | "NOT_FOUND"
      | "STORY_UNSUPPORTED"
      | "EXTRACTOR_DOWN"
      | "UPSTREAM_BLOCKED"
  ) {
    super(message);
  }
}

/** Pull the shortcode out of any post/reel URL form. */
export function parseShortcode(rawUrl: string): string {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new ExtractError("That doesn't look like a valid URL.", "INVALID_URL");
  }
  if (!/(^|\.)instagram\.com$/.test(url.hostname) && !/(^|\.)instagr\.am$/.test(url.hostname)) {
    throw new ExtractError("Please paste an Instagram link (instagram.com/...).", "INVALID_URL");
  }
  if (/^\/stories\//.test(url.pathname)) {
    throw new ExtractError(
      "Story links need the story to still be live and public. Story support is limited right now — posts and reels work best.",
      "STORY_UNSUPPORTED"
    );
  }
  const m = url.pathname.match(/\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]{5,})/);
  if (!m) {
    throw new ExtractError(
      "Couldn't find a post/reel code in that link. Use a link like instagram.com/reel/ABC123/",
      "INVALID_URL"
    );
  }
  return m[1];
}

const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;
const MENTION_RE = /@([A-Za-z0-9._]+)/g;

export function extractHashtags(caption: string): string[] {
  return Array.from(new Set(caption.match(HASHTAG_RE) ?? []));
}

export function extractMentions(caption: string): string[] {
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = MENTION_RE.exec(caption)) !== null) out.add("@" + m[1]);
  return Array.from(out);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseGraphqlMedia(media: any, shortcode: string): ExtractResult {
  const caption: string =
    media?.edge_media_to_caption?.edges?.[0]?.node?.text ?? "";
  const username: string = media?.owner?.username ?? "";
  const fullName: string = media?.owner?.full_name ?? "";
  const thumbnail: string = media?.thumbnail_src ?? media?.display_url ?? "";

  const toItem = (node: any): MediaItem =>
    node?.is_video
      ? {
          type: "video",
          url: node.video_url,
          thumbnail: node.display_url ?? node.thumbnail_src ?? "",
          width: node?.dimensions?.width,
          height: node?.dimensions?.height,
        }
      : {
          type: "image",
          url: node?.display_url ?? "",
          thumbnail: node?.display_url ?? "",
          width: node?.dimensions?.width,
          height: node?.dimensions?.height,
        };

  let items: MediaItem[];
  let type: ExtractResult["type"];
  const children = media?.edge_sidecar_to_children?.edges;
  if (Array.isArray(children) && children.length > 0) {
    type = "carousel";
    items = children.map((e: any) => toItem(e.node)).filter((i: MediaItem) => i.url);
  } else {
    items = [toItem(media)].filter((i) => i.url);
    type = media?.is_video ? "video" : "image";
  }

  if (items.length === 0) {
    throw new ExtractError(
      "Media found but no downloadable URL — Instagram may have changed its format. Try again later.",
      "EXTRACTOR_DOWN"
    );
  }

  return {
    type,
    shortcode,
    username,
    fullName,
    caption,
    hashtags: extractHashtags(caption),
    mentions: extractMentions(caption),
    thumbnail,
    media: items,
  };
}

/** Primary method: Instagram's own public GraphQL endpoint. */
async function extractViaGraphql(shortcode: string): Promise<ExtractResult> {
  const variables = JSON.stringify({
    shortcode,
    fetch_tagged_user_count: null,
    hoisted_comment_id: null,
    hoisted_reply_id: null,
  });

  const body = new URLSearchParams({
    av: "0",
    __d: "www",
    __user: "0",
    __a: "1",
    __req: "3",
    dpr: "1",
    lsd: IG_CONFIG.lsd,
    fb_api_caller_class: "RelayModern",
    fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
    variables,
    server_timestamps: "true",
    doc_id: IG_CONFIG.docId,
  });

  let res: Response;
  try {
    res = await fetch(IG_CONFIG.graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": IG_CONFIG.userAgent,
        "X-IG-App-ID": IG_CONFIG.appId,
        "X-FB-LSD": IG_CONFIG.lsd,
        "X-ASBD-ID": "129477",
        "Sec-Fetch-Site": "same-origin",
        Origin: "https://www.instagram.com",
        Referer: `https://www.instagram.com/p/${shortcode}/`,
      },
      body: body.toString(),
      cache: "no-store",
    });
  } catch {
    throw new ExtractError(
      "Couldn't reach Instagram. Please try again in a moment.",
      "UPSTREAM_BLOCKED"
    );
  }

  if (res.status === 429 || res.status === 403) {
    throw new ExtractError(
      "Instagram is rate-limiting our server right now. Please try again in a minute.",
      "UPSTREAM_BLOCKED"
    );
  }
  if (!res.ok) {
    throw new ExtractError(
      "Instagram returned an unexpected response. Try again later.",
      "EXTRACTOR_DOWN"
    );
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new ExtractError(
      "Instagram changed its response format — the extractor needs a patch (doc_id rotate).",
      "EXTRACTOR_DOWN"
    );
  }

  const media = json?.data?.xdt_shortcode_media ?? json?.data?.shortcode_media;
  if (!media) {
    // Either the post is private/deleted, or doc_id rotated.
    if (json?.errors || json?.data === null) {
      throw new ExtractError(
        "The extractor is temporarily out of date (Instagram rotated its internal IDs). We'll patch it shortly.",
        "EXTRACTOR_DOWN"
      );
    }
    throw new ExtractError(
      "This post is private or was deleted. Only public content can be downloaded.",
      "PRIVATE"
    );
  }

  return parseGraphqlMedia(media, shortcode);
}

/** Fallback: a third-party API configured via env (see instagram-config.ts). */
async function extractViaFallback(shortcode: string): Promise<ExtractResult> {
  if (!IG_CONFIG.fallbackApiUrl) {
    throw new ExtractError(
      "Fallback API is enabled but FALLBACK_API_URL is not configured.",
      "EXTRACTOR_DOWN"
    );
  }
  const url = IG_CONFIG.fallbackApiUrl.replace("{shortcode}", shortcode);
  const res = await fetch(url, {
    headers: IG_CONFIG.fallbackApiKey
      ? { "x-api-key": IG_CONFIG.fallbackApiKey }
      : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new ExtractError("Fallback API request failed.", "EXTRACTOR_DOWN");
  }
  const json: any = await res.json();
  // Expect the fallback to return the same GraphQL media shape, or adapt here.
  const media = json?.data?.xdt_shortcode_media ?? json?.data?.shortcode_media ?? json;
  return parseGraphqlMedia(media, shortcode);
}

export async function extract(rawUrl: string): Promise<ExtractResult> {
  const shortcode = parseShortcode(rawUrl);
  if (IG_CONFIG.useFallbackApi) {
    return extractViaFallback(shortcode);
  }
  return extractViaGraphql(shortcode);
}
