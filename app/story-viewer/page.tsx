import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Anonymous Instagram Story Viewer — Watch Stories Without Being Seen",
  description:
    "Watch public Instagram stories anonymously — no login, no trace, the account owner never knows. View and optionally download in HD. Free.",
  alternates: { canonical: "/story-viewer" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Anonymous Story Viewer"
      variant="viewer"
      currentHref="/story-viewer"
      h1={<><span className="accent">Anonymous</span> Story Viewer</>}
      sub="Watch public Instagram stories without leaving a trace. No login, no view registered — the account owner never knows you looked."
      placeholder="Enter @username to view stories…"
      steps={[
        { title: "Enter the username", body: "Type the public account's @handle or paste their profile URL." },
        { title: "Press View", body: "Every active story loads right here — completely anonymously." },
        { title: "Watch or save", body: "View each story privately, and download any of them in HD if you like." },
      ]}
      faqs={[
        { q: "Is it really anonymous?", a: "Yes. Because you never log in, viewing here never registers as a story view on the owner's account." },
        { q: "Does it work for private accounts?", a: "No — only public accounts. Private stories are protected by Instagram." },
        { q: "Can I download the stories I view?", a: "Yes — each story has an HD download button alongside the preview." },
        { q: "Do you keep any record of what I viewed?", a: "No. We don't store usernames, links, or any browsing history." },
      ]}
    />
  );
}
