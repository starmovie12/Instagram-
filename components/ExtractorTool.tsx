"use client";

import { useState } from "react";
import { LinkIcon, DownloadIcon } from "./Icons";
import { AdSlot } from "./Ads";

type Quality = { label: string; url: string; width?: number; height?: number };
type MediaItem = { type: "video" | "image"; url: string; thumbnail: string; qualities?: Quality[] };
type ExtractResult = {
  type: "video" | "image" | "carousel";
  shortcode: string;
  username: string;
  fullName: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  thumbnail: string;
  media: MediaItem[];
};

function downloadHref(url: string, filename: string): string {
  return `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={`btn ${copied ? "btn-copied" : ""}`}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); }
        catch {
          const ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          document.execCommand("copy"); ta.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}

/** Renders a per-quality download row (or a single button if only one quality). */
export function DownloadButtons({ item, base, index }: { item: MediaItem; base: string; index: number }) {
  const ext = item.type === "video" ? "mp4" : "jpg";
  const qs = item.qualities && item.qualities.length ? item.qualities : [{ label: item.type === "video" ? "HD" : "Original", url: item.url }];

  if (qs.length === 1) {
    return (
      <a className="btn btn-solid" href={downloadHref(qs[0].url, `${base}-${index + 1}.${ext}`)}>
        <DownloadIcon size={14} /> Download {item.type === "video" ? "Video" : "Photo"} · {qs[0].label}
      </a>
    );
  }
  return (
    <>
      <span className="q-label">Choose {item.type === "video" ? "video" : "image"} quality</span>
      {qs.map((q, qi) => (
        <a
          key={q.label + qi}
          className={`btn qbtn ${qi === 0 ? "btn-solid" : ""}`}
          href={downloadHref(q.url, `${base}-${index + 1}-${q.label}.${ext}`)}
        >
          <DownloadIcon size={13} /> {q.label}{qi === 0 ? " · Best" : ""}
        </a>
      ))}
    </>
  );
}

export default function ExtractorTool({ placeholder }: { placeholder?: string }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong. Please try again.");
      else setResult(data);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally { setLoading(false); }
  }

  async function handlePaste() {
    try { const t = await navigator.clipboard.readText(); if (t) setUrl(t.trim()); }
    catch { /* paste manually */ }
  }

  const base = result ? `instagrab-${result.shortcode}` : "instagrab";

  return (
    <div className="tool">
      <form className="urlbar" onSubmit={handleSubmit}>
        <div className="urlbar-field">
          <span className="link-ic"><LinkIcon size={16} /></span>
          <input
            type="url" inputMode="url" aria-label="Instagram URL"
            placeholder={placeholder ?? "Paste an Instagram reel or post link"}
            value={url} onChange={(e) => setUrl(e.target.value)} required
          />
          <button type="button" className="btn-paste" onClick={handlePaste}>Paste</button>
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? (<><span className="mini-spinner" />Fetching</>) : "Download"}
        </button>
      </form>

      <p className="tool-hint">No login · Public content only · We never store your links</p>

      {loading && (
        <div className="panel">
          <div className="row">
            <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#dddddd" strokeWidth="3" />
              <path d="M21 12a9 9 0 00-9-9" stroke="#181d26" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Fetching media…
          </div>
          <div className="track"><div className="indet" /></div>
        </div>
      )}

      {error && <div className="tool-error" role="alert">{error}</div>}

      {result && (
        <>
          <div className="result">
            {(result.username || result.fullName) && (
              <div className="result-head">
                <div className="avatar">{(result.username || "?").charAt(0).toUpperCase()}</div>
                <div className="who">
                  <b>@{result.username || "unknown"}</b>
                  {result.fullName && <span>{result.fullName}</span>}
                </div>
              </div>
            )}

            {result.media.map((item, i) => (
              <div className="media-item" key={i}>
                {result.media.length > 1 && <div className="slide-label">Slide {i + 1} of {result.media.length}</div>}
                {item.type === "video" ? (
                  <video className="media-preview" src={downloadHref(item.url, "")}
                    poster={item.thumbnail ? downloadHref(item.thumbnail, "") : undefined}
                    controls playsInline preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="media-preview" src={downloadHref(item.url, "")} alt="Instagram media preview" />
                )}
                <div className="media-actions">
                  <DownloadButtons item={item} base={base} index={i} />
                  {item.type === "video" && item.thumbnail && (
                    <a className="btn" href={downloadHref(item.thumbnail, `${base}-thumbnail.jpg`)}>Thumbnail</a>
                  )}
                </div>
              </div>
            ))}

            <div className="section">
              <h3>Caption{result.caption && <CopyButton text={result.caption} label="Copy caption" />}</h3>
              {result.caption ? <p className="caption-text">{result.caption}</p> : <p className="muted">No caption on this post.</p>}
            </div>

            <div className="section">
              <h3>
                <span>Hashtags {result.hashtags.length > 0 && `(${result.hashtags.length})`}</span>
                {result.hashtags.length > 0 && <CopyButton text={result.hashtags.join(" ")} label="Copy all" />}
              </h3>
              {result.hashtags.length > 0
                ? <div className="tags">{result.hashtags.map((t) => <span key={t}>{t}</span>)}</div>
                : <p className="muted">No hashtags on this post.</p>}
            </div>

            {result.mentions.length > 0 && (
              <div className="section">
                <h3><span>Mentions ({result.mentions.length})</span>
                  <CopyButton text={result.mentions.join(" ")} label="Copy" /></h3>
                <div className="tags">{result.mentions.map((m) => <span className="mention" key={m}>{m}</span>)}</div>
              </div>
            )}
          </div>
          <AdSlot label="below-result" />
        </>
      )}
    </div>
  );
}
