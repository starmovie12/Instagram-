/**
 * Supported UI languages (21) — plain module so Server Components (app/layout.tsx)
 * can read it; lib/i18n.tsx re-exports these.
 */
export const LANGS = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ar", name: "العربية" },
  { code: "tr", name: "Türkçe" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "th", name: "ไทย" },
  { code: "bn", name: "বাংলা" },
  { code: "ur", name: "اردو" },
  { code: "fa", name: "فارسی" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "pl", name: "Polski" },
  { code: "nl", name: "Nederlands" },
] as const;

/** RTL locales (PRD §14.4 / A15). */
export const RTL_LANGS = ["ar", "ur", "fa"] as const;
