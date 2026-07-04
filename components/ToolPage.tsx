import Link from "next/link";
import ExtractorTool from "./ExtractorTool";
import UsernameTool from "./UsernameTool";
import { TOOLS } from "@/lib/tools";

export type Faq = { q: string; a: string };
type Step = { title: string; body: string };

type Props = {
  eyebrow: string;
  h1: React.ReactNode;
  sub: string;
  /** which input to render */
  variant: "url" | "dp" | "stories" | "viewer" | "highlights";
  placeholder?: string;
  steps: Step[];
  faqs: Faq[];
  children?: React.ReactNode;
  /** exclude these hrefs from the "other tools" strip */
  currentHref?: string;
};

export default function ToolPage({ eyebrow, h1, sub, variant, placeholder, steps, faqs, children, currentHref }: Props) {
  const others = TOOLS.filter((t) => t.href !== currentHref).slice(0, 6);
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">👑 {eyebrow}</span>
        <h1>{h1}</h1>
        <p className="sub">{sub}</p>
        <div className="trust">
          <span>✅ No login</span>
          <span>🆓 Free</span>
          <span>🎬 HD Quality</span>
          <span>💧 No watermark</span>
        </div>
      </section>

      {variant === "url"
        ? <ExtractorTool placeholder={placeholder} />
        : <UsernameTool mode={variant} placeholder={placeholder} />}

      <section className="content">
        <h2>How it works</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={i}><span><b>{s.title}.</b> {s.body}</span></li>
          ))}
        </ol>

        {children}

        <h2>Frequently asked questions</h2>
        <div className="faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <h2>More InstaGrab tools</h2>
        <div className="tools-grid">
          {others.map((t) => (
            <Link className="tool-card" href={t.href} key={t.href}>
              <span className="ic">{t.icon}</span>
              <b>{t.name}</b>
              <p>{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
