/**
 * The seven roadmap flows, as one data table.
 *
 * Each was walked on the live portals with Gujarat selected and written up in
 * `research/parivahan-gujarat-deep-flows.md`; the flow-relevance matrix there
 * marks all seven roadmap rather than core. They share a stage tracker, a fee
 * step and a slot picker with the transfer wizard, so they are described here
 * and rendered by one generic component instead of seven near-identical pages.
 *
 * Stage labels stay English, matching TRANSFER_STAGES — they are form names
 * ("Form 1A", "Fee payment") that the RTO prints in English anyway. Everything
 * a citizen reads as prose is translated.
 */
import type { Text } from "./story";
import type { ApplicationType } from "./types";

export type StageKind = "info" | "pick" | "docs" | "fee" | "slot" | "text";

export type Option = { label: string; price?: number };

export type Stage = {
  label: string;
  kind: StageKind;
  /** "pick" stages only. A priced option overrides the service's flat fee. */
  options?: Option[];
  /** "docs" stages only. */
  docs?: string[];
};

export type Service = {
  slug: string;
  type: ApplicationType;
  title: Text;
  blurb: Text;
  /** The Gujarat evidence for why this flow is worth building. */
  fact: Text;
  /** Vehicle services ask for a registration number first. */
  needsVehicle: boolean;
  /** Browsable without logging in. Only the fancy-number auction is. */
  browsable?: boolean;
  fee: number;
  stages: Stage[];
};

/** Gujarat RTO codes, as the Sarathi learner-licence form lists them. */
export const GJ_RTOS = [
  "GJ01 - Ahmedabad",
  "GJ03 - Rajkot",
  "GJ04 - Bhavnagar",
  "GJ05 - Surat",
  "GJ06 - Vadodara",
  "GJ12 - Jamnagar",
  "GJ18 - Gandhinagar",
  "GJ27 - Ahmedabad East",
];

export const SERVICES: Service[] = [
  {
    slug: "fitness-ats",
    type: "FITNESS_ATS",
    title: {
      en: "Fitness renewal and ATS booking",
      hi: "फ़िटनेस नवीनीकरण और ATS बुकिंग",
      gu: "ફિટનેસ રિન્યુઅલ અને ATS બુકિંગ",
    },
    blurb: {
      en: "Book an automated testing station, pay, and get the fitness certificate — without moving between three portals.",
      hi: "स्वचालित परीक्षण केंद्र बुक करें, भुगतान करें, और फ़िटनेस प्रमाणपत्र लें — तीन अलग पोर्टल घूमे बिना।",
      gu: "ઓટોમેટેડ ટેસ્ટિંગ સ્ટેશન બુક કરો, ચુકવણી કરો, અને ફિટનેસ પ્રમાણપત્ર મેળવો — ત્રણ અલગ પોર્ટલ ફર્યા વગર.",
    },
    fact: {
      en: "Gujarat has 65 automated testing stations, more than any other state, out of 309 nationally.",
      hi: "गुजरात में 65 स्वचालित परीक्षण केंद्र हैं, देश के कुल 309 में से सबसे ज़्यादा।",
      gu: "ગુજરાતમાં 65 ઓટોમેટેડ ટેસ્ટિંગ સ્ટેશન છે, દેશના કુલ 309માંથી સૌથી વધુ.",
    },
    needsVehicle: true,
    fee: 700,
    stages: [
      { label: "Vehicle and owner check", kind: "info" },
      {
        label: "Choose an ATS centre",
        kind: "pick",
        options: [
          { label: "Ahmedabad ATS, Naroda" },
          { label: "Rajkot ATS, Shapar" },
          { label: "Surat ATS, Kadodara" },
          { label: "Vadodara ATS, Por" },
        ],
      },
      { label: "Fee payment", kind: "fee" },
      { label: "Test slot", kind: "slot" },
      { label: "Fitness certificate issued", kind: "info" },
    ],
  },
  {
    slug: "permit",
    type: "PERMIT",
    title: {
      en: "Goods and passenger permits",
      hi: "माल और यात्री परमिट",
      gu: "માલ અને મુસાફર પરમિટ",
    },
    blurb: {
      en: "National, state and tourist permits in one queue, on the account that already holds the vehicle.",
      hi: "राष्ट्रीय, राज्य और पर्यटक परमिट एक ही कतार में, उसी खाते पर जिसमें वाहन पहले से है।",
      gu: "રાષ્ટ્રીય, રાજ્ય અને પ્રવાસી પરમિટ એક જ કતારમાં, એ જ ખાતા પર જેમાં વાહન પહેલેથી છે.",
    },
    fact: {
      en: "National permits alone move about ₹193 crore a year in Gujarat, out of ₹3,583 crore nationally.",
      hi: "अकेले राष्ट्रीय परमिट गुजरात में साल में लगभग ₹193 करोड़ के हैं, देश भर के ₹3,583 करोड़ में से।",
      gu: "એકલા રાષ્ટ્રીય પરમિટ ગુજરાતમાં વર્ષે લગભગ ₹193 કરોડના છે, દેશભરના ₹3,583 કરોડમાંથી.",
    },
    needsVehicle: true,
    fee: 1000,
    stages: [
      { label: "Vehicle and route", kind: "info" },
      {
        label: "Permit type",
        kind: "pick",
        options: [
          { label: "National permit (goods)", price: 5000 },
          { label: "Gujarat state permit (goods)", price: 2000 },
          { label: "All India Tourist Permit", price: 7500 },
        ],
      },
      {
        label: "Document upload",
        kind: "docs",
        docs: ["RC copy", "Fitness certificate", "Tax receipt"],
      },
      { label: "Fee payment", kind: "fee" },
      { label: "Permit issued", kind: "info" },
    ],
  },
  {
    slug: "learner-licence",
    type: "LEARNER_LICENCE",
    title: {
      en: "Learner licence",
      hi: "लर्नर लाइसेंस",
      gu: "લર્નર લાઇસન્સ",
    },
    blurb: {
      en: "Gujarat's seven-stage learner flow, with the slot shown before you pay and no captcha to look at it.",
      hi: "गुजरात का सात-चरणों वाला लर्नर फ़्लो, जिसमें स्लॉट भुगतान से पहले दिखता है और उसे देखने के लिए कैप्चा नहीं चाहिए।",
      gu: "ગુજરાતનો સાત-તબક્કાનો લર્નર ફ્લો, જેમાં સ્લોટ ચુકવણી પહેલાં દેખાય છે અને તે જોવા માટે કેપ્ચા જોઈતો નથી.",
    },
    fact: {
      en: "Gujarat runs about 28 licence services contactless through Aadhaar eKYC, but a captcha stands between a citizen and merely viewing slot availability.",
      hi: "गुजरात लगभग 28 लाइसेंस सेवाएं आधार eKYC से संपर्करहित चलाता है, फिर भी सिर्फ़ स्लॉट देखने के लिए भी कैप्चा सामने आता है।",
      gu: "ગુજરાત લગભગ 28 લાઇસન્સ સેવાઓ આધાર eKYC થી સંપર્કરહિત ચલાવે છે, છતાં ફક્ત સ્લોટ જોવા માટે પણ કેપ્ચા આવે છે.",
    },
    needsVehicle: false,
    fee: 350,
    stages: [
      { label: "Applicant details", kind: "info" },
      { label: "RTO or Sewa Kendra", kind: "pick", options: GJ_RTOS.map((label) => ({ label })) },
      { label: "Aadhaar eKYC", kind: "info" },
      {
        label: "Document upload",
        kind: "docs",
        docs: ["Age proof", "Address proof", "Passport photo"],
      },
      { label: "Test slot", kind: "slot" },
      { label: "Fee payment", kind: "fee" },
      { label: "Receipt issued", kind: "info" },
    ],
  },
  {
    slug: "dl-renewal",
    type: "DL_RENEWAL",
    title: {
      en: "Driving licence renewal",
      hi: "ड्राइविंग लाइसेंस नवीनीकरण",
      gu: "ડ્રાઇવિંગ લાઇસન્સ રિન્યુઅલ",
    },
    blurb: {
      en: "Renew without hunting for an empanelled doctor on a separate portal — the Form 1A list is in the flow.",
      hi: "अलग पोर्टल पर सूचीबद्ध डॉक्टर खोजे बिना नवीनीकरण करें — Form 1A की सूची इसी प्रवाह में है।",
      gu: "અલગ પોર્ટલ પર સૂચિબદ્ધ ડૉક્ટર શોધ્યા વગર રિન્યુ કરો — Form 1A ની યાદી આ જ ફ્લોમાં છે.",
    },
    fact: {
      en: "Renewals after 40 need a Form 1A medical certificate, and finding an empanelled doctor is its own separate Sarathi tile today.",
      hi: "40 के बाद नवीनीकरण के लिए Form 1A मेडिकल प्रमाणपत्र चाहिए, और सूचीबद्ध डॉक्टर खोजना आज सारथी पर अलग टाइल है।",
      gu: "40 પછીના રિન્યુઅલ માટે Form 1A મેડિકલ પ્રમાણપત્ર જોઈએ, અને સૂચિબદ્ધ ડૉક્ટર શોધવો આજે સારથી પર અલગ ટાઇલ છે.",
    },
    needsVehicle: false,
    fee: 400,
    stages: [
      { label: "Licence details", kind: "info" },
      {
        label: "Form 1A empanelled doctor",
        kind: "pick",
        options: [
          { label: "Dr. Mehta, Civil Hospital, Ahmedabad" },
          { label: "Dr. Trivedi, Rajkot Sewa Kendra" },
          { label: "Dr. Shah, SMIMER, Surat" },
        ],
      },
      {
        label: "Document upload",
        kind: "docs",
        docs: ["Existing licence", "Form 1A", "Passport photo"],
      },
      { label: "Fee payment", kind: "fee" },
      { label: "RTO appointment", kind: "slot" },
      { label: "Licence dispatched", kind: "info" },
    ],
  },
  {
    slug: "fancy-number",
    type: "FANCY_NUMBER",
    title: {
      en: "Fancy number auction",
      hi: "फ़ैंसी नंबर नीलामी",
      gu: "ફેન્સી નંબર હરાજી",
    },
    blurb: {
      en: "See what is on offer before you sign in. Signing in is for bidding, not for browsing.",
      hi: "साइन इन करने से पहले देखें क्या उपलब्ध है। साइन इन बोली लगाने के लिए है, देखने के लिए नहीं।",
      gu: "સાઇન ઇન કરતાં પહેલાં જુઓ શું ઉપલબ્ધ છે. સાઇન ઇન બોલી લગાવવા માટે છે, જોવા માટે નહીં.",
    },
    fact: {
      en: "Auction cycles run in all 40 Gujarat RTO codes and the calendar is already public, yet the portal asks for a login before it shows you a single number.",
      hi: "नीलामी चक्र गुजरात के सभी 40 RTO कोड में चलते हैं और कैलेंडर पहले से सार्वजनिक है, फिर भी पोर्टल एक भी नंबर दिखाने से पहले लॉगिन मांगता है।",
      gu: "હરાજી ચક્ર ગુજરાતના બધા 40 RTO કોડમાં ચાલે છે અને કેલેન્ડર પહેલેથી જાહેર છે, છતાં પોર્ટલ એક પણ નંબર બતાવ્યા પહેલાં લોગિન માંગે છે.",
    },
    needsVehicle: false,
    browsable: true,
    fee: 0,
    stages: [
      {
        label: "Browse the current cycle",
        kind: "pick",
        options: [
          { label: "GJ01 CX 0001", price: 50000 },
          { label: "GJ01 CX 0007", price: 30000 },
          { label: "GJ01 CX 0786", price: 25000 },
          { label: "GJ01 CX 1111", price: 20000 },
          { label: "GJ01 CX 4545", price: 12000 },
          { label: "GJ01 CX 9999", price: 40000 },
        ],
      },
      { label: "Reserve price payment", kind: "fee" },
      { label: "Number allotted", kind: "info" },
    ],
  },
  {
    slug: "scrapping",
    type: "SCRAPPING",
    title: {
      en: "Scrap a vehicle",
      hi: "वाहन स्क्रैप करें",
      gu: "વાહન સ્ક્રેપ કરો",
    },
    blurb: {
      en: "End of life handled in the same account, and the Certificate of Deposit becomes a discount on your next registration.",
      hi: "जीवन का अंत उसी खाते में संभले, और जमा प्रमाणपत्र आपकी अगली पंजीकरण पर छूट बन जाए।",
      gu: "જીવનનો અંત એ જ ખાતામાં સંભળાય, અને જમા પ્રમાણપત્ર તમારી આગલી નોંધણી પર છૂટ બની જાય.",
    },
    fact: {
      en: "Gujarat has 12 registered vehicle scrapping facilities.",
      hi: "गुजरात में 12 पंजीकृत वाहन स्क्रैपिंग केंद्र हैं।",
      gu: "ગુજરાતમાં 12 નોંધાયેલાં વાહન સ્ક્રેપિંગ કેન્દ્રો છે.",
    },
    needsVehicle: true,
    fee: 0,
    stages: [
      { label: "Vehicle details", kind: "info" },
      {
        label: "Choose an RVSF",
        kind: "pick",
        options: [
          { label: "RVSF Ahmedabad, Changodar" },
          { label: "RVSF Rajkot, Metoda" },
          { label: "RVSF Surat, Palsana" },
        ],
      },
      { label: "Pickup slot", kind: "slot" },
      { label: "Certificate of Deposit issued", kind: "info" },
    ],
  },
  {
    slug: "grievance",
    type: "GRIEVANCE",
    title: {
      en: "Raise a grievance",
      hi: "शिकायत दर्ज करें",
      gu: "ફરિયાદ નોંધાવો",
    },
    blurb: {
      en: "One ticket, sitting next to the application it came from, instead of four separate complaint systems.",
      hi: "एक ही टिकट, उसी आवेदन के बगल में जिससे वह उठी — चार अलग शिकायत सिस्टम की जगह।",
      gu: "એક જ ટિકિટ, એ જ અરજીની બાજુમાં જેમાંથી તે ઊભી થઈ — ચાર અલગ ફરિયાદ સિસ્ટમની જગ્યાએ.",
    },
    fact: {
      en: "Grievances are spread across four systems today, and Sarathi's asks for a mobile number, a captcha and an OTP before it will even show you the form.",
      hi: "आज शिकायतें चार अलग सिस्टम में बंटी हैं, और सारथी का फ़ॉर्म दिखाने से पहले ही मोबाइल नंबर, कैप्चा और OTP मांगता है।",
      gu: "આજે ફરિયાદો ચાર અલગ સિસ્ટમમાં વહેંચાયેલી છે, અને સારથીનું ફોર્મ બતાવ્યા પહેલાં જ મોબાઇલ નંબર, કેપ્ચા અને OTP માંગે છે.",
    },
    needsVehicle: false,
    fee: 0,
    stages: [
      { label: "What went wrong", kind: "text" },
      {
        label: "Which service",
        kind: "pick",
        options: [
          { label: "Transfer of ownership" },
          { label: "Fitness or ATS booking" },
          { label: "Licence services" },
          { label: "Permits or tax" },
          { label: "Something else" },
        ],
      },
      { label: "Ticket raised", kind: "info" },
    ],
  },
];

export function findService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
