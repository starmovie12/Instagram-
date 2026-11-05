"use client";
/**
 * Instagram profile options under the DP: public Stories + Highlights (PRD §7.6.2, R6).
 * `initial` auto-opens a panel when the user arrived with the Story / Highlights pill selected.
 */
import { useEffect, useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { profileExtras } from "@/lib/api";
import { buildDownloadProxyUrl } from "@/lib/normalize";
import { celebrate } from "@/lib/feedback";
import { useI18n } from "@/lib/i18n";
import ErrorCard, { type ErrorCode } from "@/components/ErrorCard";

type Item = { id?: string; type: "video" | "image"; url: string; thumbnail: string };
type Album = { id: string; title: string; cover: string };

export default function ProfileExtras({ username, initial }: { username: string; initial?: "stories" | "highlights" }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState<"" | "stories" | "highlights" | "album">("");
  const [items, setItems] = useState<Item[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [err, setErr] = useState<ErrorCode | null>(null);
  const booted = useRef(false);

  async function loadStories() {
    setBusy("stories"); setErr(null); setAlbums(null);
    const r = await profileExtras(username, "stories");
    setBusy("");
    if (!r.ok) { setErr(r.code === "EXTRACTOR_DOWN" || r.code === "NOT_FOUND" ? "STORY_EXPIRED" : r.code); setItems(null); return; }
    setItems((r.json.items as Item[]) ?? []);
  }
  async function loadHighlights() {
    setBusy("highlights"); setErr(null); setItems(null);
    const r = await profileExtras(username, "highlights");
    setBusy("");
    if (!r.ok) { setErr(r.code); setAlbums(null); return; }
    setAlbums((r.json.albums as Album[]) ?? []);
  }
  async function openAlbum(id: string) {
    setBusy("album"); setErr(null);
    const r = await profileExtras(username, "highlight-items", { highlightId: id });
    setBusy("");
    if (!r.ok) { setErr(r.code); return; }
    setItems((r.json.items as Item[]) ?? []);
  }

  useEffect(() => {
    if (booted.current || !initial) return;
    booted.current = true;
    if (initial === "stories") void loadStories(); else void loadHighlights();
  }, [initial]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="pe" aria-label={t("pe.label")}>
      <div className="pe__btns">
        <button type="button" className="pe__btn" onClick={loadStories} disabled={Boolean(busy)} aria-busy={busy === "stories"}>
          {busy === "stories" && <Loader2 size={18} className="pe__spin" aria-hidden="true" />} {t("pe.stories")}
        </button>
        <button type="button" className="pe__btn" onClick={loadHighlights} disabled={Boolean(busy)} aria-busy={busy === "highlights"}>
          {busy === "highlights" && <Loader2 size={18} className="pe__spin" aria-hidden="true" />} {t("pe.highlights")}
        </button>
      </div>
      {err && <div className="pe__err"><ErrorCard code={err} /></div>}
      {albums && !items && (
        <ul className="pe__albums">
          {albums.length === 0 && <li className="pe__empty">{t("pe.noHighlights")}</li>}
          {albums.map((a) => (
            <li key={a.id}>
              <button type="button" className="pe__album" onClick={() => { void openAlbum(a.id); }} disabled={busy === "album"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={buildDownloadProxyUrl(a.cover, "cover.jpg")} alt="" loading="lazy" width={72} height={72} />
                <span>{a.title || t("pe.highlight")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {items && (
        <ul className="pe__grid">
          {items.length === 0 && <li className="pe__empty">{t("pe.nothing")}</li>}
          {items.map((it, i) => {
            const name = `${username}-${i + 1}.${it.type === "video" ? "mp4" : "jpg"}`;
            const href = buildDownloadProxyUrl(it.url, name);
            return (
              <li key={it.id ?? i} className="pe__item">
                {it.type === "video"
                  ? <video src={href} poster={it.thumbnail ? buildDownloadProxyUrl(it.thumbnail, "poster.jpg") : undefined} controls playsInline preload="none" />
                  // eslint-disable-next-line @next/next/no-img-element
                  : <img src={href} alt={t("pe.storyAlt", { n: i + 1 })} loading="lazy" />}
                <a href={href} download={name} onClick={(e) => celebrate(e.clientX, e.clientY)} className="rp__cell-btn">
                  <Download size={18} strokeWidth={2.2} aria-hidden="true" /> {t("res.downloadItem", { n: i + 1 })}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
