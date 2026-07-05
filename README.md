# 👑 InstaGrab

The **premium** Instagram toolkit — every downloader plus **caption + hashtag extraction** (the wedge that makes this more than another downloader).

Built with **Next.js 15 (App Router)**, deployable free on **Vercel**. Designed on the **"Warm Light Regalia"** system (CROWN): white-first canvas, warm-cream gold cards, a five-tier gold palette, and Syne / Space Mono / Inter type — gold-tinted shadows, zero glass. Way more premium than the plain competitor clones.

## Features / Tools

**URL-based** (paste a post/reel link):
- 🎬 Reels downloader (HD MP4, no watermark)
- ▶️ Video / IGTV downloader
- 🖼️ Photo downloader
- 🎠 Carousel downloader (every slide)
- 📋 Caption extractor — full text, one-click copy *(signature)*
- #️⃣ Hashtag extractor — all tags separated, copy-all *(signature)*
- @ Mentions + 🖼️ video thumbnail download

**Username-based** (enter an @handle):
- ⭕ Story downloader (active 24h stories)
- 👁️ Anonymous story viewer (no trace)
- ✨ Highlights downloader (covers + stories inside each album)
- 🪪 Profile picture / DP downloader (full HD)

Plus: 🔒 no login ever, public content only, rate-limited API, disclaimer footer, DMCA page.

## Project structure

```
app/
  page.tsx                → Homepage (the tool)
  reels-downloader/       → SEO landing pages (same tool, targeted copy)
  photo-downloader/
  story-downloader/
  caption-extractor/      → 🌟 unique wedge pages
  hashtag-extractor/
  blog/                   → 5 articles (future AdSense home)
  about|privacy-policy|terms|contact|dmca
  api/extract/route.ts    → serverless extraction endpoint (rate limited)
  api/download/route.ts   → CDN download proxy (Instagram-CDN-only, not open)
  api/profile/route.ts    → username-based tools (dp/stories/highlights)
components/
  ExtractorTool.tsx       → URL tool UI (link → result card)
  UsernameTool.tsx        → username tool UI (dp/stories/viewer/highlights)
  ToolPage.tsx            → shared landing page shell (both variants)
lib/
  instagram-config.ts     → ⚠️ THE swappable config — patch doc_id/endpoints here
  instagram-extractor.ts  → all Instagram-specific logic
  tools.ts                → central tool registry (drives nav/grid/footer)
  rate-limit.ts
```

## Design system

The whole UI follows **CROWN "Warm Light Regalia"** (see the design doc): pure-white
canvas (`#ffffff`), warm-cream cards (`#f7ecd0`), a locked five-tier gold palette where
`#f59e0b` gold-orange is reserved **only** for the primary CTA, gold-tinted shadows, and a
three-font contract — **Syne** (display), **Space Mono** (every number), **Inter** (body).
Tokens live as CSS variables at the top of `app/globals.css`. No dark mode — light *is* the brand.

## 🔧 When the extractor breaks (every 2–4 weeks — expected!)

Instagram rotates its internal `doc_id` deliberately. When extractions start failing:

1. Open Chrome DevTools → **Network** tab
2. Load any public reel page on instagram.com
3. Find the `graphql` request → copy the new `doc_id` from its form data
4. Paste it into **`lib/instagram-config.ts`** → commit → push (Vercel auto-deploys)

That's the whole fix for a rotated `doc_id`.

## 🛡️ Reliable extraction on Vercel (fallback API)

Instagram frequently blocks **data-center IPs** (Vercel/Cloudflare shared IPs) and returns
empty data no matter how fresh the `doc_id` is — this is the PRD's #1 technical risk, and
self-scraping from a free serverless IP is *not* reliable on its own. The extractor already
primes a session cookie to reduce this, but the guaranteed fix is a **fallback API**.

It's wired in and **automatic**: try Instagram directly first, and if that gets blocked,
fall back to a third-party API — but only once you configure it (otherwise nothing changes).

**Setup (Vercel → Project → Settings → Environment Variables):**

| Variable | Value |
|---|---|
| `FALLBACK_API_URL` | provider endpoint with a `{url}` or `{shortcode}` placeholder |
| `FALLBACK_API_KEY` | your API key |
| `FALLBACK_API_KEY_HEADER` | header name for the key (default `x-api-key`) |
| `USE_FALLBACK_API` | *(optional)* `true` to skip the direct attempt and always use the API |

**Example — ScrapeCreators** (free credits, named in the PRD):

```
FALLBACK_API_URL = https://api.scrapecreators.com/v1/instagram/post?url={url}
FALLBACK_API_KEY = <your key>
FALLBACK_API_KEY_HEADER = x-api-key
```

**Example — a RapidAPI Instagram downloader:**

```
FALLBACK_API_URL = https://<host>/media?shortcode={shortcode}
FALLBACK_API_KEY = <your rapidapi key>
FALLBACK_API_KEY_HEADER = x-rapidapi-key
```

The response normalizer in `lib/instagram-extractor.ts` understands the common provider
shapes (Instagram GraphQL, `{ media:[…] }`, and flat `video_url`/`image_url` fields), so most
providers work with no code change. Redeploy after setting the vars.

## Develop & deploy

```bash
npm install
npm run dev      # local dev
npm run build    # production build
```

Deploy: push to GitHub → import repo in [Vercel](https://vercel.com) → done. Set `NEXT_PUBLIC_SITE_URL` env var once you have a domain.

## Monetization notes (from PRD)

- Day 1: Adsterra / Monetag (they approve downloader sites). Add their script in `app/layout.tsx`.
- Later: AdSense **only on `/blog`** — never on tool pages.
- Keep popunders off initially; protect repeat traffic.

## Disclaimer

InstaGrab is not affiliated with Instagram™ or Meta. No content is hosted; all content belongs to its respective owners.
