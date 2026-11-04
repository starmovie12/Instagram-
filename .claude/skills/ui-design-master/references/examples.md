# TK-15: Misaalein (Soch, Tier 0/XS, Toolkit Gate aur Evidence ke Namoone)

Capability: `examples` (`TK-15`). Ye namoone sirf soch aur format dikhane ke liye hain: kisi doosri screen par copy mat karo. Har screen ke liye us screen ke user aur kaam ko dekhkar apna faisla lo.

## 1. Jagah Pehle, Sajaavat Baad Mein

- **Burj Khalifa**: Duniya ki sabse oonchi imaarat gaon ke jungle mein bana di, to bekaar. Galat jagah par sabse sundar button bhi jungle mein khadi imaarat hai.
- **Login button**: Aalsi AI use beech mein chhota bana dega. Sahi soch: Login sabse zaroori kaam hai, to button neeche (angoothe ki pahunch wahin aasan), poori chaudai mein (dono haath se dabana aasan), medium unchai ka (`48–56px`), us par `"Login"` likha.

## 2. Aalsi vs Samajhdaar (Chat App aur Instagram Smart Workspace)

### Chat App (`PRD: "Home par 4 tarah ki chat honi chahiye"`)
- **Aalsi**: Neeche chat ki list, tap par naya page.
- **Samajhdaar**: User ka asli kaam chat padhna aur message bhejna, list dekhna nahi. Home khud chat ho. Upar 4 tab, ek tap mein badlaav; bahut options wale tab par bottom sheet. Upar lagbhag `30%`, chat `70%`, neeche message box. Dobara khulne par pichli chat khuli mile; scroll par tab chhup jaayein (`Quick Return`). Natija: `0` ya `1` tap mein chat saamne.

### Instagram Link Tool (`PRD: "Reel, Photo, Story aur Profile ke liye alag-alag tool chahiye"`)
- **Aalsi**: 4 alag page ya tab banaye, ya ek page par bas 4 naam likh diye (`4 steps`). Ye meri baat ko sirf repeat karna hai.
- **Samajhdaar (Unified Smart Workspace)**: App khulte hi clipboard mein Instagram link ho to permission ke saath utha le (ijazat na mile to neeche angoothe ke daayre mein bada `"Paste karo"` button). Link aate hi pehchan tag aaye (`"Reel pehchani gayi"`) aur turant inline preview dikhe. Neeche mukhya button, uske upar 4 pills (`Reel, Photo, Story, Profile`): Auto ne jo pehchani wo pehle se chuni hui, galat nikli to 1 tap se badlo. Result usi screen par.
- **Zero Dead-End**: Galat link par `"Ye Instagram ka link nahi lag raha. Dobara paste karein?"` + 1-tap Paste button.
- **Missing Genius Features (Demonstrated Value — A4)**: Batch paste; pichla result bottom sheet mein; OS share-sheet entry; offline queue.
- **Teen Raaste**: Literal (`4 tabs, 4 steps`) vs Visionary (`Unified Smart Workspace, 1 ya 0 step`) vs Paradigm (`Share-sheet background notification, 0 step par preview/override nahi`). Chuna: Visionary (1 step + 1-tap override control).
- **Visual Spec Namoona (`Clinical Void`, `TK-07` & `TK-08`)**:
  - **Differentiation Analysis (B3)**: Category = Media Utility; Audience = Fast mobile creators; Personality = *shaant, tez, bharosemand*; Competitor norm = Cluttered ad-heavy multi-tab downloader; Chosen Signature = `2px` accent-border pehchan tag + tabular numerals; Avoided = Neon gradients, separate tool pages, blocking spinners.
  - **Visual Thesis**: *"Ye shaant, tez aur bharosemand dikhti hai, kyunki user ko bina jhanjhat turant kaam chahiye; iski pehchan pehchan tag ka patla accent kinara aur tabular ank hai."*
  - **Scorecard Verdict (A3)**: `SPEC Layer: 42/50 (SPEC-PASS) | RENDER Layer: NOT-TESTED | INTERACT Layer: NOT-TESTED → Verdict: "Spec-approved, render-unverified"`.

## 3. v18 rev 2/3 ke Namoone (A1, Section 3, A3, A7)

### Namoona 1: Tier 0 Micro (`XS`) Request (A1 — Only the Change + One-Line Evidence Label)

Request: *"Button par 'Submit' likha hai, use badal do."*

Jawab (poora — Tier 0 mein koi Differentiation Analysis, Blueprint, Scorecard ya 3-list Receipt nahi aata):

> **Size: XS (Tier 0 Micro)**, kyunki sirf ek button ka copy/label badal raha hai, koi flow, layout ya safety/payment step nahi chhua.
> **Badlaav**: `"Submit"` (copy ledger mein mana shabd) ki jagah kriya-aadharit label **`"Bhejo"`** (English UI ho to **`"Send"`**); button ke existing tokens (`Body-strong 16/600`, `text-on-primary`, height `>=48dp`) jyon ke tyon rahenge.
> **Evidence Label**: `FROM-TOOLKIT-DATA [TOOLKIT: copy-polish.md]` — `"Submit"` removed per TK-12 copy ledger; live Hindi/Hinglish text wrapping aur RENDER `NOT-TESTED`.

### Namoona 2: Toolkit Gate — `MISSING` / `PARTIAL` par Rukna aur `"Resuming at step X"` (Section 3)

Jab task Tier 2 (`M`) ho aur Toolkit uplabdh na ho:

> **Size: M (Tier 2 Medium)**, kyunki ek poori nayi screen design karni hai.
> *[Step 0 se Step 4 tak ka saara Toolkit-independent kaam: Suraksha, Upgrades Audit, Teen Raaste, STEP 1.5 Kasauti, aur STEP 4 Spatial Layout isi turn mein poora likha gaya...]*
>
> **Toolkit Gate (`MISSING`)**: Ab mujhe `STEP 5 (Visual Design)` aur `STEP 6 (Scorecard & Gates)` ke liye `ui-design-master` (`v18`) Toolkit ke in sections ki zaroorat hai:
> - `TK-02 (style-matrix)` & `TK-07 (recipes)`: Aesthetic Direction, visual tokens aur Screen Visual Blueprint banane ke liye.
> - `TK-08 (visual-craft)`: Differentiation Analysis (B3) aur archetype apwad ke liye.
> - `TK-09 (scorecard)` & `TK-11 (tests-gates)`: 3-Layer Scorecard, Stress Matrix aur Accessibility Checklist chalane ke liye.
> Kripya `ui-design-master.skill` (ya upar ki files) attach/paste karein; milte hi main seedha `STEP 5.1` se aage badhunga. Agar bina Toolkit ke chalna hai to likhein: `"bina toolkit chalo"`.
> **CHECKPOINT**: `Ho chuka: Tier M routing, Upgrades, Teen Raaste, STEP 1.5 Kasauti, STEP 4 Layout | Tay faisle: Archetype = Showcase, Platform = Phone, Candidate Direction = Clinical Void | Agla step: STEP 5.1 (Archetype, Differentiation Analysis & Direction)`.

Jab user Toolkit de de, to agla jawab seedha is line se shuru hoga:
> **`Resuming at step STEP 5.1`** (`TK-00 INDEX` aur `toolkit_version: v18` verified — `TOOLKIT_PRESENT`). *[Seedha STEP 5 se Receipt tak poora kaam, bina STEP 0–4 dobara likhe.]*

### Namoona 3: Honest Evidence Labels aur Verdict Wording (A3, A7)

- **Sahi (`VERIFIED-BY-TOOL`)**: `"Engine style search: VERIFIED-BY-TOOL [RAN: python3 scripts/search.py 'fintech payments trust' --design-system -> top match Corporate Apex, checked against TK-02 avoid list]."`
- **Sahi (`VERIFIED-BY-TOOL`)**: `"Primary text contrast: 17.40:1 — VERIFIED-BY-TOOL [RAN: python3 scripts/contrast_check.py '#1A1A1A' '#FFFFFF']."`
- **Sahi (`FROM-TOOLKIT-DATA`)**: `"Type scale aur card padding: FROM-TOOLKIT-DATA [TOOLKIT: visual-tokens-recipes.md, UNVERIFIED author heuristic]."`
- **Sahi (`GENERAL-RECOMMENDATION`)**: `"Competitor benchmark (Linear/Stripe): GENERAL-RECOMMENDATION [GENERAL — unverified recall, not browsed in this session]."`
- **Sahi Verdict (jab Render nahi chala)**: `"SPEC-PASS (43/50); RENDER: NOT-TESTED; INTERACT: NOT-TESTED -> Verdict: Spec-approved, render-unverified."`
- **Galat (Forbidden)**: Bina command chalaye `"engine se verified"` likhna, ya bina screenshot/render dekhe `"Design passed / approved"` likhna.
