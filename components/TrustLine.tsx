import { ShieldCheck } from "lucide-react";

export default function TrustLine() {
  return (
    <p className="mono" style={{
      display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
      fontSize: 13, color: "var(--ink-3)",
    }}>
      <ShieldCheck size={16} strokeWidth={1.5} style={{ color: "var(--gold-ink)" }} aria-hidden="true" />
      No login · Public content only · Links are never stored
    </p>
  );
}
