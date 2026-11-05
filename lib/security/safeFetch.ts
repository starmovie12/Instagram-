/**
 * Outbound fetch for user-supplied links (PRD §21.1 step 8). SERVER (Node) ONLY.
 * Every hop — including redirects, followed manually, max 3 — must be https, carry no
 * credentials or custom port, pass the caller's host allowlist and resolve to public IPs.
 * Bodies are read with a byte cap so a huge page can't exhaust memory.
 */
import net from "node:net";
import { isPrivateIp } from "../safe-url";

export class SafeFetchError extends Error {
  constructor(public reason: "SSRF" | "REDIRECTS" | "TOO_LARGE") { super(reason); }
}

async function hopIsSafe(u: URL, allow: (u: URL) => boolean): Promise<boolean> {
  if (u.protocol !== "https:" || u.username || u.password || (u.port && u.port !== "443")) return false;
  const host = u.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) return false;
  if (net.isIP(host)) return false; // IP literals are never a platform host
  if (!allow(u)) return false;
  try {
    const { lookup } = await import("node:dns/promises");
    const addrs = await lookup(host, { all: true });
    return addrs.length > 0 && !addrs.some((a) => isPrivateIp(a.address));
  } catch {
    return false;
  }
}

export async function safeFetch(
  url: string,
  init: RequestInit,
  opts: { allow: (u: URL) => boolean; maxRedirects?: number; timeoutMs?: number },
): Promise<Response> {
  const max = opts.maxRedirects ?? 3;
  let current = new URL(url);
  for (let hop = 0; hop <= max; hop++) {
    if (!(await hopIsSafe(current, opts.allow))) throw new SafeFetchError("SSRF");
    const res = await fetch(current.toString(), { ...init, redirect: "manual", signal: AbortSignal.timeout(opts.timeoutMs ?? 8000) });
    const loc = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
    if (!loc) return res;
    current = new URL(loc, current);
  }
  throw new SafeFetchError("REDIRECTS");
}

/** Read a response body as text, stopping at `maxBytes` (default 2 MB). */
export async function readTextCapped(res: Response, maxBytes = 2 * 1024 * 1024): Promise<string> {
  if (!res.body) return "";
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) { chunks.push(value.slice(0, value.byteLength - (total - maxBytes))); await reader.cancel(); break; }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
