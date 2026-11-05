"use client";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { PlatformTile } from "@/components/PlatformIcons";
import { PLATFORMS, type PlatformId } from "@/lib/platforms";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { haptic } from "@/lib/feedback";

/**
 * PRD §7.3 / §24 — "Tools & Platforms": 7 live apps + All Tools, in this order.
 * Real <a href> links (SSR, crawlable — §17.1). 4 × 2 below 1024 px, 8 in one row above.
 * Instagram tile wears the Story-Ring (counts toward the 2-per-viewport spectrum budget).
 */
const ORDER: PlatformId[] = ["instagram", "facebook", "youtube", "tiktok", "pinterest", "x", "threads"];

export default function HomeToolsGrid() {
  const { t } = useI18n();
  const apps = ORDER.map((id) => PLATFORMS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <section className="htg" aria-labelledby="htg-title">
      <div className="htg__head">
        <h2 id="htg-title" className="htg__title">{t("home.tools")}</h2>
        <Link href="/tools" className="htg__all">{t("home.viewAll")} <ArrowRight className="htg__arrow" size={16} strokeWidth={2.2} aria-hidden="true" /></Link>
      </div>
      <ul className="htg__grid">
        {apps.map((p, n) => (
          <li key={p.id} className="home-rise" style={{ ["--rise-delay" as string]: `${180 + n * 40}ms` }}>
            <Link href={p.route} className="htg__tile" onClick={() => haptic("Light")}>
              <span className={`htg__icon${p.id === "instagram" ? " htg__icon--ring" : ""}`} {...(p.id === "instagram" ? { "data-spectrum": "" } : {})}>
                <PlatformTile name={p.iconKey} size={56} showLabel={false} withStyles />
              </span>
              <span className="htg__name">{p.name}</span>
              <span className="htg__sub">{t(`platform.tag.${p.id}` as I18nKey)}</span>
            </Link>
          </li>
        ))}
        <li className="home-rise" style={{ ["--rise-delay" as string]: `${180 + 7 * 40}ms` }}>
          <Link href="/tools" className="htg__tile" onClick={() => haptic("Light")}>
            <span className="htg__icon htg__icon--all" aria-hidden="true"><LayoutGrid size={28} strokeWidth={2} /></span>
            <span className="htg__name">{t("home.allTools")}</span>
            <span className="htg__sub">{t("home.allToolsSub")}</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
