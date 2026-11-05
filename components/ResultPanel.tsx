"use client";
/**
 * ResultPanel (PRD §10.7, §25.3 E-8/E-9, A20). One card for every platform:
 * header (@author, verified, type badge, resolution · views · likes) → preview → ONE primary action
 * (Download HD / Download All ZIP / Download HD DP / Download Audio) → "More" row (thumbnail, audio,
 * quality, Save to Photos) → caption (3-line clamp + Read more, Copy Caption) → hashtag chips (each
 * copyable) + Copy Hashtags → mentions → profile extras → "Download another".
 * Styles: components/downloader.css (no inline <style>).
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, Check, ChevronDown, Copy, Download, ImageDown, Music, Package, RotateCcw, Share2, SlidersHorizontal } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { buildDownloadProxyUrl, type ExtractedResult, type MediaItem } from "@/lib/normalize";
import { celebrate, haptic } from "@/lib/feedback";
import { fmt } from "@/lib/media";
import { getPrefs } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/lib/toast";
import type { PlatformDef } from "@/lib/platforms";
import { triggerDownload } from "@/lib/download";

const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;
const MENTION_RE = /(?:^|[^\w.])@([A-Za-z0-9_.]{1,30})/g;
/** E-8: above this the browser should stream the file itself instead of us buffering it. */
export const MAX_BUFFER_BYTES = 150 * 1024 * 1024;

const unique = (a: string[]) => Array.from(new Set(a));
const extOf = (m: MediaItem) => (m.type === "video" ? "mp4" : m.type === "audio" ? "m4a" : "jpg");
const safeName = (s: string) => s.replace(/[^\w.-]/g, "").slice(0, 60) || "media";

function badgeOf(r: ExtractedResult, count: number): string {
  if (r.type === "profile") return "PROFILE";
  if (r.type === "thumbnail") return "THUMBNAIL";
  if (count > 1) return `CAROUSEL · ${count}`;
  const t = (r.type || r.media?.[0]?.type || "media").toUpperCase();
  return t === "IMAGE" ? "PHOTO" : t;
}

function useCanShareFiles(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const coarse = matchMedia("(pointer: coarse)").matches;
      const probe = new File([new Blob(["x"], { type: "image/jpeg" })], "probe.jpg", { type: "image/jpeg" });
      setOk(coarse && typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
    } catch { setOk(false); }
  }, []);
  return ok;
}

export default function ResultPanel({
  result, platform, focus, pulseSave, onAnother, children,
}: {
  result: ExtractedResult;
  platform: PlatformDef;
  /** Pill the user chose — "audio" / "thumbnail" make that the primary action. */
  focus?: string;
  /** R8 iOS: auto-save skipped → pulse the primary button + hint. */
  pulseSave?: boolean;
  onAnother: () => void;
  /** Profile extras (Stories / Highlights). */
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  const canShare = useCanShareFiles();
  const [copied, setCopied] = useState<string>("");
  const [zip, setZip] = useState<{ state: "idle" | "packing" | "done" | "error" | "toobig"; p: number }>({ state: "idle", p: 0 });
  const [qualityOpen, setQualityOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const caption = result.caption ?? "";
  const hashtags = useMemo(() => unique(caption.match(HASHTAG_RE) ?? []), [caption]);
  const mentions = useMemo(() => unique(Array.from(caption.matchAll(MENTION_RE), (m) => "@" + m[1])), [caption]);
  const media = useMemo(() => result.media ?? [], [result.media]);
  const isProfile = result.type === "profile";
  const isThumb = result.type === "thumbnail";
  const variants = isThumb && media.length > 1 ? media : null;
  const [vIdx, setVIdx] = useState(() => (variants && getPrefs().quality === "saver" ? variants.length - 1 : 0));
  const items = isThumb ? (media.length ? [media[Math.min(vIdx, media.length - 1)]] : []) : media;
  const multi = !isProfile && items.length > 1;
  const first = items[0];
  const user = result.author?.username;
  const base = safeName(user || platform.id);
  const audio = media.find((m) => m.audioUrl)?.audioUrl || result.audioUrl;
  const thumb = first?.type === "video" ? first.thumbnail || result.thumbnail : undefined;
  const nameFor = (m: MediaItem, i: number) => m.filename || `${base}-${i + 1}.${extOf(m)}`;

  useLayoutEffect(() => {
    const el = captionRef.current;
    if (!el) return;
    setClamped(el.scrollHeight > el.clientHeight + 1);
  }, [caption]);

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      haptic("Light");
      setTimeout(() => setCopied((c) => (c === id ? "" : c)), 1600);
    } catch { toast({ message: t("router.hint.longpress"), tone: "info" }); }
  }

  async function downloadZip(e: React.MouseEvent) {
    if (zip.state === "packing") return;
    celebrate(e.clientX, e.clientY);
    setZip({ state: "packing", p: 0 });
    try {
      const { default: JSZip } = await import("jszip");
      const z = new JSZip();
      let bytes = 0;
      const jobs = items.map((m, i) => ({ name: nameFor(m, i), url: m.url }));
      if (audio) jobs.push({ name: `${base}-audio.m4a`, url: audio });
      for (let i = 0; i < jobs.length; i++) {
        const r = await fetch(buildDownloadProxyUrl(jobs[i].url, jobs[i].name));
        if (!r.ok) throw new Error("fetch failed");
        const blob = await r.blob();
        bytes += blob.size;
        if (bytes > MAX_BUFFER_BYTES) { setZip({ state: "toobig", p: 0 }); return; }
        z.file(jobs[i].name, blob);
        setZip({ state: "packing", p: Math.round(((i + 1) / jobs.length) * 90) });
      }
      if (caption) z.file("caption.txt", caption);
      if (hashtags.length) z.file("hashtags.txt", hashtags.join(" "));
      z.file("info.txt", `Source: ${platform.name}\nAuthor: ${user ? "@" + user : "-"}\nSaved with InstaGrab — download only content you own or have permission to use.`);
      const blob = await z.generateAsync({ type: "blob" }, (m) => setZip({ state: "packing", p: 90 + Math.round(m.percent / 10) }));
      const href = URL.createObjectURL(blob);
      triggerDownload(href, `${base}-pack.zip`);
      setTimeout(() => URL.revokeObjectURL(href), 30_000);
      setZip({ state: "done", p: 100 });
      setTimeout(() => setZip({ state: "idle", p: 0 }), 2500);
    } catch {
      haptic("Error");
      setZip({ state: "error", p: 0 });
    }
  }

  async function shareToPhotos() {
    if (!first) return;
    try {
      const name = nameFor(first, 0);
      const r = await fetch(buildDownloadProxyUrl(first.url, name));
      const blob = await r.blob();
      if (blob.size > MAX_BUFFER_BYTES) { toast({ message: t("res.tooBig"), tone: "info" }); return; }
      const file = new File([blob], name, { type: blob.type || (first.type === "video" ? "video/mp4" : "image/jpeg") });
      await navigator.share({ files: [file] });
      haptic("Success");
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return; // user closed the share sheet
      toast({ message: t("res.zipFailed"), tone: "error" });
    }
  }

  const onSaved = (e: React.MouseEvent) => celebrate(e.clientX, e.clientY);
  const pulse = pulseSave ? " is-pulsing" : "";
  const meta: string[] = [];
  if (first?.width && first?.height) meta.push(`${first.width}×${first.height}`);
  if (typeof result.views === "number") meta.push(t("res.views", { n: fmt(result.views) }));
  if (typeof result.likes === "number") meta.push(t("res.likes", { n: fmt(result.likes) }));

  /* ── primary action (exactly one) ── */
  let primary: React.ReactNode = null;
  if (isProfile && result.author?.avatar) {
    primary = (
      <a id="rp-primary" className={`rp__primary${pulse}`} href={buildDownloadProxyUrl(result.author.avatar, `${base}-dp.jpg`)} download={`${base}-dp.jpg`} onClick={onSaved}>
        <Download size={20} strokeWidth={2.2} aria-hidden="true" /> {t("res.dp")}
      </a>
    );
  } else if (multi) {
    primary = (
      <button id="rp-primary" type="button" className={`rp__primary${pulse}`} onClick={downloadZip} disabled={zip.state === "packing"} aria-busy={zip.state === "packing"}>
        <Package size={20} strokeWidth={2.2} aria-hidden="true" />
        {zip.state === "packing" ? t("res.packing", { p: zip.p }) : zip.state === "done" ? t("res.saved") : t("res.downloadAll", { n: items.length + (audio ? 1 : 0) })}
      </button>
    );
  } else if (focus === "audio" && audio) {
    primary = (
      <a id="rp-primary" className={`rp__primary${pulse}`} href={buildDownloadProxyUrl(audio, `${base}-audio.m4a`)} download={`${base}-audio.m4a`} onClick={onSaved}>
        <Music size={20} strokeWidth={2.2} aria-hidden="true" /> {t("res.audio")}
      </a>
    );
  } else if (first) {
    const name = nameFor(first, 0);
    primary = (
      <a id="rp-primary" className={`rp__primary${pulse}`} href={buildDownloadProxyUrl(first.url, name)} download={name} onClick={onSaved}>
        <Download size={20} strokeWidth={2.2} aria-hidden="true" /> {t("res.downloadHd")}
      </a>
    );
  }

  const more: React.ReactNode[] = [];
  if (variants) more.push(
    <button key="q" type="button" className="rp__more-btn" aria-haspopup="dialog" onClick={() => setQualityOpen(true)}>
      <SlidersHorizontal size={18} strokeWidth={2} aria-hidden="true" /> {t("res.quality", { q: variants[vIdx]?.quality ?? "HD" })}
    </button>,
  );
  if (thumb && !multi) more.push(
    <a key="t" className="rp__more-btn" href={buildDownloadProxyUrl(thumb, `${base}-thumb.jpg`)} download={`${base}-thumb.jpg`} onClick={onSaved}>
      <ImageDown size={18} strokeWidth={2} aria-hidden="true" /> {t("res.thumb")}
    </a>,
  );
  if (audio && !multi && focus !== "audio") more.push(
    <a key="a" className="rp__more-btn" href={buildDownloadProxyUrl(audio, `${base}-audio.m4a`)} download={`${base}-audio.m4a`} onClick={onSaved}>
      <Music size={18} strokeWidth={2} aria-hidden="true" /> {t("res.audio")}
    </a>,
  );
  if (focus === "audio" && audio && first && !multi) more.push(
    <a key="v" className="rp__more-btn" href={buildDownloadProxyUrl(first.url, nameFor(first, 0))} download={nameFor(first, 0)} onClick={onSaved}>
      <Download size={18} strokeWidth={2} aria-hidden="true" /> {t("res.downloadHd")}
    </a>,
  );
  if (canShare && first && !multi && !isProfile) more.push(
    <button key="s" type="button" className="rp__more-btn" onClick={() => { void shareToPhotos(); }}>
      <Share2 size={18} strokeWidth={2} aria-hidden="true" /> {t("res.share")}
    </button>,
  );

  return (
    <article className="rp" aria-labelledby="rp-title">
      <header className="rp__head">
        {result.author?.avatar && !isProfile && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="rp__avatar" src={buildDownloadProxyUrl(result.author.avatar, "avatar.jpg")} alt="" width={40} height={40} />
        )}
        <div className="rp__who">
          <h2 id="rp-title" className="rp__name">
            <span className="rp__name-text">{user ? `@${user}` : result.title || t("res.ready")}</span>
            {result.author?.verified && <BadgeCheck className="rp__verified" size={18} strokeWidth={2.2} aria-label={t("res.verified")} />}
          </h2>
          <p className="rp__meta">
            <span className="rp__badge">{badgeOf(result, items.length)}</span>
            {meta.map((m) => <span key={m}>{m}</span>)}
          </p>
        </div>
      </header>

      {isProfile && result.author?.avatar && (
        <div className="rp__dp">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={buildDownloadProxyUrl(result.author.avatar, `${base}-dp.jpg`)} alt={t("res.dpAlt", { user: user ?? "" })} width={160} height={160} />
          {result.author.fullName && <p className="rp__fullname">{result.author.fullName}</p>}
          {typeof result.author.followers === "number" && (
            <dl className="rp__stats">
              <div><dt>{t("res.followers")}</dt><dd>{fmt(result.author.followers)}</dd></div>
              {typeof result.author.following === "number" && <div><dt>{t("res.following")}</dt><dd>{fmt(result.author.following)}</dd></div>}
              {typeof result.author.postsCount === "number" && <div><dt>{t("res.posts")}</dt><dd>{fmt(result.author.postsCount)}</dd></div>}
            </dl>
          )}
        </div>
      )}

      {!isProfile && items.length === 1 && first && (
        <div className="rp__preview" style={first.width && first.height ? { aspectRatio: `${first.width} / ${first.height}` } : undefined}>
          {first.type === "video" ? (
            <video src={buildDownloadProxyUrl(first.url, nameFor(first, 0))} poster={first.thumbnail ? buildDownloadProxyUrl(first.thumbnail, "poster.jpg") : undefined} controls playsInline preload="metadata" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={buildDownloadProxyUrl(first.url, nameFor(first, 0))} alt={t("res.itemAlt", { app: platform.name, n: 1 })} width={first.width} height={first.height} />
          )}
          {first.quality && <span className="rp__q">{first.quality}</span>}
        </div>
      )}

      {multi && (
        <ul className="rp__grid">
          {items.map((m, i) => {
            const name = nameFor(m, i);
            const href = buildDownloadProxyUrl(m.url, name);
            return (
              <li key={`${m.url}-${i}`} className="rp__cell">
                <div className="rp__cell-media">
                  {m.type === "video"
                    ? <video src={href} poster={m.thumbnail ? buildDownloadProxyUrl(m.thumbnail, "poster.jpg") : undefined} controls playsInline preload="none" />
                    // eslint-disable-next-line @next/next/no-img-element
                    : <img src={href} alt={t("res.itemAlt", { app: platform.name, n: i + 1 })} loading="lazy" />}
                </div>
                <a className="rp__cell-btn" href={href} download={name} onClick={onSaved}>
                  <Download size={18} strokeWidth={2.2} aria-hidden="true" /> {t("res.downloadItem", { n: i + 1 })}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <div className="rp__actions">
        {primary}
        {zip.state === "packing" && <progress className="rp__progress" max={100} value={zip.p} aria-label={t("res.packing", { p: zip.p })} />}
        {zip.state === "error" && <p className="rp__note" role="status">{t("res.zipFailed")}</p>}
        {zip.state === "toobig" && <p className="rp__note" role="status">{t("res.tooBig")}</p>}
        {pulseSave && <p className="rp__note rp__note--hint">{t("res.iosHint")}</p>}
        {more.length > 0 && <div className="rp__more" role="group" aria-label={t("res.more")}>{more}</div>}
      </div>

      {caption && !isProfile && (
        <section className="rp__caption" aria-label={t("res.caption")}>
          <div className="rp__caption-top">
            <h3 className="rp__h">{t("res.caption")}</h3>
            <button type="button" className="rp__copy" onClick={() => { void copy(caption, "caption"); }}>
              {copied === "caption" ? <Check size={16} strokeWidth={2.6} aria-hidden="true" /> : <Copy size={16} strokeWidth={2} aria-hidden="true" />}
              <span aria-live="polite">{copied === "caption" ? t("res.copied") : t("res.copyCaption")}</span>
            </button>
          </div>
          <p ref={captionRef} className="rp__caption-text" data-expanded={expanded ? "true" : "false"}>{caption}</p>
          {(clamped || expanded) && (
            <button type="button" className="rp__readmore" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
              {expanded ? t("res.readLess") : t("res.readMore")} <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          )}
          {hashtags.length > 0 && (
            <div className="rp__tags">
              <ul className="rp__chips">
                {hashtags.map((h) => (
                  <li key={h}>
                    <button type="button" className="rp__chip" onClick={() => { void copy(h, h); }} aria-label={`${h} — ${copied === h ? t("res.copied") : t("res.copyTags")}`}>
                      {copied === h ? t("res.copied") : h}
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="rp__copy" onClick={() => { void copy(hashtags.join(" "), "tags"); }}>
                {copied === "tags" ? <Check size={16} strokeWidth={2.6} aria-hidden="true" /> : <Copy size={16} strokeWidth={2} aria-hidden="true" />}
                <span aria-live="polite">{copied === "tags" ? t("res.copied") : t("res.copyTags")}</span>
              </button>
            </div>
          )}
          {mentions.length > 0 && <p className="rp__mentions"><span>{t("res.mentions")}:</span> {mentions.join(" · ")}</p>}
        </section>
      )}

      {children}

      <button type="button" className="rp__another" onClick={onAnother}>
        <RotateCcw size={18} strokeWidth={2} aria-hidden="true" /> {t("res.another")}
      </button>

      {variants && (
        <BottomSheet open={qualityOpen} onClose={() => setQualityOpen(false)} title={t("res.qualityTitle")} id="rp-quality">
          <div className="sheet-list">
            {variants.map((v, i) => (
              <button key={v.url} type="button" className="sheet-opt" aria-pressed={i === vIdx} onClick={() => { haptic("Selection"); setVIdx(i); setQualityOpen(false); }}>
                <span>{v.quality ?? `#${i + 1}`}</span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </article>
  );
}
