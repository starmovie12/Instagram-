# TK-07 (Part 2): Visual Tokens, Templates aur Component Recipes

Capability: `recipes` (`TK-07`, Part 2 of 2; Part 1 `direction-recipes.md`).
**Evidence Label**: `FROM-TOOLKIT-DATA` — Yahan ke numeric scales, px/ms maan, alpha values aur component recipes **`UNVERIFIED` (author heuristic / reference starting points, not independently verified from dataset)** hain. Product, Aesthetic Direction, archetype aur Design Dials ke hisaab se inhe badlo, badalne ki wajah 1 line mein likho, aur badla hua maan poore product mein ek jaisa rakho.
**Trigger (B2)**: Dimag (`master-prompt.xml`) poora token specification sirf **Tier 2 Medium (`M`) aur Tier 3 Large (`L`)** par maangta hai (`Tier 1 / S` par sirf chhue hue tokens; `Tier 0 / XS` par forbidden).

## A. Complete Visual Token Structure with May / May-Not-Use Rules (B2)

Components mein raw hex ya mann-maane px/ms likhna mana hai. Har token ke saath uska **Kahan lagao (May use)** aur **Kahan mat lagao (May NOT use)** niyam lagu hota hai:

### 1. Colour Tokens (`UNVERIFIED` lightness/alpha heuristics; contrast `>=4.5:1` mandatory floor)

| Token Name | Role & Light / Dark Guidance | Kahan lagao (May Use) | Kahan mat lagao (May NOT Use) |
|---|---|---|---|
| `bg-base` | App/page ka mukhya canvas (Light `96–99%` L; Dark `4–8%` L, shuddh `#000` nahi jab tak OLED direction na ho) | Page background, scroll canvas | Floating modal, card ya elevated sheet par (wahan `bg-surface` / `bg-elevated`) |
| `bg-surface` | Card, list group, input container (Light `100%` ya subtle tint; Dark `bg-base` se `+3–5%` halka) | Cards, panels, inputs, tables | Primary CTA fill ya full-bleed backdrop |
| `bg-elevated` | Upar uthi hui parat (Dark mein `bg-surface` se `+3–6%` halka) | Bottom sheet, popover, dropdown, sticky bar | Flat inline sections ya sunken well |
| `bg-sunken` | Dabi hui parat (Light mein `bg-base` se `-2–4%` gehra; Dark mein `-2%` ya subtle well) | Unselected pills, skeleton fill, code/input well, table header | Primary card ya modal surface |
| `accent-500` | Mukhya brand/action hue (Dark mein `10–15%` halka aur kam saturated taaki chamke nahi) | Primary CTA fill, active indicator, hero focal element (`<10%` screen default) | Body text, bade background areas, destructive button, ya ek screen par 2 alag primary actions |
| `accent-600` | Pressed / active brand state | Primary CTA pressed/hover state, high-contrast inline link | Large decorative fills |
| `accent-subtle` | Accent ka `8–15%` alpha ya `100`-level tint | Selected pill/chip background, pehchan tag fill, active nav highlight | Body surface ya warning/error banner |
| `text-primary` | Sabse saaf padhne wala text (`>=4.5:1` mandatory, target `>=7:1`) | Headings, body copy, input values, primary data numerals | Disabled controls, decorative watermarks |
| `text-secondary` | Doosre darje ka text (`>=4.5:1` against its surface) | Subheadings, field labels, supporting descriptions, unselected nav labels | Hero title ya primary CTA label |
| `text-tertiary` | Shaant metadata (`>=4.5:1` jab arthpoorn text ho; `>=3:1` non-text cue) | Timestamps, optional hints, grabber handle | Zaroori instructions, error messages, ya price/amount |
| `text-disabled` | Band control ka text (`0.38–0.5` opacity) | Disabled button/input label (saath mein kyun band hai iska 1-line hint) | Active par chhote ya kam-zaroori text ke liye (wahan `text-secondary` use karo) |
| `text-on-primary` | `accent-500` ya `danger-500` ke upar ka text (`>=4.5:1` verified) | Filled primary/destructive button labels, active badge text | Light neutral surface ke upar |
| `border-subtle` / `hairline` | `1px` low-alpha (`8%` text-primary in light, `8–12%` white in dark) | Card border, list inset divider, section rule | Focus ring ya error border |
| `border-default` | `1px` spasht control seema (`>=3:1` where boundary carries control meaning) | Input border, secondary/outline button border, unselected filter chip | Decorative background grid |
| `border-strong` | `1.5–2px` high-contrast seema | Active input border, focus ring (`2px` + `2px` offset), Neo-Brutalist frame | Har card ya har list row ke beech (visual noise banata hai) |
| `success` / `warning` / `danger` / `info` (+ `-subtle`) | Semantic feedback hues (brand palette ke lightness/saturation se mel khate hue) | Error/success/warning messages, destructive confirm, delta chips (hamesha icon + text ke saath) | Decorative illustration, non-status branding, ya sirf rang se bina text/icon ke matlab batana |

### 2. Type Scale Tokens (`UNVERIFIED` scale; mobile body `>=16px` & min text `>=12px` floor)

_Ek screen par adhiktam `4` sizes aur `3` weights (`400`, `500/600`, `700`). Devanagari par tracking `0` (negative tracking mana), ALL-CAPS aur italic mana, aur body/button line-height `1.5–1.6` (display `>=1.3`)._

| Token | Mobile Size | Desktop Size | Weight | Line-Height | Tracking (Latin) | Kahan lagao (May Use) | Kahan mat lagao (May NOT Use) |
|---|---|---|---|---|---|---|---|
| `Display` | `34px` | `48–64px` | `700` | `1.15` (`1.3` Dev) | `-1.5%` (`0` Dev) | Showcase/Landing hero headline (adhiktam 1 per screen) | Settings, dialogs, dense dashboards, ya 2+ lines ke lambe paragraph |
| `Number-hero` | `40–56px` | `48–64px` | `600` | `1.1` | `-2%` (`tabular-nums`) | Mukhya KPI, transfer amount, timer hero | Non-numeric headings ya list row numbers |
| `Title` | `24px` | `28–32px` | `600` | `1.25` (`1.3` Dev) | `-1%` (`0` Dev) | Screen title, primary modal/sheet heading, hero card title | Body copy, input labels, ya table cells |
| `Heading` | `18px` | `20–24px` | `600` | `1.35` | `0` | Section header, card heading, top-bar title | Long-form reading body ya micro badges |
| `Body` | `16px` | `16–18px` | `400` | `1.5–1.65` | `0` | Primary reading text, input value, descriptions (`35–60ch` mobile, `60–75ch` desktop) | Compact pill badges ya all-bold paragraphs |
| `Body-strong` | `16px` | `16px` | `600` | `1.5` | `0` | Primary/secondary button label, list row primary title, inline emphasis | Whole paragraphs (hierarchy khatam ho jaati hai) |
| `Label` | `14px` | `14px` | `500` | `1.4` (`1.5` Dev) | `+0.5%` (`0` Dev) | Form field label, tab/pill text, table header, pehchan tag | Long articles ya primary hero text |
| `Caption` | `12px` | `12–13px` | `400` | `1.4` (`1.5` Dev) | `+1%` (`0` Dev) | Timestamp, secondary metadata, bottom-nav label (`<12px` kabhi nahi) | Primary instructions, error messages, ya legal consent text |

### 3. Spacing, Elevation, Radius aur Breakpoint Tokens (`UNVERIFIED` baseline scales)

| Category | Token / Scale | Value | Kahan lagao (May Use) | Kahan mat lagao (May NOT Use) |
|---|---|---|---|---|
| **Spacing (`4px` grid)** | `space-1` (`4px`), `space-2` (`8px`) | `4px`, `8px` | Icon-to-text gap (`8px`), inline badge gap, touch-target min gap (`>=8px`) | Section separation ya screen edge padding |
| **Spacing** | `space-3` (`12px`), `space-4` (`16px`), `space-5` (`20px`) | `12px`, `16px`, `20px` | Related form fields (`12px`), phone screen gutter (`16px`), card internal padding (`16–20px`) | Unrelated major sections ke beech |
| **Spacing** | `space-6` (`24px`), `space-8` (`32px`) | `24px`, `32px` | Section gaps (`24–32px`), tablet (`24px`) aur desktop (`32px`) gutters, hero clearance (`>=24px`) | Tight chip groups ke andar |
| **Spacing** | `space-12` (`48px`), `space-16` (`64–96px`) | `48px`, `64–96px` | Major page blocks, landing/showcase breathing room | Utility dialogs, compact mobile sheets, ya keyboard-open forms |
| **Elevation** | `shadow-1` | `0 1px 2px 6%, 0 1px 1px 4%` | Subtle list row lift, desktop hover | Modals ya sheets (wahan `shadow-3`) |
| **Elevation** | `shadow-2` | `0 1px 2px 6%, 0 4px 12px 8%` | Elevated cards (poori app mein 1 hi card shadow + `1px` hairline) | Flat/Clinical/Brutalist directions jahan `0` shadow tay hai |
| **Elevation** | `shadow-3` | `0 2px 4px 6%, 0 12px 32px 14%` | Floating bottom sheet, modal, popover, command palette | Inline static cards |
| **Elevation** | `accent-glow` / `glass` | Glow `25–35%` alpha; Glass `60–72%` fill + `16–24px` blur | Adhiktam 1 hero focal element (`accent-glow`); floating nav/sheet (`glass`) | Body text containers, low-contrast backgrounds, ya low-end/accessibility-critical screens |
| **Radius** | `radius-xs` (`4px`), `radius-sm` (`8px`), `radius-md` (`12px`), `radius-lg` (`16px`), `radius-xl` (`24px`), `radius-full` (`9999px`) | Nested rule: `inner = outer - padding` | Chips (`4px`), buttons/inputs (`8–12px`), cards (`12–16px`), sheets (`16–24px`), pills/avatars (`full`) | Ek hi screen par bina scale ke mann-maane radii (`7px`, `15px`, `22px`) milana |
| **Motion** | `dur-instant` (`0ms`), `dur-fast` (`100ms`), `dur-base` (`200ms`), `dur-slow` (`350ms`), `dur-hero` (`600ms`) | Distance, size aur importance se chuno (B8) | Press (`100ms`, scale `0.97`), state/tag (`200ms`), sheet (`350ms`), ek Wow Moment (`400–600ms`) | Har element par ek hi uniform ms chipkana, `width/height/top/left` animate karna, ya `prefers-reduced-motion` par chalana |
| **Breakpoints (B5)** | Content-width thresholds (`bp-sm` `375px`, `bp-md` `768px`, `bp-lg` `1024px`, `bp-xl` `1440px`) | Content kab toot-ta hai (`35–60ch` / `60–75ch`) us par aadharit | Layout composition badalne (single col → split list-detail → 12-col grid + sidebar) | Sirf device ke naam se bina content-width dekhe layout sikodna (squish karna) |

## B. Component Dimensions aur Recipes (`UNVERIFIED` starting specs)

| Component | Dimensions & Hit Area | Tokens (Fill, Text, Border, Radius, Shadow) | States (Hover, Pressed, Focus, Disabled, Loading, Error) | Kahan lagao / Kahan mat lagao |
|---|---|---|---|---|
| **Primary Button** | Height `48–56px` mobile (`40–44px` desktop, primary CTA `>=48px`); min-width `160px` ya full-width; side padding `20–24px`; icon `20px` + `8px` gap | Fill `accent-500`, text `text-on-primary` (`Body-strong`), `radius-sm/md`, flat ya 1 `accent-glow` | Pressed: `100ms` scale `0.97` + `accent-600`; Focus: `2px` ring + `2px` offset; Loading: `18px` spinner, width lock, double-tap block; Disabled: `0.38–0.5` opacity + 1-line reason | **May use**: Screen ka 1 mukhya kaam (prominent par screen ko dabaye nahi — L36). **May NOT use**: Ek screen par 2 barabar primary buttons, ya Cancel/Delete par. |
| **Secondary / Ghost Button** | Height primary ke barabar, hit area `>=48px` | Secondary: `bg-surface`/transparent + `1px border-default` + `text-primary`. Ghost: no border + `accent-600` text | Pressed: `bg-sunken` (secondary) / `accent-subtle` (ghost); Focus: `2px` ring | **May use**: Doosre darje ke kaam, Cancel/Skip, inline actions. **May NOT use**: Primary CTA ki jagah jab mukhya kaam saaf dikhana ho. |
| **Destructive Button** | Hit area `>=48px`, primary CTA se door (`>=16px` ya alag section) | Initial state: outline/secondary with `danger` text; Confirm modal CTA: `danger-500` fill + `text-on-primary` | Pressed: `danger-600`; requires Undo (reversible) ya explicit Confirm (irreversible) | **May use**: Delete, reset, revoke. **May NOT use**: Angoothe ke default primary spot par bina confirm/undo ke. |
| **Input / Drop Zone** | Height `52–56px`; label hamesha upar (`Label`, `text-secondary`) | Fill `bg-surface`, `1px border-default`, `radius-sm/md`, value `Body` (`>=16px`) | Focus: `2px` ring + `border-strong` (`accent-500`); Error: `danger` border + icon + 1-line fix (`aria-describedby`); Read-only != Disabled | **May use**: Text, paste, Unified Smart Workspace input. **May NOT use**: Placeholder-only label (jab likhte hi label gayab ho jaye). |
| **Card** | Padding `16–20px` (poori app mein ek); gap `12–16px` | Fill `bg-surface`, `radius-md/lg`, `1px hairline`, `shadow-1` ya `shadow-2` | Interactive card pressed: scale `0.985`, shadow ghate; static card par hover/press state mat lagao | **May use**: Alag-alag data groups ya interactive items. **May NOT use**: Aadat ke taur par har cheez ko boxes mein band karne ke liye jab spacing kaafi ho (L24, L25). |
| **List Row** | 1-line `56px`, 2-line `64–72px`; leading avatar/icon `40px`; trailing `20px` | Inset `1px hairline` (`16–72px` left), pressed `bg-sunken` (`100ms`) | Long text: `1–2` line wrap/clamp + expand; swipe action ho to visible button alternative bhi | **May use**: Feeds, history, settings lists. **May NOT use**: Har list row ke charon taraf bhaari card border aur shadow. |
| **Chip / Pill / Pehchan Tag** | Visual height `28–32px`, **touch target `>=48px`**; icon `16px` | Selected: `accent-subtle` fill, `accent-700` text, `1px` `24%` accent border; Unselected: `bg-sunken`, `text-secondary` | Pehchan tag: `200ms` slide-in + `aria-live="polite"` + 1-tap change; collection wraps before shrinking labels | **May use**: Smart Hub mode switches (max 5 + `"Aur"`), auto-detect tag, filters. **May NOT use**: 10+ pills ek hi horizontal scroll line mein chhupana. |
| **Bottom Nav / Top Bar / Sheet / Snackbar / Empty / KPI / Skeleton** | Bottom nav `64px` (max 5 items, icon `24px` + `Caption`), Top bar `56px` (Quick Return), Sheet grabber `36x4px` + `48dp` close button, Snackbar `48–56px` (`4–5s`, no focus steal) | Tokens per `A.1–A.3`; Skeleton uses `bg-sunken` content-shaped geometry (`1200–1600ms` sweep, static on `reduced-motion`) | Empty state: 1 Heading + 1 Body line + 1 action button in thumb zone; KPI card: `Label` + `Number-hero` (`tabular-nums`) + delta chip (icon + text) | **May use**: Standard app chrome & states. **May NOT use**: Full-screen blocking spinners (`>1s` par skeleton use karo — L46), ya nakli progress bar. |

## C. Templates: Presentation Plan, Palette Table aur Screen Visual Blueprint

_Trigger_: Palette Table aur Screen Visual Blueprint Tier 2 (`M`) aur Tier 3 (`L`) par **Required**, Tier 1 (`S`) par **Optional** (sirf chhue hue tokens/component), Tier 0 (`XS`) par **Forbidden**. Presentation Plan Tier 3 (`L`) par **Required**, Tier 2 (`M`) par **Optional**, Tier 0/1/Audit par **Forbidden** (A1 Matrix).

### Template 1: Presentation Plan (Tier 3 Required, Tier 2 Optional)

1. **Wow Moment**: Kaun sa pal, screen par kya dikhega, kitne `ms` mein, aur reduced-motion par kya vikalp hoga.
2. **Aesthetic Direction**: Ek hi direction ka naam (`direction-recipes.md` se ya custom), 1-line karan, aur `"mat lagao"` check (`style-matrix.md`).
3. **Recipe Customizations**: Base direction recipe mein product ke hisaab se kiye gaye kam se kam `2` badlaav aur unki wajah.
4. **Smartness Signals**: Pehchan tag, pre-fill cue, progress aur Undo kahan aur kab dikhenge.
5. **Polish Upgrades (3–5)**: Naam, jagah, kya badalta hai, aur kaam ko bina dabaye kaise behtar banata hai.
6. **Benchmark (with Evidence Label)**: Category ke 2 leading apps — `VERIFIED-BY-TOOL [RAN/USER-SHOWN]` agar is session mein dekha, warna `"unverified recall — GENERAL-RECOMMENDATION [GENERAL]"`.

### Template 2: Palette Table (Hex sirf yahin ek baar; baaki sab jagah token naam)

| Token Name | Primitive / Seed | Light Value (Hex/Alpha) | Dark Value (Hex/Alpha, if applicable) | Paired Surface / Text | Measured Contrast Ratio & Evidence Label |
|---|---|---|---|---|---|
| `bg-base` | Neutral 50 / 950 | `#...` | `#...` (or `N/A — single mode`) | `text-primary` | `...:1` (`VERIFIED-BY-TOOL [RAN: contrast_check.py]`) |
| `bg-surface` | Neutral 0 / 900 | `#...` | `#...` | `text-primary` / `text-secondary` | `...:1` |
| `accent-500` | Brand Hue 500 | `#...` | `#...` | `text-on-primary` | `...:1` |
| `danger-500` | Danger 500 | `#...` | `#...` | `text-on-primary` / `bg-surface` | `...:1` |

### Template 3: Screen Visual Blueprint (Har Screen ke liye, Text mein)

1. **Screen Archetype, Focal Point & Exception Note**: `Archetype: [...] | Hero/Anchor: [...] | Apwad (if any): [niyam] nahi lagaya | kyunki [reason + evidence] | badle mein [kya kiya]`.
2. **Section-by-Section Component Rows** (STEP 4 ke har Hissa ke har element ke liye 1 line):
   `Element Name | Darja (Hero / Doosra / Shaant) | Type Token | Text Token | Fill Token | Radius Token | Border Token | Shadow Token | Icon Size Token | Padding & Hit Area`
3. **Hero & Signature Placement**: Hero ki exact size/clearance (`px`) aur Signature Element is screen par kahan hai (ya Utility/Dialog hone ke kaaran kyun nahi hai).
4. **State & Motion Choreography**: Default, hover, pressed (`ms` + scale/fill), focus (`2px` ring), disabled, loading (skeleton), error (inline + 1-tap fix), offline; Wow Moment aur `prefers-reduced-motion` behaviour.
5. **Responsive, Dark Mode & Bhasha Reflow**: `375px / 768px / 1024px+` par composition kaise badalti hai, dark mode surface/border farak (agar lagu ho), aur sabse bade font ya Hindi/Devanagari (`line-height 1.5–1.6`) par kya badalta hai.
