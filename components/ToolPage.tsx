import ExtractorTool from "./ExtractorTool";

export type Faq = { q: string; a: string };

type Props = {
  h1: React.ReactNode;
  sub: string;
  placeholder?: string;
  steps: string[];
  faqs: Faq[];
  children?: React.ReactNode;
};

/**
 * Shared landing-page shell: every tool page uses the same extractor,
 * only the heading + SEO copy changes ("programmatic-lite").
 */
export default function ToolPage({ h1, sub, placeholder, steps, faqs, children }: Props) {
  return (
    <main>
      <section className="hero">
        <h1>{h1}</h1>
        <p className="sub">{sub}</p>
        <div className="trust">
          <span>✅ No login</span>
          <span>🆓 100% Free</span>
          <span>🎬 HD Quality</span>
          <span>💧 No watermark</span>
        </div>
      </section>

      <ExtractorTool placeholder={placeholder} />

      <section className="content">
        <h2>How it works</h2>
        <ol className="steps">
          {steps.map((s, i) => <li key={i}>{s}</li>)}
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
      </section>
    </main>
  );
}
