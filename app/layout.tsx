import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Instrument_Sans, Noto_Sans_Devanagari } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LangProvider } from "@/lib/i18n";
import { LANGS, RTL_LANGS } from "@/lib/locales";

const LANG_CODES = LANGS.map((l) => l.code);
const RTL = [...RTL_LANGS];
import { SITE_URL } from "@/lib/site-url";
import { DESIGN_TOKENS } from "@/lib/design-tokens.generated";
import PwaRegister from "@/components/PwaRegister";
import InstallPrompt from "@/components/InstallPrompt";
import CommandPalette from "@/components/CommandPalette";
import OnboardingTour from "@/components/OnboardingTour";
import AppShell from "@/components/shell/AppShell";
import "./globals.css";
import "./shell.css";

// PRD §3.3 / C2: Instrument Sans (Latin) + Noto Sans Devanagari companion (unicode-range subset,
// only downloaded when Devanagari text is on screen). Fraunces + JetBrains Mono dropped (§14.6).
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-deva", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "InstaGrab — Download anything from Instagram, beautifully",
    template: "%s · InstaGrab",
  },
  description:
    "Download Instagram reels, photos, stories and carousels in HD — plus the full caption and every hashtag, one click away. Free, no login, links never stored.",
  keywords: [
    "instagram downloader", "reels download", "instagram video downloader",
    "instagram story downloader", "instagram highlights downloader",
    "instagram profile picture downloader", "instagram caption extractor", "instagram hashtag extractor",
  ],
  openGraph: { siteName: "InstaGrab", type: "website" },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "InstaGrab", statusBarStyle: "black-translucent" },
  verification: {
    google: "qAW2AZhiMoIodGgJHNgUVgfEBJmoS9d0zNubWAZkgHE",
  },
};

export const viewport: Viewport = {
  // notch / home-bar ke liye (PRD §14.2) — env(safe-area-inset-*) shell.css me
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: DESIGN_TOKENS.light["bg-base"] },
    { media: "(prefers-color-scheme: dark)", color: DESIGN_TOKENS.dark["bg-base"] },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${deva.variable}`} suppressHydrationWarning>
      <head>
        {/* FOUC-proof theme — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            // Theme + language before first paint: no flash, and <html lang/dir> matches the chosen
            // language even on statically prerendered pages (server default stays "en").
            __html: `(function(){var d=document.documentElement;try{var t=localStorage.getItem('ig-theme');d.dataset.theme=t==='dark'?'dark':'light';var l=localStorage.getItem('ig-lang')||(navigator.language||'en').slice(0,2).toLowerCase();if(${JSON.stringify(LANG_CODES)}.indexOf(l)>-1){d.lang=l;d.dir=${JSON.stringify(RTL)}.indexOf(l)>-1?'rtl':'ltr';}var p={};try{p=JSON.parse(localStorage.getItem('ig.prefs.v1')||'{}')||{};}catch(e){}var m=navigator.deviceMemory;d.dataset.surface=(p.solidSurfaces===true||(p.solidSurfaces===undefined&&m&&m<=2))?'solid':'glass';d.dataset.ambient=p.ambientGlow===false?'off':'on';d.classList.add('js-motion');var en='stagger';try{if(sessionStorage.getItem('ig.entered'))en='fade';}catch(e){}d.dataset.entrance=en;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <LangProvider><AppShell>{children}</AppShell></LangProvider>
        <PwaRegister />
        <InstallPrompt />
        <CommandPalette />
        <OnboardingTour />
        <Analytics />
        {/* Adsterra Social Bar — site-wide floating unit, no container needed.
            NOTE: the Popunder unit was removed on purpose — popunder scripts
            hijack the user's first click, which broke download buttons (and
            intrusive-ad signals also hurt Google ranking). Don't re-add it. */}
        <Script
          src="https://pl30280133.effectivecpmnetwork.com/0c/f9/53/0cf9534424ebc32da0ad62ff5cfd5888.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
