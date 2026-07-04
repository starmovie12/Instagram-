import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Video Downloader — Save Videos & IGTV in HD (Free)",
  description:
    "Download any Instagram video, reel or IGTV in HD MP4 for free. Fast, anonymous, no watermark, no login. Plus caption and hashtag extraction.",
  alternates: { canonical: "/video-downloader" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Video Downloader"
      variant="url"
      currentHref="/video-downloader"
      h1={<><span className="accent">Instagram Video</span> Downloader</>}
      sub="Save any public Instagram video, reel or IGTV in HD MP4 — fast, free, anonymous, no watermark."
      placeholder="Paste Instagram video / reel / IGTV link…"
      steps={[
        { title: "Copy the video link", body: "Open the post, tap ••• (or the share icon) and choose Copy Link." },
        { title: "Paste it above", body: "Drop the link in the box and press Download." },
        { title: "Save the MP4", body: "Download the video in the best available quality to your device." },
      ]}
      faqs={[
        { q: "Does it work with IGTV and long videos?", a: "Yes — IGTV, reels, and standard video posts all work through the same box." },
        { q: "Are there any download limits?", a: "No hard limit for normal use. A gentle rate limit keeps the tool fast and abuse-free." },
        { q: "Which devices are supported?", a: "Any device with a browser — iPhone, Android, tablet, or computer. No app or account needed." },
        { q: "Is it anonymous?", a: "Completely. You never log in, and we don't store your links." },
      ]}
    />
  );
}
