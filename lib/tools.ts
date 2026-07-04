/** Central registry of every downloader/tool — drives nav, homepage grid, footer. */
export type Tool = {
  href: string;
  label: string;   // short nav label
  name: string;    // full card name
  icon: string;
  desc: string;
  /** "url" = paste a post/reel link · "username" = enter a profile @handle */
  mode: "url" | "username";
  badge?: string;
  /** show in the top nav */
  nav?: boolean;
};

export const TOOLS: Tool[] = [
  {
    href: "/reels-downloader",
    label: "Reels",
    name: "Reels Downloader",
    icon: "🎬",
    desc: "Save any public reel as HD MP4 — no watermark.",
    mode: "url",
    nav: true,
  },
  {
    href: "/video-downloader",
    label: "Video",
    name: "Video Downloader",
    icon: "▶️",
    desc: "Download any Instagram video or IGTV in HD.",
    mode: "url",
    nav: true,
  },
  {
    href: "/photo-downloader",
    label: "Photos",
    name: "Photo Downloader",
    icon: "🖼️",
    desc: "Save photos & full carousel posts in original quality.",
    mode: "url",
    nav: true,
  },
  {
    href: "/story-downloader",
    label: "Stories",
    name: "Story Downloader",
    icon: "⭕",
    desc: "Save public stories before they vanish in 24h.",
    mode: "username",
    nav: true,
  },
  {
    href: "/story-viewer",
    label: "Viewer",
    name: "Anonymous Story Viewer",
    icon: "👁️",
    desc: "Watch public stories anonymously — no trace, no login.",
    mode: "username",
  },
  {
    href: "/highlights-downloader",
    label: "Highlights",
    name: "Highlights Downloader",
    icon: "✨",
    desc: "Save highlight covers and their stories from any public profile.",
    mode: "username",
    badge: "New",
  },
  {
    href: "/profile-picture-downloader",
    label: "DP / PFP",
    name: "Profile Picture Downloader",
    icon: "🪪",
    desc: "Download any public profile photo (DP) in full HD.",
    mode: "username",
  },
  {
    href: "/carousel-downloader",
    label: "Carousel",
    name: "Carousel Downloader",
    icon: "🎠",
    desc: "Grab every slide of a multi-photo/video post.",
    mode: "url",
  },
  {
    href: "/caption-extractor",
    label: "Captions",
    name: "Caption Extractor",
    icon: "📋",
    desc: "Copy the full caption text of any post or reel.",
    mode: "url",
    badge: "Signature",
    nav: true,
  },
  {
    href: "/hashtag-extractor",
    label: "Hashtags",
    name: "Hashtag Extractor",
    icon: "#️⃣",
    desc: "Extract & copy every hashtag for research.",
    mode: "url",
    badge: "Signature",
    nav: true,
  },
];

export const NAV_TOOLS = TOOLS.filter((t) => t.nav);
