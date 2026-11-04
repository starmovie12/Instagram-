# TK-07 (Part 1): Direction Recipes (16 Aesthetic Directions ko Spec mein Badlo)

Capability: `recipes` (`TK-07`, Part 1 of 2; Part 2 `visual-tokens-recipes.md`).
**Evidence Label**: `FROM-TOOLKIT-DATA` — Yahan ke 16 direction recipes, Design Dials presets aur motion ms ranges **`UNVERIFIED` (author heuristic / reference starting points, not independently verified from dataset)** hain; point-in-time maano aur product ke hisaab se verify/customize karo.

Direction ka naam mizaaj batata hai; recipe usse banata hai. Chuna hua direction (STEP 5.2–5.3) yahan ke recipe se milakar spec banao, phir product ke hisaab se **kam se kam 2 cheezein badlo aur wajah likho** (nahi to recipe ki andhi nakal ban jayegi). Type pairings Latin ke liye hain; Hindi ya Hinglish par `typography-rules.md` (`TK-04`) ka 4-step Devanagari verification procedure lagao. Rang "seed" ki tarah likhe hain (lightness aur hue ka daayra); asli hex Palette Table mein banao aur `scripts/contrast_check.py` se contrast naapo. Har recipe ke `"mat lagao"` ko `style-matrix.md` (`TK-02`) ke `"mat lagao"` ke saath milakar dekho. Ek product mein ek hi direction, do ka mel nahi.

## 1. Sixteen Aesthetic Direction Recipes (`UNVERIFIED` heuristics)

### Luxury Obsidian
- rang = base lightness 4 se 8% (shuddh kaala nahi), brand hue ki taraf halka jhuka; accent sona ya champagne (hue 38 se 46, saturation 45 se 60%), sirf CTA, ek patli rekha aur zaroori ank par
- type = Luxury Serif ya Classic Elegant; display tracking 0 se -1%, chhote uppercase label +8% (Devanagari par tracking 0, no uppercase)
- shape aur depth = radius 4, 8, 12; 1px sone ka 20% alpha border; shadow kam, glow nahi
- signature = har section ke upar 1px ki sone ki rekha
- imagery = gehri, kam roshni ki photo ya sirf typography
- mat lagao = bachhon ke ya roz ke tez kaam wale tools

### High-Energy HUD
- rang = base lightness 6 se 10%; neon accent (hue 150 se 190 ya 300 se 330, saturation 85% se upar) sirf data aur live sanket par
- type = Gaming Bold ya Dashboard Data
- shape aur depth = radius 0 se 4, kate hue kone, 1px accent-alpha border, halka glow
- signature = kone par bracket ya scan-segment nishan
- imagery = line-art, grid, telemetry jaisi graphic
- mat lagao = bharosa-pradhan finance ya health, aur jahan neon ka contrast 4.5:1 na ban sake

### Clinical Void
- rang = base safed ke kareeb (lightness 98 se 100%) ya 7% gehra; ek hi accent (saturation 70 se 85%), screen ke 5% se kam hisse par
- type = Minimal Swiss ya Medical Clean
- shape aur depth = radius 8, 12; 1px hairline; shadow nahi ya shadow-1
- signature = abhi ke kaam ke neeche 2px ka accent underline, aur ank tabular
- imagery = koi nahi, sirf patle line icon
- mat lagao = bachhon ya khilandade brand, jahan bharose se zyada bhavna chahiye

### Editorial Grid
- rang = warm off-white (hue 35 se 50, lightness 96 se 98%) ya ink-gehra; ek accent (lal ya gehra neela)
- type = News Editorial ya Editorial Classic; display phone par 34 se 44px, desktop par 48 se 72px, tracking -2%
- shape aur depth = radius 0 se 4, patli 1px kaali rules se hisse, shadow nahi
- signature = har hisse ke upar rule ke saath chhota uppercase label, aur bade drop-number
- imagery = crop ki hui grayscale ya duotone photo, caption ke saath
- mat lagao = ghane data tools, aur chhoti screen par bahut lambi headline

### Neo-Brutalist
- rang = flat base (safed, cream ya ek chamkila rang), 2 se 3 chamkile accent jinka kaam tay ho
- type = Bold Statement ya mono; uppercase label
- shape aur depth = 2 se 3px kaala border, hard shadow (offset 4 se 6px, blur 0, kaala), radius 0
- signature = hard shadow jo dabane par 0 ho jaye
- imagery = mote outline sticker, kachche collage
- mat lagao = finance, health, kamzor ya bujurg users ka tool

### Liquid Glass
- rang = rangeen ya photo background par translucent parat; accent roshni jaisa halka
- type = Premium Sans (DM Sans)
- shape aur depth = radius 16 se 28, glass recipe (`visual-tokens-recipes.md`), 1px safed 20 se 30% border
- signature = kinare par chamakta specular highlight, sirf ek jagah
- imagery = dhundhli rangeen roshni, blurred photo
- mat lagao = low-contrast background, kamzor phone, lamba text, accessibility-critical screen

### Retro Terminal
- rang = base lightness 5 se 8% (hara-kaala ya amber-kaala), ek phosphor accent (hara ya amber)
- type = Developer Mono (JetBrains Mono, Fira Code)
- shape aur depth = radius 0, 1px accent-alpha border, halka text glow
- signature = block cursor jo focus dikhaye (reduced-motion par sthir), scan line 2 se 4% alpha
- imagery = ASCII ya pixel graphic
- mat lagao = aam consumer, bachhe, bahut Hindi text (mono mein Devanagari mushkil)

### Organic Bloom
- rang = warm off-white, sage, clay ya sand; accent dabba hua (saturation 30 se 45%)
- type = Wellness Calm ya Soft Rounded
- shape aur depth = radius 16, 24, 32; bahut naram lambi shadow (blur 32 se 48px, alpha 6 se 10%)
- signature = ek hi aakaar ka curved divider ya blob
- imagery = haath ki bani illustration, prakritik texture
- mat lagao = ghana data, tez ops, bade paise ka kaam

### Corporate Apex
- rang = safed aur thanda grey; accent gehra neela (hue 215 se 230, saturation 60 se 80%, lightness 35 se 45%)
- type = Financial Trust ya Corporate Trust
- shape aur depth = radius 4, 8, 12; 1px border aur shadow-1; sateek 12-column grid
- signature = sankhya aur table ki sateek alignment, aur chuni hui card ke upar 2px accent kinara
- imagery = data-graphic, patli line illustration
- mat lagao = creative portfolio, khilandade brand

### Spatial OS
- rang = gradient ya blurred wallpaper par 3 se 4 parat; accent roshni jaisa
- type = Premium Sans ya Geometric Modern
- shape aur depth = radius 20 se 28, shadow-3, frosted panel
- signature = parat ka halka parallax (2 se 6px) hover ya tilt par
- imagery = 3D ya depth wali graphic
- mat lagao = kamzor phone, lamba text, accessibility-critical screen

### Maximalist Fever
- rang = 3 se 4 bhaari rang, gehra contrast
- type = Bold Statement ya Playful Creative, bade display
- shape aur depth = mile-jule radius, sticker aur pattern, parat dar parat
- signature = ek bada sticker ya pattern jo har screen par ek jagah aaye
- imagery = kolaaj, pattern, bold illustration
- mat lagao = tool, finance, health aur jahan bharosa ya raftaar chahiye; phir bhi ek screen par ek hi hero

### Void Minimal
- rang = ek surface, ek rang, accent sirf ek jagah
- type = Minimal Swiss ya Premium Sans (DM Sans)
- shape aur depth = radius 12, koi border ya shadow nahi (alag karne ka kaam spacing karti hai)
- signature = bahut bada khaali jagah aur ek bada ank ya shabd
- imagery = koi nahi
- mat lagao = feature-bhare tools jahan options dikhne chahiye, aur jahan onboarding samjhana ho

### Glass Island
- rang = halka ya gehra base, ek accent
- type = Premium Sans
- shape aur depth = floating nav kinare se 12 se 16px door, radius poora gol ya 28, glass recipe
- signature = floating pill jo scroll par sikud jaye (Quick Return se mel)
- imagery = saaf photo ya gradient background
- mat lagao = low-end phone, desktop par lamba text

### Cyber Sovereign
- rang = base lightness 5 se 9%, electric accent (hue 260 se 290 ya 170 se 190), mono ank
- type = Dashboard Data ya Crypto/Web3
- shape aur depth = 1px accent-alpha border, radius 4 se 8, sanyamit glow
- signature = mono ank ke saath pulse dot (live halat)
- imagery = grid, line chart, data texture
- mat lagao = aam logon ka bharosa wala finance, bachhe, accessibility-critical screen

### Aurora Drift
- rang = 2 se 3 rang ka blurred gradient (hue ka farak 40 se 80), sirf hero background mein; text hamesha solid surface ya scrim par
- type = Geometric Modern
- shape aur depth = radius 16 se 24, naram shadow, grain 2 se 3%
- signature = dheere behta ek gradient, sirf hero ke peeche, reduced-motion par sthir
- imagery = abstract gradient, koi stock photo nahi
- mat lagao = ghana data, kamzor phone

### Kinetic Futurism
- rang = ucch contrast base aur ek electric accent
- type = Bold Statement ya Tech Startup; display desktop par 56 se 96px
- shape aur depth = radius 0 se 8, tez rekhayein
- signature = scroll par shape badalti bold headline (reduced-motion par sthir)
- imagery = bade type, geometric shape
- mat lagao = stable layout wale tools, bachhe, kamzor phone

## 2. Design Dials ke Maane aur Presets (`UNVERIFIED` heuristics)

Dials `1 se 10`; user ki baat mein na ho to product dekhkar khud chuno aur ek line mein likho.

- **variance**: `1 se 3` centered aur minimal; `4 se 7` balanced aur modern; `8 se 10` bold aur asymmetric.
- **motion**: `1 se 3` halki micro-interaction; `4 se 7` standard scroll aur stagger; `8 se 10` bhaari choreography.
- **density**: `1 se 3` khuli jagah (spacing `24 se 96px`); `4 se 7` standard (`16 se 64px`); `8 se 10` ghana dashboard (`8 se 32px`).
- **Aam salaah (`UNVERIFIED` author heuristic)**: bharose wala fintech tool `variance 3, motion 3, density 5`; ops dashboard `variance 3, motion 2, density 8`; creative portfolio `variance 8, motion 8, density 3`.
- Dials Aesthetic Direction aur motion ms ko bandhte hain, unse takrate nahi.

## 3. Direction ke Mizaaj aur Motion ka Samay (`UNVERIFIED` heuristics — B8 Scaled by Distance, Size & Importance)

_Rule (B8)_: Neeche ke ms ranges har direction ka **signature/hero motion envelope** dikhate hain; ek product ke andar sabhi interactions ek hi uniform duration ke **nahi** hote—chhota press (`80–120ms`), standard transition (`150–250ms`), sheet/modal (`250–380ms`) aur hero reveal (`350–700ms`) distance, element size aur task importance ke hisaab se scale hote hain.

- Luxury Obsidian: sabse gehri surface, sone jaisa accent; hero motion `400 se 700ms`
- High-Energy HUD: tez neon, dense, kinetic; snap motion `60 se 120ms`
- Clinical Void: lagbhag safed, sirf ek brand accent, koi sajaavat nahi; motion `0 se 80ms`
- Editorial Grid: asymmetric, bada display text, kitabi shaan; slide reveal `250 se 400ms`
- Neo-Brutalist: kachche mote border, kadak, ladaku; abrupt badlaav, bina easing
- Liquid Glass: gehri blur ki parten, translucency, depth; float rise `350 se 500ms`
- Retro Terminal: scan line, phosphor glow, monospace; flicker `50 se 200ms`
- Organic Bloom: naram radius, prakritik, saans lene wali jagah; gentle spring `300 se 700ms`
- Corporate Apex: sateek grid, bharosemand, adhikaar wala; standard ease `200 se 300ms`
- Spatial OS: depth ki parten, frosted glass, 3D ka ehsaas; physics spring `400ms`
- Maximalist Fever: parat dar parat, bheed-bhari sundarta; restrained to Restraint Budget unless explicitly overridden
- Void Minimal: ek surface, ek rang, ek typeface; jab tak zaroori na ho kuch nahi hilta
- Glass Island: floating frosted navigation, premium mobile; spring overshoot `350ms`
- Cyber Sovereign: gehra base, electric accent, mono ank; sharp pulse `120 se 250ms`
- Aurora Drift: naram gradient dhulaai, roshni jaisi gehraai; dheema drift `500 se 900ms`
- Kinetic Futurism: motion-led, bold typography; reduced-motion par sthir
