"use client";
import { useEffect, useRef, useState } from "react";
import { Link2, ClipboardPaste, Download, X, Clapperboard, Image as ImageIcon, CircleDashed } from "lucide-react";
import type { ExtractResult } from "@/lib/extract-ui";
import ResultCard from "./ResultCard";
import ErrorCard, { ErrorCode } from "./ErrorCard";
import AdFrame from "./AdFrame";
import { useI18n } from "@/lib/i18n";

const URL_RE = /instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv|stories)\/([\w-]+)/i;
type Phase = "idle" | "loading" | "success" | "error";
const KIND_META: Record<string, { Icon: React.ElementType; label: string }> = {
  p: { Icon: ImageIcon, label: "post" },
  reel: { Icon: Clapperboard, label: "reel" },
  reels: { Icon: Clapperboard, label: "reel" },
  tv: { Icon: Clapperboard, label: "video" },
  stories: { Icon: CircleDashed, label: "story" },
};

export default function GoldenBar({ intro = false }: { intro?: boolean }) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const match = value.match(URL_RE);
  const kind = match ? KIND_META[match[1].toLowerCase()] : null;
  // Clipboard support is only knowable in the browser — resolve it after mount
  // so the server and first client render agree (avoids hydration mismatch).
  const [canPaste, setCanPaste] = useState(false);
  useEffect(() => { setCanPaste(!!navigator.clipboard?.readText); }, []);

  async function paste() {
    try { const t = await navigator.clipboard.readText(); if (t) setValue(t.trim()); } catch {}
  }
  function clear() { setValue(""); inputRef.current?.focus(); }

  async function go() {
    if (phase === "loading") return;
    setError(null); setResult(null);
    if (!match) {
      setInvalid(true); setTimeout(() => setInvalid(false), 300);
      setPhase("error"); setError("INVALID_URL");
      return;
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) { setPhase("error"); setError("OFFLINE"); return; }
    setPhase("loading");
    try {
      const res = await fetch("/api/extract", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value.trim() }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setPhase("error");
        setError((json?.error?.code as ErrorCode) ?? "EXTRACTOR_DOWN");
        return;
      }
      // Final lap → gold flash → ceremony
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        setResult(json.data as ExtractResult);
        setPhase("success");
      }, 200);
    } catch {
      setPhase("error");
      setError(typeof navigator !== "undefined" && !navigator.onLine ? "OFFLINE" : "EXTRACTOR_DOWN");
    }
  }

  const loading = phase === "loading";

  return (
    <div style={{ width: "100%" }}>
      <div
        className={`bar gbar ${loading ? "loading" : ""} ${invalid ? "shake" : ""} ${intro ? "bar-intro" : ""}`}
        style={{
          maxWidth: 720, margin: "0 auto",
          borderColor: flash ? "var(--gold-400)" : undefined,
          transition: "border-color 200ms var(--ease-silk)",
        }}>
        <span className="gbar-icon" aria-hidden="true"><Link2 size={20} strokeWidth={1.5} /></span>

        {kind && !loading ? (
          <span className="gbar-chip mono">
            <kind.Icon size={14} strokeWidth={1.5} style={{ color: "var(--gold-ink)" }} />
            {kind.label}/{match![2].slice(0, 8)}…
            <button onClick={clear} aria-label="Clear link" style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", color: "var(--ink-3)" }}>
              <X size={14} strokeWidth={1.5} />
            </button>
          </span>
        ) : (
          <input
            ref={inputRef} value={value} disabled={loading}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go()}
            placeholder={t("linkPlaceholder")}
            aria-label="Instagram link"
            className="gbar-input"
          />
        )}

        {canPaste && !kind && !loading && (
          <button className="btn btn-ghost mono gbar-paste" onClick={paste} style={{ fontSize: 12, letterSpacing: ".12em", minHeight: 40, textTransform: "uppercase" }}>
            <ClipboardPaste size={16} strokeWidth={1.5} /> {t("paste")}
          </button>
        )}

        <button className="btn btn-molten gbar-go" onClick={go} disabled={loading} style={{ height: 48 }}>
          <Download size={20} strokeWidth={1.5} />
          <span style={{ transition: "opacity 240ms var(--ease-silk)" }}>{loading ? t("fetching") : t("download")}</span>
        </button>
      </div>

      {phase === "error" && error && error !== "INVALID_URL" && (
        <div style={{ marginTop: 24 }}><ErrorCard code={error} /></div>
      )}
      {phase === "error" && error === "INVALID_URL" && (
        <p className="mono" style={{ color: "var(--err)", fontSize: 13, marginTop: 12, textAlign: "center" }}>
          {t("invalidLink")}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 24 }}>
          <ResultCard data={result} />
          {/* Ad slot A — Native Banner, only after success, never inside the card */}
          <div style={{ maxWidth: 920, margin: "0 auto", width: "100%" }}><AdFrame slotH={280} /></div>
        </div>
      )}

      <style jsx>{`
        .gbar{ display:flex; align-items:center; gap:8px; height:64px; padding:8px 8px 8px 20px; }
        .gbar-icon{ color:var(--ink-3); display:inline-flex; flex-shrink:0; }
        .gbar-input{ flex:1; min-width:0; background:none; border:none; font-size:15px; color:var(--ink); }
        .gbar-input::placeholder{ color:var(--ink-3); }
        .gbar-chip{ flex:1; display:inline-flex; align-items:center; gap:8px; font-size:13px;
          background:var(--surface-2); border:1px solid var(--gold-400); border-radius:999px;
          padding:6px 12px; color:var(--ink-2); animation:coinpop 240ms var(--ease-coin); max-width:max-content; }
        .gbar:focus-within{ border-color:var(--gold-400); box-shadow:var(--focus-ring); }
        .gbar.loading:focus-within{ box-shadow:none; }
        @media (max-width:639px){
          .gbar{ flex-wrap:wrap; height:auto; border-radius:24px; padding:12px; }
          .gbar-input{ flex:1 1 60%; height:44px; }
          .gbar-chip{ order:1; }
          .gbar-paste{ order:2; }
          .gbar-go{ order:3; width:100%; }
        }
      `}</style>
    </div>
  );
}
