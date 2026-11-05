"use client";
/** /offline (PRD §14.2): one action — Try again; Recent Grabs stays one tap away as a text link. */
import Link from "next/link";
import { RotateCw, WifiOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function OfflineScreen() {
  const { t } = useI18n();
  return (
    <main className="off">
      <span className="off__icon" aria-hidden="true"><WifiOff size={30} strokeWidth={1.75} /></span>
      <h1 className="off__h1">{t("offline.title")}</h1>
      <p className="off__body">{t("offline.body")}</p>
      <button type="button" className="off__retry" onClick={() => location.reload()}>
        <RotateCw size={20} strokeWidth={2} aria-hidden="true" /> {t("offline.retry")}
      </button>
      <Link href="/history" className="off__link">{t("offline.history")}</Link>
      <p className="off__tip">{t("offline.tip")}</p>
    </main>
  );
}
