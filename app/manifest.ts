import type { MetadataRoute } from "next";
import { DESIGN_TOKENS } from "@/lib/design-tokens.generated";
import { BRAND } from "@/lib/brand";

/**
 * Web App Manifest — served at /manifest.webmanifest (same URL as before).
 * PRD §14.2 / §14.7: standalone + window-controls-overlay, any orientation,
 * full icon set + separate maskable, shortcuts. Colours from app/tokens.css
 * (light is the default theme → launch/splash colour = light --bg-base).
 */
export default function manifest(): MetadataRoute.Manifest {
  const bg = DESIGN_TOKENS.light["bg-base"];
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  return {
    id: "/",
    name: `${BRAND.name} — Instagram Downloader & Creator Tools`,
    short_name: BRAND.short,
    description:
      "Download Instagram, Facebook, TikTok, Pinterest, X and Threads media in HD — plus YouTube thumbnails, captions, hashtags and a full creator toolkit. Share a link straight to InstaGrab.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    orientation: "any",
    background_color: bg,
    theme_color: bg,
    categories: ["utilities", "photo", "social"],
    icons: [
      ...sizes.map((s) => ({ src: `/icons/icon-${s}.png`, sizes: `${s}x${s}`, type: "image/png", purpose: "any" as const })),
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    share_target: {
      action: "/quick-action",
      method: "get",
      enctype: "application/x-www-form-urlencoded",
      params: { title: "title", text: "text", url: "url" },
    },
    shortcuts: [
      { name: "Instagram Downloader", short_name: "Instagram", url: "/instagram-downloader?source=shortcut", icons: [{ src: "/icons/shortcut-instagram.png", sizes: "96x96", type: "image/png" }] },
      { name: "All Tools", short_name: "Tools", url: "/tools?source=shortcut", icons: [{ src: "/icons/shortcut-tools.png", sizes: "96x96", type: "image/png" }] },
      { name: "Recent Grabs", short_name: "History", url: "/history?source=shortcut", icons: [{ src: "/icons/shortcut-history.png", sizes: "96x96", type: "image/png" }] },
    ],
  };
}
