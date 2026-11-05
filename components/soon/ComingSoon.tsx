"use client";
/** Coming-soon screen body (PRD §7.6.9): translated copy, supported-app tiles, one action. The pasted link is never shown or stored. */
import Link from "next/link";
import { PlatformTile } from "@/components/PlatformIcons";
import { PLATFORMS, type SoonDef } from "@/lib/platforms";
import { useI18n } from "@/lib/i18n";

export default function ComingSoon({ app }: { app: Pick<SoonDef, "name" | "iconKey"> }) {
  const { t } = useI18n();
  return (
    <main className="soon">
      <PlatformTile name={app.iconKey} size={72} showLabel={false} />
      <h1 className="soon__h1">{t("router.soon.title", { app: app.name })}</h1>
      <p className="soon__body">{t("router.soon.body")}</p>
      <ul className="soon__apps">
        {PLATFORMS.map((a) => (
          <li key={a.id}>
            <Link href={a.route} className="soon__app"><PlatformTile name={a.iconKey} size={56} showLabel={false} /><span>{a.name}</span></Link>
          </li>
        ))}
      </ul>
      <Link href="/contact" className="soon__cta">{t("router.soon.cta")}</Link>
    </main>
  );
}
