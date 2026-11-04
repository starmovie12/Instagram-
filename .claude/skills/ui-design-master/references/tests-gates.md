# TK-11: Tests & Gates — Stress Matrix, Regression, Accessibility, P0–P3 Loop aur Field Test Protocol

Capability: `tests-gates` (`TK-11`). Dimag ke `NIYAM 4`, `STEP 5.10` aur `STEP 6` (`6.7` se `6.19`) ke liye.
Har checklist item ka nateeja **`PASS` (observed saboot ke saath)**, **`FAIL`**, ya **`NOT-TESTED`** (aur agar sirf text spec mein likha hai par render/test nahi hua to **`SPEC-ONLY / NOT-TESTED`**) likho. Bina jaanche `PASS` likhna mana hai.

## A. Real-Content Stress Test Matrix (B9-C) + 9 Error Recovery Cases (NIYAM 4)

### 1. Real-Content Stress Matrix (B9-C — Tier 2/M aur Tier 3/L par Required)

| # | Stress Scenario (B9-C) | Kya Jaanchna Hai | Required Layout / UI Behaviour | Verdict (`PASS / FAIL / SPEC-ONLY / NOT-TESTED`) |
|---|---|---|---|---|
| 1 | **Bahut lamba title ya naam** (`120+ chars`) | Wrapping, truncation, adjacent buttons | `2-line` clamp + ellipsis + tooltip/expand; sibling buttons ya icons apni jagah se na hilein | |
| 2 | **Bahut chhota ya khaali content** (`0 items`, `1-char name`) | Empty state ya min-height | Saaf empty state (1 Heading + 1 Body + 1 thumb-zone CTA); card pichak kar ajeeb na lage | |
| 3 | **Bahut zyada content / x50 scale** (`50–5000 items`, `50 pills`) | Scroll performance, filter/search | `50+` items par virtualization + search/filter; `>5` pills par `"Aur (+N)"` bottom sheet | |
| 4 | **Dheema ya kata hua network** (`Slow 3G / Offline`) | Loading (`>1s`) aur action queue | Content-shaped skeleton (spinner nahi); action offline queue mein rahe aur network aate hi poora ho | |
| 5 | **Error states** (validation, server `500`, timeout) | Error placement aur recovery | Field/component ke paas inline message (cause + 1-tap fix); multi-error form par top error summary focus | |
| 6 | **Chhoti screen** (`320–375px` width + landscape) | Primary CTA reachability, overflow | `0` horizontal scroll; decoration hatakar core content aur `>=48dp` primary CTA saamne | |
| 7 | **Sabse bada system font** (`200%` / Dynamic Type) | Text reflow aur touch targets | Container/button height badhe; text kate nahi; touch target `>=48dp` aur gap `>=8dp` bana rahe | |
| 8 | **Bhasha / Multi-script** (Hindi/Devanagari, Hinglish, RTL if needed) | Matra clipping, line-height, expansion | Devanagari fallback font + `line-height 1.5–1.6`; `30%` text expansion par bhi button label na toote | |
| 9 | **Lamba bina-toota string** (URL, hash, transaction ID) | Container bounds | `overflow-wrap: anywhere` + shrinkable flex/grid child (`min-width: 0`) | |

### 2. Nine Common Invalid-Input / Error Recovery Cases (NIYAM 4 — Zero Dead-End)

Har lagu case ke liye spec mein `"Kya dikhega"` + `"1-Tap Fix"` likho:
1. **Khaali input**: Calm inline hint + 1-tap `"Paste karo"` ya `"Namoona dekho"` button.
2. **Galat format**: Cause batao + auto-trim/auto-format ya 1-tap `"Sudharein"` suggestion.
3. **Adhura input**: Batao kaun sa hissa chhoota hai + cursor seedha usi jagah focus karo.
4. **Galat type/app ka input**: Pehchan tag mein batao kya mila + 1-tap sahi tool/mode switch ya dobara paste.
5. **Private ya na-milne wala content**: Saaf karan (dosh diye bina) + 1-tap doosra input ya help sheet.
6. **Network na hona / Timeout**: `"Queue mein rakha gaya — network aate hi poora hoga"` + manual `"Dobara koshish"` button.
7. **Permission mana hona**: Bina daraye karan + kaam karne wala manual fallback (jaise clipboard mana hone par bada `"Paste"` button).
8. **File/Input bahut bada hona**: Seema batao + 1-tap auto-compress/split ya chhota hissa chunne ka vikalp.
9. **Duplicate / Dobara wahi kaam**: Pichla taiyar result turant dikhao + `"Phir se naya banayein"` secondary option (paisa kaam mein idempotency key se double-charge roko).

## B. Visual Regression aur Cross-Screen Consistency Matrix (B9-D)

### 1. Before/After Visual Regression Check (Existing Screen Edit par)
- **Touched List (`Kya badla`)**: `[exact components/tokens]`
- **Untouched List (`Kya jyon ka tyon rehna tha`)**: `[flow, safety confirm, other sections, existing tokens]`
- **Regression Verification**: Edit ke baad Untouched List ki har cheez dobara check karo (`"No unintended change verified at SPEC / RENDER"`).
- **Token Diff**: `Added: [...] | Modified: [...] | Removed: [...]`.

### 2. Cross-Screen Consistency Matrix (B9-D — Multi-Screen ya Existing App ke Saath)

| Screen Name | Spacing (`Padding / Gap`) | Typography (`Hero / H1 / Body`) | Icons (`Family / Size / Stroke`) | Radius Scale | Primary CTA Height & Pos | Interactive States (`9 states`) | Semantic Tokens | Outliers & Justification |
|---|---|---|---|---|---|---|---|---|
| `Screen 1` | `16px / 24px` | `Title 24 / Body 16` | `Lucide / 20-24 / 1.75px` | `8 / 12 / 16` | `52px, bottom thumb zone` | `All 9 matched` | `Matched` | `None` |
| `Screen 2` | `...` | `...` | `...` | `...` | `...` | `...` | `...` | ` Fix or 1-line reason` |

## C. Testable Accessibility Checklist (B6 + WCAG 2.2 Merged — Single Canonical Table)

_Rule (B6)_: Har item ka nateeja **`PASS`**, **`FAIL`**, ya **`NOT-TESTED`** (agar sirf spec mein likha hai to `NOT-TESTED (SPEC-ONLY)`).

| # | Accessibility Check (B6 + WCAG 2.2) | Test Method & Acceptance Criteria | Verdict (`PASS / FAIL / NOT-TESTED`) & Evidence |
|---|---|---|---|
| 1 | **Contrast Ratios** | Normal text `>=4.5:1`; large text (`>=24px` ya `>=18.66px` bold) & meaningful icons/control boundaries `>=3:1` in both light & dark modes; scrim measured on real background (`python3 scripts/contrast_check.py`). | |
| 2 | **Touch-Target Size & Spacing** | Har interactive control ka hit area `>=48x48dp` (`>=44x44pt` iOS; web pointer min `24x24 CSS px`, hum `48dp` rakhte hain) aur do targets ke beech `>=8dp/8px` gap. | |
| 3 | **Keyboard Navigation & Drag Alternative** | Tab/Shift+Tab/Enter/Space/Escape se poori screen chale; koi keyboard trap na ho; har drag ya swipe-only action ka 1-tap button/keyboard alternative ho (WCAG 2.5.7). | |
| 4 | **Visible Focus & Not Obscured** | Har interactive element par `>=2px` high-contrast focus ring (`2px` offset, `>=3:1` state contrast); sticky header/footer/sheet focused control ko kabhi na dhake (WCAG 2.4.11). | |
| 5 | **Focus Order** | Tab order bilkul visual reading order ke kram mein ho; page/modal khulne par focus mukhya heading/content par jaye; failed multi-field submit par top error summary par jaye. | |
| 6 | **Screen-Reader Labels & Live Updates** | Icon-only buttons par `aria-label`/`accessibilityLabel` + state (`selected/pressed/expanded`); decorative icons `aria-hidden="true"`; sequential headings (`h1→h6`); auto-detect/status aur toasts `aria-live="polite"` mein announce hon. | |
| 7 | **Text Scaling (Dynamic Type)** | System font `200%` / largest size par bina horizontal scroll, text clipping ya overlapping ke poora kaam ho. | |
| 8 | **Reduced Motion & Auto-Rotation** | `prefers-reduced-motion` par transform/parallax/shimmer band hokar instant ya gentle opacity badlaav ho; auto-rotating carousel mein pause/stop control ho. | |
| 9 | **Error Messages, Redundant Entry & Auth** | Error field se `aria-describedby` / `role="alert"` se juda ho, cause + fix bataye, sirf rang par nirbhar na ho; pehle di gayi jaankari dobara na bharwayi jaye (WCAG 3.3.7); login mein paste/password manager chale aur cognitive puzzle na ho (WCAG 3.3.8); help har screen par ek hi jagah ho (WCAG 3.2.6). | |

## D. Pre-Delivery & Native UI Quick Gate

Native/mobile app UI ke liye `pro-rules-and-predelivery.md` ki tables aur checklist lagu karo: `375px` portrait + landscape, safe areas, vector-only icons (structural emoji `0`), official brand logos, press state without layout shift, aur light/dark independent contrast verification.

## E. P0–P3 Defect Definitions aur Test-and-Fix Loop Protocol (B4)

### 1. P0–P3 Severity Definitions (B4 Baseline)

| Priority | Naam | Definition (Kya tootne par ye darja lagta hai) | Release Rule |
|---|---|---|---|
| **P0** | **Blocker / Critical** | Core task toot jaye, `SURAKSHA KI ZAMEEN` (dark pattern, fake urgency, hidden exit, unconfirmed payment/delete, privacy) toote, PRD ka required feature chhoot jaye, dead-end ho, ya critical accessibility (`<4.5:1` contrast, `<48dp` primary target, missing focus/escape) fail ho. | **Zero tolerance**: `P0` rehte hue design deliver ya approve nahi ho sakta. |
| **P1** | **Major / High** | Screen ki clarity, visual hierarchy, First-Glance Check (`3s/5s`), ya primary action ki pehchan/reachability toot jaye, ya edit se UX/responsive regression aa jaye, ya Scorecard ka koi criterion `<3/5` ho. | **Must fix in loop**: Loop ke andar sudharna zaroori. |
| **P2** | **Minor / Medium** | Cross-screen token/spacing/radius inconsistency, secondary state polish ki kami, ya minor alignment drift jo mukhya kaam ko nahi rokta. | Loop mein sudharo; agar 3 loops ke baad bache to Receipt mein khulkar likho. |
| **P3** | **Nice-to-Have / Low** | Optional micro-interaction nikhaar ya aesthetic sujhav. | Receipt mein optional note ki tarah likho; iske liye extra loop mat chalao. |

### 2. Test-and-Fix Loop Protocol (Maximum 3 Loops — B4)

1. **Build v1**: Task tier ke mutabik layout aur visual spec (ya code/render) banao.
2. **Audit & Tag Defects (`P0–P3`)**: STEP 6 ke checks (Stress Matrix, Regression, Accessibility, Dushman-Reviewer, Scorecard, VETO) chalao aur har kami ko `P0`, `P1`, `P2`, ya `P3` tag do.
3. **Fix `P0` and `P1`**: Sabhi `P0` aur `P1` defects ko theek karo.
4. **Re-View & Check Regressions**: Sudhare hue screen ko dobara dekho aur verify karo ki fix karne se koi naya UX, safety ya responsive regression to nahi aaya.
5. **Stopping Rule (Max 3 Loops)**: Ye chakkar **adhiktam 3 baar (Maximum 3 loops)** chalao. Jaise hi `0` `P0` aur `0` `P1` bachein, turant ruk jao. Bache hue `P2/P3` defects ko chhupao mat—Proof-of-Work Receipt ki List 3 mein khulkar likho.
6. **Spec-Only Fallback**: Agar rendering tool ya screenshot uplabdh nahi hai, to ye loop `SPEC` layer par chalao aur output par saaf label lagao: **`"Spec-approved, render-unverified (P0–P3 loop run at SPEC layer only)"`**.

## F. Field Test Protocol aur Log Template (A8 — Real-World PRD Verification)

_Kyun zaroori hai (A8)_: `scripts/validate_brain.py` sirf mechanical checks karta hai (XML well-formedness, file/tag/section links, bhatke script-mix shabd, examples ke contrast ank, L-ID legend); wo ye **nahi** saabit karta ki prompt se behtar UI banti hai. Jab tak v18 kisi asli PRD par neeche ke protocol se nahi chalta, Brain ke `<jaanch_status_v18>` mein `"NOT field-tested on a real PRD"` likha rahega.

### 1. Field Test Execution Steps
1. **Select Real PRDs**: Har tier (`T0/XS`, `T1/S`, `T2/M`, `T3/L`, `Audit`) se kam se kam 1 asli PRD/request lo (jisme Hindi/Hinglish aur payment/destructive case bhi shamil ho).
2. **Run Unassisted**: Brain + Toolkit ko bina extra hints ke chalao.
3. **Render & Capture**: Output spec se HTML/component preview (`375x812` aur `1280x800`) render karke screenshots lo aur contrast/Devanagari scripts chalao.
4. **Compare Before vs After (v17 vs v18)**: Check karo:
   - Kya `T0/T1` par over-output ruka (A1)?
   - Kya dashboard/form/dialog par bekaar hero zabardasti lagna band hua (A2, B8)?
   - Kya `RENDER` bina chale `"Design passed"` likhna ruka (A3)?
   - Kya faltu feature creep ruka (A4) aur payment/KYC steps surakshit rahe (A5)?
   - Kya Devanagari font coverage aur rendering sach mein verify hui (A6)?
5. **Surgical Fix Rule**: Sirf wahi niyam badlo jo asli PRD run mein fail hua; bina saboot naya section mat jodo.

### 2. Field Test Log Table (Jab Asli Run Ho Tab Yahan Darj Karo)

| Run ID & Date | PRD / Task & Tier (`T0–T3 / Audit`) | Layers Tested (`SPEC / RENDER / INTERACT`) | Before vs After Observation (Screenshots / Metrics) | What Failed (`P0–P3`) | Exact Rule Adjusted |
|---|---|---|---|---|---|
| `FT-00 (Pending)` | `Not yet run on a real PRD` | `Syntax only (validate_brain.py PASS)` | `N/A — awaiting first real PRD field test` | `None logged yet` | `Status kept as NOT FIELD-TESTED in Brain header` |
