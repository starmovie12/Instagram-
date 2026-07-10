"use client";
import { useEffect, useRef, useState } from "react";
import { Link2, ClipboardPaste, Download, X, Clapperboard, Image as ImageIcon, CircleDashed, AtSign } from "lucide-react";
import type { ExtractResult } from "@/lib/extract-ui";
import type { ProfileFeed } from "@/lib/media";
import ResultCard from "./ResultCard";
import ProfileFeedCard from "./ProfileFeedCard";
import ErrorCard, { ErrorCode } from "./ErrorCard";
import AdFrame from "./AdFrame";
import { recordSearch, getRecentSearches } from "@/lib/retention";
import { useI18n } from "@/lib/i18n";

// A media permalink (post/reel/story/tv) → extract flow.
const MEDIA_RE = /instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv|stories)\/([\w-]+)/i;
// A profile URL (instagram.com/<handle> with no media segment) → profile flow.
const PROFILE_URL_RE = /instagram\.com\/(?!p\/|reel|reels|tv\/|stories\/|explore\/|accounts\/)([A-Za-z0-9._]{1,30})\/?(?:\?|#|$)/i;
// A bare handle / @handle.
const HANDLE_RE = /^@?([A-Za-z0-9._]{1,30})$/;

type Phase = "idle" | "loading" | "success" | "error";
type Kind = { Icon: React.ElementType; label: string };
const MEDIA_META: Record<string, Kind> = {
  p: { Icon: ImageIcon, label: "post" },
  reel: { Icon: Clapperboard, label: "reel" },
  reels: { Icon: Clapperboard, label: "reel" },
  tv: { Icon: Clapperboard, label: "video" },
  stories: { Icon: CircleDashed, label: "story" },
};

type Detected =
  | { mode: "media"; label: string; Icon: React.ElementType; hint: string }
  | { mode: "profile"; label: string; Icon: React.ElementType; hint: string }
  | null;

/** Decide what the user typed: a media permalink, a profile/username, or nothing yet. */
function detect(value: string): Detected {
  const v = value.trim();
  if (!v) return null;
  const media = v.match(MEDIA_RE);
  if (media) {
    const m = MEDIA_META[media[1].toLowerCase()] ?? MEDIA_META.p;
    return { mode: "media", label: m.label, Icon: m.Icon, hint: media[2].slice(0, 8) };
  }
  if (/instagram\.com/i.test(v)) {
    const prof = v.match(PROFILE_URL_RE);
    if (prof) return { mode: "profile", label: "profile", Icon: AtSign, hint: prof[1] };
    return null;
  }
  const handle = v.match(HANDLE_RE);
  if (handle) return { mode: "profile", label: "profile", Icon: AtSign, hint: handle[1] };
  return null;
}

export default function GoldenBar({ intro = false }: { intro?: boolean }) {
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [feed, setFeed] = useState<ProfileFeed | null>(null);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const detected = detect(value);
  const [canPaste, setCanPaste] = useState(false);
  useEffect(() => { setCanPaste(!!navigator.clipboard?.readText); }, []);

  // Auto clipboard: if clipboard-read is ALREADY granted (no prompt ever shown
  // by us), prefill an Instagram link waiting on the clipboard — one tap saved.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const perm = await navigator.permissions?.query?.({ name: "clipboard-read" as PermissionName });
        if (perm?.state !== "granted") return;
        const txt = (await navigator.clipboard.readText())?.trim();
        if (!cancelled && txt && detect(txt)) setValue((v) => v || txt);
      } catch { /* clipboard unavailable — the paste button still works */ }
    })();
    return () => { cancelled = true; };
  }, []);

  // I10 — recent searches chips under the bar.
  const [recents, setRecents] = useState<string[]>([]);
  useEffect(() => { setRecents(getRecentSearches()); }, []);

  // I4 — drop a link anywhere on the page and the bar catches it.
  useEffect(() => {
    function onDragOver(e: DragEvent) { e.preventDefault(); }
    function onDrop(e: DragEvent) {
      const txt = e.dataTransfer?.getData("text")?.trim();
      if (txt && detect(txt)) {
        e.preventDefault();
        setValue(txt);
        inputRef.current?.focus();
      }
    }
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, []);

  async function paste() {
    try { const txt = await navigator.clipboard.readText(); if (txt) setValue(txt.trim()); } catch {}
  }
  function clear() { setValue(""); inputRef.current?.focus(); }

  function mapError(code: string | undefined): ErrorCode {
    const allowed: ErrorCode[] = ["PRIVATE", "INVALID_URL", "EXTRACTOR_DOWN", "RATE_LIMITED", "STORY_EXPIRED", "OFFLINE", "NOT_FOUND"];
    return (allowed.includes(code as ErrorCode) ? code : "EXTRACTOR_DOWN") as ErrorCode;
  }

  async function go() {
    if (phase === "loading") return;
    setError(null); setResult(null); setFeed(null);
    const d = detect(value);
    if (!d) {
      setInvalid(true); setTimeout(() => setInvalid(false), 300);
      setPhase("error"); setError("INVALID_URL");
      return;
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) { setPhase("error"); setError("OFFLINE"); return; }
    recordSearch(value.trim());
    setRecents(getRecentSearches());
    setPhase("loading");
    try {
      if (d.mode === "profile") {
        // Universal box: a username / profile URL → full public profile + posts.
        const res = await fetch("/api/profile", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "feed", username: value.trim() }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok || json?.error) {
          setPhase("error"); setError(mapError(json?.code));
          return;
        }
        setFlash(true);
        setTimeout(() => { setFlash(false); setFeed(json as ProfileFeed); setPhase("success"); }, 200);
        return;
      }
      // Media permalink → extract flow.
      const res = await fetch("/api/extract", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value.trim() }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || json?.error) {
        setPhase("error"); setError(mapError(json?.error?.code));
        return;
      }
      setFlash(true);
      setTimeout(() => { setFlash(false); setResult(json.data as ExtractResult); setPhase("success"); }, 200);
    } catch {
      setPhase("error");
      setError(typeof navigator !== "undefined" && !navigator.onLine ? "OFFLINE" : "EXTRACTOR_DOWN");
    }
  }

  const loading = phase === "loading";
  const showChip = detected && !loading;

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

        {showChip ? (
          <span className="gbar-chip mono">
            <detected.Icon size={14} strokeWidth={1.5} style={{ color: "var(--gold-ink)" }} />
            {detected.label}/{detected.hint}…
            <button onClick={clear} aria-label="Clear" style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", color: "var(--ink-3)" }}>
              <X size={14} strokeWidth={1.5} />
            </button>
          </span>
        ) : (
          <input
            ref={inputRef} value={value} disabled={loading}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go()}
            placeholder={t("smartPlaceholder")}
            aria-label="Instagram link or username"
            className="gbar-input"
          />
        )}

        {canPaste && !detected && !loading && (
          <button className="btn btn-ghost mono gbar-paste" onClick={paste} style={{ fontSize: 12, letterSpacing: ".12em", minHeight: 40, textTransform: "uppercase" }}>
            <ClipboardPaste size={16} strokeWidth={1.5} /> {t("paste")}
          </button>
        )}

        <button className="btn btn-molten gbar-go" onClick={go} disabled={loading} style={{ height: 48 }}>
          <Download size={20} strokeWidth={1.5} />
          <span style={{ transition: "opacity 240ms var(--ease-silk)" }}>{loading ? t("fetching") : t("download")}</span>
        </button>
      </div>

      {/* I10 — recent searches, one tap to re-run */}
      {phase === "idle" && !value && recents.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
          {recents.map((r) => (
            <button key={r} className="chip" onClick={() => { setValue(r); inputRef.current?.focus(); }}
              style={{ cursor: "pointer", maxWidth: 220 }} title={r}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.replace(/^https?:\/\/(www\.)?/, "").slice(0, 34)}
              </span>
            </button>
          ))}
        </div>
      )}

      {phase === "error" && error && error !== "INVALID_URL" && (
        <div style={{ marginTop: 24 }}><ErrorCard code={error} onRetry={go} /></div>
      )}
      {phase === "error" && error === "INVALID_URL" && (
        <p className="mono" style={{ color: "var(--err)", fontSize: 13, marginTop: 12, textAlign: "center" }}>
          {t("invalidLink")}
        </p>
      )}

      {(result || feed) && (
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 24 }}>
          {result && <ResultCard data={result} />}
          {feed && <ProfileFeedCard data={feed} showBulk />}
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
