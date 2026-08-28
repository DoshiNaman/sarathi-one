import "server-only";
import { resolveModel, DEFAULT_MODEL } from "./models";

/**
 * OpenRouter caller. Every AI feature degrades to a deterministic fallback when
 * no key is configured or the call fails, so a reviewer can walk the whole
 * journey without a key and the demo can never hang on a third-party outage.
 *
 * Only synthetic vehicle facts are ever sent — there is no real personal data
 * in this app to leak.
 */
const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const TIMEOUT_MS = 20000;

export const aiConfigured = () => Boolean(process.env.OPENROUTER_API_KEY);

export type AiResult = { text: string; source: "ai" | "fallback"; model?: string };

export async function ask(
  system: string,
  user: string,
  fallback: string,
  requestedModel?: string
): Promise<AiResult> {
  if (!aiConfigured()) return { text: fallback, source: "fallback" };

  // Clamped again here: callers parse at the boundary, but this is the last line
  // of defence before the request actually spends account credit.
  const model = resolveModel(requestedModel ?? DEFAULT_MODEL);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // OpenRouter attribution headers.
        "HTTP-Referer": "https://sarathi-one-pink.vercel.app",
        "X-Title": "Sarathi One",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        // Several of the allowlisted free models are reasoning models: they spend
        // tokens on an internal `reasoning` field and return empty `content` if
        // they run out before answering. Hence the generous ceiling — free models
        // cost nothing per token, and a truncated answer is worse than a slow one.
        max_tokens: 2000,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return { text: fallback, source: "fallback", model };
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text ? { text, source: "ai", model } : { text: fallback, source: "fallback", model };
  } catch {
    // Timeout, network error, malformed response — the citizen still gets an answer.
    return { text: fallback, source: "fallback", model };
  }
}
