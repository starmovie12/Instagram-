import type { Metadata } from "next";
import Link from "next/link";
import { Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NAV_TOOLS, TOOLS } from "@/lib/tools";
import { LogoMark } from "@/components/Icons";
import ScrollAnimations from "@/components/ScrollAnimations";
import { AdScripts } from "@/components/Ads";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://instagrab.vercel.app"),
  title: {
    default: "InstaGrab — Instagram Reels, Video, Story & Photo Downloader 2026",
    template: "%s · InstaGrab",
  },
  description:
    "Download Instagram reels, videos, photos, stories, highlights & profile pictures in HD — plus copy the full caption and every hashtag in one click. Fast, secure, no watermark, no login.",
  keywords: [
    "instagram downloader", "reels download", "instagram video downloader",
    "instagram story downloader", "instagram highlights downloader",
    "instagram profile picture downloader", "instagram caption extractor", "instagram hashtag extractor",
  ],
  openGraph: { siteName: "InstaGrab", type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <nav className="nav">
          <div className="nav-in">
            <Link href="/" className="logo" aria-label="InstaGrab home">
              <span className="logo-mark"><LogoMark size={19} /></span>
              <span className="logo-txt">
                <b>InstaGrab</b>
                <small>Downloader 2026</small>
              </span>
            </Link>
            <div className="nav-links">
              {NAV_TOOLS.map((t) => <Link key={t.href} href={t.href}>{t.label}</Link>)}
              <Link href="/blog">Blog</Link>
            </div>
            <Link href="/profile-picture-downloader" className="btn-gold">Tools</Link>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-cols">
              <div>
                <div className="footer-brand">
                  <span className="logo-mark" style={{ width: 34, height: 34 }}><LogoMark size={16} /></span>
                  <span className="logo-txt"><b>InstaGrab</b><small>Downloader 2026</small></span>
                </div>
                <p className="footer-tag">
                  The premium Instagram toolkit — HD downloads plus caption &amp;
                  hashtag extraction. Fast, secure, no watermark, no login.
                </p>
              </div>
              <div>
                <h4>Downloaders</h4>
                {TOOLS.slice(0, 6).map((t) => <Link key={t.href} href={t.href}>{t.name}</Link>)}
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
              <div className="footer-badge">
                <span className="v">$10M</span>
                <span className="l">Asset Value · Oct 2026</span>
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

        <ScrollAnimations />
        <AdScripts />
        <Analytics />
      </body>
    </html>
  );
}
