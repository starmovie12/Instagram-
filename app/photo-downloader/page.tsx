import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Photo Downloader — Save Photos & Carousels in Full HD",
  description:
    "Download Instagram photos and full carousel posts in original HD quality. Free, no login. Every slide gets its own download button, plus caption + hashtags.",
  alternates: { canonical: "/photo-downloader" },
};

export default function PhotoDownloaderPage() {
  return (
    <ToolPage
      h1={<><span className="grad">Instagram Photo</span> Downloader</>}
      sub="Save any public photo or full carousel post in original resolution — every slide gets its own download button."
      placeholder="Paste Instagram photo or carousel link here…"
      steps={[
        "On the Instagram post, tap ••• (three dots) and choose Copy Link.",
        "Paste the link above and hit Download.",
        "For carousels, each slide appears with its own HD download button.",
      ]}
      faqs={[
        {
          q: "Does it work with multi-photo (carousel) posts?",
          a: "Yes — every photo and video in the carousel is extracted, each with its own download button.",
        },
        {
          q: "What resolution are the photos?",
          a: "The original full resolution that Instagram stores — typically 1080px wide or higher.",
        },
        {
          q: "Can I download my own photos back from Instagram?",
          a: "Absolutely — that's one of the most common uses, recovering your own photos when you've lost the originals.",
        },
        {
          q: "Do you keep a copy of downloaded photos?",
          a: "No. Nothing is stored on our servers — media streams directly from Instagram's CDN to your device.",
        },
      ]}
    />
  );
}
