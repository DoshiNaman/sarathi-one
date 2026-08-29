"use client";
// ponytail: plain dictionary instead of react-i18next — three locales, ~110
// keys, no pluralization or date formatting yet. Swap in react-i18next when any
// of those three things stops being true.
import { useApp } from "./store";

export { LOCALES, type Locale } from "./locales";

const dict = {
  appName: { en: "Sarathi One", hi: "सारथी वन", gu: "સારથી વન" },
  tagline: {
    en: "Every vehicle & licence service. One login. One place.",
    hi: "हर वाहन और लाइसेंस सेवा। एक लॉगिन। एक जगह।",
    gu: "દરેક વાહન અને લાઇસન્સ સેવા. એક લોગિન. એક જગ્યા.",
  },
  languageLabel: { en: "Language", hi: "भाषा", gu: "ભાષા" },
  disclaimerTag: { en: "Demo", hi: "डेमो", gu: "ડેમો" },
  disclaimer: {
    en: "A prototype, not a government service. Every vehicle, OTP and payment here is invented.",
    hi: "यह एक प्रोटोटाइप है, सरकारी सेवा नहीं। यहां हर वाहन, OTP और भुगतान काल्पनिक है।",
    gu: "આ એક પ્રોટોટાઇપ છે, સરકારી સેવા નથી. અહીં દરેક વાહન, OTP અને ચુકવણી કાલ્પનિક છે.",
  },
  disclaimerLink: { en: "What's real", hi: "क्या असली है", gu: "શું સાચું છે" },
  checkVehicle: { en: "Check a vehicle", hi: "वाहन जांचें", gu: "વાહન તપાસો" },
  myGarage: { en: "My Garage", hi: "मेरा गैराज", gu: "મારું ગેરેજ" },
  transfer: { en: "Transfer ownership", hi: "स्वामित्व ट्रांसफर", gu: "માલિકી ટ્રાન્સફર" },
  crashCard: { en: "Crash Card", hi: "क्रैश कार्ड", gu: "ક્રેશ કાર્ડ" },
  status: { en: "Application status", hi: "आवेदन स्थिति", gu: "અરજીની સ્થિતિ" },
  changelog: { en: "What's new", hi: "नया क्या है", gu: "નવું શું છે" },
  howItWorks: { en: "How it works", hi: "यह कैसे काम करता है", gu: "તે કેવી રીતે કામ કરે છે" },
  // Short forms for the header, where the full labels wrap onto two lines.
  navCheck: { en: "Check", hi: "जांचें", gu: "તપાસો" },
  navGarage: { en: "Garage", hi: "गैराज", gu: "ગેરેજ" },
  navStatus: { en: "Status", hi: "स्थिति", gu: "સ્થિતિ" },
  navServices: { en: "Services", hi: "सेवाएं", gu: "સેવાઓ" },
  navHow: { en: "How it works", hi: "कैसे काम करता है", gu: "કેવી રીતે કામ કરે" },
  login: { en: "Login", hi: "लॉगिन", gu: "લોગિન" },
  logout: { en: "Logout", hi: "लॉगआउट", gu: "લોગઆઉટ" },
  mobileNumber: { en: "Mobile number", hi: "मोबाइल नंबर", gu: "મોબાઇલ નંબર" },
  sendOtp: { en: "Send OTP", hi: "OTP भेजें", gu: "OTP મોકલો" },
  enterOtp: { en: "Enter OTP", hi: "OTP दर्ज करें", gu: "OTP દાખલ કરો" },
  verify: {
    en: "Verify & login",
    hi: "सत्यापित करें और लॉगिन करें",
    gu: "ચકાસો અને લોગિન કરો",
  },
  regNoPlaceholder: { en: "e.g. GJ01AB1234", hi: "जैसे GJ01AB1234", gu: "દા.ત. GJ01AB1234" },
  enterRegNo: {
    en: "Enter vehicle registration number",
    hi: "वाहन पंजीकरण नंबर दर्ज करें",
    gu: "વાહન નોંધણી નંબર દાખલ કરો",
  },
  freeSummary: {
    en: "Free summary (what the current portal shows)",
    hi: "मुफ्त सारांश (मौजूदा पोर्टल जितनी जानकारी)",
    gu: "મફત સારાંશ (હાલનું પોર્ટલ જેટલું બતાવે છે)",
  },
  unlockReport: {
    en: "Unlock full Trust Report",
    hi: "पूरी ट्रस्ट रिपोर्ट खोलें",
    gu: "સંપૂર્ણ ટ્રસ્ટ રિપોર્ટ ખોલો",
  },
  trustReport: { en: "Trust Report", hi: "ट्रस्ट रिपोर्ट", gu: "ટ્રસ્ટ રિપોર્ટ" },
  ownership: { en: "Ownership timeline", hi: "स्वामित्व इतिहास", gu: "માલિકીનો ઇતિહાસ" },
  loanPanel: { en: "Loan & hypothecation", hi: "लोन और हाइपोथिकेशन", gu: "લોન અને હાઇપોથિકેશન" },
  challans: { en: "Challan history", hi: "चालान इतिहास", gu: "ચલણનો ઇતિહાસ" },
  documents: { en: "Document validity", hi: "दस्तावेज़ वैधता", gu: "દસ્તાવેજની માન્યતા" },
  aiVerdict: { en: "AI verdict", hi: "AI राय", gu: "AI અભિપ્રાય" },
  emiCalc: { en: "EMI calculator", hi: "EMI कैलकुलेटर", gu: "EMI કેલ્ક્યુલેટર" },
  startTransfer: {
    en: "Start guided transfer",
    hi: "गाइडेड ट्रांसफर शुरू करें",
    gu: "ગાઇડેડ ટ્રાન્સફર શરૂ કરો",
  },
  payments: { en: "Payments", hi: "भुगतान", gu: "ચુકવણીઓ" },
  applications: { en: "Applications", hi: "आवेदन", gu: "અરજીઓ" },
  vehicles: { en: "My vehicles", hi: "मेरे वाहन", gu: "મારાં વાહનો" },
  nudges: { en: "Needs attention", hi: "ध्यान दें", gu: "ધ્યાન આપો" },
  version: { en: "Version", hi: "संस्करण", gu: "આવૃત્તિ" },

  // landing — hero
  heroTitle: {
    en: "Everything a vehicle needs. In one place.",
    hi: "वाहन को जो कुछ चाहिए। एक ही जगह।",
    gu: "વાહનને જે કંઈ જોઈએ. એક જ જગ્યાએ.",
  },
  heroSub: {
    en: "Check a used vehicle before you buy it. Transfer it without touching four portals. Keep every document, application and receipt in one account.",
    hi: "खरीदने से पहले पुराना वाहन जांचें। चार पोर्टल छुए बिना ट्रांसफर करें। हर दस्तावेज़, आवेदन और रसीद एक ही खाते में रखें।",
    gu: "ખરીદતા પહેલાં જૂનું વાહન તપાસો. ચાર પોર્ટલને અડ્યા વગર ટ્રાન્સફર કરો. દરેક દસ્તાવેજ, અરજી અને રસીદ એક જ ખાતામાં રાખો.",
  },
  whatIsMocked: {
    en: "What is real, what is mocked",
    hi: "क्या असली है, क्या नकली",
    gu: "શું સાચું છે, શું નકલી",
  },
  notAffiliated: {
    en: "An independent prototype — not affiliated with MoRTH, NIC or Parivahan Sewa. Every vehicle, OTP and payment here is synthetic.",
    hi: "एक स्वतंत्र प्रोटोटाइप — MoRTH, NIC या परिवहन सेवा से संबद्ध नहीं। यहां हर वाहन, OTP और भुगतान काल्पनिक है।",
    gu: "એક સ્વતંત્ર પ્રોટોટાઇપ — MoRTH, NIC કે પરિવહન સેવા સાથે સંલગ્ન નથી. અહીં દરેક વાહન, OTP અને ચુકવણી કાલ્પનિક છે.",
  },

  // landing — prism panel
  portalReturns: {
    en: "What the portal returns",
    hi: "पोर्टल क्या देता है",
    gu: "પોર્ટલ શું આપે છે",
  },
  threeLookups: {
    en: "…and three lookups a day.",
    hi: "…और दिन में सिर्फ तीन बार।",
    gu: "…અને દિવસમાં માત્ર ત્રણ વાર.",
  },
  financier: { en: "Financier", hi: "वित्तदाता बैंक", gu: "ધિરાણ બેંક" },
  form35: { en: "Form 35", hi: "Form 35", gu: "Form 35" },
  neverFiled: { en: "Never filed", hi: "कभी दाखिल नहीं", gu: "ક્યારેય દાખલ નહીં" },
  challansShort: { en: "Challans", hi: "चालान", gu: "ચલણ" },
  pendingAmount: { en: "₹500 pending", hi: "₹500 बकाया", gu: "₹500 બાકી" },

  // landing — eight portals
  portalsEyebrow: {
    en: "What Parivahan makes you use today",
    hi: "आज परिवहन आपसे क्या-क्या इस्तेमाल कराता है",
    gu: "આજે પરિવહન તમારી પાસે શું શું વપરાવે છે",
  },
  portalsTitle: {
    en: "Selling one vehicle means eight government portals, four logins, a captcha per page.",
    hi: "एक वाहन बेचने का मतलब है आठ सरकारी पोर्टल, चार लॉगिन, हर पेज पर एक कैप्चा।",
    gu: "એક વાહન વેચવાનો અર્થ છે આઠ સરકારી પોર્ટલ, ચાર લોગિન, દરેક પેજ પર એક કેપ્ચા.",
  },
  portalsBody: {
    en: "Form 29/30 on Vahan, Form 35 for the loan, a separate payment app and a separate slot-booking app — each with its own design, its own login and its own captcha. This replaces all of it with one account.",
    hi: "वाहन पर Form 29/30, लोन के लिए Form 35, अलग भुगतान ऐप और अलग स्लॉट-बुकिंग ऐप — हर एक का अपना डिज़ाइन, अपना लॉगिन और अपना कैप्चा। इन सबकी जगह एक खाता।",
    gu: "વાહન પર Form 29/30, લોન માટે Form 35, અલગ ચુકવણી એપ અને અલગ સ્લોટ-બુકિંગ એપ — દરેકનું પોતાનું ડિઝાઇન, પોતાનું લોગિન અને પોતાનો કેપ્ચા. આ બધાની જગ્યાએ એક ખાતું.",
  },
  signIn: { en: "Sign in", hi: "साइन इन", gu: "સાઇન ઇન" },
  oneLoginOnePlace: {
    en: "one login · one place",
    hi: "एक लॉगिन · एक जगह",
    gu: "એક લોગિન · એક જગ્યા",
  },

  // landing — the loan section
  beforeYouPay: { en: "Before you pay", hi: "भुगतान से पहले", gu: "ચુકવણી પહેલાં" },
  loanTitle: {
    en: "The loan is the thing nobody tells you about.",
    hi: "लोन वह चीज़ है जिसके बारे में कोई नहीं बताता।",
    gu: "લોન એ વાત છે જેના વિશે કોઈ કહેતું નથી.",
  },
  loanBody: {
    en: 'The official record says only "Hypothecated: YES". It will not tell you which bank, or whether Form 35 was ever filed. Until it is, the bank still has a claim on the car — and you are the one who paid for it.',
    hi: 'सरकारी रिकॉर्ड सिर्फ़ "Hypothecated: YES" कहता है। वह यह नहीं बताएगा कि कौन सा बैंक, या Form 35 कभी दाखिल हुआ या नहीं। जब तक वह नहीं होता, बैंक का दावा गाड़ी पर बना रहता है — और पैसे आपने दिए हैं।',
    gu: 'સરકારી રેકોર્ડ ફક્ત "Hypothecated: YES" કહે છે. તે નહીં જણાવે કે કઈ બેંક, કે Form 35 ક્યારેય દાખલ થયું કે નહીં. જ્યાં સુધી તે ન થાય, બેંકનો દાવો ગાડી પર રહે છે — અને પૈસા તમે આપ્યા છે.',
  },
  seeTrustReport: {
    en: "See a Trust Report",
    hi: "ट्रस्ट रिपोर्ट देखें",
    gu: "ટ્રસ્ટ રિપોર્ટ જુઓ",
  },
  caution: { en: "Caution", hi: "सावधान", gu: "સાવધાન" },
  // {bank} is replaced with the financier's name, which stays in Latin script
  // in every locale because that is how the RC prints it.
  trustCardBody: {
    en: "Active loan with {bank}. Form 35 was never filed, so the bank's claim is still on the RC. Do not pay the seller in full until it clears.",
    hi: "{bank} के साथ सक्रिय लोन। Form 35 कभी दाखिल नहीं हुआ, इसलिए बैंक का दावा अब भी RC पर है। जब तक यह नहीं हटता, विक्रेता को पूरा भुगतान न करें।",
    gu: "{bank} સાથે સક્રિય લોન. Form 35 ક્યારેય દાખલ થયું નથી, તેથી બેંકનો દાવો હજુ RC પર છે. જ્યાં સુધી તે દૂર ન થાય, વેચનારને પૂરી ચુકવણી ન કરો.",
  },
  ownersLabel: { en: "Owners", hi: "मालिक", gu: "માલિકો" },
  pendingChallans: { en: "Pending challans", hi: "बकाया चालान", gu: "બાકી ચલણ" },
  noneLabel: { en: "None", hi: "कोई नहीं", gu: "કોઈ નહીં" },

  // check page
  demoFleet: { en: "Demo fleet", hi: "डेमो वाहन सूची", gu: "ડેમો વાહન યાદી" },
  noVehicle: {
    en: "No vehicle found. Use a demo number above.",
    hi: "कोई वाहन नहीं मिला। ऊपर दिया कोई नंबर आज़माएं।",
    gu: "કોઈ વાહન મળ્યું નથી. ઉપર આપેલો કોઈ નંબર અજમાવો.",
  },
  officialLimit: {
    en: "This is everything the current official lookup shows a buyer — owner masked, loan reduced to yes/no, no ownership count, no accident history, capped at 3 lookups/day.",
    hi: "मौजूदा सरकारी लुकअप खरीदार को बस इतना दिखाता है — मालिक का नाम छिपा, लोन सिर्फ हां/ना, मालिकों की संख्या नहीं, दुर्घटना इतिहास नहीं, दिन में केवल 3 बार।",
    gu: "હાલનું સરકારી લુકઅપ ખરીદનારને આટલું જ બતાવે છે — માલિકનું નામ છુપાયેલું, લોન માત્ર હા/ના, માલિકોની સંખ્યા નહીં, અકસ્માતનો ઇતિહાસ નહીં, દિવસમાં માત્ર 3 વાર.",
  },
  payMock: {
    en: "No money moves. This simulates a UPI or card payment.",
    hi: "कोई पैसा नहीं कटता। यह UPI या कार्ड भुगतान की नकल है।",
    gu: "કોઈ પૈસા કપાતા નથી. આ UPI કે કાર્ડ ચુકવણીની નકલ છે.",
  },
  sellerConsent: { en: "Seller consent", hi: "विक्रेता की सहमति", gu: "વેચનારની સંમતિ" },
  consentExplain: {
    en: "Full data unlocks only with the current owner's consent — the same consent model MoRTH's data-sharing policy proposes.",
    hi: "पूरा डेटा केवल मौजूदा मालिक की सहमति से खुलता है — वही सहमति मॉडल जो MoRTH की डेटा-साझा नीति प्रस्तावित करती है।",
    gu: "સંપૂર્ણ ડેટા ફક્ત હાલના માલિકની સંમતિથી ખૂલે છે — એ જ સંમતિ મોડેલ જે MoRTH ની ડેટા-શેરિંગ નીતિ સૂચવે છે.",
  },
  unlockNow: { en: "Unlock report", hi: "रिपोर्ट खोलें", gu: "રિપોર્ટ ખોલો" },
  openReport: { en: "Open Trust Report", hi: "ट्रस्ट रिपोर्ट खोलें", gu: "ટ્રસ્ટ રિપોર્ટ ખોલો" },
  demoOtpIs: { en: "Demo OTP", hi: "डेमो OTP", gu: "ડેમો OTP" },

  // report page
  vehicle: { en: "Vehicle", hi: "वाहन", gu: "વાહન" },
  fairPrice: { en: "Fair price", hi: "उचित कीमत", gu: "વાજબી કિંમત" },
  consented: {
    en: "Full names shown — seller consented",
    hi: "पूरे नाम दिख रहे हैं — विक्रेता ने सहमति दी",
    gu: "પૂરાં નામ દેખાય છે — વેચનારે સંમતિ આપી",
  },
  noLoan: {
    en: "No active loan on the RC.",
    hi: "RC पर कोई सक्रिय लोन नहीं।",
    gu: "RC પર કોઈ સક્રિય લોન નથી.",
  },
  activeLoan: { en: "Active loan", hi: "सक्रिय लोन", gu: "સક્રિય લોન" },
  onlyYesNo: {
    en: 'The current portal shows only "Hypothecated: YES". The financier\'s name above is the detail buyers actually need.',
    hi: 'मौजूदा पोर्टल सिर्फ "Hypothecated: YES" दिखाता है। ऊपर दिया बैंक का नाम ही वह जानकारी है जो खरीदार को चाहिए।',
    gu: 'હાલનું પોર્ટલ ફક્ત "Hypothecated: YES" બતાવે છે. ઉપર આપેલું બેંકનું નામ જ ખરીદનારને જોઈતી માહિતી છે.',
  },
  noChallans: {
    en: "No challans on record.",
    hi: "कोई चालान दर्ज नहीं।",
    gu: "કોઈ ચલણ નોંધાયેલું નથી.",
  },
  pending: { en: "pending", hi: "बकाया", gu: "બાકી" },
  expired: { en: "EXPIRED", hi: "समाप्त", gu: "સમાપ્ત" },
  accidentRecord: { en: "Accident record", hi: "दुर्घटना रिकॉर्ड", gu: "અકસ્માતનો રેકોર્ડ" },
  noAccident: {
    en: "No accident reports linked to this vehicle.",
    hi: "इस वाहन से कोई दुर्घटना रिपोर्ट जुड़ी नहीं है।",
    gu: "આ વાહન સાથે કોઈ અકસ્માત રિપોર્ટ જોડાયેલી નથી.",
  },
  accidentNote: {
    en: "No citizen-facing accident data exists today; this shows what consented eDAR integration could surface.",
    hi: "आज नागरिकों के लिए दुर्घटना डेटा उपलब्ध नहीं है; यह दिखाता है कि सहमति-आधारित eDAR एकीकरण क्या दे सकता है।",
    gu: "આજે નાગરિકો માટે અકસ્માતનો ડેટા ઉપલબ્ધ નથી; આ બતાવે છે કે સંમતિ-આધારિત eDAR જોડાણ શું આપી શકે.",
  },
  loanAmount: { en: "Loan amount", hi: "लोन राशि", gu: "લોનની રકમ" },
  interestRate: { en: "Interest % / year", hi: "ब्याज % / वर्ष", gu: "વ્યાજ % / વર્ષ" },
  tenure: { en: "Tenure (months)", hi: "अवधि (महीने)", gu: "મુદત (મહિના)" },
  monthlyEmi: { en: "Monthly EMI", hi: "मासिक EMI", gu: "માસિક EMI" },
  totalInterest: { en: "total interest", hi: "कुल ब्याज", gu: "કુલ વ્યાજ" },

  // transfer wizard
  transferIntro: {
    en: "Today this journey is 4 disconnected portals (Form 29/30, Form 35, ePayment, slot booking). Here it is one flow.",
    hi: "आज यह यात्रा 4 अलग-अलग पोर्टल पर होती है (Form 29/30, Form 35, ePayment, स्लॉट बुकिंग)। यहां यह एक ही प्रवाह है।",
    gu: "આજે આ પ્રક્રિયા 4 અલગ-અલગ પોર્ટલ પર થાય છે (Form 29/30, Form 35, ePayment, સ્લોટ બુકિંગ). અહીં તે એક જ પ્રવાહ છે.",
  },
  progress: { en: "Progress", hi: "प्रगति", gu: "પ્રગતિ" },
  seller: { en: "Seller", hi: "विक्रेता", gu: "વેચનાર" },
  buyerName: { en: "Buyer full name", hi: "खरीदार का पूरा नाम", gu: "ખરીદનારનું પૂરું નામ" },
  buyerMobile: { en: "Buyer mobile", hi: "खरीदार का मोबाइल", gu: "ખરીદનારનો મોબાઇલ" },
  continueBtn: { en: "Continue", hi: "आगे बढ़ें", gu: "આગળ વધો" },
  upload: { en: "Upload", hi: "अपलोड", gu: "અપલોડ" },
  docsIntro: {
    en: "RC and insurance are fetched from the registry — you only upload identity documents.",
    hi: "RC और बीमा रजिस्ट्री से आ जाते हैं — आपको केवल पहचान दस्तावेज़ अपलोड करने हैं।",
    gu: "RC અને વીમો રજિસ્ટ્રીમાંથી આવી જાય છે — તમારે ફક્ત ઓળખના દસ્તાવેજ અપલોડ કરવાના છે.",
  },
  total: { en: "Total", hi: "कुल", gu: "કુલ" },
  payNow: {
    en: "Pay (mock gateway)",
    hi: "भुगतान करें (नकली गेटवे)",
    gu: "ચુકવણી કરો (નકલી ગેટવે)",
  },
  esignNote: {
    en: "Seller e-signs Form 29 with an OTP.",
    hi: "विक्रेता OTP से Form 29 पर ई-हस्ताक्षर करता है।",
    gu: "વેચનાર OTP થી Form 29 પર ઈ-સહી કરે છે.",
  },
  esignBtn: {
    en: "e-Sign & continue",
    hi: "ई-हस्ताक्षर करें और आगे बढ़ें",
    gu: "ઈ-સહી કરો અને આગળ વધો",
  },
  slotNote: {
    en: "Buyer verification visit. Pick a date — no separate slot portal, no captcha just to see availability.",
    hi: "खरीदार सत्यापन हेतु विज़िट। तारीख चुनें — कोई अलग स्लॉट पोर्टल नहीं, उपलब्धता देखने के लिए कैप्चा नहीं।",
    gu: "ખરીદનારની ચકાસણી માટે મુલાકાત. તારીખ પસંદ કરો — કોઈ અલગ સ્લોટ પોર્ટલ નહીં, ઉપલબ્ધતા જોવા માટે કેપ્ચા નહીં.",
  },
  bookSlot: { en: "Book slot", hi: "स्लॉट बुक करें", gu: "સ્લોટ બુક કરો" },
  submitApp: { en: "Submit application", hi: "आवेदन जमा करें", gu: "અરજી સબમિટ કરો" },
  submitted: { en: "Application submitted", hi: "आवेदन जमा हो गया", gu: "અરજી સબમિટ થઈ ગઈ" },
  trackIt: { en: "Track status", hi: "स्थिति देखें", gu: "સ્થિતિ જુઓ" },
  formsCombined: {
    en: "Statutory Forms 29 (seller) + 30 (buyer), combined",
    hi: "वैधानिक Form 29 (विक्रेता) + 30 (खरीदार), एक साथ",
    gu: "વૈધાનિક Form 29 (વેચનાર) + 30 (ખરીદનાર), એકસાથે",
  },
  bundleForm35: {
    en: "Bundle Form 35 & continue",
    hi: "Form 35 जोड़ें और आगे बढ़ें",
    gu: "Form 35 જોડો અને આગળ વધો",
  },
  noHypo: {
    en: "No hypothecation on the RC — nothing to terminate.",
    hi: "RC पर कोई हाइपोथिकेशन नहीं — कुछ समाप्त करने की जरूरत नहीं।",
    gu: "RC પર કોઈ હાઇપોથિકેશન નથી — સમાપ્ત કરવાનું કંઈ નથી.",
  },

  // footer
  footerNote: {
    en: "Sarathi One — hackathon prototype, not affiliated with MoRTH or NIC.",
    hi: "सारथी वन — हैकाथॉन प्रोटोटाइप, MoRTH या NIC से संबद्ध नहीं।",
    gu: "સારથી વન — હેકાથોન પ્રોટોટાઇપ, MoRTH કે NIC સાથે સંલગ્ન નથી.",
  },
  footerWhatIsReal: { en: "What is real", hi: "क्या असली है", gu: "શું સાચું છે" },
  footerVersions: { en: "Versions", hi: "संस्करण", gu: "આવૃત્તિઓ" },
  footerStaff: { en: "Staff sign-in", hi: "स्टाफ़ साइन-इन", gu: "સ્ટાફ સાઇન-ઇન" },

  // Krishna
  krishna: { en: "Krishna", hi: "कृष्ण", gu: "કૃષ્ણ" },
  krishnaOpen: { en: "Ask Krishna", hi: "कृष्ण से पूछें", gu: "કૃષ્ણને પૂછો" },
  krishnaIdle: {
    en: "Help with the paperwork",
    hi: "कागजी काम में मदद",
    gu: "કાગળકામમાં મદદ",
  },
  krishnaAsk: {
    en: "Ask anything about the paperwork — in English, Hindi or Gujarati.",
    hi: "कागजी काम के बारे में कुछ भी पूछें — अंग्रेज़ी, हिंदी या गुजराती में।",
    gu: "કાગળકામ વિશે કંઈ પણ પૂછો — અંગ્રેજી, હિન્દી કે ગુજરાતીમાં.",
  },
  krishnaPlaceholder: { en: "Type your question…", hi: "अपना सवाल लिखें…", gu: "તમારો સવાલ લખો…" },
  krishnaQuestion: { en: "Question", hi: "सवाल", gu: "સવાલ" },
  krishnaSend: { en: "Send", hi: "भेजें", gu: "મોકલો" },
  krishnaClear: { en: "Clear conversation", hi: "बातचीत साफ़ करें", gu: "વાતચીત સાફ કરો" },
  krishnaClose: { en: "Close", hi: "बंद करें", gu: "બંધ કરો" },
  krishnaOffline: {
    en: "offline answer — the model did not respond",
    hi: "ऑफ़लाइन उत्तर — मॉडल ने जवाब नहीं दिया",
    gu: "ઓફલાઇન જવાબ — મોડેલે જવાબ આપ્યો નથી",
  },
  krishnaUnreachable: {
    en: "Could not reach the helper. Please try again.",
    hi: "सहायक तक नहीं पहुंच सके। दोबारा कोशिश करें।",
    gu: "સહાયક સુધી પહોંચી શકાયું નથી. ફરી પ્રયાસ કરો.",
  },
  krishnaFailed: { en: "Something went wrong.", hi: "कुछ गड़बड़ हो गई।", gu: "કંઈક ખોટું થયું." },
  modelLabel: { en: "Model", hi: "मॉडल", gu: "મોડેલ" },
  chooseModel: { en: "Choose AI model", hi: "AI मॉडल चुनें", gu: "AI મોડેલ પસંદ કરો" },
  // Krishna's step context, written as a complete phrase per locale rather than
  // a fragment glued onto "While …" — the word order does not survive that.
  tryAsking: { en: "Try asking", hi: "यह पूछकर देखें", gu: "આ પૂછી જુઓ" },
  krishnaTakeMe: { en: "Take me to", hi: "मुझे ले चलें", gu: "મને લઈ જાઓ" },
  ctxServices: {
    en: "Helping with the other services",
    hi: "बाकी सेवाओं में मदद",
    gu: "બાકીની સેવાઓમાં મદદ",
  },

  // What Krishna says first, per screen. Named for the step, not generic.
  greetDefault: {
    en: "Tell me what you are trying to do and I will take you to the right screen.",
    hi: "बताइए आप क्या करना चाहते हैं, मैं आपको सही स्क्रीन तक ले चलूंगा।",
    gu: "કહો તમે શું કરવા માંગો છો, હું તમને સાચી સ્ક્રીન સુધી લઈ જઈશ.",
  },
  greetCheck: {
    en: "Type the registration number and I will read the record with you.",
    hi: "रजिस्ट्रेशन नंबर लिखिए, मैं आपके साथ रिकॉर्ड पढ़ूंगा।",
    gu: "રજિસ્ટ્રેશન નંબર લખો, હું તમારી સાથે રેકોર્ડ વાંચીશ.",
  },
  greetReport: {
    en: "This is the full record. Ask me about the loan, the owners or the price band.",
    hi: "यह पूरा रिकॉर्ड है। लोन, मालिकों या कीमत के बारे में पूछिए।",
    gu: "આ સંપૂર્ણ રેકોર્ડ છે. લોન, માલિકો કે કિંમત વિશે પૂછો.",
  },
  greetTransfer: {
    en: "Six stages and one of them is the loan. Ask what a form does before you sign it.",
    hi: "छह चरण हैं और उनमें एक लोन का है। हस्ताक्षर से पहले पूछिए कि कौन सा फ़ॉर्म क्या करता है।",
    gu: "છ તબક્કા છે અને તેમાં એક લોનનો છે. સહી કરતાં પહેલાં પૂછો કે કયું ફોર્મ શું કરે છે.",
  },
  greetGarage: {
    en: "Your vehicles, applications and renewal dates. Ask me what needs doing first.",
    hi: "आपके वाहन, आवेदन और नवीनीकरण की तारीख़ें। पूछिए पहले क्या करना है।",
    gu: "તમારાં વાહનો, અરજીઓ અને રિન્યુઅલની તારીખો. પૂછો પહેલાં શું કરવાનું છે.",
  },
  greetCrash: {
    en: "Keep this screen open. Ask me what to do next and I will keep it short.",
    hi: "यह स्क्रीन खुली रखिए। पूछिए आगे क्या करना है, मैं छोटा जवाब दूंगा।",
    gu: "આ સ્ક્રીન ખુલ્લી રાખો. પૂછો આગળ શું કરવાનું છે, હું ટૂંકો જવાબ આપીશ.",
  },
  greetStatus: {
    en: "Give me an application number, or ask what a stage means.",
    hi: "आवेदन नंबर दीजिए, या पूछिए कि कोई चरण क्या होता है।",
    gu: "અરજી નંબર આપો, અથવા પૂછો કે કોઈ તબક્કો શું છે.",
  },
  greetServices: {
    en: "Seven services that are seven separate websites today. Ask which one you need.",
    hi: "सात सेवाएं, जो आज सात अलग वेबसाइटें हैं। पूछिए आपको कौन सी चाहिए।",
    gu: "સાત સેવાઓ, જે આજે સાત અલગ વેબસાઇટ છે. પૂછો તમને કઈ જોઈએ.",
  },

  // the flute
  flutePlay: { en: "Play the flute", hi: "बांसुरी बजाएं", gu: "વાંસળી વગાડો" },
  fluteStop: { en: "Stop the flute", hi: "बांसुरी बंद करें", gu: "વાંસળી બંધ કરો" },

  // the hero's Krishna beat
  askKrishnaHere: {
    en: "Ask Krishna anything about a vehicle",
    hi: "वाहन के बारे में कृष्ण से कुछ भी पूछें",
    gu: "વાહન વિશે કૃષ્ણને કંઈ પણ પૂછો",
  },
  heroKrishnaLine: {
    en: "Sarathi means charioteer. Krishna reads the screen you are on, answers in your language, and drives you to the one that holds the answer.",
    hi: "सारथी यानी रथ हांकने वाला। कृष्ण वह स्क्रीन पढ़ता है जिस पर आप हैं, आपकी भाषा में जवाब देता है, और आपको उस स्क्रीन तक ले जाता है जहां जवाब है।",
    gu: "સારથિ એટલે રથ હાંકનાર. કૃષ્ણ તમે જે સ્ક્રીન પર છો તે વાંચે છે, તમારી ભાષામાં જવાબ આપે છે, અને તમને એ સ્ક્રીન સુધી લઈ જાય છે જ્યાં જવાબ છે.",
  },
  krishnaEyebrow: { en: "Your charioteer", hi: "आपका सारथी", gu: "તમારો સારથિ" },
  krishnaCaption: { en: "Krishna, your guide", hi: "कृष्ण, आपके सारथी", gu: "કૃષ્ણ, તમારા સારથિ" },
  krishnaTitle: {
    en: "In the story, the one holding the reins knew the ground better than the one holding the bow.",
    hi: "कहानी में लगाम थामने वाला मैदान को धनुष थामने वाले से बेहतर जानता था।",
    gu: "વાર્તામાં લગામ પકડનાર મેદાનને ધનુષ પકડનાર કરતાં વધુ સારી રીતે જાણતો હતો.",
  },
  krishnaBody: {
    en: "Sarathi means charioteer. Krishna reads the screen you are on, answers in your language, and can take you to the one that actually holds the answer. You still press every button that costs money.",
    hi: "सारथी यानी रथ हांकने वाला। कृष्ण वह स्क्रीन पढ़ता है जिस पर आप हैं, आपकी भाषा में जवाब देता है, और आपको उस स्क्रीन तक ले जा सकता है जहां जवाब है। पैसे वाला हर बटन आप ही दबाते हैं।",
    gu: "સારથિ એટલે રથ હાંકનાર. કૃષ્ણ તમે જે સ્ક્રીન પર છો તે વાંચે છે, તમારી ભાષામાં જવાબ આપે છે, અને તમને એ સ્ક્રીન સુધી લઈ જઈ શકે છે જ્યાં જવાબ છે. પૈસાવાળું દરેક બટન તમે જ દબાવો છો.",
  },
  ctxCheck: {
    en: "While checking a vehicle",
    hi: "वाहन जांचते समय मदद",
    gu: "વાહન તપાસતી વખતે મદદ",
  },
  ctxReport: {
    en: "While reading a Trust Report",
    hi: "ट्रस्ट रिपोर्ट पढ़ते समय मदद",
    gu: "ટ્રસ્ટ રિપોર્ટ વાંચતી વખતે મદદ",
  },
  ctxTransfer: {
    en: "While transferring ownership",
    hi: "स्वामित्व ट्रांसफर करते समय मदद",
    gu: "માલિકી ટ્રાન્સફર કરતી વખતે મદદ",
  },
  ctxGarage: { en: "While in your garage", hi: "आपके गैराज में मदद", gu: "તમારા ગેરેજમાં મદદ" },
  ctxCrash: {
    en: "While at an accident scene",
    hi: "दुर्घटना स्थल पर मदद",
    gu: "અકસ્માત સ્થળે મદદ",
  },
  ctxStatus: {
    en: "While tracking an application",
    hi: "आवेदन ट्रैक करते समय मदद",
    gu: "અરજી ટ્રેક કરતી વખતે મદદ",
  },

  // shared states
  somethingWentWrong: { en: "Something went wrong", hi: "कुछ गड़बड़ हो गई", gu: "કંઈક ખોટું થયું" },
  loading: { en: "Loading", hi: "लोड हो रहा है", gu: "લોડ થઈ રહ્યું છે" },
  retry: { en: "Retry", hi: "दोबारा कोशिश करें", gu: "ફરી પ્રયાસ કરો" },

  // check page
  checkDesc: {
    en: "Enter a registration number to see what the official record shows, then unlock the full history with the seller's consent.",
    hi: "पंजीकरण नंबर डालें और देखें कि सरकारी रिकॉर्ड क्या दिखाता है, फिर विक्रेता की सहमति से पूरा इतिहास खोलें।",
    gu: "નોંધણી નંબર દાખલ કરો અને જુઓ કે સરકારી રેકોર્ડ શું બતાવે છે, પછી વેચનારની સંમતિથી સંપૂર્ણ ઇતિહાસ ખોલો.",
  },
  couldNotReachRecord: {
    en: "Could not reach the vehicle record",
    hi: "वाहन रिकॉर्ड तक नहीं पहुंच सके",
    gu: "વાહન રેકોર્ડ સુધી પહોંચી શકાયું નથી",
  },
  checkConnection: {
    en: "Check your connection and try again.",
    hi: "अपना कनेक्शन जांचें और दोबारा कोशिश करें।",
    gu: "તમારું કનેક્શન તપાસો અને ફરી પ્રયાસ કરો.",
  },
  nothingRegistered: {
    en: "Nothing is registered against {regNo} in this demo.",
    hi: "इस डेमो में {regNo} पर कुछ भी पंजीकृत नहीं है।",
    gu: "આ ડેમોમાં {regNo} પર કંઈ પણ નોંધાયેલું નથી.",
  },
  makerModel: { en: "Maker / model", hi: "निर्माता / मॉडल", gu: "ઉત્પાદક / મોડેલ" },
  ownerLabel: { en: "Owner", hi: "मालिक", gu: "માલિક" },
  registeringAuthority: { en: "Registering authority", hi: "पंजीकरण कार्यालय", gu: "નોંધણી કચેરી" },
  classFuelEmission: {
    en: "Class / fuel / emission",
    hi: "श्रेणी / ईंधन / उत्सर्जन",
    gu: "વર્ગ / ઇંધણ / ઉત્સર્જન",
  },
  regDate: { en: "Registration date", hi: "पंजीकरण तिथि", gu: "નોંધણી તારીખ" },
  hypothecatedLabel: { en: "Hypothecated", hi: "हाइपोथिकेटेड", gu: "હાઇપોથિકેટેડ" },
  insuranceValidTill: { en: "Insurance valid till", hi: "बीमा मान्य तक", gu: "વીમો માન્ય સુધી" },
  pucValidTill: { en: "PUC valid till", hi: "PUC मान्य तक", gu: "PUC માન્ય સુધી" },
  yesLabel: { en: "YES", hi: "हां", gu: "હા" },
  noLabel: { en: "NO", hi: "नहीं", gu: "ના" },
  payLabel: { en: "Pay", hi: "भुगतान करें", gu: "ચુકવણી કરો" },
  mockSuffix: { en: "(mock)", hi: "(नकली)", gu: "(નકલી)" },
  mockPayment: { en: "MOCK PAYMENT", hi: "नकली भुगतान", gu: "નકલી ચુકવણી" },
  mockConsentOtp: { en: "MOCK CONSENT OTP", hi: "नकली सहमति OTP", gu: "નકલી સંમતિ OTP" },

  // status page
  statusDesc: {
    en: "No date of birth, no captcha — just the application number. Today's portal asks for all three, on a different page per service.",
    hi: "न जन्मतिथि, न कैप्चा — सिर्फ आवेदन नंबर। मौजूदा पोर्टल तीनों मांगता है, हर सेवा के लिए अलग पेज पर।",
    gu: "ન જન્મતારીખ, ન કેપ્ચા — ફક્ત અરજી નંબર. હાલનું પોર્ટલ ત્રણેય માંગે છે, દરેક સેવા માટે અલગ પેજ પર.",
  },
  trackBtn: { en: "Track", hi: "ट्रैक करें", gu: "ટ્રેક કરો" },
  noApplicationFound: {
    en: "No application found. Complete a transfer to generate one, or check My Garage for your application numbers.",
    hi: "कोई आवेदन नहीं मिला। एक ट्रांसफर पूरा करें, या अपने आवेदन नंबर के लिए मेरा गैराज देखें।",
    gu: "કોઈ અરજી મળી નથી. એક ટ્રાન્સફર પૂરું કરો, અથવા તમારા અરજી નંબર માટે મારું ગેરેજ જુઓ.",
  },
  filedOn: { en: "filed", hi: "दाखिल", gu: "દાખલ" },
  rtoVisit: { en: "RTO visit", hi: "RTO विज़िट", gu: "RTO મુલાકાત" },

  // garage page
  loginToGarage: {
    en: "Login to see your garage.",
    hi: "अपना गैराज देखने के लिए लॉगिन करें।",
    gu: "તમારું ગેરેજ જોવા માટે લોગિન કરો.",
  },
  garageDesc: {
    en: "One account, everything in one place — the view that does not exist on the current portals.",
    hi: "एक खाता, सब कुछ एक जगह — वह दृश्य जो मौजूदा पोर्टलों पर है ही नहीं।",
    gu: "એક ખાતું, બધું એક જગ્યાએ — એ દૃશ્ય જે હાલના પોર્ટલ પર છે જ નહીં.",
  },
  insuranceExpired: { en: "Insurance expired", hi: "बीमा समाप्त", gu: "વીમો સમાપ્ત" },
  pucExpired: { en: "PUC expired", hi: "PUC समाप्त", gu: "PUC સમાપ્ત" },
  fitnessExpired: { en: "Fitness expired", hi: "फिटनेस समाप्त", gu: "ફિટનેસ સમાપ્ત" },
  pendingChallanNote: { en: "pending challan(s)", hi: "बकाया चालान", gu: "બાકી ચલણ" },
  noApplicationsYet: {
    en: "No applications yet. Start a transfer from a Trust Report.",
    hi: "अभी कोई आवेदन नहीं। ट्रस्ट रिपोर्ट से एक ट्रांसफर शुरू करें।",
    gu: "હજુ કોઈ અરજી નથી. ટ્રસ્ટ રિપોર્ટમાંથી એક ટ્રાન્સફર શરૂ કરો.",
  },
  completeLabel: { en: "COMPLETE", hi: "पूर्ण", gu: "પૂર્ણ" },
  inProgressLabel: { en: "IN PROGRESS", hi: "चल रहा है", gu: "ચાલુ છે" },
  simulateRto: {
    en: "Simulate RTO approval",
    hi: "RTO मंज़ूरी की नकल करें",
    gu: "RTO મંજૂરીની નકલ કરો",
  },
  noPaymentsYet: { en: "No payments yet.", hi: "अभी कोई भुगतान नहीं।", gu: "હજુ કોઈ ચુકવણી નથી." },
  receiptLabel: { en: "Receipt", hi: "रसीद", gu: "રસીદ" },
  purposeLabel: { en: "Purpose", hi: "उद्देश्य", gu: "હેતુ" },
  amountLabel: { en: "Amount", hi: "राशि", gu: "રકમ" },
  dateLabel: { en: "Date", hi: "तारीख", gu: "તારીખ" },

  // how it works
  howTitle: { en: "How this works", hi: "यह कैसे काम करता है", gu: "આ કેવી રીતે કામ કરે છે" },
  howDesc: {
    en: "A prototype is only useful if you can tell what is real. This is the honest version: the problem, what we changed, what actually works, what is simulated, and how it could run at scale.",
    hi: "प्रोटोटाइप तभी काम का है जब आप बता सकें कि उसमें असली क्या है। यह ईमानदार वर्ज़न है: समस्या, हमने क्या बदला, क्या सचमुच काम करता है, क्या नकली है, और यह बड़े पैमाने पर कैसे चल सकता है।",
    gu: "પ્રોટોટાઇપ ત્યારે જ કામનો છે જ્યારે તમે કહી શકો કે તેમાં સાચું શું છે. આ પ્રામાણિક આવૃત્તિ છે: સમસ્યા, અમે શું બદલ્યું, ખરેખર શું કામ કરે છે, શું નકલી છે, અને આ મોટા પાયે કેવી રીતે ચાલી શકે.",
  },
  whoHasProblem: { en: "Who has this problem", hi: "यह समस्या किसकी है", gu: "આ સમસ્યા કોની છે" },
  whatIsHardToday: {
    en: "What is hard about it today",
    hi: "आज इसमें मुश्किल क्या है",
    gu: "આજે તેમાં મુશ્કેલી શું છે",
  },
  sourcesNote: {
    en: "Every claim above comes from reading the live public pages of parivahan.gov.in and its portals, plus MoRTH notifications and the National Transport Repository data-sharing policy. No government system was accessed, tested or scraped.",
    hi: "ऊपर का हर दावा parivahan.gov.in और उसके पोर्टलों के सार्वजनिक पेज पढ़कर, तथा MoRTH अधिसूचनाओं और National Transport Repository डेटा-साझा नीति से लिया गया है। किसी सरकारी सिस्टम को न एक्सेस किया गया, न टेस्ट, न स्क्रैप।",
    gu: "ઉપરનો દરેક દાવો parivahan.gov.in અને તેના પોર્ટલના જાહેર પેજ વાંચીને, તથા MoRTH સૂચનાઓ અને National Transport Repository ડેટા-શેરિંગ નીતિમાંથી લેવાયો છે. કોઈ સરકારી સિસ્ટમને ન એક્સેસ કરાઈ, ન ટેસ્ટ, ન સ્ક્રેપ.",
  },
  whatWeChanged: { en: "What we changed", hi: "हमने क्या बदला", gu: "અમે શું બદલ્યું" },
  worksToday: { en: "Works today", hi: "आज काम करता है", gu: "આજે કામ કરે છે" },
  simulatedLabel: { en: "Simulated", hi: "नकली", gu: "નકલી" },
  atScale: {
    en: "How this could work safely at scale",
    hi: "यह बड़े पैमाने पर सुरक्षित रूप से कैसे चल सकता है",
    gu: "આ મોટા પાયે સુરક્ષિત રીતે કેવી રીતે ચાલી શકે",
  },
  statAts: {
    en: "automated testing stations in Gujarat, more than any other state",
    hi: "गुजरात में स्वचालित परीक्षण केंद्र, किसी भी राज्य से ज़्यादा",
    gu: "ગુજરાતમાં ઓટોમેટેડ ટેસ્ટિંગ સ્ટેશન, કોઈ પણ રાજ્ય કરતાં વધુ",
  },
  statRvsf: {
    en: "registered scrapping facilities",
    hi: "पंजीकृत स्क्रैपिंग केंद्र",
    gu: "નોંધાયેલાં સ્ક્રેપિંગ કેન્દ્રો",
  },
  statRto: {
    en: "RTO codes running live fancy-number auctions",
    hi: "RTO कोड जिनमें फ़ैंसी नंबर की नीलामी चलती है",
    gu: "RTO કોડ જેમાં ફેન્સી નંબરની હરાજી ચાલે છે",
  },
  statContactless: {
    en: "licence services already contactless through Aadhaar eKYC",
    hi: "लाइसेंस सेवाएं जो आधार eKYC से पहले ही संपर्करहित हैं",
    gu: "લાઇસન્સ સેવાઓ જે આધાર eKYC થી પહેલેથી સંપર્કરહિત છે",
  },
  restOfJourney: { en: "The rest of the journey", hi: "बाकी की यात्रा", gu: "બાકીની યાત્રા" },
  restTitle: {
    en: "Gujarat already runs these. On nine different websites.",
    hi: "गुजरात इन्हें पहले से चलाता है। नौ अलग-अलग वेबसाइटों पर।",
    gu: "ગુજરાત આ પહેલેથી ચલાવે છે. નવ અલગ-અલગ વેબસાઇટ પર.",
  },
  restBody: {
    en: "65 testing stations, 12 scrapping facilities, auctions in all 40 RTO codes, and 28 licence services already contactless. The services are not missing. The front end is. Every one below runs on the same login and the same stage tracker.",
    hi: "65 परीक्षण केंद्र, 12 स्क्रैपिंग केंद्र, सभी 40 RTO कोड में नीलामी, और 28 लाइसेंस सेवाएं पहले से संपर्करहित। सेवाएं गायब नहीं हैं। सामने का हिस्सा गायब है। नीचे की हर सेवा उसी लॉगिन और उसी चरण-ट्रैकर पर चलती है।",
    gu: "65 ટેસ્ટિંગ સ્ટેશન, 12 સ્ક્રેપિંગ કેન્દ્રો, બધા 40 RTO કોડમાં હરાજી, અને 28 લાઇસન્સ સેવાઓ પહેલેથી સંપર્કરહિત. સેવાઓ ગુમ નથી. આગળનો ભાગ ગુમ છે. નીચેની દરેક સેવા એ જ લોગિન અને એ જ સ્ટેજ ટ્રેકર પર ચાલે છે.",
  },
  // roadmap services
  servicesTitle: { en: "All services", hi: "सभी सेवाएं", gu: "બધી સેવાઓ" },
  servicesDesc: {
    en: "The rest of the journey, on the same account and the same stage tracker.",
    hi: "बाकी की यात्रा, उसी खाते और उसी चरण-ट्रैकर पर।",
    gu: "બાકીની યાત્રા, એ જ ખાતા અને એ જ સ્ટેજ ટ્રેકર પર.",
  },
  servicesPreview: {
    en: "Preview of the roadmap. Every one of these is a working walkthrough on synthetic data, not a live government service — see How it works for what is real.",
    hi: "यह रोडमैप की झलक है। इनमें से हर एक नकली डेटा पर चलने वाला डेमो है, कोई जीवित सरकारी सेवा नहीं — असली क्या है, यह 'कैसे काम करता है' पर देखें।",
    gu: "આ રોડમેપની ઝલક છે. આમાંની દરેક નકલી ડેટા પર ચાલતી ડેમો છે, કોઈ જીવંત સરકારી સેવા નહીં — સાચું શું છે તે 'કેવી રીતે કામ કરે છે' પર જુઓ.",
  },
  noLoginToBrowse: {
    en: "No login needed to look",
    hi: "देखने के लिए लॉगिन नहीं चाहिए",
    gu: "જોવા માટે લોગિન જોઈતું નથી",
  },
  pickOne: { en: "Pick one", hi: "एक चुनें", gu: "એક પસંદ કરો" },
  describeIssue: {
    en: "Describe what went wrong",
    hi: "बताइए क्या गड़बड़ हुई",
    gu: "જણાવો શું ખોટું થયું",
  },
  startService: { en: "Start", hi: "शुरू करें", gu: "શરૂ કરો" },
  openServices: { en: "See all services", hi: "सभी सेवाएं देखें", gu: "બધી સેવાઓ જુઓ" },
  serviceLocked: {
    en: "Sign in to file this application",
    hi: "यह आवेदन दाखिल करने के लिए साइन इन करें",
    gu: "આ અરજી દાખલ કરવા માટે સાઇન ઇન કરો",
  },
  whatIsNext: {
    en: "What comes next, in Gujarat",
    hi: "आगे गुजरात में क्या आता है",
    gu: "આગળ ગુજરાતમાં શું આવે છે",
  },
  nextScope: {
    en: "You can walk each of these now under All services, but every one is a preview on synthetic data, not a live government service. The research behind them was walked with Gujarat selected, so every number below is a Gujarat number, and Gujarat is where they would ship first.",
    hi: "इनमें से हर एक को अब सभी सेवाओं में चलाकर देखा जा सकता है, लेकिन हर एक नकली डेटा पर बनी झलक है, कोई जीवित सरकारी सेवा नहीं। इनके पीछे का शोध गुजरात चुनकर किया गया था, इसलिए नीचे के सारे आंकड़े गुजरात के हैं, और ये सबसे पहले गुजरात में ही शुरू होंगे।",
    gu: "આમાંની દરેકને હવે બધી સેવાઓમાં ચલાવીને જોઈ શકાય છે, પણ દરેક નકલી ડેટા પર બનેલી ઝલક છે, કોઈ જીવંત સરકારી સેવા નહીં. તેમની પાછળનું સંશોધન ગુજરાત પસંદ કરીને કરાયું હતું, તેથી નીચેના બધા આંકડા ગુજરાતના છે, અને એ સૌથી પહેલાં ગુજરાતમાં જ શરૂ થશે.",
  },
  notGovProduct: {
    en: "Not a government product",
    hi: "यह सरकारी उत्पाद नहीं है",
    gu: "આ સરકારી ઉત્પાદન નથી",
  },
  notGovBody: {
    en: "Sarathi One is an independent hackathon prototype. It is not affiliated with, endorsed by, or connected to the Ministry of Road Transport and Highways, NIC, or Parivahan Sewa, and it uses no government logos or branding. For real services, use",
    hi: "सारथी वन एक स्वतंत्र हैकाथॉन प्रोटोटाइप है। यह सड़क परिवहन एवं राजमार्ग मंत्रालय, NIC या परिवहन सेवा से न संबद्ध है, न अनुमोदित, न जुड़ा हुआ, और इसमें कोई सरकारी लोगो या ब्रांडिंग नहीं है। असली सेवाओं के लिए उपयोग करें",
    gu: "સારથી વન એક સ્વતંત્ર હેકાથોન પ્રોટોટાઇપ છે. તે માર્ગ પરિવહન અને રાજમાર્ગ મંત્રાલય, NIC કે પરિવહન સેવા સાથે ન સંલગ્ન છે, ન માન્ય, ન જોડાયેલું, અને તેમાં કોઈ સરકારી લોગો કે બ્રાન્ડિંગ નથી. સાચી સેવાઓ માટે વાપરો",
  },
  seeVersionHistory: {
    en: "See the version history →",
    hi: "संस्करण इतिहास देखें →",
    gu: "આવૃત્તિ ઇતિહાસ જુઓ →",
  },

  // errors and empty routes
  unknownVehicle: { en: "Unknown vehicle.", hi: "अज्ञात वाहन।", gu: "અજાણ્યું વાહન." },
  screenFailed: {
    en: "This screen failed to load. Trying again usually fixes it.",
    hi: "यह स्क्रीन लोड नहीं हो सकी। दोबारा कोशिश करने से आमतौर पर ठीक हो जाता है।",
    gu: "આ સ્ક્રીન લોડ થઈ શકી નથી. ફરી પ્રયાસ કરવાથી સામાન્ય રીતે ઠીક થઈ જાય છે.",
  },
  tryAgain: { en: "Try again", hi: "दोबारा कोशिश करें", gu: "ફરી પ્રયાસ કરો" },
  pageMissing: {
    en: "This page does not exist",
    hi: "यह पेज मौजूद नहीं है",
    gu: "આ પેજ અસ્તિત્વમાં નથી",
  },
  pageMissingBody: {
    en: "The link may be out of date. Everything starts from the home page.",
    hi: "लिंक पुराना हो सकता है। सब कुछ होम पेज से शुरू होता है।",
    gu: "લિંક જૂની હોઈ શકે છે. બધું હોમ પેજથી શરૂ થાય છે.",
  },
  goHome: { en: "Go to the home page", hi: "होम पेज पर जाएं", gu: "હોમ પેજ પર જાઓ" },

  // login
  wrongOtp: {
    en: "Wrong OTP. The demo OTP is shown above.",
    hi: "गलत OTP। डेमो OTP ऊपर दिखाया गया है।",
    gu: "ખોટો OTP. ડેમો OTP ઉપર બતાવેલો છે.",
  },
  mockOtp: { en: "MOCK OTP", hi: "नकली OTP", gu: "નકલી OTP" },
  loginBlurb: {
    en: "One account for every service — vehicle checks, transfers, licences, payments.",
    hi: "हर सेवा के लिए एक खाता — वाहन जांच, ट्रांसफर, लाइसेंस, भुगतान।",
    gu: "દરેક સેવા માટે એક ખાતું — વાહન તપાસ, ટ્રાન્સફર, લાઇસન્સ, ચુકવણી.",
  },
  noSmsSent: {
    en: "No SMS is sent in this demo. Your OTP is",
    hi: "इस डेमो में कोई SMS नहीं भेजा जाता। आपका OTP है",
    gu: "આ ડેમોમાં કોઈ SMS મોકલાતો નથી. તમારો OTP છે",
  },
  managingDemoData: {
    en: "Managing the demo data?",
    hi: "डेमो डेटा संभाल रहे हैं?",
    gu: "ડેમો ડેટા સંભાળી રહ્યા છો?",
  },
  staffSignIn: { en: "Staff sign-in", hi: "स्टाफ़ साइन-इन", gu: "સ્ટાફ સાઇન-ઇન" },
  mockVirtualRc: { en: "MOCK VIRTUAL RC", hi: "नकली वर्चुअल RC", gu: "નકલી વર્ચ્યુઅલ RC" },
  mockGps: { en: "MOCK GPS", hi: "नकली GPS", gu: "નકલી GPS" },
  mockEdar: { en: "MOCK eDAR", hi: "नकली eDAR", gu: "નકલી eDAR" },
  mockBankNoc: { en: "MOCK BANK NOC", hi: "नकली बैंक NOC", gu: "નકલી બેંક NOC" },
  mockUpload: { en: "MOCK UPLOAD", hi: "नकली अपलोड", gu: "નકલી અપલોડ" },
  mockEsign: { en: "MOCK e-SIGN", hi: "नकली ई-हस्ताक्षर", gu: "નકલી ઈ-સહી" },
  switchTheme: { en: "Switch colour theme", hi: "रंग थीम बदलें", gu: "રંગ થીમ બદલો" },

  // report / transfer gates
  loginForReport: {
    en: "Login to open a Trust Report.",
    hi: "ट्रस्ट रिपोर्ट खोलने के लिए लॉगिन करें।",
    gu: "ટ્રસ્ટ રિપોર્ટ ખોલવા માટે લોગિન કરો.",
  },
  loginForTransfer: {
    en: "Login required for the transfer journey.",
    hi: "ट्रांसफर प्रक्रिया के लिए लॉगिन जरूरी है।",
    gu: "ટ્રાન્સફર પ્રક્રિયા માટે લોગિન જરૂરી છે.",
  },
  reportLocked: { en: "This report is locked.", hi: "यह रिपोर्ट बंद है।", gu: "આ રિપોર્ટ બંધ છે." },
  goToCheck: { en: "Go to vehicle check", hi: "वाहन जांच पर जाएं", gu: "વાહન તપાસ પર જાઓ" },
  transferFee: {
    en: "Transfer of ownership fee",
    hi: "स्वामित्व ट्रांसफर शुल्क",
    gu: "માલિકી ટ્રાન્સફર ફી",
  },
  hpTermination: {
    en: "HP termination (Form 35)",
    hi: "HP समाप्ति (Form 35)",
    gu: "HP સમાપ્તિ (Form 35)",
  },

  // crash card
  crashIntro: {
    en: "Everything a person needs in the first minutes after a road accident. Grounded in the Cashless Treatment Scheme, 2025.",
    hi: "सड़क दुर्घटना के पहले कुछ मिनटों में जो कुछ चाहिए, सब यहां। कैशलेस उपचार योजना, 2025 पर आधारित।",
    gu: "માર્ગ અકસ્માતની પહેલી થોડી મિનિટોમાં જે કંઈ જોઈએ, બધું અહીં. કેશલેસ સારવાર યોજના, 2025 પર આધારિત.",
  },
  call112Confirm: {
    en: "Tap again to dial",
    hi: "डायल करने के लिए फिर दबाएं",
    gu: "ડાયલ કરવા ફરી દબાવો",
  },
  call112Note: {
    en: "112 is the real emergency number. This prototype will not dial until you tap a second time.",
    hi: "112 असली आपातकालीन नंबर है। यह प्रोटोटाइप दूसरी बार दबाने तक डायल नहीं करेगा।",
    gu: "112 સાચો કટોકટી નંબર છે. આ પ્રોટોટાઇપ બીજી વાર દબાવો ત્યાં સુધી ડાયલ નહીં કરે.",
  },
  call112: {
    en: "Call 112 — Emergency",
    hi: "112 पर कॉल करें — आपातकाल",
    gu: "112 પર કૉલ કરો — કટોકટી",
  },
  virtualDocs: { en: "Virtual documents", hi: "वर्चुअल दस्तावेज़", gu: "વર્ચ્યુઅલ દસ્તાવેજ" },
  insuranceLine: { en: "Insurance", hi: "बीमा", gu: "વીમો" },
  validTill: { en: "valid till", hi: "मान्य तक", gu: "માન્ય સુધી" },
  holderMobile: { en: "Holder mobile", hi: "धारक का मोबाइल", gu: "ધારકનો મોબાઇલ" },
  virtualRcNote: {
    en: "Virtual RC/DL in mParivahan & DigiLocker are legally valid — no physical papers needed at the scene.",
    hi: "mParivahan और DigiLocker में वर्चुअल RC/DL कानूनी रूप से मान्य हैं — घटनास्थल पर कागज़ात साथ रखने की जरूरत नहीं।",
    gu: "mParivahan અને DigiLocker માં વર્ચ્યુઅલ RC/DL કાયદેસર માન્ય છે — ઘટનાસ્થળે કાગળો સાથે રાખવાની જરૂર નથી.",
  },
  goldenHour: {
    en: "Golden hour — treatment is cashless",
    hi: "गोल्डन ऑवर — इलाज कैशलेस है",
    gu: "ગોલ્ડન અવર — સારવાર કેશલેસ છે",
  },
  goldenHourBody: {
    en: "of treatment at designated hospitals under the Cashless Treatment of Road Accident Victims Scheme, 2025. No cash, no paperwork at admission.",
    hi: "तक का इलाज निर्धारित अस्पतालों में, सड़क दुर्घटना पीड़ितों की कैशलेस उपचार योजना, 2025 के तहत। भर्ती के समय न नकद, न कागजी कार्रवाई।",
    gu: "સુધીની સારવાર નિર્ધારિત હોસ્પિટલોમાં, માર્ગ અકસ્માત પીડિતોની કેશલેસ સારવાર યોજના, 2025 હેઠળ. દાખલ થતી વખતે ન રોકડ, ન કાગળકામ.",
  },
  upTo: { en: "Up to", hi: "अधिकतम", gu: "વધુમાં વધુ" },
  lakhSevenDays: {
    en: "₹1.5 lakh for 7 days",
    hi: "₹1.5 लाख, 7 दिन तक",
    gu: "₹1.5 લાખ, 7 દિવસ સુધી",
  },
  nearestHospital: {
    en: "Nearest designated hospital",
    hi: "निकटतम निर्धारित अस्पताल",
    gu: "નજીકની નિર્ધારિત હોસ્પિટલ",
  },
  traumaCentre: { en: "Trauma centre 24×7", hi: "ट्रॉमा सेंटर 24×7", gu: "ટ્રોમા સેન્ટર 24×7" },
  helpingSomeone: {
    en: "Helping someone? You are protected.",
    hi: "किसी की मदद कर रहे हैं? आप सुरक्षित हैं।",
    gu: "કોઈની મદદ કરી રહ્યા છો? તમે સુરક્ષિત છો.",
  },
  goodSamaritanA: { en: "Good Samaritans face", hi: "Good Samaritan पर", gu: "Good Samaritan પર" },
  noLegalLiability: {
    en: "no legal liability",
    hi: "कोई कानूनी देनदारी नहीं",
    gu: "કોઈ કાનૂની જવાબદારી નહીં",
  },
  goodSamaritanB: {
    en: "and cannot be forced to disclose identity.",
    hi: "होती, और पहचान बताने के लिए मजबूर नहीं किया जा सकता।",
    gu: "હોતી, અને ઓળખ જણાવવા માટે મજબૂર કરી શકાતા નથી.",
  },
  rahveerA: {
    en: "Taking a victim to a hospital in the golden hour qualifies for the",
    hi: "गोल्डन ऑवर में पीड़ित को अस्पताल पहुंचाने पर मिलता है",
    gu: "ગોલ્ડન અવરમાં પીડિતને હોસ્પિટલ પહોંચાડવા બદલ મળે છે",
  },
  rahveerReward: {
    en: "₹25,000 Rahveer reward",
    hi: "₹25,000 का रहवीर पुरस्कार",
    gu: "₹25,000 નું રહવીર ઇનામ",
  },
  crashOutro: {
    en: "None of this information exists in today's Parivahan citizen UI — that is the point of this screen.",
    hi: "यह जानकारी आज के परिवहन नागरिक इंटरफ़ेस में कहीं नहीं है — इसी स्क्रीन की यही वजह है।",
    gu: "આ માહિતી આજના પરિવહન નાગરિક ઇન્ટરફેસમાં ક્યાંય નથી — આ સ્ક્રીનનું એ જ કારણ છે.",
  },
} as const;

export type TKey = keyof typeof dict;

export function useT() {
  const locale = useApp((s) => s.locale);
  return (key: TKey) => dict[key][locale];
}
