import type { Metadata } from "next";
import ToolPage from "@/components/ToolPage";

export const metadata: Metadata = {
  title: "Instagram Carousel Downloader — Save All Slides at Once (Free)",
  description:
    "Download every slide of an Instagram carousel post — photos and videos — in HD. Each slide gets its own button. Free, no login, plus caption + hashtags.",
  alternates: { canonical: "/carousel-downloader" },
};

export default function Page() {
  return (
    <ToolPage
      eyebrow="Carousel Downloader"
      variant="url"
      currentHref="/carousel-downloader"
      h1={<><span className="accent">Instagram Carousel</span> Downloader</>}
      sub="Grab every slide of a multi-photo/video post at once — each in HD, each with its own download button."
      placeholder="Paste Instagram carousel post link…"
      steps={[
        { title: "Copy the carousel link", body: "On the multi-slide post, tap ••• and choose Copy Link." },
        { title: "Paste it above", body: "Drop the link in the box and press Download." },
        { title: "Save each slide", body: "Every photo and video appears separately with its own HD download button." },
      ]}
      faqs={[
        { q: "Can I download all slides at once?", a: "Each slide has its own button so you choose exactly what to save — photos and videos alike." },
        { q: "Do videos inside the carousel work too?", a: "Yes — mixed photo/video carousels are fully supported." },
        { q: "What about the caption and hashtags?", a: "They're extracted once for the whole post, with copy buttons — as with every InstaGrab tool." },
        { q: "Is there a slide limit?", a: "No — every slide in the carousel is returned." },
      ]}
    />
  );
}
