/**
 * ⚠️ SWAPPABLE EXTRACTOR CONFIG — jab site toote, SIRF ye file edit karo.
 *
 * Instagram apna `doc_id` har 2-4 hafte mein rotate karta hai.
 * Jab extractor empty result dene lage:
 *   1. Chrome DevTools kholo → Network tab
 *   2. Kisi bhi public reel page ko kholo
 *   3. `graphql` request dhundho → uske form data se naya `doc_id` copy karo
 *   4. Neeche paste karo → commit → push → Vercel auto-deploy. 5-minute fix.
 */
export const IG_CONFIG = {
  /** GraphQL query document ID — ye har 2-4 hafte badal sakta hai */
  docId: "20565867659069524",

  /** Instagram web app ID (X-IG-App-ID header) — rarely changes */
  appId: "936619743392459",

  /** LSD token (X-FB-LSD header) — anti-CSRF token, works with generic value */
  lsd: "AVqbxe3J_YA",

  /** Browser-like User-Agent */
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",

  /** GraphQL endpoint (shortcode → post/reel/carousel media) */
  graphqlUrl: "https://www.instagram.com/api/graphql",

  /**
   * Username → profile info (HD profile picture, user id, privacy, bio).
   * Reliable web endpoint; needs the X-IG-App-ID header only.
   */
  webProfileInfoUrl:
    "https://www.instagram.com/api/v1/users/web_profile_info/?username=",

  /**
   * user_id → active stories (24h). Private API path hit with app-id header.
   * Used by Story Downloader + Anonymous Story Viewer.
   */
  reelsMediaUrl:
    "https://www.instagram.com/api/v1/feed/reels_media/?reel_ids=",

  /** user_id → highlights tray (list of highlight albums + cover images). */
  highlightsTrayUrl:
    "https://www.instagram.com/api/v1/highlights/{userId}/highlights_tray/",

  /**
   * FALLBACK PLAN — agar khud ka scraper bahut tootne lage to `true` karo
   * aur Vercel env me FALLBACK_API_URL set karo (e.g. koi RapidAPI /
   * ScrapeCreators endpoint jo shortcode lekar media JSON deta ho).
   */
  useFallbackApi: false,
  fallbackApiUrl: process.env.FALLBACK_API_URL ?? "",
  fallbackApiKey: process.env.FALLBACK_API_KEY ?? "",

  /** Rate limit: per IP per minute */
  rateLimitPerMinute: 10,
};
