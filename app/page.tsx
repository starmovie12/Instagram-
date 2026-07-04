import type { Metadata } from "next";
import Link from "next/link";
import ExtractorTool from "@/components/ExtractorTool";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "InstaGrab — Instagram Downloader + Caption & Hashtag Extractor (HD, Free)",
  description:
    "Download Instagram reels, videos, photos, stories, highlights & profile pictures in HD — plus copy the full caption and every hashtag in one click. Free, no login, no watermark.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">👑 The premium Instagram toolkit</span>
        <h1>
          Download anything from Instagram —<br />
          <span className="accent">with caption &amp; hashtags</span>
        </h1>
        <p className="sub">
          Reels, videos, photos, stories, highlights &amp; profile pictures in HD.
          The only toolkit that also extracts the full caption and every hashtag —
          built for creators and social media managers.
        </p>
        <div className="trust">
          <span>✅ No login</span>
          <span>🆓 100% Free</span>
          <span>🎬 HD Quality</span>
          <span>💧 No watermark</span>
          <span>🔒 Anonymous</span>
        </div>
      </section>

      <ExtractorTool />

      <div className="stat-band">
        <div className="stat"><span className="v">7+</span><span className="l">Tools</span></div>
        <div className="stat"><span className="v">1080p</span><span className="l">HD Quality</span></div>
        <div className="stat"><span className="v">0</span><span className="l">Logins</span></div>
        <div className="stat"><span className="v">∞</span><span className="l">Downloads</span></div>
      </div>

      <h2 className="section-title">Every Instagram downloader, one place</h2>
      <p className="section-sub">Pick a tool — or just paste any link above.</p>
      <div className="tools-grid">
        {TOOLS.map((t) => (
          <Link className="tool-card" href={t.href} key={t.href}>
            <span className="ic">{t.icon}</span>
            <b>{t.name}</b>
            <p>{t.desc}</p>
            {t.badge && <span className="pill">{t.badge}</span>}
          </Link>
        ))}
      </div>

      <section className="content">
        <h2>What makes InstaGrab different</h2>
        <div className="feature-grid">
          <div className="feature">
            <div className="emoji">📋</div>
            <b>Caption &amp; hashtag extraction</b>
            <p>Every other downloader gives you the file. InstaGrab also hands you the full caption and all hashtags — one-click copy. That&apos;s the creator&apos;s edge.</p>
          </div>
          <div className="feature">
            <div className="emoji">👑</div>
            <b>A premium, calm interface</b>
            <p>No spam, no fake buttons, no aggressive popups. A warm, fast, gold-trimmed design that respects your attention.</p>
          </div>
          <div className="feature">
            <div className="emoji">🗂️</div>
            <b>The complete toolkit</b>
            <p>Reels, video, IGTV, photos, carousels, stories, highlights &amp; profile pictures — plus an anonymous story viewer. All free.</p>
          </div>
          <div className="feature">
            <div className="emoji">⚡</div>
            <b>Fast &amp; private</b>
            <p>No login, no account, no stored links. Media streams straight from Instagram to your device.</p>
          </div>
        </div>

        <h2>How it works</h2>
        <ol className="steps">
          <li><span><b>Copy the link or username.</b> A post/reel link for media &amp; captions, or an @username for stories, highlights &amp; profile pictures.</span></li>
          <li><span><b>Paste it into the tool.</b> Hit the button — InstaGrab fetches everything in seconds.</span></li>
          <li><span><b>Download &amp; copy.</b> Save media in HD and copy the caption or all hashtags with one tap.</span></li>
        </ol>

        <h2>Frequently asked questions</h2>
        <div className="faq">
          <details><summary>Is InstaGrab really free?</summary><p>Yes — completely free, no login, no signup, no watermark. Works on mobile and desktop.</p></details>
          <details><summary>Can I download from private accounts?</summary><p>No. Only public content can be downloaded. Private accounts are protected by Instagram and we respect that.</p></details>
          <details><summary>What can I download?</summary><p>Reels, videos, IGTV, single photos, full carousels, stories, story highlights (covers + stories), and HD profile pictures — plus caption and hashtag text.</p></details>
          <details><summary>Do you store the media or my links?</summary><p>No. We host nothing. Media is fetched from Instagram&apos;s public servers and streamed to your device; links are never saved.</p></details>
          <details><summary>Is it legal?</summary><p>Downloading content you own or have permission to use (or saving for personal offline viewing) is fine. Re-uploading someone else&apos;s content without permission may violate copyright — always credit and get consent.</p></details>
        </div>
      </section>
    </main>
  );
}
