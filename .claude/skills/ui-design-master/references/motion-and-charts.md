# TK-05: Motion aur Charts (Context-Scaled Motion & Chart Picker)

Capability: `motion-charts` (`TK-05`).
**Evidence Label**: `FROM-TOOLKIT-DATA` — Yahan ke ms ranges aur stagger/scrub numbers **`UNVERIFIED` (author heuristic / reference ranges)** hain.

## 1. Context-Scaled Motion (B8 — Duration Scales with Distance, Element Size & Task Importance)

**Sakht Niyam (B8)**: Poore product mein **easing families aur motion behaviour rules consistent** rehte hain, par **animation duration sabhi interactions par uniform (ek barabar) kabhi nahi hota**. Duration 3 baaton se scale hota hai:
1. **Distance (Doori)**: Chhota state/press change (`0–4px`) tez (`80–120ms`); medium slide/tag (`8–24px`) `150–250ms`; full sheet ya page travel (`250–500ms`).
2. **Element Size (Aakar)**: Icon, chip ya button (`80–150ms`) chhota hai to tez; card ya inline preview (`180–280ms`); bottom sheet, modal ya full-screen transition (`280–450ms`).
3. **Task Importance (Kaam ka Mahatva)**: Bar-bar hone wala utility micro-action (`0–120ms`, kabhi rasta na roke); mukhya Wow Moment ya safalta ka pal (`300–600ms`, adhiktam 1 per screen).

### Web / GSAP Motion Tiers (`UNVERIFIED` reference ranges; base tokens `0, 100, 200, 350, 600ms` in `TK-07`)

- **Hover micro-interaction**: Subtle `150–200ms`, `power1.out` (`<2px` lift); Standard `200–300ms`, `power2.out` (mouseleave par reverse); Complex `300–500ms`, `elastic.out(1, 0.4)` (bounded).
- **Scroll reveal**: Subtle `300–400ms`, `power1.out` (`y: 8–16px`); Standard `400–600ms`, `power2.out`; Complex scroll-linked scrub (`0.5–1.5`).
- **Stagger list**: Subtle `250–350ms` (`20–40ms` per item); Standard `300–450ms`, `back.out(1.4)`; Complex `400–700ms`, `expo.out`.
- **Page / View transition**: Subtle `200–300ms`, `power1.inOut`; Standard `400–600ms`, `power2.inOut`; Complex `500–800ms`, `expo.inOut`.
- **Skeleton shimmer**: `1200–1600ms` background-position sweep (opacity pulse nahi); `prefers-reduced-motion` par **sthir (static)**.
- **Performance & Accessibility Priority (L48, L49, L50)**:
  - Sirf `transform` aur `opacity` animate karo (`width`, `height`, `top`, `left` kabhi nahi).
  - Ek view mein adhiktam `1–2` mukhya cheezein animate hon; exit duration enter ka `~60–70%` ho.
  - Har animation **interruptible** aur **non-blocking** ho: user ke tap/input ko animation kabhi na roke, aur tez state badlaav par pichli animation cancel hokar naya final state seedha set ho.
  - **Accessibility & Performance Priority**: Motion aesthetics kabhi bhi accessibility (`prefers-reduced-motion`), low-end mobile performance (`60fps / 16ms` frame budget), ya task clarity ke upar nahi ja sakte.

## 2. Chart Picker (Data ke Type se Chart — Sajaavat se Nahi)

Har chart ke saath **accessible table alternative** aur **1-line text insight summary** dena zaroori hai (`TK-06` & `TK-11`).

- **Trend over time**: Line (`<4` points hon to stat card).
- **Category comparison**: Bar (`>15` categories hon to sortable table + search).
- **Part-to-whole**: Pie / Donut (`<=5` slices; `>5` ya `<5%` difference par Horizontal Bar).
- **Correlation**: Scatter / Bubble. **Intensity**: Heatmap. **Geography**: Choropleth / Bubble map.
- **Funnel / Flow**: Funnel / Sankey. **Target progress**: Gauge / Bullet. **Forecast**: Line + confidence band.
- **Hierarchy**: Treemap (`<=3` levels). **Cumulative bridge**: Waterfall (`<=12` bars). **Multi-metric**: Radar (`<=8` axes). **OHLC Finance**: Candlestick.
- **Chart Accessibility Rules**: Legend chart ke paas; tooltip hover + tap + keyboard focus par; **rang ke saath pattern/shape/label** (red-green akela kabhi nahi); data elements `>=3:1` contrast aur text `>=4.5:1`; touch target `>=44pt/48dp`; empty/loading/error states defined; `prefers-reduced-motion` par entrance animation band.
