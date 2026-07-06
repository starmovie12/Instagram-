import {
  Clapperboard, CircleDashed, Image as ImageIcon, TextQuote, Hash,
  Video, GalleryHorizontalEnd, Eye, CircleUserRound, BookMarked,
} from "lucide-react";
import type { Tool } from "@/components/ToolCard";

export const TOOLS: Tool[] = [
  { href: "/reels-downloader", title: "Reels downloader", desc: "Every reel in HD MP4 — with its caption and hashtags.", Icon: Clapperboard },
  { href: "/video-downloader", title: "Video downloader", desc: "Reels, IGTV and video posts — HD MP4, no watermark.", Icon: Video },
  { href: "/story-downloader", title: "Story downloader", desc: "Save public stories before they vanish at 24 hours.", Icon: CircleDashed },
  { href: "/photo-downloader", title: "Photo downloader", desc: "Original quality, untouched. Carousels included.", Icon: ImageIcon },
  { href: "/carousel-downloader", title: "Carousel downloader", desc: "All ten slides, each with its own HD download.", Icon: GalleryHorizontalEnd },
  { href: "/story-viewer", title: "Anonymous story viewer", desc: "Watch public stories without leaving a trace.", Icon: Eye },
  { href: "/highlights-downloader", title: "Highlights downloader", desc: "Covers plus the stories inside each album.", Icon: BookMarked },
  { href: "/profile-picture-downloader", title: "Profile picture downloader", desc: "The full-size HD original, not the tiny circle.", Icon: CircleUserRound },
  { href: "/caption-extractor", title: "Caption extractor", desc: "The full caption, one click to copy. No retyping.", Icon: TextQuote, signature: true },
  { href: "/hashtag-extractor", title: "Hashtag extractor", desc: "Every hashtag as chips — copy one or all.", Icon: Hash, signature: true },
];

export const QUARTET = [
  { t: "Caption + hashtags included", d: "Others give you a file. We give you the whole post — text, tags and mentions, ready to copy.", icon: "TextQuote", signature: true },
  { t: "Every quality, listed", d: "1080p, 720p, thumbnail — pick exactly the file you need, labeled with size.", icon: "Download" },
  { t: "Carousels, complete", d: "All ten slides, not just the first. Download each or grab them all.", icon: "GalleryHorizontalEnd" },
  { t: "Nothing stored", d: "Links are processed in memory and never saved. No account, no history, no trace.", icon: "ShieldCheck" },
];
