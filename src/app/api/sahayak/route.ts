import { ask, aiConfigured } from "@/lib/ai";
import { KNOWLEDGE, matchAnswer, NO_MATCH } from "@/lib/knowledge";

/**
 * "Sahayak" — the step-aware helper. Answers a citizen's question about the
 * paperwork in front of them, in their language, grounded in our knowledge base.
 */
export async function POST(request: Request) {
  const { question, locale = "en", context = "" } = await request.json().catch(() => ({}));

  if (typeof question !== "string" || question.trim().length < 2) {
    return Response.json({ error: "Ask a question." }, { status: 400 });
  }
  const lang: "en" | "hi" = locale === "hi" ? "hi" : "en";

  const matched = matchAnswer(question);
  const fallback = (matched ?? NO_MATCH)[lang];

  const grounding = KNOWLEDGE.map((k) => `Q: ${k.q.en}\nA: ${k.a.en}`).join("\n\n");
  const system = [
    "You are Sahayak, a calm helper inside an Indian vehicle-services web app.",
    "Explain in plain words a first-time user understands. No jargon without a short gloss.",
    "Be brief: at most 4 sentences.",
    lang === "hi" ? "Reply in simple Hindi (Devanagari)." : "Reply in simple English.",
    "Never invent fees, deadlines or legal rules. If unsure, say what the user should check with the RTO.",
    "This is a demo with synthetic data; never claim to be an official government service.",
    `Reference material:\n${grounding}`,
  ].join("\n");

  const { text, source } = await ask(
    system,
    context ? `The user is on this step: ${context}\n\nQuestion: ${question}` : question,
    fallback
  );

  return Response.json({ answer: text, source, aiConfigured: aiConfigured() });
}
