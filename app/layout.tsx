import type { Metadata } from "next";
import Link from "next/link";
import { Syne, Space_Mono, Inter } from "next/font/google";
import { NAV_TOOLS, TOOLS } from "@/lib/tools";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["800"], variable: "--font-syne", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["700"], variable: "--font-mono", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://instagrab.vercel.app"),
  title: {
    default: "InstaGrab — Instagram Downloader + Caption & Hashtag Extractor (HD, Free)",
    template: "%s · InstaGrab",
  },
  description:
    "Download Instagram reels, videos, photos, stories, highlights & profile pictures in HD — plus copy the full caption and every hashtag in one click. Free, no login, no watermark.",
  keywords: [
    "instagram downloader",
    "reels download",
    "instagram video downloader",
    "instagram story downloader",
    "instagram highlights downloader",
    "instagram profile picture downloader",
    "instagram caption extractor",
    "instagram hashtag extractor",
  ],
  openGraph: { siteName: "InstaGrab", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable} ${inter.variable}`}>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="brand" aria-label="InstaGrab home">
              <span className="logo-mark">👑</span>
              <span className="wordmark">Insta<span className="grab">Grab</span></span>
            </Link>
            <nav className="nav" aria-label="Tools">
              {NAV_TOOLS.map((t) => (
                <Link key={t.href} href={t.href}>{t.label}</Link>
              ))}
              <Link href="/blog">Blog</Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-cols">
              <div>
                <div className="footer-brand">
                  <span className="logo-mark" style={{ width: 34, height: 34, fontSize: 17 }}>👑</span>
                  <span className="wordmark">Insta<span className="grab">Grab</span></span>
                </div>
                <p className="footer-tag">
                  The premium Instagram toolkit — HD downloads plus caption &amp;
                  hashtag extraction. Free, no login, no watermark.
                </p>
              </div>
              <div>
                <h4>Downloaders</h4>
                {TOOLS.slice(0, 6).map((t) => (
                  <Link key={t.href} href={t.href}>{t.name}</Link>
                ))}
              </div>
              <div>
                <h4>Company</h4>
                <Link href="/about">About</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/dmca">DMCA</Link>
              </div>
            </div>
            <p className="disclaimer">
              InstaGrab is not affiliated with Instagram™ or Meta. We do not host
              any content — all media is fetched from Instagram&apos;s public servers
              and belongs to its respective owners. Download only content you own
              or have permission to use. © {new Date().getFullYear()} InstaGrab.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
