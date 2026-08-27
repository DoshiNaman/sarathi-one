import { ask, aiConfigured } from "@/lib/ai";
import { KNOWLEDGE, matchAnswer, NO_MATCH } from "@/lib/knowledge";
import { parseBody, sahayakSchema } from "@/lib/request";

/**
 * "Sahayak" — the step-aware helper. Answers a citizen's question about the
 * paperwork in front of them, in their language, grounded in our knowledge base.
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, sahayakSchema);
  if (!parsed) return Response.json({ error: "Ask a question." }, { status: 400 });
  const { question, context, model, locale: lang } = parsed;

  const matched = matchAnswer(question);
  const fallback = (matched ?? NO_MATCH)[lang];

  const grounding = KNOWLEDGE.map((k) => `Q: ${k.q.en}\nA: ${k.a.en}`).join("\n\n");
  const system = [
    "You are Sahayak, a calm helper inside an Indian vehicle-services web app.",
    "Explain in plain words a first-time user understands. No jargon without a short gloss.",
    "Be brief: 4 short sentences or fewer. Never use headings or numbered lists — this renders in a small chat bubble on a phone.",
    "Finish your last sentence; never stop mid-thought.",
    lang === "hi" ? "Reply in simple Hindi (Devanagari)." : "Reply in simple English.",
    "Never invent fees, deadlines or legal rules. If unsure, say what the user should check with the RTO.",
    "This is a demo with synthetic data; never claim to be an official government service.",
    `Reference material:\n${grounding}`,
  ].join("\n");

  const {
    text,
    source,
    model: used,
  } = await ask(
    system,
    context ? `The user is on this step: ${context}\n\nQuestion: ${question}` : question,
    fallback,
    model
  );

  return Response.json({ answer: text, source, model: used, aiConfigured: aiConfigured() });
}
