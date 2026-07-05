import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Story Downloader — Save Stories Before They Disappear",
  description:
    "Save public Instagram stories before they vanish in 24 hours. Enter a username, download story videos and photos in HD — free, no login, anonymous.",
  alternates: { canonical: "/story-downloader" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Story Downloader"
      variant="stories"
      currentHref="/story-downloader"
      h1={<><span className="gold-text">Instagram Story</span> Downloader</>}
      sub="Stories disappear in 24 hours — save the ones that matter. Enter a public username and download every active story in HD."
      placeholder="Enter @username (e.g. nasa)…"
      steps={[
        { title: "Enter the username", body: "Type the public account's @handle or paste their profile URL." },
        { title: "Press Search", body: "InstaGrab pulls every active story from the last 24 hours." },
        { title: "Download", body: "Save each story video or photo in HD before it disappears." },
      ]}
      faqs={[
        { q: "Can I download stories from private accounts?", a: "No — only public accounts. Private content is protected by Instagram and cannot be accessed." },
        { q: "Why did it say no stories?", a: "Stories expire after 24 hours. If the account has none active right now, there's nothing to fetch." },
        { q: "Will the person know I downloaded their story?", a: "No. You never log in, so your download doesn't register as a story view." },
        { q: "Can I save story highlights instead?", a: "Yes — use our Highlights Downloader for saved highlight albums and their covers." },
      ]}
    />
  );
}
