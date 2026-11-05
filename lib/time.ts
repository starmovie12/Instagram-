/**
 * Localised "2 h ago" labels (History rows, Recent sheet). Uses Intl.RelativeTimeFormat so every
 * supported language gets native wording; falls back to English when the locale is unknown.
 */
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000], ["month", 2_592_000_000], ["week", 604_800_000],
  ["day", 86_400_000], ["hour", 3_600_000], ["minute", 60_000],
];

export function timeAgo(at: number, lang = "en", now = Date.now()): string {
  const diff = at - now;
  let rtf: Intl.RelativeTimeFormat;
  try { rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto", style: "short" }); }
  catch { rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" }); }
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return rtf.format(Math.round(diff / ms), unit);
  }
  return rtf.format(0, "second");
}
