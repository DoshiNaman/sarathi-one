import { DEMO_NOW } from "./data";
import type { Vehicle } from "./types";
import type { Locale } from "./locales";

/**
 * Four price rows, labelled by who is buying rather than by brand.
 *
 * Only the insurance row has an official basis. India Motor Tariff GR.8 gives a
 * depreciation grid for Insured Declared Value, and it stops at five years — the
 * tariff's own note leaves IDV past that to "an understanding between the
 * insurer and the insured". So for anything older we deliberately show no
 * number and say why. The gap is the point: for most used cars on sale, no
 * official schedule exists, which is exactly why sellers can anchor a buyer
 * wherever they like.
 *
 * The other three rows are Sarathi's own simulated figures. No marketplace was
 * consulted and none is named — real names beside invented numbers would be a
 * false statement about a third party, which no trademark safe harbour covers.
 */

// GR.8, applied to the vehicle's ex-showroom price. Age in whole years.
const IDV_DEPRECIATION: readonly { upToYears: number; pct: number }[] = [
  { upToYears: 1, pct: 0.15 },
  { upToYears: 2, pct: 0.2 },
  { upToYears: 3, pct: 0.3 },
  { upToYears: 4, pct: 0.4 },
  { upToYears: 5, pct: 0.5 },
];

// Our assumptions, not anyone's data. Stated on screen next to the numbers.
export const DEALER_DISCOUNT = 0.15;
export const RETAIL_MARKUP = 0.18;

// The band is wide on the free record and tightens once the seller consents and
// we can see odometer, owner count and accident history.
const SPREAD_PUBLIC = 0.12;
const SPREAD_CONSENTED = 0.06;
// An accident does not just lower the price, it makes the price less knowable.
const SPREAD_ACCIDENT = 0.1;

const EXPECTED_KM_PER_YEAR = 10_000;

export type PriceChannel = "INSURANCE" | "DEALER" | "PRIVATE" | "RETAIL";

export type PriceRow = {
  channel: PriceChannel;
  /** null on the insurance row when the car is past the official schedule. */
  band: { min: number; max: number } | null;
};

export type PriceBand = {
  rows: PriceRow[];
  /** Why the consented band moved. Empty on the public record. */
  reasons: Record<Locale, string>[];
  consented: boolean;
  /** True when the car is older than GR.8 covers, so the UI can explain it. */
  pastOfficialSchedule: boolean;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function ageYears(v: Vehicle) {
  return Math.max(0, DEMO_NOW.getFullYear() - v.year);
}

function insuranceBand(v: Vehicle, spread: number) {
  if (v.exShowroomPrice === undefined) return null;
  const slab = IDV_DEPRECIATION.find((s) => ageYears(v) <= s.upToYears);
  if (!slab) return null;
  const idv = v.exShowroomPrice * (1 - slab.pct);
  return { min: idv * (1 - spread), max: idv * (1 + spread) };
}

export function buildPriceBand(v: Vehicle, consented: boolean): PriceBand {
  // The existing fairPrice band is already "what one person pays another", so
  // it is the private-sale row. Everything else hangs off its midpoint, which
  // keeps the four rows agreeing with each other by construction.
  const anchor = (v.fairPrice.min + v.fairPrice.max) / 2;
  const reasons: Record<Locale, string>[] = [];

  let adjustment = 0;
  let spread = consented ? SPREAD_CONSENTED : SPREAD_PUBLIC;

  if (consented && anchor > 0) {
    const expectedKm = Math.max(1, ageYears(v)) * EXPECTED_KM_PER_YEAR;
    const kmRatio = v.odometerKm / expectedKm;
    if (kmRatio > 1.15) {
      adjustment -= clamp((kmRatio - 1) * 0.2, 0, 0.1);
      reasons.push({
        en: `${v.odometerKm.toLocaleString("en-IN")} km — above average for a ${v.year} vehicle, so the band moves down.`,
        hi: `${v.odometerKm.toLocaleString("en-IN")} किमी — ${v.year} की गाड़ी के लिए औसत से ज़्यादा, इसलिए कीमत नीचे आती है।`,
        gu: `${v.odometerKm.toLocaleString("en-IN")} કિમી — ${v.year} ની ગાડી માટે સરેરાશ કરતાં વધુ, તેથી કિંમત નીચે આવે છે.`,
      });
    } else if (kmRatio < 0.75) {
      adjustment += clamp((1 - kmRatio) * 0.15, 0, 0.06);
      reasons.push({
        en: `${v.odometerKm.toLocaleString("en-IN")} km — lightly driven for a ${v.year} vehicle, so the band moves up.`,
        hi: `${v.odometerKm.toLocaleString("en-IN")} किमी — ${v.year} की गाड़ी के लिए कम चली है, इसलिए कीमत ऊपर जाती है।`,
        gu: `${v.odometerKm.toLocaleString("en-IN")} કિમી — ${v.year} ની ગાડી માટે ઓછી ચાલી છે, તેથી કિંમત ઉપર જાય છે.`,
      });
    }

    const owners = v.owners.length;
    if (owners >= 3) {
      adjustment -= 0.05;
      reasons.push({
        en: `${owners} owners on record — buyers pay less for a car that has changed hands often.`,
        hi: `रिकॉर्ड में ${owners} मालिक — बार-बार हाथ बदली गाड़ी की कीमत कम मिलती है।`,
        gu: `રેકોર્ડમાં ${owners} માલિક — વારંવાર હાથ બદલાયેલી ગાડીની કિંમત ઓછી મળે છે.`,
      });
    }

    if (v.accident.flag) {
      adjustment -= 0.12;
      spread = SPREAD_ACCIDENT;
      reasons.push({
        en: "Accident history on record — this lowers the price and makes it harder to pin down, so the range stays wide.",
        hi: "रिकॉर्ड में दुर्घटना — इससे कीमत घटती है और तय करना कठिन होता है, इसलिए दायरा चौड़ा रहता है।",
        gu: "રેકોર્ડમાં અકસ્માત — તેથી કિંમત ઘટે છે અને નક્કી કરવું અઘરું બને છે, માટે શ્રેણી પહોળી રહે છે.",
      });
    }
  }

  const priv = anchor * (1 + adjustment);
  const band = (centre: number) => ({ min: centre * (1 - spread), max: centre * (1 + spread) });

  return {
    consented,
    pastOfficialSchedule: ageYears(v) > 5,
    reasons,
    rows: [
      { channel: "INSURANCE", band: insuranceBand(v, spread) },
      { channel: "DEALER", band: anchor > 0 ? band(priv * (1 - DEALER_DISCOUNT)) : null },
      { channel: "PRIVATE", band: anchor > 0 ? band(priv) : null },
      { channel: "RETAIL", band: anchor > 0 ? band(priv * (1 + RETAIL_MARKUP)) : null },
    ],
  };
}

const PROMPT_LABEL = {
  INSURANCE: "insurance value (IDV)",
  DEALER: "dealer buy-in",
  PRIVATE: "private sale",
  RETAIL: "certified retail",
} satisfies Record<PriceChannel, string>;

/**
 * The band flattened into one line for the AI prompt, so the advice can compare
 * an asking price against the right counterparty rather than one flat number.
 * Consented, because this only ever runs behind the Trust Report's consent gate.
 */
export function priceFacts(v: Vehicle): string {
  const band = buildPriceBand(v, true);
  const rows = band.rows.map((r) =>
    r.band
      ? `${PROMPT_LABEL[r.channel]} ₹${Math.round(r.band.min)}–₹${Math.round(r.band.max)}`
      : `${PROMPT_LABEL[r.channel]}: no official depreciation schedule exists past 5 years`
  );
  const why = band.reasons.map((r) => r.en).join(" ");
  return `Estimated price by counterparty: ${rows.join("; ")}. ${why}`.trim();
}

/**
 * Where an asking price sits against the four rows.
 *
 * This is the question the buyer actually arrived with — "he wants ₹5.2 lakh,
 * is that fair?" — so the table is evidence and this is the answer.
 */
export type AskingVerdict = {
  tone: "good" | "fair" | "high";
  text: Record<Locale, string>;
};

export function judgeAsking(band: PriceBand, asking: number): AskingVerdict | null {
  const at = (c: PriceChannel) => band.rows.find((r) => r.channel === c)?.band ?? null;
  const dealer = at("DEALER");
  const priv = at("PRIVATE");
  const retail = at("RETAIL");
  if (!dealer || !priv || !retail || !Number.isFinite(asking) || asking <= 0) return null;

  if (asking < dealer.min)
    return {
      tone: "good",
      text: {
        en: "Cheaper than a dealer would even offer the seller. That is unusual — ask why before you celebrate.",
        hi: "डीलर विक्रेता को जितना देता, उससे भी सस्ता। यह असामान्य है — खुश होने से पहले वजह पूछें।",
        gu: "ડીલર વેચનારને જેટલું આપે તેનાથી પણ સસ્તું. આ અસામાન્ય છે — ખુશ થતાં પહેલાં કારણ પૂછો.",
      },
    };

  if (asking <= dealer.max)
    return {
      tone: "good",
      text: {
        en: "Around what a dealer would pay. A strong price for a private buyer.",
        hi: "लगभग उतना ही जितना डीलर देता। निजी खरीदार के लिए बहुत अच्छा दाम।",
        gu: "લગભગ એટલું જ જેટલું ડીલર આપે. ખાનગી ખરીદનાર માટે ઘણો સારો ભાવ.",
      },
    };

  if (asking <= priv.max)
    return {
      tone: "fair",
      text: {
        en: "Inside the normal private-sale range. Reasonable, and there is still room to negotiate downward.",
        hi: "आम आपसी बिक्री के दायरे में। ठीक है, और मोल-भाव की गुंजाइश अब भी है।",
        gu: "સામાન્ય ખાનગી વેચાણની શ્રેણીમાં. વાજબી છે, અને મોલભાવની જગ્યા હજી છે.",
      },
    };

  if (asking <= retail.max)
    return {
      tone: "high",
      text: {
        en: "This is certified-retail money for a private sale. A dealer's price buys refurbishment and a warranty — a private seller gives you neither.",
        hi: "यह आपसी बिक्री के लिए सर्टिफाइड रिटेल जितना दाम है। डीलर के दाम में मरम्मत और वारंटी मिलती है — निजी विक्रेता से कुछ नहीं मिलता।",
        gu: "આ ખાનગી વેચાણ માટે સર્ટિફાઇડ રિટેલ જેટલો ભાવ છે. ડીલરના ભાવમાં રિપેર અને વોરંટી મળે છે — ખાનગી વેચનાર પાસેથી કંઈ મળતું નથી.",
      },
    };

  return {
    tone: "high",
    text: {
      en: "Above even a certified retail listing. Walk unless there is something here the record does not show.",
      hi: "सर्टिफाइड रिटेल लिस्टिंग से भी ऊपर। जब तक कोई खास वजह न हो, आगे बढ़ जाएं।",
      gu: "સર્ટિફાઇડ રિટેલ લિસ્ટિંગ કરતાં પણ વધુ. કોઈ ખાસ કારણ ન હોય તો આગળ વધી જાઓ.",
    },
  };
}

/** Domain of the whole scale, for positioning the bar and the marker. */
export function scaleDomain(band: PriceBand) {
  const bands = band.rows.map((r) => r.band).filter((b) => b !== null);
  if (bands.length === 0) return null;
  return { lo: Math.min(...bands.map((b) => b.min)), hi: Math.max(...bands.map((b) => b.max)) };
}
