import Link from "next/link";
import ExtractorTool from "./ExtractorTool";
import UsernameTool from "./UsernameTool";
import { StarIcon } from "./Icons";
import { TOOLS } from "@/lib/tools";

export type Faq = { q: string; a: string };
type Step = { title: string; body: string };

type Props = {
  eyebrow: string;
  h1: React.ReactNode;
  sub: React.ReactNode;
  variant: "url" | "dp" | "stories" | "viewer" | "highlights";
  placeholder?: string;
  steps: Step[];
  faqs: Faq[];
  children?: React.ReactNode;
  currentHref?: string;
};

export default function ToolPage({ eyebrow, h1, sub, variant, placeholder, steps, faqs, children, currentHref }: Props) {
  const others = TOOLS.filter((t) => t.href !== currentHref).slice(0, 6);
  return (
    <>
      <header className="hero">
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
        <div className="hero-in">
          <div className="badge"><StarIcon /> {eyebrow}</div>
          <h1>{h1}</h1>
          <p className="sub">{sub}</p>

          {variant === "url"
            ? <ExtractorTool placeholder={placeholder} />
            : <UsernameTool mode={variant} placeholder={placeholder} />}

          <div className="trust">
            <span><b>✓</b> No login</span>
            <span><b>✓</b> Free forever</span>
            <span><b>✓</b> HD quality</span>
            <span><b>✓</b> No watermark</span>
          </div>
        </div>
      </header>

      <section className="content">
        <h2>How it works</h2>
        <ol className="landing-steps reveal">
          {steps.map((s, i) => <li key={i}><span><b>{s.title}.</b> {s.body}</span></li>)}
        </ol>

        {children}

        <h2>Frequently asked questions</h2>
        <div className="faq reveal">
          {faqs.map((f) => (
            <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
          ))}
        </div>

        <h2>More InstaGrab tools</h2>
        <div className="tools-grid reveal">
          {others.map((t) => (
            <Link className="tool-card" href={t.href} key={t.href}>
              <span className="ic">{t.icon}</span>
              <b>{t.name}</b>
              <p>{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
