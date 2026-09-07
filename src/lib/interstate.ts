import { DEMO_NOW } from "./data";
import type { Vehicle } from "./types";
import type { Locale } from "./locales";

/**
 * "Where can this car actually go?" — the inter-state re-registration check.
 *
 * The plate's first two letters are the car's home state. The buyer picks
 * theirs. We answer whether the car can be re-registered where they live, and
 * every line we show is a rule number or a signed court order — nothing invented.
 * Sources: research/phase2-transfer-noc-pricing.md §3.
 *
 * Trilingual strings live inline here, same as verdict.ts and knowledge.ts.
 */

/** Every Indian state / UT RTO code, so the destination picker is national. */
export const STATES = {
  AP: "Andhra Pradesh",
  AR: "Arunachal Pradesh",
  AS: "Assam",
  BR: "Bihar",
  CG: "Chhattisgarh",
  GA: "Goa",
  GJ: "Gujarat",
  HR: "Haryana",
  HP: "Himachal Pradesh",
  JH: "Jharkhand",
  KA: "Karnataka",
  KL: "Kerala",
  MP: "Madhya Pradesh",
  MH: "Maharashtra",
  MN: "Manipur",
  ML: "Meghalaya",
  MZ: "Mizoram",
  NL: "Nagaland",
  OD: "Odisha",
  PB: "Punjab",
  RJ: "Rajasthan",
  SK: "Sikkim",
  TN: "Tamil Nadu",
  TS: "Telangana",
  TR: "Tripura",
  UP: "Uttar Pradesh",
  UK: "Uttarakhand",
  WB: "West Bengal",
  AN: "Andaman & Nicobar",
  CH: "Chandigarh",
  DD: "Dadra & Nagar Haveli and Daman & Diu",
  DL: "Delhi",
  JK: "Jammu & Kashmir",
  LA: "Ladakh",
  LD: "Lakshadweep",
  PY: "Puducherry",
} satisfies Record<string, string>;

/** The two-letter state code from a registration number, or null if unknown. */
export function stateOf(regNo: string): string | null {
  const code = regNo.trim().toUpperCase().slice(0, 2);
  return code in STATES ? code : null;
}

/** State name for a two-letter code, or null if we do not know it. */
export function stateName(code: string): string | null {
  // SAFETY: guarded by `in`, so `code` is a real key of STATES here.
  return code in STATES ? STATES[code as keyof typeof STATES] : null;
}

/** Whole years between the car's registration and the demo's "today". */
function ageYears(v: Vehicle): number {
  const reg = new Date(v.regDate);
  let age = DEMO_NOW.getFullYear() - reg.getFullYear();
  const before =
    DEMO_NOW.getMonth() < reg.getMonth() ||
    (DEMO_NOW.getMonth() === reg.getMonth() && DEMO_NOW.getDate() < reg.getDate());
  if (before) age -= 1;
  return age;
}

export type TransferGrade = "FINE" | "CHECK_RTO" | "RESTRICTED" | "UNKNOWN";

type Line = Record<Locale, string>;
/** One finding: the plain-language point, and the rule it comes from. */
export type TransferPoint = { text: Line; source?: string };

export type TransferCheck = {
  grade: TransferGrade;
  originState: string | null;
  originName: string | null;
  destName: string;
  sameState: boolean;
  headline: Line;
  points: TransferPoint[];
};

const rank = {
  FINE: 0,
  UNKNOWN: 1,
  CHECK_RTO: 2,
  RESTRICTED: 3,
} satisfies Record<TransferGrade, number>;
const worse = (a: TransferGrade, b: TransferGrade): TransferGrade => (rank[b] > rank[a] ? b : a);

// The four inter-state "what changes" points — always shown when the states
// differ, regardless of the age gate. Each is a section of the MV Act or a PIB
// release; see the source strings.
function interstateBasics(v: Vehicle): TransferPoint[] {
  const points: TransferPoint[] = [
    {
      text: {
        en: "You need an NOC (Form 28) from the seller's RTO — not yours — and only the seller can apply. If the RTO stays silent for 30 days, it counts as granted; note the date it was applied for.",
        hi: "विक्रेता के RTO से NOC (Form 28) चाहिए — आपके नहीं — और आवेदन केवल विक्रेता कर सकता है। यदि RTO 30 दिन चुप रहे, तो यह स्वीकृत माना जाता है; आवेदन की तारीख नोट करें।",
        gu: "વેચનારના RTO પાસેથી NOC (Form 28) જોઈએ — તમારા નહીં — અને અરજી ફક્ત વેચનાર જ કરી શકે. જો RTO 30 દિવસ ચૂપ રહે, તો તે મંજૂર ગણાય; અરજીની તારીખ નોંધો.",
      },
      source: "MV Act s.48, s.48(4)",
    },
    {
      text: {
        en: "You must re-register the car in your state within 12 months of it being kept there — and that clock can start before you buy it.",
        hi: "गाड़ी को अपने राज्य में रखने के 12 महीने के भीतर वहां पुनः पंजीकरण कराना होगा — और यह समय आपके खरीदने से पहले शुरू हो सकता है।",
        gu: "ગાડીને તમારા રાજ્યમાં રાખ્યાના 12 મહિનામાં ત્યાં પુનઃનોંધણી કરાવવી પડશે — અને આ સમય તમે ખરીદો તે પહેલાં શરૂ થઈ શકે છે.",
      },
      source: "MV Act s.47(1)",
    },
    {
      text: {
        en: "You will pay your state's road tax again, then claim a refund from the origin state. The Government's own words: 'a very cumbersome process' that 'varies from one State to another.'",
        hi: "आपको अपने राज्य का रोड टैक्स दोबारा भरना होगा, फिर मूल राज्य से रिफंड मांगना होगा। सरकार के अपने शब्द: 'बहुत जटिल प्रक्रिया' जो 'हर राज्य में अलग है।'",
        gu: "તમારે તમારા રાજ્યનો રોડ ટેક્સ ફરી ભરવો પડશે, પછી મૂળ રાજ્ય પાસેથી રિફંડ માંગવો પડશે. સરકારના પોતાના શબ્દો: 'ખૂબ જટિલ પ્રક્રિયા' જે 'દરેક રાજ્યમાં અલગ છે.'",
      },
      source: "PIB 1749764, 28 Aug 2021",
    },
  ];
  if (v.hypothecation.active) {
    points.push({
      text: {
        en: "There is an active loan. The financier must consent in writing before any transfer or NOC. If it stays silent for 7 days after the seller applies, its consent is deemed given.",
        hi: "लोन चालू है। किसी भी ट्रांसफर या NOC से पहले फाइनेंसर को लिखित सहमति देनी होगी। विक्रेता के आवेदन के 7 दिन बाद तक चुप रहने पर सहमति मानी जाती है।",
        gu: "લોન ચાલુ છે. કોઈપણ ટ્રાન્સફર કે NOC પહેલાં ફાઇનાન્સરની લેખિત સંમતિ જોઈએ. વેચનારની અરજી પછી 7 દિવસ ચૂપ રહે તો સંમતિ મળી ગણાય.",
      },
      source: "MV Act s.51(4), s.51(7)",
    });
  }
  return points;
}

/**
 * Can this vehicle be re-registered in `destState`? Returns a graded verdict
 * with sourced points. `destState` is a two-letter code from STATES.
 */
export function checkTransfer(v: Vehicle, destState: string): TransferCheck {
  const originState = stateOf(v.regNo);
  const originName = originState ? stateName(originState) : null;
  const destName = stateName(destState) ?? destState;
  const sameState = originState === destState;
  const age = ageYears(v);
  const diesel = v.fuel === "DIESEL";
  const petrol = v.fuel === "PETROL";

  if (sameState) {
    return {
      grade: "FINE",
      originState,
      originName,
      destName,
      sameState: true,
      headline: {
        en: `Same state — no inter-state NOC needed to keep it in ${destName}.`,
        hi: `एक ही राज्य — ${destName} में रखने के लिए अंतर-राज्य NOC की जरूरत नहीं।`,
        gu: `એક જ રાજ્ય — ${destName} માં રાખવા માટે આંતર-રાજ્ય NOC ની જરૂર નથી.`,
      },
      points: [
        {
          text: {
            en: "A normal transfer of ownership (Form 29/30) still applies. If you move the car to a different RTO within the state, that RTO can still ask for an NOC.",
            hi: "सामान्य स्वामित्व ट्रांसफर (Form 29/30) फिर भी लागू है। राज्य के भीतर किसी दूसरे RTO में ले जाने पर वह RTO NOC मांग सकता है।",
            gu: "સામાન્ય માલિકી ટ્રાન્સફર (Form 29/30) તો લાગુ પડે જ છે. રાજ્યની અંદર બીજા RTO માં લઈ જાઓ તો તે RTO NOC માંગી શકે.",
          },
          source: "CMVR Rule 54",
        },
      ],
    };
  }

  const points = interstateBasics(v);
  let grade: TransferGrade = "UNKNOWN";

  // Origin-side gate: the Delhi diesel/petrol NOC order.
  if (originState === "DL" && diesel && age >= 15) {
    grade = worse(grade, "RESTRICTED");
    points.unshift({
      text: {
        en: "Delhi will NOT issue an NOC for a diesel vehicle 15 years or older. This car cannot legally leave Delhi except to be scrapped or converted to electric. Do not pay.",
        hi: "दिल्ली 15 साल या उससे पुराने डीजल वाहन के लिए NOC नहीं देगी। यह गाड़ी स्क्रैप या इलेक्ट्रिक में बदलने के अलावा कानूनी रूप से दिल्ली से बाहर नहीं जा सकती। भुगतान न करें।",
        gu: "દિલ્હી 15 વર્ષ કે તેથી જૂના ડીઝલ વાહન માટે NOC આપશે નહીં. આ ગાડી સ્ક્રેપ કે ઇલેક્ટ્રિકમાં ફેરવ્યા સિવાય કાનૂની રીતે દિલ્હીની બહાર જઈ શકતી નથી. ચુકવણી ન કરો.",
      },
      source: "Delhi Transport Dept Order 14/12/2021, ¶5(I)",
    });
  } else if (originState === "DL" && diesel && age > 10) {
    grade = worse(grade, "CHECK_RTO");
    points.unshift({
      text: {
        en: "Delhi issues an NOC for a diesel over 10 years old only for non-restricted areas. Confirm your destination is allowed before you pay.",
        hi: "दिल्ली 10 साल से पुराने डीजल के लिए NOC केवल गैर-प्रतिबंधित क्षेत्रों हेतु देती है। भुगतान से पहले पुष्टि करें कि आपका गंतव्य अनुमत है।",
        gu: "દિલ્હી 10 વર્ષથી જૂના ડીઝલ માટે NOC ફક્ત બિન-પ્રતિબંધિત વિસ્તારો માટે આપે છે. ચુકવણી પહેલાં ખાતરી કરો કે તમારું સ્થળ મંજૂર છે.",
      },
      source: "Delhi Transport Dept Order 14/12/2021, ¶5(III)",
    });
  } else if (originState === "DL" && petrol && age > 15) {
    grade = worse(grade, "CHECK_RTO");
    points.unshift({
      text: {
        en: "Delhi issues an NOC for a petrol vehicle over 15 years old only for non-restricted areas. Confirm your destination is allowed before you pay.",
        hi: "दिल्ली 15 साल से पुराने पेट्रोल के लिए NOC केवल गैर-प्रतिबंधित क्षेत्रों हेतु देती है। भुगतान से पहले पुष्टि करें कि आपका गंतव्य अनुमत है।",
        gu: "દિલ્હી 15 વર્ષથી જૂના પેટ્રોલ માટે NOC ફક્ત બિન-પ્રતિબંધિત વિસ્તારો માટે આપે છે. ચુકવણી પહેલાં ખાતરી કરો કે તમારું સ્થળ મંજૂર છે.",
      },
      source: "Delhi Transport Dept Order 14/12/2021, ¶5(III)",
    });
  }

  // Destination-side gate: Delhi/Haryana/UP won't register an old diesel.
  if (["DL", "HR", "UP"].includes(destState) && diesel && age > 10) {
    grade = worse(grade, "CHECK_RTO");
    points.unshift({
      text: {
        en: `${destName}'s registering authorities will not register a diesel more than 10 years old. You may not be able to re-register this car where you live — confirm before you pay.`,
        hi: `${destName} के पंजीकरण प्राधिकरण 10 साल से पुराने डीजल को पंजीकृत नहीं करेंगे। आप इसे अपने यहां पुनः पंजीकृत नहीं करा पाएंगे — भुगतान से पहले पुष्टि करें।`,
        gu: `${destName} ના નોંધણી સત્તાધીશો 10 વર્ષથી જૂના ડીઝલને નોંધશે નહીં. તમે તેને તમારે ત્યાં પુનઃનોંધાવી નહીં શકો — ચુકવણી પહેલાં ખાતરી કરો.`,
      },
      source: "NGT direction, 7 Apr 2015 (MoRTH reply to Parliament)",
    });
  }

  // No verified age rule for this pair — the honest answer, and a feature.
  if (grade === "UNKNOWN") {
    points.unshift({
      text: {
        en: `We could not establish an age-based restriction for ${destName}. The inter-state transfer itself is standard — confirm any local rule with your RTO.`,
        hi: `हम ${destName} के लिए उम्र-आधारित प्रतिबंध स्थापित नहीं कर सके। अंतर-राज्य ट्रांसफर सामान्य है — कोई स्थानीय नियम अपने RTO से पुष्टि करें।`,
        gu: `અમે ${destName} માટે ઉંમર-આધારિત પ્રતિબંધ સ્થાપિત કરી શક્યા નહીં. આંતર-રાજ્ય ટ્રાન્સફર સામાન્ય છે — કોઈ સ્થાનિક નિયમ તમારા RTO પાસે ખાતરી કરો.`,
      },
    });
  }

  const headline: Line =
    grade === "RESTRICTED"
      ? {
          en: `Restricted — this car cannot move from ${originName} to ${destName} as-is.`,
          hi: `प्रतिबंधित — यह गाड़ी ${originName} से ${destName} इस स्थिति में नहीं जा सकती।`,
          gu: `પ્રતિબંધિત — આ ગાડી ${originName} થી ${destName} આ સ્થિતિમાં જઈ શકતી નથી.`,
        }
      : grade === "CHECK_RTO"
        ? {
            en: `Check with the RTO before you pay — a rule may stop this ${originName}→${destName} move.`,
            hi: `भुगतान से पहले RTO से जांचें — एक नियम इस ${originName}→${destName} स्थानांतरण को रोक सकता है।`,
            gu: `ચુકવણી પહેલાં RTO પાસે તપાસો — એક નિયમ આ ${originName}→${destName} ફેરબદલી રોકી શકે.`,
          }
        : {
            en: `This car is registered in ${originName}. Moving it to ${destName} changes four things.`,
            hi: `यह गाड़ी ${originName} में पंजीकृत है। इसे ${destName} ले जाने पर चार चीजें बदलती हैं।`,
            gu: `આ ગાડી ${originName} માં નોંધાયેલી છે. તેને ${destName} લઈ જવાથી ચાર વસ્તુ બદલાય છે.`,
          };

  return { grade, originState, originName, destName, sameState: false, headline, points };
}
