# TK-09: Scorecard, Decision Log, Evidence Labels aur Proof-of-Work Receipt

Capability: `scorecard` (`TK-09`). Dimag ke `EVIDENCE` section aur `STEP 1.5`, `6.12`, `6.14`, `Output ka order` ke liye.
**Evidence Label**: Scorecard ke numeric thresholds (`80%`, `3/5`) aur rubric anchors **`UNVERIFIED` (author heuristic, not dataset-verified)** hain.

## 1. ONE Visual Quality Scorecard: 10 Criteria + B9-A ke 6 Dimensions Mapped (A3, B1, B9-A)

Sirf **EK hi Scorecard** hai. `B9-A` ke 6 objective visual dimensions (`Hierarchy`, `Typography`, `Spacing`, `Brand Fit`, `Readability`, `Originality`) alag scorecard nahi banate—wo neeche ke 10 criteria mein seedhe map kiye gaye hain.
Har criterion ka ank `1 se 5` ya `"NOT TESTED"` (ya `"N/A — archetype apwad"`). Bina observed saboot ke ank `0` hota hai, aur `5` sirf naape hue saboot (`px`, `ms`, contrast ratio, rendered observation) par milta hai.

| # | Criterion | Mapped B9-A Dimension(s) | 5 Ank Kab (Observed Evidence Required) | <3 Ank (Fail) Kab | Applicable Layers |
|---|---|---|---|---|---|
| 1 | **Hero & Primary Action Pehchan** | **Hierarchy** | First-Glance Check (`3s/5s`) pass; ek hi focal point aur primary action; size/contrast/clearance archetype ke mutabik naape hue | Do mukhya button takrate hain, ya primary action/purpose pehli nazar mein nahi milta | `SPEC`, `RENDER` |
| 2 | **Signature & Distinct Identity** | **Brand Fit**, **Originality** | Differentiation Analysis (B3) se juda 1 Signature Element (`3–4` jagah); logo dhakne par bhi isi product ka lage | Generic template jaisa, signature gayab ya har jagah thopa hua | `SPEC`, `RENDER` |
| 3 | **Type Hierarchy & Legibility** | **Typography**, **Readability**, **Hierarchy** | Adhiktam `4` size aur `3` weight (`TK-07`); `35–60ch` / `60–75ch` measure; Devanagari coverage + `1.5–1.6` line-height verified | Bikhre font sizes, `<16px` mobile body, `<12px` text, ya Hindi matra/conjunct katna | `SPEC`, `RENDER` |
| 4 | **Rang Anushasan & Contrast** | **Brand Fit**, **Readability** | Palette Table mein har text-bg jodi `>=4.5:1` (`contrast_check.py` se naapi hui); semantic rang icon+text ke saath; `60-30-10` ya valid Exception Note | Raw hex components mein bikhre, contrast `<4.5:1`, ya sirf rang se status bataya | `SPEC` (ratio), `RENDER` |
| 5 | **Depth, Surface & Card Discipline** | **Hierarchy**, **Originality** | Radius aur shadow ek hi scale se; nested radius sahi; bina wajah ke cards/boxes nahi (L24, L25); dark mode surface tint alag | Har cheez boxes/cards mein band, ya shadow/radius bina niyam ke mile-jule | `SPEC`, `RENDER` |
| 6 | **Spacing, Alignment & Balance** | **Spacing**, **Hierarchy** | `4px/8px` grid; ek jaisa card padding; left edges ek axis par; top-middle-bottom visual weight santulit (L28) | Mann-maani spacing, optical misalignment, ya crowding/dead voids | `SPEC`, `RENDER` |
| 7 | **Detail, States & Craft** | **Originality**, **Readability** | Sabhi `9` states (`default, hover, pressed, focus, disabled, loading, success, error, offline`) + `2px` focus ring + content-shaped skeleton | States gayab, full-screen blocking spinner, ya press par layout shift | `SPEC`, `INTERACT` |
| 8 | **Real Content, Copy & Imagery** | **Readability**, **Brand Fit** | Asli jaisa data, extremes tested (Stress Matrix `TK-11`), copy ledger ke mana shabd `0`, example data par `"namoona"` label | Lorem ipsum, `"Submit"`, `"Oops"`, generic stock photo, ya untruncated overflow | `SPEC`, `RENDER` |
| 9 | **Purposeful Motion & Restraint** | **Originality** | Motion tokens (`ms`) distance/size/importance se chune (B8); Restraint Budget ke andar; `prefers-reduced-motion` vikalp | Sajaavti/blocking animation, sab par ek hi ms, ya reduced-motion ignore | `SPEC`, `INTERACT` |
| 10 | **Consistency & Anti-Generic Depth** | **Originality**, **Brand Fit** | Consistency Matrix (`TK-11`) mein `0` unintended outliers; Anti-Generic Audit (B9-B) mein `L1` ke alawa `>=2` layers (`L2/L3/L4`) mein asli badlaav | Screens aapas mein alag lagti hain, ya redesign mein sirf rang/shadow (`L1`) badla | `SPEC`, `RENDER`, `INTERACT` |

## 2. Three Independent Scorecard Layers aur Verdict Rule (A3)

Scorecard ke teen swatantra star (layers) hain—**in teeno ke ank kabhi aapas mein average ya jode nahi jaate**:
1. **`Spec score (SPEC)`**: Likhe hue specification, tokens aur measured contrast ratios se.
2. **`Render score (RENDER)`**: Asli rendered preview ya screenshot (`375x812` mobile, `1280x800` desktop) ko aankhon se dekhkar, observed reasons ke saath. Agar `RENDER` ank `SPEC` se kam aaye to `RENDER` ank hi sach maana jaata hai.
3. **`Interaction score (INTERACT)`**: Asli chalte hue UI par keyboard Tab, focus ring, tap target, state transitions, text scaling aur `reduced-motion` chala kar.

**Pass Rules (Har Tested Layer par Alag Lagu)**:
- Har lagu criterion `>= 3/5` ho, aur us layer ke lagu criteria ka kul ank `>= 80%` ho.
- **Layer-wise maximum (table ke `Applicable Layers` column se)**: `SPEC` = 10 criteria → `/50` (pass `>= 40`); `RENDER` = criteria `1, 2, 3, 4, 5, 6, 8, 10` → `/40` (pass `>= 32`); `INTERACT` = criteria `7, 9, 10` → `/15` (pass `>= 12`). Alag layers ke ank kabhi mila kar ek total mat banao.
- Jo criterion ya layer test nahi hua, uski jagah **`"NOT TESTED"`** likho. **`"NOT TESTED"` kabhi pass nahi hota.**
- **Mandatory Verdict Wording (A3)**:
  - **`"Design passed / approved"` (`"Design pass hua"`)** sirf tab likhna allowed hai jab **`RENDER` layer sach mein chalaya gaya ho aur pass hua ho** (aur interactive kaam mein `INTERACT` bhi).
  - Agar `RENDER` layer nahi chala (sirf spec likha gaya hai), to **ekmatra allowed verdict** hai: **`"Spec-approved, render-unverified"` (`"SPEC-PASS: Spec-approved, render-unverified"`)**.

## 3. Dushman-Reviewer Pass (Ank Dene se Pehle — STEP 6.14)

1. Khud ke banaye spec ya screenshot ko ek nirdayi reviewer ki nazar se padho.
2. Scorecard bharne se pehle **3 sabse kamzor cheezein** likho (kahan autopilot/generic nishan bacha hai, kahan hierarchy ya spacing kamzor hai).
3. Har criterion par ank aur observed saboot likho; jo criterion `3` ya kam ho us par `P0–P3` loop (`TK-11`) chalao.
4. Receipt mein hamesha likho: *"Ank dene wala wahi hai jisne banaya; insaan ki nazar se jaanch baaki hai."*

## 4. Template: Decision Log (A4 — Anti-Feature-Creep)

_Trigger_: Tier 2 Medium (`M`) aur Tier 3 Large (`L`) par **Required**; `Audit` mode mein **Optional**; Tier 0 (`XS`) aur Tier 1 (`S`) par **Forbidden**.
_Rule (A4)_: **"Evaluate at least 3 alternatives; implement only those with demonstrated value for this user and screen. 'Add nothing' is a valid decision. If the request is already complete, say so and add nothing."**

| Decision / Problem Area | Alternatives Evaluated (Kam se kam 3 vikalp) | Chosen Decision (Apnaya) | Rejected Alternatives (Chhode) | Reason & Demonstrated Value for User/Screen (Ya `"Add nothing — request already complete"`) |
|---|---|---|---|---|
| `1. Flow / Architecture` | `Alt A (Literal) | Alt B (Smart Hub) | Alt C (Background/Share)` | `...` | `...` | `...` |
| `2. Layout / Component` | `Alt 1 | Alt 2 | Alt 3` | `...` | `...` | `...` |
| `3. Feature / Automation` | `Candidate 1 | Candidate 2 | Add nothing` | `...` | `...` | `...` |

## 5. Mandatory Evidence Labels (A7)

Har tathya, engine/palette/font chunav, benchmark aur test claim ke saath in **4 standard Evidence Labels** mein se ek lagana zaroori hai (priority Level 1 — `"keep it short"` kehne par bhi 1-line evidence label nahi hatta):

| Standard Evidence Label (A7) | Shorthand Tag (Brain/Validator) | Kab lagao aur kya likhna zaroori hai |
|---|---|---|
| **`VERIFIED-BY-TOOL`** | `[RAN]` / `[USER-SHOWN]` | Jab command, script (`search.py`, `contrast_check.py`, `check_devanagari.py`), browser render ya user ka diya screenshot sach mein is session mein dekha/chalaya gaya. **Run evidence zaroori**: kya chalaya + 1-line nateeja. |
| **`FROM-TOOLKIT-DATA`** | `[TOOLKIT: file]` | Jab tool kit ki kisi reference file (`style-matrix.md`, `industry-playbook-192.md`, `visual-tokens-recipes.md`, aadi) se data ya `UNVERIFIED` heuristic liya gaya, par live run se alag verify nahi hua. File ka naam likho. |
| **`GENERAL-RECOMMENDATION`** | `[GENERAL]` / `[ASSUMED]` / `GENERAL-KNOWLEDGE` | Jab aam UX/design gyaan use kiya, tool kit uplabdh nahi tha (fallback mode), koi dhaarna maani (`[ASSUMED]`), ya kisi leading app ka benchmark bina live browse kiye yaad se likha (`"unverified recall"`). |
| **`NOT-TESTED`** | `NOT TESTED` | Jab koi layer (`RENDER`, `INTERACT`) ya jaanch (jaise real-device Devanagari rendering, screen-reader traversal) is session mein chali hi nahi. |

**Sakht Manahi (A7)**: Bina `VERIFIED-BY-TOOL` run evidence ke `"engine se verified"` ya `"benchmarked"` likhna mana hai.

## 6. Template: Proof-of-Work Receipt with the 3 Mandatory Lists (B9-E)

_Trigger_: Tier 2 (`M`), Tier 3 (`L`) aur `Audit` mode par **Required** (poora); Tier 1 (`S`) par **Optional** (`1 line`); Tier 0 (`XS`) par **Forbidden** (Tier 0 par sirf 1-line evidence label lagta hai — A1 Matrix).

1. **Summary & Task Size**: Kya banaya/badla, chuna hua Tier (`T0/XS`, `T1/S`, `T2/M`, `T3/L`, `Audit`) aur uska 1-line karan.
2. **Eval & Gate Summary**: STEP 1.5 ke kitne naap `PASS`, `FAIL`, `NOT-TESTED`; VETO SOOCHI ka nateeja; `P0–P3` test-and-fix loop kitni baar chala (adhiktam `3` loops) aur bache hue `P2/P3` items.
3. **Three Mandatory Evidence Lists (B9-E — teeno alag dikhana zaroori)**:
   - **List 1 — Actually Done & Verified (`Chala aur saboot hai` — `VERIFIED-BY-TOOL [RAN / USER-SHOWN]`)**: Har wo script, contrast check, Devanagari check ya render jo sach mein chala, uske command aur result summary ke saath.
   - **List 2 — Estimated Only (`Sirf spec ya tool kit se anumanit` — `FROM-TOOLKIT-DATA [TOOLKIT: file]` / `GENERAL-RECOMMENDATION [GENERAL]` / `SPEC-ONLY`)**: Wo chunav, tokens, heuristics (`UNVERIFIED`), aur benchmarks jo spec ya reference data se aaye par live render/test nahi hue.
   - **List 3 — Could Not Do / Not Tested / Assumed (`Nahi ho saka ya maana gaya` — `NOT-TESTED` / `[ASSUMED]`)**: Jo star (`RENDER`, `INTERACT`), edge cases, real-device checks ya stack assumptions verify nahi ho sake, plus leftover `P2/P3` defects. (Is list ko chhupana VETO 18 todna hai.)
4. **Final Approval Verdict (A3, B9-E)**:
   - `SPEC Layer`: `PASS / FAIL (score/50)`
   - `RENDER Layer`: `PASS / FAIL (score/40)` ya `NOT-TESTED`
   - `INTERACT Layer`: `PASS / FAIL (score/15)` ya `NOT-TESTED`
   - **Overall Verdict**: `"Spec-approved, render-unverified"` (jab `RENDER` `NOT-TESTED` ho) — `"Design passed / approved"` sirf tab jab `RENDER` sach mein chala aur pass hua. Saath mein: *"Insaan ki nazar se jaanch baaki hai."*
