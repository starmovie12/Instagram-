"use client";
import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Zap, ArrowRight } from "lucide-react";
import PlatformIcon, { type PlatformKey } from "./PlatformIcons";

/** Headline number shown in the strip (marketing count of auto-supported tools). */
export const AUTO_SUPPORTED_COUNT = 33;

const ITEMS: { key: PlatformKey; label: string; href: string }[] = [
  { key: "instagram", label: "IG", href: "/video-downloader" },
  { key: "facebook", label: "FB", href: "/facebook-downloader" },
  { key: "pinterest", label: "P", href: "/pinterest-downloader" },
  { key: "x", label: "X", href: "/twitter-downloader" },
  { key: "tiktok", label: "TikTok", href: "/tiktok-downloader" },
  { key: "youtube", label: "YT", href: "/youtube-thumbnail-downloader" },
  { key: "reels", label: "Reels", href: "/reels-downloader" },
  { key: "story", label: "Story", href: "/story-downloader" },
  { key: "threads", label: "Threads", href: "/threads-downloader" },
];

/** "⚡ 33 Tools Auto-Supported" header + horizontally scrolling platform tiles. */
export default function SupportedTools() {
  const rowRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    const el = rowRef.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + Math.max(200, el.clientWidth * 0.7), behavior: "smooth" });
  }

  return (
    <div className="st">
      <div className="st-head">
        <span className="st-title">
          <Zap size={20} strokeWidth={1.5} fill="#FFC83D" color="#FFC83D" aria-hidden="true" />
          {AUTO_SUPPORTED_COUNT} Tools Auto-Supported:
        </span>
        <Link href="/#tools" className="st-all">
          View All <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>

      <div className="st-rowwrap">
        <div className="st-row" ref={rowRef}>
          {ITEMS.map((it) => (
            <Link key={it.key} href={it.href} className="st-item" aria-label={`${it.label} downloader`}>
              <span className="st-ico"><PlatformIcon name={it.key} size="100%" radius="30%" /></span>
              <span>{it.label}</span>
            </Link>
          ))}
        </div>
        <button type="button" className="st-next" onClick={scrollNext} aria-label="Scroll platforms">
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>

      <style jsx>{`
        .st { border: 1.5px solid rgba(34, 228, 255, 0.28); border-radius: 22px; padding: 14px 14px 12px;
          background: linear-gradient(180deg, rgba(14, 22, 66, 0.75), rgba(8, 12, 44, 0.85));
          box-shadow: inset 0 0 28px -16px rgba(99, 102, 241, 0.7); }
        .st-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
        .st-title { display: inline-flex; align-items: center; gap: 8px; color: #F1F5FF; font-weight: 700; font-size: clamp(0.78rem, 0.4rem + 1.1vw, 1.05rem); white-space: nowrap; }
        :global(.st-all) { display: inline-flex; align-items: center; gap: 6px; color: #38D9F5; font-weight: 700; text-decoration: none;
          font-size: clamp(0.8rem, 0.6rem + 0.6vw, 1rem); white-space: nowrap; }
        .st-rowwrap { position: relative; }
        .st-row { display: flex; gap: 14px; overflow-x: auto; scrollbar-width: none; padding: 2px 34px 4px 2px; scroll-snap-type: x proximity; }
        .st-row::-webkit-scrollbar { display: none; }
        :global(.st-item) { flex: 0 0 auto; width: clamp(54px, 13vw, 66px); display: flex; flex-direction: column; align-items: center; gap: 7px;
          text-decoration: none; color: #E6ECFF; font-size: 12px; font-weight: 600; scroll-snap-align: start; transition: transform 160ms ease; }
        :global(.st-item:hover) { transform: translateY(-2px); }
        :global(.st-ico) { display: block; width: 100%; aspect-ratio: 1; border-radius: 30%; box-shadow: 0 0 0 1.5px rgba(139, 150, 255, 0.35), 0 6px 18px -6px rgba(99, 102, 241, 0.8); }
        :global(.st-ico > svg) { width: 100%; height: 100%; }
        .st-next { position: absolute; right: 0; top: 14px; width: 34px; height: 34px; border-radius: 50%; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; color: #fff;
          background: rgba(8, 12, 40, 0.95); border: 1.5px solid rgba(139, 150, 255, 0.45);
          box-shadow: -14px 0 14px 6px rgba(8, 12, 44, 0.85); }
      `}</style>
    </div>
  );
}
