# Migration notes — `redesign/app-shell`

Living log for the ail → Instagram- app-shell migration, palette change and
polish pass. Small decisions are logged here instead of being asked about.

## Phase 0 — Setup & baseline

- Branch `redesign/app-shell` created from `origin/main` @ `3074205`
  ("Add TrustFootBar component", 2026-10-16). Upstream tracking removed so a
  plain push can never land on `main`.
- Skills installed into `.claude/skills/` and committed:
  `ui-ux-pro-max` (uipro-cli 2.2.3), `frontend-design` (anthropics/skills),
  `web-design-guidelines` + `vercel-react-best-practices`
  (vercel-labs/agent-skills), `writing-plans` + `systematic-debugging`
  (obra/superpowers, added on request). `skills-lock.json` pins their hashes.
  The Python scripts in ui-ux-pro-max were read before committing: local CSV
  search only, no network or shell calls. `__pycache__` was not committed.
- Baseline: `npm ci` + `npm run build` on untouched `main` — green.
  Build log: `docs/migration/build-before.log`.
- Route inventory: `scripts/route-inventory.mjs` boots `next start` on the
  build and records, for every concrete page path, HTTP status, `<title>`,
  meta description, canonical, JSON-LD count/types, `<html lang>` and whether
  the path is in `/sitemap.xml`. Baseline: `docs/migration/routes-before.json`
  — 121 route patterns, 125 crawled paths, 31 sitemap URLs.
  `node scripts/route-inventory.mjs --diff before.json after.json` fails on any
  lost route, title, description, canonical, JSON-LD block/type or sitemap URL.

### Decisions (Phase 0)

| # | Decision | Why |
|---|----------|-----|
| 0.1 | `tsconfig.json` now excludes `.claude` | `include: **/*.ts` would type-check the skills' example `.ts` files during `tsc` and `next build`. |
| 0.2 | `npm test` has no script on `main` | Expected — the `test` script and `tsx` arrive in Phase 1 as specified. |
| 0.3 | Baseline facts recorded, not "fixed": 9 pages without canonical (`/about`, `/contact`, `/dmca`, `/privacy-policy`, `/terms`, `/admin`, `/offline`, `/quick-action`), 25 without JSON-LD (legal pages + all `/blog/*`), sitemap lists only 31 of ~118 public pages | These are the bar the migration must not drop below. |
