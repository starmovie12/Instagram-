"use client";
import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import GlobalHeader from "./GlobalHeader";
import ShellNav from "./ShellNav";
import BackBar from "./BackBar";
import OfflinePill from "./OfflinePill";
import { navDepth } from "./nav-depth";
import { useKeyboardOpen, useQuickReturn } from "./useQuickReturn";
import AuroraBackdrop from "@/components/motion/AuroraBackdrop";
import Toaster from "@/components/ui/Toaster";
import { migrateOnce } from "@/lib/storage";
import { useGoChords } from "@/lib/shortcuts";
import { useI18n } from "@/lib/i18n";

export const TAB_ROUTES = ["/", "/tools", "/history", "/settings"];
const FREE_PREFIXES = ["/admin", "/offline", "/s/"];
/** Long scrolling tab screens get Quick Return (Home is short and stays sticky — PRD §5). */
const QUICK_RETURN = ["/tools", "/history"];
/** Aurora backdrop only on Home + Tools (PRD §3.1.2, M10). */
const AURORA = ["/", "/tools"];

export type ShellKind = "tab" | "detail" | "free";
export function shellKindFor(path: string): ShellKind {
  const p = path.replace(/\/+$/, "") || "/";
  if (FREE_PREFIXES.some((x) => p === x.replace(/\/$/, "") || p.startsWith(x))) return "free";
  return TAB_ROUTES.includes(p) ? "tab" : "detail";
}

/**
 * Root app shell (PRD §4.3): picks Tab / Detail / Shell-free chrome from the path;
 * URLs and folders stay the same. Also owns: route enter transition (M4 CSS
 * fallback), focus-to-heading on navigation (§14.5), go-to chords (§6.1),
 * offline pill and the toast region.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const raw = usePathname() || "/";
  const path = raw.replace(/\/+$/, "") || "/";
  const router = useRouter();
  const { t } = useI18n();
  const first = useRef(true);
  const back = useRef(false);

  useEffect(() => { migrateOnce(); }, []);
  useEffect(() => {
    const onPop = () => { back.current = true; };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    navDepth.value += 1;
    // Move focus to the new page's heading so keyboard / screen-reader users land on it.
    const id = requestAnimationFrame(() => {
      const h = document.querySelector<HTMLElement>("#main h1");
      if (h) { if (!h.hasAttribute("tabindex")) h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      back.current = false;
    });
    return () => cancelAnimationFrame(id);
  }, [path]);

  const navigate = useCallback((href: string) => router.push(href), [router]);
  useGoChords(navigate);

  const kind = shellKindFor(path);
  const quick = useQuickReturn(kind === "tab" && QUICK_RETURN.includes(path));
  const keyboard = useKeyboardOpen();
  // Sticky sub-bars (e.g. Tools pills) slide up with the header on Quick Return.
  useEffect(() => { document.documentElement.dataset.chrome = quick ? "hidden" : "shown"; }, [quick]);

  if (kind === "free") return <>{children}<Toaster /></>;
  const main = (
    <div id="main" className={`shell-main shell-main--${kind} route-enter`} data-nav={back.current ? "back" : "push"} key={path}>
      {children}
    </div>
  );
  const skip = <a className="skip-link" href="#main">{t("skip.content")}</a>;
  if (kind === "tab") {
    return (
      <>
        {skip}
        {AURORA.includes(path) && <AuroraBackdrop />}
        <GlobalHeader hidden={quick} />
        <div className="shell-grid">{main}</div>
        <ShellNav path={path} hidden={quick || keyboard} />
        <OfflinePill />
        <Toaster />
      </>
    );
  }
  return (
    <>
      {skip}
      <BackBar />
      {main}
      <OfflinePill />
      <Toaster />
    </>
  );
}
