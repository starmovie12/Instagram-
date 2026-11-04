# TK-16: Changelog aur Jaanch-Itihaas (v11 se v18 rev 3)

Capability: `changelog` (`TK-16`). Dimag (`master-prompt.xml`) ko ye har baar padhna nahi padta; sirf itihaas dekhna ho to.

## v18 (rev 3: Audit-Fix — sirf sudhaar, koi naya niyam nahi)

Poore package (Brain + 20 reference files + scripts + data counts) ka line-by-line audit; sirf wahi badla jo galat ya takraata paya gaya. `toolkit_version` aur `requires_toolkit` `v18` hi hain (contract nahi badla).

**Brain (`master-prompt.xml`)**
1. **Presentation Upgrades ka takraav**: Section header ne Tier 2 par poore hisse ko "Optional" aur Audit par "Forbidden" kaha, jabki Matrix mein Differentiation Analysis, Visual Thesis aur Signature Element Tier 2 par Required aur Audit par Optional hain. Header aur text ab Matrix ke mutabik (Presentation Plan: T3 Req / T2 Optional / Audit Forbidden).
2. **Tier 1 Receipt**: Matrix (aur TK-09) mein "Optional (one line)", jabki SAR item 13 aur Output order mein bina "Optional" ke 1-line Receipt likha tha. Matrix ko pramaan maana (Priority 4 ka authority) aur SAR + Output order ko uske mutabik kiya, taaki chhote kaam par over-output na ho.
3. **Bhatke Devanagari shabd**: Roman-Hinglish text ke beech `संक्षिप्त` (x2), `हर`, `हिस्सों`, `लागू` hataye.
4. Header mein rev 3 note aur `jaanch_status_v18` mein naye mechanical checks ka zikr (status ab bhi "NOT field-tested on a real PRD").

**Toolkit**
5. **`examples.md`: galat VERIFIED example**: `contrast_check.py '#1A1A1A' '#FFFFFF'` ko `7.1:1` likha tha; script ka asli nateeja `17.40:1` hai. Sudhara (Brain ka apna "bina chalaye verified mat likho" niyam example mein hi toot raha tha). Tier 0 namoone se bhi "Spec-approved" verdict hataya (Tier 0 mein Scorecard Forbidden hai).
6. **`scorecard-and-evidence.md`: layer-wise score**: Receipt mein teeno layers par `(score/50)` likha tha, jabki RENDER 8 criteria par (`/40`) aur INTERACT sirf 3 par (`/15`) lagta hai. Layer-wise maximum aur 80% pass limit (40 / 32 / 12) joda; typo `baksों`, `hat-ta` sudhare.
7. **`pro-rules-and-predelivery.md`**: file mein maujood na hone wala quick-reference (purani file ka naam) reference `ux-rules-full.md` (TK-06) par; touch target `>=44pt` ko Toolkit ke `48dp` floor ke saath mila diya.
8. **`visual-craft.md`**: L-ID legend joda (`L24`+ tags kisi file mein define nahi the aur `L1–L4` ke saath naam-takraav ka khatra tha); bhatke shabd (`आरामदायक`, `baksों`, `समान`) sudhare.
9. **`visual-tokens-recipes.md`**: `Title` ko Devanagari line-height `1.3` (typography-rules (c) ke mutabik; pehle `1.25` bina Dev variant ke); bhatke shabd sudhare.
10. **`tests-gates.md`, `layout-platform.md`, `typography-rules.md`, `SKILL.md`, `examples.md`**: bhatke Devanagari/mixed-script shabd sudhare (`या`, `कटा`, `लागू`, `बेकार`, `चौड़े`, `प्रति`, `खाली`, `कोई`).
11. **`TOOLKIT-INDEX.md`**: templates ke `...`/`#...` placeholder ka note (output mein bacha hua placeholder VETO 7 todta hai).
12. **`scripts/validate_brain.py`**: naye mechanical checks: bhatke Devanagari (backtick ke bahar), `TK-nn Section X` cross-refs, backticked file names ka wujood, examples ke `contrast_check.py` wale ank (recompute karke), L-ID legend, aur SKILL/INDEX/Brain mein `rev` ek jaisa.

**Jo jaanch kar ke sahi paya gaya (badla nahi)**: style 50, industry 192, pairing 74, direction recipe 16, scorecard 10, responsive 10, accessibility 9, error cases 9, stress rows 9, component recipes 14; `styles.csv` 88 = 50+29+9; Devanagari companion/lookup table ka har font bundled CSV se milaya gaya; `contrast_check.py` ke ank (21:1, `#767676` = 4.54, `#777` = 4.48) sahi.

## v18 (rev 2: Complete A1–A9 & B1–B9 Precision Update)

Dimag (`master-prompt.xml`) aur Tool Kit (`ui-design-master`) ko poori tarah logic-only vs reference-material architecture mein kasa gaya:
1. **Architecture & TK-00 Index (Section 2)**: Tool kit mein `TK-00 INDEX` (`TOOLKIT-INDEX.md`) ke saath har capability ko stable ID (`TK-01` se `TK-15`) di gayi. Dimag se bache hue checklists, templates aur numeric parameters (`NIYAM 1` feature list, `NIYAM 4` error list, `STEP 5.7` gesture details, `STEP 5.10` WCAG list, `STEP 5.13` Blueprint template) tool kit mein move kiye gaye taaki dimag aur chhota aur tej ho.
2. **Toolkit Request Protocol (Section 3)**: Dimag mein 4-state Toolkit Gate (`TOOLKIT_PRESENT`, `PARTIAL`, `MISSING`, `VERSION_MISMATCH`), task-size par aadharit need detection (Tier 0 micro copy edits par bina wajah ask nahi), single batched Hinglish request + `CHECKPOINT`, exact `"Resuming at step X"` rule, aur `GENERAL-KNOWLEDGE` (`[GENERAL-RECOMMENDATION]`) fallback joda gaya.
3. **A1 Task Size Router & Deliverable Matrix**: Tiers `Tier 0 Micro (XS)`, `Tier 1 Small (S)`, `Tier 2 Medium (M)`, `Tier 3 Large (L)` aur `Audit/Review Mode` ke saath 11 deliverables ka exact `Required / Optional / Forbidden` matrix lagu kiya gaya. Tier 0 par sirf badlaav + 1-line evidence label.
4. **A2 & B8 Demoted Visual Heuristics & Unified First-Glance Check**: Hero size ratio, hero highest contrast, colour split, brand-tinted neutrals, visual anchor, uniform motion durations, `"impress at first glance"` (`clarity beats effect` + restraint budget), light/dark mode (conditional), aur per-screen identity (replaced by one product identity) ko default heuristics banaya gaya, mandatory 1-line Exception Note ke saath. First-glance checks ko mila kar ek hi **First-Glance Check (`Pehli-Nazar Check`)** banaya gaya jiska time parameter (`first_glance_window_sec`) `TK-08` mein hai.
5. **A3, B1 & B9-A Single 3-Layer Scorecard**: `SPEC`, `RENDER`, `INTERACT` teen swatantra layers (kabhi average nahi hote); `B9-A` ke 6 dimensions (`hierarchy`, `typography`, `spacing`, `brand fit`, `readability`, `originality`) 10 criteria mein map kiye gaye; bina `RENDER` run ke sirf `"Spec-approved, render-unverified"` verdict allowed.
6. **A4 Decision Log**: Forced new-decision quota hata kar `"Evaluate at least 3 alternatives; implement only those with demonstrated value... 'Add nothing' is a valid decision"` aur `TK-09` mein Decision Log template joda gaya.
7. **A5 Step Reduction & No-Cut Zone**: Unrealistic step-multiplier targets har jagah se hataye gaye; Class C **No-Cut Zone** (payment, identity/KYC, consent/legal, destructive/irreversible actions, security steps, multi-step comprehension flows) mein user control aur clarity ko tap count se upar rakha gaya.
8. **A6 Verify-First Hindi/Devanagari Rule**: Font ke naam se blanket daava har jagah se hataya gaya; `TK-04` mein 4-step verification procedure (family+version/build glyph coverage, Devanagari fallback in font stack, aur conjuncts/matras/line-height/clipping/mixed-baseline rendering test) lagu kiya gaya.
9. **A7 Evidence Labels & UNVERIFIED Markers**: `VERIFIED-BY-TOOL` (`[RAN]/[USER-SHOWN]`), `FROM-TOOLKIT-DATA` (`[TOOLKIT: file]`), `GENERAL-RECOMMENDATION` (`[GENERAL]/[ASSUMED]`), aur `NOT-TESTED` lagu kiye gaye; tool kit ke heuristic numbers par `UNVERIFIED` lagaya gaya.
10. **A8 Honest Status & Field Test Protocol**: Brain header mein v17/v18 ko `"NOT field-tested on a real PRD"` rakha gaya, XML check ko syntax-only bataya gaya, aur `TK-11` (`tests-gates.md`) mein Field Test Protocol + Log Template joda gaya.
11. **A9 Six-Level Priority Order**: Tamam takraavon ko suljhane ke liye Brain mein ek hi explicit 6-level Priority Order lagu kiya gaya.
12. **B2–B9 Toolkit Capabilities**: `TK-07` mein complete visual token tables with May/May-Not-Use rules aur breakpoints (B2); `TK-08` mein Differentiation Analysis template (B3) aur Anti-Generic 4-layer depth check (B9-B); `TK-11` mein P0–P3 definitions aur max 3-loop test-and-fix protocol (B4), Real-Content Stress Test Matrix (B9-C), Visual Regression & Consistency Matrix (B9-D), aur 9-item Testable Accessibility Checklist (B6); `TK-10` mein 10-item Testable Responsive Checklist (B5); `TK-09` mein 3-list Proof-of-Work Receipt (B9-E).

## v17

Pehli nazar ka "waah" ab spec hai, andaaza nahi. UX, safety, accessibility aur flow ka purana kuch hataya nahi. Naya: (1) VISUAL CRAFT STANDARD section, 13 sutra: Visual Thesis (ek vaakya), Signature Element, hero ko vazan, rang ka anushasan (60-30-10, neutral par brand ka halka rang), depth ka sach, typography, spacing aur alignment, detail jo mehsoos ho, imagery ki art direction, sundarta ka budget, AI-template ki pehchan (anti-generic ledger), sundarta ki seema, aur Visual Quality Scorecard (10 criteria, ank aur saboot); (2) BANK I: 16 direction ke recipe; (3) BANK J: visual tokens aur 14 component ke visual recipe; (4) STEP 5 mein Palette Table, direction ko recipe mein badalna, aur Screen Visual Blueprint; (5) STEP 4 mein visual darja tag; (6) STEP 1.5 mein visual rubric design se pehle; (7) STEP 6 mein Blueprint coverage, hero test, anti-generic aur scorecard ki jaanch; (8) VETO SOOCHI 22 se 26; (9) Output mein Visual Thesis, Palette Table, Visual Blueprint aur Scorecard; (10) PRESENTATION UPGRADES mein chhe hisse.

## v16

UI/UX Pro Max ka nichod, purana kuch hataya nahi: (1) DESIGN INTELLIGENCE ENGINE section; (2) DESIGN KNOWLEDGE BANK, 8 hisse (A se H); (3) STEP 5 mein engine ya bank se direction, font aur dark mode chunne ke niyam; (4) STEP 6 mein Pre-Delivery, icon anushasan aur engine ki imaandaari; (5) VETO SOOCHI 18 se 22; (6) Output mein Design Intelligence Brief, aur PROOF-OF-WORK RECEIPT mein engine, bank ya fallback ka label; (7) ZERO-TRUST mein engine aur dataset ke result bhi data (salaah), hukm nahi; (8) pura prompt skill (ui-design-master) ki tarah package hua.

## v15

Omni-Builder ke protocol se judi nayi parten: (1) SURAKSHA KI ZAMEEN; (2) ZERO-TRUST PADHAI; (3) TEEN RAASTE; (4) STEP 1.5 pehle kasauti likho; (5) STEP 5 mein 7-hisse ka gesture record, extra halatein, WCAG 2.2 ke nuqte, mana wale shabdon ki soochi; (6) STEP 6 mein loop ka rukne ka niyam, high-volume aur ghost user jaanch, jhoote progress ki jaanch; (7) VETO SOOCHI 12 se 18; (8) Output ka order mein Updated PRD ko numbered, MoSCoW aur pass/fail wale requirements, khule sawaal aur PROOF-OF-WORK RECEIPT; (9) platform ke ank ko "point-in-time" maana; (10) paisa wale kaam par server se confirm aur idempotency.

## v14 se v11

- **v14**: SAR; VETO SOOCHI (12 sawaal); Gehraai ki kasauti; Smart Hub ki seema; raftaar ka budget (2.5s, 200ms, 0.1); auto-detect ka seekhne wala loop, screen reader announcement, privacy (DPDP ki bhavna); Hindi line-height; design system ka record; right-sizing.
- **v13**: PRESENTATION UPGRADES audit; STEP 5 (16 directions, hierarchy, spacing, tokens, depth, motion, states, real content, copy, polish); STEP 6 premium checks.
- **v12**: Autonomous CPO + Principal UX Architect role; 7 Lohe ke Niyam; PROACTIVE PRODUCT UPGRADES; Unified Smart Workspace + Consolidation Table; auto-detect aur zero dead-end; platform edge cases aur state transitions.
- **v11**: Khatarnak aur paisa kaam alag kiye; chhote delete par undo aur bade/paisa par confirm; accessibility (48dp, one-hand, label, text).
- **Jaanchi gayi screens (v11 tak)**: chhoti transfer screen, swipe-delete list, account delete/settings, one-hand accessibility.

## Purani Jaanch-Notes (Historical Reference Only — Superseded by v18 Field Test Protocol in `TK-11`)

- **jaanch_status_v17**: v17 ke naye hisse kisi asli PRD par chalaye nahi gaye the; BANK I/J ke ank author ki salaah (`UNVERIFIED`) the. v18 mein over-output ko A1 Task Size Router se aur self-scoring bias ko A3 3-Layer Scorecard se sudhara gaya.
- **jaanch_status_v16**: v16 mein engine data aur scripts validate hue the. (Note: v16 mein Hindi font coverage par snapshot ke aadhar par blanket baat likhi gayi thi, jise v18 mein Defect A6 ke verify-first Devanagari procedure se poori tarah badal diya gaya hai.)
- **jaanch_status_v15 & v14**: v12 se v15 ke hisse padhkar aur checklist se parkhe gaye the; asli PRD field test ab `tests-gates.md` (`TK-11` Section F) ke Field Test Protocol se log kiya jayega.
