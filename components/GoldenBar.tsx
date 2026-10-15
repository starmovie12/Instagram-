"use client";
import { useEffect, useRef, useState } from "react";
import { Link2, ClipboardPaste, Download, X, Clapperboard, Image as ImageIcon, CircleDashed, AtSign, Pencil } from "lucide-react";
import type { ExtractResult } from "@/lib/extract-ui";
import type { ProfileFeed } from "@/lib/media";
import ResultCard from "./ResultCard";
import ProfileFeedCard from "./ProfileFeedCard";
import ErrorCard, { ErrorCode } from "./ErrorCard";
import SupportedTools from "./SupportedTools";
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

// Other platforms the unified /api/extract route resolves (used by the neon homepage box).
const OTHER_PLATFORMS: [RegExp, string][] = [
  [/(^|[/.])(facebook\.com|fb\.watch|fb\.me)(\/|$|\?)/i, "Facebook"],
  [/(^|[/.])(youtube\.com|youtu\.be)(\/|$|\?)/i, "YouTube"],
  [/(^|[/.])(twitter\.com|x\.com)(\/|$|\?)/i, "X post"],
  [/(^|[/.])tiktok\.com(\/|$|\?)/i, "TikTok"],
  [/(^|[/.])(pinterest\.com|pin\.it)(\/|$|\?)/i, "Pinterest"],
  [/(^|[/.])(threads\.net|threads\.com)(\/|$|\?)/i, "Threads"],
];

/** Like detect(), but also recognises Facebook / YouTube / X / TikTok / Pinterest / Threads links. */
function detectAny(value: string): Detected {
  const own = detect(value);
  if (own) return own;
  const v = value.trim();
  for (const [re, label] of OTHER_PLATFORMS) {
    if (re.test(v)) return { mode: "media", label, Icon: Link2, hint: "link" };
  }
  return null;
}

export default function GoldenBar({ intro = false, variant = "classic" }: { intro?: boolean; variant?: "classic" | "neon" }) {
  const neon = variant === "neon";
  const { t } = useI18n();
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [feed, setFeed] = useState<ProfileFeed | null>(null);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const detect_ = neon ? detectAny : detect;
  const detected = detect_(value);
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
        if (!cancelled && txt && detect_(txt)) setValue((v) => v || txt);
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
      if (txt && detect_(txt)) {
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

  // Editing mode: the detected-URL chip collapses back into a text input so
  // users can tweak a pasted link without deleting the whole thing.
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (editing) setTimeout(() => inputRef.current?.focus(), 20);
  }, [editing]);

  async function paste() {
    try { const txt = await navigator.clipboard.readText(); if (txt) { setValue(txt.trim()); return; } } catch {}
    inputRef.current?.focus(); // clipboard blocked → let the user long-press / Ctrl+V into the box
  }
  function clear() { setValue(""); setEditing(false); inputRef.current?.focus(); }

  function mapError(code: string | undefined): ErrorCode {
    const allowed: ErrorCode[] = ["PRIVATE", "INVALID_URL", "EXTRACTOR_DOWN", "RATE_LIMITED", "STORY_EXPIRED", "OFFLINE", "NOT_FOUND"];
    return (allowed.includes(code as ErrorCode) ? code : "EXTRACTOR_DOWN") as ErrorCode;
  }

  async function go() {
    if (phase === "loading") return;
    setEditing(false);
    setError(null); setResult(null); setFeed(null);
    const d = detect_(value);
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
  const showChip = detected && !loading && !editing;

  const below = (
    <>
      {/* I10 — recent searches, one tap to re-run */}
      {!neon && phase === "idle" && !value && recents.length > 0 && (
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

    </>
  );

  if (neon) {
    return (
      <div className="nb-root">
        <div className="nb-card">
          <div className={`nb-field ${loading ? "loading" : ""} ${invalid ? "shake" : ""}`}>
            <div className="nb-row">
              <span className="nb-link" aria-hidden="true"><Link2 size={22} strokeWidth={1.8} /></span>
              <input
                ref={inputRef} value={value} disabled={loading}
                onChange={e => setValue(e.target.value)}
                onKeyDown={e => e.key === "Enter" && go()}
                placeholder="Paste Instagram, Facebook, or any link..."
                aria-label="Paste a social media link or @username"
                className="nb-input"
                inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false}
              />
              {detected && !loading && <span className="nb-tag">{detected.label}</span>}
              {value && !loading && (
                <button type="button" className="nb-x" onClick={clear} aria-label="Clear">
                  <X size={20} strokeWidth={1.8} />
                </button>
              )}
            </div>

            {/* Supported apps — chhote, sirf dikhane ke liye, click par kuch nahi hota */}
            <div
              className="nb-support"
              aria-hidden="true"
              {...({ inert: "" } as Record<string, unknown>)}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <SupportedTools />
            </div>
          </div>

          <div className="nb-actions">
            <button type="button" className="nb-paste" onClick={paste} disabled={loading}>
              <ClipboardPaste size={24} strokeWidth={1.8} /> <span>Paste Link</span>
            </button>
            <button type="button" className="nb-grab" onClick={go} disabled={loading}>
              <Download size={26} strokeWidth={2} />
              <span>{loading ? t("fetching") : "Grab Media"}</span>
            </button>
          </div>
        </div>

        {phase === "error" && error === "INVALID_URL" && (
          <p className="mono" style={{ color: "var(--err)", fontSize: 13, marginTop: 12, textAlign: "center" }}>
            That doesn&apos;t look like a supported link. Paste an Instagram, Facebook, Pinterest, X, TikTok, YouTube or Threads link — or an @username.
          </p>
        )}
        {phase === "error" && error && error !== "INVALID_URL" && (
          <div style={{ marginTop: 24 }}><ErrorCard code={error} onRetry={go} /></div>
        )}
        {(result || feed) && (
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 24 }}>
            {result && <ResultCard data={result} />}
            {feed && <ProfileFeedCard data={feed} showBulk />}
            <div style={{ maxWidth: 920, margin: "0 auto", width: "100%" }}><AdFrame slotH={280} /></div>
          </div>
        )}

        <style jsx>{`
          .nb-root { width: 100%; max-width: 760px; margin: 0 auto; }
          .nb-card { padding: 12px; border-radius: 24px; border: 1.5px solid rgba(34, 228, 255, 0.45);
            background: linear-gradient(165deg, #0A1238 0%, #0A0F34 60%, #120D38 100%);
            box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.16), 0 0 44px -16px rgba(34, 228, 255, 0.55);
            display: flex; flex-direction: column; gap: 12px; }
          @media (min-width: 640px) { .nb-card { padding: 14px; border-radius: 26px; gap: 14px; } }
          .nb-field { display: flex; flex-direction: column; align-items: stretch; padding: 0 12px 8px; border-radius: 18px;
            border: 1.5px solid rgba(139, 92, 246, 0.65); background: rgba(14, 20, 62, 0.85);
            transition: border-color 160ms ease, box-shadow 160ms ease; }
          .nb-field:focus-within { border-color: #22E4FF; box-shadow: 0 0 0 3px rgba(34, 228, 255, 0.22); }
          .nb-field.loading { opacity: 0.85; }
          .nb-row { display: flex; align-items: center; gap: 10px; height: 54px; }
          @media (min-width: 640px) { .nb-row { height: 60px; } }
          .nb-link { color: #EAF0FF; display: inline-flex; flex-shrink: 0; filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.8)); }
          /* 16px input = iPhone par focus karne par zoom nahi hota */
          .nb-input { flex: 1; min-width: 0; height: 100%; background: none; border: none; outline: none; color: #EAF0FF; font-size: 16px; text-overflow: ellipsis; }
          .nb-input::placeholder { color: #8A96C8; }
          /* Supported apps strip: chhote icons, non-clickable */
          .nb-support { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px 10px;
            padding-top: 8px; border-top: 1px solid rgba(139, 162, 255, 0.16);
            pointer-events: none; user-select: none; -webkit-user-select: none; cursor: default; }
          .nb-support :global(*) { pointer-events: none !important; cursor: default !important; user-select: none; }
          .nb-support :global(a), .nb-support :global(button) { text-decoration: none; }
          .nb-support :global(svg), .nb-support :global(img) { width: 16px !important; height: 16px !important; max-width: 16px; max-height: 16px; flex-shrink: 0; }
          @media (min-width: 640px) { .nb-support :global(svg), .nb-support :global(img) { width: 18px !important; height: 18px !important; max-width: 18px; max-height: 18px; } }
          .nb-tag { flex-shrink: 0; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #22E4FF;
            background: rgba(34, 228, 255, 0.12); border: 1px solid rgba(34, 228, 255, 0.35); text-transform: capitalize; }
          .nb-x { flex-shrink: 0; display: inline-flex; background: none; border: none; cursor: pointer; color: #C9D2F5; padding: 4px; }
          .nb-actions { display: grid; grid-template-columns: minmax(0, 0.72fr) minmax(0, 1fr); gap: 10px; }
          @media (min-width: 640px) { .nb-actions { gap: 14px; } }
          .nb-paste, .nb-grab { height: 54px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;
            gap: 8px; font-weight: 700; font-size: clamp(0.92rem, 0.8rem + 0.5vw, 1.1rem); cursor: pointer; color: #fff; white-space: nowrap;
            transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease; }
          .nb-paste { background: rgba(14, 22, 62, 0.9); border: 1.5px solid rgba(139, 162, 255, 0.4); }
          .nb-paste:hover { border-color: rgba(34, 228, 255, 0.7); }
          .nb-grab { border: none; background: linear-gradient(90deg, #22E4FF 0%, #4F8CFF 52%, #A855F7 100%);
            box-shadow: 0 10px 28px -10px rgba(34, 228, 255, 0.8), 0 0 24px -6px rgba(168, 85, 247, 0.6); }
          .nb-grab:hover:not(:disabled) { transform: translateY(-1px); }
          .nb-paste:active, .nb-grab:active { transform: scale(0.98); }
          .nb-paste:disabled, .nb-grab:disabled { opacity: 0.7; cursor: progress; }
          .nb-paste:focus-visible, .nb-grab:focus-visible, .nb-x:focus-visible { outline: 2px solid #22E4FF; outline-offset: 2px; }
          @media (min-width: 640px) { .nb-paste, .nb-grab { height: 60px; border-radius: 18px; gap: 10px; } }
          @media (max-width: 400px) { .nb-paste span { font-size: 0.88rem; } .nb-actions { gap: 8px; } .nb-tag { display: none; } }
        `}</style>
      </div>
    );
  }


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
            <button onClick={() => setEditing(true)} title="Edit link"
              style={{ background: "none", border: "none", cursor: "text", padding: 0, font: "inherit", color: "inherit" }}>
              {detected.label}/{detected.hint}…
            </button>
            <button onClick={() => setEditing(true)} aria-label="Edit link" title="Edit link"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", color: "var(--gold-ink)" }}>
              <Pencil size={13} strokeWidth={1.5} />
            </button>
            <button onClick={clear} aria-label="Clear" style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", color: "var(--ink-3)" }}>
              <X size={14} strokeWidth={1.5} />
            </button>
          </span>
        ) : (
          <input
            ref={inputRef} value={value} disabled={loading}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go()}
            onBlur={() => { if (editing && detected) setEditing(false); }}
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

      {below}

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
