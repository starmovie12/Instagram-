"use client";
/**
 * Install card (PRD §17.3). Appears only where the browser offers PWA install, once until dismissed,
 * after the first successful grab or 20 s on the site — never during a fetch, while typing or over a dialog.
 * Non-modal card sitting 12 px above the bottom bar (or the safe area on detail pages).
 */
import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { EV } from "@/lib/events";
import { lsGet, lsSet } from "@/lib/storage";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const DISMISSED = "ig-install-dismissed";

function blocked(): boolean {
  return Boolean(
    document.querySelector('[data-phase="fetching"], dialog[open]') ||
    document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement,
  );
}

export default function InstallPrompt() {
  const { t } = useI18n();
  const evt = useRef<BIPEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (lsGet(DISMISSED) || matchMedia("(display-mode: standalone)").matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tryShow = () => {
      if (!evt.current) return;
      if (blocked()) { timer = setTimeout(tryShow, 5000); return; }
      setOpen(true);
    };
    const onBIP = (e: Event) => { e.preventDefault(); evt.current = e as BIPEvent; };
    const onGrab = () => { clearTimeout(timer); timer = setTimeout(tryShow, 1500); };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener(EV.historyUpdated, onGrab, { once: true });
    timer = setTimeout(tryShow, 20_000);
    return () => { clearTimeout(timer); window.removeEventListener("beforeinstallprompt", onBIP); window.removeEventListener(EV.historyUpdated, onGrab); };
  }, []);

  function dismiss() { setOpen(false); lsSet(DISMISSED, String(Date.now())); }
  async function install() {
    const e = evt.current;
    setOpen(false);
    if (!e) return;
    try { await e.prompt(); await e.userChoice; } catch { /* user closed the browser prompt */ }
    lsSet(DISMISSED, String(Date.now()));
    evt.current = null;
  }

  if (!open) return null;
  return (
    <section className="ipc" role="dialog" aria-modal="false" aria-labelledby="ipc-title">
      <span className="ipc__icon" aria-hidden="true"><Download size={22} strokeWidth={2} /></span>
      <div className="ipc__txt">
        <h2 id="ipc-title" className="ipc__title">{t("install.title")}</h2>
        <p className="ipc__body">{t("install.body")}</p>
        <div className="ipc__acts">
          <button type="button" className="ipc__cta" onClick={() => { void install(); }}>{t("install.cta")}</button>
          <button type="button" className="ipc__later" onClick={dismiss}>{t("install.later")}</button>
        </div>
      </div>
      <button type="button" className="icon-btn ipc__x" onClick={dismiss} aria-label={t("sheet.close")}><X size={20} strokeWidth={2} aria-hidden="true" /></button>
    </section>
  );
}
