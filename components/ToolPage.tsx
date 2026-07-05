import Link from "next/link";
import ExtractorTool from "./ExtractorTool";
import UsernameTool from "./UsernameTool";
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
      {/* hero — white canvas, calm */}
      <header className="hero">
        <div className="hero-in">
          <p className="eyebrow">{eyebrow}</p>
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

      {/* how it works */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="section-head"><h2>How it works</h2></div>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={i}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {children && (
        <section className="band-tight reveal">
          <div className="wrap child-content">{children}</div>
        </section>
      )}

      {/* faq */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="section-head"><h2>Frequently asked questions</h2></div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </div>
      </section>

      {/* more tools */}
      <section className="band-tight reveal">
        <div className="wrap">
          <div className="section-head"><h2>More InstaGrab tools</h2></div>
          <div className="demo-grid">
            {others.map((t) => (
              <Link className="demo-card" href={t.href} key={t.href}>
                <span className="ic">{t.icon}</span>
                <b>{t.name}</b>
                <p>{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
