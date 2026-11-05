import "./downloader.css";
import Link from "next/link";
import { Check } from "lucide-react";
import PlatformDownloader from "@/components/PlatformDownloader";
import FAQ from "@/components/FAQ";
import JsonLd from "@/components/JsonLd";
import LegalFoot from "@/components/LegalFoot";
import ToolIcon from "@/components/ToolIcon";
import { platformById, type PlatformId } from "@/lib/platforms";
import { visibleTools } from "@/lib/registry";
import { DEFAULT_FAQ, faqJsonLd, type QA } from "@/lib/seo";

/**
 * App page (PRD §10, §10.9, §17.1). Above the fold: the workspace (server-rendered, hydrated).
 * Below the fold, plain HTML for SEO: Supported formats → How to download from {App} (3 steps)
 * → About prose (children) → FAQ → Related tools (3–6) → disclaimer. Ads only under a result.
 * Legacy SEO URLs keep their own metadata and render this with a preselected pill.
 */
export default function PlatformPage({
  platform, pill, h1, lead, faq, children, self,
}: {
  platform: PlatformId;
  pill?: string;
  /** @deprecated kept for older page files; the hero no longer shows an eyebrow */
  eyebrow?: string;
  h1: React.ReactNode;
  lead: string;
  faq?: QA[];
  children?: React.ReactNode;
  /** this page's own href (excluded from Related tools) */
  self?: string;
}) {
  const def = platformById(platform)!;
  const formats = def.pills.filter((p) => p.id !== "auto");
  const related = visibleTools
    .filter((t) => t.href !== self && t.href !== def.route && (platform === "instagram" ? t.category === "downloaders" : t.category === "platforms"))
    .slice(0, 6);
  const steps: [string, string][] = [
    ["Copy the link", `Open the post in the ${def.name} app or website and tap Share → Copy link.`],
    ["Paste it here", "Tap Paste (or drop the link in the box). The type is detected for you."],
    ["Download", "Tap Download — the file is saved in its original quality, ready to use."],
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(faq ?? DEFAULT_FAQ)} />
      <main className="pp-main">
        <section className="pp-top">
          <PlatformDownloader platform={platform} presetPill={pill} h1={h1} lead={lead} />
        </section>

        <div className="pp">
          {formats.length > 0 && (
            <section className="pp__sec" aria-labelledby="pp-formats">
              <h2 id="pp-formats" className="pp__h">Supported formats</h2>
              <ul className="pp__formats">
                {formats.map((f) => <li key={f.id}><Check size={18} strokeWidth={2.6} aria-hidden="true" /> {f.label}</li>)}
              </ul>
            </section>
          )}

          <section className="pp__sec" aria-labelledby="pp-how">
            <h2 id="pp-how" className="pp__h">How to download from {def.name}</h2>
            <ol className="pp__steps">
              {steps.map(([title, body]) => <li key={title}><strong>{title}</strong>{body}</li>)}
            </ol>
          </section>

          {children && <section className="pp__sec pp__prose">{children}</section>}
        </div>

        <FAQ items={faq} />

        {related.length > 0 && (
          <div className="pp">
            <section className="pp__sec" aria-labelledby="pp-related">
              <h2 id="pp-related" className="pp__h">Related tools</h2>
              <ul className="pp__related">
                {related.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href}><ToolIcon category={t.category} size={40} /><span>{t.name}</span></Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
      <LegalFoot />
    </>
  );
}
