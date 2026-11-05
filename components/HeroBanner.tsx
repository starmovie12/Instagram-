import { Sparkle } from "lucide-react";
import PlatformIcon, { type PlatformKey } from "./PlatformIcons";

/** Floating 3D app tiles around the phone — exact positions locked to the reference photo. */
const TILES: { name: PlatformKey; x: number; y: number; w: number; rot: number }[] = [
  { name: "instagram", x: 15.5, y: 15.5, w: 22, rot: -8 },
  { name: "tiktok", x: 54.5, y: 22.5, w: 20.5, rot: 9 },
  { name: "facebook", x: 3.5, y: 40.5, w: 19.5, rot: -6 },
  { name: "youtube", x: 35, y: 45.5, w: 19, rot: -7 },
  { name: "pinterest", x: 67.5, y: 50.5, w: 19.5, rot: 12 },
  { name: "x", x: 5.5, y: 63.5, w: 19, rot: -9 },
  { name: "download", x: 29.5, y: 67.5, w: 22.5, rot: 6 },
];

/**
 * Proportional Hero Banner:
 * Locked to the exact 2.32:1 aspect ratio of the reference image using CSS container query units (cqw),
 * ensuring identical height, width, and line breaks on both mobile and desktop.
 */
export default function HeroBanner() {
  return (
    <div className="hb-shell">
      <section className="hb" aria-labelledby="hb-title">
        {/* Bottom-center pink/magenta laser glow */}
        <div className="hb-laser-glow" aria-hidden="true" />

        {/* Row 1: Sparkle + Pill */}
        <div className="hb-pill-row">
          <span className="hb-spark-wrap" aria-hidden="true">
            <Sparkle
              strokeWidth={1.5}
              className="hb-spark"
              style={{ fill: "var(--ig-pink)", color: "var(--ig-pink)" }}
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

        {/* Row 2 & 3: Locked 2-line Heading + Locked 3-line Subtitle */}
        <div className="hb-copy">
          <h1 id="hb-title" className="hb-title">
            <span className="hb-line">Download &amp; Extract</span>
            <span className="hb-line">
              Social Media <span className="hb-in">in</span>{" "}
              <span className="hb-hd">HD</span>
            </span>
          </h1>

          <p className="hb-lead">
            <span className="hb-line">
              <span className="hb-cy">Paste any link from Instagram,</span>{" "}
              <span className="hb-wh">Facebook, Pinterest,</span>
            </span>
            <span className="hb-line">
              <span className="hb-cy">X, Threads, or @username</span>{" "}
              <span className="hb-wh">— auto-detects and</span>
            </span>
            <span className="hb-line">
              <span className="hb-cy">grabs instantly.</span>
            </span>
          </p>
        </div>

        {/* Right Side: Tilted 3D Phone & Floating App Icons */}
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
                <stop offset="0" stopOpacity="0.85" style={{ stopColor: "var(--ig-purple)" }} />
                <stop offset="0.35" style={{ stopColor: "var(--ig-pink)" }} />
                <stop offset="0.75" style={{ stopColor: "var(--ig-orange)" }} />
                <stop offset="1" stopOpacity="0.9" style={{ stopColor: "var(--ig-purple)" }} />
              </linearGradient>

              <linearGradient
                id="hb_ring_magenta"
                x1="0"
                y1="265"
                x2="290"
                y2="90"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" style={{ stopColor: "var(--ig-pink)" }} />
                <stop offset="0.45" style={{ stopColor: "var(--ig-purple)" }} />
                <stop offset="0.8" style={{ stopColor: "var(--ig-pink)" }} />
                <stop offset="1" stopOpacity="0.2" style={{ stopColor: "var(--ig-pink)" }} />
              </linearGradient>

              <linearGradient
                id="hb_rim"
                x1="95"
                y1="15"
                x2="235"
                y2="260"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" style={{ stopColor: "var(--ig-orange)" }} />
                <stop offset="0.3" style={{ stopColor: "var(--ig-pink)" }} />
                <stop offset="0.7" style={{ stopColor: "var(--ig-purple)" }} />
                <stop offset="1" style={{ stopColor: "var(--ig-pink)" }} />
              </linearGradient>

              <linearGradient id="hb_screen" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0" style={{ stopColor: "var(--device-screen-1)" }} />
                <stop offset="0.55" style={{ stopColor: "var(--device-screen-2)" }} />
                <stop offset="0.85" style={{ stopColor: "var(--device-screen-3)" }} />
                <stop offset="1" stopOpacity="0.7" style={{ stopColor: "var(--ig-purple)" }} />
              </linearGradient>

              <linearGradient id="hb_sheen" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopOpacity="0.13" style={{ stopColor: "var(--white)" }} />
                <stop offset="0.5" stopOpacity="0.03" style={{ stopColor: "var(--white)" }} />
                <stop offset="1" stopOpacity="0" style={{ stopColor: "var(--white)" }} />
              </linearGradient>

              <radialGradient
                id="hb_glow"
                cx="165"
                cy="148"
                r="145"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopOpacity="0.6" style={{ stopColor: "var(--ig-purple)" }} />
                <stop offset="0.55" stopOpacity="0.26" style={{ stopColor: "var(--ig-blue)" }} />
                <stop offset="1" stopOpacity="0" style={{ stopColor: "var(--ig-purple)" }} />
              </radialGradient>

              <radialGradient
                id="hb_base_glow"
                cx="150"
                cy="252"
                r="74"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopOpacity="0.85" style={{ stopColor: "var(--ig-pink)" }} />
                <stop offset="0.5" stopOpacity="0.35" style={{ stopColor: "var(--ig-purple)" }} />
                <stop offset="1" stopOpacity="0" style={{ stopColor: "var(--ig-pink)" }} />
              </radialGradient>

              <filter id="hb_blur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>

              <filter id="hb_neon" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ambient purple-blue aura */}
            <ellipse cx="165" cy="148" rx="145" ry="125" fill="url(#hb_glow)" />

            {/* Top-right cyan rim burst behind phone */}
            <ellipse
              cx="232"
              cy="34"
              rx="45"
              ry="16"
              transform="rotate(14 232 34)"
             
              opacity="0.42"
              filter="url(#hb_blur)" style={{ fill: "var(--ig-pink)" }} />

            {/* Rear orbital ring */}
            <ellipse
              cx="162"
              cy="144"
              rx="136"
              ry="50"
              transform="rotate(-8 162 144)"
              stroke="url(#hb_ring_cyan)"
              strokeWidth="2.6"
              opacity="0.55"
            />

            {/* 3D Tilted Smartphone */}
            <g transform="rotate(11 168 144)">
              <rect
                x="105"
                y="22"
                width="124"
                height="234"
                rx="24"
               
               
                strokeWidth="1.4"
                opacity="0.85" style={{ fill: "var(--device-body)", stroke: "var(--ig-blue)" }} />
              <rect
                x="101"
                y="18"
                width="124"
                height="234"
                rx="24"
               
                opacity="0.3"
                filter="url(#hb_blur)" style={{ fill: "var(--ig-orange)" }} />
              <rect
                x="101"
                y="18"
                width="124"
                height="234"
                rx="24"
               
                stroke="url(#hb_rim)"
                strokeWidth="3.2" style={{ fill: "var(--device-frame)" }} />
              <rect
                x="108"
                y="25"
                width="110"
                height="220"
                rx="19"
                fill="url(#hb_screen)"
              />
              <path d="M112 28 H184 L128 240 H112 Z" fill="url(#hb_sheen)" />
              <rect x="147" y="31" width="30" height="5" rx="2.5" style={{ fill: "var(--device-notch)" }} />
              <circle cx="184" cy="33.5" r="2.3" style={{ fill: "var(--device-cam)" }} />

              {/* Bottom Screen Cyan Glow */}
              <ellipse
                cx="163"
                cy="234"
                rx="45"
                ry="14"
               
                opacity="0.5"
                filter="url(#hb_blur)" style={{ fill: "var(--ig-pink)" }} />
              <rect
                x="143"
                y="237"
                width="40"
                height="3.5"
                rx="1.75"
               
                opacity="0.7" style={{ fill: "var(--white)" }} />
            </g>

            {/* Floor glow under phone */}
            <ellipse cx="150" cy="252" rx="72" ry="17" fill="url(#hb_base_glow)" />

            {/* Upper orbital arc */}
            <path
              d="M 28 118 C 10 68, 95 44, 175 62 C 255 80, 308 118, 286 164"
              stroke="url(#hb_ring_cyan)"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#hb_neon)"
            />

            {/* Front orbital ring crossing over the phone */}
            <path
              d="M 18 164 C 46 226, 208 242, 294 172"
              stroke="url(#hb_ring_cyan)"
              strokeWidth="3.6"
              strokeLinecap="round"
              filter="url(#hb_neon)"
            />

            {/* Bottom-left diagonal magenta laser beam & trail */}
            <path
              d="M -6 286 C 36 250, 84 226, 146 224 C 216 222, 268 196, 298 152"
              stroke="url(#hb_ring_magenta)"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#hb_neon)"
            />

            {/* Sparkle particles */}
            <circle cx="48" cy="78" r="2" opacity="0.8" style={{ fill: "var(--ig-pink)" }} />
            <circle cx="288" cy="108" r="2.4" opacity="0.9" style={{ fill: "var(--ig-pink)" }} />
            <circle cx="296" cy="142" r="1.8" opacity="0.85" style={{ fill: "var(--ig-orange)" }} />
            <circle cx="272" cy="208" r="2.2" opacity="0.75" style={{ fill: "var(--ig-orange)" }} />
            <circle cx="62" cy="236" r="2" opacity="0.85" style={{ fill: "var(--ig-purple)" }} />
          </svg>

          {TILES.map((t) => (
            <span
              key={t.name}
              className="hb-tile"
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
      </section>

      <style>{`
        /* Outer wrapper locks maximum width so desktop & mobile match 1:1 */
        .hb-shell {
          width: 100%;
          max-width: 800px;
          margin: clamp(8px, 4px + 1vw, 12px) auto 0 auto;
          container-type: inline-size;
        }

        /* Locked 2.32:1 Aspect Ratio — identical height/width proportion on every screen */
        .hb {
          position: relative;
          width: 100%;
          aspect-ratio: 2.32 / 1;
          overflow: hidden;
          border-radius: clamp(16px, 3.8cqw, 26px);
          padding: 4.2cqw 3.8cqw 4.2cqw 4.4cqw;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid var(--hero-border);
          background:
            radial-gradient(55% 85% at 80% 54%, var(--hero-glow-a), transparent 70%),
            radial-gradient(35% 45% at 60% 98%, var(--hero-glow-b), transparent 70%),
            radial-gradient(45% 60% at 8% 12%, var(--hero-glow-c), transparent 70%),
            var(--hero-bg);
          box-shadow:
            var(--shadow-card);
          box-sizing: border-box;
        }

        .hb-laser-glow {
          position: absolute;
          bottom: -6%;
          left: 46%;
          width: 34%;
          height: 20%;
          background: radial-gradient(ellipse at center, var(--hero-glow-b), transparent 70%);
          filter: blur(10px);
          pointer-events: none;
          z-index: 1;
        }

        /* Top Pill Row */
        .hb-pill-row {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 1.5cqw;
          margin: 0;
          max-width: 63%;
        }

        .hb-spark-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 4.4cqw;
          height: 4.4cqw;
          min-width: 15px;
          min-height: 15px;
          flex-shrink: 0;
        }

        .hb-spark {
          width: 100%;
          height: 100%;
          filter: none;
        }

        .hb-dot {
          position: absolute;
          width: 0.45cqw;
          height: 0.45cqw;
          min-width: 2px;
          min-height: 2px;
          border-radius: 50%;
          background: var(--ig-pink);
        }
        .hb-dot.d1 { top: 0; left: 1px; }
        .hb-dot.d2 { top: 1px; right: 0; }
        .hb-dot.d3 { bottom: 0; left: 1px; }
        .hb-dot.d4 { bottom: 1px; right: 0; }

        .hb-pill {
          margin: 0;
          display: inline-flex;
          align-items: center;
          min-width: 0;
          font-size: clamp(7.5px, 2.05cqw, 14px);
          font-weight: 700;
          color: var(--hero-ink);
          line-height: 1.15;
          white-space: nowrap;
        }

        .hb-pill > span {
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0.95cqw 2.2cqw;
          border-radius: 999px;
          border: 1px solid var(--hero-pill-border);
          background: var(--hero-pill-bg);
        }

        /* Left Copy Block — strictly contained within 59% width */
        .hb-copy {
          position: relative;
          z-index: 2;
          width: 59%;
          max-width: 59%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.8cqw;
          margin: auto 0;
        }

        .hb-line {
          display: block;
          white-space: nowrap;
        }

        .hb-title {
          margin: 0;
          color: var(--hero-ink);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.07;
          font-size: clamp(14px, 5.45cqw, 37px);
          font-family: var(--font-sans), system-ui, sans-serif;
          font-style: normal;
          text-shadow: var(--hero-text-shadow);
        }

        .hb-in {
          color: var(--text-brand);
        }

        .hb-hd {
          color: var(--text-brand);
        }

        .hb-lead {
          margin: 0;
          font-size: clamp(8px, 2.22cqw, 15.2px);
          line-height: 1.42;
          font-weight: 500;
        }

        .hb-cy {
          color: var(--text-brand);
        }

        .hb-wh {
          color: var(--hero-ink-2);
        }

        /* Right Phone Artwork — locked inside the right 41% of the card */
        .hb-art {
          position: absolute;
          z-index: 1;
          right: 1.2%;
          top: 3%;
          width: 41.5%;
          height: 94%;
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
            drop-shadow(0 6px 12px rgb(var(--shadow-rgb) / 0.28));
          animation: hb-float 5.5s ease-in-out infinite;
        }

        .hb-tile:nth-of-type(2n) { animation-delay: -1.8s; }
        .hb-tile:nth-of-type(3n) { animation-delay: -3.2s; }

        @keyframes hb-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -4px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hb-tile { animation: none; }
        }
      `}</style>
    </div>
  );
}
