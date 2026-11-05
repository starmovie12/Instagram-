"use client";
/**
 * Downloader error state (PRD §10.8, §25.3, brief Phase 3 "ONE next action").
 * Calm card (never a red banner, never alert()): icon, title, one-line reason and exactly one
 * action. PRIVATE never suggests a Session ID — only public content downloads (§1.4).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Link2Off, Timer, CircleDashed, ServerCrash, WifiOff, ShieldAlert, SearchX, RefreshCw, ClipboardPaste, UserRound, Mail } from "lucide-react";
import { useI18n, type I18nKey } from "@/lib/i18n";
import type { ErrorCode } from "@/lib/api";

export type { ErrorCode };

type Action = "paste" | "retry" | "profile" | "contact" | "none";
const META: Record<ErrorCode, { Icon: typeof Lock; t: I18nKey; b: I18nKey; action: Action }> = {
  PRIVATE: { Icon: Lock, t: "err.private.t", b: "err.private.b", action: "paste" },
  INVALID_URL: { Icon: Link2Off, t: "err.invalid.t", b: "err.invalid.b", action: "paste" },
  NOT_FOUND: { Icon: SearchX, t: "err.notfound.t", b: "err.notfound.b", action: "paste" },
  STORY_EXPIRED: { Icon: CircleDashed, t: "err.story.t", b: "err.story.b", action: "paste" },
  RATE_LIMITED: { Icon: Timer, t: "err.rate.t", b: "err.rate.b", action: "retry" },
  EXTRACTOR_DOWN: { Icon: ServerCrash, t: "err.down.t", b: "err.down.b", action: "retry" },
  OFFLINE: { Icon: WifiOff, t: "err.offline.t", b: "ws.offline", action: "retry" },
  BANNED: { Icon: ShieldAlert, t: "err.banned.t", b: "err.banned.b", action: "contact" },
};

export default function ErrorCard({
  code, app = "Instagram", retryAfter, username, onRetry, onPaste, onProfile,
}: {
  code: ErrorCode;
  /** Platform display name for "{app} didn't answer". */
  app?: string;
  /** Seconds before a retry makes sense (RATE_LIMITED; from `Retry-After`). */
  retryAfter?: number;
  /** STORY_EXPIRED: the public profile is still reachable → offer it instead of a dead end. */
  username?: string;
  onRetry?: () => void;
  onPaste?: () => void;
  onProfile?: (username: string) => void;
}) {
  const { t } = useI18n();
  const m = META[code] ?? META.EXTRACTOR_DOWN;
  const wait = code === "RATE_LIMITED" ? Math.max(1, Math.min(retryAfter ?? 30, 3_600)) : 0;
  const [left, setLeft] = useState(wait);

  useEffect(() => {
    setLeft(wait);
    if (!wait) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [wait, code]);

  let action: Action = m.action;
  if (code === "STORY_EXPIRED" && username && onProfile) action = "profile";
  if (action === "paste" && !onPaste) action = "none";
  if (action === "retry" && !onRetry) action = "none";
  const hours = code === "BANNED" ? Math.max(1, Math.round((retryAfter ?? 86_400) / 3_600)) : 0;

  return (
    <div className="ec" role="alert" data-code={code}>
      <span className="ec__icon" aria-hidden="true"><m.Icon size={24} strokeWidth={1.75} /></span>
      <div className="ec__body">
        <p className="ec__title">{t(m.t, { app })}</p>
        <p className="ec__text">{t(m.b, { app, h: hours })}</p>
        {action === "paste" && (
          <button type="button" className="ec__btn" onClick={onPaste}>
            <ClipboardPaste size={18} strokeWidth={2} aria-hidden="true" /> {t("err.pasteAnother")}
          </button>
        )}
        {action === "profile" && username && (
          <button type="button" className="ec__btn" onClick={() => onProfile?.(username)}>
            <UserRound size={18} strokeWidth={2} aria-hidden="true" /> {t("err.viewProfile", { user: username })}
          </button>
        )}
        {action === "retry" && (
          <button type="button" className="ec__btn" onClick={onRetry} disabled={left > 0} aria-disabled={left > 0}>
            <RefreshCw size={18} strokeWidth={2} aria-hidden="true" />
            <span className="ec__count">{left > 0 ? t("err.retryIn", { s: left }) : t("err.retry")}</span>
          </button>
        )}
        {action === "contact" && (
          <Link href="/contact" className="ec__btn">
            <Mail size={18} strokeWidth={2} aria-hidden="true" /> {t("err.contact")}
          </Link>
        )}
      </div>
    </div>
  );
}
