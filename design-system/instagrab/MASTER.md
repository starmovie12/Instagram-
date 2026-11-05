# Design System Master File — InstaGrab

> **LOGIC:** When building a specific page, first check `design-system/instagrab/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, follow the rules below.
>
> **Source of truth for values:** `app/tokens.css`. This file explains the *rules*; never copy a
> hex value from here into code — use `var(--token)`.

**Project:** InstaGrab — all-in-one social downloader & creator tools
**Generated with:** `/ui-ux-pro-max` (`search.py "social media downloader creator tools instagram light professional" --design-system --persist -p InstaGrab`), then re-based on the chosen palette (engine suggested a generic rose palette + Plus Jakarta Sans; replaced per brief Palette A "Sunset" + PRD v2.4 Appendix C).
**Category:** Social Media App · **Direction:** Glass Island, light-first, Instagram palette, 90/8/2 colour rule

---

## Global Rules

### Colour palette ("Instagram Sunset", light default)

| Role | Light (default) | Dark (opt-in) | Token |
|------|-----------------|---------------|-------|
| Page background | `#FAFAFB` | `#000000` | `--bg-base` |
| Card / sheet | `#FFFFFF` | `#121212` | `--bg-surface` |
| Input well | `#F1F1F4` | `#0A0A0A` | `--bg-surface-sunken` |
| Ink (headings, body) | `#14161F` | `#F5F5F5` | `--text-primary` |
| Muted text | `#4F535E` | `#A8A8A8` | `--text-secondary` |
| Brand text (links, active tab) | `#A8286F` | `#F27AB4` | `--text-brand` |
| Primary (toggle ON, selection) | `#C13584` | `#C13584` | `--color-primary` |
| **CTA gradient** | `#C13584 → #833AB4` | same | `--cta-gradient` |
| Accent / focus ring | `#515BD4` | `#9AA2FF` | `--accent`, `--border-strong` |
| Error / success / warning / info | `#C62828` `#177A3C` `#9A5B00` `#0B5FBF` | `#FF6B6B` `#4ADE80` `#FBBF24` `#6CB6FF` | `--color-*` |
| Instagram spectrum (decorative only) | `#FEDA75 #FA7E1E #D62976 #962FBF #4F5BD5` | same | `--ig-*` |

**Rules**
1. **90 / 8 / 2:** ~90 % neutral surfaces, ~8 % solid magenta (CTA, toggle ON, selected pill), ~2 % full spectrum (logo, Story-Ring).
2. **Gradient only on the primary CTA and the logo.** Selected pills = `--color-primary-subtle` fill + `--text-brand` text/border. Headline accents are solid `--text-brand`.
3. Spectrum stops never sit behind text (white on yellow 1.35:1, on orange 2.60:1).
4. Every text pair ≥ 4.5:1, every UI pair ≥ 3:1, in **both** themes — enforced by `npm test` (`lib/contrast.test.ts`) and documented by `npm run contrast` → `docs/design/contrast-report.md` (116 pairs).
5. Raw colour literals only in `app/tokens.css` — `node scripts/check-colors.mjs` fails CI otherwise. Canvas/QR code reads tokens with `cssToken()` (`lib/css-token.ts`); OG image, manifest and icons use `lib/design-tokens.generated.ts` (`npm run tokens`, `npm run icons`).

### Typography

- **Font:** Instrument Sans (Latin) + Noto Sans Devanagari (Hindi, `unicode-range`, loaded only when needed). Stack: `--font-stack`.
- **Scale (PRD §3.3):** page title 28/34 700 (desktop 32/38) · section 20/26 700 · body 16/24 400 · small 14/20 · button 16/24 700 · pill 14/20 600 · tab 12/16 600 · tile 13/16 600 · numbers `tabular-nums`.
- **Devanagari:** letter-spacing 0, body line-height 1.55, display ≥ 1.35, no ALL-CAPS / italics.
- Inputs are always ≥ 16px (no iOS zoom).

### Spacing, shape, depth

| Token | Value | Use |
|---|---|---|
| `--sp-1 … --sp-16` | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 44 · 48 · 56 · 64 px | 4 px grid; gutter 16 phone / 24 tablet+ |
| `--radius-sm/base/tile/card/island/full` | 8 / 14 / 16 / 20 / 28 / 9999 | chips / buttons+inputs / tiles / cards / island / pills |
| `--shadow-card` | light: 2-layer ink 5–7 % | cards (light mode elevation) |
| `--shadow-button-primary` | magenta 28 % | CTA only |
| `--shadow-modal` | | sheets / dialogs |
| `--hit-target-min` | 48 px | every interactive control |

### Motion

`--motion-fast 100ms · --motion-base 200ms · --motion-slow 350ms`; easings `--ease-standard`, `--ease-decelerate`, `--ease-glass` (overshoot), real springs `--ease-spring-glass/bouncy/rigid` (`linear()` with `@supports` fallback). Only `transform` / `opacity` animate. `prefers-reduced-motion` → 0 ms swaps.

---

## Component Specs (tokens, not values)

### Buttons
```css
.btn-primary   { background: var(--cta-gradient); color: var(--text-on-primary); min-height: 52px; border-radius: var(--radius-base); font: 700 16px/24px var(--font-stack); box-shadow: var(--shadow-button-primary); }
.btn-secondary { background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-strong); min-height: 52px; border-radius: var(--radius-base); }
:focus-visible { outline: 2px solid var(--border-strong); outline-offset: 2px; }
```
One gradient button per viewport (PRD S4); everything else is secondary.

### Cards
```css
.card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-card); padding: var(--sp-4); box-shadow: var(--shadow-card); }
```

### Inputs
```css
.input { min-height: 52px; font-size: 16px; background: var(--bg-surface-sunken); border: 1px solid var(--border-default); border-radius: var(--radius-base); color: var(--text-primary); }
.input:focus-visible { outline: 2px solid var(--border-strong); outline-offset: 2px; }
```

### Pills (sub-tools, categories)
```css
.pill       { min-height: 48px; padding-inline: var(--sp-4); border-radius: var(--radius-full); background: var(--bg-surface); border: 1px solid var(--border-default); color: var(--text-secondary); font: 600 14px/20px var(--font-stack); }
.pill.is-on { background: var(--color-primary-subtle); border-color: var(--text-brand); color: var(--text-brand); }
```

### Glass chrome (header, island, rail)
`background: var(--bg-glass-island | --bg-blur-layer); backdrop-filter: blur(20px) saturate(180%); border: 1px solid var(--border-glass-island)`. Max 2 blurred surfaces per screen; solid fallback for `prefers-reduced-transparency`, `forced-colors`, no `backdrop-filter`, or Settings → "Solid surfaces".

### Modals / bottom sheets
`background: var(--bg-surface-elevated); box-shadow: var(--shadow-modal);` scrim `var(--overlay-scrim)`; ≤ 599 px bottom sheet, ≥ 600 px centred dialog (max 480 px).

---

## Style Guidelines

- **Style:** clean, light, professional; glass only on navigation chrome; cards opaque.
- **Icons:** lucide-react (24 px, stroke 2) + official platform SVGs. No emoji as icons.
- **Imagery:** user media is shown as-is; overlays on media use `rgb(var(--black-rgb) / α)` + `var(--white)`.
- **Key effects:** Story-Ring (conic spectrum, 1 px) on the Home link box; tile lift on hover (pointer devices only); spring reveal for results.

## Anti-Patterns (Do NOT Use)

- ❌ Neon cyan/violet glows, gradient text, gradient pills (old theme)
- ❌ Raw hex / rgb in components (use tokens)
- ❌ Emoji as structural icons
- ❌ More than one gradient CTA in a viewport
- ❌ Text on spectrum yellow/orange
- ❌ Animating width/height/top/left/box-shadow/filter
- ❌ Forbidden copy: Oops · Something went wrong · Kuch galat ho gaya · Error 500 · Invalid input · Aapne galti ki · Submit · Click here · Please wait · Seamless · Revolutionary · Supercharge · Unlock

## Pre-Delivery Checklist

- [ ] `npm test` (contrast + tokens sync) and `node scripts/check-colors.mjs` pass
- [ ] Light **and** dark screenshots reviewed at 360 / 390 / 1280 px
- [ ] Touch targets ≥ 48 px; inputs ≥ 16 px; visible focus ring
- [ ] `prefers-reduced-motion` respected; ≤ 3 infinite animations per screen
- [ ] No horizontal scroll at 320 px; safe-area insets on header / island / back bar
