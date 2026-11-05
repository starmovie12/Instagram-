/**
 * Rate-limit profiles (PRD §21.2). Double key: per `ipHash:uaHash` and an ipHash aggregate (×6).
 * Clients without a browser UA get the stricter `nonBrowser` budget; requests with neither Origin
 * nor Sec-Fetch-Site get half budget. Counters are per route so one tool cannot starve another.
 */
import { slidingHit } from "./store";

export type ProfileName = "extract" | "og" | "download" | "ai" | "light";
export type Profile = { limit: number; aggregate: number; nonBrowser: number; windowMs: number };
export const PROFILES: Record<ProfileName, Profile> = {
  extract: { limit: 10, aggregate: 60, nonBrowser: 5, windowMs: 60_000 },
  og: { limit: 20, aggregate: 120, nonBrowser: 10, windowMs: 60_000 },
  /* 60 per key (the proxy's existing limit — result previews also stream through it) */
  download: { limit: 60, aggregate: 180, nonBrowser: 15, windowMs: 60_000 },
  /* token bucket in the PRD (10, refill 10/min) ≈ 10 per sliding minute */
  ai: { limit: 10, aggregate: 60, nonBrowser: 5, windowMs: 60_000 },
  light: { limit: 30, aggregate: 180, nonBrowser: 15, windowMs: 60_000 },
};

export type RateResult = { limited: boolean; retryAfter: number };
export async function checkRate(
  route: string, profile: Profile, s: { ipHash: string; key: string; nonBrowser: boolean }, halfBudget: boolean, now = Date.now(),
): Promise<RateResult> {
  const own = s.nonBrowser ? profile.nonBrowser : profile.limit;
  const limit = Math.max(1, halfBudget ? Math.floor(own / 2) : own);
  const [mine, agg] = await Promise.all([
    slidingHit(`rl:${route}:${s.key}`, profile.windowMs, now),
    slidingHit(`rla:${route}:${s.ipHash}`, profile.windowMs, now),
  ]);
  const limited = mine > limit || agg > profile.aggregate;
  const retryAfter = Math.ceil((profile.windowMs - (now % profile.windowMs)) / 1000);
  return { limited, retryAfter: Math.max(1, retryAfter) };
}
