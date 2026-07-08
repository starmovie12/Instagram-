import type { Metadata } from "next";
import { TextQuote, Download, GalleryHorizontalEnd, ShieldCheck } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GoldenBar from "@/components/GoldenBar";
import TrustLine from "@/components/TrustLine";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import AdFrame from "@/components/AdFrame";
import ToolCard from "@/components/ToolCard";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { TOOLS, QUARTET } from "@/lib/copy";
import { DEFAULT_FAQ, faqJsonLd, webAppJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "InstaGrab — Download anything from Instagram, beautifully",
  description: "Free Instagram downloader for reels, photos, stories and carousels in HD — plus the full caption and every hashtag. No login. Links never stored.",
};

const QUARTET_ICONS: Record<string, React.ElementType> = {
  TextQuote, Download, GalleryHorizontalEnd, ShieldCheck,
};

export default function Home() {
  return (
    <>
      <JsonLd data={webAppJsonLd()} />
      <JsonLd data={faqJsonLd(DEFAULT_FAQ)} />
      <Nav />
      <main>
        {/* ── Hero ── */}
        <section style={{ position: "relative", padding: "96px 0 72px", textAlign: "center", overflow: "hidden" }}>
          {/* Gold aura */}
          <div aria-hidden="true" style={{
            position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
            width: 900, height: 600, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, rgba(210,172,100,.13), transparent 65%)",
          }} />
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
                    <div className="card" style={{
                      padding: 24, height: "100%", display: "flex", flexDirection: "column", gap: 14,
                      borderColor: f.signature ? "var(--gold-300)" : undefined,
                    }}>
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

        {/* ── Tools grid ── */}
        <section id="tools" className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal>
              <span className="label">Tools</span>
              <h2 style={{ marginTop: 12, marginBottom: 40 }}>One bar, every tool.</h2>
            </Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {TOOLS.map((t, i) => <ToolCard key={t.href} tool={t} index={i} />)}
            </div>
          </div>
        </section>

        {/* Ad slot B */}
        <div className="container" style={{ marginBottom: 72 }}>
          <AdFrame slotH={110} />
        </div>

        <FAQ />
      </main>
      <Footer />
    </>
  );
}
