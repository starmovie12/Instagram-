"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { haptic } from "@/lib/feedback";

type Props = { open: boolean; onClose: () => void; title: string; children: React.ReactNode; id?: string };

/**
 * Bottom sheet on phones (≤ 599 px), centred dialog on larger screens (PRD §14.7, §24, AC-75).
 * Native modal <dialog> → focus trap + Esc for free; focus returns to the trigger on close.
 * Dismiss: swipe-down > 80 px on the handle/header, the 48×48 Close button (WCAG 2.5.7
 * single-pointer alternative), Esc, or a scrim tap.
 */
export default function BottomSheet({ open, onClose, title, children, id }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<Element | null>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      trigger.current = document.activeElement;
      d.showModal();
      d.dataset.state = "open";
      haptic("Light");
    } else if (!open && d.open) {
      d.dataset.state = "closing";
      const done = () => { d.close(); d.dataset.state = ""; (trigger.current as HTMLElement | null)?.focus?.(); };
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) done(); else setTimeout(done, 200);
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    const onClick = (e: MouseEvent) => { if (e.target === d) onClose(); }; // scrim
    d.addEventListener("cancel", onCancel);
    d.addEventListener("click", onClick);
    return () => { d.removeEventListener("cancel", onCancel); d.removeEventListener("click", onClick); };
  }, [onClose]);

  const onPointerDown = (e: React.PointerEvent) => { drag.current = { y: e.clientY, dy: 0 }; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !ref.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    ref.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onPointerUp = () => {
    if (!drag.current || !ref.current) return;
    const far = drag.current.dy > 80;
    ref.current.style.transform = "";
    drag.current = null;
    if (far) { haptic("Rigid"); onClose(); }
  };

  return (
    <dialog ref={ref} className="sheet" aria-labelledby={id ? `${id}-title` : undefined} aria-label={id ? undefined : title}>
      <div className="sheet__grab" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
        <span className="sheet__handle" aria-hidden="true" />
        <div className="sheet__head">
          <h2 className="sheet__title" id={id ? `${id}-title` : undefined}>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t("sheet.close")}>
            <X size={24} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="sheet__body">{open ? children : null}</div>
    </dialog>
  );
}
