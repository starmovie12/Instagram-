/**
 * Instagram extraction layer — saara Instagram-specific logic YAHIN hai.
 * Config (doc_id, headers) `lib/instagram-config.ts` me hai; toote to wahi patch karo.
 */
import { IG_CONFIG } from "./instagram-config";

export type Quality = {
  /** Human label, e.g. "1080p", "720p", "480p" */
  label: string;
  url: string;
  width?: number;
  height?: number;
};

export type MediaItem = {
  type: "video" | "image";
  /** Direct CDN URL of the best-quality media (preview + default download) */
  url: string;
  /** Poster/preview image */
  thumbnail: string;
  width?: number;
  height?: number;
  /** Every available quality (video_versions / display_resources), best first */
  qualities?: Quality[];
};

/** Resolution label from dimensions (the shorter side, so portrait reels read 1080p). */
function labelForDims(w?: number, h?: number): string {
  const q = Math.min(w || 0, h || 0);
  if (q >= 2160) return "4K";
  if (q >= 1440) return "1440p";
  if (q >= 1080) return "1080p";
  if (q >= 720) return "720p";
  if (q >= 640) return "640p";
  if (q >= 480) return "480p";
  if (q >= 360) return "360p";
  if (q > 0) return `${q}p`;
  return "HD";
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Build a de-duplicated, best-first list of video qualities from video_versions. */
function videoQualities(versions: any[]): Quality[] {
  const seen = new Set<string>();
  const out: Quality[] = [];
  for (const v of versions ?? []) {
    const url = v?.url;
    if (!url || typeof url !== "string") continue;
    const label = labelForDims(v?.width, v?.height);
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ label, url, width: v?.width, height: v?.height });
  }
  out.sort((a, b) => (b.height ?? 0) - (a.height ?? 0));
  return out;
}

/** Build image size options from GraphQL display_resources. */
function imageQualities(resources: any[]): Quality[] {
  const seen = new Set<string>();
  const out: Quality[] = [];
  for (const r of resources ?? []) {
    const url = r?.src;
    if (!url) continue;
    const w = r?.config_width, h = r?.config_height;
    const label = w ? `${w}px` : "HD";
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ label, url, width: w, height: h });
  }
  out.sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return out;
}

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
      | "INVALID_USERNAME"
      | "PRIVATE"
      | "NOT_FOUND"
      | "NO_STORIES"
      | "NO_HIGHLIGHTS"
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

  const toItem = (node: any): MediaItem => {
    if (node?.is_video) {
      const qualities = Array.isArray(node?.video_versions) && node.video_versions.length
        ? videoQualities(node.video_versions)
        : node?.video_url
          ? [{ label: labelForDims(node?.dimensions?.width, node?.dimensions?.height), url: node.video_url, width: node?.dimensions?.width, height: node?.dimensions?.height }]
          : [];
      return {
        type: "video",
        url: qualities[0]?.url ?? node.video_url,
        thumbnail: node.display_url ?? node.thumbnail_src ?? "",
        width: node?.dimensions?.width,
        height: node?.dimensions?.height,
        qualities,
      };
    }
    const imgQ = Array.isArray(node?.display_resources) ? imageQualities(node.display_resources) : [];
    return {
      type: "image",
      url: node?.display_url ?? imgQ[0]?.url ?? "",
      thumbnail: node?.display_url ?? "",
      width: node?.dimensions?.width,
      height: node?.dimensions?.height,
      qualities: imgQ.length > 1 ? imgQ : undefined,
    };
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

/**
 * Session priming — the fix for the PRD's #1 risk (serverless IP block).
 * Instagram serves logged-out datacenter requests EMPTY data unless the call
 * carries a real csrftoken cookie. We fetch the homepage once, harvest the
 * cookies Instagram sets, and reuse them (cached ~15 min) on every extraction.
 */
let sessionCache: { cookie: string; csrf: string; at: number } | null = null;

async function getSession(): Promise<{ cookie: string; csrf: string }> {
  if (sessionCache && Date.now() - sessionCache.at < 15 * 60_000) {
    return { cookie: sessionCache.cookie, csrf: sessionCache.csrf };
  }
  try {
    const res = await fetch("https://www.instagram.com/", {
      headers: {
        "User-Agent": IG_CONFIG.userAgent,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
    });
    // undici exposes getSetCookie(); fall back to the combined header.
    const setCookies: string[] =
      (res.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ??
      (res.headers.get("set-cookie") ? [res.headers.get("set-cookie")!] : []);
    const jar: Record<string, string> = {};
    for (const c of setCookies) {
      const [pair] = c.split(";");
      const eq = pair.indexOf("=");
      if (eq > 0) jar[pair.slice(0, eq).trim()] = pair.slice(eq + 1).trim();
    }
    const csrf = jar["csrftoken"] ?? "";
    const cookie = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
    if (cookie) {
      sessionCache = { cookie, csrf, at: Date.now() };
      return { cookie, csrf };
    }
  } catch {
    /* fall through — try without a primed session */
  }
  return { cookie: "", csrf: "" };
}

/** Primary method: Instagram's own public GraphQL endpoint. */
async function extractViaGraphql(shortcode: string): Promise<ExtractResult> {
  const session = await getSession();
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
        "X-IG-WWW-Claim": "0",
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Site": "same-origin",
        Origin: "https://www.instagram.com",
        Referer: `https://www.instagram.com/p/${shortcode}/`,
        ...(session.csrf ? { "X-CSRFToken": session.csrf } : {}),
        ...(session.cookie ? { Cookie: session.cookie } : {}),
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

  // Combine every message Instagram sent so we can classify the failure.
  const errMsg = [
    json?.message,
    ...(Array.isArray(json?.errors) ? json.errors.map((e: any) => e?.message) : []),
  ].filter(Boolean).join(" ").toLowerCase();

  // "please wait / rate / login / checkpoint" = our data-center IP is blocked,
  // NOT a doc_id problem. This is the PRD's #1 risk.
  const looksBlocked =
    json?.require_login === true ||
    json?.status === "fail" ||
    /wait a few|rate limit|too many|login|checkpoint|challenge|try again|temporarily/.test(errMsg);
  if (looksBlocked) {
    throw new ExtractError(
      "Instagram is blocking our server right now (data-center IP) — this is temporary, not a broken link. Please try again in a minute.",
      "UPSTREAM_BLOCKED"
    );
  }

  const hasMediaField =
    json?.data && ("xdt_shortcode_media" in json.data || "shortcode_media" in json.data);
  const media = json?.data?.xdt_shortcode_media ?? json?.data?.shortcode_media;

  if (!media) {
    // data present + media field explicitly null → the post is private/deleted.
    if (hasMediaField) {
      throw new ExtractError(
        "This post is private or was deleted. Only public content can be downloaded.",
        "PRIVATE"
      );
    }
    // A genuine query/doc_id error (errors present, but not a block message).
    if (errMsg) {
      throw new ExtractError(
        "The extractor needs a doc_id refresh (Instagram rejected the query). We'll patch it shortly.",
        "EXTRACTOR_DOWN"
      );
    }
    // data === null with no media field and no message → empty response to our
    // server = the classic data-center IP block, NOT a doc_id problem.
    throw new ExtractError(
      "Instagram returned an empty response to our server — usually a temporary data-center IP block, not a broken link. Please try again in a minute.",
      "UPSTREAM_BLOCKED"
    );
  }

  return parseGraphqlMedia(media, shortcode);
}

/**
 * Normalize whatever JSON a third-party provider returns into our shape.
 * Handles the common patterns so most providers work without code changes:
 *  1. Instagram's own GraphQL shape (many providers proxy it verbatim)
 *  2. A generic { media:[{type,url,thumbnail}], caption, username } shape
 *  3. Flat fields (video_url / image_url / display_url / download_url …)
 */
function normalizeFallback(json: any, shortcode: string): ExtractResult {
  // 1 — GraphQL shape (reuse the exact same parser as the direct method)
  const gql =
    json?.data?.xdt_shortcode_media ?? json?.data?.shortcode_media ??
    json?.xdt_shortcode_media ?? json?.shortcode_media;
  if (gql && (gql.is_video !== undefined || gql.edge_sidecar_to_children || gql.display_url)) {
    return parseGraphqlMedia(gql, shortcode);
  }

  const root = json?.data ?? json?.result ?? json;
  const caption: string =
    root?.caption?.text ?? root?.caption ?? root?.title ?? root?.description ?? "";
  const username: string = root?.username ?? root?.owner?.username ?? root?.author ?? "";
  const fullName: string = root?.full_name ?? root?.owner?.full_name ?? "";

  // Pull a quality list from whatever array a provider used for versions.
  const provQualities = (m: any): Quality[] | undefined => {
    const vers = m?.video_versions ?? m?.qualities ?? m?.resources ?? m?.formats ?? m?.links;
    if (Array.isArray(vers) && vers.length > 1) {
      const q = vers
        .map((v: any) => {
          const url = typeof v === "string" ? v : v?.url ?? v?.src ?? v?.download_url;
          if (!url) return null;
          return { label: v?.quality ?? v?.label ?? labelForDims(v?.width, v?.height), url, width: v?.width, height: v?.height };
        })
        .filter(Boolean) as Quality[];
      return q.length > 1 ? q : undefined;
    }
    return undefined;
  };

  const pushItem = (out: MediaItem[], type: "video" | "image", url?: string, thumb?: string, qualities?: Quality[]) => {
    if (url && typeof url === "string") out.push({ type, url, thumbnail: thumb ?? "", qualities });
  };
  const items: MediaItem[] = [];

  // 2 — array of media (carousel or single) under common keys
  const arr =
    (Array.isArray(root?.media) && root.media) ||
    (Array.isArray(root?.medias) && root.medias) ||
    (Array.isArray(root?.items) && root.items) ||
    (Array.isArray(root?.url) && root.url) ||
    null;
  if (arr) {
    for (const m of arr) {
      const isVid = m?.type === "video" || m?.is_video || !!m?.video_url || m?.media_type === 2;
      const q = provQualities(m);
      const url = q?.[0]?.url ?? m?.video_url ?? m?.url ?? m?.download_url ?? m?.src ?? m?.display_url ?? m?.image ?? m?.thumbnail;
      pushItem(items, isVid ? "video" : "image", typeof m === "string" ? m : url, m?.thumbnail ?? m?.display_url ?? m?.cover, q);
    }
  }

  // 3 — flat single-media fields
  if (items.length === 0) {
    const q = provQualities(root);
    const video = q?.[0]?.url ?? root?.video_url ?? root?.videoUrl ?? root?.video ?? root?.download_url;
    const image = root?.image_url ?? root?.display_url ?? root?.thumbnail_url ?? root?.image ?? root?.url;
    if (video) pushItem(items, "video", video, root?.thumbnail ?? root?.display_url ?? image, q);
    else if (image) pushItem(items, "image", image, image);
  }

  if (items.length === 0) {
    throw new ExtractError(
      "The fallback API responded but no media URL could be found in it. Its response format may need a small adapter.",
      "EXTRACTOR_DOWN"
    );
  }

  const thumbnail = items[0].thumbnail || (items[0].type === "image" ? items[0].url : "");
  return {
    type: items.length > 1 ? "carousel" : items[0].type,
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

/** Fallback: a third-party API configured via env (see instagram-config.ts). */
async function extractViaFallback(rawUrl: string, shortcode: string): Promise<ExtractResult> {
  if (!IG_CONFIG.fallbackApiUrl) {
    throw new ExtractError(
      "Instagram blocked our server and no fallback API is configured. Set FALLBACK_API_URL in the environment to enable reliable extraction.",
      "UPSTREAM_BLOCKED"
    );
  }
  const postUrl = `https://www.instagram.com/p/${shortcode}/`;
  const endpoint = IG_CONFIG.fallbackApiUrl
    .replace("{shortcode}", encodeURIComponent(shortcode))
    .replace("{url}", encodeURIComponent(rawUrl || postUrl));

  let res: Response;
  try {
    res = await fetch(endpoint, {
      headers: IG_CONFIG.fallbackApiKey
        ? { [IG_CONFIG.fallbackApiKeyHeader]: IG_CONFIG.fallbackApiKey }
        : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ExtractError("Couldn't reach the fallback API. Please try again.", "UPSTREAM_BLOCKED");
  }
  if (!res.ok) {
    throw new ExtractError(
      `The fallback API returned an error (HTTP ${res.status}). Check your FALLBACK_API_URL / key.`,
      "EXTRACTOR_DOWN"
    );
  }
  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new ExtractError("The fallback API returned a non-JSON response.", "EXTRACTOR_DOWN");
  }
  return normalizeFallback(json, shortcode);
}

export async function extract(rawUrl: string): Promise<ExtractResult> {
  const shortcode = parseShortcode(rawUrl);

  // Force fallback-first if explicitly configured.
  if (IG_CONFIG.useFallbackApi && IG_CONFIG.fallbackApiUrl) {
    return extractViaFallback(rawUrl, shortcode);
  }

  try {
    return await extractViaGraphql(shortcode);
  } catch (err) {
    // AUTO-fallback: if the direct method got blocked / went stale and a
    // fallback API is configured, try it before giving up.
    const recoverable =
      err instanceof ExtractError &&
      (err.code === "UPSTREAM_BLOCKED" || err.code === "EXTRACTOR_DOWN");
    if (recoverable && IG_CONFIG.fallbackApiUrl) {
      return extractViaFallback(rawUrl, shortcode);
    }
    throw err;
  }
}

/* ============================================================
   USERNAME-BASED TOOLS
   (Profile Picture · Stories · Anonymous Viewer · Highlights)
   ============================================================ */

export type ProfileResult = {
  username: string;
  fullName: string;
  userId: string;
  isPrivate: boolean;
  isVerified: boolean;
  biography: string;
  followers: number;
  following: number;
  posts: number;
  profilePicHd: string;
};

export type StoryItem = {
  type: "video" | "image";
  url: string;
  thumbnail: string;
  takenAt: number;
  qualities?: Quality[];
};

export type StoriesResult = {
  username: string;
  fullName: string;
  profilePicHd: string;
  items: StoryItem[];
};

export type HighlightAlbum = {
  id: string;
  title: string;
  cover: string;
};

export type HighlightsResult = {
  username: string;
  fullName: string;
  profilePicHd: string;
  albums: HighlightAlbum[];
};

/** Accept "@handle", "handle", or any instagram.com/<handle> URL. */
export function parseUsername(raw: string): string {
  const input = raw.trim();
  if (!input) throw new ExtractError("Please enter a username.", "INVALID_USERNAME");

  let candidate = input;
  if (/^https?:\/\//i.test(input) || input.includes("instagram.com")) {
    try {
      const url = new URL(input.startsWith("http") ? input : `https://${input}`);
      candidate = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } catch {
      /* fall through */
    }
  }
  candidate = candidate.replace(/^@/, "").trim();

  if (!/^[A-Za-z0-9._]{1,30}$/.test(candidate)) {
    throw new ExtractError(
      "That doesn't look like a valid username. Use a handle like @nasa.",
      "INVALID_USERNAME"
    );
  }
  return candidate;
}

async function igHeaders(referer = "https://www.instagram.com/") {
  const session = await getSession();
  return {
    "User-Agent": IG_CONFIG.userAgent,
    "X-IG-App-ID": IG_CONFIG.appId,
    "X-ASBD-ID": "129477",
    "X-IG-WWW-Claim": "0",
    "X-Requested-With": "XMLHttpRequest",
    "Sec-Fetch-Site": "same-origin",
    Referer: referer,
    Accept: "*/*",
    ...(session.csrf ? { "X-CSRFToken": session.csrf } : {}),
    ...(session.cookie ? { Cookie: session.cookie } : {}),
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchJson(url: string, referer?: string): Promise<any> {
  let res: Response;
  try {
    res = await fetch(url, { headers: await igHeaders(referer), cache: "no-store" });
  } catch {
    throw new ExtractError("Couldn't reach Instagram. Please try again.", "UPSTREAM_BLOCKED");
  }
  if (res.status === 404) {
    throw new ExtractError("No account found with that username.", "NOT_FOUND");
  }
  if (res.status === 401 || res.status === 429 || res.status === 403) {
    throw new ExtractError(
      "Instagram is blocking our server right now (data-center IP). Please try again in a minute.",
      "UPSTREAM_BLOCKED"
    );
  }
  if (!res.ok) {
    throw new ExtractError("Instagram returned an unexpected response.", "EXTRACTOR_DOWN");
  }
  try {
    return await res.json();
  } catch {
    throw new ExtractError(
      "Instagram returned an empty/non-JSON response — usually a temporary data-center IP block. Please try again shortly.",
      "UPSTREAM_BLOCKED"
    );
  }
}

export async function extractProfile(rawUsername: string): Promise<ProfileResult> {
  const username = parseUsername(rawUsername);
  const json = await fetchJson(
    IG_CONFIG.webProfileInfoUrl + encodeURIComponent(username),
    `https://www.instagram.com/${username}/`
  );
  const u = json?.data?.user;
  if (!u) {
    throw new ExtractError("No account found with that username.", "NOT_FOUND");
  }
  return {
    username: u.username ?? username,
    fullName: u.full_name ?? "",
    userId: u.id ?? "",
    isPrivate: !!u.is_private,
    isVerified: !!u.is_verified,
    biography: u.biography ?? "",
    followers: u.edge_followed_by?.count ?? 0,
    following: u.edge_follow?.count ?? 0,
    posts: u.edge_owner_to_timeline_media?.count ?? 0,
    profilePicHd: u.profile_pic_url_hd ?? u.profile_pic_url ?? "",
  };
}

function reelItemToStory(item: any): StoryItem {
  const isVideo = item?.media_type === 2 || Array.isArray(item?.video_versions);
  if (isVideo) {
    const qualities = videoQualities(item?.video_versions ?? []);
    return {
      type: "video",
      url: qualities[0]?.url ?? item?.video_versions?.[0]?.url ?? "",
      thumbnail: item?.image_versions2?.candidates?.[0]?.url ?? "",
      takenAt: item?.taken_at ?? 0,
      qualities,
    };
  }
  return {
    type: "image",
    url: item?.image_versions2?.candidates?.[0]?.url ?? "",
    thumbnail: item?.image_versions2?.candidates?.[0]?.url ?? "",
    takenAt: item?.taken_at ?? 0,
  };
}

export async function extractStories(rawUsername: string): Promise<StoriesResult> {
  const profile = await extractProfile(rawUsername);
  if (profile.isPrivate) {
    throw new ExtractError(
      "This account is private — only public stories can be viewed or downloaded.",
      "PRIVATE"
    );
  }
  const json = await fetchJson(
    IG_CONFIG.reelsMediaUrl + encodeURIComponent(profile.userId),
    `https://www.instagram.com/${profile.username}/`
  );
  const reel = json?.reels?.[profile.userId] ?? json?.reels_media?.[0];
  const rawItems: any[] = reel?.items ?? [];
  const items = rawItems.map(reelItemToStory).filter((i) => i.url);
  if (items.length === 0) {
    throw new ExtractError(
      `@${profile.username} has no active stories right now (stories last only 24 hours).`,
      "NO_STORIES"
    );
  }
  return {
    username: profile.username,
    fullName: profile.fullName,
    profilePicHd: profile.profilePicHd,
    items,
  };
}

export async function extractHighlights(rawUsername: string): Promise<HighlightsResult> {
  const profile = await extractProfile(rawUsername);
  if (profile.isPrivate) {
    throw new ExtractError(
      "This account is private — only public highlights can be accessed.",
      "PRIVATE"
    );
  }
  const json = await fetchJson(
    IG_CONFIG.highlightsTrayUrl.replace("{userId}", encodeURIComponent(profile.userId)),
    `https://www.instagram.com/${profile.username}/`
  );
  const tray: any[] = json?.tray ?? [];
  const albums: HighlightAlbum[] = tray.map((t) => ({
    id: String(t?.id ?? "").replace(/^highlight:/, ""),
    title: t?.title ?? "Highlight",
    cover:
      t?.cover_media?.cropped_image_version?.url ??
      t?.cover_media?.image_versions2?.candidates?.[0]?.url ??
      "",
  })).filter((a) => a.cover);

  if (albums.length === 0) {
    throw new ExtractError(
      `@${profile.username} has no highlights, or they aren't publicly accessible.`,
      "NO_HIGHLIGHTS"
    );
  }
  return {
    username: profile.username,
    fullName: profile.fullName,
    profilePicHd: profile.profilePicHd,
    albums,
  };
}

/** Fetch the stories inside a single highlight album (by highlight id). */
export async function extractHighlightItems(highlightId: string): Promise<StoryItem[]> {
  const id = highlightId.replace(/[^0-9]/g, "");
  if (!id) throw new ExtractError("Invalid highlight id.", "INVALID_USERNAME");
  const json = await fetchJson(
    IG_CONFIG.reelsMediaUrl + encodeURIComponent(`highlight:${id}`)
  );
  const reel = json?.reels?.[`highlight:${id}`] ?? json?.reels_media?.[0];
  const rawItems: any[] = reel?.items ?? [];
  return rawItems.map(reelItemToStory).filter((i) => i.url);
}
