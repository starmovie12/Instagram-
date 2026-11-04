# App-shell Migration (ail → Instagram-) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land ail's app-shell redesign in the production repo Instagram- with zero lost routes, metadata, JSON-LD, sitemap entries or server behaviour, then re-skin it (palette) and polish it.

**Architecture:** ail is a strict file superset of Instagram- (46 new, 75 modified, 0 removed). The UI layer is copied wholesale; `app/api/**` and `lib/**` are taken from ail only after a per-file removal review. Correctness is pinned by three gates per phase (`tsc`, `npm test`, `next build`) plus a route inventory diff that crawls the built app.

**Tech Stack:** Next.js 15.5 (App Router), React 19, TypeScript 5.8, `node:test` via `tsx`, plain CSS (`tokens.css`, `globals.css`, `shell.css`, `motion.css`).

**Spec:** the session brief (Phases 0–4, hard rules 1–5), mirrored in `MIGRATION_NOTES.md`.

## Global Constraints

- Never commit to `main`; all work on `redesign/app-shell`; open a PR at the end, do NOT merge.
- Never read, print or commit secrets. Never rename an env var. Existing vars stay exactly: `ADMIN_PASSWORD, ADMIN_SESSION_SECRET, COBALT_API_KEY, COBALT_INSTANCE, FALLBACK_API_KEY, FALLBACK_API_KEY_HEADER, FALLBACK_API_URL, FALLBACK_PROFILE_API_URL, GEMINI_API_KEY, INSTAGRAM_SESSION_ID, NEXT_PUBLIC_SITE_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL, USE_FALLBACK_API, VERCEL_PROJECT_PRODUCTION_URL`. ail adds only `EXTRA_DOWNLOAD_HOSTS` (optional) and reads Vercel's `VERCEL_REGION`.
- Every page, API route and `/s/[code]` that exists today must still exist, with metadata, JSON-LD and sitemap entries: `node scripts/route-inventory.mjs --diff docs/migration/routes-before.json docs/migration/routes-after.json` exits 0.
- After every phase: `npx tsc --noEmit`, `npm test`, `npm run build` all green before moving on. One commit per phase.
- Phase 1 test bar: `"test": "tsx --test lib/*.test.ts"`, all 36 tests pass.
- Small decisions are logged in `MIGRATION_NOTES.md`; only irreversible choices go to the user.

## Review Focus

1. **Instagram- commits newer than ail's snapshot.** Verified before planning: each of the 39 files that differed at ail's first upload is closest to Instagram-'s *latest* version (`TrustFootBar`, `GoldenBar` 10-16, `PlatformIcons` 10-16, `globals.css` neon footer…). Task 1 re-runs this as a gate.
2. **Behaviour ail drops on the server.** Removals reviewed: `api/extract` loses its inline FB/embed/Cobalt code, but all of it now lives in `lib/facebook-extractor.ts` / `lib/instagram-extractor.ts` with more engines. Real behaviour changes to flag (not silently accept): download proxy now 403s redirects to non-allow-listed hosts; a Facebook *video* link with no playable URL now returns 404 instead of the og:image thumbnail; links may now also go to SnapSave (new third party); new public `/api/diag` reports which env vars are *set* (booleans only).
3. **Default theme flips.** ail's pre-paint script defaults to `dark` regardless of OS (`'ig-theme'||'dark'`). Phase 2 must restore OS-preference default when the palette is light-first.
4. **Sitemap churn.** ail's sitemap uses `new Date()` for `lastModified` (changes every deploy) and is registry-driven; the inventory diff must show only additions.
5. **PWA update.** `sw.js` bumps `instagrab-v2 → v3` and pre-caches `/tools`, `/settings`, `/how-to-download` — those routes must build as static 200s or the SW install fails silently.

---

### Task 1: Phase 1 — Migration (no visual changes)

**Files:**
- Create (from ail): `app/shell.css`, `app/tools/page.tsx`, `app/settings/page.tsx`, `app/how-to-download/page.tsx`, `app/instagram-downloader/page.tsx`, `app/coming-soon/[id]/page.tsx`, `app/api/diag/route.ts`, `components/shell/{AppShell,BackBar,BottomNav,GlobalHeader,Logo}.tsx`, `components/shell/nav-depth.ts`, `components/{HistoryScreen,HomeToolsGrid,HowToButton,LegalFoot,PlatformDownloader,PlatformPage,ProfileExtras,ResultPanel,SettingsScreen,SmartLinkBox,SplashScreen,ToolIcon,ToolsScreen}.tsx`, `components/SplashScreen.css`, `components/splashConfig.ts`, `lib/{api,brand,detect,events,facebook-extractor,feedback,normalize,platforms,registry,router,safe-url,storage}.ts`, `lib/{embed-facebook,router,safe-url,snapsave}.test.ts`, `public/icon-{blank,maskable}-{192,512}.png`, `CHANGELOG.md`
- Modify (take ail): the 75 modified files listed by `diff -rq` (UI wholesale; api/lib after review)
- Not copied: `README.txt` (duplicate splash instructions), `next-env.d.ts` (generated, git-ignored)
- Test: `lib/*.test.ts`

**Interfaces:**
- Produces: `npm test` script; `docs/migration/routes-after.json`; `lib/registry.ts#REGISTRY` (drives sitemap + tools grid, used by Phase 3).

- [ ] **Step 1:** Re-run the snapshot-ancestry check (scratch script) → every diverged file reports `HEAD-based`.
- [ ] **Step 2:** Copy UI layer: `rsync` ail `app/` (excluding `app/api`), `components/`, `public/`, `CHANGELOG.md` into Instagram-.
- [ ] **Step 3:** Copy `app/api/**` + `lib/**` from ail; record per-file verdict table (kept / superset / behaviour change) in `MIGRATION_NOTES.md`.
- [ ] **Step 4:** `npm i -D tsx@^4` and add `"test": "tsx --test lib/*.test.ts"`; lockfile refreshed by npm.
- [ ] **Step 5:** Run `npx tsc --noEmit` → exit 0; `npm test` → `# pass 36`, `# fail 0`; `npm run build` → exit 0.
- [ ] **Step 6:** `node scripts/route-inventory.mjs --log docs/migration/build-after-p1.log --out docs/migration/routes-after.json` then `--diff` → "OK — zero … lost". Any ✗ line is fixed (not waived) before commit.
- [ ] **Step 7:** Commit `feat(phase-1): migrate app-shell from ail`.

### Task 2: Phase 2 — Palette

**Files:**
- Create: `design-system/MASTER.md` (via `ui-ux-pro-max … --design-system --persist`)
- Modify: `app/tokens.css` (single source of truth, light + dark), every file with hard-coded hex outside `tokens.css` (CSS, TSX inline styles, canvas `fillStyle`, `opengraph-image.tsx`, `icon.svg`, `manifest.webmanifest`, `layout.tsx#viewport.themeColor`, `public/icon-*.png`), `app/layout.tsx` pre-paint theme script.
- Test: `scripts/contrast-check.mjs` (new) — parses `tokens.css` for both themes and asserts every text/surface pair ≥ 4.5:1.

**Interfaces:**
- Produces: tokens `--bg, --surface, --surface-2, --ink, --ink-2, --muted, --line, --accent, --accent-hover, --accent-ink, --cta-from, --cta-to, --ok, --warn, --err` plus `--*-rgb` channel twins for `rgb(var(--x-rgb) / a)`; canvas code reads them via `getComputedStyle`.

- [ ] **Step 1:** Generate + persist MASTER.md for the chosen palette.
- [ ] **Step 2:** Write `scripts/contrast-check.mjs`; run against current tokens (expect failures on neon pairs).
- [ ] **Step 3:** Rewrite `tokens.css`; run contrast check → all pairs PASS in light and dark.
- [ ] **Step 4:** Replace hard-coded hex outside tokens (keep third-party brand logos + semantic ok/warn/err); `grep -rnoE '#[0-9a-fA-F]{3,8}\b'` count recorded before/after in notes. Inline styles: colours only.
- [ ] **Step 5:** Regenerate icon PNGs from the new `icon.svg`; manifest + viewport `themeColor` from tokens.
- [ ] **Step 6:** tsc / test / build / inventory diff green → commit `feat(phase-2): new palette`.

### Task 3: Phase 3 — Polish

**Files:**
- Create: `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx` (+ i18n keys `err.title`, `err.body`, `err.retry`, `err.home`)
- Delete: `components/{Footer,HistoryList,Nav,OgDownloader,RecentTools,ResultCard,SplashScreen,SupportedTools,TwitterDownloader,YtThumbnail}.tsx` (+ `SplashScreen.css`, `splashConfig.ts` if orphaned) — only after `grep -rn` shows zero imports and `tsc` passes without them.
- Modify: `app/layout.tsx` (`<html lang>` from the language cookie/`ig-lang`, `dir` kept), components with `<img>` lacking `alt`, the 14 `any`, tools importing `jszip|@breezystack/lamejs|gifenc|qrcode` (→ `await import()` inside the handler), `app/shell.css` / `globals.css` (44px targets, 16px inputs, safe-area, `:focus-visible`, `prefers-reduced-motion`), `components/PlatformDownloader.tsx` / `ResultPanel.tsx` (typed error states: private, rate-limit, invalid link → one action each), `README.md`, `CHANGELOG.md`.

**Interfaces:**
- Consumes: Phase 2 tokens; `lib/i18n.tsx#t`.

- [ ] **Step 1:** Error/loading boundaries; verify with a page that throws in dev.
- [ ] **Step 2:** Dead-component sweep (grep + tsc), delete, tsc green.
- [ ] **Step 3:** `lang`/`dir`, alt, `any` fixes; `grep -rn ": any\b\|as any\|<any>"` → 0 in app/components/lib.
- [ ] **Step 4:** Lazy heavy libs; record per-route First Load JS before/after from build logs.
- [ ] **Step 5:** Mobile/a11y pass at 360/390 px with Playwright screenshots; downloader states; paste→result in ≤ 2 taps.
- [ ] **Step 6:** web-design-guidelines audit on `/`, `/tools`, `/instagram-downloader`, `/reels-downloader`, `/history`, `/settings`, one tool page; fix every finding.
- [ ] **Step 7:** README design section + CHANGELOG; gates + inventory diff green → commit `feat(phase-3): polish`.

### Task 4: Phase 4 — Report & PR

- [ ] **Step 1:** Finish `MIGRATION_NOTES.md`: moved files, decisions, route diff output, bundle table, test output, Vercel settings (e.g. optional `EXTRA_DOWNLOAD_HOSTS`, function `maxDuration` 60 s on Hobby).
- [ ] **Step 2:** Push `redesign/app-shell`; open PR to `main`; stop.
