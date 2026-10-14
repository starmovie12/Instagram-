"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  History,
  Settings,
  ShieldCheck,
  Download,
  Trash2,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguagePicker from "./LanguagePicker";
import InstallAppButton from "./InstallAppButton";
import { bumpStreak } from "@/lib/retention";

const LINKS = [
  { href: "/", label: "Super App" },
  { href: "/reels-downloader", label: "Reels" },
  { href: "/facebook-downloader", label: "Facebook" },
  { href: "/pinterest-downloader", label: "Pinterest" },
  { href: "/caption-extractor", label: "Captions" },
  { href: "/hashtag-extractor", label: "Hashtags" },
  { href: "/profile-viewer", label: "Profile" },
  { href: "/blog", label: "Blog" },
];

export type GrabHistoryItem = {
  id: string;
  shortcode: string;
  platform?: string;
  url: string;
  type?: string;
  caption?: string;
  author?: string;
  thumbnail?: string;
  timestamp: number;
};

/** Daily visit streak badge */
function StreakBadge() {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    try {
      setStreak(bumpStreak());
    } catch {}
  }, []);
  if (streak < 2) return null;
  return (
    <span
      className="mono"
      title={`${streak}-day creator streak`}
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#00F5D4",
        background: "rgba(0, 245, 212, 0.1)",
        border: "1px solid rgba(0, 245, 212, 0.3)",
        borderRadius: 999,
        padding: "5px 10px",
        whiteSpace: "nowrap",
      }}
    >
      🔥 {streak}
    </span>
  );
}

/** Frame-Grab Cyber Logo */
function OmniGrabLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      style={{
        borderRadius: 10,
        boxShadow: "0 4px 16px rgba(0, 245, 212, 0.3)",
        flexShrink: 0,
      }}
    >
      <rect width="36" height="36" rx="10" fill="url(#omni_bg)" />
      {/* Viewfinder corners */}
      <path
        d="M8 13V10C8 8.89543 8.89543 8 10 8H13M23 8H26C27.1046 8 28 8.89543 28 10V13M28 23V26C28 27.1046 27.1046 28 26 28H23M13 28H10C8.89543 28 8 27.1046 8 26V23"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.9"
      />
      {/* Center Download Arrow */}
      <path
        d="M18 12.5V22.5M18 22.5L14 18.5M18 22.5L22 18.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="omni_bg"
          x1="0"
          y1="36"
          x2="36"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00F5D4" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Nav() {
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quick-Return Header State (Master Prompt v11 Step 2: Slide out on scroll down, slide in on 15px scroll up)
  const [headerHidden, setHeaderHidden] = useState(false);

  // Modals State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Settings State (Compatible with instagrab-main)
  const [sessionId, setSessionId] = useState("");
  const [cobaltInstance, setCobaltInstance] = useState("");
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // History + Undo + 2-Step Confirm State
  const [history, setHistory] = useState<GrabHistoryItem[]>([]);
  const [deletedBackup, setDeletedBackup] = useState<{
    item: GrabHistoryItem;
    index: number;
  } | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // 1. Load Settings & History + Listen for Global Custom Events
  const loadStoredData = () => {
    try {
      setSessionId(localStorage.getItem("instagrab_session_id") || "");
      setCobaltInstance(localStorage.getItem("instagrab_cobalt_instance") || "");
      const rawHistory = localStorage.getItem("instagrab_history");
      if (rawHistory) {
        const parsed = JSON.parse(rawHistory);
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {}
  };

  useEffect(() => {
    loadStoredData();

    const handleOpenSettings = () => {
      loadStoredData();
      setShowSettingsModal(true);
    };
    const handleOpenHistory = () => {
      loadStoredData();
      setConfirmClearAll(false);
      setShowHistoryModal(true);
    };
    const handleHistoryUpdated = () => {
      loadStoredData();
    };

    window.addEventListener("omnigrab:open-settings", handleOpenSettings);
    window.addEventListener("omnigrab:open-history", handleOpenHistory);
    window.addEventListener("omnigrab:history-updated", handleHistoryUpdated);

    return () => {
      window.removeEventListener("omnigrab:open-settings", handleOpenSettings);
      window.removeEventListener("omnigrab:open-history", handleOpenHistory);
      window.removeEventListener("omnigrab:history-updated", handleHistoryUpdated);
    };
  }, []);

  // 2. Quick-Return Scroll Listener (15px upward threshold)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let upwardDelta = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY;

      if (currentY < 60) {
        setHeaderHidden(false);
        upwardDelta = 0;
      } else if (diff > 6) {
        setHeaderHidden(true);
        upwardDelta = 0;
      } else if (diff < 0) {
        upwardDelta += Math.abs(diff);
        if (upwardDelta >= 15) {
          setHeaderHidden(false);
        }
      }
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Save Settings Handler
  const handleSaveSettings = () => {
    try {
      localStorage.setItem("instagrab_session_id", sessionId.trim());
      localStorage.setItem("instagrab_cobalt_instance", cobaltInstance.trim());
      window.dispatchEvent(new CustomEvent("omnigrab:settings-updated"));
    } catch {}
    setSettingsSavedToast(true);
    setTimeout(() => {
      setSettingsSavedToast(false);
      setShowSettingsModal(false);
    }, 900);
  };

  // Single History Item Delete (With Undo Snackbar — Master Prompt v11)
  const handleDeleteSingleItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const target = history[index];
    if (!target) return;

    const updated = history.filter((_, idx) => idx !== index);
    setHistory(updated);
    setDeletedBackup({ item: target, index });

    try {
      localStorage.setItem("instagrab_history", JSON.stringify(updated));
    } catch {}
  };

  // Undo Single Delete
  const handleUndoDelete = () => {
    if (!deletedBackup) return;
    const restored = [...history];
    restored.splice(deletedBackup.index, 0, deletedBackup.item);
    setHistory(restored);
    setDeletedBackup(null);
    try {
      localStorage.setItem("instagrab_history", JSON.stringify(restored));
    } catch {}
  };

  // Two-Step Destructive Clear All History (Isolated at Bottom of Modal)
  const handleClearAllHistory = () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true);
      return;
    }
    setHistory([]);
    setConfirmClearAll(false);
    setDeletedBackup(null);
    try {
      localStorage.removeItem("instagrab_history");
    } catch {}
  };

  // Trigger Re-Grab from History
  const handleSelectHistoryItem = (item: GrabHistoryItem) => {
    setShowHistoryModal(false);
    window.dispatchEvent(
      new CustomEvent("omnigrab:grab-url", { detail: { url: item.url } })
    );
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 80,
          height: 68,
          background: "rgba(10, 13, 24, 0.85)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          transform: headerHidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "transform",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            height: "100%",
          }}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <OmniGrabLogo />
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 19,
                  letterSpacing: "-0.03em",
                  color: "#F8FAFC",
                }}
              >
                Omni
                <span
                  style={{
                    background: "linear-gradient(135deg, #00F5D4 0%, #6366F1 55%, #A855F7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Grab
                </span>
              </span>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#94A3B8",
                }}
              >
                Super App · 94 Tools
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="nav-desktop"
            aria-label="Primary Navigation"
            style={{ display: "flex", gap: 18, margin: "0 auto" }}
          >
            {LINKS.map((l) => {
              const isActive = path === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    textDecoration: "none",
                    fontSize: 13.5,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#00F5D4" : "#CBD5E1",
                    padding: "6px 8px",
                    borderRadius: 8,
                    transition: "color 150ms ease, background 150ms ease",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar (44-48dp Touch Targets) */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <InstallAppButton />
            <StreakBadge />

            <button
              type="button"
              onClick={() => {
                loadStoredData();
                setConfirmClearAll(false);
                setShowHistoryModal(true);
              }}
              aria-label="Download history"
              title="Recent Grabs History"
              style={{
                position: "relative",
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#F8FAFC",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <History size={18} />
              {history.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "linear-gradient(135deg, #00F5D4, #6366F1)",
                    color: "#050811",
                    fontSize: 10,
                    fontWeight: 800,
                    borderRadius: 999,
                    padding: "1px 5px",
                    lineHeight: 1.2,
                  }}
                >
                  {history.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                loadStoredData();
                setShowSettingsModal(true);
              }}
              aria-label="Extractor settings"
              title="Session ID & Cobalt Settings"
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#F8FAFC",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Settings size={18} />
            </button>

            <LanguagePicker />
            <ThemeToggle />

            <button
              type="button"
              className="nav-burger"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#F8FAFC",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        <style jsx>{`
          .nav-burger {
            display: none;
          }
          @media (max-width: 1023px) {
            .nav-desktop {
              display: none !important;
            }
            .nav-burger {
              display: inline-flex !important;
            }
          }
        `}</style>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(4, 6, 14, 0.72)",
            backdropFilter: "blur(8px)",
            zIndex: 120,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 310,
              maxWidth: "85vw",
              background: "#0D1120",
              borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <span style={{ fontWeight: 800, fontSize: 16, color: "#F8FAFC" }}>
                ⚡ Quick Navigation
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "none",
                  color: "#F8FAFC",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  padding: "13px 10px",
                  borderRadius: 10,
                  borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: path === l.href ? "#00F5D4" : "#E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{l.label}</span>
                <ExternalLink size={14} style={{ opacity: 0.5 }} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Settings Modal (Session ID & Cobalt Instance — from instagrab-main) */}
      {showSettingsModal && (
        <div
          onClick={() => setShowSettingsModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(3, 5, 12, 0.78)",
            backdropFilter: "blur(10px)",
            zIndex: 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#101426",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              width: "100%",
              maxWidth: 480,
              padding: 24,
              color: "#F8FAFC",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.65)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: 0,
                }}
              >
                <Settings size={20} color="#00F5D4" />
                <span>OmniGrab Engine Settings</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                aria-label="Close settings"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: 6,
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13.5,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#E2E8F0",
                }}
              >
                Instagram Session ID (Optional)
              </label>
              <input
                type="password"
                placeholder="e.g. 54321%3ABcD1234..."
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                style={{
                  width: "100%",
                  height: 46,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: 10,
                  padding: "0 14px",
                  color: "#F8FAFC",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: "#94A3B8",
                  marginTop: 6,
                  lineHeight: 1.45,
                }}
              >
                <ShieldCheck
                  size={13}
                  color="#00F5D4"
                  style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }}
                />
                Saved strictly in your browser. Lets you grab stories/posts from accounts you follow and bypasses public rate-limits.
              </p>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13.5,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "#E2E8F0",
                }}
              >
                Custom Cobalt Instance URL (Optional)
              </label>
              <input
                type="url"
                placeholder="e.g. https://cobalt.yourdomain.com"
                value={cobaltInstance}
                onChange={(e) => setCobaltInstance(e.target.value)}
                style={{
                  width: "100%",
                  height: 46,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: 10,
                  padding: "0 14px",
                  color: "#F8FAFC",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: "#94A3B8",
                  marginTop: 6,
                  lineHeight: 1.45,
                }}
              >
                Add a self-hosted Cobalt endpoint as an extra multi-platform fallback resolver.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveSettings}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #00F5D4 0%, #6366F1 55%, #A855F7 100%)",
                color: "#040711",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Sparkles size={16} />
              <span>{settingsSavedToast ? "Saved! ✓" : "Save Preferences"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Recent Grabs History Modal (With Undo Snackbar & Isolated 2-Step Clear All) */}
      {showHistoryModal && (
        <div
          onClick={() => setShowHistoryModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(3, 5, 12, 0.78)",
            backdropFilter: "blur(10px)",
            zIndex: 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#101426",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 20,
              width: "100%",
              maxWidth: 520,
              maxHeight: "86vh",
              padding: 22,
              color: "#F8FAFC",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.65)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 10,
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: 0,
                }}
              >
                <History size={20} color="#00F5D4" />
                <span>Recent Grabs ({history.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                aria-label="Close history"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  padding: 6,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Undo Snackbar inside Modal when a single item is deleted */}
            {deletedBackup && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "rgba(99, 102, 241, 0.18)",
                  border: "1px solid rgba(99, 102, 241, 0.45)",
                  fontSize: 13,
                }}
              >
                <span>Removed @{deletedBackup.item.author || "item"} from history</span>
                <button
                  type="button"
                  onClick={handleUndoDelete}
                  style={{
                    background: "#00F5D4",
                    color: "#040711",
                    border: "none",
                    borderRadius: 8,
                    padding: "5px 10px",
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <RotateCcw size={13} />
                  <span>UNDO</span>
                </button>
              </div>
            )}

            {history.length === 0 ? (
              <p
                style={{
                  color: "#94A3B8",
                  textAlign: "center",
                  padding: "28px 12px",
                  fontSize: 14,
                }}
              >
                No recent grabs yet. Paste any Instagram, Facebook, Pinterest or X link in the box to start!
              </p>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {history.map((item, idx) => (
                    <div
                      key={`${item.id}-${item.timestamp}-${idx}`}
                      onClick={() => handleSelectHistoryItem(item)}
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: 14,
                        padding: "10px 12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt=""
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 9,
                              objectFit: "cover",
                              background: "#181E36",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 9,
                              background: "linear-gradient(135deg, #6366F1, #00F5D4)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: 12,
                              color: "#050811",
                              flexShrink: 0,
                            }}
                          >
                            {item.platform === "facebook" ? "FB" : "IG"}
                          </div>
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: "#F8FAFC",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            @{item.author || "media_post"}
                          </div>
                          <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
                            {(item.platform || "instagram").toUpperCase()} •{" "}
                            {item.type || "media"} •{" "}
                            {new Date(item.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          type="button"
                          aria-label="Reload link"
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 9,
                            background: "rgba(0, 245, 212, 0.12)",
                            border: "1px solid rgba(0, 245, 212, 0.3)",
                            color: "#00F5D4",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Download size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSingleItem(idx, e)}
                          aria-label="Remove item"
                          title="Remove item (Undo available)"
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 9,
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.25)",
                            color: "#F87171",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Isolated Danger Zone at Bottom of History Modal (Master Prompt v11 Rule) */}
                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 11.5, color: "#64748B" }}>
                    Stored locally on your device
                  </span>
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    style={{
                      minHeight: 40,
                      padding: "0 14px",
                      borderRadius: 10,
                      border: "1px solid rgba(239, 68, 68, 0.45)",
                      background: confirmClearAll ? "#EF4444" : "transparent",
                      color: confirmClearAll ? "#FFFFFF" : "#F87171",
                      fontSize: 12.5,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {confirmClearAll
                      ? "⚠️ Tap Again to Confirm Clear All"
                      : "🗑️ Clear All History"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
