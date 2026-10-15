import { Sparkle } from "lucide-react";
import PlatformIcon, { type PlatformKey } from "./PlatformIcons";

/** Floating app tiles around the phone — position/size are % of the art box. */
const TILES: { name: PlatformKey; x: number; y: number; w: number; rot: number }[] = [
  { name: "instagram", x: 27, y: 9, w: 19, rot: -8 },
  { name: "tiktok", x: 69, y: 7, w: 16, rot: 8 },
  { name: "facebook", x: 4, y: 37, w: 17, rot: -6 },
  { name: "youtube", x: 46, y: 36, w: 18, rot: 4 },
  { name: "pinterest", x: 80, y: 38, w: 16, rot: 10 },
  { name: "x", x: 9, y: 66, w: 16, rot: -5 },
  { name: "download", x: 44, y: 66, w: 21, rot: 6 },
];

/** Hero card: pill + headline + lead on the left, neon phone illustration on the right. */
export default function HeroBanner() {
  return (
    <section className="hb" aria-labelledby="hb-title">
      <p className="hb-pill">
        <Sparkle strokeWidth={1.5} fill="#22E4FF" color="#22E4FF" aria-hidden="true" className="hb-spark" />
        <span>All-in-One Social Downloader &amp; Creator Super-App</span>
      </p>

      <div className="hb-copy">
        <h1 id="hb-title" className="hb-title">
          Download &amp; Extract Social Media <span className="hb-hd">in HD</span>
        </h1>

        <p className="hb-lead">
          <span className="hb-cy">Paste any link from Instagram, Facebook, Pinterest, X, Threads, or @username</span>{" "}
          — auto-detects and <span className="hb-cy">grabs instantly.</span>
        </p>
      </div>

      <div className="hb-art" aria-hidden="true">
        <svg viewBox="0 0 300 270" className="hb-svg" fill="none">
          <defs>
            <linearGradient id="hb_ring" x1="0" y1="135" x2="300" y2="135" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7C3AED" />
              <stop offset="0.5" stopColor="#22E4FF" />
              <stop offset="1" stopColor="#C026D3" />
            </linearGradient>
            <linearGradient id="hb_rim" x1="90" y1="20" x2="210" y2="250" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="0.55" stopColor="#38BDF8" />
              <stop offset="1" stopColor="#D946EF" />
            </linearGradient>
            <linearGradient id="hb_screen" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#1C2275" />
              <stop offset="1" stopColor="#0A0C33" />
            </linearGradient>
            <radialGradient id="hb_glow" cx="150" cy="150" r="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7C3AED" stopOpacity="0.55" />
              <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
            <filter id="hb_blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>

          <ellipse cx="150" cy="150" rx="140" ry="120" fill="url(#hb_glow)" />

          {/* rear orbit ring */}
          <ellipse cx="150" cy="168" rx="132" ry="44" transform="rotate(-14 150 168)" stroke="url(#hb_ring)" strokeWidth="3" opacity="0.55" />

          {/* phone */}
          <g transform="rotate(-9 150 138)">
            <rect x="92" y="22" width="122" height="232" rx="24" fill="#8B5CF6" opacity="0.5" filter="url(#hb_blur)" />
            <rect x="92" y="22" width="122" height="232" rx="24" fill="#080B2B" stroke="url(#hb_rim)" strokeWidth="3.5" />
            <rect x="100" y="30" width="106" height="216" rx="18" fill="url(#hb_screen)" />
            <rect x="136" y="35" width="34" height="7" rx="3.5" fill="#05061C" />
            <rect x="110" y="62" width="86" height="8" rx="4" fill="#3B4399" opacity="0.7" />
            <rect x="110" y="78" width="60" height="8" rx="4" fill="#2C3380" opacity="0.7" />
            <rect x="110" y="196" width="86" height="34" rx="12" fill="#27308F" opacity="0.7" />
          </g>

          {/* front orbit ring (crosses over the phone) */}
          <path d="M18 170 C 70 232, 220 236, 284 150" stroke="url(#hb_ring)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M30 120 C 20 70, 90 38, 160 40" stroke="url(#hb_ring)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>

        {TILES.map((t) => (
          <span
            key={t.name}
            className="hb-tile"
            style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${t.w}%`, transform: `rotate(${t.rot}deg)` }}
          >
            <PlatformIcon name={t.name} size="100%" />
          </span>
        ))}
      </div>

      <style>{`
        .hb {
          position: relative; overflow: hidden; margin-top: 16px; border-radius: 26px;
          padding: 24px 22px 26px 24px; min-height: 280px;
          border: 1.5px solid rgba(34, 228, 255, 0.5);
          background:
            radial-gradient(60% 90% at 88% 62%, rgba(124, 58, 237, 0.5), transparent 70%),
            radial-gradient(40% 60% at 0% 0%, rgba(34, 228, 255, 0.10), transparent 70%),
            linear-gradient(135deg, #08102E 0%, #0A0F33 55%, #160E3C 100%);
          box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.18), 0 0 44px -14px rgba(34, 228, 255, 0.55);
        }
        .hb-pill {
          position: relative; z-index: 2; margin: 0 0 16px; display: inline-flex; align-items: center; gap: 8px; max-width: 100%;
          font-size: clamp(8.6px, 2.3vw, 13px); font-weight: 600; color: #DCE6FF; line-height: 1.2; white-space: nowrap;
        }
        .hb-pill > span {
          min-width: 0; overflow: hidden; text-overflow: ellipsis; padding: 7px 12px; border-radius: 999px; border: 1px solid rgba(103, 232, 249, 0.35);
          background: rgba(20, 30, 80, 0.7);
        }
        .hb-spark { width: clamp(16px, 0.8rem + 1vw, 24px); height: auto; flex-shrink: 0; filter: drop-shadow(0 0 8px rgba(34, 228, 255, 0.9)); }
        .hb-copy { position: relative; z-index: 2; max-width: 62%; }
        .hb-title {
          margin: 0; max-width: none; color: #fff; font-weight: 800; letter-spacing: -0.025em;
          line-height: 1.1; font-size: clamp(1.3rem, 0.45rem + 4.3vw, 2.6rem);
          font-family: var(--font-sans), system-ui, sans-serif; font-style: normal;
        }
        .hb-hd {
          background: linear-gradient(90deg, #22E4FF 0%, #38BDF8 60%, #6EE7F9 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hb-lead { margin: 14px 0 0; color: #E6ECFF; font-size: clamp(0.75rem, 0.5rem + 0.6vw, 1.1rem); line-height: 1.55; }
        .hb-cy { color: #4FE3F5; }
        .hb-art { position: absolute; z-index: 1; right: 1%; top: 54px; width: min(46%, 330px); aspect-ratio: 300 / 270; pointer-events: none; }
        .hb-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        .hb-tile {
          position: absolute; aspect-ratio: 1; display: block; z-index: 2;
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 12px rgba(99, 102, 241, 0.55));
          animation: hb-float 5.5s ease-in-out infinite;
        }
        .hb-tile:nth-of-type(2n) { animation-delay: -1.8s; }
        .hb-tile:nth-of-type(3n) { animation-delay: -3.2s; }
        @keyframes hb-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -6px; } }
        @media (prefers-reduced-motion: reduce) { .hb-tile { animation: none; } }
        @media (min-width: 640px) { .hb { min-height: 370px; } }
        @media (max-width: 639px) {
          .hb { padding: 18px 12px 20px 16px; border-radius: 22px; min-height: 0; }
          .hb-art { top: 46px; right: 0; width: 45%; }
        }
      `}</style>
    </section>
  );
}
