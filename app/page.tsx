import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "InstaGrab — Download Instagram Reels, Photos & Get Caption + Hashtags Free",
  description:
    "Paste any Instagram link → download reels, photos & carousels in HD, plus copy the full caption and every hashtag in one click. Free, no login required.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <ToolPage
      h1={<>Download Instagram Reels &amp; Photos — <span className="grad">with Caption + Hashtags</span></>}
      sub="The only downloader that also extracts the full caption and every hashtag — made for creators, social media managers, and everyone else."
      steps={[
        "Copy the link of any public Instagram reel, post, or carousel (tap ••• → Copy Link).",
        "Paste it in the box above and hit Download.",
        "Save the media in HD, and copy the caption or all hashtags with one click.",
      ]}
      faqs={[
        {
          q: "Is InstaGrab really free?",
          a: "Yes — completely free, no login, no signup, no watermark. It works on mobile and desktop.",
        },
        {
          q: "Can I download from private accounts?",
          a: "No. Only public content can be downloaded. Private accounts are protected by Instagram and we respect that.",
        },
        {
          q: "What makes InstaGrab different from other downloaders?",
          a: "Besides HD downloads, InstaGrab extracts the full caption text, all hashtags, mentions, and the video thumbnail — a complete toolkit for content creators and social media managers.",
        },
        {
          q: "Is it legal to download Instagram content?",
          a: "Downloading is fine for content you own or have permission to use (or for personal offline viewing). Re-uploading someone else's content without permission may violate copyright — always credit and get consent.",
        },
        {
          q: "Do you store the videos or photos?",
          a: "No. We don't host or store any content. Media is fetched directly from Instagram's public servers and streamed to your device.",
        },
      ]}
    >
      <h2>One tool, everything a creator needs</h2>
      <div className="feature-grid">
        <div className="feature">
          <div className="emoji">🎬</div>
          <b>Reels &amp; Video in HD</b>
          <p>Download any public reel or video post in the highest available quality — no watermark.</p>
        </div>
        <div className="feature">
          <div className="emoji">📋</div>
          <b>Full Caption Copy</b>
          <p>Get the complete caption text with one click — perfect for studying what makes posts go viral.</p>
        </div>
        <div className="feature">
          <div className="emoji">#️⃣</div>
          <b>Hashtag Extractor</b>
          <p>Every hashtag pulled out and separated, ready to copy all at once for your own research.</p>
        </div>
        <div className="feature">
          <div className="emoji">🖼️</div>
          <b>Thumbnails &amp; Carousels</b>
          <p>Download the video cover image separately, and grab every slide of a carousel post.</p>
        </div>
      </div>
    </ToolPage>
  );
}
