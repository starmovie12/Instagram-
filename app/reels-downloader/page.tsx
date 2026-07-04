import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Reels Downloader — Save Reels in HD (Free, No Watermark)",
  description:
    "Download Instagram Reels in HD MP4 for free. Paste the reel link, save the video without watermark, and copy the caption + hashtags too. No login needed.",
  alternates: { canonical: "/reels-downloader" },
};

export default function ReelsDownloaderPage() {
  return (
    <ToolPage
      h1={<><span className="grad">Instagram Reels</span> Downloader</>}
      sub="Save any public reel as an HD MP4 — no watermark, no login. Bonus: copy its caption and hashtags in one click."
      placeholder="Paste Instagram reel link here…"
      steps={[
        "Open Instagram, find the reel, tap the share icon (➤) and choose Copy Link.",
        "Paste the link in the box above and press Download.",
        "Tap Download Video (HD) — the MP4 saves straight to your device.",
      ]}
      faqs={[
        {
          q: "What quality will the reel be?",
          a: "The highest quality Instagram serves publicly — usually 1080p for modern reels.",
        },
        {
          q: "Will the reel have a watermark?",
          a: "No. You get the original video file exactly as it exists on Instagram's servers, with no watermark added.",
        },
        {
          q: "Can I also get the reel's music or audio?",
          a: "The downloaded MP4 includes the full audio track. A separate audio-only download is on our roadmap.",
        },
        {
          q: "Why do I also see the caption and hashtags?",
          a: "That's our specialty — creators often want to study a viral reel's caption and hashtags, so we extract them automatically with copy buttons.",
        },
      ]}
    />
  );
}
