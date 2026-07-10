import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { TOOLS } from "@/lib/copy";

import { SITE_URL as BASE } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "", "/blog", "/about", "/privacy-policy", "/terms", "/contact", "/dmca",
    "/snapinsta-alternative", "/fastdl-alternative",
    "/reels-downloader-hindi", "/story-downloader-hindi", "/photo-downloader-hindi",
  ];

  const pages = [...staticPaths, ...TOOLS.map((t) => t.href)].map((path) => ({
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
