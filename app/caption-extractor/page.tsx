import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Caption Extractor — Copy Any Post's Full Caption Text",
  description:
    "Copy the complete caption of any Instagram post or reel in one click. Free caption extractor for creators and social media managers — no login needed.",
  alternates: { canonical: "/caption-extractor" },
};

export default function CaptionExtractorPage() {
  return (
    <ToolPage
      h1={<><span className="grad">Instagram Caption</span> Extractor</>}
      sub="Instagram won't let you select caption text — we will. Paste any post or reel link and copy the full caption in one click."
      placeholder="Paste Instagram post or reel link to extract caption…"
      steps={[
        "Copy the link of the post or reel whose caption you want (••• → Copy Link).",
        "Paste it above and press Download.",
        "Hit Copy Caption — the complete text (with line breaks and emojis) is on your clipboard.",
      ]}
      faqs={[
        {
          q: "Why can't I just copy captions inside the Instagram app?",
          a: "Instagram deliberately doesn't allow selecting or copying caption text in the app. InstaGrab pulls the raw caption text so you can copy all of it — including line breaks and emojis.",
        },
        {
          q: "Who uses a caption extractor?",
          a: "Content creators studying viral posts, social media managers repurposing brand content, translators, and researchers who need the exact text.",
        },
        {
          q: "Does it keep emojis and line breaks?",
          a: "Yes — you get the caption exactly as written, character for character, ready to paste anywhere.",
        },
        {
          q: "Are hashtags and mentions included?",
          a: "The caption copies as-is, and we ALSO extract every hashtag and @mention into separate boxes with their own copy buttons.",
        },
      ]}
    >
      <h2>Why creators love this</h2>
      <div className="feature-grid">
        <div className="feature">
          <div className="emoji">🔍</div>
          <b>Study viral posts</b>
          <p>Analyze exactly how top creators structure captions — hooks, line breaks, CTAs, emoji use.</p>
        </div>
        <div className="feature">
          <div className="emoji">⚡</div>
          <b>One-click copy</b>
          <p>No more manual retyping or screenshot-to-text tricks. Full caption on your clipboard instantly.</p>
        </div>
      </div>
    </ToolPage>
  );
}
