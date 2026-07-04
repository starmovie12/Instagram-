"use client";

import { useState } from "react";

type MediaItem = {
  type: "video" | "image";
  url: string;
  thumbnail: string;
};

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
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "✓ Copied!" : label}
    </button>
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
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong. Please try again.");
      else setResult(data);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      /* clipboard denied — paste manually */
    }
  }

  const base = result ? `instagrab-${result.shortcode}` : "instagrab";

  return (
    <div className="tool">
      <form className="tool-form" onSubmit={handleSubmit}>
        <div className="tool-input-wrap">
          <input
            className="tool-input"
            type="url"
            inputMode="url"
            placeholder={placeholder ?? "Paste Instagram link here… (reel, post, carousel)"}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Instagram URL"
            required
          />
          <button type="button" className="paste-btn" onClick={handlePaste}>📋 Paste</button>
        </div>
        <button className="go-btn" type="submit" disabled={loading}>
          {loading ? (<><span className="spinner" />Fetching…</>) : "Download"}
        </button>
      </form>

      <p className="tool-hint">🔒 No login • Public content only • We never store your links</p>

      {error && <div className="tool-error" role="alert">⚠️ {error}</div>}

      {result && (
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
              {result.media.length > 1 && (
                <div className="slide-label">Slide {i + 1} of {result.media.length}</div>
              )}
              {item.type === "video" ? (
                <video
                  className="media-preview"
                  src={downloadHref(item.url, "")}
                  poster={item.thumbnail ? downloadHref(item.thumbnail, "") : undefined}
                  controls playsInline preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="media-preview" src={downloadHref(item.url, "")} alt="Instagram media preview" />
              )}
              <div className="media-actions">
                <a
                  className="btn btn-gold"
                  href={downloadHref(item.url, `${base}-${i + 1}.${item.type === "video" ? "mp4" : "jpg"}`)}
                >
                  ⬇️ Download {item.type === "video" ? "Video HD" : "Photo HD"}
                </a>
                {item.type === "video" && item.thumbnail && (
                  <a className="btn" href={downloadHref(item.thumbnail, `${base}-thumbnail.jpg`)}>🖼️ Thumbnail</a>
                )}
              </div>
            </div>
          ))}

          <div className="section">
            <h3>
              📋 Caption
              {result.caption && <CopyButton text={result.caption} label="Copy Caption" />}
            </h3>
            {result.caption
              ? <p className="caption-text">{result.caption}</p>
              : <p className="muted">No caption on this post.</p>}
          </div>

          <div className="section">
            <h3>
              <span>#️⃣ Hashtags {result.hashtags.length > 0 && <span className="num">({result.hashtags.length})</span>}</span>
              {result.hashtags.length > 0 && (
                <CopyButton text={result.hashtags.join(" ")} label="Copy All Hashtags" />
              )}
            </h3>
            {result.hashtags.length > 0
              ? <div className="tags">{result.hashtags.map((t) => <span key={t}>{t}</span>)}</div>
              : <p className="muted">No hashtags on this post.</p>}
          </div>

          {result.mentions.length > 0 && (
            <div className="section">
              <h3>
                <span>@ Mentions <span className="num">({result.mentions.length})</span></span>
                <CopyButton text={result.mentions.join(" ")} label="Copy Mentions" />
              </h3>
              <div className="tags">{result.mentions.map((m) => <span className="mention" key={m}>{m}</span>)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
