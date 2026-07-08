"use client";
import { Lock, AlertTriangle, Wrench, Timer, CircleDashed, WifiOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export type ErrorCode = "PRIVATE" | "INVALID_URL" | "EXTRACTOR_DOWN" | "RATE_LIMITED" | "STORY_EXPIRED" | "OFFLINE" | "NOT_FOUND";

const META = {
  PRIVATE: { Icon: Lock, t: "errPrivateT", b: "errPrivateB" },
  INVALID_URL: { Icon: AlertTriangle, t: "errInvalidT", b: "errInvalidB" },
  EXTRACTOR_DOWN: { Icon: Wrench, t: "errDownT", b: "errDownB" },
  RATE_LIMITED: { Icon: Timer, t: "errRateT", b: "errRateB" },
  STORY_EXPIRED: { Icon: CircleDashed, t: "errStoryT", b: "errStoryB" },
  NOT_FOUND: { Icon: CircleDashed, t: "errNotFoundT", b: "errNotFoundB" },
  OFFLINE: { Icon: WifiOff, t: "errOfflineT", b: "errOfflineB" },
} as const;

/** Quiet error card (§9.9) — never a red banner, never an alert(). */
export default function ErrorCard({ code }: { code: ErrorCode }) {
  const { t } = useI18n();
  const e = META[code] ?? META.EXTRACTOR_DOWN;
  return (
    <div className="card intro-rise" role="alert" style={{
      display: "flex", gap: 16, alignItems: "flex-start", padding: 20, maxWidth: 720, margin: "0 auto",
      borderColor: "color-mix(in srgb, var(--err) 40%, var(--line))", borderWidth: 1.5,
    }}>
      <span className="medallion" style={{ flexShrink: 0, color: "var(--err)" }}>
        <e.Icon size={24} strokeWidth={1.5} />
      </span>
      <span>
        <strong style={{ display: "block", marginBottom: 2 }}>{t(e.t)}</strong>
        <span style={{ color: "var(--ink-2)", fontSize: "var(--t-small)" }}>{t(e.b)}</span>
      </span>
    </div>
  );
}
