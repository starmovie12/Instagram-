"use client";
/**
 * First-visit tour (PRD §17.3, I7): 3 steps, Home only, once. Uses the shared BottomSheet
 * (native <dialog>: focus trap, Esc, swipe-down, focus return) — no extra blurred surface.
 * Never opens while the user is already typing or another dialog is open.
 */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link2, Download, ShieldCheck } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { lsGet, lsSet } from "@/lib/storage";

const KEY = "ig.tourDone";
const STEPS: { Icon: typeof Link2; t: I18nKey; b: I18nKey }[] = [
  { Icon: Link2, t: "tour.s1t", b: "tour.s1b" },
  { Icon: Download, t: "tour.s2t", b: "tour.s2b" },
  { Icon: ShieldCheck, t: "tour.s3t", b: "tour.s3b" },
];

export default function OnboardingTour() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (pathname !== "/" || lsGet(KEY)) return;
    const id = setTimeout(() => {
      const busy = document.activeElement instanceof HTMLInputElement || document.querySelector("dialog[open]");
      if (!busy) setStep(0);
    }, 1200);
    return () => clearTimeout(id);
  }, [pathname]);

  function finish() {
    lsSet(KEY, "1");
    setStep(-1);
  }

  const open = step >= 0 && pathname === "/";
  const s = STEPS[Math.max(0, step)];
  const last = step === STEPS.length - 1;
  return (
    <BottomSheet open={open} onClose={finish} title={t(s.t)} id="tour">
      <div className="tour">
        <span className="tour__icon" aria-hidden="true"><s.Icon size={28} strokeWidth={1.75} /></span>
        <p className="tour__body">{t(s.b)}</p>
        <p className="tour__step">{t("tour.step", { n: step + 1, total: STEPS.length })}</p>
        <div className="tour__dots" aria-hidden="true">{STEPS.map((_, i) => <span key={i} data-on={i === step ? "true" : "false"} />)}</div>
        <div className="tour__acts">
          <button type="button" className="tour__skip" onClick={finish}>{t("tour.skip")}</button>
          <button type="button" className="tour__next" data-autofocus onClick={() => (last ? finish() : setStep(step + 1))}>{last ? t("tour.done") : t("tour.next")}</button>
        </div>
      </div>
    </BottomSheet>
  );
}
