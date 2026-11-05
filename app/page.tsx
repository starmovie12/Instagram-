import type { Metadata } from "next";
import HowToButton from "@/components/HowToButton";
import HeroBanner from "@/components/HeroBanner";
import SmartLinkBox from "@/components/SmartLinkBox";
import HomeToolsGrid from "@/components/HomeToolsGrid";
import JsonLd from "@/components/JsonLd";
import HomeEntrance from "@/components/motion/HomeEntrance";
import { webAppJsonLd } from "@/lib/seo";
import "./home.css";

export const metadata: Metadata = {
  title: { absolute: "InstaGrab — Instagram Reels, Story, Caption & Hashtag Downloader" },
  description:
    "Free Instagram downloader for reels, photos, stories and carousels in HD — plus the full caption and every hashtag. No login. Links never stored.",
  alternates: { canonical: "/" },
};

/**
 * Home (PRD §7, AC-5): Header → Banner → Smart Link Box → How to Download →
 * Tools & Platforms — and nothing after (no footer, FAQ, ad or result; the box only
 * routes). Header + Island/Rail come from AppShell. Static, zero network calls.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={webAppJsonLd()} />
      <HomeEntrance />
      <main className="home">
        <div className="home-rise" style={{ ["--rise-delay" as string]: "0ms" }}>
          <HeroBanner />
        </div>
        <div className="home-rise home__box" style={{ ["--rise-delay" as string]: "60ms" }}>
          <SmartLinkBox />
        </div>
        <HowToButton />
        <HomeToolsGrid />
      </main>
    </>
  );
}
