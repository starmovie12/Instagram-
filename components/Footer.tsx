import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import { TOOL_GROUPS } from "@/lib/copy";

const COLS = [
  ...TOOL_GROUPS.map((g) => ({ h: g.heading, links: g.tools.map((t) => [t.title, t.href] as [string, string]) })),
  { h: "Company", links: [["About", "/about"], ["Blog", "/blog"], ["Contact", "/contact"]] as [string, string][] },
  { h: "Legal", links: [["Privacy", "/privacy-policy"], ["Terms", "/terms"], ["DMCA", "/dmca"]] as [string, string][] },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface-2)", borderTop: "1px solid var(--line)", marginTop: 40 }}>
      <div className="container" style={{ padding: "56px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
          {COLS.map(c => (
            <div key={c.h} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="label">{c.h}</span>
              {c.links.map(([label, href]) => (
                <Link key={href} href={href} style={{
                  textDecoration: "none", color: "var(--ink-3)", fontSize: "var(--t-small)",
                  transition: "color 200ms var(--ease-silk)",
                }} className="footlink">{label}</Link>
              ))}
            </div>
          ))}
        </div>
        <p className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 40, maxWidth: "70ch", lineHeight: 1.7 }}>
          InstaGrab is not affiliated with Instagram™ or Meta. We do not host any content.
          All content belongs to its respective owners. Download only content you own or have
          permission to use.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>© 2026 InstaGrab · Made for creators</span>
          <span style={{ display: "flex", gap: 8 }}>
            <SoundToggle />
            <ThemeToggle />
          </span>
        </div>
      </div>
    </footer>
  );
}
