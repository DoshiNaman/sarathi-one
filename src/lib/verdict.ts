import { DEMO_NOW } from "./data";
import type { Vehicle } from "./types";

export type Verdict = {
  grade: "GOOD" | "CAUTION" | "AVOID";
  headline: { en: string; hi: string };
  points: { en: string; hi: string }[];
};

// Rule-generated verdict — labeled as mock AI in the UI.
// When OPENAI_API_KEY is set, /api/verdict rewrites these points in natural prose.
export function buildVerdict(v: Vehicle): Verdict {
  const points: Verdict["points"] = [];
  let score = 0;

  if (v.status === "BLACKLISTED") {
    return {
      grade: "AVOID",
      headline: {
        en: "Do not buy. This vehicle is blacklisted in official records.",
        hi: "मत खरीदें। यह वाहन सरकारी रिकॉर्ड में ब्लैकलिस्टेड है।",
      },
      points: [
        {
          en: "Blacklisted vehicles cannot be transferred to your name. Walk away.",
          hi: "ब्लैकलिस्टेड वाहन आपके नाम ट्रांसफर नहीं हो सकता। इससे दूर रहें।",
        },
      ],
    };
  }
  if (v.status === "SCRAPPED") {
    return {
      grade: "AVOID",
      headline: {
        en: "This vehicle is officially scrapped. It cannot be registered again.",
        hi: "यह वाहन आधिकारिक रूप से स्क्रैप हो चुका है। दोबारा रजिस्टर नहीं हो सकता।",
      },
      points: [
        {
          en: "A scrapped RC is permanently cancelled. Any sale offer is fraud.",
          hi: "स्क्रैप RC स्थायी रूप से रद्द है। इसे बेचने का कोई भी प्रस्ताव धोखाधड़ी है।",
        },
      ],
    };
  }

  if (v.hypothecation.active) {
    score -= 1;
    points.push({
      en: `Active loan with ${v.hypothecation.financier}. Do not pay the seller until Form 35 (HP termination) is cleared — otherwise the bank's claim stays on YOUR car.`,
      hi: `${v.hypothecation.financier} का लोन चालू है। Form 35 (HP समाप्ति) पूरा होने तक विक्रेता को भुगतान न करें — वरना बैंक का दावा आपकी गाड़ी पर बना रहेगा।`,
    });
  } else {
    score += 1;
    points.push({
      en: "No active loan on record. RC is clean for transfer.",
      hi: "कोई सक्रिय लोन दर्ज नहीं। RC ट्रांसफर के लिए साफ है।",
    });
  }

  if (v.accident.flag) {
    score -= 2;
    points.push({
      en: `Accident history found: ${v.accident.note ?? "damage claim on record"}. Get an independent structural inspection before any payment.`,
      hi: "दुर्घटना का इतिहास मिला है। भुगतान से पहले स्वतंत्र स्ट्रक्चरल जांच कराएं।",
    });
  }

  const pending = v.challans.filter((c) => c.status === "PENDING");
  if (pending.length > 0) {
    const total = pending.reduce((s, c) => s + c.amount, 0);
    score -= 1;
    points.push({
      en: `₹${total.toLocaleString("en-IN")} in pending challans (${pending.length}). Make the seller clear them first — they follow the vehicle.`,
      hi: `₹${total.toLocaleString("en-IN")} के ${pending.length} चालान बकाया हैं। पहले विक्रेता से भरवाएं — ये वाहन के साथ चलते हैं।`,
    });
  }

  const owners = v.owners.length;
  if (owners >= 3) {
    score -= 1;
    points.push({
      en: `${owners} owners in ${DEMO_NOW.getFullYear() - v.year} years is high churn. Ask why it changed hands so often.`,
      hi: `${DEMO_NOW.getFullYear() - v.year} साल में ${owners} मालिक — बार-बार बिकने का कारण पूछें।`,
    });
  } else {
    points.push({
      en: `${owners} owner${owners > 1 ? "s" : ""} on record — normal for this age.`,
      hi: `रिकॉर्ड में ${owners} मालिक — इस उम्र की गाड़ी के लिए सामान्य।`,
    });
  }

  const now = DEMO_NOW;
  if (new Date(v.insurance.validTill) < now)
    points.push({ en: "Insurance has lapsed — budget for a fresh policy on day one.", hi: "बीमा समाप्त है — पहले दिन नई पॉलिसी का खर्च जोड़ें।" });
  if (new Date(v.puc.validTill) < now)
    points.push({ en: "PUC certificate expired.", hi: "PUC प्रमाणपत्र समाप्त हो चुका है।" });

  points.push({
    en: `Fair price band for this condition: ₹${v.fairPrice.min.toLocaleString("en-IN")}–₹${v.fairPrice.max.toLocaleString("en-IN")}.`,
    hi: `उचित कीमत सीमा: ₹${v.fairPrice.min.toLocaleString("en-IN")}–₹${v.fairPrice.max.toLocaleString("en-IN")}।`,
  });

  const grade = score >= 1 ? "GOOD" : score >= -2 ? "CAUTION" : "AVOID";
  const headline =
    grade === "GOOD"
      ? { en: "Looks like a safe buy — verify documents in person and proceed.", hi: "सुरक्षित सौदा लगता है — दस्तावेज़ स्वयं जांचकर आगे बढ़ें।" }
      : grade === "CAUTION"
        ? { en: "Buyable, but fix the flagged issues BEFORE money changes hands.", hi: "खरीद सकते हैं, लेकिन भुगतान से पहले चिह्नित समस्याएं सुलझाएं।" }
        : { en: "High risk. We would not recommend this purchase as-is.", hi: "उच्च जोखिम। इस स्थिति में खरीद की सलाह नहीं है।" };

  return { grade, headline, points };
}
