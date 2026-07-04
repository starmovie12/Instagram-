import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://instagrab.vercel.app"),
  title: {
    default: "InstaGrab — Instagram Reels, Photo & Story Downloader + Caption & Hashtag Extractor",
    template: "%s · InstaGrab",
  },
  description:
    "Download Instagram reels, photos and stories in HD — and copy the full caption + all hashtags in one click. Free, no login, no watermark.",
  keywords: [
    "instagram downloader",
    "reels download",
    "instagram caption extractor",
    "instagram hashtag extractor",
    "instagram photo download",
  ],
  openGraph: {
    siteName: "InstaGrab",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="logo">📸 InstaGrab</Link>
            <nav className="nav" aria-label="Tools">
              <Link href="/reels-downloader">Reels</Link>
              <Link href="/photo-downloader">Photos</Link>
              <Link href="/story-downloader">Stories</Link>
              <Link href="/caption-extractor">Captions</Link>
              <Link href="/hashtag-extractor">Hashtags</Link>
              <Link href="/blog">Blog</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/dmca">DMCA</Link>
              <Link href="/contact">Contact</Link>
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
