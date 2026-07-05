import type { Metadata } from "next";
import Link from "next/link";
import ExtractorTool from "@/components/ExtractorTool";
import TrendingReels from "@/components/TrendingReels";
import CountUp from "@/components/CountUp";
import { AdSlot } from "@/components/Ads";
import { TOOLS } from "@/lib/tools";

export const metadata: Metadata = {
  title: "InstaGrab — Instagram Reels, Video, Story & Photo Downloader",
  description:
    "Download Instagram reels, videos, photos, stories, highlights & profile pictures in HD — plus copy the full caption and every hashtag in one click. Fast, secure, no watermark, no login.",
  alternates: { canonical: "/" },
};

/* word-mask reveal helper — each word slides up with a stagger */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className="w" style={{ ["--i" as string]: from + i }} key={i}>{w}&nbsp;</span>
      ))}
    </>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <header className="hero">
        <div className="hero-in">
          <div className="badge"><span className="dot" /> The Gold Standard of Instagram Tools</div>

          <h1 aria-label="Download anything from Instagram, beautifully.">
            <span className="wline"><Words text="Download anything" /></span>
            <span className="wline">
              <Words text="from Instagram," from={2} />
              <span className="w serif gold-text" style={{ ["--i" as string]: 5 }}>beautifully.</span>
            </span>
          </h1>

          <p className="sub">
            Reels, videos, photos, stories, highlights &amp; profile pictures in flawless HD —
            plus the <b>full caption and every hashtag</b>, one click away.
          </p>

          <ExtractorTool />

          <div className="trust">
            <span><b>✓</b> No login</span>
            <span><b>✓</b> No watermark</span>
            <span><b>✓</b> HD quality</span>
            <span><b>✓</b> Free forever</span>
          </div>

          <div className="chips">
            <div className="chip"><span className="cic">🎬</span><span><b>Flawless HD</b><small>Original quality, zero re-encode</small></span></div>
            <div className="chip"><span className="cic">📋</span><span><b>Caption + Tags</b><small>Full text, one-click copy</small></span></div>
            <div className="chip"><span className="cic">🕵️</span><span><b>Anonymous</b><small>No account, no trace</small></span></div>
            <div className="chip"><span className="cic">⚡</span><span><b>Instant</b><small>Under ten seconds</small></span></div>
          </div>
        </div>
      </header>

      {/* ================= TRENDING MARQUEE ================= */}
      <TrendingReels />

      {/* ================= STATS ================= */}
      <section className="stats reveal">
        <div className="stats-in">
          <div className="stat"><div className="v"><CountUp to={25} suffix="M+" /></div><div className="l">Downloads served</div></div>
          <div className="stat"><div className="v"><CountUp to={2} suffix="M+" /></div><div className="l">Monthly users</div></div>
          <div className="stat"><div className="v"><CountUp to={99.9} decimals={1} suffix="%" /></div><div className="l">Uptime</div></div>
          <div className="stat"><div className="v"><CountUp to={4.9} decimals={1} suffix="★" /></div><div className="l">User rating</div></div>
        </div>
      </section>

      <div className="wrap"><AdSlot label="home-mid" /></div>

      {/* ================= TOOLS ================= */}
      <div className="reveal" style={{ textAlign: "center", marginTop: 90 }}>
        <span className="eyebrow"><span className="rule" />01 — The Collection<span className="rule" /></span>
      </div>
      <h2 className="section-title reveal" style={{ margin: "14px 0 10px" }}>
        Ten tools. <span className="serif gold-text">One</span> golden bar.
      </h2>
      <p className="section-sub reveal">Every downloader you&apos;ll ever need — or just paste any link above.</p>
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

      {/* ================= WHY ================= */}
      <div className="reveal" style={{ textAlign: "center", marginTop: 100 }}>
        <span className="eyebrow"><span className="rule" />02 — The Difference<span className="rule" /></span>
      </div>
      <h2 className="section-title reveal" style={{ margin: "14px 0 10px" }}>
        Built like it costs <span className="serif gold-text">money.</span>
      </h2>
      <p className="section-sub reveal">It doesn&apos;t. But nothing else in this niche feels like this.</p>
      <div className="cards reveal">
        <div className="card"><span className="ic">🎬</span><h3>Original quality</h3><p>The exact file Instagram stores — no re-encoding, no compression, no watermark. What the creator uploaded is what you get.</p></div>
        <div className="card"><span className="ic">📋</span><h3>Caption &amp; hashtags</h3><p>The signature edge. Full caption text, every hashtag and mention — separated, counted, and one click to copy.</p></div>
        <div className="card"><span className="ic">🕵️</span><h3>Truly anonymous</h3><p>No login, no tracking, no history. Story views never register. Your links are never stored.</p></div>
        <div className="card"><span className="ic">🗂️</span><h3>Complete toolkit</h3><p>Reels, video, photos, carousels, stories, highlights, profile pictures — and an anonymous story viewer.</p></div>
      </div>

      {/* ================= HOW ================= */}
      <div className="reveal" style={{ textAlign: "center", marginTop: 100 }}>
        <span className="eyebrow"><span className="rule" />03 — The Ritual<span className="rule" /></span>
      </div>
      <h2 className="section-title reveal" style={{ margin: "14px 0 10px" }}>
        Three steps. <span className="serif gold-text">Ten seconds.</span>
      </h2>
      <div className="cards reveal" style={{ marginTop: 30 }}>
        <div className="card step"><span className="step-num">01</span><h3>Copy the link</h3><p>Open Instagram, tap Share on any reel or post and choose Copy Link. For stories &amp; profile pictures, just grab the @username.</p></div>
        <div className="card step"><span className="step-num">02</span><h3>Paste it above</h3><p>Drop it in the golden bar and hit Download. We fetch everything — media, caption, tags — in one pass.</p></div>
        <div className="card step"><span className="step-num">03</span><h3>Save &amp; copy</h3><p>Download in original HD, and copy the caption or all hashtags with a single tap. Done.</p></div>
      </div>

      {/* ================= PREMIUM BAND ================= */}
      <div className="wrap">
        <section className="premium reveal">
          <div>
            <span className="eyebrow" style={{ marginBottom: 14 }}><span className="rule" />For Creators</span>
            <h2>The complete <span className="serif gold-text">creator</span> toolkit</h2>
            <p>Everything a content creator or social media manager needs — in one fast, clean, beautiful tool.</p>
            <ul>
              <li>Reels, video, IGTV, photo &amp; carousel downloads in HD</li>
              <li>Full caption + every hashtag, one-click copy</li>
              <li>Stories, highlights, anonymous viewer &amp; HD profile pictures</li>
              <li>No login, no watermark, no limits</li>
            </ul>
            <Link href="/caption-extractor" className="btn-gold" style={{ padding: "14px 28px", fontSize: 15 }}>Try the caption extractor →</Link>
          </div>
          <div className="premium-orb"><span>👑</span></div>
        </section>
      </div>

      {/* ================= FAQ ================= */}
      <section className="content">
        <h2>Questions, <span className="serif gold-text">answered.</span></h2>
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
