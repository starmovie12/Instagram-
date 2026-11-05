"use client";
/**
 * PlatformDownloader — the app-page workspace (PRD §10, §0A MGF-1..4, §25.3).
 * Hero card → URL box (Paste + Download) → detection strip (✓ recognised — Change? · Recent (n))
 * → ≤ 5 type pills (+N More sheet, overflow auto-promotes into slot 4) → banners → result pane.
 * Phones: one column. ≥ 1024 px: 2-pane (440 px workspace | sticky result), max 1120 px.
 * Auto-detect rules R1–R15 are implemented here; comments mark each rule.
 * `embedded` drops the hero card for landing pages that already own an <h1>.
 */
import "./downloader.css";
import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ClipboardPaste, Download, History as HistoryIcon, Info, Link2, RotateCcw, Trash2, WifiOff, X } from "lucide-react";
import { PlatformTile } from "@/components/PlatformIcons";
import BottomSheet from "@/components/ui/BottomSheet";
import dynamic from "next/dynamic";
import AdFrame from "@/components/AdFrame";
import { grab, type GrabErr } from "@/lib/api";
import { resolveRoute, type Route } from "@/lib/router";
import { platformById, type PlatformDef, type PlatformId } from "@/lib/platforms";
import {
  addHistory, clearOffline, countCorrection, getHistory, getHistoryServerSnapshot, getPrefs, peekOffline, queueOffline,
  removeHistory, restoreHistory, setHandoff, subscribeStorage, takeHandoff, toHandoffKind,
  type GrabKind, type GrabPlatform, type GrabRecord, type QueuedGrab,
} from "@/lib/storage";
import { buildDownloadProxyUrl, type ExtractedResult } from "@/lib/normalize";
import { haptic, isIosSafari } from "@/lib/feedback";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { toast } from "@/lib/toast";
import { timeAgo } from "@/lib/time";
import { triggerDownload } from "@/lib/download";

/* Result / error UI is only needed after a fetch → separate chunks, prefetched when the page is idle. */
const loadResult = () => import("@/components/ResultPanel");
const ResultPanel = dynamic(loadResult, { loading: () => <div className="rp rp--skel" aria-hidden="true"><span /><span /><span /></div> });
const ErrorCard = dynamic(() => import("@/components/ErrorCard"));
const ProfileExtras = dynamic(() => import("@/components/ProfileExtras"));

type Phase = "idle" | "fetching" | "success" | "error";
type Banner =
  | { k: "mismatch"; target: PlatformId; url: string; kind?: string }
  | { k: "kind"; kind: string; pill: string }
  | { k: "wrong" }
  | { k: "incomplete" }
  | { k: "hint" };
type RunOpts = { mode?: string; kind?: string; force?: boolean; pill?: string };

/** detector kind → pill id */
const KIND_TO_PILL: Record<string, string> = {
  reel: "reel", story: "story", highlights: "highlights", post: "photo", video: "video", photo: "photo",
  profile: "profile", thumbnail: "thumbnail", image: "image",
};
const PLACEHOLDER: Record<string, I18nKey> = {
  story: "ws.ph.story", profile: "ws.ph.profile", highlights: "ws.ph.highlights", audio: "ws.ph.audio",
};
const KIND_WORD: Record<string, string> = {
  reel: "Reel", story: "Story", highlights: "Highlights", post: "Post", video: "Video", photo: "Photo", profile: "Profile", thumbnail: "Thumbnail", image: "Image",
};

function hasPill(def: PlatformDef, id: string | undefined): id is string {
  return Boolean(id) && def.pills.some((p) => p.id === id);
}
/** Map a detector kind onto this platform's pill ids ("photo" ↔ "image" alias). */
function pillFor(def: PlatformDef, kind: string | undefined): string | undefined {
  const id = kind ? KIND_TO_PILL[kind] : undefined;
  if (hasPill(def, id)) return id;
  if (id === "photo" && hasPill(def, "image")) return "image";
  if (id === "image" && hasPill(def, "photo")) return "photo";
  return undefined;
}
/** R14: the pill the fetched result actually matches. */
function pillFromResult(def: PlatformDef, r: ExtractedResult, kind: string | undefined): string | undefined {
  if (r.type === "profile") return pillFor(def, "profile");
  if (r.type === "thumbnail") return pillFor(def, "thumbnail");
  const media = r.media ?? [];
  if (media.length > 1) return pillFor(def, "photo");
  if (media[0]?.type === "video") return kind === "reel" && hasPill(def, "reel") ? "reel" : pillFor(def, kind === "story" ? "story" : "video") ?? pillFor(def, "video");
  if (media[0]?.type === "image") return kind === "story" ? pillFor(def, "story") : pillFor(def, "photo");
  return undefined;
}
function histKind(kind: string | undefined, r: ExtractedResult): GrabKind {
  if (r.type === "profile") return "profile";
  if (r.type === "thumbnail") return "thumbnail";
  if ((r.media?.length ?? 0) > 1) return "carousel";
  if (kind === "reel" || kind === "story" || kind === "video") return kind;
  if (kind === "highlights") return "story";
  if (r.type === "video" || r.type === "reel") return "video";
  if (r.type === "story") return "story";
  return r.media?.[0]?.type === "image" ? "photo" : "other";
}
const getHistorySnap = getHistory as () => GrabRecord[] | null;

export default function PlatformDownloader({
  platform, presetPill, h1, lead, embedded = false,
}: {
  platform: PlatformId;
  /** Legacy SEO URL (reels-downloader…) → pill preselected. */
  presetPill?: string;
  h1?: React.ReactNode;
  lead?: string;
  embedded?: boolean;
}) {
  const def = platformById(platform)!;
  const { t, lang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRun = useRef<{ v: string; t: number } | null>(null);
  const booted = useRef(false);

  const initialPill = hasPill(def, presetPill) ? presetPill : "auto";
  const [input, setInput] = useState("");
  const [pill, setPillState] = useState(initialPill);
  const pillRef = useRef(initialPill);
  const setPill = (id: string) => { pillRef.current = id; setPillState(id); };
  const [autoSel, setAutoSel] = useState(false);
  const autoSelRef = useRef(false);
  autoSelRef.current = autoSel;
  const [slot4, setSlot4] = useState<string | undefined>(initialPill);
  const [phase, setPhaseState] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const setPhase = (p: Phase) => { phaseRef.current = p; setPhaseState(p); };
  const [result, setResult] = useState<ExtractedResult | null>(null);
  const [error, setError] = useState<GrabErr | null>(null);
  const [errUser, setErrUser] = useState<string | undefined>();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [queued, setQueued] = useState<QueuedGrab | null>(null);
  const [pulse, setPulse] = useState(false);
  const [shake, setShake] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreAll, setMoreAll] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const [profileInit, setProfileInit] = useState<"stories" | "highlights" | undefined>();
  const lastKind = useRef<string | undefined>(undefined);

  const history = useSyncExternalStore(subscribeStorage, getHistorySnap, getHistoryServerSnapshot);
  const recent = useMemo(() => (history ?? []).filter((r) => r.platform === platform).slice(0, 12), [history, platform]);

  /* ── pills: ≤ 5 visible (MGF-4) ── */
  const needsMore = def.pills.length > 5;
  const head = needsMore ? def.pills.slice(0, 3) : def.pills;
  const overflow = needsMore ? def.pills.slice(3) : [];
  const fourth = needsMore ? overflow.find((p) => p.id === slot4) ?? overflow[0] : undefined;
  const sheetPills = overflow.filter((p) => p !== fourth);
  const promote = (id: string) => { if (overflow.some((p) => p.id === id)) setSlot4(id); };

  const live = input.trim() ? resolveRoute(input, { allowBareUsername: false }) : null;
  const detected = live && live.type === "app" && live.platform === platform ? live : null;
  const detectedPill = detected ? pillFor(def, detected.kind) : undefined;

  const focusInput = () => inputRef.current?.focus();
  const reveal = () => {
    const el = outRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.75 || r.bottom < 0) {
      el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  };
  /** E-9: same link again within 10 s → no refetch, point at the existing result. */
  const readyBelow = () => {
    toast({ message: t("ws.ready"), tone: "info" });
    reveal();
    setTimeout(() => document.getElementById("rp-primary")?.focus({ preventScroll: true }), 50);
  };

  /* ── fetch (R12: a new request aborts the previous one) ── */
  const run = useCallback(async (raw: string, opts: RunOpts = {}) => {
    const value = raw.trim();
    if (!value) return;
    const prev = lastRun.current;
    if (!opts.force && prev && prev.v === value && Date.now() - prev.t < 10_000 && phaseRef.current === "success") { readyBelow(); return; } // R9
    // MGF-2: offline → queue the link, fetch automatically when the connection returns
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      queueOffline(value, pathname);
      setQueued(peekOffline());
      setPhase("idle");
      haptic("Warning");
      return;
    }
    lastRun.current = { v: value, t: Date.now() };
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setPhase("fetching"); setError(null); setResult(null); setPulse(false); setQueued(null);
    const usedPill = opts.pill ?? pillRef.current;
    try {
      const r = await grab({ input: value, platform, mode: opts.mode, signal: ac.signal });
      if (ac.signal.aborted) return;
      if (!r.ok) {
        if (r.code === "OFFLINE") { queueOffline(value, pathname); setQueued(peekOffline()); setPhase("idle"); return; }
        const u = resolveRoute(value, { allowBareUsername: false });
        setErrUser(platform === "instagram" && u.type === "app" && u.kind === "story" ? u.url.match(/stories\/([\w.]+)/i)?.[1] : undefined);
        setError(r); setPhase("error"); haptic("Error");
        return;
      }
      const k = opts.kind ?? lastKind.current;
      setResult(r.data); setPhase("success"); haptic("Success");
      // R14: preselected kind silently corrected to what the link really was
      if (autoSelRef.current || usedPill === "auto") {
        const actual = pillFromResult(def, r.data, k);
        if (autoSelRef.current && actual && actual !== usedPill) { setPill(actual); promote(actual); }
      }
      // R11: every success → unified History (+ ig:history-updated via storage bus)
      addHistory({
        platform: platform as GrabPlatform, kind: histKind(k, r.data), url: value,
        author: r.data.author?.username ? "@" + r.data.author.username : undefined, title: r.data.title,
        thumbnail: r.data.thumbnail && !r.data.thumbnail.startsWith("data:") ? r.data.thumbnail : undefined,
      });
      requestAnimationFrame(reveal);
      // R7 / R8: single media + Auto-save
      const single = (r.data.media?.length ?? 0) === 1 && r.data.type !== "profile" && r.data.type !== "thumbnail";
      if (single && getPrefs().autoSave && usedPill !== "audio") {
        if (isIosSafari()) setPulse(true);
        else {
          const m = r.data.media![0];
          triggerDownload(buildDownloadProxyUrl(m.url, m.filename || `${platform}-${Date.now()}.${m.type === "video" ? "mp4" : "jpg"}`), "");
          toast({ message: t("ws.started"), tone: "success" });
        }
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError({ ok: false, code: "EXTRACTOR_DOWN", message: "" }); setPhase("error");
    }
  }, [platform, pathname, def]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── routing checks (R3/R4/R5/R6), then fetch ── */
  const start = useCallback((raw: string, o: { redirected?: boolean; kindHint?: string; pill?: string; force?: boolean } = {}) => {
    const p = o.pill ?? pillRef.current;
    let route: Route = resolveRoute(raw, { allowBareUsername: platform === "instagram" });
    if (route.type === "batch") { // several links pasted on an app page → first one + notice
      const firstUrl = route.urls[0];
      toast({ message: t("ws.extra", { n: route.urls.length - 1 }), tone: "info" });
      route = resolveRoute(firstUrl);
    }
    if (route.type === "incomplete") { setBanner({ k: "incomplete" }); haptic("Warning"); return; }
    if (route.type !== "app") { setBanner({ k: "wrong" }); haptic("Warning"); return; }
    if (route.extraLinks) toast({ message: t("ws.extra", { n: route.extraLinks }), tone: "info" });

    // R3: link from another platform
    if (route.platform !== platform) {
      const target = platformById(route.platform)!;
      if (p === "auto" && !o.redirected && getPrefs().autoRoute) {
        const handed = setHandoff({ url: route.url, kind: toHandoffKind(route.kind), src: "home" });
        toast({ message: t("ws.redirect", { app: target.name }), tone: "info" });
        const qs = new URLSearchParams({ src: "home", r: "1" }); // R13: redirect at most once
        if (route.kind) qs.set("kind", route.kind);
        if (!handed) qs.set("url", route.url);
        router.replace(`${target.route}?${qs.toString()}`);
        return;
      }
      setBanner({ k: "mismatch", target: route.platform, url: route.url, kind: route.kind });
      return;
    }
    setBanner(null);
    // R4/R5: chosen pill ≠ link kind → non-blocking banner + 1-tap switch (fetch still runs)
    const wanted = pillFor(def, route.kind);
    const wantsProfileTools = (p === "story" || p === "highlights") && route.kind === "profile";
    if (p !== "auto" && wanted && wanted !== p && !wantsProfileTools) setBanner({ k: "kind", kind: route.kind ?? "", pill: wanted });
    lastKind.current = route.kind;
    // R6: @username → profile DP (+ Stories / Highlights when that pill is active)
    if (platform === "instagram" && route.kind === "profile") {
      setProfileInit(p === "story" ? "stories" : p === "highlights" ? "highlights" : undefined);
      void run(route.url.startsWith("@") ? route.url : raw, { mode: "profile", kind: "profile", force: o.force, pill: p });
      return;
    }
    setProfileInit(undefined);
    void run(route.url, { kind: route.kind ?? o.kindHint, mode: p === "profile" ? "profile" : undefined, force: o.force, pill: p });
  }, [platform, router, run, def, t]);

  /* ── boot: handoff / ?url= / kind preselect / offline queue (R2, R13–R15, MGF-2) ── */
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    // window.location (not useSearchParams) so the whole workspace — incl. the <h1> — is server-rendered
    const params = new URLSearchParams(window.location.search);
    const src = params.get("src");
    const kind = params.get("kind") || undefined;
    const redirected = params.get("r") === "1";
    const more = Number(params.get("more") || 0);
    if (more > 0) toast({ message: t("ws.extra", { n: more }), tone: "info" });
    const kp = pillFor(def, kind);
    if (kp && kp !== "auto") { setPill(kp); setAutoSel(true); autoSelRef.current = true; promote(kp); }
    const handoff = src ? takeHandoff() : null; // R15: read-once
    const urlParam = params.get("url");
    const link = (handoff?.url || urlParam || "").slice(0, 2048);
    if (link) {
      setInput(link);
      // From Home / History → always fetch. Plain ?url= → follow the Auto-fetch setting.
      if (handoff || getPrefs().autoFetch) start(link, { redirected, kindHint: kind, pill: kp ?? pillRef.current });
      try { window.history.replaceState(window.history.state, "", window.location.pathname); } catch { /* ignore */ }
      return;
    }
    const q = peekOffline();
    if (q && q.route === pathname) {
      setInput(q.url);
      if (navigator.onLine) { clearOffline(); start(q.url, { force: true }); } else setQueued(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Warm the result chunks while the user is still copying a link */
  useEffect(() => {
    const warm = () => { void loadResult(); void import("@/components/ErrorCard"); };
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (ric) ric(warm); else setTimeout(warm, 1500);
  }, []);

  /* MGF-2: connection back → run the queued link */
  useEffect(() => {
    const onOnline = () => {
      const q = peekOffline();
      if (!q || q.route !== pathname) return;
      clearOffline(); setQueued(null); setInput(q.url); start(q.url, { force: true });
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [pathname, start]);

  /* R1: paste anywhere on the page (outside fields) */
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.closest("input, textarea, [contenteditable='true']"))) return;
      const text = e.clipboardData?.getData("text")?.trim();
      if (!text) return;
      e.preventDefault();
      setInput(text); start(text);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [start]);

  /* R1: typing → 500 ms → auto-fetch (valid links only) */
  const onChange = (v: string) => {
    setInput(v);
    if (debounce.current) clearTimeout(debounce.current);
    if (banner?.k !== "mismatch") setBanner(null);
    if (!getPrefs().autoFetch) return;
    if (resolveRoute(v, { allowBareUsername: false }).type !== "app") return;
    debounce.current = setTimeout(() => start(v), 500);
  };

  /* R10: clear resets everything and refocuses */
  const clear = () => {
    abortRef.current?.abort();
    if (debounce.current) clearTimeout(debounce.current);
    setInput(""); setResult(null); setError(null); setPhase("idle"); setBanner(null); setPulse(false); setProfileInit(undefined);
    lastRun.current = null;
    focusInput();
  };
  const cancel = () => { abortRef.current?.abort(); setPhase("idle"); haptic("Rigid"); };

  const paste = async () => {
    haptic("Light");
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (text) { setInput(text); if (debounce.current) clearTimeout(debounce.current); start(text, { force: true }); return; }
    } catch { /* permission denied → E-7 hint */ }
    focusInput();
    setBanner({ k: "hint" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounce.current) clearTimeout(debounce.current);
    if (!input.trim()) { // E-1
      setShake(true); haptic("Warning"); setTimeout(() => setShake(false), 320); focusInput(); return;
    }
    haptic("Medium");
    start(input, { force: phaseRef.current !== "success" });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDropping(false);
    const text = (e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text")).trim();
    if (text) { setInput(text); start(text); }
  };

  /* MGF-1: user overrides what detection picked → count the correction (kinds only, never a URL) */
  const choose = (id: string) => {
    haptic("Selection");
    const from = autoSel ? pill : detectedPill;
    if (from && from !== "auto" && id !== "auto" && from !== id) countCorrection(from, id);
    setPill(id); setAutoSel(false); promote(id); setBanner(null); setMoreOpen(false);
    if (input.trim() && phaseRef.current !== "fetching" && (id === "story" || id === "highlights") && detected?.kind === "profile") start(input, { pill: id, force: true });
  };

  const regrab = (r: GrabRecord) => { setRecentOpen(false); setInput(r.url); start(r.url, { force: true }); };
  const remove = (r: GrabRecord) => {
    const gone = removeHistory(r.id);
    haptic("Rigid");
    if (gone) toast({ message: t("ws.removed"), action: { label: t("ws.undo"), run: () => restoreHistory(gone) } });
  };

  const placeholder = PLACEHOLDER[pill] ? t(PLACEHOLDER[pill]) : def.placeholder;
  const ringState = phase === "fetching" ? "detecting" : phase === "error" ? "error" : "idle";
  const profileName = result?.type === "profile" ? result.author?.username : undefined;
  const pillBtn = (id: string, label: string) => (
    <button key={id} type="button" className="pdw-pill" aria-pressed={pill === id} onClick={() => choose(id)}>
      {label}{pill === id && autoSel && id !== "auto" ? <span className="pdw-pill__auto">· {t("ws.autoSelected")}</span> : null}
    </button>
  );

  return (
    <div className={`pdw${embedded ? " pdw--embedded" : ""}`} data-phase={phase}>
      <div className="pdw__main">
        {!embedded && (
          <section className="pdw-hero" aria-labelledby="pdw-h1">
            <PlatformTile name={def.iconKey} size={56} showLabel={false} />
            <div className="pdw-hero__txt">
              <h1 id="pdw-h1" className="pdw-hero__h1">{h1 ?? `${def.name} Downloader`}</h1>
              <p className="pdw-hero__lead">{lead ?? def.desc}</p>
              <ul className="pdw-hero__chips" aria-label={t("ws.features")}>
                {def.chips.slice(0, 3).map((c) => <li key={c}><Check size={14} strokeWidth={3} aria-hidden="true" /> {c}</li>)}
              </ul>
            </div>
          </section>
        )}

        {/* URL box + Paste + Download (§10.3) */}
        <div className="pdw-card" data-ring={ringState} data-spectrum data-dropping={dropping ? "true" : "false"}
          onDragOver={(e) => { e.preventDefault(); setDropping(true); }} onDragLeave={() => setDropping(false)} onDrop={onDrop}>
          <span className="pdw-card__ring" aria-hidden="true"><span className="pdw-card__ring-spin" /></span>
          <form onSubmit={submit} className="pdw-form" noValidate role="search" aria-label={t("ws.inputLabel", { app: def.name })}>
            <div className={`pdw-field${shake ? " is-shaking" : ""}`}>
              <Link2 className="pdw-field__icon" size={20} strokeWidth={2} aria-hidden="true" />
              <input
                ref={inputRef} type="text" value={input} onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape" && input) { e.preventDefault(); clear(); } }}
                placeholder={placeholder} aria-label={t("ws.inputLabel", { app: def.name })} aria-describedby="pdw-strip"
                inputMode="url" autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} enterKeyHint="go"
                maxLength={10_000} className="pdw-field__input"
              />
              {input && <button type="button" className="pdw-field__x" onClick={clear} aria-label={t("home.clear")}><X size={20} strokeWidth={2.2} aria-hidden="true" /></button>}
            </div>
            <div className="pdw-actions">
              <button type="button" className="pdw-btn pdw-btn--sec" onClick={() => { void paste(); }}>
                <ClipboardPaste size={20} strokeWidth={2} aria-hidden="true" /> {t("ws.paste")}
              </button>
              <button type="submit" className="pdw-btn pdw-btn--pri" aria-busy={phase === "fetching"} aria-disabled={phase === "fetching"}>
                {phase === "fetching"
                  ? <><span className="pdw-spin" aria-hidden="true" /> {t("ws.fetching")}</>
                  : <><Download size={20} strokeWidth={2.2} aria-hidden="true" /> {t("ws.download")}</>}
              </button>
            </div>
          </form>
        </div>

        {/* Detection strip — height reserved (CLS 0): ✓ recognised — Change? · Recent (n) */}
        <div id="pdw-strip" className="pdw-strip" aria-live="polite">
          {phase === "fetching" ? (
            <p className="pdw-strip__chip">
              <span className="pdw-strip__text">{t("ws.loading")}</span>
              <button type="button" className="pdw-strip__link" onClick={cancel}>{t("router.chip.cancel")}</button>
            </p>
          ) : detected ? (
            <p className="pdw-strip__chip pdw-strip__chip--ok">
              <Check size={16} strokeWidth={3} aria-hidden="true" />
              <span className="pdw-strip__text">{t("ws.detected", { what: detected.label })}</span>
              {def.pills.length > 1 && <button type="button" className="pdw-strip__link" aria-haspopup="dialog" onClick={() => { setMoreAll(true); setMoreOpen(true); }}>{t("ws.change")}</button>}
            </p>
          ) : <span />}
          {recent.length > 0 && (
            <button type="button" className="pdw-recent" aria-haspopup="dialog" aria-label={t("ws.recent", { n: recent.length })} onClick={() => setRecentOpen(true)}>
              <HistoryIcon size={16} strokeWidth={2} aria-hidden="true" />
              <span className="pdw-recent__full" aria-hidden="true">{t("ws.recent", { n: recent.length })}</span>
              <span className="pdw-recent__short" aria-hidden="true">{recent.length}</span>
            </button>
          )}
        </div>

        {/* Type pills — ≤ 5 visible (§10.4, MGF-4) */}
        {def.pills.length > 1 && (
          <div className="pdw-pills" role="group" aria-label={t("ws.types")}>
            {head.map((p) => pillBtn(p.id, p.label))}
            {fourth && pillBtn(fourth.id, fourth.label)}
            {sheetPills.length > 0 && (
              <button type="button" className="pdw-pill pdw-pill--more" aria-haspopup="dialog" aria-expanded={moreOpen && !moreAll} onClick={() => { setMoreAll(false); setMoreOpen(true); }}>
                {t("ws.more", { n: sheetPills.length })}
              </button>
            )}
          </div>
        )}

        {platform === "youtube" && (
          <p className="pdw-banner pdw-banner--info" role="note"><Info size={18} strokeWidth={2} aria-hidden="true" /> <span>{t("app.banner.youtube")}</span></p>
        )}
        {banner && <BannerView b={banner} def={def} t={t} onSwitch={(id) => choose(id)} onAuto={() => choose("auto")} onHow={() => setHowOpen(true)}
          onGo={(b) => { const target = platformById(b.target)!; const ok = setHandoff({ url: b.url, kind: toHandoffKind(b.kind), src: "home" }); router.push(`${target.route}?src=home&r=1${b.kind ? `&kind=${b.kind}` : ""}${ok ? "" : `&url=${encodeURIComponent(b.url)}`}`); }} />}
        {queued && (
          <div className="pdw-banner pdw-banner--info" role="status">
            <WifiOff size={18} strokeWidth={2} aria-hidden="true" />
            <span className="pdw-banner__text">{t("ws.offline")}</span>
            <span className="pdw-banner__acts">
              <button type="button" className="pdw-banner__btn" onClick={() => { clearOffline(); setQueued(null); start(queued.url, { force: true }); }}>{t("ws.offlineRetry")}</button>
              <button type="button" className="pdw-banner__btn pdw-banner__btn--ghost" onClick={() => { clearOffline(); setQueued(null); }}>{t("ws.offlineCancel")}</button>
            </span>
          </div>
        )}
      </div>

      {/* Result pane (sticky on desktop) */}
      <div ref={outRef} className="pdw__out" aria-label={t("ws.result")}>
        {phase === "idle" && !embedded && (
          <div className="pdw-idle">
            <p className="pdw-idle__title">{t("ws.hintTitle")}</p>
            <ol className="pdw-idle__steps">
              <li>{t("ws.hint1", { app: def.name })}</li>
              <li>{t("ws.hint2")}</li>
              <li>{t("ws.hint3")}</li>
            </ol>
          </div>
        )}
        {phase === "fetching" && <div className="rp rp--skel" aria-hidden="true"><span /><span /><span /></div>}
        {phase === "error" && error && (
          <ErrorCard code={error.code} app={def.name} retryAfter={error.retryAfter} username={errUser}
            onRetry={() => start(input, { force: true })}
            onPaste={() => { clear(); void paste(); }}
            onProfile={(u) => { setInput("@" + u); start("@" + u, { force: true }); }} />
        )}
        {phase === "success" && result && (
          <>
            <ResultPanel result={result} platform={def} focus={pill} pulseSave={pulse} onAnother={clear}>
              {profileName && platform === "instagram" && (
                <>
                  <ProfileExtras username={profileName} initial={profileInit} />
                  <FindElsewhere user={profileName} t={t} />
                </>
              )}
            </ResultPanel>
            <div className="pdw-ad"><AdFrame slotH={280} /></div>
          </>
        )}
      </div>

      {/* Sheets */}
      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title={t("ws.moreTitle")} id="pdw-more">
        <div className="sheet-list">
          {(moreAll || !needsMore ? def.pills : sheetPills).map((p) => (
            <button key={p.id} type="button" className="sheet-opt" aria-pressed={pill === p.id} onClick={() => choose(p.id)}>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>
      <BottomSheet open={recentOpen} onClose={() => setRecentOpen(false)} title={t("ws.recentTitle", { app: def.name })} id="pdw-recent">
        <ul className="pdw-rlist">
          {recent.map((r) => (
            <li key={r.id} className="pdw-rrow">
              <button type="button" className="pdw-rrow__main" onClick={() => regrab(r)}>
                {r.thumbnail
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={buildDownloadProxyUrl(r.thumbnail, "thumb.jpg")} alt="" width={48} height={48} loading="lazy" />
                  : <PlatformTile name={def.iconKey} size={48} showLabel={false} />}
                <span className="pdw-rrow__txt">
                  <span className="pdw-rrow__title">{r.author ?? r.title ?? r.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 48)}</span>
                  <span className="pdw-rrow__meta">{KIND_WORD[r.kind] ?? r.kind} · {timeAgo(r.at, lang)}</span>
                </span>
              </button>
              <button type="button" className="pdw-rrow__icon" onClick={() => regrab(r)} aria-label={`${t("ws.regrab")}: ${r.author ?? r.title ?? def.name}`}>
                <RotateCcw size={20} strokeWidth={2} aria-hidden="true" />
              </button>
              <button type="button" className="pdw-rrow__icon pdw-rrow__icon--danger" onClick={() => remove(r)} aria-label={`${t("ws.delete")}: ${r.author ?? r.title ?? def.name}`}>
                <Trash2 size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <Link href="/history" className="pdw-rlist__all" onClick={() => setRecentOpen(false)}>{t("ws.offlineHistory")}</Link>
      </BottomSheet>
      <BottomSheet open={howOpen} onClose={() => setHowOpen(false)} title={t("home.howtoCopy")} id="pdw-how">
        <ol className="pdw-how">
          <li>{t("home.howtoStep1")}</li>
          <li>{t("home.howtoStep2")}</li>
          <li>{t("home.howtoStep3")}</li>
        </ol>
        <button type="button" className="pdw-btn pdw-btn--sec pdw-btn--block" onClick={() => { setHowOpen(false); void paste(); }}>
          <ClipboardPaste size={20} strokeWidth={2} aria-hidden="true" /> {t("ws.paste")}
        </button>
      </BottomSheet>
      {dropping && <div className="pdw-drop" aria-hidden="true"><span>{t("home.drop")}</span></div>}
    </div>
  );
}

type T = ReturnType<typeof useI18n>["t"];

function BannerView({ b, def, t, onSwitch, onAuto, onHow, onGo }: {
  b: Banner; def: PlatformDef; t: T; onSwitch: (id: string) => void; onAuto: () => void; onHow: () => void;
  onGo: (b: Extract<Banner, { k: "mismatch" }>) => void;
}) {
  if (b.k === "mismatch") {
    const target = platformById(b.target)!;
    return (
      <div className="pdw-banner" role="status">
        <span className="pdw-banner__text">{t("ws.mismatch", { app: target.name })}</span>
        <span className="pdw-banner__acts"><button type="button" className="pdw-banner__btn" onClick={() => onGo(b)}>{t("ws.mismatchGo", { app: target.name })}</button></span>
      </div>
    );
  }
  if (b.k === "kind") {
    const label = def.pills.find((p) => p.id === b.pill)?.label ?? b.pill;
    return (
      <div className="pdw-banner" role="status">
        <span className="pdw-banner__text">{t("ws.kindMismatch", { kind: KIND_WORD[b.kind] ?? label })}</span>
        <span className="pdw-banner__acts">
          <button type="button" className="pdw-banner__btn" onClick={() => onSwitch(b.pill)}>{t("ws.switchTo", { kind: label })}</button>
          <button type="button" className="pdw-banner__btn pdw-banner__btn--ghost" onClick={onAuto}>{t("ws.useAuto")}</button>
        </span>
      </div>
    );
  }
  if (b.k === "incomplete") {
    return (
      <div className="pdw-banner pdw-banner--warn" role="alert">
        <span className="pdw-banner__text">{t("router.err.incomplete")}</span>
        <span className="pdw-banner__acts"><button type="button" className="pdw-banner__btn" aria-haspopup="dialog" onClick={onHow}>{t("home.howtoCopy")}</button></span>
      </div>
    );
  }
  if (b.k === "hint") return <p className="pdw-banner pdw-banner--info" role="status">{t("router.hint.longpress")}</p>;
  return (
    <div className="pdw-banner pdw-banner--warn" role="alert">
      <span className="pdw-banner__text">{t("ws.wrongLink", { app: def.name })}</span>
      <span className="pdw-banner__acts"><button type="button" className="pdw-banner__btn" aria-haspopup="dialog" onClick={onHow}>{t("home.howtoCopy")}</button></span>
    </div>
  );
}

/** D13 / AD-5: the same handle on TikTok / X — external profile links, opened in a new tab. */
function FindElsewhere({ user, t }: { user: string; t: T }) {
  if (!/^[A-Za-z0-9._]{1,30}$/.test(user)) return null;
  return (
    <p className="pdw-find">
      <span>{t("ws.findOn", { user })}</span>
      <a className="pdw-find__chip" href={`https://www.tiktok.com/@${encodeURIComponent(user)}`} target="_blank" rel="noopener noreferrer nofollow">TikTok</a>
      <a className="pdw-find__chip" href={`https://x.com/${encodeURIComponent(user)}`} target="_blank" rel="noopener noreferrer nofollow">X</a>
    </p>
  );
}
