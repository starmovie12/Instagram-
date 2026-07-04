import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Instagram Growth, Reels & Hashtag Guides",
  description:
    "Practical guides on Instagram reels, hashtags, captions, and content strategy for creators and social media managers.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <main className="page">
      <h1>📝 InstaGrab Blog</h1>
      <p>
        Practical, no-fluff guides on Instagram content strategy — reels,
        hashtags, captions, and growing as a creator.
      </p>
      <ul className="post-list">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <time dateTime={post.date}>{post.date}</time>
              <b>{post.title}</b>
              <p>{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
