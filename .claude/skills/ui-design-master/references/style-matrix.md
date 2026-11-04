# Style Matrix (50 active style): kaam ke liye aur mat lagao

Capability: `style-matrix`. Dimag (master-prompt.xml) STEP 5.2 mein style chunne se pehle ye file maangta hai. Ye UI/UX Pro Max ke styles.csv ka chhota nichod hai.

Style chunne ka tareeka: product ka type, audience aur kaam dekho; matrix se ek style (ya do ka mel, jahan saaf wajah ho) chuno; uska "mat lagao" jaancho; ek hi style poori app mein. Jis style ke "mat lagao" mein accessibility ya performance likha ho, wahan wo style mat lagao. Ye 50 active style hain; 29 supplemental aur 9 deprecated style `data/styles.csv` mein hain: unhe engine chalaye bina mat lagao.

Label: bank se (file: style-matrix.md). Ye matrix dataset ka nichod hai; naye ya anokhe product ke liye `scripts/search.py` se milaan karo.

| Style | Kaam ke liye | Mat lagao |
|---|---|---|
| Minimalism & Swiss Style | Enterprise apps, dashboards, documentation sites, SaaS platforms | Creative portfolios, entertainment, playful brands |
| Neumorphism | Health, wellness apps, meditation platforms, fitness trackers | Complex apps, critical accessibility, data-heavy dashboards |
| Glassmorphism | Modern SaaS, financial dashboards, high-end corporate, lifestyle apps | Low-contrast backgrounds, critical accessibility, performance-limited |
| Brutalism | Design portfolios, artistic projects, counter-culture brands, editorial | Corporate environments, conservative industries, critical accessibility |
| 3D & Hyperrealism | Gaming, product showcase, immersive experiences, high-end e-commerce | Low-end mobile, performance-limited, critical accessibility |
| Vibrant & Block-based | Startups, creative agencies, gaming, social media | Financial institutions, healthcare, formal business |
| Dark Mode (OLED) | Night-mode apps, coding platforms, entertainment, eye-strain prevention | Print-first content, high-brightness outdoor, color-accuracy-critical |
| Accessible & Ethical | Government, healthcare, education, inclusive products | koi nahi (sab par chalta hai) |
| Claymorphism | Educational apps, children's apps, SaaS platforms, creative tools | Formal corporate, professional services, data-critical |
| Aurora UI | Modern SaaS, creative agencies, branding, music platforms | Data-heavy dashboards, critical accessibility, content-heavy where distraction issues |
| Retro-Futurism | Gaming, entertainment, music platforms, tech brands | Conservative industries, critical accessibility, professional |
| Flat Design | Web apps, mobile apps, cross-platform, startup MVPs | Complex 3D, premium, luxury |
| Skeuomorphism | Legacy apps, gaming, immersive storytelling, premium products | Modern enterprise, critical accessibility, low-performance |
| Liquid Glass | Apple-platform navigation, controls, and system-aligned app chrome | content layers, dense reading surfaces, or custom effects without accessibility fallbacks |
| Motion-Driven | Portfolio sites, storytelling platforms, interactive experiences, entertainment apps | Data dashboards, critical accessibility, low-power devices |
| Micro-interactions | Mobile apps, touchscreen UIs, productivity tools, user-friendly | Desktop-only, critical performance, accessibility-first (alternatives needed) |
| Inclusive Design | Public services, education, healthcare, finance | koi nahi (sab par chalta hai) |
| Zero Interface | Voice assistants, AI platforms, future-forward UX, smart home | Complex workflows, data-entry heavy, traditional systems |
| Soft UI Evolution | Modern enterprise apps, SaaS platforms, health, wellness | Extreme minimalism, critical performance, systems without modern OS |
| Data-Dense Dashboard | Business intelligence dashboards, financial analytics, enterprise reporting, operational dashboards | Marketing dashboards, consumer-facing analytics, simple reporting |
| Neubrutalism | Gen Z brands, startups, creative agencies, Figma-style apps | Luxury brands, finance, healthcare |
| Bento Box Grid | Dashboards, product pages, portfolios, Apple-style marketing | Dense data tables, text-heavy content, real-time monitoring |
| Y2K Aesthetic | Fashion brands, music platforms, Gen Z brands, nostalgia marketing | B2B enterprise, healthcare, finance |
| Cyberpunk UI | Gaming platforms, tech products, crypto apps, sci-fi applications | Corporate enterprise, healthcare, family apps |
| Organic Biophilic | Wellness apps, sustainability brands, eco products, health apps | Tech-focused products, gaming, industrial |
| AI-Native UI | AI products, chatbots, voice assistants, copilots | Traditional forms, data-heavy dashboards, print-first content |
| Memphis Design | Creative agencies, music sites, youth brands, event promotion | Corporate finance, healthcare, legal |
| Dimensional Layering | Dashboards, card layouts, modals, navigation | Print-style layouts, simple blogs, low-end devices |
| Exaggerated Minimalism | Fashion, architecture, portfolios, agency landing pages | E-commerce catalogs, dashboards, forms |
| Kinetic Typography | Hero sections, marketing sites, video platforms, storytelling | Long-form content, accessibility-critical, data interfaces |
| Parallax Storytelling | Brand storytelling, product launches, case studies, portfolios | E-commerce, dashboards, mobile-first |
| HUD / Sci-Fi FUI | Sci-fi games, space tech, cybersecurity, movie props | Standard corporate, reading heavy content, accessible public services |
| Pixel Art | Indie games, retro tools, creative portfolios, nostalgia marketing | Professional corporate, modern SaaS, high-res photography sites |
| Spatial UI (VisionOS) | Spatial computing apps, VR, AR interfaces, immersive media | Text-heavy documents, high-contrast requirements, non-3D capable devices |
| E-Ink / Paper | Reading apps, digital newspapers, minimal journals, distraction-free writing | Gaming, video platforms, high-energy marketing |
| Gen Z Chaos / Maximalism | Gen Z lifestyle brands, music artists, creative portfolios, viral marketing | Corporate, government, healthcare |
| Biomimetic / Organic 2.0 | Sustainability tech, biotech, advanced health, meditation | Standard SaaS, data grids, strict corporate |
| Anti-Polish / Raw Aesthetic | Creative portfolios, artist sites, indie brands, handmade products | Corporate enterprise, fintech, healthcare |
| Tactile Digital / Deformable UI | Modern mobile apps, playful brands, entertainment, gaming UI | Enterprise software, data dashboards, accessibility-critical |
| Nature Distilled | Wellness brands, sustainable products, artisan goods, organic food | Tech startups, gaming, nightlife |
| Interactive Cursor Design | Creative portfolios, interactive experiences, agency sites, product showcases | Mobile-first (no cursor), accessibility-critical, data-heavy dashboards |
| Voice-First Multimodal | Voice assistants, accessibility apps, hands-free tools, smart home | Visual-heavy content, data entry, complex forms |
| 3D Product Preview | E-commerce, furniture, fashion, automotive | Content-heavy sites, blogs, dashboards |
| Editorial Grid / Magazine | News sites, blogs, magazines, editorial content | Dashboards, apps, e-commerce catalogs |
| Vintage Analog / Retro Film | Photography portfolios, music, vinyl brands, vintage fashion | Modern tech, SaaS, healthcare |
| Bauhaus (包豪斯) | Mobile-first apps needing high personality, onboarding flows, branding-forward product screens, artisan | Enterprise dashboards, accessibility-critical contexts (requires extra a11y work), data-heavy screens |
| Material 3 Expressive (Mobile) | Android, Wear OS, and Pixel-aligned products using Material 3 components | Ultra-minimal brutalist brands, terminal, hacker aesthetics |
| Fluent 2 | Microsoft 365, Windows, Copilot, and enterprise line-of-business tools | Products that should not inherit Microsoft platform conventions |
| Shopify Polaris | Shopify admin apps, merchant tools, checkout, customer accounts | Generic marketing sites or products outside Shopify surfaces |
| Adobe Spectrum | Creative tools, media workflows, document products, and Adobe-adjacent enterprise software | Consumer brands that do not need dense professional-tool conventions |
