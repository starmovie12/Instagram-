"use client";
/**
 * Settings tab (PRD §13, §14.3, Blueprint 6). Cards: Appearance & Language · Download preferences ·
 * Advanced (collapsed: Session ID + Remember + Cobalt) · App & storage · Links & legal.
 * Phone: one column; ≥ 1024 px: two columns (max 1120). Toggles: 52×32 track, 48 px hit area.
 * Session ID / Cobalt values never leave the device except in the POST body to our own API (A5).
 */
import React, { useEffect, useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChevronDown, ShieldAlert } from "lucide-react";
import InstallAppButton from "@/components/InstallAppButton";
import { LANGS, useI18n, type Locale } from "@/lib/i18n";
import {
  DEFAULT_PREFS, clearHistory, getCobaltInstance, getPrefs, getSessionId, resetAllLocalData, setCobaltInstance,
  setPrefs, setSessionId, subscribeStorage, type Prefs,
} from "@/lib/storage";
import { isSoundOn, setSoundOn } from "@/lib/retention";
import { canVibrate, haptic } from "@/lib/feedback";
import { emit, EV } from "@/lib/events";
import { toast } from "@/lib/toast";
import { SPONSOR_LINK } from "@/lib/ads";
import { BRAND } from "@/lib/brand";
import { version } from "@/package.json";

function Toggle({ checked, onChange, title, desc, disabled }: { checked: boolean; onChange: (v: boolean) => void; title: string; desc?: string; disabled?: boolean }) {
  const id = useId();
  return (
    <div className="st-row">
      <div className="st-row__txt">
        <span className="st-row__title" id={`${id}-l`}>{title}</span>
        {desc && <span className="st-row__desc" id={`${id}-d`}>{desc}</span>}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-labelledby={`${id}-l`} aria-describedby={desc ? `${id}-d` : undefined}
        disabled={disabled} className="sw" onClick={() => { haptic("Selection"); onChange(!checked); }}>
        <span className="sw__thumb" />
      </button>
    </div>
  );
}

function Row({ title, desc, children, htmlFor }: { title: string; desc?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="st-row">
      <div className="st-row__txt">
        {htmlFor ? <label className="st-row__title" htmlFor={htmlFor}>{title}</label> : <span className="st-row__title">{title}</span>}
        {desc && <span className="st-row__desc">{desc}</span>}
      </div>
      {children}
    </div>
  );
}

const LINKS: [string, string][] = [
  ["How to Download", "/how-to-download"], ["Blog / Creator Guides", "/blog"], ["About Us", "/about"], ["Contact", "/contact"],
  ["Privacy Policy", "/privacy-policy"], ["Terms of Service", "/terms"], ["DMCA", "/dmca"],
];
const HTTPS_URL = /^https:\/\/[^\s/?#]+\.[^\s]+$/i;

export default function SettingsScreen() {
  const { lang, setLang, t } = useI18n();
  const live = useSyncExternalStore(subscribeStorage, getPrefs, () => null);
  const prefs: Prefs = live ?? DEFAULT_PREFS;
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(false);
  const [vibrate, setVibrate] = useState(true);
  const [session, setSession] = useState("");
  const [remember, setRemember] = useState(false);
  const [cobalt, setCobalt] = useState("");
  const [showSession, setShowSession] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [cobaltErr, setCobaltErr] = useState(false);
  const [confirm, setConfirm] = useState<"" | "history" | "reset">("");

  useEffect(() => {
    const read = () => {
      const p = getPrefs();
      setSound(isSoundOn()); setVibrate(canVibrate());
      setDark(document.documentElement.dataset.theme === "dark");
      setSession(getSessionId()); setRemember(p.rememberSession); setCobalt(getCobaltInstance());
    };
    read();
    const off = subscribeStorage(read);
    window.addEventListener(EV.settingsUpdated, read);
    return () => { off(); window.removeEventListener(EV.settingsUpdated, read); };
  }, []);

  const upd = (patch: Partial<Prefs>) => { setPrefs(patch); };

  function toggleTheme(v: boolean) {
    document.documentElement.dataset.theme = v ? "dark" : "light";
    try { localStorage.setItem("ig-theme", v ? "dark" : "light"); } catch { /* private mode */ }
    setDark(v);
    emit(EV.settingsUpdated); // keeps the header's theme button in sync
  }

  function saveAdvanced() {
    const c = cobalt.trim();
    if (c && !HTTPS_URL.test(c)) { setCobaltErr(true); haptic("Error"); return; }
    setCobaltErr(false);
    setSessionId(session.trim(), remember);
    setCobaltInstance(c);
    haptic("Success");
    toast({ message: t("st.saved"), tone: "success" });
  }

  function twoStep(kind: "history" | "reset", run: () => void, done: string) {
    if (confirm !== kind) {
      haptic("Warning");
      setConfirm(kind);
      setTimeout(() => setConfirm((c) => (c === kind ? "" : c)), 4000);
      return;
    }
    run(); setConfirm(""); haptic("Heavy");
    toast({ message: done, tone: "info" });
  }

  if (live === null) {
    return (
      <main className="stg" aria-busy="true">
        <h1 className="stg-h1">{t("st.title")}</h1>
        <div className="stg-cols" aria-hidden="true">{[280, 420, 72, 220].map((h, i) => <div key={i} className="stg-card stg-card--skel" style={{ height: h }} />)}</div>
      </main>
    );
  }

  return (
    <main className="stg">
      <h1 className="stg-h1">{t("st.title")}</h1>
      <div className="stg-cols">
        <section className="stg-card" aria-labelledby="st-appearance">
          <h2 id="st-appearance" className="stg-h2">{t("st.appearance")}</h2>
          <Row title={t("st.language")} htmlFor="st-lang">
            <span className="stg-select">
              <select id="st-lang" value={lang} onChange={(e) => setLang(e.target.value as Locale)}>
                {LANGS.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
              <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
            </span>
          </Row>
          <Toggle title={t("st.dark")} checked={dark} onChange={toggleTheme} />
          <Toggle title={t("st.solid")} desc={t("st.solidD")} checked={prefs.solidSurfaces} onChange={(v) => upd({ solidSurfaces: v })} />
          <Toggle title={t("st.ambient")} desc={t("st.ambientD")} checked={prefs.ambientGlow} onChange={(v) => upd({ ambientGlow: v })} />
        </section>

        <section className="stg-card" aria-labelledby="st-downloads">
          <h2 id="st-downloads" className="stg-h2">{t("st.downloads")}</h2>
          <Toggle title={t("st.autoFetch")} desc={t("st.autoFetchD")} checked={prefs.autoFetch} onChange={(v) => upd({ autoFetch: v })} />
          <Toggle title={t("st.autoRoute")} desc={t("st.autoRouteD")} checked={prefs.autoRoute} onChange={(v) => upd({ autoRoute: v })} />
          <Toggle title={t("st.autoSave")} desc={t("st.autoSaveD")} checked={prefs.autoSave} onChange={(v) => upd({ autoSave: v })} />
          <Row title={t("st.quality")} htmlFor="st-quality">
            <span className="stg-select">
              <select id="st-quality" value={prefs.quality} onChange={(e) => upd({ quality: e.target.value as Prefs["quality"] })}>
                <option value="hd">{t("st.qualityHd")}</option>
                <option value="saver">{t("st.qualitySaver")}</option>
              </select>
              <ChevronDown size={18} strokeWidth={2} aria-hidden="true" />
            </span>
          </Row>
          <Toggle title={t("st.clipboard")} desc={t("st.clipboardD")} checked={prefs.clipboardSuggest} onChange={(v) => upd({ clipboardSuggest: v })} />
          <Toggle title={t("st.sound")} checked={sound} onChange={(v) => { setSound(v); setSoundOn(v); }} />
          <Toggle title={t("st.haptics")} desc={vibrate ? t("st.hapticsD") : t("st.hapticsIos")} checked={vibrate && prefs.haptics} onChange={(v) => upd({ haptics: v })} disabled={!vibrate} />
        </section>

        <section className="stg-card" aria-labelledby="st-adv">
          <h2 className="stg-h2 stg-h2--btn">
            <button type="button" id="st-adv" className="stg-adv" aria-expanded={advOpen} aria-controls="st-adv-body" onClick={() => setAdvOpen((o) => !o)}>
              <span>{t("st.advanced")}</span><ChevronDown className="stg-adv__chev" size={20} strokeWidth={2} aria-hidden="true" />
            </button>
          </h2>
          <div id="st-adv-body" className="stg-adv__body" hidden={!advOpen}>
            <label className="stg-label" htmlFor="st-sid">{t("st.sessionLabel")}</label>
            <div className="stg-pw">
              <input id="st-sid" className="stg-input" type={showSession ? "text" : "password"} value={session} onChange={(e) => setSession(e.target.value)}
                placeholder="e.g. 54321%3ABcD1234…" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} maxLength={512} aria-describedby="st-sid-help st-sid-warn" />
              <button type="button" className="stg-eye" onClick={() => setShowSession((s) => !s)} aria-label={showSession ? t("st.sessionHide") : t("st.sessionShow")} aria-pressed={showSession}>
                {showSession ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            <p id="st-sid-help" className="stg-help">{t("st.sessionHelp")}</p>
            <p id="st-sid-warn" className="stg-warn"><ShieldAlert size={18} strokeWidth={2} aria-hidden="true" /> <span>{t("st.sessionWarn")}</span></p>
            <Toggle title={t("st.remember")} desc={t("st.rememberD")} checked={remember} onChange={setRemember} />
            {session && (
              <button type="button" className="stg-textbtn stg-textbtn--danger" onClick={() => { setSession(""); setSessionId("", false); setRemember(false); toast({ message: t("st.sessionRemoved") }); }}>
                {t("st.sessionRemove")}
              </button>
            )}

            <label className="stg-label stg-label--gap" htmlFor="st-cobalt">{t("st.cobaltLabel")}</label>
            <input id="st-cobalt" className="stg-input" type="url" inputMode="url" value={cobalt} onChange={(e) => { setCobalt(e.target.value); setCobaltErr(false); }}
              placeholder="https://cobalt.yourdomain.com" autoCapitalize="off" autoCorrect="off" spellCheck={false} maxLength={200}
              aria-invalid={cobaltErr} aria-describedby={cobaltErr ? "st-cobalt-err" : "st-cobalt-help"} />
            {cobaltErr && <p id="st-cobalt-err" className="stg-err" role="alert">{t("st.cobaltErr")}</p>}
            <p id="st-cobalt-help" className="stg-help">{t("st.cobaltHelp")}</p>
            <button type="button" className="stg-save" onClick={saveAdvanced}>{t("st.save")}</button>
          </div>
        </section>

        <section className="stg-card" aria-labelledby="st-storage">
          <h2 id="st-storage" className="stg-h2">{t("st.storage")}</h2>
          <InstallAppButton variant="card" />
          <Row title={t("st.clearHistory")} desc={t("st.clearHistoryD")}>
            <button type="button" className="stg-danger" onClick={() => twoStep("history", clearHistory, t("hs.cleared"))} aria-live="polite">
              {confirm === "history" ? t("hs.confirm") : t("st.clear")}
            </button>
          </Row>
          <Row title={t("st.reset")} desc={t("st.resetD")}>
            <button type="button" className="stg-danger" aria-live="polite"
              onClick={() => twoStep("reset", () => { resetAllLocalData(); setSession(""); setRemember(false); setCobalt(""); setSound(false); }, t("st.resetDone"))}>
              {confirm === "reset" ? t("hs.confirm") : t("st.resetBtn")}
            </button>
          </Row>
        </section>

        <section className="stg-card stg-card--wide" aria-labelledby="st-links">
          <h2 id="st-links" className="stg-h2">{t("st.links")}</h2>
          <ul className="stg-links">
            {LINKS.map(([l, h]) => <li key={h}><Link href={h}>{l}</Link></li>)}
            <li><a href={SPONSOR_LINK} target="_blank" rel="noopener noreferrer sponsored">{t("st.support", { brand: BRAND.name })}</a></li>
          </ul>
          <p className="stg-help">{BRAND.disclaimer}</p>
          <p className="stg-help stg-foot">
            <span>{BRAND.copyright} · {t("st.version", { v: version })}</span>
            <Link href="/admin" className="stg-admin" aria-label="Admin" tabIndex={-1}>·</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
