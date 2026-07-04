import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPost } from "@/lib/blog-posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="prose">
      <h1>{post.title}</h1>
      <time dateTime={post.date}>{post.date}</time>
      {post.content.map((block, i) => {
        if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
        if (block.type === "ul")
          return (
            <ul key={i}>
              {block.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          );
        return <p key={i}>{block.text}</p>;
      })}
      <p>
        <strong>Try it now:</strong>{" "}
        <Link href="/">Download any reel with its caption + hashtags free →</Link>
      </p>
    </main>
  );
}
