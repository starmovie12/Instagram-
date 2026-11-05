import { ImageResponse } from "next/og";
import { DESIGN_TOKENS } from "@/lib/design-tokens.generated";
import { BRAND } from "@/lib/brand";

export const alt = "InstaGrab — Download anything from Instagram, beautifully";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Colours come from app/tokens.css via lib/design-tokens.generated.ts (light theme). */
const T = DESIGN_TOKENS.light;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: T["bg-base"],
          color: T["text-primary"],
          fontSize: 72,
          textAlign: "center",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 44 44" fill="none">
          <defs>
            <linearGradient id="og" x1="0" y1="44" x2="44" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor={T["cta-start"]} />
              <stop offset="1" stopColor={T["cta-end"]} />
            </linearGradient>
          </defs>
          <rect width="44" height="44" rx="12" fill="url(#og)" />
          <path d="M12 17V14.5C12 13.12 13.12 12 14.5 12H17M27 12H29.5C30.88 12 32 13.12 32 14.5V17M32 27V29.5C32 30.88 30.88 32 29.5 32H27M17 32H14.5C13.12 32 12 30.88 12 29.5V27" stroke={T.white} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M22 16.5V26M22 26L18 22M22 26L26 22" stroke={T.white} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", marginTop: 40, fontWeight: 700, letterSpacing: -1 }}>
          Download anything from Instagram
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 40, color: T["text-brand"] }}>
          Reels · Photos · Stories · Captions · Hashtags
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 28, color: T["text-secondary"], letterSpacing: 2 }}>
          {`${BRAND.name.toUpperCase()} — ${BRAND.tagline}`}
        </div>
        <div style={{ display: "flex", position: "absolute", bottom: 0, left: 0, right: 0, height: 10, background: `linear-gradient(90deg, ${T["cta-start"]}, ${T["cta-end"]})` }} />
      </div>
    ),
    { ...size }
  );
}
