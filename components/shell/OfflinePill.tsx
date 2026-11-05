"use client";
import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/** Calm offline indicator (PRD §22.2, PU-4): info tone, icon + text, auto-dismiss 3 s after reconnect. */
export default function OfflinePill() {
  const { t } = useI18n();
  const [state, setState] = useState<"online" | "offline" | "back">("online");
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const off = () => { if (timer) clearTimeout(timer); setState("offline"); };
    const on = () => { setState("back"); timer = setTimeout(() => setState("online"), 3000); };
    if (!navigator.onLine) setState("offline");
    window.addEventListener("offline", off);
    window.addEventListener("online", on);
    return () => { window.removeEventListener("offline", off); window.removeEventListener("online", on); if (timer) clearTimeout(timer); };
  }, []);
  if (state === "online") return null;
  return (
    <div className="offline-pill" role="status" data-state={state}>
      {state === "offline" ? <WifiOff size={16} strokeWidth={2} aria-hidden="true" /> : <Wifi size={16} strokeWidth={2} aria-hidden="true" />}
      {state === "offline" ? t("offline.pill") : t("offline.back")}
    </div>
  );
}
