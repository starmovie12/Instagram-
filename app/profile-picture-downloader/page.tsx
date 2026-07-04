import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Profile Picture Downloader — Save DP / PFP in Full HD",
  description:
    "View and download any public Instagram profile picture (DP) in full HD. Enter a username, get the full-size photo instantly. Free, no login.",
  alternates: { canonical: "/profile-picture-downloader" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Profile Picture Downloader"
      variant="dp"
      currentHref="/profile-picture-downloader"
      h1={<><span className="accent">Profile Picture</span> Downloader</>}
      sub="Instagram shrinks profile photos to a tiny circle. Enter any public username to view and download the full-size HD original."
      placeholder="Enter @username (e.g. cristiano)…"
      steps={[
        { title: "Enter the username", body: "Type the public account's @handle or paste their profile URL." },
        { title: "Press Search", body: "InstaGrab fetches the full-resolution profile picture and account stats." },
        { title: "Download HD", body: "Save the full-size DP — far larger than the thumbnail Instagram shows." },
      ]}
      faqs={[
        { q: "What size is the downloaded picture?", a: "The full HD original Instagram stores (typically 320–1080px), not the tiny circle shown in the app." },
        { q: "Does it work for private accounts?", a: "Profile pictures of private accounts may be limited. Public accounts always work in full HD." },
        { q: "Will the person be notified?", a: "No. There's no login and no interaction with their account — it's completely private." },
        { q: "Can I zoom into someone's DP?", a: "Yes — downloading the HD version lets you see the full picture clearly, not the cropped thumbnail." },
      ]}
    />
  );
}
