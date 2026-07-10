import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LangProvider } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site-url";
import PwaRegister from "@/components/PwaRegister";
import InstallPrompt from "@/components/InstallPrompt";
import CommandPalette from "@/components/CommandPalette";
import OnboardingTour from "@/components/OnboardingTour";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"], style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"], variable: "--font-display", display: "swap",
});
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0906" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* FOUC-proof theme — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ig-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
        <PwaRegister />
        <InstallPrompt />
        <CommandPalette />
        <OnboardingTour />
        <Analytics />
        {/* Adsterra Social Bar — site-wide floating unit, no container needed. */}
        <Script
          src="https://pl30280133.effectivecpmnetwork.com/0c/f9/53/0cf9534424ebc32da0ad62ff5cfd5888.js"
          strategy="lazyOnload"
        />
        {/* Adsterra Popunder — site-wide, fires on user interaction. Loaded
            lazily so it never blocks the main UI or first paint. */}
        <Script
          src="https://pl30307336.effectivecpmnetwork.com/24/8a/a5/248aa59361a0986b753da9f69e278da4.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
