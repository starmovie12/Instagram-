/**
 * Pseudonymous client subject (PRD §21.2, §21.4). Raw IPs never leave this module:
 * ipHash = HMAC-SHA256(ip, IP_HASH_SECRET) → first 16 hex chars. Edge- and Node-safe (Web Crypto).
 * Without IP_HASH_SECRET a random per-instance key is used (hashes then differ per instance).
 */
import { env } from "../env";

const enc = new TextEncoder();
let keyPromise: Promise<CryptoKey> | null = null;
let keySource = "";

function fallbackSecret(): string {
  const g = globalThis as typeof globalThis & { __igHashSecret?: string };
  if (!g.__igHashSecret) {
    const b = crypto.getRandomValues(new Uint8Array(32));
    g.__igHashSecret = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  }
  return g.__igHashSecret;
}
function hmacKey(): Promise<CryptoKey> {
  const secret = env().IP_HASH_SECRET ?? fallbackSecret();
  if (!keyPromise || keySource !== secret) {
    keySource = secret;
    keyPromise = crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  }
  return keyPromise;
}
export async function hash16(value: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(value));
  return Array.from(new Uint8Array(sig).slice(0, 8), (x) => x.toString(16).padStart(2, "0")).join("");
}

/** Client IP as Vercel reports it (x-real-ip / first x-forwarded-for hop). */
export function clientIp(h: Headers): string {
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

const NON_BROWSER = /curl|wget|python|httpclient|go-http|java\/|okhttp|axios|node-fetch|undici|scrapy|libwww|httpie|postman|insomnia|headless/i;
/** True for scripts / CLIs (no browser UA) — they get the stricter "non-browser" budget. */
export function isNonBrowser(ua: string | null): boolean {
  return !ua || !/Mozilla\/5\.0/.test(ua) || NON_BROWSER.test(ua);
}

export type Subject = { ipHash: string; key: string; nonBrowser: boolean };
export async function subjectOf(h: Headers): Promise<Subject> {
  const ua = h.get("user-agent");
  const [ipHash, uaHash] = await Promise.all([hash16(clientIp(h)), hash16("ua:" + (ua ?? ""))]);
  return { ipHash, key: `${ipHash}:${uaHash.slice(0, 8)}`, nonBrowser: isNonBrowser(ua) };
}
