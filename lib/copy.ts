import {
  Clapperboard, CircleDashed, Image as ImageIcon, TextQuote, Hash,
  Video, GalleryHorizontalEnd, Eye, CircleUserRound, BookMarked, LayoutGrid,
  Music, ImageDown, Package, Activity, Gauge, Type, WrapText, ShieldAlert,
  Grid3x3, Disc3, ListChecks, BadgeDollarSign, UserX, CalendarClock,
  UserCheck, TextCursorInput, ListOrdered, ServerCrash, Youtube,
  PenLine, Contact, Magnet, Lightbulb, AtSign, Gift, MessagesSquare,
  Languages, Compass, Flame, Mic, Repeat2, Swords, FileText, TrendingUp,
  Coins, Scale, Rocket, Dices, QrCode, Link2, EyeOff, CaseSensitive,
  Scaling, Shrink, Palette, Quote,
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
      { href: "/batch-downloader", title: "Batch downloader", desc: "Paste up to 20 links and grab them all at once.", Icon: ListChecks, badge: "Hot" },
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
      { href: "/profile-battle", title: "Profile battle (VS)", desc: "Two accounts head-to-head — scores, rounds, one winner.", Icon: Swords, badge: "Hot" },
      { href: "/profile-roaster", title: "AI profile roaster", desc: "The AI reads a profile and roasts it. Group-chat gold.", Icon: Flame, badge: "Hot" },
    ],
  },
  {
    heading: "AI tools",
    tools: [
      { href: "/reel-transcript", title: "Reel transcript extractor", desc: "Any reel's spoken script as text — Hindi and Hinglish too.", Icon: Mic, badge: "Signature" },
      { href: "/reel-remix", title: "Reel remix studio", desc: "Steal a viral reel's formula — rewritten for your niche.", Icon: Repeat2, badge: "Signature" },
      { href: "/ai/caption-generator", title: "AI caption generator", desc: "5 ready captions in your tone — English, Hindi or Hinglish.", Icon: PenLine, badge: "Hot" },
      { href: "/ai/hashtag-generator", title: "AI hashtag generator", desc: "30 relevant tags in three smart reach tiers.", Icon: Hash, badge: "New" },
      { href: "/ai/bio-generator", title: "AI bio generator", desc: "10 bios that fit 150 characters — with your vibe.", Icon: Contact, badge: "New" },
      { href: "/ai/reel-script-generator", title: "AI reel script generator", desc: "Hook, timed beats, on-screen text and CTA — full script.", Icon: Clapperboard, badge: "Hot" },
      { href: "/ai/hook-generator", title: "AI hook generator", desc: "10 scroll-stopping first lines from proven patterns.", Icon: Magnet, badge: "New" },
      { href: "/ai/content-ideas", title: "AI content ideas", desc: "30 specific, filmable ideas for your niche.", Icon: Lightbulb, badge: "New" },
      { href: "/ai/username-generator", title: "AI username generator", desc: "20 clean handle ideas — check any of them live.", Icon: AtSign, badge: "New" },
      { href: "/ai/giveaway-caption", title: "AI giveaway caption", desc: "Prize + rules + deadline → a caption that converts.", Icon: Gift, badge: "New" },
      { href: "/ai/reply-generator", title: "AI reply generator", desc: "5 human replies to any comment, in your vibe.", Icon: MessagesSquare, badge: "New" },
      { href: "/ai/caption-translator", title: "AI caption translator", desc: "Natural translation into 18 languages — hashtags kept.", Icon: Languages, badge: "New" },
      { href: "/ai/growth-strategy", title: "AI growth strategy", desc: "A personalised 30-day plan for your niche and goal.", Icon: Compass, badge: "New" },
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
      { href: "/media-kit-generator", title: "Media kit generator", desc: "Your stats and rates on one gold-framed page — free PNG.", Icon: FileText, badge: "Hot" },
      { href: "/invisible-character", title: "Invisible character", desc: "Blank names and unbreakable spacing, one tap to copy.", Icon: EyeOff, badge: "New" },
      { href: "/case-converter", title: "Case converter", desc: "UPPER, lower, Title, aLtErNaTiNg and ꜱᴍᴀʟʟ ᴄᴀᴘꜱ at once.", Icon: CaseSensitive, badge: "New" },
    ],
  },
  {
    heading: "Calculators & analytics",
    tools: [
      { href: "/money-calculator", title: "Money calculator", desc: "Followers + engagement + niche → your rate per post, in ₹ or $.", Icon: BadgeDollarSign, badge: "Hot" },
      { href: "/fake-follower-checker", title: "Fake follower checker", desc: "Grade any audience A+ to F — spot bought followers fast.", Icon: UserX, badge: "Hot" },
      { href: "/follower-tracker", title: "Follower growth tracker", desc: "Log daily counts, watch the chart climb. Private, on-device.", Icon: TrendingUp, badge: "Hot" },
      { href: "/virality-score", title: "Reel virality score", desc: "Rate any reel /100 and learn which lever to pull next.", Icon: Rocket, badge: "New" },
      { href: "/emv-calculator", title: "EMV calculator", desc: "Your post's engagement priced as ad money — ₹ or $.", Icon: Coins, badge: "New" },
      { href: "/follower-ratio-checker", title: "Follower ratio checker", desc: "Followers ÷ following, judged honestly with benchmarks.", Icon: Scale, badge: "New" },
      { href: "/best-time-to-post", title: "Best time to post", desc: "Golden posting windows for your niche — India-first timing.", Icon: CalendarClock, badge: "New" },
    ],
  },
  {
    heading: "Giveaways & links",
    tools: [
      { href: "/wheel-spinner", title: "Wheel spinner", desc: "Paste entrants, spin, crown a provably random winner.", Icon: Dices, badge: "Hot" },
      { href: "/dm-link-generator", title: "DM link generator", desc: "Your ig.me link + a scan-to-DM QR code for print.", Icon: QrCode, badge: "New" },
      { href: "/utm-builder", title: "UTM link builder", desc: "Tag your bio links — see which placement really sells.", Icon: Link2, badge: "New" },
    ],
  },
  {
    heading: "Studio",
    tools: [
      { href: "/photo-resizer", title: "Photo resizer", desc: "Every Instagram size preset — crop-fill or blur-pad, on-device.", Icon: Scaling, badge: "New" },
      { href: "/image-compressor", title: "Image compressor", desc: "Quality slider, live size preview, zero uploads.", Icon: Shrink, badge: "New" },
      { href: "/color-palette", title: "Color palette extractor", desc: "Any photo's 5 signature colors as hex codes.", Icon: Palette, badge: "New" },
      { href: "/quote-maker", title: "Quote post maker", desc: "Editorial quote images — 5 themes, no watermark.", Icon: Quote, badge: "New" },
    ],
  },
  {
    heading: "Utilities",
    tools: [
      { href: "/username-checker", title: "Username checker", desc: "Is that @handle free? Instant check + smart alternatives.", Icon: UserCheck, badge: "New" },
      { href: "/character-counter", title: "Character counter", desc: "Caption, bio and hashtag limits counted live — with the “more” fold.", Icon: TextCursorInput, badge: "New" },
      { href: "/hashtag-counter", title: "Hashtag counter & cleaner", desc: "Count, dedupe and trim your tags to a clean set of 30.", Icon: ListOrdered, badge: "New" },
      { href: "/is-instagram-down", title: "Is Instagram down?", desc: "Live server check — outage, or just you?", Icon: ServerCrash, badge: "New" },
      { href: "/youtube-thumbnail-downloader", title: "YouTube thumbnail downloader", desc: "Any video's thumbnail in full HD — Shorts included.", Icon: Youtube, badge: "New" },
    ],
  },
];

/** Flat list — used by the sitemap and anywhere that just needs every tool. */
export const TOOLS: Tool[] = TOOL_GROUPS.flatMap((g) => g.tools);

export const QUARTET = [
  { t: "Caption + hashtags included", d: "Others give you a file. We give you the whole post — text, tags and mentions, ready to copy.", icon: "TextQuote", signature: true },
  { t: "One box, everything", d: "Paste a link or a @username — the bar detects it and pulls the media or the whole profile. No page-hopping.", icon: "GalleryHorizontalEnd" },
  { t: "AI that speaks Hinglish", d: "Captions, bios, reel scripts, hooks — generated in English, Hindi ya full desi Hinglish. Koi aur nahi deta.", icon: "Download" },
  { t: "Nothing stored", d: "Links are processed in memory and never saved. No account, no history, no trace.", icon: "ShieldCheck" },
];
