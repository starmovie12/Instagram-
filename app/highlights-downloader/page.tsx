import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Highlights Downloader — Save Highlight Covers & Stories",
  description:
    "Download Instagram story highlights from any public profile — save highlight covers and the stories inside them in HD. Free, no login, username-based.",
  alternates: { canonical: "/highlights-downloader" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Highlights Downloader"
      variant="highlights"
      currentHref="/highlights-downloader"
      h1={<><span className="gold-text">Instagram Highlights</span> Downloader</>}
      sub="Save whole highlight collections from any public profile — covers plus the stories inside each album, all in HD."
      placeholder="Enter @username (e.g. natgeo)…"
      steps={[
        { title: "Enter the username", body: "Type the public account's @handle or paste their profile URL — not a single post link." },
        { title: "Browse the highlights", body: "Every highlight album loads with its cover image." },
        { title: "Download covers & stories", body: "Save any highlight cover, or tap Load stories to download the clips inside." },
      ]}
      faqs={[
        { q: "What exactly can I save?", a: "Both the highlight cover images and the individual stories inside each highlight album — in HD." },
        { q: "Why use a username instead of a link?", a: "Highlights live on the profile, not on a single post. A username lets us list the full collection at once." },
        { q: "Does it work for private accounts?", a: "No — only public profiles with publicly visible highlights." },
        { q: "Why are some highlights empty?", a: "If an album's stories aren't publicly accessible, only the cover will be available." },
      ]}
    >
      <h2>Why save highlights separately</h2>
      <div className="cards reveal" style={{ padding: 0 }}>
        <div className="card"><span className="ic">🔬</span><h3>Study brand structure</h3><p>Review how brands organize highlights — messaging, themes, and repeat structure.</p></div>
        <div className="card"><span className="ic">🗄️</span><h3>Archive &amp; review</h3><p>Keep tutorials, menus, portfolios, or event recaps available offline.</p></div>
      </div>
    </ToolPage>
  );
}
