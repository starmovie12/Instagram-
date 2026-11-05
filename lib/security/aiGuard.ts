/**
 * Prompt-injection hygiene for AI routes (PRD §21.7). User text is length-capped, stripped of
 * markup and chat-template control tokens, and wrapped in <user_input> so the model treats it as data.
 * Detected injection phrasing raises a PROMPT_INJECTION_ATTEMPT signal (3 in 1 h → 24 h ban).
 */
export const MAX_USER_INPUT_CHARS = 5_000;
const CONTROL = /<\|[^|>]{1,40}\|>|\[\/?INST\]|<<\/?SYS>>|^#{3,}\s*/gim;
const INJECTION = /(ignore|disregard|forget)\s+(all\s+|any\s+)?(the\s+)?(previous|prior|above|earlier)\s+(instructions|prompts?|rules)|you\s+are\s+now\s+(?:a|an|in)\b|system\s+prompt|reveal\s+(your|the)\s+(prompt|instructions)/i;

export function sanitizeUserInput(raw: string, max = MAX_USER_INPUT_CHARS): { text: string; injection: boolean } {
  const s = String(raw ?? "").slice(0, max);
  const injection = INJECTION.test(s) || /<\|im_start\|>|\[INST\]/i.test(s);
  const text = s
    .replace(/<\/?[a-z][^>]{0,200}>/gi, "")   // HTML / XML-ish tags (incl. a forged </user_input>)
    .replace(CONTROL, "")
    .replace(INJECTION, "[removed]")
    .trim();
  return { text, injection };
}
/** Wrap sanitized text for a prompt. */
export function asUserInput(text: string): string {
  return `<user_input>\n${text}\n</user_input>`;
}
