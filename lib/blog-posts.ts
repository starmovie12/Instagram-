export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Simple content blocks — h2 heading, paragraph, or bullet list */
  content: Array<
    | { type: "p"; text: string }
    | { type: "h2"; text: string }
    | { type: "ul"; items: string[] }
  >;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-download-instagram-reels-with-caption",
    title: "How to Download Instagram Reels WITH the Caption and Hashtags (2026)",
    description:
      "Most downloaders only save the video. Here's how to get the reel, its full caption, and every hashtag in one step — free.",
    date: "2026-07-04",
    content: [
      { type: "p", text: "If you've ever tried to save an Instagram reel for inspiration, you know the frustration: the video downloads fine, but the caption — often the most valuable part — is impossible to copy from the app. Instagram deliberately blocks text selection on captions." },
      { type: "h2", text: "The one-step method" },
      { type: "ul", items: [
        "Open the reel in Instagram and tap the share icon (➤), then Copy Link.",
        "Go to InstaGrab and paste the link in the box.",
        "Press Download — you'll get the HD video, the full caption with a copy button, and every hashtag separated out.",
      ]},
      { type: "h2", text: "Why the caption matters more than the video" },
      { type: "p", text: "For creators studying what goes viral, the caption is the strategy: the hook in the first line, the structure, the call-to-action, and the hashtag set. Saving only the video throws away half the lesson. That's why a downloader that extracts text is a genuinely different tool from the dozens that only save MP4s." },
      { type: "h2", text: "Is this allowed?" },
      { type: "p", text: "Downloading public content for personal study or archiving your own posts is fine. Re-uploading someone else's reel without permission can violate copyright — if you repurpose, always get consent and give credit." },
    ],
  },
  {
    slug: "best-time-to-post-reels",
    title: "Best Time to Post Instagram Reels in 2026 (What Actually Matters)",
    description:
      "Generic 'best time' charts are mostly noise. Here's how timing really works on Reels and how to find YOUR best posting window.",
    date: "2026-07-03",
    content: [
      { type: "p", text: "Search 'best time to post reels' and you'll find a hundred conflicting charts. The truth: there is no universal best time, because Reels distribution is driven by early engagement velocity from YOUR audience — not by the clock itself." },
      { type: "h2", text: "The principle behind timing" },
      { type: "p", text: "When you post, Instagram shows the reel to a small test batch of your followers and similar users. If that batch engages quickly, distribution expands. So the goal is simple: post when the largest slice of your specific audience is actively scrolling." },
      { type: "h2", text: "How to find your window in 10 minutes" },
      { type: "ul", items: [
        "Switch to a Professional account (free) and open Insights → Total followers → Most active times.",
        "Post 30–60 minutes BEFORE your audience's peak, so the reel is fresh when they arrive.",
        "Test the same content type at 3 different times over two weeks and compare the first-hour views.",
      ]},
      { type: "h2", text: "Reasonable starting points (until you have data)" },
      { type: "ul", items: [
        "Weekdays: 11 AM – 1 PM (lunch scroll) and 7 – 9 PM (evening scroll), in your audience's timezone.",
        "Weekends: mornings tend to outperform, 9 – 11 AM.",
        "Consistency beats perfect timing — 4 reels a week at a decent time beats 1 reel at the 'perfect' time.",
      ]},
    ],
  },
  {
    slug: "find-trending-hashtags-instagram",
    title: "How to Find Trending Instagram Hashtags in Your Niche (Free Method)",
    description:
      "No paid tools needed. A simple reverse-engineering workflow: extract hashtags from viral posts in your niche and build data-backed tag sets.",
    date: "2026-07-02",
    content: [
      { type: "p", text: "Hashtags won't rescue a bad reel, but on a good one they help Instagram categorize your content and surface it to the right audience. The fastest free research method is reverse-engineering: look at what's already working in your niche." },
      { type: "h2", text: "The reverse-engineering workflow" },
      { type: "ul", items: [
        "Find 10 recent viral posts in your niche (search your main keyword, sort by what the Explore page surfaces).",
        "Extract the full hashtag set from each post using a hashtag extractor — one click per post instead of manual retyping.",
        "Paste all sets into a note and count which tags repeat. Tags appearing in 4+ viral posts are your niche's core tags.",
        "Build 3 rotating sets of ~10–15 tags: core niche tags + medium-size tags (50k–500k posts) + a few small specific tags (<50k).",
      ]},
      { type: "h2", text: "Mistakes that hurt" },
      { type: "ul", items: [
        "Using the same 30 tags on every post — Instagram reads this as spammy.",
        "Only using giant tags (#love, #instagood) — you drown in seconds.",
        "Irrelevant trending tags — categorization gets confused and reach suffers.",
      ]},
      { type: "p", text: "Refresh your research monthly. Niches move fast, and last quarter's hot tags quietly die." },
    ],
  },
  {
    slug: "repurpose-instagram-content-legally",
    title: "How to Repurpose Instagram Content Legally (Creator's Guide)",
    description:
      "Reposting isn't automatically fair use. What you can and can't do with downloaded Instagram content, and how to get permission the easy way.",
    date: "2026-07-01",
    content: [
      { type: "p", text: "Downloading a public Instagram post takes two seconds. Whether you can re-use it is a different question — and getting it wrong can mean copyright strikes or account bans. Here's the practical version of the rules." },
      { type: "h2", text: "Generally fine" },
      { type: "ul", items: [
        "Downloading your OWN content — recovering originals you've lost.",
        "Personal offline viewing and private study/research (e.g., analyzing captions and hashtags).",
        "Reposting with the creator's explicit permission, with credit.",
      ]},
      { type: "h2", text: "Risky or not allowed" },
      { type: "ul", items: [
        "Re-uploading someone's reel to your account without permission — even 'with credit', credit is not a license.",
        "Monetizing compilations of other people's clips.",
        "Removing watermarks/credits to hide the source.",
      ]},
      { type: "h2", text: "Getting permission is easier than you think" },
      { type: "p", text: "Most small creators say yes to a polite DM: who you are, where you'd repost, and that you'll tag them. Screenshot the approval and keep it. For meme pages and curation accounts, this one habit prevents nearly all takedown drama." },
    ],
  },
  {
    slug: "instagram-story-vs-reel-vs-post",
    title: "Story vs Reel vs Post: Where Should Your Content Go?",
    description:
      "Each format has a different job. A quick decision framework for choosing where each piece of content performs best.",
    date: "2026-06-30",
    content: [
      { type: "p", text: "Creators waste reach by publishing the right content in the wrong format. The three formats have fundamentally different distribution: Reels reach strangers, Posts serve your profile, Stories serve your existing fans." },
      { type: "h2", text: "Reels — the growth engine" },
      { type: "p", text: "Reels are the only format Instagram aggressively shows to non-followers. Use them for anything meant to grow your account: hooks, tips, entertainment, trends. Optimize the first 1.5 seconds — that's where the scroll-past happens." },
      { type: "h2", text: "Posts (feed/carousel) — the portfolio" },
      { type: "p", text: "When someone lands on your profile, your grid decides whether they follow. Carousels also get strong saves and re-surfacing — Instagram may show slide 2 to people who scrolled past slide 1. Use posts for depth: guides, before/afters, multi-step value." },
      { type: "h2", text: "Stories — the relationship" },
      { type: "p", text: "Stories reach mostly existing followers and disappear in 24 hours. Their job is trust and frequency: behind-the-scenes, polls, Q&As, quick updates. Stories convert followers into fans; they rarely create new followers." },
      { type: "ul", items: [
        "Made for strangers → Reel.",
        "Made to be saved or judged on your profile → Post/Carousel.",
        "Made for people who already follow you → Story.",
      ]},
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
