/**
 * Temporary bans (PRD §21.5). A ban is `{ subject, rule, appliedAt, expiresAt }` with a TTL;
 * rules count recent signals of one type for the same ipHash.
 */
import { getJson, setJson } from "./store";
import type { Signal, SignalType } from "./behavior";

export type Ban = { subject: string; rule: string; appliedAt: number; expiresAt: number };
const H = 3_600_000;
export const BAN_RULES: { type: SignalType; count: number; windowMs: number; banMs: number }[] = [
  { type: "HONEYPOT_TRIP", count: 1, windowMs: 3_600_000, banMs: 24 * H },
  { type: "SSRF_ATTEMPT", count: 3, windowMs: 300_000, banMs: 24 * H },
  { type: "PROMPT_INJECTION_ATTEMPT", count: 3, windowMs: 3_600_000, banMs: 24 * H },
  { type: "ORIGIN_VIOLATION", count: 20, windowMs: 60_000, banMs: H },
  { type: "VALIDATION_FAIL", count: 50, windowMs: 60_000, banMs: H },
  { type: "RATE_LIMITED", count: 10, windowMs: 600_000, banMs: H },
];

/** Which rule (if any) the recent signals trip. Pure — unit-tested. */
export function trippedRule(signals: Signal[], now = Date.now()) {
  return BAN_RULES.find((r) => signals.filter((s) => s.type === r.type && now - s.ts < r.windowMs).length >= r.count) ?? null;
}

export async function activeBan(ipHash: string, now = Date.now()): Promise<Ban | null> {
  const b = await getJson<Ban>(`ban:${ipHash}`);
  return b && b.expiresAt > now ? b : null;
}
export async function applyBanIfNeeded(ipHash: string, signals: Signal[], now = Date.now()): Promise<Ban | null> {
  const rule = trippedRule(signals, now);
  if (!rule) return null;
  const ban: Ban = { subject: ipHash, rule: rule.type, appliedAt: now, expiresAt: now + rule.banMs };
  await setJson(`ban:${ipHash}`, ban, rule.banMs);
  return ban;
}
export function retryAfterSec(ban: Ban, now = Date.now()): number {
  return Math.max(1, Math.ceil((ban.expiresAt - now) / 1000));
}
