import React from "react";

/**
 * Rounded-square brand tiles used by the homepage hero illustration and the
 * "Tools Auto-Supported" strip. Pure inline SVG — no external images.
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
      return (
        <text x="12" y="18" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff" fontFamily="Georgia, 'Times New Roman', serif">
          P
        </text>
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
      return (
        <text x="12" y="18" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff" fontFamily="system-ui, sans-serif">
          @
        </text>
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
  download: { a: "#35D4FF", b: "#3B6BFF" },
};

export default function PlatformIcon({
  name,
  size = 44,
  radius,
  style,
}: {
  name: PlatformKey;
  size?: number | string;
  radius?: number | string;
  style?: React.CSSProperties;
}) {
  // Deterministic id: identical defs may repeat on a page and are interchangeable.
  const id = `pi_${name}`;
  const c = BG[name];
  const r = radius ?? (typeof size === "number" ? Math.round(size * 0.3) : "30%");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
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
