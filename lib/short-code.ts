/**
 * 8 chars from a 31-symbol alphabet (≈ 8.5 × 10¹¹ codes) via rejection sampling — no modulo bias,
 * so codes can't be enumerated (PRD §21.3 /s/ audit). Older 5–6 char codes keep resolving.
 */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
export function randomCode(len = 8): string {
  let out = "";
  while (out.length < len) {
    for (const b of crypto.getRandomValues(new Uint8Array(len * 2))) {
      if (b < 248 && out.length < len) out += ALPHABET[b % 31]; // 248 = 8 × 31 → uniform
    }
  }
  return out;
}
