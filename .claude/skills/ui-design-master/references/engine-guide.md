# Engine ka guide (UI/UX Pro Max)

Capability: `engine`. Command skill ke folder se chalao (jahan SKILL.md hai). Python 3, koi external package nahi.

```bash
python3 scripts/search.py "fintech payments trust" --design-system -p "ProjectName"
python3 scripts/search.py "error summary validation" --domain ux -n 3
python3 scripts/search.py "suspense streaming" --stack nextjs
python3 scripts/search.py "ops dashboard" --design-system --variance 3 --motion 2 --density 8
python3 scripts/search.py "ye query" --design-system --persist --output-dir PROJECT_ROOT
```

Agar `python3` na mile to `python` ya `py -3` try karo. Phir bhi na chale to bank ki files par jao (style-matrix, industry, typography) aur likho ki engine chala nahi.

- Domains: `product`, `style`, `color`, `typography`, `google-fonts`, `chart`, `ux`, `landing`, `icons`, `gsap`, `react`, `web`.
- Sabse chhota mode: naya screen ya product ke liye `--design-system`; ek concern ke liye ek `--domain`; stack pata ho to `--stack`.
- Query: ek iraada, 2 se 5 matlab wale shabd. Poori audit-list ek query mein nahi ("keyboard focus modal" theek; "modal accessibility contrast animation focus trap" nahi).
- Accessibility ke dikhne wale nateeje alag khojo: "error summary validation", "focus not obscured", "dragging movements", "accessible authentication", "decorative icon aria hidden". Text-layout bug mein pehle UX nateeja ("badge chip label wraps"), phir stack ("chip badge overflow nowrap").
- Result ki jaanch: domain, top result, product aur platform par baithta hai ya nahi. Seedha style search galat style de sakta hai ("meditation calm" par Fluent 2 pehle aaya jabki design-system mode ne Neumorphism diya): upar ke 3 result style-matrix ke "mat lagao" se milao.
- Stack ki pehchan: package.json (react, next, vue, svelte, nuxt, angular), pubspec.yaml (Flutter), *.xcodeproj ya Package.swift (SwiftUI), composer.json (Laravel), app.json ke saath react-native. 22 stack: react, nextjs, vue, svelte, astro, nuxtjs, nuxt-ui, angular, laravel, swiftui, react-native, flutter, jetpack-compose, html-tailwind, shadcn, threejs, javafx, wpf, winui, avalonia, uno, uwp.
- `--persist` `design-system/<slug>/MASTER.md` aur `pages/<page>.md` likhta hai. MASTER.md pehle se ho to padho; `--force` user ki saaf ijazat ke bina kabhi nahi.
- Data integrity: `python3 scripts/validate_data.py`.
- Praman: "engine se verified" tabhi likho jab command chala ho; command aur top result ki ek line saath likho.
