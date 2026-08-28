"use client";
// ponytail: plain dictionary instead of react-i18next — two locales, ~60 keys,
// swap in react-i18next when locale count or pluralization demands it.
import { useApp } from "./store";

const dict = {
  appName: { en: "Sarathi One", hi: "सारथी वन" },
  tagline: {
    en: "Every vehicle & licence service. One login. One place.",
    hi: "हर वाहन और लाइसेंस सेवा। एक लॉगिन। एक जगह।",
  },
  disclaimer: {
    en: "Hackathon demo. Not a government product. All data is synthetic.",
    hi: "हैकाथॉन डेमो। सरकारी उत्पाद नहीं। सभी डेटा नकली है।",
  },
  checkVehicle: { en: "Check a vehicle", hi: "वाहन जांचें" },
  myGarage: { en: "My Garage", hi: "मेरा गैराज" },
  transfer: { en: "Transfer ownership", hi: "स्वामित्व ट्रांसफर" },
  crashCard: { en: "Crash Card", hi: "क्रैश कार्ड" },
  status: { en: "Application status", hi: "आवेदन स्थिति" },
  changelog: { en: "What's new", hi: "नया क्या है" },
  howItWorks: { en: "How it works", hi: "यह कैसे काम करता है" },
  login: { en: "Login", hi: "लॉगिन" },
  logout: { en: "Logout", hi: "लॉगआउट" },
  mobileNumber: { en: "Mobile number", hi: "मोबाइल नंबर" },
  sendOtp: { en: "Send OTP", hi: "OTP भेजें" },
  enterOtp: { en: "Enter OTP", hi: "OTP दर्ज करें" },
  verify: { en: "Verify & login", hi: "सत्यापित करें और लॉगिन करें" },
  regNoPlaceholder: { en: "e.g. GJ01AB1234", hi: "जैसे GJ01AB1234" },
  enterRegNo: { en: "Enter vehicle registration number", hi: "वाहन पंजीकरण नंबर दर्ज करें" },
  freeSummary: {
    en: "Free summary (what the current portal shows)",
    hi: "मुफ्त सारांश (मौजूदा पोर्टल जितनी जानकारी)",
  },
  unlockReport: { en: "Unlock full Trust Report", hi: "पूरी ट्रस्ट रिपोर्ट खोलें" },
  trustReport: { en: "Trust Report", hi: "ट्रस्ट रिपोर्ट" },
  ownership: { en: "Ownership timeline", hi: "स्वामित्व इतिहास" },
  loanPanel: { en: "Loan & hypothecation", hi: "लोन और हाइपोथिकेशन" },
  challans: { en: "Challan history", hi: "चालान इतिहास" },
  documents: { en: "Document validity", hi: "दस्तावेज़ वैधता" },
  aiVerdict: { en: "AI verdict", hi: "AI राय" },
  emiCalc: { en: "EMI calculator", hi: "EMI कैलकुलेटर" },
  startTransfer: { en: "Start guided transfer", hi: "गाइडेड ट्रांसफर शुरू करें" },
  payments: { en: "Payments", hi: "भुगतान" },
  applications: { en: "Applications", hi: "आवेदन" },
  vehicles: { en: "My vehicles", hi: "मेरे वाहन" },
  nudges: { en: "Needs attention", hi: "ध्यान दें" },
  version: { en: "Version", hi: "संस्करण" },

  // check page
  demoFleet: { en: "Demo fleet", hi: "डेमो वाहन सूची" },
  noVehicle: {
    en: "No vehicle found. Use a demo number above.",
    hi: "कोई वाहन नहीं मिला। ऊपर दिया कोई नंबर आज़माएं।",
  },
  officialLimit: {
    en: "This is everything the current official lookup shows a buyer — owner masked, loan reduced to yes/no, no ownership count, no accident history, capped at 3 lookups/day.",
    hi: "मौजूदा सरकारी लुकअप खरीदार को बस इतना दिखाता है — मालिक का नाम छिपा, लोन सिर्फ हां/ना, मालिकों की संख्या नहीं, दुर्घटना इतिहास नहीं, दिन में केवल 3 बार।",
  },
  payMock: {
    en: "No money moves. This simulates a UPI or card payment.",
    hi: "कोई पैसा नहीं कटता। यह UPI या कार्ड भुगतान की नकल है।",
  },
  sellerConsent: { en: "Seller consent", hi: "विक्रेता की सहमति" },
  consentExplain: {
    en: "Full data unlocks only with the current owner's consent — the same consent model MoRTH's data-sharing policy proposes.",
    hi: "पूरा डेटा केवल मौजूदा मालिक की सहमति से खुलता है — वही सहमति मॉडल जो MoRTH की डेटा-साझा नीति प्रस्तावित करती है।",
  },
  unlockNow: { en: "Unlock report", hi: "रिपोर्ट खोलें" },
  openReport: { en: "Open Trust Report", hi: "ट्रस्ट रिपोर्ट खोलें" },
  demoOtpIs: { en: "Demo OTP", hi: "डेमो OTP" },

  // report page
  vehicle: { en: "Vehicle", hi: "वाहन" },
  fairPrice: { en: "Fair price", hi: "उचित कीमत" },
  consented: {
    en: "Full names shown — seller consented",
    hi: "पूरे नाम दिख रहे हैं — विक्रेता ने सहमति दी",
  },
  noLoan: { en: "No active loan on the RC.", hi: "RC पर कोई सक्रिय लोन नहीं।" },
  activeLoan: { en: "Active loan", hi: "सक्रिय लोन" },
  onlyYesNo: {
    en: 'The current portal shows only "Hypothecated: YES". The financier\'s name above is the detail buyers actually need.',
    hi: 'मौजूदा पोर्टल सिर्फ "Hypothecated: YES" दिखाता है। ऊपर दिया बैंक का नाम ही वह जानकारी है जो खरीदार को चाहिए।',
  },
  noChallans: { en: "No challans on record.", hi: "कोई चालान दर्ज नहीं।" },
  pending: { en: "pending", hi: "बकाया" },
  expired: { en: "EXPIRED", hi: "समाप्त" },
  accidentRecord: { en: "Accident record", hi: "दुर्घटना रिकॉर्ड" },
  noAccident: {
    en: "No accident reports linked to this vehicle.",
    hi: "इस वाहन से कोई दुर्घटना रिपोर्ट जुड़ी नहीं है।",
  },
  accidentNote: {
    en: "No citizen-facing accident data exists today; this shows what consented eDAR integration could surface.",
    hi: "आज नागरिकों के लिए दुर्घटना डेटा उपलब्ध नहीं है; यह दिखाता है कि सहमति-आधारित eDAR एकीकरण क्या दे सकता है।",
  },
  loanAmount: { en: "Loan amount", hi: "लोन राशि" },
  interestRate: { en: "Interest % / year", hi: "ब्याज % / वर्ष" },
  tenure: { en: "Tenure (months)", hi: "अवधि (महीने)" },
  monthlyEmi: { en: "Monthly EMI", hi: "मासिक EMI" },
  totalInterest: { en: "total interest", hi: "कुल ब्याज" },

  // transfer wizard
  transferIntro: {
    en: "Today this journey is 4 disconnected portals (Form 29/30, Form 35, ePayment, slot booking). Here it is one flow.",
    hi: "आज यह यात्रा 4 अलग-अलग पोर्टल पर होती है (Form 29/30, Form 35, ePayment, स्लॉट बुकिंग)। यहां यह एक ही प्रवाह है।",
  },
  progress: { en: "Progress", hi: "प्रगति" },
  seller: { en: "Seller", hi: "विक्रेता" },
  buyerName: { en: "Buyer full name", hi: "खरीदार का पूरा नाम" },
  buyerMobile: { en: "Buyer mobile", hi: "खरीदार का मोबाइल" },
  continueBtn: { en: "Continue", hi: "आगे बढ़ें" },
  upload: { en: "Upload", hi: "अपलोड" },
  docsIntro: {
    en: "RC and insurance are fetched from the registry — you only upload identity documents.",
    hi: "RC और बीमा रजिस्ट्री से आ जाते हैं — आपको केवल पहचान दस्तावेज़ अपलोड करने हैं।",
  },
  total: { en: "Total", hi: "कुल" },
  payNow: { en: "Pay (mock gateway)", hi: "भुगतान करें (नकली गेटवे)" },
  esignNote: {
    en: "Seller e-signs Form 29 with an OTP.",
    hi: "विक्रेता OTP से Form 29 पर ई-हस्ताक्षर करता है।",
  },
  esignBtn: { en: "e-Sign & continue", hi: "ई-हस्ताक्षर करें और आगे बढ़ें" },
  slotNote: {
    en: "Buyer verification visit. Pick a date — no separate slot portal, no captcha just to see availability.",
    hi: "खरीदार सत्यापन हेतु विज़िट। तारीख चुनें — कोई अलग स्लॉट पोर्टल नहीं, उपलब्धता देखने के लिए कैप्चा नहीं।",
  },
  bookSlot: { en: "Book slot", hi: "स्लॉट बुक करें" },
  submitApp: { en: "Submit application", hi: "आवेदन जमा करें" },
  submitted: { en: "Application submitted", hi: "आवेदन जमा हो गया" },
  trackIt: { en: "Track status", hi: "स्थिति देखें" },
  formsCombined: {
    en: "Statutory Forms 29 (seller) + 30 (buyer), combined",
    hi: "वैधानिक Form 29 (विक्रेता) + 30 (खरीदार), एक साथ",
  },
  bundleForm35: { en: "Bundle Form 35 & continue", hi: "Form 35 जोड़ें और आगे बढ़ें" },
  noHypo: {
    en: "No hypothecation on the RC — nothing to terminate.",
    hi: "RC पर कोई हाइपोथिकेशन नहीं — कुछ समाप्त करने की जरूरत नहीं।",
  },
} as const;

export type TKey = keyof typeof dict;

export function useT() {
  const locale = useApp((s) => s.locale);
  return (key: TKey) => dict[key][locale];
}
