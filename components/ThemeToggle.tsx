"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/feedback";
import { emit, EV } from "@/lib/events";

/** 48×48 theme button (PRD §5, D.2). Colours swap instantly (0 ms); only the icon rotates. */
export default function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    read();
    window.addEventListener(EV.settingsUpdated, read);
    return () => window.removeEventListener(EV.settingsUpdated, read);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("ig-theme", next); } catch { /* private mode */ }
    setTheme(next);
    haptic("Selection");
    emit(EV.settingsUpdated);
  }

  return (
    <button type="button" className="icon-btn theme-btn" onClick={toggle} aria-label={t("theme.toggle")} aria-pressed={theme === "dark"} data-theme-now={theme}>
      {theme === "dark" ? <Sun size={24} strokeWidth={2} aria-hidden="true" /> : <Moon size={24} strokeWidth={2} aria-hidden="true" />}
    </button>
  );
}
