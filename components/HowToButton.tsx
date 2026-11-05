"use client";
import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/** PRD §7.2 / §24 — full-width secondary (outline) 52 px button right under the link box. */
export default function HowToButton() {
  const { t } = useI18n();
  return (
    <Link href="/how-to-download" className="howto-btn home-rise" style={{ ["--rise-delay" as string]: "120ms" }}>
      <CircleHelp size={20} strokeWidth={2} aria-hidden="true" />
      <span>{t("home.howto")}</span>
    </Link>
  );
}
