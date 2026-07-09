"use client";
import { useEffect, useRef } from "react";

/** Ad Frame (§9.11) — every ad lives inside a labeled hairline frame with reserved height (CLS 0).
 *  Wired to the Adsterra/Monetag native banner script. The vendor script is
 *  tied to one fixed container id, so only the FIRST AdFrame mounted on a
 *  page actually requests and renders the ad; any later AdFrame instances on
 *  the same page render an empty (but still reserved-height) frame instead
 *  of fighting over the same container id. Pass children to drop in a
 *  different ad unit for a specific slot instead. */

const SCRIPT_SRC =
  "https://pl30279601.effectivecpmnetwork.com/30358b5312940856cb4704246525fc2d/invoke.js";
const CONTAINER_ID = "container-30358b5312940856cb4704246525fc2d";

let claimed = false; // which AdFrame instance (if any) owns CONTAINER_ID this page load

export default function AdFrame({ slotH = 110, children }: { slotH?: number; children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const ownsSlotRef = useRef(false);

  useEffect(() => {
    if (children || claimed) return; // caller supplied their own unit, or another AdFrame already claimed the ad
    claimed = true;
    ownsSlotRef.current = true;

    if (!document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.cfasync = "false";
      script.src = SCRIPT_SRC;
      document.body.appendChild(script);
    }

    return () => {
      // Free the claim on unmount so client-side navigation to another page
      // with an AdFrame can request a fresh ad.
      if (ownsSlotRef.current) claimed = false;
    };
  }, [children]);

  return (
    <div className="ad-frame" style={{ ["--slot-h" as string]: `${slotH}px` }}>
      {children ?? <div ref={ref} id={CONTAINER_ID} style={{ minHeight: slotH }} />}
    </div>
  );
}
