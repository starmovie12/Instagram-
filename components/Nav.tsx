"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguagePicker from "./LanguagePicker";

const LINKS = [
  { href: "/reels-downloader", label: "Reels" },
  { href: "/story-downloader", label: "Story" },
  { href: "/photo-downloader", label: "Photos" },
  { href: "/caption-extractor", label: "Captions" },
  { href: "/hashtag-extractor", label: "Hashtags" },
  { href: "/profile-viewer", label: "Profile" },
  { href: "/#tools", label: "All tools" },
  { href: "/blog", label: "Blog" },
];

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="29" height="29" rx="9" stroke="url(#lg)" strokeWidth="1.8" />
      <path d="M13 11.5l8 4.5-8 4.5v-9z" stroke="url(#lg)" strokeWidth="1.8" strokeLinejoin="round" />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#EBD6A4" /><stop offset=".45" stopColor="#D2AC64" /><stop offset="1" stopColor="#A67C35" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 50, height: 68,
        background: "color-mix(in srgb, var(--bg) 86%, transparent)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 24, height: "100%" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo />
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontWeight: 700, fontSize: 17 }}>InstaGrab</span>
              <span className="label" style={{ fontSize: 9 }}>The gold standard</span>
            </span>
          </Link>
          <nav className="nav-desktop" style={{ display: "flex", gap: 22, margin: "0 auto" }}>
            {LINKS.map(l => (
              <Link key={l.href} href={l.href} className="navlink" aria-current={path === l.href ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: "auto" }}>
            <LanguagePicker />
            <ThemeToggle />
            <button className="btn-icon nav-burger" aria-label="Menu" onClick={() => setOpen(true)}>
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <style jsx>{`
          .nav-burger{ display:none; }
          @media (max-width:1023px){
            .nav-desktop{ display:none !important; }
            .nav-burger{ display:inline-flex; }
          }
        `}</style>
      </header>

      {/* Mobile drawer — rendered OUTSIDE the backdrop-filtered header so the
          fixed overlay is relative to the viewport and its panel is opaque. */}
      {open && (
        <div onClick={() => setOpen(false)} role="dialog" aria-modal="true" style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(10,9,6,.5)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
          animation: "navFade 200ms ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 320, maxWidth: "85vw",
            background: "var(--surface)", borderLeft: "1px solid var(--line)",
            boxShadow: "-24px 0 60px -20px rgba(0,0,0,.4)",
            padding: 20, display: "flex", flexDirection: "column", gap: 4,
            overflowY: "auto", animation: "navSlide 260ms var(--ease-silk)",
          }}>
            <button className="btn-icon" aria-label="Close menu" onClick={() => setOpen(false)} style={{ alignSelf: "flex-end", marginBottom: 8 }}>
              <X size={20} strokeWidth={1.5} />
            </button>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ textDecoration: "none", padding: "13px 6px", borderBottom: "1px solid var(--line)", fontWeight: 500, fontSize: 16, color: "var(--ink)" }}>
                {l.label}
              </Link>
            ))}
          </div>
          <style jsx>{`
            @keyframes navFade{ from{ opacity:0; } to{ opacity:1; } }
            @keyframes navSlide{ from{ transform:translateX(100%); } to{ transform:none; } }
          `}</style>
        </div>
      )}
    </>
  );
}
