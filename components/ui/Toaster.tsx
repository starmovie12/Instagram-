"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { onToast, type ToastItem } from "@/lib/toast";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/feedback";

/** Single live region for toasts / Undo snackbar (PRD M12): 4 s, 6 s with an action. */
export default function Toaster() {
  const { t } = useI18n();
  const [item, setItem] = useState<ToastItem | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => onToast((next) => {
    if (timer.current) clearTimeout(timer.current);
    setItem(next);
    if (next) timer.current = setTimeout(() => setItem(null), next.duration ?? (next.action ? 6000 : 4000));
  }), []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return (
    <div className="toaster" aria-live="polite" aria-atomic="true">
      {item && (
        <div className="toast" data-tone={item.tone ?? "neutral"} key={item.id}>
          <span className="toast__msg">{item.message}</span>
          {item.action && (
            <button type="button" className="toast__action" onClick={() => { haptic("Light"); item.action?.run(); setItem(null); }}>
              {item.action.label}
            </button>
          )}
          <button type="button" className="toast__close icon-btn" onClick={() => setItem(null)} aria-label={t("toast.dismiss")}>
            <X size={20} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
