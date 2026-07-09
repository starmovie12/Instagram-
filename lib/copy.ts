import {
  Clapperboard, CircleDashed, Image as ImageIcon, TextQuote, Hash,
  Video, GalleryHorizontalEnd, Eye, CircleUserRound, BookMarked, LayoutGrid,
  Music, ImageDown, Package, Activity, Gauge, Type, WrapText, ShieldAlert,
  Grid3x3, Disc3,
} from "lucide-react";
import type { Tool } from "@/components/ToolCard";

/** Groups drive the homepage sections and the footer columns. */
export const TOOL_GROUPS: { heading: string; tools: Tool[] }[] = [
  {
    heading: "Downloaders",
    tools: [
      { href: "/reels-downloader", title: "Reels downloader", desc: "Every reel in HD MP4 — with its caption and hashtags.", Icon: Clapperboard },
      { href: "/video-downloader", title: "Video downloader", desc: "Reels, IGTV and video posts — HD MP4, no watermark.", Icon: Video },
      { href: "/story-downloader", title: "Story downloader", desc: "Save public stories before they vanish at 24 hours.", Icon: CircleDashed },
      { href: "/photo-downloader", title: "Photo downloader", desc: "Original quality, untouched. Carousels included.", Icon: ImageIcon },
      { href: "/carousel-downloader", title: "Carousel downloader", desc: "All ten slides, each with its own HD download.", Icon: GalleryHorizontalEnd },
      { href: "/audio-downloader", title: "Audio downloader", desc: "Rip a reel's sound as an M4A — the trending audio, alone.", Icon: Music, badge: "New" },
      { href: "/thumbnail-downloader", title: "Thumbnail downloader", desc: "Any reel or video's HD cover image.", Icon: ImageDown, badge: "New" },
    ],
  },
  {
    heading: "Profile tools",
    tools: [
      { href: "/profile-viewer", title: "Profile viewer", desc: "Bio, stats and a grid of every recent post — anonymously.", Icon: LayoutGrid, badge: "Signature" },
      { href: "/bulk-downloader", title: "Bulk downloader", desc: "A public profile's recent posts in one ZIP.", Icon: Package, badge: "Hot" },
      { href: "/story-viewer", title: "Anonymous story viewer", desc: "Watch public stories without leaving a trace.", Icon: Eye },
      { href: "/highlights-downloader", title: "Highlights downloader", desc: "Covers plus the stories inside each album.", Icon: BookMarked },
      { href: "/profile-picture-downloader", title: "Profile picture downloader", desc: "The full-size HD original, not the tiny circle.", Icon: CircleUserRound },
    ],
  },
  {
    heading: "Creator tools",
    tools: [
      { href: "/caption-extractor", title: "Caption extractor", desc: "The full caption, one click to copy. No retyping.", Icon: TextQuote, badge: "Signature" },
      { href: "/hashtag-extractor", title: "Hashtag extractor", desc: "Every hashtag as chips — copy one or all.", Icon: Hash, badge: "Signature" },
      { href: "/engagement-calculator", title: "Engagement calculator", desc: "Real engagement rate — likes + comments ÷ followers.", Icon: Activity, badge: "Hot" },
      { href: "/profile-audit", title: "Profile audit", desc: "A smart report on posting, timing, hashtags and captions.", Icon: Gauge, badge: "Hot" },
      { href: "/font-generator", title: "Font generator", desc: "Turn your bio into 15+ copy-ready fancy fonts.", Icon: Type, badge: "New" },
      { href: "/caption-fixer", title: "Caption fixer", desc: "Lock your line breaks so captions paste perfectly.", Icon: WrapText, badge: "New" },
      { href: "/hashtag-checker", title: "Banned hashtag checker", desc: "Spot shadowbanned tags before you post.", Icon: ShieldAlert, badge: "Hot" },
      { href: "/grid-splitter", title: "9-grid splitter", desc: "Cut one photo into a 3×3 profile grid.", Icon: Grid3x3, badge: "New" },
      { href: "/dp-ring-maker", title: "Story ring maker", desc: "Add the Instagram story gradient ring to your DP.", Icon: Disc3, badge: "New" },
    ],
  },
];

/** Flat list — used by the sitemap and anywhere that just needs every tool. */
export const TOOLS: Tool[] = TOOL_GROUPS.flatMap((g) => g.tools);

export const QUARTET = [
  { t: "Caption + hashtags included", d: "Others give you a file. We give you the whole post — text, tags and mentions, ready to copy.", icon: "TextQuote", signature: true },
  { t: "One box, everything", d: "Paste a link or a @username — the bar detects it and pulls the media or the whole profile. No page-hopping.", icon: "GalleryHorizontalEnd" },
  { t: "Creator tools, not just downloads", d: "Engagement rate, profile audit, fonts, caption fixer, banned-tag checker — the whole workflow.", icon: "Download" },
  { t: "Nothing stored", d: "Links are processed in memory and never saved. No account, no history, no trace.", icon: "ShieldCheck" },
];
