/**
 * Structured API log line (PRD §21.1 step 10). Never includes URLs, bodies, Session IDs or IPs.
 */
export type LogLine = { route: string; status: number; durationMs: number; correlationId: string; outcome?: string };
export function logApi(line: LogLine) {
  const level = line.status >= 500 ? "error" : line.status >= 400 ? "warn" : "info";
  const out = JSON.stringify({ level, ...line });
  if (level === "error") console.error(out); else if (level === "warn") console.warn(out); else console.log(out);
}
export function newTraceId(): string {
  const b = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
