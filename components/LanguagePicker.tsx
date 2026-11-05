"use client";
import { ChevronDown, Globe } from "lucide-react";
import { LANGS, useI18n, type Locale } from "@/lib/i18n";

/**
 * Header language pill "🌐 EN ⌄" (PRD §5): 48 px hit area, native <select> on top
 * (OS picker, iOS friendly). Select font is 16 px so iOS never zooms on focus.
 */
export default function LanguagePicker() {
  const { lang, setLang, t } = useI18n();
  return (
    <span className="lang-pill">
      <Globe size={20} strokeWidth={2} aria-hidden="true" />
      <span className="lang-pill__code">{lang.toUpperCase()}</span>
      <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
      <select value={lang} onChange={(e) => setLang(e.target.value as Locale)} aria-label={t("language")} className="lang-pill__select">
        {LANGS.map((l) => (
          <option key={l.code} value={l.code} lang={l.code}>{l.name}</option>
        ))}
      </select>
    </span>
  );
}
