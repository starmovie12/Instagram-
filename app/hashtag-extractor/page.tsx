import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Hashtag Extractor — Copy All Hashtags From Any Post",
  description:
    "Extract every hashtag from any Instagram post or reel and copy them all in one click. Free hashtag research tool for creators — see what viral posts use.",
  alternates: { canonical: "/hashtag-extractor" },
};

export default function HashtagExtractorPage() {
  return (
    <ToolPage
      h1={<><span className="grad">Instagram Hashtag</span> Extractor</>}
      sub="See exactly which hashtags any viral reel or post used — extracted, separated, and ready to copy all at once."
      placeholder="Paste Instagram post or reel link to extract hashtags…"
      steps={[
        "Find a viral post or reel in your niche and copy its link (••• → Copy Link).",
        "Paste it above and press Download.",
        "Every hashtag appears separated — hit Copy All Hashtags and paste into your notes.",
      ]}
      faqs={[
        {
          q: "How is this useful for growing my account?",
          a: "Hashtag research is one of the fastest ways to learn what works in your niche. Extract the tags from the top 10 viral posts in your niche, find the recurring ones, and build your own tag sets.",
        },
        {
          q: "Do I get the hashtags separated from the caption?",
          a: "Yes — the caption and the hashtags come in separate boxes, each with its own copy button. No manual cleanup needed.",
        },
        {
          q: "Is there a limit on how many posts I can analyze?",
          a: "A gentle rate limit (about 10 posts per minute) keeps the tool fast and free for everyone. That's plenty for research sessions.",
        },
        {
          q: "Does it also show mentions (@accounts)?",
          a: "Yes — tagged @mentions are extracted into their own list too, handy for finding collaborators in your niche.",
        },
      ]}
    >
      <h2>Turn viral posts into your hashtag strategy</h2>
      <div className="feature-grid">
        <div className="feature">
          <div className="emoji">📊</div>
          <b>Research competitors</b>
          <p>Extract the exact tag sets top accounts in your niche use on their best-performing posts.</p>
        </div>
        <div className="feature">
          <div className="emoji">📋</div>
          <b>Build tag banks</b>
          <p>Copy all hashtags in one click and organize them into reusable sets for your own content.</p>
        </div>
      </div>
    </ToolPage>
  );
}
