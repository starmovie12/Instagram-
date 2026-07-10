"use client";
/** Adsterra Direct Link (smartlink) — monetized on visit. */
export const SPONSOR_LINK =
  "https://www.effectivecpmnetwork.com/wxc58rst1?key=b90fe8519d8dd14b1ab45e96c7d99e1e";

const ONCE_KEY = "ig.sponsorDay";

/**
 * Open the sponsor link in a new tab AT MOST once per day per device, and only
 * from inside a real click handler (so it isn't popup-blocked and never
 * interrupts more than once). The user's actual download proceeds normally in
 * the current tab. Revenue without hijacking the experience.
 */
export function openSponsorOnce() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(ONCE_KEY) === today) return;
    localStorage.setItem(ONCE_KEY, today);
    window.open(SPONSOR_LINK, "_blank", "noopener,noreferrer");
  } catch {
    /* storage/popup unavailable — skip silently */
  }
}
