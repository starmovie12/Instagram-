import React, { useId } from "react";

/**
 * Rounded-square brand tiles used by the homepage hero illustration and the
 * "Tools Auto-Supported" strip. Pure inline SVG, no external images.
 *
 * Exports
 * - default  PlatformIcon   : sirf icon (pehle jaisa API, purani jagah par seedha chalega)
 * - PlatformTile            : icon + label + 48px tap area + hover/focus/press states
 * - PlatformStrip           : mobile par swipe row, desktop par wrapped centered row
 * - PlatformStyles          : tile/strip ki CSS (Strip aur Tile khud laga lete hain)
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

const X_PATH =
  "M18.2 3h3.1l-6.8 7.7L22.5 21h-6.2l-4.9-6.3L5.8 21H2.7l7.3-8.3L2.2 3h6.4l4.4 5.8L18.2 3zm-1.1 16.2h1.7L7.7 4.7H5.9l11.2 14.5z";
const FB_PATH =
  "M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z";
const TT_PATH =
  "M16.6 3h-3.1v12.2a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.5a5.7 5.7 0 1 0 4.9 5.7V9.1a6.6 6.6 0 0 0 3.8 1.2V7.2A3.9 3.9 0 0 1 16.6 3z";

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
      // Pehle <text> tha (font par nirbhar, har device par alag dikhta tha). Ab path hai: hamesha ek jaisa.
      return (
        <path
          d="M9.6 21V4.6h3.9a4.1 4.1 0 0 1 0 8.2H9.6"
          stroke="#fff"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
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
      // "@" ab path hai (pehle <text>), taaki font na hone par bhi saaf dikhe.
      return (
        <g stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2.9" />
          <path d="M14.9 9.4v4.3a2.1 2.1 0 0 0 4.2 0V12a7.1 7.1 0 1 0-2.8 5.7" />
        </g>
      );
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
  // Thoda gehra kiya: safed icon ka contrast badhane ke liye
  download: { a: "#18B4F2", b: "#2F5BFF" },
};

/* ------------------------------------------------------------------ */
/* 1) Sirf icon (purana API, ab accessible aur responsive size ke saath) */
/* ------------------------------------------------------------------ */

export type PlatformIconProps = {
  name: PlatformKey;
  /** number (px) ya CSS string, jaise "clamp(36px, 9vw, 56px)" */
  size?: number | string;
  radius?: number | string;
  /** Do: sirf icon ho to label do, screen-reader padhega. Na do: decorative maana jayega. */
  label?: string;
  style?: React.CSSProperties;
};

export default function PlatformIcon({ name, size = 44, radius, label, style }: PlatformIconProps) {
  // useId: har icon ki apni gradient id. Pehle deterministic id thi; mobile/desktop ke liye
  // alag-alag version chhupane (display:none) par dusra icon gradient kho deta tha. Ab aisa nahi hota.
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
/* 2) Styles: tap area, hover (sirf mouse par), focus, press, strip     */
/* ------------------------------------------------------------------ */

const CSS = `
.pf-tile{
  display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
  min-width:48px;min-height:48px;padding:2px;margin:0;border:0;background:none;
  color:inherit;font:inherit;text-decoration:none;border-radius:16px;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;
  transition:transform .15s ease;
}
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

/* Strip: phone par ek line mein swipe (agla icon aadha dikhe), desktop par wrap + beech mein */
.pf-strip{
  display:flex;gap:8px;list-style:none;margin:0;padding:4px 16px;
  overflow-x:auto;overscroll-behavior-x:contain;
  scroll-snap-type:x proximity;scroll-padding:0 16px;
  scrollbar-width:none;-webkit-overflow-scrolling:touch;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 24px),transparent 100%);
          mask-image:linear-gradient(90deg,transparent 0,#000 16px,#000 calc(100% - 24px),transparent 100%);
}
.pf-strip::-webkit-scrollbar{display:none}
.pf-strip>li{flex:0 0 auto;scroll-snap-align:start;display:flex}
.pf-strip .pf-tile{min-width:64px}
@media (min-width:768px){
  .pf-strip{
    flex-wrap:wrap;justify-content:center;gap:16px 24px;padding:4px 0;overflow:visible;
    -webkit-mask-image:none;mask-image:none;
  }
  .pf-strip .pf-tile{min-width:72px}
}
`;

export function PlatformStyles() {
  return <style>{CSS}</style>;
}

/* ------------------------------------------------------------------ */
/* 3) Tile: icon + label + 48px tap area                                */
/* ------------------------------------------------------------------ */

export type PlatformTileProps = {
  name: PlatformKey;
  /** Icon ka size. Default: phone par 44, bade screen par bhi 44 (Strip ke liye theek). */
  size?: number | string;
  /** Neeche likha naam dikhana hai ya nahi. Na dikhao to bhi screen-reader ko naam milta hai. */
  showLabel?: boolean;
  /** Custom naam (default: PLATFORM_LABEL) */
  label?: string;
  /** href do to <a>, onClick do to <button>, dono na do to sirf dikhne wala tile */
  href?: string;
  onClick?: () => void;
  /** Bahar ki jagah se CSS dobara na lage, iske liye Strip ye false karta hai */
  withStyles?: boolean;
  style?: React.CSSProperties;
};

export function PlatformTile({
  name,
  size = 44,
  showLabel = true,
  label,
  href,
  onClick,
  withStyles = true,
  style,
}: PlatformTileProps) {
  const text = label ?? PLATFORM_LABEL[name];
  const interactive = Boolean(href || onClick);

  const inner = (
    <>
      {/* Label dikh raha ho to icon decorative; na dikhe to icon hi naam bataye */}
      <PlatformIcon name={name} size={size} label={showLabel ? undefined : text} />
      {showLabel && <span className="pf-tile__label">{text}</span>}
    </>
  );

  const common = {
    className: "pf-tile",
    "data-interactive": interactive,
    style,
  } as const;

  return (
    <>
      {withStyles && <PlatformStyles />}
      {href ? (
        <a {...common} href={href} aria-label={showLabel ? undefined : text}>
          {inner}
        </a>
      ) : onClick ? (
        <button {...common} type="button" onClick={onClick} aria-label={showLabel ? undefined : text}>
          {inner}
        </button>
      ) : (
        <div {...common}>{inner}</div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 4) Strip: "Tools Auto-Supported" wali patti                          */
/* ------------------------------------------------------------------ */

export type PlatformStripProps = {
  items?: PlatformKey[];
  /** Kisi platform par tap se link kholna ho to */
  hrefs?: Partial<Record<PlatformKey, string>>;
  onSelect?: (name: PlatformKey) => void;
  showLabels?: boolean;
  iconSize?: number | string;
  /** Screen-reader ke liye list ka naam */
  ariaLabel?: string;
  style?: React.CSSProperties;
};

const DEFAULT_ITEMS: PlatformKey[] = [
  "instagram",
  "facebook",
  "pinterest",
  "x",
  "tiktok",
  "youtube",
  "reels",
  "story",
  "threads",
];

export function PlatformStrip({
  items = DEFAULT_ITEMS,
  hrefs,
  onSelect,
  showLabels = true,
  iconSize = 44,
  ariaLabel = "Supported platforms",
  style,
}: PlatformStripProps) {
  return (
    <>
      <PlatformStyles />
      <ul className="pf-strip" aria-label={ariaLabel} style={style}>
        {items.map((name) => (
          <li key={name}>
            <PlatformTile
              name={name}
              size={iconSize}
              showLabel={showLabels}
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
