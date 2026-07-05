import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Hashtag Extractor — Copy All Hashtags From Any Post",
  description:
    "Extract every hashtag from any Instagram post or reel and copy them all in one click. Free hashtag research tool for creators — see what viral posts use.",
  alternates: { canonical: "/hashtag-extractor" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Signature Tool · Hashtag Extractor"
      variant="url"
      currentHref="/hashtag-extractor"
      h1={<><span className="gold-text">Instagram Hashtag</span> Extractor</>}
      sub="See exactly which hashtags any viral reel or post used — extracted, separated, and ready to copy all at once."
      placeholder="Paste Instagram post or reel link…"
      steps={[
        { title: "Find a viral post", body: "Copy the link of a top post or reel in your niche (••• → Copy Link)." },
        { title: "Paste it above", body: "Drop the link in the box and press Download." },
        { title: "Copy all hashtags", body: "Every hashtag appears separated — hit Copy All Hashtags and paste into your notes." },
      ]}
      faqs={[
        { q: "How does this help me grow?", a: "Extract the tags from the top posts in your niche, find the recurring ones, and build your own data-backed tag sets." },
        { q: "Are hashtags separated from the caption?", a: "Yes — caption and hashtags come in separate boxes, each with its own copy button. No cleanup needed." },
        { q: "Is there a usage limit?", a: "A gentle rate limit (about 10 posts per minute) keeps the tool fast and free — plenty for research sessions." },
        { q: "Does it show mentions too?", a: "Yes — tagged @mentions are extracted into their own list, handy for finding collaborators." },
      ]}
    >
      <h2>Turn viral posts into your hashtag strategy</h2>
      <div className="cards reveal" style={{ padding: 0 }}>
        <div className="card"><span className="ic">📊</span><h3>Research competitors</h3><p>Extract the exact tag sets top accounts use on their best-performing posts.</p></div>
        <div className="card"><span className="ic">📋</span><h3>Build tag banks</h3><p>Copy all hashtags in one click and organize them into reusable sets for your content.</p></div>
      </div>
    </ToolPage>
  );
}
