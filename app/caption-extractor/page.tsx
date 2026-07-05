import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Caption Extractor — Copy Any Post's Full Caption Text",
  description:
    "Copy the complete caption of any Instagram post or reel in one click. Free caption extractor for creators and social media managers — no login needed.",
  alternates: { canonical: "/caption-extractor" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Signature Tool · Caption Extractor"
      variant="url"
      currentHref="/caption-extractor"
      h1={<><span className="gold-text">Instagram Caption</span> Extractor</>}
      sub="Instagram won't let you select caption text — we will. Paste any post or reel link and copy the full caption in one click."
      placeholder="Paste Instagram post or reel link…"
      steps={[
        { title: "Copy the post link", body: "Copy the link of the post or reel whose caption you want (••• → Copy Link)." },
        { title: "Paste it above", body: "Drop the link in the box and press Download." },
        { title: "Copy the caption", body: "Hit Copy Caption — the full text, with line breaks and emojis, is on your clipboard." },
      ]}
      faqs={[
        { q: "Why can't I copy captions inside the Instagram app?", a: "Instagram deliberately blocks selecting or copying caption text. InstaGrab pulls the raw text so you can copy all of it — line breaks and emojis included." },
        { q: "Who uses a caption extractor?", a: "Creators studying viral posts, social media managers repurposing brand content, translators, and researchers who need the exact text." },
        { q: "Does it keep emojis and line breaks?", a: "Yes — you get the caption exactly as written, character for character." },
        { q: "Are hashtags and mentions included?", a: "The caption copies as-is, and we also extract every hashtag and @mention into separate boxes with their own copy buttons." },
      ]}
    >
      <h2>Why creators love this</h2>
      <div className="cards reveal" style={{ padding: 0 }}>
        <div className="card"><span className="ic">🔍</span><h3>Study viral posts</h3><p>Analyze exactly how top creators structure captions — hooks, line breaks, CTAs, emoji use.</p></div>
        <div className="card"><span className="ic">⚡</span><h3>One-click copy</h3><p>No manual retyping or screenshot-to-text tricks. Full caption on your clipboard instantly.</p></div>
      </div>
    </ToolPage>
  );
}
