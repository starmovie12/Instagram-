import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Story Downloader — Save Stories Before They Disappear",
  description:
    "Save public Instagram stories before they vanish in 24 hours. Free story downloader — no login, no watermark. Also works for reels, posts and carousels.",
  alternates: { canonical: "/story-downloader" },
};

export default function StoryDownloaderPage() {
  return (
    <ToolPage
      h1={<><span className="grad">Instagram Story</span> Downloader</>}
      sub="Stories disappear in 24 hours — save the ones that matter. Works for public accounts; reels and posts fully supported too."
      placeholder="Paste Instagram story / reel / post link here…"
      steps={[
        "Open the story (on web at instagram.com/stories/username/) and copy the URL.",
        "Paste the link above and press Download.",
        "Save the story video or photo before it disappears.",
      ]}
      faqs={[
        {
          q: "Can I download stories from private accounts?",
          a: "No — only public accounts. Private content is protected by Instagram and cannot be accessed.",
        },
        {
          q: "The story link didn't work. Why?",
          a: "Stories expire after 24 hours, and Instagram guards them more heavily than posts. If a story link fails, the story may have expired or the account may be private. Reels and posts always work best.",
        },
        {
          q: "Will the person know I downloaded their story?",
          a: "No. Downloading through InstaGrab doesn't register as a story view from your account, because you never log in.",
        },
        {
          q: "Can I save story highlights?",
          a: "Highlight support is coming soon. For now, public stories, reels, posts, and carousels are supported.",
        },
      ]}
    />
  );
}
