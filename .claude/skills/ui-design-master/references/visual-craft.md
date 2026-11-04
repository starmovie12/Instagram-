# TK-08: Visual Craft — Heuristics, Archetypes, Templates aur Anti-Generic Audit

Capability: `visual-craft` (`TK-08`). Dimag (`VISUAL CRAFT` section) kehta hai ki visual niyam **default heuristics** hain, sarvabhaumik kanoon (universal truths) nahi; yahan unke ank, parameter, templates aur har screen-prakar (archetype) ke apwad hain.
**Evidence Label**: Yahan ke numeric ratios, time windows aur budgets **`UNVERIFIED` (author heuristic / reference data, not independently verified from dataset)** hain; screen ke asli kaam aur saboot ke saamne inhe badla ja sakta hai.

## 1. Screen ke Archetypes, First-Glance Parameter aur Apwad (A2, B1, B8)

Pehle screen ka archetype chuno. Har heuristic ke teen hisse hain:
1. **Kab lagta hai (Applies when)**: Showcase, landing, ya ek-mukhya-kaam wali screen.
2. **Kab nahi lagta (Does NOT apply when)**: Data-dense dashboards, settings, confirmation ya utility dialogs, forms, accessibility-critical screens, aur reading/docs screens.
3. **Mandatory Exception Note (Apwad ka format, ek line)**: `"Apwad: [heuristic ka naam] nahi lagaya | kyunki [screen purpose + saboot] | badle mein [kya kiya]."`

**First-Glance Comprehension Check (`Pehli-Nazar Check`, A2 + B1 shared check — ek hi jagah)**:
- Parameter: `first_glance_window_sec = 3s` (Showcase, Dashboard, Confirmation/Dialog) | `5s` (Form, Settings, dense multi-group screen) — `UNVERIFIED` heuristic.
- Check (3 baatein ek saath): Is samay-seema ke andar user (i) screen ka mukhya maksad (primary purpose) samajh le, (ii) sabse zaroori kaam (primary action) pehchan le, aur (iii) aankhein bhinchne (squint test) par bhi 3-darje ka hierarchy (`Hero → Doosra → Shaant`) saaf dikhe.

| Archetype | Applies to | Focal Point / Visual Anchor (B8) | Colour & Effect Heuristic (A2, B8) | First-Glance Check (`first_glance_window_sec`) |
|---|---|---|---|---|
| **Showcase / Mukhya-kaam** | Home, paste/upload hub, onboarding start, landing | **Required**: Ek hero — doosre darje se `~1.5x` bada (`UNVERIFIED`), sabse zyada contrast, charon taraf `24–48px` (`UNVERIFIED`) khuli jagah | `60-30-10` default (`UNVERIFIED`); tinted neutrals (`2–6%` sat, `UNVERIFIED`); hero par adhiktam 1 effect; signature dikhe | `3s`: mukhya kaam + primary action + hero turant pakad mein (`RENDER`) |
| **Ghana data / Dashboard** | KPIs, tables, charts, ops tools | **Modified**: Sabse zaroori 1 number ya chart (`~1.25–1.5x` `UNVERIFIED`); baaki cards barabar ho sakte hain (par andha 2x2 grid nahi) | Neutral bhaari; accent selection/status/data series par (`10%` se upar allowed with Exception Note); density dial `7–9`; table text `>=4.5:1` | `3s`: sabse zaroori KPI aur filter/action mila (`RENDER`) |
| **Form / Settings** | Sign-up, checkout fields, settings, profile edit | **Optional anchor (B8)**: Clarity pehle; bada decorative hero mana; hierarchy clean grouping aur active field/submit button se | Effect lagbhag `0`; neutral clean; label, helper text aur error saaf | `5s`: koi bhi setting/field aur primary submit bina bhatke mila (`RENDER`) |
| **Confirmation / Dialog** | Delete, logout, payment confirm, permission | **Optional anchor (B8)**: Clarity aur safety pehle; sawaal, nateeja (jaise rakam) aur surakshit Cancel/Exit (`>=48dp`) bilkul saaf | **0 decorative effects**: koi gradient, glow ya fancy motion nahi; danger rang alag; 1-tap safe exit | `3s`: nateeja/rakam aur wapsi ka raasta saaf padha gaya (`RENDER`) |
| **Accessibility-pradhan / Critical** | Health, civic/govt, elderly users, emergency SOS | **Clarity outranks hero**: Padhne aur dabane ki saralta sabse upar; body `>=18px`, tap `48–56dp` | Effect budget `0`; shuddh high-contrast neutral (`>=7:1` jahan ho sake); motion par nirbhar nahi | Sabse bada font + screen reader par 100% kaam (`INTERACT`) |
| **Utility / Transient** | Toast, picker, bottom sheet, loading, empty state | **Optional anchor**: Hero rule lagu nahi; sirf product ke tokens aur 1 saaf agla kaam | Signature zaroori nahi; product ke semantic tokens se mel | `3s`: halat aur agla kaam saaf (`SPEC / RENDER`) |
| **Padhne wala content** | Article, docs, help, release notes | **Typography hi anchor**: Heading hierarchy aur aaramdayak line measure (`60–75ch`) | Effect kam se kam; accent sirf link, active TOC aur callout par | Lambe paragraph par padhne ka aaram (`RENDER`) |

**Ek Product, Ek Pehchan (One Product Identity — B3, B8)**: Poore product ki ek hi design bhasha hoti hai (Visual Thesis, Signature Element, tokens, motion family). Alag-alag screens apne archetype, role aur content se alag dikhti hain, alag design language ya alag "per-screen identity" se nahi.

## 2. Default Visual Heuristics aur B7/B8 Sudhaar (`UNVERIFIED` heuristics)

1. **Hero Vazan Heuristic (A2, B8)**:
   - *Applies when*: Showcase ya single-primary-action screen (`~1.5x` size vs secondary, highest contrast, `24–48px` clearance, max 1 effect — `UNVERIFIED`).
   - *Does not apply when*: Dashboards, forms, settings, confirmations, utility dialogs, accessibility-critical screens (upar ki table dekho).
2. **Rang Anushasan Heuristic (60-30-10 & Tinted Neutrals — A2)**:
   - *Applies when*: Standard consumer/SaaS screens (`~60%` neutral base, `~30%` surface/secondary, `<10%` accent; neutrals tinted `2–6%` toward brand hue — `UNVERIFIED`).
   - *Does not apply when*: Strict brand/platform guidelines, OLED/high-contrast dark mode, multi-series data dashboards, Neo-Brutalist/Maximalist/Clinical Void directions, ya accessibility-critical screens. Semantic colours (`success`, `warning`, `danger`, `info`) hamesha icon/text ke saath aayein, sirf rang se matlab kabhi na batayein.
3. **Clarity Beats Effect & Restraint Budget (B8)**:
   - **"Pehli nazar mein prabhavit karo" ki seema**: **Clarity beats effect (`saaf dikhna aur samajh aana har visual effect se upar hai`)**.
   - **Restraint Budget (`UNVERIFIED` heuristic)**: Ek screen par adhiktam `1` gradient, `1` blur/glass layer, `1` focal animation (Wow Moment), aur `1` accent hue. Jo effect hatane par screen ki samajh ya gunwatta na ghate, use hata do.
4. **Card-Bandi aur Composition Anushasan (B7 — L24, L25, L28, L30, L31, L35, L36, L39)**:
   - **Bina wajah ke cards/boxes mana (L24, L25)**: Aadat ke taur par screen ko faltu cards, boxes, borders aur alag boxes mein mat baanto. Jahan khuli spacing (`whitespace`), alignment aur typography se behtar santulan milta ho, wahan card container mat lagao.
   - **Upar-Beech-Neeche ka Santulan (L28)**: Screen ke top, middle aur bottom hisson ke visual weight mein santulan rakho; screen upar ya neeche se dabi hui na lage.
   - **Single-Column ki Shaan (L30)**: Agar layout saada single-column hai, to uski gunwatta nakli complexity ya faltu widgets jodkar nahi, balki strong composition, sateek typography aur barik details se badhao.
   - **Component ka Vazan = Uska Maksad (L31, L35, L36, L39)**: Har button ya card ek jaisa dikhna zaroori nahi; har button ka visual prominence uske asli mahatva ke barabar ho. Primary button saaf taur par sabse pramukh ho, par itna bhaari ya bhadkeela na ho ki poori screen ko daba de. Components ke beech saaf visual rishta ho taaki screen bikhri (fragmented) na lage.
5. **Conditional Light aur Dark Mode (B8)**:
   - Light aur dark mode hamesha dono banana zaroori **nahi** hai. Dono tabhi banao jab product, PRD ya user ko dono ki zaroorat ho; jab dono banao tab dono ko do poore, swatantra anubhav ki tarah design aur test karo (sirf background ulta karna mana hai). Agar ek hi mode kafi hai to 1 line mein wajah likho.
6. **Context-Scaled Motion (B8)**:
   - Poore product mein easing family aur motion behaviour ek jaisa rahe, par **animation duration sab jagah ek samaan (uniform) na ho**: duration tay hota hai **distance (kitni doori chali), element size (kitna bada hissa hila), aur task importance (kaam kitna mahatvapoorna hai)** se (`TK-05` aur `TK-07`).
7. **Depth, Typography, Spacing, Detail aur Imagery**:
   - Roshni ek disha se; elevated surface par `1px` hairline + 2-layer shadow (dark mode mein lighter surface tint); glass sirf floating chrome par.
   - Typography: adhiktam `4` size aur `3` weight ek screen par; 3-tier hierarchy (`Hero`, `Doosra`, `Shaant`); data/price/timer mein tabular numerals.
   - Spacing: `4px/8px` grid; nested radius = `outer radius - padding`; optical alignment.
   - Imagery: ek hi art direction; generic stock photos mana; example data/avatars par `"namoona"` label (`SURAKSHA KI ZAMEEN`).

### L-ID Legend (cross-reference tags)

`L1–L4` = Anti-Generic Audit ke 4 layers (Section 4, B9-B). `L24` aur usse upar ke tag original design-lesson numbers hain jo Brain aur Toolkit mein sirf cross-reference ki tarah aate hain; unka matlab wahi hai jo is Toolkit mein unke saath likha hai (numbering par bharose faisla mat karo):

| Tag | Is Toolkit mein matlab |
|---|---|
| `L24`, `L25` | Bina wajah ke cards/boxes/borders nahi |
| `L28` | Top-middle-bottom visual weight ka santulan |
| `L30` | Single-column ki gunwatta composition aur typography se |
| `L31`, `L35`, `L36`, `L39` | Component ka vazan = uska maksad; primary action prominent par poori screen ko na dabaye (`L36`) |
| `L46` | `>1s` par skeleton, full-screen blocking spinner nahi |
| `L48`, `L49`, `L50` | Motion: performance aur accessibility priority (`TK-05`) |
| `L51`, `L52` | Sirf scale karna nahi; har chaudai ki apni composition (`TK-10` Section D) |
| `L53`, `L54`, `L55` | Text scaling, keyboard, safe area aur primary-action reachability par layout ka santulan (`TK-10` Section D) |

## 3. Templates: Differentiation Analysis (B3), Visual Thesis aur Signature Element

_Trigger_: Tier 2 Medium (`M`) aur Tier 3 Large (`L`) par **Required** (poore product ke liye ek baar); `Audit` mode mein **Optional**; Tier 0 (`XS`) aur Tier 1 (`S`) par **Forbidden**.

### Template 1: Differentiation Analysis (B3 — Distinct Product Identity)

| Field | Kya likhna hai (1–2 lines per row) |
|---|---|
| **1. Product Category** | Product kis category aur kis use-context (kaam, safar, aaram, critical) mein hai (`TK-03` reference) |
| **2. Target Audience** | Mukhya user kaun hai, uski takniki samajh aur us pal ki manosthiti kya hai |
| **3. Brand Personality** | 3 non-contradictory vishesan (jaise *"shaant, sateek, bharosemand"* — *"shaant"* aur *"bhadkeela"* ek saath mana) |
| **4. Common Competitor Patterns** | Is category ke aam apps kya ghise-pite patterns use karte hain (layout, rang, cards) |
| **5. Chosen Signature & Identity** | Hamari chuni hui Aesthetic Direction + 1 Signature Element jo ise pehli nazar mein alag banata hai |
| **6. Deliberately Avoided Patterns** | Kaun se 2–3 popular trends ya competitor habits humne jaanboojhkar chhode aur kyun |

### Template 2: Visual Thesis (1 Sentence)

> **Visual Thesis**: *"Ye product `[Vishesan 1]`, `[Vishesan 2]` aur `[Vishesan 3]` dikhta hai, kyunki `[user aur bharose ki wajah]`; iski pehchan `[Signature Element]` hai."*

### Template 3: Signature Element Specification

> **Signature Element**: `Naam aur roop` | **Kahan dikhega (3–4 jagah)**: `[list]` | **Kahan NAHI dikhega**: `[utility/dialogs/forms jahan shanti chahiye]` | **Logo-Cover Test**: `SPEC-ONLY` ya `RENDER-VERIFIED`.

## 4. Anti-Generic Audit aur Badlaav ki Gehraai (B9-B)

1. **Autopilot / Generic Template ke Nishaan (Anti-Generic Ledger)**:
   - Safed par bina wajah purple-to-blue gradient; center hero ke peeche generic gradient blob; har card ek hi radius, ek hi shadow aur 3 barabar columns mein; bina hierarchy ka default font; structural icon ki jagah emoji; har cheez par glassmorphism; bina wajah neon glow; `"Welcome back 👋"` banner; har cheez center-aligned; sabhi buttons ek jaise bhaari pills.
   - Rule: Inme se kuch bhi tabhi rakho jab product/direction ki wajah Exception Note mein saabit ho.
2. **Badlaav ki Gehraai Audit (4-Layer Structural Check — B9-B)**:
   - Kisi screen ya redesign ko *"naya, distinct ya non-generic"* kehne ke liye sirf rang ya shadow badalna **fail** hai. Chaar paratein jaancho:
     - **L1 (Surface)**: Rang, shadow, border, radius.
     - **L2 (Typography)**: Font pairing, scale contrast, weight hierarchy, tabular numerals, reading measure.
     - **L3 (Layout & Composition)**: Spatial allocation (`%`), attention flow, unnecessary cards hatana, responsive reflow.
     - **L4 (Component Relationships & Signature)**: Smart Hub consolidation, inline preview vs separate page, aur Signature Element ka dohrav.
   - **Pass Rule**: `L1` ke alawa **kam se kam do aur paraton (`L2`, `L3`, ya `L4`)** mein asli, likha hua badlaav hona zaroori hai (`"Anti-Generic Audit: L2 [...], L3 [...], L4 [...]"`).
