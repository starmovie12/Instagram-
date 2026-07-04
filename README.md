# 📸 InstaGrab

Instagram Content Extractor & Downloader — reels, photos, carousels, **plus caption + hashtag extraction** (the wedge that makes this more than another downloader).

Built with **Next.js 15 (App Router)**, deployable free on **Vercel**. See the InstaGrab PRD for full product context.

## Features

- 🎬 Download reels / video posts in HD (no watermark)
- 🖼️ Download photos & every slide of carousel posts
- 📋 Full caption text with one-click copy
- #️⃣ All hashtags extracted & separated, copy-all button
- @ Mentions extracted
- 🖼️ Video thumbnail download
- 🔒 No login ever, public content only, rate-limited API

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
components/
  ExtractorTool.tsx       → client tool UI (input → result card)
  ToolPage.tsx            → shared landing page shell
lib/
  instagram-config.ts     → ⚠️ THE swappable config — patch doc_id here
  instagram-extractor.ts  → all Instagram-specific logic
  rate-limit.ts
```

## 🔧 When the extractor breaks (every 2–4 weeks — expected!)

Instagram rotates its internal `doc_id` deliberately. When extractions start failing:

1. Open Chrome DevTools → **Network** tab
2. Load any public reel page on instagram.com
3. Find the `graphql` request → copy the new `doc_id` from its form data
4. Paste it into **`lib/instagram-config.ts`** → commit → push (Vercel auto-deploys)

That's the whole fix. If breakage gets frequent, set `useFallbackApi: true` in the same file and configure `FALLBACK_API_URL` (+ optional `FALLBACK_API_KEY`) in Vercel env vars.

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
