import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "What InstaGrab is, who it's for, and how it works.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="page">
      <h1>About InstaGrab</h1>
      <p>
        InstaGrab is a free creator utility for Instagram: paste any public
        post, reel, or carousel link and get the media in HD — plus the full
        caption text, every hashtag, and tagged mentions, each with a one-click
        copy button.
      </p>
      <h2>Why we built it</h2>
      <p>
        Plenty of tools download videos. Almost none help with the part
        creators actually study — the caption and the hashtag strategy behind a
        viral post. Instagram doesn&apos;t even let you select caption text in the
        app. InstaGrab treats the text as a first-class output, not an
        afterthought.
      </p>
      <h2>Who it&apos;s for</h2>
      <ul>
        <li>Content creators studying what works in their niche</li>
        <li>Social media managers repurposing brand content</li>
        <li>Hashtag researchers building data-backed tag sets</li>
        <li>Anyone saving their own content or public posts for offline viewing</li>
      </ul>
      <h2>Our principles</h2>
      <ul>
        <li><strong>No login, ever.</strong> We will never ask for your Instagram credentials.</li>
        <li><strong>Public content only.</strong> Private accounts stay private.</li>
        <li><strong>We host nothing.</strong> Media streams directly from Instagram&apos;s servers to you.</li>
        <li><strong>Respect creators.</strong> Download what you own or have permission to use — see our <Link href="/dmca">DMCA policy</Link>.</li>
      </ul>
      <p>
        Questions or feedback? <Link href="/contact">Get in touch</Link>.
      </p>
    </main>
  );
}
