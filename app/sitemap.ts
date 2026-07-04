import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://instagrab.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/reels-downloader",
    "/photo-downloader",
    "/story-downloader",
    "/caption-extractor",
    "/hashtag-extractor",
    "/blog",
    "/about",
    "/privacy-policy",
    "/terms",
    "/contact",
    "/dmca",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.startsWith("/blog") ? 0.5 : 0.8,
  }));

  const posts = BLOG_POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
