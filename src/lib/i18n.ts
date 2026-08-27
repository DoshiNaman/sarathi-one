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
  freeSummary: { en: "Free summary (what the current portal shows)", hi: "मुफ्त सारांश (मौजूदा पोर्टल जितनी जानकारी)" },
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
} as const;

export type TKey = keyof typeof dict;

export function useT() {
  const locale = useApp((s) => s.locale);
  return (key: TKey) => dict[key][locale];
}
