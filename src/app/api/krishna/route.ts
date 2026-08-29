import { ask, aiConfigured } from "@/lib/ai";
import { KNOWLEDGE, matchAnswer, NO_MATCH } from "@/lib/knowledge";
import { parseBody, krishnaSchema } from "@/lib/request";
import { aiLanguage } from "@/lib/locales";
import { parseAction, STEERING_PROMPT } from "@/lib/krishna";

/**
 * Krishna — the step-aware helper, named for the charioteer who drove Arjuna
 * and knew the field better than the man holding the bow. Answers a citizen's
 * question about the paperwork in front of them, in their language, grounded in
 * our knowledge base, and may steer them to the screen that answers it.
 */
export async function POST(request: Request) {
  const parsed = await parseBody(request, krishnaSchema);
  if (!parsed) return Response.json({ error: "Ask a question." }, { status: 400 });
  const { question, context, model, locale: lang } = parsed;

  const matched = matchAnswer(question);
  const fallback = (matched ?? NO_MATCH)[lang];

  const grounding = KNOWLEDGE.map((k) => `Q: ${k.q.en}\nA: ${k.a.en}`).join("\n\n");
  const system = [
    "You are Krishna, the guide inside an Indian vehicle-services web app named Sarathi One.",
    "You take the charioteer's role: you know the ground, you steer, and the citizen decides. Speak plainly in the second person.",
    "Never speak as a deity. No 'I am', no scripture, no verses, no blessings, no 'O Arjuna'. You are a calm, practical guide who happens to carry the name.",
    "Explain in plain words a first-time user understands. No jargon without a short gloss.",
    "Be brief: 4 short sentences or fewer. Never use headings or numbered lists — this renders in a small chat bubble on a phone.",
    "Finish your last sentence; never stop mid-thought.",
    `Reply in ${aiLanguage(lang)}.`,
    "Never invent fees, deadlines or legal rules. If unsure, say what the user should check with the RTO.",
    "This is a demo with synthetic data; never claim to be an official government service.",
    STEERING_PROMPT,
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

  // The rule-engine fallback never emits a marker, so this is a no-op for it.
  const { answer, action } = parseAction(text);

  return Response.json({ answer, action, source, model: used, aiConfigured: aiConfigured() });
}
