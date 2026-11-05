/**
 * Server environment (PRD §22.5). Validated once with Zod; every variable is OPTIONAL with a safe
 * fallback so a missing value never takes the site down. Values are never logged — only the names
 * of invalid variables. Existing variable names are unchanged (brief rule 2).
 */
import { z } from "zod";

const optionalUrl = z.string().url().optional().catch(undefined);
const Schema = z.object({
  NEXT_PUBLIC_APP_URL: optionalUrl,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_BRANCH_URL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  /** HMAC key for IP pseudonymisation (≥ 32 chars, rotate every 90 days). */
  IP_HASH_SECRET: z.string().min(32).optional().catch(undefined),
  /** Upper bound for tarpit delays, clamped to 500–10 000 ms (default 8 000). */
  TARPIT_DELAY_MS_MAX: z.coerce.number().int().min(500).max(10_000).optional().catch(undefined),
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});
export type ServerEnv = z.infer<typeof Schema>;

let cached: ServerEnv | null = null;
export function env(): ServerEnv {
  if (cached) return cached;
  const src = typeof process !== "undefined" ? process.env : {};
  const parsed = Schema.safeParse(src);
  cached = parsed.success ? parsed.data : ({} as ServerEnv);
  return cached;
}
/** Test hook. */
export function resetEnvCache() { cached = null; }

export const TARPIT_DEFAULT_MAX_MS = 8_000;
export function tarpitMaxMs(): number { return env().TARPIT_DELAY_MS_MAX ?? TARPIT_DEFAULT_MAX_MS; }
