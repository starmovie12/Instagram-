import { Sparkle } from "lucide-react";
import PlatformIcon, { type PlatformKey } from "./PlatformIcons";

/** Floating 3D app tiles around the phone — exact positions & angles from the reference design. */
const TILES: { name: PlatformKey; x: number; y: number; w: number; rot: number }[] = [
  { name: "instagram", x: 20, y: 10, w: 21, rot: -8 },
  { name: "tiktok", x: 58, y: 16, w: 20, rot: 9 },
  { name: "facebook", x: 6, y: 37, w: 19, rot: -6 },
  { name: "youtube", x: 38, y: 42, w: 18.5, rot: -6 },
  { name: "pinterest", x: 71, y: 47, w: 19, rot: 12 },
  { name: "x", x: 8, y: 63, w: 19, rot: -9 },
  { name: "download", x: 32, y: 67, w: 22, rot: 7 },
];

/** Hero card: glowing sparkle pill + dual-tone headline + 3D tilted neon phone & orbital app icons. */
export default function HeroBanner() {
  return (
    <section className="hb" aria-labelledby="hb-title">
      {/* Ambient bottom-center magenta/cyan laser glow */}
      <div className="hb-laser-glow" aria-hidden="true" />

      <div className="hb-pill-row">
        <span className="hb-spark-wrap" aria-hidden="true">
          <Sparkle
            strokeWidth={1.5}
            fill="#22E4FF"
            color="#22E4FF"
            className="hb-spark"
          />
          <i className="hb-dot d1" />
          <i className="hb-dot d2" />
          <i className="hb-dot d3" />
          <i className="hb-dot d4" />
        </span>

        <p className="hb-pill">
          <span>All-in-One Social Downloader &amp; Creator Super-App</span>
        </p>
      </div>

      <div className="hb-copy">
        <h1 id="hb-title" className="hb-title">
          Download &amp; Extract
          <br />
          Social Media <span className="hb-in">in</span>{" "}
          <span className="hb-hd">HD</span>
        </h1>

        <p className="hb-lead">
          <span className="hb-cy">Paste any link from Instagram,</span>{" "}
          <span className="hb-wh">Facebook, Pinterest,</span>{" "}
          <span className="hb-wh">X,</span>{" "}
          <span className="hb-cy">Threads, or @username</span>{" "}
          <span className="hb-wh">— auto-detects and</span>{" "}
          <span className="hb-cy">grabs instantly.</span>
        </p>
      </div>

      <div className="hb-art" aria-hidden="true">
        <svg viewBox="0 0 320 290" className="hb-svg" fill="none">
          <defs>
            <linearGradient
              id="hb_ring_cyan"
              x1="10"
              y1="140"
              x2="300"
              y2="140"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#A855F7" stopOpacity="0.85" />
              <stop offset="0.35" stopColor="#22E4FF" />
              <stop offset="0.75" stopColor="#38BDF8" />
              <stop offset="1" stopColor="#D946EF" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient
              id="hb_ring_magenta"
              x1="0"
              y1="260"
              x2="290"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#EC4899" />
              <stop offset="0.45" stopColor="#A855F7" />
              <stop offset="0.8" stopColor="#22E4FF" />
              <stop offset="1" stopColor="#22E4FF" stopOpacity="0.2" />
            </linearGradient>

            <linearGradient
              id="hb_rim"
              x1="95"
              y1="15"
              x2="235"
              y2="260"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#38BDF8" />
              <stop offset="0.3" stopColor="#8B5CF6" />
              <stop offset="0.7" stopColor="#D946EF" />
              <stop offset="1" stopColor="#22E4FF" />
            </linearGradient>

            <linearGradient id="hb_screen" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0" stopColor="#171E5C" />
              <stop offset="0.55" stopColor="#090D30" />
              <stop offset="0.85" stopColor="#081C4A" />
              <stop offset="1" stopColor="#0EA5E9" stopOpacity="0.65" />
            </linearGradient>

            <linearGradient id="hb_sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.14" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.03" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <radialGradient
              id="hb_glow"
              cx="165"
              cy="148"
              r="145"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#7C3AED" stopOpacity="0.62" />
              <stop offset="0.55" stopColor="#4F46E5" stopOpacity="0.28" />
              <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>

            <radialGradient
              id="hb_base_glow"
              cx="152"
              cy="248"
              r="72"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#22E4FF" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.35" />
              <stop offset="1" stopColor="#22E4FF" stopOpacity="0" />
            </radialGradient>

            <filter id="hb_blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" />
            </filter>

            <filter id="hb_neon" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Back ambient purple-blue aura */}
          <ellipse cx="165" cy="148" rx="145" ry="125" fill="url(#hb_glow)" />

          {/* Top-right cyan rim burst behind phone */}
          <ellipse
            cx="235"
            cy="34"
            rx="46"
            ry="18"
            transform="rotate(14 235 34)"
            fill="#22E4FF"
            opacity="0.38"
            filter="url(#hb_blur)"
          />

          {/* Rear orbital ring */}
          <ellipse
            cx="165"
            cy="142"
            rx="138"
            ry="52"
            transform="rotate(-8 165 142)"
            stroke="url(#hb_ring_cyan)"
            strokeWidth="2.8"
            opacity="0.55"
          />

          {/* 3D Tilted Smartphone (tilted clockwise +11 deg like the photo) */}
          <g transform="rotate(11 168 142)">
            {/* 3D Extruded Side/Back Body Shadow */}
            <rect
              x="105"
              y="22"
              width="126"
              height="236"
              rx="24"
              fill="#04071A"
              stroke="#6366F1"
              strokeWidth="1.5"
              opacity="0.85"
            />
            {/* Outer Neon Rim Glow */}
            <rect
              x="101"
              y="18"
              width="126"
              height="236"
              rx="24"
              fill="#38BDF8"
              opacity="0.32"
              filter="url(#hb_blur)"
            />
            {/* Main Phone Chassis */}
            <rect
              x="101"
              y="18"
              width="126"
              height="236"
              rx="24"
              fill="#070A24"
              stroke="url(#hb_rim)"
              strokeWidth="3.2"
            />
            {/* Inner Screen */}
            <rect
              x="108"
              y="25"
              width="112"
              height="222"
              rx="19"
              fill="url(#hb_screen)"
            />
            {/* Diagonal Glass Reflection */}
            <path
              d="M112 28 H185 L128 242 H112 Z"
              fill="url(#hb_sheen)"
            />
            {/* Top Speaker Pill & Camera Dot */}
            <rect x="148" y="31" width="30" height="5" rx="2.5" fill="#040617" />
            <circle cx="185" cy="33.5" r="2.5" fill="#0F172A" />

            {/* Subtle internal UI bars */}
            <rect
              x="120"
              y="52"
              width="78"
              height="6"
              rx="3"
              fill="#38BDF8"
              opacity="0.18"
            />
            <rect
              x="120"
              y="64"
              width="52"
              height="6"
              rx="3"
              fill="#818CF8"
              opacity="0.15"
            />

            {/* Bottom Screen Cyan Underglow */}
            <ellipse
              cx="164"
              cy="236"
              rx="46"
              ry="14"
              fill="#22E4FF"
              opacity="0.45"
              filter="url(#hb_blur)"
            />
            {/* Home Indicator Bar */}
            <rect
              x="144"
              y="239"
              width="40"
              height="3.5"
              rx="1.75"
              fill="#E0F2FE"
              opacity="0.65"
            />
          </g>

          {/* Bright floor glow beneath phone */}
          <ellipse cx="152" cy="252" rx="72" ry="18" fill="url(#hb_base_glow)" />

          {/* Upper-left to right sweeping neon orbit arc */}
          <path
            d="M 28 118 C 10 68, 95 44, 175 62 C 255 80, 308 118, 286 164"
            stroke="url(#hb_ring_cyan)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#hb_neon)"
          />

          {/* Front sweeping orbital ring crossing over the lower phone */}
          <path
            d="M 18 164 C 46 226, 208 242, 294 172"
            stroke="url(#hb_ring_cyan)"
            strokeWidth="3.8"
            strokeLinecap="round"
            filter="url(#hb_neon)"
          />

          {/* Secondary magenta/violet orbit trail & bottom-left laser beam */}
          <path
            d="M 2 282 C 42 248, 86 226, 146 224 C 216 222, 268 196, 298 152"
            stroke="url(#hb_ring_magenta)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#hb_neon)"
          />

          {/* Glowing bokeh / starlight particles */}
          <circle cx="48" cy="78" r="2" fill="#22E4FF" opacity="0.8" />
          <circle cx="288" cy="108" r="2.5" fill="#22E4FF" opacity="0.9" />
          <circle cx="296" cy="142" r="1.8" fill="#F472B6" opacity="0.85" />
          <circle cx="272" cy="208" r="2.2" fill="#38BDF8" opacity="0.75" />
          <circle cx="62" cy="236" r="2" fill="#E879F9" opacity="0.85" />
          <circle cx="22" cy="142" r="2.2" fill="#22E4FF" opacity="0.75" />
        </svg>

        {TILES.map((t) => (
          <span
            key={t.name}
            className={`hb-tile hb-tile-${t.name}`}
            style={{
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: `${t.w}%`,
              transform: `rotate(${t.rot}deg)`,
            }}
          >
            <PlatformIcon name={t.name} size="100%" />
          </span>
        ))}
      </div>

      <style>{`
        .hb {
          position: relative;
          overflow: hidden;
          margin-top: 14px;
          border-radius: 26px;
          padding: 24px 22px 28px 24px;
          min-height: 295px;
          border: 1.5px solid rgba(34, 228, 255, 0.55);
          background:
            radial-gradient(55% 85% at 82% 54%, rgba(124, 58, 237, 0.48), transparent 70%),
            radial-gradient(35% 45% at 62% 98%, rgba(217, 70, 239, 0.28), transparent 70%),
            radial-gradient(45% 60% at 8% 12%, rgba(34, 228, 255, 0.12), transparent 70%),
            linear-gradient(135deg, #050B24 0%, #080E2E 52%, #120B38 100%);
          box-shadow:
            0 0 0 1px rgba(124, 58, 237, 0.22),
            0 12px 42px -10px rgba(0, 0, 0, 0.75),
            0 0 38px -12px rgba(34, 228, 255, 0.5);
        }

        .hb-laser-glow {
          position: absolute;
          bottom: -24px;
          left: 48%;
          width: 220px;
          height: 56px;
          background: radial-gradient(ellipse at center, rgba(236, 72, 153, 0.55), transparent 70%);
          filter: blur(12px);
          pointer-events: none;
          z-index: 1;
        }

        .hb-pill-row {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 16px;
          max-width: 100%;
        }

        .hb-spark-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: clamp(22px, 1rem + 1.2vw, 30px);
          height: clamp(22px, 1rem + 1.2vw, 30px);
          flex-shrink: 0;
        }

        .hb-spark {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 10px rgba(34, 228, 255, 0.95));
        }

        .hb-dot {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #67E8F9;
          box-shadow: 0 0 6px #22E4FF;
        }
        .hb-dot.d1 { top: 1px; left: 2px; }
        .hb-dot.d2 { top: 2px; right: 1px; }
        .hb-dot.d3 { bottom: 1px; left: 2px; }
        .hb-dot.d4 { bottom: 2px; right: 1px; }

        .hb-pill {
          margin: 0;
          display: inline-flex;
          align-items: center;
          max-width: calc(100% - 38px);
          font-size: clamp(9.5px, 2.2vw, 13.5px);
          font-weight: 700;
          color: #F1F5F9;
          line-height: 1.2;
          white-space: nowrap;
        }

        .hb-pill > span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 7px 15px;
          border-radius: 999px;
          border: 1.5px solid rgba(139, 92, 246, 0.55);
          background: linear-gradient(90deg, rgba(16, 24, 68, 0.85) 0%, rgba(44, 24, 92, 0.78) 100%);
          box-shadow: inset 0 0 14px rgba(139, 92, 246, 0.25), 0 0 16px -4px rgba(56, 189, 248, 0.35);
        }

        .hb-copy {
          position: relative;
          z-index: 2;
          max-width: 60%;
        }

        .hb-title {
          margin: 0;
          max-width: none;
          color: #FFFFFF;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.08;
          font-size: clamp(1.38rem, 0.55rem + 4.1vw, 2.65rem);
          font-family: var(--font-sans), system-ui, sans-serif;
          font-style: normal;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
        }

        .hb-in {
          color: #1CE5FF;
          text-shadow: 0 0 18px rgba(28, 229, 255, 0.45);
        }

        .hb-hd {
          background: linear-gradient(135deg, #38BDF8 0%, #8B5CF6 42%, #C084FC 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 14px rgba(168, 85, 247, 0.35));
        }

        .hb-lead {
          margin: 14px 0 0;
          font-size: clamp(0.76rem, 0.52rem + 0.62vw, 1.08rem);
          line-height: 1.52;
          font-weight: 500;
          max-width: 38ch;
        }

        .hb-cy {
          color: #47E5FF;
        }

        .hb-wh {
          color: #EEF2FF;
        }

        .hb-art {
          position: absolute;
          z-index: 1;
          right: 0.5%;
          top: 38px;
          width: min(46%, 335px);
          aspect-ratio: 320 / 290;
          pointer-events: none;
        }

        .hb-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .hb-tile {
          position: absolute;
          aspect-ratio: 1;
          display: block;
          z-index: 2;
          border-radius: 24%;
          filter:
            drop-shadow(0 8px 14px rgba(2, 4, 18, 0.75))
            drop-shadow(0 0 12px rgba(56, 189, 248, 0.45));
          animation: hb-float 5.5s ease-in-out infinite;
        }

        .hb-tile:nth-of-type(2n) { animation-delay: -1.8s; }
        .hb-tile:nth-of-type(3n) { animation-delay: -3.2s; }

        @keyframes hb-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -6px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hb-tile { animation: none; }
        }

        @media (min-width: 640px) {
          .hb { min-height: 350px; padding: 28px 26px 30px 28px; }
          .hb-art { top: 28px; right: 1.5%; width: min(45%, 340px); }
        }

        @media (max-width: 639px) {
          .hb {
            padding: 18px 12px 22px 16px;
            border-radius: 22px;
            min-height: 0;
          }
          .hb-copy { max-width: 59%; }
          .hb-art {
            top: 44px;
            right: -1%;
            width: 46%;
          }
        }
      `}</style>
    </section>
  );
}
