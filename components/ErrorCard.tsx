import { Lock, AlertTriangle, Wrench, Timer, CircleDashed, WifiOff } from "lucide-react";

export type ErrorCode = "PRIVATE" | "INVALID_URL" | "EXTRACTOR_DOWN" | "RATE_LIMITED" | "STORY_EXPIRED" | "OFFLINE" | "NOT_FOUND";

const ERRORS: Record<ErrorCode, { Icon: React.ElementType; title: string; body: string }> = {
  PRIVATE: { Icon: Lock, title: "This account is private.", body: "InstaGrab fetches public content only." },
  INVALID_URL: { Icon: AlertTriangle, title: "That's not an Instagram link.", body: "Paste one like instagram.com/reel/…" },
  EXTRACTOR_DOWN: { Icon: Wrench, title: "Instagram changed something on their side.", body: "We're patching it — usually done within hours. Try again soon." },
  RATE_LIMITED: { Icon: Timer, title: "Too many requests.", body: "Wait a minute, then try again." },
  STORY_EXPIRED: { Icon: CircleDashed, title: "This story has expired or doesn't exist.", body: "Stories vanish after 24 hours." },
  NOT_FOUND: { Icon: CircleDashed, title: "This post doesn't exist.", body: "Check the link and try again." },
  OFFLINE: { Icon: WifiOff, title: "You're offline.", body: "Reconnect and try again." },
};

/** Quiet error card (§9.9) — never a red banner, never an alert(). */
export default function ErrorCard({ code }: { code: ErrorCode }) {
  const e = ERRORS[code] ?? ERRORS.EXTRACTOR_DOWN;
  return (
    <div className="card intro-rise" role="alert" style={{
      display: "flex", gap: 16, alignItems: "flex-start", padding: 20, maxWidth: 720, margin: "0 auto",
      borderColor: "color-mix(in srgb, var(--err) 40%, var(--line))", borderWidth: 1.5,
    }}>
      <span className="medallion" style={{ flexShrink: 0, color: "var(--err)" }}>
        <e.Icon size={24} strokeWidth={1.5} />
      </span>
      <span>
        <strong style={{ display: "block", marginBottom: 2 }}>{e.title}</strong>
        <span style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}>{e.body}</span>
      </span>
    </div>
  );
}
