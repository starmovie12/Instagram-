"use client";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { NAV_ITEMS, activeIndex } from "./nav-items";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/feedback";

/**
 * Primary navigation — bottom Glass Island (≤ 1023 px) and left Glass Rail
 * (≥ 1024 px) from ONE source (PRD §6, §6.1). Which one shows is decided by CSS
 * only (no JS, no hydration mismatch, CLS 0 on resize — AC-65); the hidden one is
 * `display:none`, so only one landmark is ever focusable. The active pill is a
 * single element that slides with `transform` (M5).
 */
export default function ShellNav({ path, hidden }: { path: string; hidden: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const idx = activeIndex(path);
  const railRef = useRef<HTMLUListElement>(null);

  function onRailKey(e: React.KeyboardEvent<HTMLUListElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(railRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
    const cur = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (cur < 0) return;
    e.preventDefault();
    links[(cur + (e.key === "ArrowDown" ? 1 : links.length - 1)) % links.length]?.focus();
  }

  const items = (variant: "island" | "rail") =>
    NAV_ITEMS.map(({ href, label, Icon }, i) => (
      <li key={href} className={`${variant}__li`}>
        <Link
          href={href}
          className={`${variant}__tab`}
          aria-current={i === idx ? "page" : undefined}
          onClick={() => { haptic("Selection"); if (i !== idx) router.prefetch(href); }}
        >
          <Icon size={24} strokeWidth={2} aria-hidden="true" />
          <span>{t(label)}</span>
        </Link>
      </li>
    ));

  return (
    <>
      <nav className="island" aria-label={t("nav.primary")} data-hidden={hidden ? "true" : "false"} style={{ ["--nav-i" as string]: Math.max(idx, 0) }}>
        <ul className="island__list">
          {idx >= 0 && <span className="island__pill" aria-hidden="true" />}
          {items("island")}
        </ul>
      </nav>
      <nav className="rail" aria-label={t("nav.primary")} style={{ ["--nav-i" as string]: Math.max(idx, 0) }}>
        <ul className="rail__list" ref={railRef} onKeyDown={onRailKey}>
          {idx >= 0 && <span className="rail__pill" aria-hidden="true" />}
          {items("rail")}
        </ul>
      </nav>
    </>
  );
}
