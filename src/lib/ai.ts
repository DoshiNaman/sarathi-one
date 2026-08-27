import "server-only";

/**
 * Thin OpenAI caller. Every AI feature degrades to a deterministic fallback when
 * no key is configured, so a reviewer can walk the whole journey without one and
 * the demo can never hang on a third-party outage.
 *
 * Only synthetic vehicle facts are ever sent — there is no real personal data in
 * this app to leak.
 */
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const TIMEOUT_MS = 8000;

export const aiConfigured = () => Boolean(process.env.OPENAI_API_KEY);

export type AiResult = { text: string; source: "openai" | "fallback" };

export async function ask(system: string, user: string, fallback: string): Promise<AiResult> {
  if (!aiConfigured()) return { text: fallback, source: "fallback" };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: 400,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return { text: fallback, source: "fallback" };
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text ? { text, source: "openai" } : { text: fallback, source: "fallback" };
  } catch {
    // Timeout, network error, malformed response — the citizen still gets an answer.
    return { text: fallback, source: "fallback" };
  }
}
