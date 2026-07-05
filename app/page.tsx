import type { Metadata } from "next";
import Link from "next/link";
import ExtractorTool from "@/components/ExtractorTool";
import TrendingReels from "@/components/TrendingReels";
import CountUp from "@/components/CountUp";
import { StarIcon } from "@/components/Icons";
import { AdSlot } from "@/components/Ads";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "InstaGrab — Instagram Reels, Video, Story & Photo Downloader 2026",
  description:
    "Download Instagram reels, videos, photos, stories, highlights & profile pictures in HD — plus copy the full caption and every hashtag in one click. Fast, secure, no watermark, no login.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <header id="top" className="hero">
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
        <div className="hero-in">
          <div className="badge"><StarIcon /> OCT 2026 · $10M ASSET VALUE</div>
          <h1>Instagram<br /><span className="gold-text">Downloader 2026</span></h1>
          <p className="sub">
            Reels, videos, photos, stories, highlights &amp; profile pictures in HD.<br />
            <b>Fast. Secure. No Watermark.</b>
          </p>

          <ExtractorTool />

          <div className="chips">
            <div className="chip">
              <span className="cic">🎬</span>
              <span><b>HD Quality</b><small>1080p &amp; 4K</small></span>
            </div>
            <div className="chip">
              <span className="cic">💧</span>
              <span><b>No Watermark</b><small>Clean downloads</small></span>
            </div>
            <div className="chip">
              <span className="cic">⚡</span>
              <span><b>Lightning Fast</b><small>Instant results</small></span>
            </div>
            <div className="chip">
              <span className="cic">🔒</span>
              <span><b>100% Secure</b><small>Private &amp; safe</small></span>
            </div>
          </div>
        </div>
      </header>

      {/* TRENDING */}
      <TrendingReels />

      {/* STATS */}
      <section className="stats reveal">
        <div className="stats-in">
          <div className="stat"><div className="v"><CountUp to={25} suffix="M+" /></div><div className="l">Reels Downloaded</div></div>
          <div className="stat"><div className="v"><CountUp to={2} suffix="M+" /></div><div className="l">Happy Users</div></div>
          <div className="stat"><div className="v"><CountUp to={99.9} decimals={1} suffix="%" /></div><div className="l">Uptime</div></div>
          <div className="stat"><div className="v"><CountUp to={4.9} decimals={1} /><StarIcon size={22} /></div><div className="l">User Rating</div></div>
        </div>
      </section>

      <div className="wrap"><AdSlot label="home-mid" /></div>

      {/* ALL TOOLS */}
      <h2 className="section-title reveal">Every Instagram downloader, one place</h2>
      <p className="section-sub reveal">Pick a tool — or just paste any link above.</p>
      <div className="tools-grid reveal">
        {TOOLS.map((t) => (
          <Link className="tool-card" href={t.href} key={t.href}>
            <span className="ic">{t.icon}</span>
            <b>{t.name}</b>
            <p>{t.desc}</p>
            {t.badge && <span className="pill">{t.badge}</span>}
          </Link>
        ))}
      </div>

      {/* WHY CHOOSE */}
      <section id="features" className="why reveal" style={{ padding: "0 24px" }}>
        <div className="center">
          <h2 className="section-title" style={{ margin: "64px 0 8px" }}>Why choose <span className="gold-text">InstaGrab</span>?</h2>
          <p className="section-sub">The most complete Instagram toolkit of 2026</p>
          <div className="cards">
            <div className="card"><span className="ic">🎬</span><h3>Ultra HD Quality</h3><p>Download reels, videos &amp; photos in stunning HD with zero compression or watermark.</p></div>
            <div className="card"><span className="ic">📋</span><h3>Caption &amp; Hashtags</h3><p>The signature edge — copy the full caption and every hashtag in one click.</p></div>
            <div className="card"><span className="ic">🕵️</span><h3>Anonymous</h3><p>No login, no tracking, no history. View and download completely privately.</p></div>
            <div className="card"><span className="ic">🗂️</span><h3>All In One</h3><p>Reels, video, photos, carousels, stories, highlights &amp; profile pictures — free.</p></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how reveal" style={{ padding: "0 24px" }}>
        <div className="center">
          <h2 className="section-title" style={{ margin: "64px 0 8px" }}>How it works</h2>
          <p className="section-sub">Three steps. Under ten seconds.</p>
          <div className="cards">
            <div className="card step"><span className="step-num">01</span><h3>Copy the link</h3><p>Open Instagram, tap Share on any reel/post and choose Copy Link. For stories &amp; DP, use the @username.</p></div>
            <div className="card step"><span className="step-num">02</span><h3>Paste it above</h3><p>Drop the link in the golden bar and hit Download.</p></div>
            <div className="card step"><span className="step-num">03</span><h3>Save in HD</h3><p>Download the media, and copy the caption or all hashtags with one tap.</p></div>
          </div>
        </div>
      </section>

      {/* PREMIUM BAND */}
      <div className="wrap">
        <section className="premium reveal">
          <div>
            <h2>The complete creator toolkit</h2>
            <p>Everything a content creator or social media manager needs — in one fast, clean, premium tool.</p>
            <ul>
              <li>Reels, video, IGTV, photo &amp; carousel downloads in HD</li>
              <li>Full caption + every hashtag, one-click copy</li>
              <li>Stories, highlights, anonymous viewer &amp; HD profile pictures</li>
              <li>No login, no watermark, no limits</li>
            </ul>
            <Link href="/caption-extractor" className="btn-gold" style={{ padding: "13px 26px", fontSize: 15 }}>Try the caption extractor →</Link>
          </div>
          <div className="premium-orb">👑</div>
        </section>
      </div>

      {/* FAQ */}
      <section className="content">
        <h2>Frequently asked questions</h2>
        <div className="faq reveal">
          <details><summary>Is InstaGrab really free?</summary><p>Yes — completely free, no login, no signup, no watermark. Works on mobile and desktop.</p></details>
          <details><summary>Can I download from private accounts?</summary><p>No. Only public content can be downloaded. Private accounts are protected by Instagram and we respect that.</p></details>
          <details><summary>What can I download?</summary><p>Reels, videos, IGTV, single photos, full carousels, stories, story highlights (covers + stories), and HD profile pictures — plus caption and hashtag text.</p></details>
          <details><summary>Do you store the media or my links?</summary><p>No. We host nothing. Media is fetched from Instagram&apos;s public servers and streamed to your device; links are never saved.</p></details>
          <details><summary>Is it legal?</summary><p>Downloading content you own or have permission to use (or for personal offline viewing) is fine. Re-uploading someone else&apos;s content without permission may violate copyright — always credit and get consent.</p></details>
        </div>
      </section>
    </>
  );
}
