"use client";
/**
 * History tab (PRD §12, §14.3, Blueprint 5). Recent Grabs (n) + "saved locally" chip, app filter chips
 * (max 5 visible + "+N More" sheet), 72 px rows (row tap = re-grab, 48 px Re-grab / Trash), Undo snackbar
 * (6 s, shared toast bus), Clear All 2-step (4 s window), empty state with one action.
 * Reads storage through useSyncExternalStore → the server renders a content-shaped skeleton.
 */
import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, History as HistoryIcon, Lock, RotateCw, Trash2 } from "lucide-react";
import { PlatformTile } from "@/components/PlatformIcons";
import BottomSheet from "@/components/ui/BottomSheet";
import { platformById } from "@/lib/platforms";
import {
  clearHistory, getHistory, getHistoryServerSnapshot, removeHistory, restoreHistory, savedCount, setHandoff,
  subscribeStorage, toHandoffKind, type GrabRecord,
} from "@/lib/storage";
import { dl } from "@/lib/media";
import { haptic } from "@/lib/feedback";
import { useI18n } from "@/lib/i18n";
import { toast } from "@/lib/toast";
import { timeAgo } from "@/lib/time";

const KIND_PARAM: Record<string, string> = { reel: "reel", story: "story", video: "video", photo: "photo", carousel: "photo", profile: "profile", thumbnail: "thumbnail" };
const KIND_LABEL: Record<string, string> = { reel: "Reel", story: "Story", photo: "Photo", carousel: "Carousel", video: "Video", profile: "Profile", audio: "Audio", thumbnail: "Thumbnail" };
const getHistorySnap = getHistory as () => GrabRecord[] | null;

function Thumb({ rec }: { rec: GrabRecord }) {
  const [bad, setBad] = useState(false);
  const def = platformById(rec.platform);
  if (rec.thumbnail && !bad) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={dl(rec.thumbnail, "thumb.jpg")} alt="" width={56} height={56} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="hs-thumb" onError={() => setBad(true)} />;
  }
  return <span className="hs-thumb hs-thumb--fallback" aria-hidden="true">{def && <PlatformTile name={def.iconKey} size={32} showLabel={false} />}</span>;
}

export default function HistoryScreen() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const items = useSyncExternalStore(subscribeStorage, getHistorySnap, getHistoryServerSnapshot);
  const [filter, setFilter] = useState<string>("all");
  const [slot, setSlot] = useState<string | undefined>();
  const [moreOpen, setMoreOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const platforms = useMemo(() => Array.from(new Set((items ?? []).map((i) => i.platform))), [items]);
  const active = filter !== "all" && !platforms.includes(filter as GrabRecord["platform"]) ? "all" : filter;
  const shown = (items ?? []).filter((i) => active === "all" || i.platform === active);

  /* max 5 visible: All + 3 apps + slot 4 (or "+N More") */
  const chips = ["all", ...platforms];
  const needsMore = chips.length > 5;
  const head = needsMore ? chips.slice(0, 4) : chips;
  const rest = needsMore ? chips.slice(4) : [];
  const fourth = needsMore ? rest.find((p) => p === slot) : undefined;
  const sheet = rest.filter((p) => p !== fourth);
  const chipLabel = (p: string) => (p === "all" ? t("hs.all") : platformById(p)?.name ?? p);
  const pick = (p: string) => { haptic("Selection"); setFilter(p); if (rest.includes(p)) setSlot(p); setMoreOpen(false); };

  function regrab(rec: GrabRecord) {
    const def = platformById(rec.platform);
    if (!def) return;
    haptic("Light");
    const kind = KIND_PARAM[rec.kind];
    const qs = new URLSearchParams({ src: "history" });
    if (kind) qs.set("kind", kind);
    if (!setHandoff({ url: rec.url, kind: toHandoffKind(kind), src: "history" })) qs.set("url", rec.url);
    router.push(`${def.route}?${qs.toString()}`);
  }
  function del(rec: GrabRecord) {
    const removed = removeHistory(rec.id);
    if (!removed) return;
    haptic("Rigid");
    toast({
      message: t("hs.removed", { who: removed.author ?? removed.title?.slice(0, 32) ?? t("hs.item") }),
      action: { label: t("ws.undo"), run: () => restoreHistory(removed) },
      duration: 6000,
    });
  }
  function clearAll() {
    if (!confirm) {
      haptic("Warning");
      setConfirm(true);
      setTimeout(() => setConfirm(false), 4000);
      return;
    }
    clearHistory(); setConfirm(false); haptic("Heavy");
    toast({ message: t("hs.cleared"), tone: "info" });
  }

  if (items === null) {
    return (
      <main className="hs" aria-busy="true">
        <div className="hs-head"><h1 className="hs-h1">{t("hs.title")}</h1></div>
        <ul className="hs-list hs-list--skel" aria-hidden="true">{[0, 1, 2, 3].map((i) => <li key={i} className="hs-row hs-row--skel" />)}</ul>
      </main>
    );
  }

  return (
    <main className="hs">
      <div className="hs-head">
        <h1 className="hs-h1">{t("hs.title")} <span className="hs-count">({items.length})</span></h1>
        {items.length > 0 && <span className="hs-saved"><CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" /> {t("hs.saved", { n: savedCount(items) })}</span>}
        {items.length > 0 && (
          <button type="button" className="hs-clear hs-clear--top" onClick={clearAll} aria-live="polite">{confirm ? t("hs.confirm") : t("hs.clearAll")}</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="hs-empty">
          <span className="hs-empty__icon" aria-hidden="true"><HistoryIcon size={32} strokeWidth={1.75} /></span>
          <p className="hs-empty__t">{t("hs.emptyT")}</p>
          <p className="hs-empty__b">{t("hs.emptyB")}</p>
          <Link href="/?focus=1" className="hs-cta">{t("hs.emptyCta")}</Link>
        </div>
      ) : (
        <>
          {chips.length > 2 && (
            <div className="hs-chips" role="group" aria-label={t("hs.filter")}>
              {head.map((p) => <button key={p} type="button" className="hs-chip" aria-pressed={active === p} onClick={() => pick(p)}>{chipLabel(p)}</button>)}
              {fourth && <button type="button" className="hs-chip" aria-pressed={active === fourth} onClick={() => pick(fourth)}>{chipLabel(fourth)}</button>}
              {sheet.length > 0 && (
                <button type="button" className="hs-chip hs-chip--more" aria-haspopup="dialog" onClick={() => setMoreOpen(true)}>{t("ws.more", { n: sheet.length })}</button>
              )}
            </div>
          )}
          <ul className="hs-list">
            {shown.map((r) => {
              const name = r.author ?? r.title ?? t("hs.media");
              return (
                <li key={r.id} className="hs-row">
                  <button type="button" className="hs-main" onClick={() => regrab(r)}>
                    <Thumb rec={r} />
                    <span className="hs-txt">
                      <span className="hs-name">{name}</span>
                      <span className="hs-meta">{platformById(r.platform)?.name ?? r.platform} · {KIND_LABEL[r.kind] ?? t("hs.media")} · {timeAgo(r.at, lang)}</span>
                    </span>
                  </button>
                  <button type="button" className="hs-btn hs-btn--go" onClick={() => regrab(r)} aria-label={`${t("hs.regrab")}: ${name}`}><RotateCw size={20} strokeWidth={2.2} aria-hidden="true" /></button>
                  <button type="button" className="hs-btn hs-btn--del" onClick={() => del(r)} aria-label={`${t("hs.delete")}: ${name}`}><Trash2 size={20} strokeWidth={2.2} aria-hidden="true" /></button>
                </li>
              );
            })}
          </ul>
          <div className="hs-zone">
            <span className="hs-zone__note"><Lock size={16} strokeWidth={2} aria-hidden="true" /> {t("hs.local")}</span>
            <button type="button" className="hs-clear" onClick={clearAll} aria-live="polite">{confirm ? t("hs.confirm") : t("hs.clearAllHistory")}</button>
          </div>
        </>
      )}

      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title={t("hs.moreApps")} id="hs-more">
        <div className="sheet-list">
          {sheet.map((p) => <button key={p} type="button" className="sheet-opt" aria-pressed={active === p} onClick={() => pick(p)}>{chipLabel(p)}</button>)}
        </div>
      </BottomSheet>
    </main>
  );
}
