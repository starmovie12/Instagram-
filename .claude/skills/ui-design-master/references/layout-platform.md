# TK-10: Layout, Platform, Responsive Checklist aur Gesture Specs

Capability: `layout-platform` (`TK-10`). Dimag ke `NIYAM 1`, `STEP 2`, `STEP 4` aur `STEP 5.7` se.
**Evidence Label**: Yahan ke spatial percentages (`70%/30%`, `40%/30%/30%`) aur breakpoint numbers **`UNVERIFIED` (author heuristic / reference guidelines)** hain, andha kanoon nahi; screen ke asli kaam ke hisaab se Exception Note ke saath badle ja sakte hain.

## A. Spatial Layout Checklist (STEP 4)

- **Angoothe ka daayra (Thumb Zone)**: Phone par neeche aur beech sabse aasan, upar ke kone sabse mushkil. Baar-baar (`A-darja`) wale kaam neeche/beech mein, kabhi-kabhi (`B/C-darja`) wale upar ya menu/sheet mein.
- **Saath-saath ke kaam**: Related controls paas-paas (`8–12px`), alag hisse door (`24–32px`); kaam ka natural order screen par bhi wahi. Upar, beech aur neeche ke hisson ka visual weight santulit rahe (L28).
- **Bina wajah ke Cards/Boxes mana (L24, L25, L30)**: Screen ko aadat ke taur par faltu cards, boxes aur borders mein mat baanto; jahan spacing (`whitespace`) aur typography se saaf batwara ho sake wahan card mat lagao. Single-column layout ko nakli complexity ki jagah strong composition aur typography se nikharo.
- **Poori-screen content (Map, Camera, Video)**: Controls chhote, floating, neeche ke `25–30%` (`UNVERIFIED`) daayre mein clustered; mukhya button tiki, baaki auto-hide aur tap par wapas.
- **Keyboard aur Lamba Form / Checkout**: Keyboard khulne par active field aur primary CTA keyboard ke upar dikhein; lambe checkout/form mein summary aur primary CTA neeche sticky rahein.
- **Data aur Numbers**: Sabse zaroori 1 number sabse bada (`Number-hero`, `tabular-nums`) aur context ke saath; sabhi KPI cards ka andha `2x2` barabar grid mat banao.
- **List, Feed aur Search Filters**: Filters compact (chips ya bottom sheet) taaki pehla result top `35–40%` (`UNVERIFIED`) mein dikhe; chip collection pehle wrap ho, label baad mein chhota ho.
- **Smart Workspace Batwara (`UNVERIFIED` heuristic)**: Input/drop zone + pehchan tag `~40%`, inline preview/result `~30%`, neeche pills (max `5`, usse zyada par `"Aur"` sheet) + primary CTA `~30%` (jod `100%`).

## B. Platform-Wise Edge Cases (Har Screen ke Liye — Tier 2/M aur Tier 3/L)

Har screen par in 7 halaton ke liye 1 line (`"kya badalta hai"` ya `"kuch nahi badalta, kyun"`):
1. **Android phone**: Predictive back gesture, share-sheet target, gesture navigation bar clearance.
2. **iPhone (iOS)**: Left-edge swipe-back, Dynamic Island / notch safe area, clipboard paste permission prompt, share-sheet.
3. **Tablet (Portrait + Landscape)**: Split list-detail ya 2-column composition, readable line measure (`60–75ch` max, full-bleed text nahi).
4. **Desktop / Web**: `Ctrl/Cmd+V` global paste, drag-and-drop zone, keyboard shortcuts, hover states, resizable window reflow.
5. **Kamzor Network / Offline**: Queue-and-sync behaviour, content-shaped skeleton (`>1s`), non-blocking offline banner.
6. **Bada System Font (200% / Dynamic Type)**: Text wrap without clipping, button height expands, touch target `>=48dp` intact.
7. **App Dobara Khulna (State Resume)**: Pichli khuli screen, scroll position, unsaved draft ya pichla result wapas milna.

## C. Halat Badalne ka Naksha (State Transition Map — Tier 2/M aur Tier 3/L)

Format: `Halat A → Trigger → Halat B (Duration ms, Visual Feedback, Screen-Reader Announcement, Exit/Undo Path)`.
Standard chain: `Khaali (Empty) → Input Aaya → Auto-Pehchan (`200ms` tag + `aria-live`) → Preview/Ready → Processing (Skeleton/Progress) → Safal (Checkmark + Undo/Next) | Galti (Inline Error + 1-Tap Fix) | Offline (Queued + Auto-Retry)`. Koi bhi halat bina bahar nikalne ke raaste (`>=48dp`) ke nahi.

## D. Testable Responsive Checklist (B5 — 10 Items, PASS / FAIL / SPEC-ONLY / NOT-TESTED)

Sirf layout ko chhota-bada scale karna mana hai (L51, L52). Har chaudai ki apni composition honi chahiye:

| # | Responsive Check (B5) | Rule & Condition | Status (`PASS / FAIL / SPEC-ONLY / NOT-TESTED`) |
|---|---|---|---|
| 1 | **Breakpoints by Content Width** | Breakpoints device ke naam se nahi, content kab toot-ta hai usse tay hon (baseline `375px`, `768px`, `1024px`, `1440px` — `UNVERIFIED` heuristic, poori app mein ek hi set). | |
| 2 | **Column-Change Conditions** | Columns tab badlein jab reading line `35–60ch` (phone) ya `60–75ch` (desktop) se bahar jaye, ya card Apne minimum content width (bina naam/ank kate) se chhota hone lage. | |
| 3 | **Navigation Form per Size** | `<768px`: Bottom nav (max 5, icon+label) ya Top bar; `768–1023px`: Navigation rail; `>=1024px`: Sidebar. Ek hi hierarchy level par Tab + Rail + Sidebar mix nahi. | |
| 4 | **Sticky & Quick-Return Elements** | Persistent items (input box, primary CTA) tiki rahein; chrome (top bar, tabs, bottom nav) scroll down par slide-out aur `10–20px` scroll up par slide-in (`Quick Return`). | |
| 5 | **Overflow Behaviour** | Viewport width par `0` horizontal page scroll; chaude (wide) tables/charts ke liye dedicated scroll container ya card reflow; filter chips wrap before shrinking. | |
| 6 | **Long Text & Unbroken Strings** | Text katne ke bajaye wrap ho; clamp zaroori ho to `2` lines + ellipsis + tooltip/expand; lambe URL/ID par `overflow-wrap: anywhere` (normal prose par `break-all` nahi). | |
| 7 | **Keyboard Open Behaviour** | Mobile keyboard khulne par bottom nav collapse ho, aur active input + primary CTA keyboard ke bilkul upar dikhte aur pahunch mein rahein. | |
| 8 | **Safe Areas & Landscape Insets** | Top notch/status bar, bottom home indicator, aur landscape side safe areas par content ya tappable button kabhi na chhupe; gutters breakpoint ke saath badhein (`16/24/32px`). | |
| 9 | **Text Scaling (Dynamic Type)** | System font sabse bada (`200%`) karne par layout na toote, buttons/chips ki unchai badh sake, aur typography/spacing/cards ka santulan bana rahe (L53, L54). | |
| 10 | **Primary-Action Reachability** | Keyboard khule, text bada ho, safe area lage ya lamba scroll ho—mukhya action (`Primary CTA`) hamesha asani se pahunch mein rahe (L54, L55). | |

## E. Component States (9+5) aur 7-Part Gesture Record (STEP 5.7)

1. **9 Mandatory States**: `default`, `hover` (desktop), `pressed` (`80–150ms` visual response, no layout jitter), `focus` (`2px` ring + `2px` offset), `disabled` (`0.38–0.5` opacity + why disabled), `loading` (content-shaped skeleton or locked-width button spinner), `success`, `error` (inline cause + 1-tap fix), `offline` (calm banner + queue).
2. **5 Contextual States (jahan lagu ho)**: `long-press` (ms threshold + preview/menu), `drag` (lift/move/drop visual + single-tap/button alternative), `warning` (pre-error gentle cue), `throttled` (rapid-tap lock + calm message), `stale` ("Last updated X ago" + 1-tap refresh).
3. **7-Part Gesture Record** (har tap, long-press, swipe, drag ke liye):
   `(1) Trigger | (2) Pre-condition | (3) Immediate feedback (ms + haptic) | (4) Continuous state | (5) Outcome | (6) Undo / Cancel path | (7) Accessible alternative (keyboard + screen reader + single-pointer button)`.

## F. Proactive Feature-Inspiration Checklist (NIYAM 1 Helper)

_Rule (A4)_: Sirf wahi chuno jiska user aur screen ke liye **saabit faayda (demonstrated value)** ho; `"Add nothing"` bilkul sahi faisla hai.
- Smart auto-detect (input type, app source, format, script/language) + 1-tap override pill
- Instant inline preview before committing action
- 1-tap Undo / retry / inline recovery
- Permission-respecting clipboard sensing with prominent thumb-zone Paste fallback
- Remembering last-used mode/preference & recent history in bottom sheet
- OS Share-sheet / deep-link direct entry
- Offline queue & automatic completion on reconnect
- Batch processing when users repeat the same single-item task
- Desktop keyboard shortcuts (`Cmd/Ctrl+K`, `Cmd/Ctrl+V`) & drag-and-drop target
