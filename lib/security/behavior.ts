/**
 * Behaviour score + tarpit bands (PRD §21.4). Signals live 1 h per ipHash (`bh:{ipHash}`);
 * score = min(Σ weights / 5, 1). Only /api/* and honeypots ever get delayed.
 */
import { pushList, readList } from "./store";
import { tarpitMaxMs } from "../env";

export const SIGNAL_WEIGHTS = {
  VALIDATION_FAIL: 0.05,
  RATE_LIMITED: 0.15,
  ORIGIN_VIOLATION: 0.2,
  RAPID_REQUEST_CADENCE: 0.4,
  SSRF_ATTEMPT: 0.8,
  PROMPT_INJECTION_ATTEMPT: 0.9,
  HONEYPOT_TRIP: 1.0,
} as const;
export type SignalType = keyof typeof SIGNAL_WEIGHTS;
export type Signal = { type: SignalType; weight: number; ts: number };
export const SIGNAL_TTL_MS = 3_600_000;

export async function recordSignal(ipHash: string, type: SignalType, now = Date.now()): Promise<void> {
  await pushList(`bh:${ipHash}`, { type, weight: SIGNAL_WEIGHTS[type], ts: now } satisfies Signal, SIGNAL_TTL_MS);
}
export async function signalsOf(ipHash: string): Promise<Signal[]> {
  return readList<Signal>(`bh:${ipHash}`);
}
export function scoreOf(signals: Signal[], now = Date.now()): number {
  const sum = signals.filter((s) => now - s.ts < SIGNAL_TTL_MS).reduce((a, s) => a + (s.weight || 0), 0);
  return Math.min(sum / 5, 1);
}

/** Tarpit delay for a score: 0–.3 → 0 · .3–.6 → 500–1500 · .6–.9 → 1500–4000 · .9–1 → 4000–8000 (capped by env). */
export function tarpitDelayMs(score: number, rnd: () => number = Math.random): number {
  const band = (lo: number, hi: number) => Math.round(lo + (hi - lo) * rnd());
  let ms = 0;
  if (score >= 0.9) ms = band(4000, 8000);
  else if (score >= 0.6) ms = band(1500, 4000);
  else if (score >= 0.3) ms = band(500, 1500);
  return Math.min(ms, tarpitMaxMs());
}

/* RAPID_REQUEST_CADENCE: 10 consecutive gaps < 200 ms (per instance, memory only). */
const cadence = new Map<string, number[]>();
export function rapidCadence(ipHash: string, now = Date.now()): boolean {
  const list = [...(cadence.get(ipHash) ?? []), now].slice(-11);
  if (cadence.size > 20_000) cadence.clear();
  cadence.set(ipHash, list);
  if (list.length < 11) return false;
  for (let i = 1; i < list.length; i++) if (list[i] - list[i - 1] >= 200) return false;
  cadence.set(ipHash, []);
  return true;
}
