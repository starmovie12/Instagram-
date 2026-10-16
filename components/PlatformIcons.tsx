"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";

/**
 * Rounded-square brand tiles used by the homepage hero illustration and the
 * "Tools Auto-Supported" strip. Pure inline SVG — no external images.
 *
 * Exports: default PlatformIcon (sirf icon), PlatformTile (48px tap area + label),
 * PlatformStrip (mobile par swipe, desktop par wrap), PlatformStyles, PLATFORM_LABEL.
 */
export type PlatformKey =
  | "instagram"
  | "facebook"
  | "pinterest"
  | "x"
  | "tiktok"
  | "youtube"
  | "reels"
  | "story"
  | "threads"
  | "download";

const X_PATH =
  "M18.2 3h3.1l-6.8 7.7L22.5 21h-6.2l-4.9-6.3L5.8 21H2.7l7.3-8.3L2.2 3h6.4l4.4 5.8L18.2 3zm-1.1 16.2h1.7L7.7 4.7H5.9l11.2 14.5z";
const FB_PATH =
  "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z";
const TT_PATH =
  "M16.6 3h-3.1v12.2a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.5a5.7 5.7 0 1 0 4.9 5.7V9.1a6.6 6.6 0 0 0 3.8 1.2V7.2A3.9 3.9 0 0 1 16.6 3z";
// Pinterest aur Threads ke logo paths (Simple Icons, CC0), 24x24 box mein; tile mein chhota karke lagaye hain.
const PIN_PATH =
  "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z";
const THREADS_PATH =
  "M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z";

/** Inner glyph, drawn in a 24x24 box. */
function Glyph({ name }: { name: PlatformKey }) {
  switch (name) {
    case "instagram":
      return (
        <g stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="#fff" />
        </g>
      );
    case "facebook":
      return <path d={FB_PATH} fill="#fff" />;
    case "pinterest":
      // Pehle <text> "P" tha (font par nirbhar). Ab asli logo path: har device par ek jaisa.
      return <path d={PIN_PATH} fill="#fff" transform="translate(4.6 4.6) scale(.62)" />;
    case "x":
      return <path d={X_PATH} fill="#fff" />;
    case "tiktok":
      return (
        <g>
          <path d={TT_PATH} fill="#25F4EE" transform="translate(-0.9 0.5)" />
          <path d={TT_PATH} fill="#FE2C55" transform="translate(0.9 -0.4)" />
          <path d={TT_PATH} fill="#fff" />
        </g>
      );
    case "youtube":
      return (
        <g>
          <rect x="2.5" y="6" width="19" height="12.5" rx="4" fill="#fff" />
          <path d="M10.2 9.4v5.7l5-2.85-5-2.85z" fill="#FF0033" />
        </g>
      );
    case "reels":
      return (
        <g stroke="#fff" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <path d="M3.8 8.5h16.4M9 3.6l3 4.9M14.5 3.6l3 4.9" />
          <path d="M10.2 12.6v4.2l3.6-2.1-3.6-2.1z" fill="#fff" />
        </g>
      );
    case "story":
      return (
        <g>
          <circle cx="12" cy="12" r="8.2" stroke="#fff" strokeWidth="1.8" strokeDasharray="3.2 2.6" fill="none" strokeLinecap="round" />
          <path d="M12 7.6l1.25 3.15 3.15 1.25-3.15 1.25L12 16.4l-1.25-3.15L7.6 12l3.15-1.25L12 7.6z" fill="#fff" />
        </g>
      );
    case "threads":
      // Pehle <text> "@" tha (font par nirbhar). Ab asli Threads logo path.
      return <path d={THREADS_PATH} fill="#fff" transform="translate(4.6 4.6) scale(.62)" />;
    case "download":
      return (
        <g stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4.5v10M7.8 10.8 12 15l4.2-4.2" />
          <path d="M5 19.5h14" />
        </g>
      );
  }
}

const BG: Record<PlatformKey, { a: string; b: string }> = {
  instagram: { a: "#FEDA75", b: "#D62976" },
  facebook: { a: "#2F8BFF", b: "#1459E0" },
  pinterest: { a: "#F0213B", b: "#B80018" },
  x: { a: "#15171C", b: "#000000" },
  tiktok: { a: "#17181D", b: "#050507" },
  youtube: { a: "#FF2A3A", b: "#D90017" },
  reels: { a: "#C13BFF", b: "#6D2BFF" },
  story: { a: "#262B52", b: "#10142E" },
  threads: { a: "#20222B", b: "#08090D" },
  download: { a: "#18B4F2", b: "#2F5BFF" }, // thoda gehra: safed icon ka contrast behtar
};

export default function PlatformIcon({
  name,
  size = 44,
  radius,
  label,
  style,
}: {
  name: PlatformKey;
  /** number (px) ya CSS string, jaise "clamp(36px, 9vw, 56px)" */
  size?: number | string;
  radius?: number | string;
  /** Sirf icon dikhe (text nahi) to label do, screen-reader padhega. Na do to decorative. */
  label?: string;
  style?: React.CSSProperties;
}) {
  // Unique id per icon. Pehle fixed id thi: mobile/desktop ke alag versions mein ek ko
  // display:none karne par dusre icon ka gradient gayab ho sakta tha.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = `pi_${name}_${uid}`;
  const c = BG[name];
  const r = radius ?? (typeof size === "number" ? Math.round(size * 0.3) : "30%");
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...a11y}
      style={{ display: "block", flexShrink: 0, borderRadius: r, ...style }}
    >
      <defs>
        <linearGradient id={id} x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor={c.b} />
          <stop offset="1" stopColor={c.a} />
        </linearGradient>
        {name === "instagram" && (
          <radialGradient id={id + "_ig"} cx="6" cy="22" r="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFC85B" />
            <stop offset="0.35" stopColor="#F5503A" />
            <stop offset="0.65" stopColor="#C8268B" />
            <stop offset="1" stopColor="#6B3FD4" />
          </radialGradient>
        )}
      </defs>
      <rect width="24" height="24" fill={name === "instagram" ? `url(#${id}_ig)` : `url(#${id})`} />
      <Glyph name={name} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile + desktop: tap area, hover/focus, aur "Tools Auto-Supported" strip */
/* ------------------------------------------------------------------ */

export const PLATFORM_LABEL: Record<PlatformKey, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  x: "X",
  tiktok: "TikTok",
  youtube: "YouTube",
  reels: "Reels",
  story: "Story",
  threads: "Threads",
  download: "Download",
};

const CSS = `
.pf-tile{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  min-width:48px;min-height:48px;padding:2px;margin:0;border:0;background:none;color:inherit;font:inherit;
  text-decoration:none;border-radius:16px;-webkit-tap-highlight-color:transparent;touch-action:manipulation;
  transition:transform .15s ease}
.pf-tile[data-interactive="true"]{cursor:pointer}
.pf-tile__label{font-size:.75rem;line-height:1.2;font-weight:600;opacity:.85;white-space:nowrap}
.pf-tile:focus-visible{outline:3px solid var(--pf-focus,#3B6BFF);outline-offset:3px}
.pf-tile[data-interactive="true"]:active{transform:scale(.94)}
@media (hover:hover) and (pointer:fine){
  .pf-tile[data-interactive="true"]:hover{transform:translateY(-3px)}
  .pf-tile[data-interactive="true"]:hover .pf-tile__label{opacity:1}
}
@media (prefers-reduced-motion:reduce){
  .pf-tile{transition:none}
  .pf-tile[data-interactive="true"]:hover,.pf-tile[data-interactive="true"]:active{transform:none}
}
.pf-strip{display:flex;gap:8px;list-style:none;margin:0;padding:8px 28px 8px 16px;overflow-x:auto;
  overscroll-behavior-x:contain;scroll-snap-type:x proximity;scroll-padding:0 16px;scrollbar-width:none;
  -webkit-overflow-scrolling:touch;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 24px),transparent 100%);
  mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 24px),transparent 100%)}
.pf-strip::-webkit-scrollbar{display:none}
.pf-strip>li{flex:0 0 auto;scroll-snap-align:start;display:flex}
.pf-strip .pf-tile{min-width:64px}
@media (min-width:768px){
  .pf-strip{flex-wrap:wrap;justify-content:center;gap:16px 24px;padding:8px 0;overflow:visible;
    -webkit-mask-image:none;mask-image:none}
  .pf-strip .pf-tile{min-width:72px}
}
.pf-strip:focus-visible{outline:2px solid var(--pf-focus,#3B6BFF);outline-offset:-2px;border-radius:14px}
@media (forced-colors:active){
  .pf-tile:focus-visible{outline:3px solid Highlight}
  .pf-strip:focus-visible{outline:2px solid Highlight}
}
`;

export function PlatformStyles() {
  return <style>{CSS}</style>;
}

/** Icon + label, kam se kam 48px tap area. href => <a>, onClick => <button>, warna sirf dikhne wala. */
export function PlatformTile({
  name,
  size = 44,
  showLabel = true,
  label,
  href,
  onClick,
  withStyles = true,
  style,
}: {
  name: PlatformKey;
  size?: number | string;
  showLabel?: boolean;
  label?: string;
  href?: string;
  onClick?: () => void;
  withStyles?: boolean;
  style?: React.CSSProperties;
}) {
  const text = label ?? PLATFORM_LABEL[name];
  const interactive = Boolean(href || onClick);
  const inner = (
    <>
      <PlatformIcon name={name} size={size} label={showLabel ? undefined : text} />
      {showLabel && <span className="pf-tile__label">{text}</span>}
    </>
  );
  const common = { className: "pf-tile", "data-interactive": interactive, style } as const;
  return (
    <>
      {withStyles && <PlatformStyles />}
      {href ? (
        <a {...common} href={href} aria-label={showLabel ? undefined : text} title={showLabel ? undefined : text}>{inner}</a>
      ) : onClick ? (
        <button {...common} type="button" onClick={onClick} aria-label={showLabel ? undefined : text} title={showLabel ? undefined : text}>{inner}</button>
      ) : (
        <div {...common}>{inner}</div>
      )}
    </>
  );
}

const DEFAULT_ITEMS: PlatformKey[] = [
  "instagram", "facebook", "pinterest", "x", "tiktok", "youtube", "reels", "story", "threads",
];

/** "Tools Auto-Supported" patti: phone par swipe row, desktop (768px+) par wrap + beech mein. */
export function PlatformStrip({
  items = DEFAULT_ITEMS,
  hrefs,
  onSelect,
  showLabels = true,
  iconSize = 44,
  ariaLabel = "Supported platforms",
  labels,
  listRef,
  onScroll,
  focusable = false,
  style,
}: {
  items?: PlatformKey[];
  hrefs?: Partial<Record<PlatformKey, string>>;
  onSelect?: (name: PlatformKey) => void;
  showLabels?: boolean;
  iconSize?: number | string;
  ariaLabel?: string;
  /** Chhote naam (IG, FB, P...) — na do to PLATFORM_LABEL use hota hai. */
  labels?: Partial<Record<PlatformKey, string>>;
  /** Scroll karne ke liye <ul> ka ref (ToolsAutoSupported ka › button isse chalata hai). */
  listRef?: React.Ref<HTMLUListElement>;
  onScroll?: React.UIEventHandler<HTMLUListElement>;
  /** true => keyboard se row par focus (tiles clickable nahi hon tab bhi scroll ho sake). */
  focusable?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <PlatformStyles />
      <ul
        ref={listRef}
        className="pf-strip"
        role="list"
        aria-label={ariaLabel}
        tabIndex={focusable ? 0 : undefined}
        onScroll={onScroll}
        style={style}
      >
        {items.map((name) => (
          <li key={name}>
            <PlatformTile
              name={name}
              size={iconSize}
              showLabel={showLabels}
              label={labels?.[name]}
              href={hrefs?.[name]}
              onClick={onSelect ? () => onSelect(name) : undefined}
              withStyles={false}
            />
          </li>
        ))}
      </ul>
    </>
  );
}


/* ------------------------------------------------------------------ */
/* "N Tools Auto-Supported" sub-card (GoldenBar variant="neon" ke neeche) */
/* ------------------------------------------------------------------ */

/** Screenshot jaise chhote naam. Baaki platforms ka naam PLATFORM_LABEL se aata hai. */
export const TOOLS_SHORT_LABEL: Partial<Record<PlatformKey, string>> = {
  instagram: "IG",
  facebook: "FB",
  pinterest: "P",
  youtube: "YT",
};

const TOOLS_ITEMS: PlatformKey[] = [
  "instagram", "facebook", "pinterest", "x", "tiktok", "youtube", "reels", "story", "threads",
];

/**
 * Header (⚡ + count + "View All →") + scrollable tile row + circular "›" button.
 * `count` prop hai (default 33): SupportedTools.tsx ek "use client" module hai, isliye
 * yahan se ALL_SUPPORTED_TOOLS import nahi karte — parent number pass kare.
 * Styles: app/globals.css ke `.gb-neon .gbn-tools*` (GoldenBar neon card ke andar hi dikhta hai).
 */
export function ToolsAutoSupported({
  count = 33,
  items = TOOLS_ITEMS,
  href = "#all-tools",
  style,
}: {
  count?: number;
  items?: PlatformKey[];
  href?: string;
  style?: React.CSSProperties;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  // Scroll position se fade-mask + › button ki state (start / end)
  const measure = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const start = el.scrollLeft <= 2;
    const end = max <= 2 || el.scrollLeft >= max - 2;
    setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && listRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(listRef.current);
    }
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [measure]);

  const scrollNext = () => {
    const el = listRef.current;
    if (!el) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: Math.max(el.clientWidth * 0.8, 160),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const fullNames = items.map((k) => PLATFORM_LABEL[k]).join(", ");

  return (
    <div className="gbn-tools" data-start={edge.start} data-end={edge.end} style={style}>
      <div className="gbn-tools__head">
        <p className="gbn-tools__title">
          <span className="gbn-tools__bolt" aria-hidden="true">
            <Zap size={18} strokeWidth={2} fill="currentColor" />
          </span>
          <span className="gbn-tools__count">{count}</span>
          <span className="gbn-tools__label">Tools Auto-Supported:</span>
        </p>
        <a className="gbn-tools__all" href={href}>
          <span>View All</span>
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </a>
      </div>

      <div className="gbn-tools__row">
        <PlatformStrip
          items={items}
          iconSize={48}
          labels={TOOLS_SHORT_LABEL}
          listRef={listRef}
          onScroll={measure}
          focusable
          ariaLabel={`Supported platforms: ${fullNames}`}
        />
        <button
          type="button"
          className="gbn-tools__next"
          onClick={scrollNext}
          disabled={edge.end}
          aria-label="Scroll platforms right"
        >
          <ChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
