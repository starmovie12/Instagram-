import { NextRequest, NextResponse } from "next/server";
import { withGuard, type GuardContext } from "@/lib/security/guard";
import { AI_PROMPTS, LANG_AWARE, INPUT_GUARD, callGemini, AiError, type AiLanguage } from "@/lib/ai";
import { sanitizeUserInput } from "@/lib/security/aiGuard";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LANGS: AiLanguage[] = ["english", "hinglish", "hindi"];

async function handlePOST(req: NextRequest, ctx: GuardContext) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  // AI calls burn the free Gemini quota — keep the per-IP ceiling low.
  if (isRateLimited("ai:" + ip, 8)) {
    return NextResponse.json(
      { error: "Whoa, that's a lot of AI — wait a minute and try again." },
      { status: 429 }
    );
  }

  let tool = "";
  let inputs: Record<string, string> = {};
  let language: AiLanguage = "english";
  try {
    const body = await req.json();
    tool = String(body?.tool ?? "");
    language = LANGS.includes(body?.language) ? body.language : "english";
    const raw = body?.inputs ?? {};
    for (const [k, v] of Object.entries(raw).slice(0, 20)) {
      if (typeof v === "string" && k.length <= 30) inputs[k] = v.slice(0, 5000);
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const builder = AI_PROMPTS[tool];
  if (!builder) return NextResponse.json({ error: "Unknown AI tool." }, { status: 400 });
  if (!LANG_AWARE.has(tool)) language = "english";

  // Injection phrasing is stripped by the prompt builders; repeated attempts earn a ban (PRD §21.5).
  if (Object.values(inputs).some((v) => sanitizeUserInput(v).injection)) await ctx.signal("PROMPT_INJECTION_ATTEMPT");

  try {
    const text = await callGemini([{ text: `${INPUT_GUARD}\n\n${builder(inputs, language)}` }]);
    return NextResponse.json({ text });
  } catch (err) {
    if (err instanceof AiError) {
      return NextResponse.json({ error: err.message }, { status: err.code === "NO_KEY" ? 503 : 502 });
    }
    console.error(JSON.stringify({ level: "error", route: "/api/ai", error: (err as Error)?.name ?? "Error" }));
    return NextResponse.json({ error: "Something went wrong — please try again." }, { status: 500 });
  }
}

/* PRD §21.1 perimeter: origin · ban · tarpit · rate limit · headers · structured log */
export const POST = withGuard("/api/ai", { profile: "ai", methods: ["POST"], maxBody: 65536 }, handlePOST);
