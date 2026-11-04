# TK-04 (Part 1): Typography ke Niyam aur Hindi / Devanagari Verification Procedure

Capability: `typography` (`TK-04`, Part 1 of 2; Part 2 `typography-pairings-74.md`).
Pairing mizaaj aur product se chuno; adhiktam 2 family. `typography-pairings-74.md` ki 74 pairings mukhya taur par Latin text ke liye hain. Hindi, Hinglish ya Devanagari UI ke liye neeche ka **4-Step Devanagari Verification Procedure (A6)** lagana zaroori hai.

## 1. HINDI / DEVANAGARI Verification Procedure (A6 — Verify-First, Never Decide by Font Name)

**Sakht Niyam (A6)**: Kisi bhi font ke sirf naam se ye faisla mat karo ki usmein Hindi/Devanagari glyphs hain ya nahi (blanket daave mana hain, kyunki glyph coverage font ke family, version, foundry build aur self-hosted vs CDN subset par badalti hai). Hamesha ye 4 steps chalao:

1. **Step 1 — Verify Actual Devanagari Glyph Coverage (Family + Version/Build)**:
   - Bundled Google Fonts snapshot mein subset check karne ke liye script chalao:
     `python3 scripts/check_devanagari.py "<FontFamily>"` (`VERIFIED-BY-TOOL [RAN]`).
   - Agar custom/local font build hai, to uske font file/metadata mein Unicode block `U+0900–U+097F` (aur `U+A8E0–U+A8FF`) ke glyphs aur OpenType `deva`/`dev2` shaping tables check karo.
2. **Step 2 — Specify Explicit Devanagari Fallback in the Font Stack**:
   - Agar chosen Latin font mein Devanagari coverage missing hai, partial hai, ya verify nahi ho saki (`FROM-TOOLKIT-DATA` / `NOT-TESTED`), to use saaf report karo aur font-family stack mein ek upyukt Devanagari companion font jodo:
     `font-family: '<Latin-Font>', '<Devanagari-Companion-Font>', system-ui, sans-serif;`
3. **Step 3 — Test Actual Rendering (5 Devanagari Checks)**:
   - Asli Hindi aur mishrit (Latin + Devanagari) strings par ye 5 cheezein test karo (`RENDER` star par):
     - **(a) Conjuncts (`sanyukt akshar`)**: Jaise `क्ष`, `त्र`, `ज्ञ`, `श्र`, `द्ध`, `प्र`, `क्र` sahi judte hain ya toot-te/halant dikhate hain.
     - **(b) Matras (vowel signs)**: Upar (`ि`, `ी`, `े`, `ै`, `ो`, `ौ`, `ं`, `ँ`) aur neeche (`ु`, `ू`, `ृ`) ki matrayein akshar se sahi judti hain aur aapas mein takrati nahi.
     - **(c) Line-height**: Devanagari shirorekha aur upar/neeche ki matraon ke liye body/label line-height `1.5 se 1.6` (`UNVERIFIED` heuristic) aur Display/Title line-height `>=1.3` rakho.
     - **(d) Vertical Clipping**: Buttons (`48–56px`), chips/pills (`28–32px` visual), aur inputs ke andar matra ka upari ya nichla sira container ya `overflow: hidden` se kat-ta (clip hota) nahi hai.
     - **(e) Mixed Latin + Devanagari Baseline & Scale**: Ek hi line mein English + Hindi (`"₹1,250 भेजे गए"`, `"Reel पहचानी गई"`) likhne par dono fonts ki visual x-height, stroke weight aur baseline barabar dikhti hai.
4. **Step 4 — Honest Evidence Label**:
   - Agar `check_devanagari.py` aur live render dono chale to `VERIFIED-BY-TOOL [RAN]`; agar sirf snapshot table dekhi aur render nahi chala to coverage `FROM-TOOLKIT-DATA [TOOLKIT: typography-rules.md]` aur rendering `NOT-TESTED` likho.

### Devanagari Companion Fonts (Snapshot mein `devanagari` subset listed hai)

- **UI & Neutral Sans**: `Noto Sans Devanagari` (sabse surakshit, poora weight ramp), `Hind`, `Mukta`, `Poppins` (Latin + Devanagari ek hi family mein), `Anek Devanagari`, `Yantramanav`.
- **Enterprise, Finance & Technical**: `IBM Plex Sans Devanagari`, `Noto Sans`.
- **Playful, Kids & Friendly**: `Baloo 2`.
- **Bold Tech, HUD & Condensed**: `Rajdhani`, `Teko`.
- **Editorial, Literary & Serif**: `Noto Serif Devanagari`, `Tiro Devanagari Hindi`, `Eczar`, `Martel`, `Halant`.
- **Handwritten / Display**: `Kalam` (handwritten), `Yatra One` (sirf bade display headings).

### Bundled Snapshot Lookup Table (`data/google-fonts.csv` Subsets column — Point-in-Time Reference)

_Note_: Ye table sirf is bundled CSV snapshot mein kya listed hai wo dikhati hai (`FROM-TOOLKIT-DATA`). Naye font version ya alag foundry build ke liye Step 1–3 zaroor chalao.

| Family | Snapshot ke Subsets | Devanagari Subset Listed in Snapshot? |
|---|---|---|
| Inter | cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| Roboto | cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, math, symbols, vietnamese | nahi (add Devanagari fallback in stack) |
| Open Sans | cyrillic, cyrillic-ext, greek, greek-ext, hebrew, latin, latin-ext, math, symbols, vietnamese | nahi (add Devanagari fallback in stack) |
| Plus Jakarta Sans | cyrillic-ext, latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| DM Sans | latin, latin-ext | nahi (add Devanagari fallback in stack) |
| Space Grotesk | latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| Lexend | latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| Figtree | latin, latin-ext | nahi (add Devanagari fallback in stack) |
| Outfit | latin, latin-ext | nahi (add Devanagari fallback in stack) |
| Source Sans 3 | cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| Nunito | cyrillic, cyrillic-ext, latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| Manrope | cyrillic, cyrillic-ext, greek, latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| Lora / Raleway / Playfair Display | cyrillic, latin, latin-ext, vietnamese | nahi (add Devanagari fallback in stack) |
| IBM Plex Sans | cyrillic, cyrillic-ext, greek, latin, latin-ext, vietnamese | nahi (use `IBM Plex Sans Devanagari` in stack) |
| Atkinson Hyperlegible | latin, latin-ext | nahi (add Devanagari fallback in stack) |
| Poppins | devanagari, latin, latin-ext | haan |
| Noto Sans / Noto Sans Devanagari | devanagari, latin, latin-ext (+ multi-script) | haan |
| Hind / Mukta / Baloo 2 | devanagari, latin, latin-ext | haan |
| IBM Plex Sans Devanagari | cyrillic-ext, devanagari, latin, latin-ext | haan |
| Rajdhani / Teko / Yantramanav | devanagari, latin, latin-ext | haan |
| Eczar / Martel / Halant / Tiro Devanagari Hindi / Noto Serif Devanagari | devanagari, latin, latin-ext | haan |
| Kalam / Yatra One / Anek Devanagari | devanagari, latin, latin-ext | haan |

## 2. General Typography Rules (`UNVERIFIED` scale heuristics; `>=16px` mobile body floor)

- Body text mobile par kam se kam `16px` (iOS auto-zoom rokne aur aaram se padhne ke liye); koi bhi text `12px` se chhota nahi.
- Scale aur may/may-not-use rules `visual-tokens-recipes.md` (`TK-07`) mein hain (`12, 14, 16, 18, 24, 34, 40–56`).
- Weight hierarchy: Heading `600–700`, Body `400`, Label `500`, Button `600`.
- Reading measure: Mobile par `35–60` akshar, desktop par `60–75` akshar prati line.
- Data columns, prices, amounts aur timers mein hamesha `font-variant-numeric: tabular-nums`.
- Devanagari par negative letter-spacing (tight tracking), `UPPERCASE` transform aur `italic` mat lagao.
- `font-display: swap` ya `optional` use karo, aur sirf critical weights preload karo.