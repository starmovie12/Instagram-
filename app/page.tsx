import type { Metadata } from "next";
import Link from "next/link";
import { TextQuote, Download, GalleryHorizontalEnd, ShieldCheck } from "lucide-react";
import Nav from "@/components/Nav";
import InstallAppButton from "@/components/InstallAppButton";
import Footer from "@/components/Footer";
import GoldenBar from "@/components/GoldenBar";
import TrustLine from "@/components/TrustLine";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import AdFrame from "@/components/AdFrame";
import ToolCard from "@/components/ToolCard";
import RecentTools from "@/components/RecentTools";
import ToolOfTheDay from "@/components/ToolOfTheDay";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { TOOL_GROUPS, QUARTET } from "@/lib/copy";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { DEFAULT_FAQ, faqJsonLd, webAppJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "InstaGrab — Instagram Reels, Story, Caption & Hashtag Downloader",
  description:
    "Free Instagram downloader for reels, photos, stories and carousels in HD — plus the full caption and every hashtag. No login. Links never stored.",
  alternates: {
    canonical: "/",
  },
};

const QUARTET_ICONS: Record<string, React.ElementType> = {
  TextQuote,
  Download,
  GalleryHorizontalEnd,
  ShieldCheck,
};

export default function Home() {
  const featuredGuides = BLOG_POSTS.slice(0, 6);

  return (
    <>
      <JsonLd data={webAppJsonLd()} />
      <JsonLd data={faqJsonLd(DEFAULT_FAQ)} />
      <Nav />
      <div className="container">
        <InstallAppButton variant="card" />
      </div>
      <main>
        {/* ── Hero ── */}
        <section style={{ position: "relative", padding: "96px 0 72px", textAlign: "center", overflow: "hidden" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 900,
              height: 600,
              pointerEvents: "none",
              background: "radial-gradient(ellipse at center, rgba(210,172,100,.13), transparent 65%)",
            }}
          />
          <div className="container" style={{ position: "relative" }}>
            <p className="label intro-rise" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--gold-ink)" }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--molten)", display: "inline-block" }} />
              The gold standard of Instagram tools
            </p>
            <h1 style={{ margin: "24px auto 0", maxWidth: "16ch" }}>
              <span className="mask"><span>Download anything</span></span>
              <span className="mask"><span style={{ ["--dl" as string]: "140ms" }}>from Instagram,</span></span>
              <span className="mask"><span style={{ ["--dl" as string]: "220ms" }}><em className="gilded">beautifully</em>.</span></span>
            </h1>
            <p className="lead intro-rise" style={{ margin: "24px auto 0", ["--dl" as string]: "300ms" }}>
              Reels, photos, stories and carousels in flawless HD — plus the full caption
              and every hashtag, one click away.
            </p>
            <div className="intro-rise" style={{ marginTop: 40, ["--dl" as string]: "400ms" }}>
              <GoldenBar intro />
            </div>
            <div className="intro-rise" style={{ marginTop: 20, ["--dl" as string]: "500ms" }}>
              <TrustLine />
            </div>
            <RecentTools />
            <ToolOfTheDay />
          </div>
        </section>

        {/* ── Feature quartet ── */}
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {QUARTET.map((f, i) => {
                const Icon = QUARTET_ICONS[f.icon];
                return (
                  <Reveal key={f.t} index={i}>
                    <div
                      className="card"
                      style={{
                        padding: 24,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        borderColor: f.signature ? "var(--gold-300)" : undefined,
                      }}
                    >
                      <span className="medallion"><Icon size={24} strokeWidth={1.5} /></span>
                      <h3 style={{ fontSize: 18 }}>{f.t}</h3>
                      <p style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}>{f.d}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* ── Focused Core Tools Grid ── */}
        <section id="tools" className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <span className="label">Core Toolkit</span>
              <h2 style={{ marginTop: 12, marginBottom: 8 }}>One bar, every core extractor.</h2>
              <p className="lead" style={{ marginBottom: 40 }}>
                Download HD media, extract captions and hashtags, and view public profiles anonymously.
              </p>
            </Reveal>
            {TOOL_GROUPS.map((group) => (
              <div key={group.heading} style={{ marginBottom: 48 }}>
                <Reveal>
                  <span className="label" style={{ display: "block", marginBottom: 20, color: "var(--gold-ink)" }}>
                    {group.heading}
                  </span>
                </Reveal>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                  {group.tools.map((t, i) => <ToolCard key={t.href} tool={t} index={i} />)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Direct Crawl Links to Creator Blog Guides (Fixes "Discovered - currently not indexed") ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <span className="label">Creator Guides</span>
              <h2 style={{ marginTop: 12, marginBottom: 8 }}>Instagram growth &amp; hashtag research guides</h2>
              <p className="lead" style={{ marginBottom: 32 }}>
                Practical playbooks for reels, captions, hashtags, and content repurposing.
              </p>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {featuredGuides.map((post, i) => (
                <Reveal key={post.slug} index={i}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 24,
                      height: "100%",
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div>
                      <time dateTime={post.date} className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                        {post.date}
                      </time>
                      <h3 style={{ fontSize: 18, margin: "10px 0 8px" }}>{post.title}</h3>
                      <p style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}>{post.description}</p>
                    </div>
                    <span className="mono" style={{ display: "inline-block", marginTop: 14, fontSize: 13, color: "var(--gold-ink)" }}>
                      Read guide →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="container" style={{ marginBottom: 72 }}>
          <AdFrame slotH={110} />
        </div>

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
