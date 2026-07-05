import Script from "next/script";

/**
 * Monetization slots (PRD §5 — Adsterra / Monetag first, AdSense on /blog later).
 *
 * Ads stay OFF until env vars are set, so dev + screenshots are clean and no
 * broken/empty ad boxes ship. To enable in Vercel:
 *   NEXT_PUBLIC_ADS_ENABLED=true
 *   NEXT_PUBLIC_ADSTERRA_BANNER_SRC=//pl........invoke.js   (Native Banner)
 *   NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SRC=//pl........invoke.js (Social Bar, global)
 * Keep popunder OFF at launch (PRD recommendation) to protect repeat traffic.
 */
const ADS_ON = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
const BANNER_SRC = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_SRC ?? "";
const SOCIALBAR_SRC = process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SRC ?? "";

/** In-content native banner — placed below result cards / between sections. */
export function AdSlot({ label = "ad" }: { label?: string }) {
  if (!ADS_ON) return null;
  return (
    <div className="ad-slot" data-ad={label}>
      {BANNER_SRC && (
        <Script
          id={`ad-${label}`}
          strategy="lazyOnload"
          src={BANNER_SRC.startsWith("//") ? `https:${BANNER_SRC}` : BANNER_SRC}
        />
      )}
    </div>
  );
}

/** Global ad scripts (Social Bar) — mounted once in the layout. */
export function AdScripts() {
  if (!ADS_ON || !SOCIALBAR_SRC) return null;
  return (
    <Script
      id="adsterra-socialbar"
      strategy="lazyOnload"
      src={SOCIALBAR_SRC.startsWith("//") ? `https:${SOCIALBAR_SRC}` : SOCIALBAR_SRC}
    />
  );
}
