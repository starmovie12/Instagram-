import "./how-to.css";
import type { Metadata } from "next";
import Link from "next/link";
import { TextQuote, Download, GalleryHorizontalEnd, ShieldCheck } from "lucide-react";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import AdFrame from "@/components/AdFrame";
import LegalFoot from "@/components/LegalFoot";
import { PlatformTile } from "@/components/PlatformIcons";
import { PLATFORMS } from "@/lib/platforms";
import { QUARTET } from "@/lib/copy";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { DEFAULT_FAQ, faqJsonLd, howToJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How to Download Instagram, Facebook, TikTok & More — Step by Step",
  description: "Learn how to copy a link and download public Instagram, Facebook, TikTok, YouTube thumbnails, Pinterest, X and Threads media in HD — no login, nothing stored.",
  alternates: { canonical: "/how-to-download" },
};

const ICONS: Record<string, React.ElementType> = { TextQuote, Download, GalleryHorizontalEnd, ShieldCheck };

const COPY_STEPS: Record<string, string[]> = {
  instagram: ["Open the reel, post or story in the Instagram app.", "Tap the paper-plane / Share button.", "Tap Copy link."],
  facebook: ["Open the video or reel on Facebook.", "Tap Share (arrow icon).", "Tap Copy link."],
  tiktok: ["Open the video in TikTok.", "Tap Share → Copy link.", "Short vm.tiktok.com links work too."],
  pinterest: ["Open the pin.", "Tap the Share icon.", "Choose Copy link."],
  x: ["Open the post.", "Tap the Share icon.", "Choose Copy link."],
  threads: ["Open the thread post.", "Tap the Share (paper-plane) icon.", "Choose Copy link."],
  youtube: ["Open the video or Short.", "Tap Share.", "Tap Copy link."],
};

const PROBLEMS: [string, string][] = [
  ["Link expired or story gone", "Stories disappear after 24 hours and some CDN links expire. Fetch again from the original post."],
  ["Rate limit / “try again”", "We cap requests per minute to stay fast for everyone. A countdown shows when you can retry."],
  ["Private account", "Only public content can be downloaded. Private accounts stay private."],
  ["Facebook / TikTok sometimes fail", "These platforms hide media behind login walls, so extraction is best-effort. You always get an honest error — never a fake button."],
];

export default function Page() {
  const guides = BLOG_POSTS.slice(0, 6);
  return (
    <>
      <JsonLd data={howToJsonLd()} />
      <JsonLd data={faqJsonLd(DEFAULT_FAQ)} />
      <main className="htd">
        <div className="htd__in">
          <section className="htd-hero">
            <h1>Download any media in <em>3 steps</em></h1>
            <ol className="htd-steps">
              <li><b>1</b> Copy the link</li><li><b>2</b> Paste it</li><li><b>3</b> Download</li>
            </ol>
          </section>

          <section><h2>How to copy the link</h2>
            {PLATFORMS.map((p) => (
              <details key={p.id} className="htd-acc">
                <summary><PlatformTile name={p.iconKey} size={32} showLabel={false} /> {p.name}</summary>
                <ol>{(COPY_STEPS[p.id] ?? []).map((s) => <li key={s}>{s}</li>)}</ol>
              </details>
            ))}
          </section>

          <section><h2>What can be downloaded</h2>
            <div className="htd-tablewrap">
              <table className="htd-table">
                <thead><tr><th scope="col">Platform</th><th scope="col">Formats</th><th scope="col">Notes</th></tr></thead>
                <tbody>
                  {PLATFORMS.map((p) => (
                    <tr key={p.id}>
                      <th scope="row"><Link href={p.route}>{p.name}</Link></th>
                      <td>{p.pills.filter((x) => x.id !== "auto").map((x) => x.label).join(" · ")}</td>
                      <td>{p.id === "youtube" ? "Thumbnails only" : p.backend.includes("best-effort") || p.id === "threads" ? "Best-effort, public only" : "Public content"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section><h2>How auto-detect works</h2>
            <p>Paste any link on Home and InstaGrab recognises the app and the kind (Reel, Story, Video…) on your device, then opens the right page and starts fetching. You can still pick Story / Video / Photo manually, and switch back to Auto anytime.</p>
          </section>

          <section><h2>Where files are saved</h2>
            <ul>
              <li><b>Android:</b> your Downloads folder / Gallery.</li>
              <li><b>iPhone:</b> the Files app. To keep it in Photos, tap Share → <i>Save Video</i> / <i>Save Image</i>.</li>
              <li><b>Desktop:</b> your browser&apos;s Downloads folder.</li>
            </ul>
          </section>

          <section><h2>Install as an app</h2>
            <ul>
              <li><b>Android Chrome:</b> menu → Install app.</li>
              <li><b>iPhone Safari:</b> Share → Add to Home Screen.</li>
              <li><b>Desktop Chrome / Edge:</b> install icon in the address bar.</li>
            </ul>
          </section>

          <section><h2>Private accounts &amp; stories</h2>
            <p>Only public content downloads — private accounts stay private, even with a Session ID. The optional Session ID in <Link href="/settings">Settings → Advanced</Link> only improves reliability for public content. It works like your login — never share it, and use a separate account if you can.</p>
          </section>

          <section><h2>If something goes wrong</h2>
            <dl className="htd-dl">{PROBLEMS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}</dl>
          </section>

          <section><h2>Why InstaGrab</h2>
            <div className="htd-why">
              {QUARTET.map((f) => { const Icon = ICONS[f.icon]; return (
                <div key={f.t} className="htd-why__card"><span className="htd-why__icon" aria-hidden="true"><Icon size={22} strokeWidth={1.75} /></span><b>{f.t}</b><p>{f.d}</p></div>
              ); })}
            </div>
          </section>
        </div>

        <FAQ />

        <div className="htd__in">
          <section><h2>Creator guides</h2>
            <ul className="htd-guides">
              {guides.map((g) => <li key={g.slug}><Link href={`/blog/${g.slug}`}><b>{g.title}</b><span>{g.description}</span></Link></li>)}
            </ul>
          </section>
          <p className="htd-disc">Not affiliated with Instagram™ / Meta. Download only content you own or have permission to use. See <Link href="/privacy-policy">Privacy</Link>, <Link href="/terms">Terms</Link> and <Link href="/dmca">DMCA</Link>.</p>
          <div className="htd-ad"><AdFrame slotH={110} /></div>
          <div className="htd-cta"><Link href="/?focus=1">Try it now</Link></div>
        </div>
      </main>
      <LegalFoot />
    </>
  );
}
