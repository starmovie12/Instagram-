import type { NextConfig } from "next";

const NOINDEX_PATHS = [
  "/ai/:path*",
  "/ai-alt-text",
  "/account-health",
  "/audio-downloader",
  "/batch-downloader",
  "/best-time-to-post",
  "/blur-tool",
  "/bulk-downloader",
  "/caption-fixer",
  "/case-converter",
  "/character-counter",
  "/collage-maker",
  "/color-palette",
  "/comments-exporter",
  "/crystal-ball",
  "/dm-link-generator",
  "/dp-ring-maker",
  "/emv-calculator",
  "/engagement-calculator",
  "/facebook-downloader",
  "/fake-follower-checker",
  "/fastdl-alternative",
  "/follower-ratio-checker",
  "/follower-tracker",
  "/font-generator",
  "/ghost-feed",
  "/giveaway-picker",
  "/grid-architect",
  "/grid-planner",
  "/grid-splitter",
  "/hashtag-checker",
  "/hashtag-counter",
  "/image-compressor",
  "/insta-guess",
  "/insta-kundli",
  "/insta-wrapped",
  "/invisible-character",
  "/is-instagram-down",
  "/link-shortener",
  "/media-kit-generator",
  "/money-calculator",
  "/photo-downloader-hindi",
  "/photo-filters",
  "/photo-resizer",
  "/pinterest-downloader",
  "/profile-audit",
  "/profile-battle",
  "/profile-pic-zoom",
  "/profile-roaster",
  "/quote-maker",
  "/reel-frame-grabber",
  "/reel-remix",
  "/reel-repurposer",
  "/reel-to-mp3",
  "/reel-transcript",
  "/reels-downloader-hindi",
  "/shadowban-lab",
  "/snapinsta-alternative",
  "/story-downloader-hindi",
  "/story-feed",
  "/threads-downloader",
  "/tiktok-downloader",
  "/time-capsule",
  "/trending-india",
  "/twitter-downloader",
  "/username-checker",
  "/utm-builder",
  "/video-to-gif",
  "/video-trimmer",
  "/virality-score",
  "/voice-cloner",
  "/wheel-spinner",
  "/winner-certificate",
  "/youtube-thumbnail-downloader",
];

/**
 * Security headers on every response (PRD §21.6). CSP ships Report-Only (D20) so third-party
 * ad scripts keep working while violations are collected at /api/csp-report.
 * No page uses camera / microphone / geolocation (checked), so all three are disabled.
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
  "report-uri /api/csp-report",
  "report-to csp-endpoint",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy-Report-Only", value: CSP_REPORT_ONLY },
  { key: "Reporting-Endpoints", value: 'csp-endpoint="/api/csp-report"' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Service worker updates must not wait for the HTTP cache.
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }, { key: "Service-Worker-Allowed", value: "/" }] },
      ...NOINDEX_PATHS.map((source) => ({
      source,
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    }))];
  },
};

export default nextConfig;
