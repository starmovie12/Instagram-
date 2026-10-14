import { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://instagrabs.vercel.app"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/caption-extractor",
          "/hashtag-extractor",
          "/reels-downloader",
          "/story-downloader",
          "/photo-downloader",
          "/carousel-downloader",
          "/video-downloader",
          "/profile-picture-downloader",
          "/highlights-downloader",
          "/blog",
          "/about",
          "/privacy-policy",
          "/terms",
          "/contact",
          "/dmca",
        ],
        disallow: [
          "/api/",
          "/admin",
          "/history",
          "/offline",
          "/s/",
          "/ai/",
          "/insta-kundli",
          "/crystal-ball",
          "/voice-cloner",
          "/wheel-spinner",
          "/profile-roaster",
          "/profile-battle",
          "/insta-guess",
          "/insta-wrapped",
          "/time-capsule",
          "/ghost-feed",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
