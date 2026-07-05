"use client";

import { useState } from "react";
import { DownloadIcon } from "./Icons";
import { AdSlot } from "./Ads";

type Mode = "dp" | "stories" | "viewer" | "highlights";
type StoryItem = { type: "video" | "image"; url: string; thumbnail: string; takenAt: number };
type HighlightAlbum = { id: string; title: string; cover: string };

function dl(url: string, filename: string): string {
  return `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
}
function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
const REQUEST_TYPE: Record<Mode, string> = { dp: "dp", stories: "stories", viewer: "stories", highlights: "highlights" };

export default function UsernameTool({ mode, placeholder }: { mode: Mode; placeholder?: string }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [items, setItems] = useState<Record<string, StoryItem[]>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || loading) return;
    setLoading(true); setError(null); setData(null); setItems({});
    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: REQUEST_TYPE[mode], username }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? "Something went wrong. Please try again.");
      else setData(json);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally { setLoading(false); }
  }

  async function loadHighlight(id: string) {
    if (items[id]) return;
    try {
      const res = await fetch("/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "highlight-items", highlightId: id }),
      });
      const json = await res.json();
      if (res.ok) setItems((p) => ({ ...p, [id]: json.items ?? [] }));
    } catch { /* ignore */ }
  }

  return (
    <div className="tool">
      <form className="urlbar" onSubmit={handleSubmit}>
        <span className="link-ic" style={{ fontSize: "1.1rem" }}>@</span>
        <input
          type="text" aria-label="Instagram username"
          placeholder={placeholder ?? "Enter @username or profile URL…"}
          value={username} onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none" autoCorrect="off" spellCheck={false} required
        />
        <button className="btn-gold btn-dl" type="submit" disabled={loading}>
          {loading ? "Fetching…" : mode === "viewer" ? "View" : (<><DownloadIcon /> Search</>)}
        </button>
      </form>

      <p className="tool-hint">🔒 No login · Public accounts only · 100% anonymous</p>

      {loading && (
        <div className="panel">
          <div className="row">
            <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="rgba(198,162,75,.25)" strokeWidth="3" />
              <path d="M21 12a9 9 0 00-9-9" stroke="#B8912F" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Fetching profile…
          </div>
          <div className="track"><div className="indet" /></div>
        </div>
      )}

      {error && <div className="tool-error" role="alert">⚠️ {error}</div>}

      {data && (
        <>
          <div className="result">
            <div className="result-head">
              <div className="avatar">
                {data.profilePicHd
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={dl(data.profilePicHd, "")} alt={`@${data.username} profile`} />
                  : (data.username || "?").charAt(0).toUpperCase()}
              </div>
              <div className="who">
                <b>@{data.username} {data.isVerified && "✔️"}</b>
                {data.fullName && <span>{data.fullName}</span>}
              </div>
            </div>

            {mode === "dp" && (
              <>
                {data.followers != null && (
                  <div className="stats-in" style={{ margin: "16px", borderRadius: "18px" }}>
                    <div className="stat"><div className="v">{fmt(data.posts)}</div><div className="l">Posts</div></div>
                    <div className="stat"><div className="v">{fmt(data.followers)}</div><div className="l">Followers</div></div>
                    <div className="stat"><div className="v">{fmt(data.following)}</div><div className="l">Following</div></div>
                  </div>
                )}
                <div className="media-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="media-preview" src={dl(data.profilePicHd, "")} alt={`@${data.username} full-size profile picture`} style={{ maxHeight: 400 }} />
                  <div className="media-actions">
                    <a className="btn btn-gold" href={dl(data.profilePicHd, `instagrab-${data.username}-dp.jpg`)}>
                      <DownloadIcon size={14} /> Download Profile Picture HD
                    </a>
                  </div>
                </div>
                {data.biography && (
                  <div className="section"><h3>Bio</h3><p className="caption-text">{data.biography}</p></div>
                )}
              </>
            )}

            {(mode === "stories" || mode === "viewer") && Array.isArray(data.items) && (
              <>
                <div className="slide-label" style={{ padding: "13px 18px 0" }}>
                  {data.items.length} active {data.items.length === 1 ? "story" : "stories"}
                </div>
                {data.items.map((item: StoryItem, i: number) => (
                  <div className="media-item" key={i}>
                    {item.type === "video"
                      ? <video className="media-preview" src={dl(item.url, "")} poster={item.thumbnail ? dl(item.thumbnail, "") : undefined} controls playsInline preload="metadata" />
                      // eslint-disable-next-line @next/next/no-img-element
                      : <img className="media-preview" src={dl(item.url, "")} alt="Story preview" />}
                    <div className="media-actions">
                      <a className="btn btn-gold" href={dl(item.url, `instagrab-${data.username}-story-${i + 1}.${item.type === "video" ? "mp4" : "jpg"}`)}>
                        <DownloadIcon size={14} /> Download {item.type === "video" ? "Video" : "Photo"}
                      </a>
                    </div>
                  </div>
                ))}
              </>
            )}

            {mode === "highlights" && Array.isArray(data.albums) && (
              <div className="hl-grid">
                {data.albums.map((a: HighlightAlbum) => (
                  <div className="hl-item" key={a.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="hl-cover" src={dl(a.cover, "")} alt={a.title} />
                    <span className="hl-title">{a.title}</span>
                    <a className="hl-dl" href={dl(a.cover, `instagrab-${data.username}-${a.title}-cover.jpg`)}>⬇ Cover</a>
                    <br />
                    <button className="hl-dl" style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => loadHighlight(a.id)}>
                      {items[a.id] ? `${items[a.id].length} stories ↓` : "Load stories"}
                    </button>
                    {items[a.id] && items[a.id].length > 0 && (
                      <div className="media-actions" style={{ padding: "8px 0", justifyContent: "center" }}>
                        {items[a.id].map((it, j) => (
                          <a key={j} className="btn" style={{ padding: "6px 10px", fontSize: "0.72rem" }}
                            href={dl(it.url, `instagrab-${data.username}-${a.title}-${j + 1}.${it.type === "video" ? "mp4" : "jpg"}`)}>
                            {it.type === "video" ? "🎬" : "🖼️"} {j + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <AdSlot label="below-result" />
        </>
      )}
    </div>
  );
}
