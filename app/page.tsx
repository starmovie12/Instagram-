import type { Metadata } from "next";
import Link from "next/link";
import ExtractorTool from "@/components/ExtractorTool";
import { AdSlot } from "@/components/Ads";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "InstaGrab — Instagram Reels, Video, Story & Photo Downloader",
  description:
    "Download Instagram reels, videos, photos, stories, highlights & profile pictures in HD — choose the exact quality, and copy the full caption and every hashtag in one click. Free, no login, no watermark.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ===== HERO (white canvas) ===== */}
      <header className="hero">
        <div className="hero-in">
          <p className="eyebrow">The complete Instagram toolkit</p>
          <h1>Download anything from Instagram, <em>beautifully.</em></h1>
          <p className="sub">
            Reels, videos, photos, stories, highlights &amp; profile pictures — in the
            exact quality you choose, with the full caption and every hashtag.
          </p>
          <ExtractorTool />
          <div className="trust">
            <span><b>✓</b> No login</span>
            <span><b>✓</b> No watermark</span>
            <span><b>✓</b> Choose quality</span>
            <span><b>✓</b> Free forever</span>
          </div>
        </div>
      </header>

      {/* ===== Trust strip ===== */}
      <div className="wrap">
        <div className="logo-strip reveal">
          <span>Reels</span><span>Video · IGTV</span><span>Photos</span><span>Carousels</span>
          <span>Stories</span><span>Highlights</span><span>Profiles</span>
        </div>
      </div>

      {/* ===== Tools (white) ===== */}
      <section className="band reveal">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The collection</p>
            <h2>Every Instagram downloader, one place</h2>
            <p>Pick a tool — or just paste any link in the box above.</p>
          </div>
          <div className="demo-grid">
            {TOOLS.map((t) => (
              <Link className="demo-card" href={t.href} key={t.href}>
                <span className="ic">{t.icon}</span>
                <b>{t.name}</b>
                <p>{t.desc}</p>
                {t.badge && <span className="pill">{t.badge}</span>}
              </Link>
            ))}
          </div>
          <AdSlot label="home-mid" />
        </div>
      </section>

      {/* ===== Coral signature card ===== */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="sig-card sig-coral sig-split">
            <div>
              <p className="eyebrow" style={{ color: "rgba(255,255,255,0.75)" }}>Choose your quality</p>
              <h2>Every resolution Instagram stores — 1080p, 720p, 480p — as its own button.</h2>
              <p>No more settling for whatever a downloader hands you. InstaGrab reads the full list of qualities and lets you pick exactly what you need, downloaded straight from Instagram&apos;s servers.</p>
              <div className="sig-actions">
                <Link href="/reels-downloader" className="btn-on-dark">Try the reels downloader</Link>
              </div>
            </div>
            <div className="sig-media" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="sig-mockup">🎬</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why (white) ===== */}
      <section className="band reveal">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The difference</p>
            <h2>Built to feel like a product, not a pop-up farm</h2>
          </div>
          <div className="feat-grid">
            <div className="feat"><div className="ic">🎬</div><h3>Original quality, your choice</h3><p>The exact files Instagram stores — every resolution, no re-encoding, no watermark. Pick 1080p or a lighter 480p.</p></div>
            <div className="feat"><div className="ic">📋</div><h3>Caption &amp; hashtags</h3><p>The signature edge. Full caption text, every hashtag and mention — separated, counted, one click to copy.</p></div>
            <div className="feat"><div className="ic">🔒</div><h3>Anonymous &amp; private</h3><p>No login, no tracking, no stored links. Story views never register on the owner&apos;s account.</p></div>
            <div className="feat"><div className="ic">🗂️</div><h3>The complete toolkit</h3><p>Reels, video, photos, carousels, stories, highlights, profile pictures — and an anonymous story viewer.</p></div>
          </div>
        </div>
      </section>

      {/* ===== Dark navy CTA ===== */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="sig-card sig-dark sig-split">
            <div>
              <p className="eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>For creators</p>
              <h2>The toolkit content creators actually keep bookmarked.</h2>
              <p>Study viral captions, pull hashtag sets, repurpose in HD, save stories before they vanish. Everything a creator or social media manager needs — free.</p>
              <div className="sig-actions">
                <Link href="/caption-extractor" className="btn-on-dark">Extract a caption</Link>
              </div>
            </div>
            <div className="sig-media" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="sig-mockup">📋</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How (white) ===== */}
      <section className="band reveal">
        <div className="wrap">
          <div className="section-head">
            <p className="eyebrow">The ritual</p>
            <h2>Three steps. Ten seconds.</h2>
          </div>
          <div className="steps">
            <div className="step"><span className="n">01</span><h3>Copy the link or @username</h3><p>A post or reel link for media &amp; captions, or a public @username for stories, highlights and profile pictures.</p></div>
            <div className="step"><span className="n">02</span><h3>Paste it in the box</h3><p>Hit Download. InstaGrab fetches everything — media, every quality, caption, tags — in one pass.</p></div>
            <div className="step"><span className="n">03</span><h3>Pick quality &amp; save</h3><p>Choose 1080p / 720p / 480p, download in HD, and copy the caption or all hashtags with one tap.</p></div>
          </div>
        </div>
      </section>

      {/* ===== Cream callout ===== */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="sig-card sig-cream">
            <div className="section-head" style={{ margin: 0, maxWidth: 640 }}>
              <h2>No app. No login. No watermark.</h2>
              <p style={{ color: "var(--body)" }}>Works on any phone, tablet or computer — straight from the browser. We host nothing; media streams from Instagram&apos;s public servers to your device.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Light CTA band ===== */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="cta-band">
            <h2>Start downloading in HD</h2>
            <p>Free, no login, no limits. Paste a link and go.</p>
            <Link href="/reels-downloader" className="btn-primary">Open the downloader</Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="section-head"><h2>Frequently asked questions</h2></div>
          <div className="faq">
            <details><summary>Can I choose the video quality?</summary><p>Yes — InstaGrab reads every resolution Instagram stores (typically 1080p, 720p and 480p) and gives each its own download button. Pick HD for quality or a smaller size to save data.</p></details>
            <details><summary>Is InstaGrab really free?</summary><p>Completely free — no login, no signup, no watermark. Works on mobile and desktop.</p></details>
            <details><summary>Can I download from private accounts?</summary><p>No. Only public content can be downloaded. Private accounts are protected by Instagram and we respect that.</p></details>
            <details><summary>What can I download?</summary><p>Reels, videos, IGTV, single photos, full carousels, stories, story highlights (covers + stories), and HD profile pictures — plus caption and hashtag text.</p></details>
            <details><summary>Do you store the media or my links?</summary><p>No. We host nothing. Media is fetched from Instagram&apos;s public servers and streamed to your device; links are never saved.</p></details>
          </div>
        </div>
      </section>
    </>
  );
}
