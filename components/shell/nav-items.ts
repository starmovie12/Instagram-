import { Home, LayoutGrid, History, Settings } from "lucide-react";
import type { I18nKey } from "@/lib/i18n";

/** The 4 primary destinations (PRD §6, S1 — a 5th item is a PRD change). One source for Island + Rail. */
export const NAV_ITEMS = [
  { href: "/", label: "nav.home", Icon: Home },
  { href: "/tools", label: "nav.tools", Icon: LayoutGrid },
  { href: "/history", label: "nav.history", Icon: History },
  { href: "/settings", label: "nav.settings", Icon: Settings },
] as const satisfies readonly { href: string; label: I18nKey; Icon: unknown }[];

/** `/` matches exactly; others by prefix (PRD §6). */
export function activeIndex(path: string): number {
  return NAV_ITEMS.findIndex((it) => (it.href === "/" ? path === "/" : path === it.href || path.startsWith(it.href + "/")));
}
