"use client";
import { useEffect, useState } from "react";
import { Download, X, Share, PlusSquare, MoreVertical } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/**
 * Always-visible "Install App" button for the header. Uses the native
 * beforeinstallprompt on Android/Chrome; shows step-by-step instructions on
 * iOS (and any browser that hides the native prompt). Hidden once installed.
 * variant="card" renders the full-width "Install App" banner used under the
 * homepage header; variant="pill" is the compact header button.
 */
export default function InstallAppButton({ variant = "pill" }: { variant?: "pill" | "card" }) {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(true); // assume installed until we know otherwise (avoids flash)
  const [showHelp, setShowHelp] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    setInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onBIP = (e: Event) => { e.preventDefault(); setEvt(e as BIPEvent); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onBIP as EventListener);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (evt) {
      try { await evt.prompt(); await evt.userChoice; } catch {}
      setEvt(null);
      return;
    }
    setShowHelp(true); // iOS / browsers without the native prompt
  }

  if (installed) return null;

  const installCard = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "16px 0 0",
        padding: "14px 14px",
        borderRadius: 20,
        border: "1px solid rgba(255, 61, 139, 0.38)",
        background:
          "linear-gradient(135deg, rgba(255, 61, 139, 0.10) 0%, rgba(124, 58, 237, 0.10) 55%, rgba(10, 8, 24, 0.92) 100%)",
        boxShadow: "0 0 34px -14px rgba(255, 61, 139, 0.55)",
      }}
    >
      <svg width="34" height="40" viewBox="6 0 28 40" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="iab_phone" x1="6" y1="36" x2="34" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B3DFF" />
            <stop offset="1" stopColor="#FF3D8B" />
          </linearGradient>
        </defs>
        <rect x="9" y="3" width="22" height="34" rx="5" stroke="url(#iab_phone)" strokeWidth="2.4" />
        <path d="M16.5 7h7" stroke="url(#iab_phone)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: 18,
            lineHeight: 1.2,
            background: "linear-gradient(90deg, #FF7A59 0%, #FF3D8B 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Install App
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 3, lineHeight: 1.35 }}>
          Get faster downloads &amp; easy access
        </div>
      </div>

      <button
        type="button"
        onClick={install}
        aria-label="Install the InstaGrab app"
        style={{
          flexShrink: 0,
          height: 44,
          padding: "0 20px",
          borderRadius: 14,
          border: "none",
          cursor: "pointer",
          color: "#FFFFFF",
          fontWeight: 800,
          fontSize: 15,
          background: "linear-gradient(135deg, #FF4D8D 0%, #E0267F 55%, #C026D3 100%)",
          boxShadow: "0 8px 22px -8px rgba(255, 61, 139, 0.75)",
        }}
      >
        Install
      </button>
    </div>
  );

  return (
    <>
      {variant === "card" ? installCard : (
      <button className="btn btn-molten iab" onClick={install}
        aria-label="Install the InstaGrab app" title="Install the app — works offline, opens from your home screen"
        style={{ height: 38, padding: "0 14px", fontSize: 13, borderRadius: 999 }}>
        <Download size={15} strokeWidth={1.75} />
        <span className="iab-label">Install App</span>
      </button>
      )}

      {showHelp && (
        <div onClick={() => setShowHelp(false)} role="dialog" aria-modal="true" aria-label="How to install"
          style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(10,9,6,.55)", backdropFilter: "blur(8px)" }}>
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ maxWidth: 380, width: "100%", padding: 26, position: "relative" }}>
            <button onClick={() => setShowHelp(false)} aria-label="Close" className="btn-icon" style={{ position: "absolute", top: 12, right: 12 }}>
              <X size={18} strokeWidth={1.5} />
            </button>
            <span className="medallion" style={{ margin: "0 auto 14px" }}><Download size={24} strokeWidth={1.5} /></span>
            <h3 style={{ fontSize: 19, textAlign: "center", marginBottom: 16 }}>Install InstaGrab</h3>
            {isIos ? (
              <ol style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0 }}>
                <li style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink-2)" }}>
                  <Share size={18} strokeWidth={1.5} style={{ color: "var(--gold-ink)", flexShrink: 0 }} />
                  Tap the <b>Share</b> button in Safari&apos;s toolbar
                </li>
                <li style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink-2)" }}>
                  <PlusSquare size={18} strokeWidth={1.5} style={{ color: "var(--gold-ink)", flexShrink: 0 }} />
                  Scroll and tap <b>Add to Home Screen</b>
                </li>
                <li style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink-2)" }}>
                  <Download size={18} strokeWidth={1.5} style={{ color: "var(--gold-ink)", flexShrink: 0 }} />
                  Tap <b>Add</b> — InstaGrab appears like a real app
                </li>
              </ol>
            ) : (
              <ol style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0 }}>
                <li style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink-2)" }}>
                  <MoreVertical size={18} strokeWidth={1.5} style={{ color: "var(--gold-ink)", flexShrink: 0 }} />
                  Open your browser&apos;s <b>⋮ menu</b>
                </li>
                <li style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "var(--ink-2)" }}>
                  <Download size={18} strokeWidth={1.5} style={{ color: "var(--gold-ink)", flexShrink: 0 }} />
                  Tap <b>Install app</b> (or <b>Add to Home screen</b>)
                </li>
              </ol>
            )}
            <p className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 16, lineHeight: 1.6, textAlign: "center" }}>
              Free, no store needed — opens instantly, works offline, and shows up in your Share menu.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 479px) {
          .iab .iab-label { display: none; }
          .iab { padding: 0 11px !important; }
        }
      `}</style>
    </>
  );
}
