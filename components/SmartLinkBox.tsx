"use client";
/**
 * Smart Link Box — the Home textbox is a ROUTER, never a downloader (PRD §7.1, §7.6).
 * Paste Link · Grab Media / Enter · Ctrl+V / long-press paste · link drop (on the box
 * or anywhere on Home) → `resolveRoute()` on-device (< 5 ms, zero network, AC-42) →
 * read-once sessionStorage handoff → the right app page, which auto-starts.
 *
 * Signature: 1 px Story-Ring (M2) that spins on focus and turns red on error; detected
 * chip + 600 ms progress (M3) with Cancel for paste/drop; inline messages with one
 * fix (§7.6.8, §25.3) in a 36 px reserved strip (CLS 0).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, CircleHelp, ClipboardPaste, Download, Link2, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { resolveRoute, type Route } from "@/lib/router";
import { KIND_LABEL } from "@/lib/detect";
import { PLATFORMS, platformById, soonById } from "@/lib/platforms";
import { getPrefs, setBatchPrefill, setHandoff, toHandoffKind } from "@/lib/storage";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { haptic } from "@/lib/feedback";
import { toast } from "@/lib/toast";
import TrustFootBar from "@/components/TrustFootBar";
import BottomSheet from "@/components/ui/BottomSheet";

type Trigger = "paste_btn" | "grab" | "paste_event" | "drop";
type Status =
  | { kind: "idle" }
  | { kind: "routing"; text: string; cancellable: boolean }
  | { kind: "error"; key: I18nKey; chips: boolean; request?: boolean; howto?: boolean };

const ROUTE_DELAY_MS = 600;
const ROUTE_DELAY_REDUCED_MS = 300;

function reducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SmartLinkBox() {
  const router = useRouter();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [shake, setShake] = useState(false);
  const [dropping, setDropping] = useState(false);
  const [howOpen, setHowOpen] = useState(false);

  const clearTimer = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  useEffect(() => clearTimer, []);

  // "Ab try karein" on /how-to-download → /?focus=1
  useEffect(() => {
    try {
      const sp = new URLSearchParams(location.search);
      if (sp.get("focus") === "1") { inputRef.current?.focus(); history.replaceState(history.state, "", location.pathname); }
    } catch { /* ignore */ }
  }, []);

  // Clipboard suggestion — only when permission was granted earlier (never prompts).
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        if (!getPrefs().clipboardSuggest || !navigator.permissions?.query || !navigator.clipboard?.readText) return;
        const st = await navigator.permissions.query({ name: "clipboard-read" as PermissionName });
        if (st.state !== "granted" || dead) return;
        const text = (await navigator.clipboard.readText()).trim();
        if (!dead && text && resolveRoute(text).type === "app") setInput((cur) => cur || text);
      } catch { /* silent */ }
    })();
    return () => { dead = true; };
  }, []);

  const selfHosts = useCallback(() => (typeof location !== "undefined" ? [location.hostname] : []), []);
  const evt = (trigger: Trigger, outcome: string, platform = "-", kind = "-") => {
    // PRD §7.6.10: platform, kind, trigger, outcome — never the link or username.
    try { track("home_route", { platform, kind, trigger, outcome }); } catch { /* analytics optional */ }
  };

  const fail = useCallback((key: I18nKey, opts: { chips?: boolean; request?: boolean; howto?: boolean; shake?: boolean } = {}) => {
    setStatus({ kind: "error", key, chips: Boolean(opts.chips), request: opts.request, howto: opts.howto });
    haptic("Error");
    if (opts.shake && !reducedMotion()) { setShake(true); setTimeout(() => setShake(false), 320); }
  }, []);

  const go = useCallback((route: Route, trigger: Trigger) => {
    switch (route.type) {
      case "app": {
        const def = platformById(route.platform);
        const qs = new URLSearchParams({ src: "home" });
        const hk = toHandoffKind(route.kind);
        if (hk) qs.set("kind", hk);
        if (route.extraLinks) qs.set("more", String(route.extraLinks));
        // The link travels in sessionStorage, not the URL (§7.6.6) — `?url=` only if storage is blocked.
        if (!setHandoff({ url: route.url, kind: hk, src: "home" })) qs.set("url", route.url);
        setStatus({ kind: "routing", cancellable: false, text: t("router.chip.detected", { app: def?.name ?? route.label, kind: route.kind ? KIND_LABEL[route.kind] ?? "" : "" }).replace(/\s+·/, " ·") });
        evt(trigger, "routed", route.platform, route.kind ?? "-");
        router.push(`${route.path}?${qs.toString()}`);
        return;
      }
      case "batch": {
        const ok = setBatchPrefill(route.urls);
        setStatus({ kind: "routing", cancellable: false, text: t("router.batch", { n: route.urls.length }) });
        if (route.truncated) toast({ message: t("router.notice.capped"), tone: "info" });
        evt(trigger, "routed", "instagram", "batch");
        router.push(ok ? "/batch-downloader?src=home" : `/batch-downloader?src=home&url=${encodeURIComponent(route.urls.join("\n"))}`);
        return;
      }
      case "soon":
        evt(trigger, "soon", route.platform);
        router.push(`/coming-soon/${route.platform}`);
        return;
      case "unsupported": fail("router.err.fbStory", { chips: true }); evt(trigger, "unknown", route.platform); return;
      case "incomplete": fail("router.err.incomplete", { howto: true }); evt(trigger, "unknown", route.platform); return;
      case "rejected": fail(route.reason === "self" ? "router.err.self" : "router.err.scheme"); evt(trigger, "unknown"); return;
      case "empty": fail("router.err.empty", { shake: true }); inputRef.current?.focus(); evt(trigger, "unknown"); return;
      case "notlink": fail("router.err.notlink", { chips: true }); evt(trigger, "unknown"); return;
      default: fail("router.err.unsupported", { chips: true, request: true }); evt(trigger, "unknown");
    }
  }, [router, fail, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = useCallback((raw: string) => {
    clearTimer();
    haptic("Medium");
    go(resolveRoute(raw, { allowBareUsername: true, selfHosts: selfHosts() }), "grab");
  }, [go, selfHosts]);

  // Paste event / drop: never on typing. autoRoute ON → chip + 600 ms (300 ms reduced) + Cancel.
  const autoRoute = useCallback((raw: string, trigger: "paste_event" | "drop") => {
    clearTimer();
    const route = resolveRoute(raw, { allowBareUsername: false, selfHosts: selfHosts() });
    if (route.type === "app") router.prefetch(route.path);
    if (!getPrefs().autoRoute) return;
    if (route.type !== "app" && route.type !== "soon" && route.type !== "batch") { go(route, trigger); return; }
    haptic("Light");
    const name = route.type === "app" ? platformById(route.platform)?.name ?? "" : route.type === "soon" ? soonById(route.platform)?.name ?? "" : "Instagram";
    const kind = route.type === "app" && route.kind ? KIND_LABEL[route.kind] ?? "" : "";
    setStatus({ kind: "routing", cancellable: true, text: route.type === "batch" ? t("router.batch", { n: route.urls.length }) : t("router.chip.detected", { app: name, kind }).replace(/\s+·/, " ·") });
    timer.current = setTimeout(() => { timer.current = null; go(route, trigger); }, reducedMotion() ? ROUTE_DELAY_REDUCED_MS : ROUTE_DELAY_MS);
  }, [go, router, selfHosts, t]);

  const cancel = () => {
    clearTimer();
    haptic("Light");
    setStatus({ kind: "idle" });
    evt("paste_event", "cancelled");
    inputRef.current?.focus();
  };

  // Paste Link: read the clipboard and route at once (explicit tap → no delay).
  const pasteButton = async () => {
    clearTimer();
    haptic("Light");
    setStatus({ kind: "idle" });
    try {
      const text = navigator.clipboard?.readText ? (await navigator.clipboard.readText()).trim() : "";
      if (text) {
        setInput(text);
        const route = resolveRoute(text, { allowBareUsername: false, selfHosts: selfHosts() });
        go(route, "paste_btn");
        if (route.type !== "app" && route.type !== "soon" && route.type !== "batch") inputRef.current?.focus();
        return;
      }
    } catch { /* denied / unsupported (Firefox, some iOS) — silent fallback */ }
    inputRef.current?.focus();
    setStatus({ kind: "error", key: "router.hint.longpress", chips: false });
  };

  // Desktop: Ctrl/⌘+V anywhere on Home (input not focused) and window-level link drop (§14.3).
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target === inputRef.current || /^(INPUT|TEXTAREA)$/.test(target.tagName) || target.isContentEditable)) return;
      const text = e.clipboardData?.getData("text")?.trim();
      if (!text) return;
      e.preventDefault();
      setInput(text);
      inputRef.current?.focus();
      autoRoute(text, "paste_event");
    };
    const onDragOver = (e: DragEvent) => { if (e.dataTransfer?.types.some((x) => x === "text/uri-list" || x === "text/plain")) { e.preventDefault(); setDropping(true); } };
    const onDragLeave = (e: DragEvent) => { if (!e.relatedTarget) setDropping(false); };
    const onDrop = (e: DragEvent) => {
      const text = (e.dataTransfer?.getData("text/uri-list") || e.dataTransfer?.getData("text/plain") || "").trim();
      setDropping(false);
      if (!text) return;
      e.preventDefault();
      setInput(text);
      autoRoute(text, "drop");
    };
    window.addEventListener("paste", onPaste);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [autoRoute]);

  const ringState = status.kind === "error" && status.key !== "router.hint.longpress" ? "error" : status.kind === "routing" ? "detecting" : "idle";

  return (
    <div className="slb" data-dropping={dropping ? "true" : "false"}>
      <div className="slb__card" data-ring={ringState} data-spectrum>
        <span className="slb__ring" aria-hidden="true"><span className="slb__ring-spin" /></span>
        <form onSubmit={(e) => { e.preventDefault(); submit(input); }} className="slb__form" noValidate>
          <div className={`slb__field${shake ? " is-shaking" : ""}`}>
            <Link2 className="slb__field-icon" size={20} strokeWidth={2} aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              inputMode="url"
              enterKeyHint="go"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={input}
              onChange={(e) => { setInput(e.target.value); clearTimer(); if (status.kind !== "idle") setStatus({ kind: "idle" }); }}
              onPaste={(e) => {
                const text = e.clipboardData.getData("text").trim();
                if (text) setTimeout(() => autoRoute(text, "paste_event"), 0);
              }}
              placeholder={t("home.placeholder")}
              aria-label={t("home.inputLabel")}
              aria-invalid={status.kind === "error" ? true : undefined}
              aria-describedby="slb-status"
              className="slb__input"
            />
            {input && (
              <button type="button" className="icon-btn slb__clear" aria-label={t("home.clear")}
                onClick={() => { clearTimer(); setInput(""); setStatus({ kind: "idle" }); inputRef.current?.focus(); }}>
                <X size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="slb__actions">
            <button type="button" className="slb__btn slb__btn--secondary" onClick={() => { void pasteButton(); }}>
              <ClipboardPaste size={20} strokeWidth={2} aria-hidden="true" />
              <span>{t("home.paste")}</span>
            </button>
            <button type="submit" className="slb__btn slb__btn--primary">
              <Download size={20} strokeWidth={2} aria-hidden="true" />
              <span>{t("home.grab")}</span>
            </button>
          </div>
        </form>
        {/* Reserved 36 px strip: detected chip + progress, or the error with one fix (CLS 0) */}
        <div id="slb-status" className="slb__strip" aria-live="polite">
          {status.kind === "routing" && (
            <p className="slb__chip" role="status">
              <Check size={16} strokeWidth={2.4} aria-hidden="true" />
              <span className="slb__chip-text">{status.text}</span>
              {status.cancellable && (
                <button type="button" className="slb__cancel" onClick={cancel}>
                  <X size={16} strokeWidth={2.4} aria-hidden="true" /> {t("router.chip.cancel")}
                </button>
              )}
              <span className="slb__progress" aria-hidden="true" data-run={status.cancellable ? "true" : "false"} />
            </p>
          )}
          {status.kind === "error" && (
            <div className={`slb__msg${status.key === "router.hint.longpress" ? " slb__msg--hint" : ""}`} role={status.key === "router.hint.longpress" ? "status" : "alert"}>
              <p className="slb__msg-text">
                {status.key !== "router.hint.longpress" && <AlertCircle size={16} strokeWidth={2.4} aria-hidden="true" />}
                <span>{t(status.key)}</span>
              </p>
              {(status.chips || status.request || status.howto) && (
                <div className="slb__chips">
                  {status.chips && PLATFORMS.map((p) => <Link key={p.id} href={p.route} className="slb__app-chip">{p.name}</Link>)}
                  {status.request && <Link href="/contact" className="slb__app-chip slb__app-chip--ghost">{t("router.err.request")}</Link>}
                  {status.howto && (
                    <button type="button" className="slb__app-chip" onClick={() => setHowOpen(true)}>
                      <CircleHelp size={16} strokeWidth={2} aria-hidden="true" /> {t("home.howtoCopy")}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <TrustFootBar />
      </div>

      <BottomSheet open={howOpen} onClose={() => setHowOpen(false)} title={t("home.howtoCopy")} id="slb-howto">
        <ol className="slb__steps">
          <li>{t("home.howtoStep1")}</li>
          <li>{t("home.howtoStep2")}</li>
          <li>{t("home.howtoStep3")}</li>
        </ol>
        <button type="button" className="slb__btn slb__btn--secondary" style={{ width: "100%" }} onClick={() => { setHowOpen(false); void pasteButton(); }}>
          <ClipboardPaste size={20} strokeWidth={2} aria-hidden="true" /> <span>{t("home.paste")}</span>
        </button>
      </BottomSheet>
      {dropping && <div className="slb__dropzone" aria-hidden="true"><span>{t("home.drop")}</span></div>}
    </div>
  );
}
