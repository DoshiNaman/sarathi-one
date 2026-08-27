import { ask, aiConfigured } from "@/lib/ai";
import { findVehicle } from "@/lib/data";
import { buildVerdict } from "@/lib/verdict";

/**
 * Turns the Trust Report's structured facts into one plain-language paragraph a
 * buyer can act on. Falls back to the deterministic rule verdict without a key.
 */
export async function POST(request: Request) {
  const { regNo, locale = "en" } = await request.json().catch(() => ({}));
  const vehicle = typeof regNo === "string" ? findVehicle(regNo) : undefined;
  if (!vehicle) return Response.json({ error: "Unknown vehicle." }, { status: 404 });

  const lang: "en" | "hi" = locale === "hi" ? "hi" : "en";
  const verdict = buildVerdict(vehicle);
  const fallback = [verdict.headline[lang], ...verdict.points.map((p) => p[lang])].join(" ");

  // Only synthetic facts leave the server.
  const facts = [
    `Vehicle: ${vehicle.maker} ${vehicle.model} ${vehicle.year}, ${vehicle.fuel}, ${vehicle.emission}.`,
    `Registered ${vehicle.regDate} at ${vehicle.rto}. Status: ${vehicle.status}.`,
    `Owners so far: ${vehicle.owners.length}.`,
    vehicle.hypothecation.active
      ? `Active loan with ${vehicle.hypothecation.financier}; Form 35 ${vehicle.hypothecation.form35Pending ? "NOT filed" : "filed"}.`
      : "No active loan on the RC.",
    `Insurance valid to ${vehicle.insurance.validTill}; PUC to ${vehicle.puc.validTill}; road tax to ${vehicle.tax.paidTill}.`,
    `Challans: ${vehicle.challans.length === 0 ? "none" : vehicle.challans.map((c) => `${c.offense} ₹${c.amount} (${c.status})`).join("; ")}.`,
    vehicle.accident.flag ? `Accident record: ${vehicle.accident.note}` : "No accident records.",
    `Odometer ${vehicle.odometerKm} km. Fair price band ₹${vehicle.fairPrice.min}–₹${vehicle.fairPrice.max}.`,
    `Rule engine graded this ${verdict.grade}.`,
  ].join("\n");

  const system = [
    "You advise an Indian citizen about to buy this second-hand vehicle.",
    "Write one short paragraph (max 5 sentences) telling them plainly whether to proceed and what to fix first.",
    "Lead with the single biggest risk. Be concrete about money and paperwork.",
    lang === "hi" ? "Write in simple Hindi (Devanagari)." : "Write in simple English.",
    "Use only the facts given. Never invent history, fees or rules.",
    `Keep the same overall grade as the rule engine (${verdict.grade}).`,
  ].join("\n");

  const { text, source } = await ask(system, facts, fallback);

  return Response.json({
    grade: verdict.grade,
    prose: text,
    points: verdict.points.map((p) => p[lang]),
    source,
    aiConfigured: aiConfigured(),
  });
}
