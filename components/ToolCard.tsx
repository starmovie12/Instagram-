import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export type Tool = {
  href: string; title: string; desc: string;
  Icon: React.ElementType; signature?: boolean;
};

export default function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <Reveal index={index}>
      <Link href={tool.href} className="card tool-card">
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="medallion"><tool.Icon size={24} strokeWidth={1.5} /></span>
          {tool.signature && (
            <span className="label" style={{
              color: "var(--gold-ink)", background: "rgba(245,233,207,.35)",
              border: "1px solid var(--line)", borderRadius: 999, padding: "4px 10px", fontSize: 10,
            }}>Signature</span>
          )}
        </span>
        <span>
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>{tool.title}</h3>
          <p style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}>{tool.desc}</p>
        </span>
        <span className="arrow" style={{ color: "var(--gold-ink)", display: "inline-flex" }}>
          <ArrowRight size={20} strokeWidth={1.5} />
        </span>
      </Link>
    </Reveal>
  );
}
