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
  docId: "10015901848480474",

  /** Instagram web app ID (X-IG-App-ID header) — rarely changes */
  appId: "936619743392459",

  /** LSD token (X-FB-LSD header) — anti-CSRF token, works with generic value */
  lsd: "AVqbxe3J_YA",

  /** Browser-like User-Agent */
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",

  /** GraphQL endpoint */
  graphqlUrl: "https://www.instagram.com/api/graphql",

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
