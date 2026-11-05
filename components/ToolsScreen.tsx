"use client";
/**
 * Tools hub (PRD §9, §26.3, Blueprint 3): title + live count, 52 px search
 * (150 ms debounce, Esc / ✕ clear, `/` focus), category pills — max 5 visible below
 * 1024 px with a "+4 More" sheet whose pick swaps into the 4th slot (NIYAM 3(b)), all 8
 * wrap on desktop — recently used, tool of the day, the 7 apps, then every tool.
 * Every tile is a real <a href> (crawl hub, §9.5). `?cat=&q=` share/restore.
 */
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X, History, ChevronDown } from "lucide-react";
import { PlatformTile } from "@/components/PlatformIcons";
import ToolIcon from "@/components/ToolIcon";
import ToolOfTheDay from "@/components/ToolOfTheDay";
import BottomSheet from "@/components/ui/BottomSheet";
import { PLATFORMS } from "@/lib/platforms";
import { TOOL_COUNT, TOOL_PILLS, pillOf, searchTools, toolsForPill, visibleTools, type ToolItem, type ToolPill } from "@/lib/registry";
import { getRecentTools, recordToolVisit } from "@/lib/retention";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { haptic } from "@/lib/feedback";

const SECTION_ORDER: Exclude<ToolPill, "popular" | "all">[] = ["downloaders", "ai", "analytics", "visual", "utilities", "fun"];
const PRIMARY: ToolPill[] = ["popular", "all", "downloaders", "ai"];
const OVERFLOW: ToolPill[] = ["analytics", "visual", "utilities", "fun"];
const APP_ORDER = ["instagram", "facebook", "youtube", "tiktok", "pinterest", "x", "threads"];

function Tile({ t }: { t: ToolItem }) {
  return (
    <Link href={t.href} className="tt" onClick={() => { haptic("Light"); recordToolVisit(t.href); }} title={t.name}>
      <ToolIcon category={t.category} size={56} />
      <span className="tt__name">{t.name}</span>
      <span className="tt__desc">{t.description}</span>
      {t.badge && <span className="tt__badge">{t.badge}</span>}
    </Link>
  );
}

const subscribeRecent = (cb: () => void) => { window.addEventListener("storage", cb); return () => window.removeEventListener("storage", cb); };
let recentCache: { key: string; list: ToolItem[] } = { key: "", list: [] };
function recentSnapshot(): ToolItem[] {
  const hrefs = getRecentTools();
  const key = hrefs.join("|");
  if (key !== recentCache.key) recentCache = { key, list: hrefs.map((h) => visibleTools.find((t) => t.href === h)).filter((t): t is ToolItem => Boolean(t)).slice(0, 6) };
  return recentCache.list;
}

export default function ToolsScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const initialCat = (TOOL_PILLS.some((p) => p.id === sp.get("cat")) ? sp.get("cat") : "popular") as ToolPill;
  const [cat, setCat] = useState<ToolPill>(initialCat);
  const [slot4, setSlot4] = useState<ToolPill>(OVERFLOW.includes(initialCat) ? initialCat : "ai");
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [debounced, setDebounced] = useState(q);
  const query = useDeferredValue(debounced);
  const [moreOpen, setMoreOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recent = useSyncExternalStore(subscribeRecent, recentSnapshot, () => null);

  useEffect(() => { const id = setTimeout(() => setDebounced(q), 150); return () => clearTimeout(id); }, [q]);
  useEffect(() => {
    const p = new URLSearchParams();
    if (cat !== "popular") p.set("cat", cat);
    if (debounced.trim()) p.set("q", debounced.trim());
    const s = p.toString();
    router.replace(s ? `${path}?${s}` : path, { scroll: false });
  }, [cat, debounced]); // eslint-disable-line react-hooks/exhaustive-deps
  // `/` and ⌘/Ctrl+K focus the search here (the palette yields on /tools).
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
      if ((e.key === "/" && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); inputRef.current?.focus(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const counts = useMemo(() => Object.fromEntries(TOOL_PILLS.map((p) => [p.id, toolsForPill(p.id).length])) as Record<ToolPill, number>, []);
  const searching = query.trim().length > 0;
  const results = useMemo(() => searchTools(query, toolsForPill(cat === "popular" && searching ? "all" : cat)), [query, cat, searching]);
  const showApps = !searching && (cat === "popular" || cat === "all" || cat === "downloaders");
  const clear = useCallback(() => { setQ(""); setDebounced(""); inputRef.current?.focus(); }, []);
  const pick = (p: ToolPill) => { haptic("Selection"); setCat(p); if (OVERFLOW.includes(p)) setSlot4(p); setMoreOpen(false); };
  const label = (p: ToolPill) => t(`cat.${p}` as I18nKey);

  // Mobile: Popular · All · Downloaders · <slot4> · +N More  (≤ 5 visible). Desktop: all 8.
  const mobilePills: ToolPill[] = ["popular", "all", "downloaders", slot4 === "ai" || OVERFLOW.includes(slot4) ? slot4 : "ai"];
  const pill = (p: ToolPill, extra = "") => (
    <button key={`${p}${extra}`} type="button" className={`tp${extra}`} aria-pressed={cat === p} onClick={() => pick(p)}>
      {label(p)}{p !== "popular" && p !== "all" ? <span className="tp__n">{counts[p]}</span> : null}
    </button>
  );
  const appTiles = APP_ORDER.map((id) => PLATFORMS.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main className="ts">
      <div className="ts__head">
        <h1 className="ts__title">{t("tools.title")} <span className="ts__count" aria-label={t("tools.count", { n: TOOL_COUNT })}>{TOOL_COUNT}</span></h1>
        <div className="ts__search">
          <Search size={20} strokeWidth={2} aria-hidden="true" />
          <input
            ref={inputRef} type="search" value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") clear(); }}
            placeholder={t("tools.search", { n: TOOL_COUNT })} aria-label={t("tools.searchLabel")}
            autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="search"
          />
          {q && <button type="button" className="icon-btn" onClick={clear} aria-label={t("tools.clear")}><X size={20} strokeWidth={2} aria-hidden="true" /></button>}
        </div>
      </div>

      <div className="ts__pills" role="group" aria-label={t("tools.cats")}>
        <div className="ts__pills-mobile">
          {PRIMARY.slice(0, 3).map((p) => pill(p))}
          {pill(mobilePills[3] ?? "ai")}
          <button type="button" className="tp tp--more" aria-haspopup="dialog" aria-expanded={moreOpen} onClick={() => setMoreOpen(true)}>
            {t("tools.more", { n: 4 })} <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        <div className="ts__pills-desktop">{TOOL_PILLS.map((p) => pill(p.id, " tp--d"))}</div>
      </div>
      <BottomSheet open={moreOpen} onClose={() => setMoreOpen(false)} title={t("tools.moreTitle")} id="ts-more">
        <div className="ts__sheet">
          {(slot4 === "ai" ? OVERFLOW : (["ai", ...OVERFLOW.filter((x) => x !== slot4)] as ToolPill[])).map((p) => (
            <button key={p} type="button" className="sheet-opt" aria-pressed={cat === p} onClick={() => { if (p === "ai") setSlot4("ai"); pick(p); }}>
              <span style={{ flex: 1 }}>{label(p)}</span><span className="tp__n">{counts[p]}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      {!searching && (recent === null || recent.length > 0) && (
        <section aria-label={t("tools.recent")} className="ts__sec ts__recent">
          <h2 className="ts__h"><History size={16} strokeWidth={2} aria-hidden="true" /> {t("tools.recent")}</h2>
          {recent === null ? <div className="ts__grid ts__grid--skel" aria-hidden="true" /> : <ul className="ts__grid">{recent.map((x) => <li key={x.href}><Tile t={x} /></li>)}</ul>}
        </section>
      )}

      {!searching && <div className="ts__sec"><ToolOfTheDay /></div>}

      {showApps && (
        <section aria-labelledby="ts-apps" className="ts__sec">
          <h2 className="ts__h" id="ts-apps">{t("tools.apps")}</h2>
          <ul className="ts__apps">
            {appTiles.map((p) => (
              <li key={p.id}>
                <Link href={p.route} className="ts__app" onClick={() => haptic("Light")}>
                  <PlatformTile name={p.iconKey} size={56} showLabel={false} withStyles />
                  <span>{p.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {searching || (cat !== "popular" && cat !== "all") ? (
        <section className="ts__sec" aria-live="polite" aria-label={t("tools.results", { n: results.length })}>
          {results.length === 0 ? (
            <div className="ts__empty">
              <Search size={32} strokeWidth={2} aria-hidden="true" />
              <p className="ts__empty-title">{t("tools.empty")}</p>
              <p>{t("tools.emptyBody", { q: query })}</p>
              <Link href="/contact" className="ts__empty-cta">{t("tools.request")}</Link>
            </div>
          ) : (
            <ul className="ts__grid">{results.map((x) => <li key={x.href}><Tile t={x} /></li>)}</ul>
          )}
        </section>
      ) : (
        (cat === "popular"
          ? [{ id: "popular" as ToolPill, list: toolsForPill("popular") }]
          : SECTION_ORDER.map((s) => ({ id: s as ToolPill, list: toolsForPill("all").filter((x) => pillOf(x) === s) }))
        ).map((s) => (
          <section key={s.id} className="ts__sec ts__sec--cv" aria-labelledby={`ts-sec-${s.id}`}>
            <h2 className="ts__h" id={`ts-sec-${s.id}`}>{label(s.id)}</h2>
            <ul className="ts__grid">{s.list.map((x) => <li key={x.href}><Tile t={x} /></li>)}</ul>
          </section>
        ))
      )}
    </main>
  );
}
