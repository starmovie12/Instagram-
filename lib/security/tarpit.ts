/**
 * Delays with hard concurrency caps (PRD §21.2/§21.4): at most 2 delayed requests per ipHash and
 * 200 per instance. Over the cap the request is answered immediately — a tarpit must never become
 * a way to exhaust our own functions.
 */
const perSubject = new Map<string, number>();
let global = 0;
export const MAX_DELAYED_PER_SUBJECT = 2;
export const MAX_DELAYED_GLOBAL = 200;

export async function tarpit(ipHash: string, ms: number): Promise<boolean> {
  if (ms <= 0) return false;
  const mine = perSubject.get(ipHash) ?? 0;
  if (mine >= MAX_DELAYED_PER_SUBJECT || global >= MAX_DELAYED_GLOBAL) return false;
  perSubject.set(ipHash, mine + 1);
  global++;
  try { await new Promise((r) => setTimeout(r, ms)); }
  finally {
    global--;
    const n = (perSubject.get(ipHash) ?? 1) - 1;
    if (n <= 0) perSubject.delete(ipHash); else perSubject.set(ipHash, n);
  }
  return true;
}
/** Exponential penalty after repeated 429s within 10 min: min(1000·2^(n−1), 15000). */
export function penaltyMs(n: number): number {
  return n <= 0 ? 0 : Math.min(1000 * 2 ** (n - 1), 15_000);
}
