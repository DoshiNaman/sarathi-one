/** The submission's argument, kept in code so the app and the write-up cannot drift apart. */
import type { Locale } from "./locales";

/** Every sentence on the How-it-works page, in all three interface locales. */
export type Text = Record<Locale, string>;

export const WHO = {
  en: "Anyone buying or selling a second-hand vehicle in India — roughly one in every two vehicle sales. The buyer is usually spending several months of income on a machine whose history they cannot see, guided by a seller who has every reason to leave things out.",
  hi: "भारत में पुराना वाहन खरीदने या बेचने वाला कोई भी — यानी लगभग हर दूसरी वाहन बिक्री। खरीदार आमतौर पर कई महीनों की कमाई ऐसी मशीन पर लगाता है जिसका इतिहास वह देख ही नहीं सकता, और उसका मार्गदर्शन ऐसा विक्रेता करता है जिसके पास बातें छिपाने की हर वजह है।",
  gu: "ભારતમાં જૂનું વાહન ખરીદનાર કે વેચનાર કોઈ પણ — એટલે કે લગભગ દર બીજું વાહન વેચાણ. ખરીદનાર સામાન્ય રીતે કેટલાય મહિનાની કમાણી એવા મશીન પર લગાવે છે જેનો ઇતિહાસ તે જોઈ જ શકતો નથી, અને તેને દોરનાર વેચનાર પાસે વાત છુપાવવાનું દરેક કારણ છે.",
} satisfies Text;

export const TODAY: { problem: Text; detail: Text }[] = [
  {
    problem: {
      en: "The official record shows a buyer almost nothing",
      hi: "सरकारी रिकॉर्ड खरीदार को लगभग कुछ नहीं दिखाता",
      gu: "સરકારી રેકોર્ડ ખરીદનારને લગભગ કંઈ બતાવતું નથી",
    },
    detail: {
      en: "The public lookup returns about ten fields with the owner's name masked, and it is capped at three lookups a day. Loan status is a bare yes/no with no bank named. There is no ownership count, no accident history, no challan history.",
      hi: "सार्वजनिक लुकअप लगभग दस फ़ील्ड लौटाता है, जिसमें मालिक का नाम छिपा होता है, और दिन में केवल तीन बार चलता है। लोन की स्थिति सिर्फ हां/ना है, बैंक का नाम नहीं। मालिकों की संख्या नहीं, दुर्घटना इतिहास नहीं, चालान इतिहास नहीं।",
      gu: "જાહેર લુકઅપ લગભગ દસ ફીલ્ડ પાછાં આપે છે, જેમાં માલિકનું નામ છુપાયેલું હોય છે, અને દિવસમાં માત્ર ત્રણ વાર ચાલે છે. લોનની સ્થિતિ ફક્ત હા/ના છે, બેંકનું નામ નહીં. માલિકોની સંખ્યા નહીં, અકસ્માતનો ઇતિહાસ નહીં, ચલણનો ઇતિહાસ નહીં.",
    },
  },
  {
    problem: {
      en: "One sale is spread across four disconnected portals",
      hi: "एक बिक्री चार अलग-अलग पोर्टलों में बंटी है",
      gu: "એક વેચાણ ચાર અલગ-અલગ પોર્ટલમાં વહેંચાયેલું છે",
    },
    detail: {
      en: "Form 29/30 on Vahan, Form 35 for the loan, a separate ePayment app, a separate slot-booking app. Each has its own design, its own login model, and its own captcha.",
      hi: "वाहन पर Form 29/30, लोन के लिए Form 35, अलग ePayment ऐप, अलग स्लॉट-बुकिंग ऐप। हर एक का अपना डिज़ाइन, अपना लॉगिन मॉडल और अपना कैप्चा।",
      gu: "વાહન પર Form 29/30, લોન માટે Form 35, અલગ ePayment એપ, અલગ સ્લોટ-બુકિંગ એપ. દરેકનું પોતાનું ડિઝાઇન, પોતાનું લોગિન મોડેલ અને પોતાનો કેપ્ચા.",
    },
  },
  {
    problem: {
      en: "There is no citizen account anywhere on the web",
      hi: "वेब पर कहीं भी नागरिक का कोई खाता नहीं है",
      gu: "વેબ પર ક્યાંય નાગરિકનું કોઈ ખાતું નથી",
    },
    detail: {
      en: "Every journey restarts at a state dropdown and is tracked only by an application number you must not lose. Your applications, payments and documents are never in one place. The four logins on the portal's own menu are all for staff and dealers.",
      hi: "हर यात्रा राज्य चुनने से दोबारा शुरू होती है और सिर्फ एक आवेदन नंबर से ट्रैक होती है, जिसे खोना नहीं है। आपके आवेदन, भुगतान और दस्तावेज़ कभी एक जगह नहीं होते। पोर्टल के अपने मेन्यू के चारों लॉगिन स्टाफ़ और डीलरों के लिए हैं।",
      gu: "દરેક પ્રક્રિયા રાજ્ય પસંદ કરવાથી ફરી શરૂ થાય છે અને ફક્ત એક અરજી નંબરથી ટ્રેક થાય છે, જે ખોવો ન જોઈએ. તમારી અરજીઓ, ચુકવણીઓ અને દસ્તાવેજ ક્યારેય એક જગ્યાએ હોતાં નથી. પોર્ટલના પોતાના મેનુના ચારેય લોગિન સ્ટાફ અને ડીલરો માટે છે.",
    },
  },
  {
    problem: {
      en: "Nothing tells you what the paperwork means",
      hi: "कागजी काम का मतलब कोई नहीं बताता",
      gu: "કાગળકામનો અર્થ કોઈ સમજાવતું નથી",
    },
    detail: {
      en: "Form 35 decides whether a bank still owns a claim on your car, but nowhere in the flow does anything explain that in plain words, in your language.",
      hi: "Form 35 तय करता है कि आपकी गाड़ी पर बैंक का दावा बाकी है या नहीं, लेकिन पूरी प्रक्रिया में कहीं भी यह आपकी भाषा में सीधे शब्दों में नहीं समझाया जाता।",
      gu: "Form 35 નક્કી કરે છે કે તમારી ગાડી પર બેંકનો દાવો બાકી છે કે નહીં, પણ આખી પ્રક્રિયામાં ક્યાંય એ તમારી ભાષામાં સાદા શબ્દોમાં સમજાવાતું નથી.",
    },
  },
];

export const CHANGED: { change: Text; why: Text }[] = [
  {
    change: {
      en: "One mobile login for every service",
      hi: "हर सेवा के लिए एक मोबाइल लॉगिन",
      gu: "દરેક સેવા માટે એક મોબાઇલ લોગિન",
    },
    why: {
      en: "Replaces four staff logins, per-portal accounts, and per-application number lookups. Your vehicles, applications, payments and receipts live in one garage.",
      hi: "चार स्टाफ़ लॉगिन, हर पोर्टल के अलग खाते और हर आवेदन नंबर से खोजने की जगह लेता है। आपके वाहन, आवेदन, भुगतान और रसीदें एक ही गैराज में रहते हैं।",
      gu: "ચાર સ્ટાફ લોગિન, દરેક પોર્ટલનાં અલગ ખાતાં અને દરેક અરજી નંબરથી શોધવાની જગ્યા લે છે. તમારાં વાહનો, અરજીઓ, ચુકવણીઓ અને રસીદો એક જ ગેરેજમાં રહે છે.",
    },
  },
  {
    change: {
      en: "A Trust Report the seller consents to unlock",
      hi: "एक ट्रस्ट रिपोर्ट, जिसे विक्रेता की सहमति से खोला जाता है",
      gu: "એક ટ્રસ્ટ રિપોર્ટ, જે વેચનારની સંમતિથી ખૂલે છે",
    },
    why: {
      en: "Ownership timeline, the financier's actual name, challans, accident flag and a fair-price band — the things that decide whether to buy. Consent is what makes it lawful to show more than the masked public view.",
      hi: "स्वामित्व का इतिहास, बैंक का असली नाम, चालान, दुर्घटना संकेत और उचित कीमत का दायरा — वही चीज़ें जो खरीदने का फैसला तय करती हैं। सहमति ही वह आधार है जिससे छिपे हुए सार्वजनिक दृश्य से ज्यादा दिखाना कानूनी होता है।",
      gu: "માલિકીનો ઇતિહાસ, બેંકનું સાચું નામ, ચલણ, અકસ્માતનો સંકેત અને વાજબી કિંમતની શ્રેણી — એ જ બાબતો જે ખરીદવાનો નિર્ણય નક્કી કરે છે. સંમતિ જ એ આધાર છે જેનાથી છુપાયેલા જાહેર દૃશ્ય કરતાં વધુ બતાવવું કાયદેસર બને છે.",
    },
  },
  {
    change: {
      en: "One guided transfer instead of four portals",
      hi: "चार पोर्टलों की जगह एक गाइडेड ट्रांसफर",
      gu: "ચાર પોર્ટલની જગ્યાએ એક ગાઇડેડ ટ્રાન્સફર",
    },
    why: {
      en: "Form 35 is detected and bundled automatically when a loan is live, so a buyer cannot accidentally pay for a car the bank still has a claim on.",
      hi: "लोन चालू होने पर Form 35 अपने आप पहचाना और जोड़ा जाता है, ताकि खरीदार गलती से ऐसी गाड़ी का भुगतान न कर दे जिस पर बैंक का दावा बाकी है।",
      gu: "લોન ચાલુ હોય ત્યારે Form 35 આપોઆપ ઓળખાય અને જોડાય છે, જેથી ખરીદનાર ભૂલથી એવી ગાડીની ચુકવણી ન કરે જેના પર બેંકનો દાવો બાકી છે.",
    },
  },
  {
    change: {
      en: "Krishna, a guide that knows which step you are on",
      hi: "कृष्ण — एक सारथी जो जानता है कि आप किस चरण पर हैं",
      gu: "કૃષ્ણ — એક સારથિ જે જાણે છે કે તમે કયા પગલે છો",
    },
    why: {
      en: "Answers 'what is Form 35?' in Hindi, Gujarati or English, in four sentences, at the moment the question occurs.",
      hi: "'Form 35 क्या है?' का जवाब हिंदी, गुजराती या अंग्रेज़ी में, चार वाक्यों में, ठीक उसी पल देता है जब सवाल उठता है।",
      gu: "'Form 35 શું છે?' નો જવાબ હિન્દી, ગુજરાતી કે અંગ્રેજીમાં, ચાર વાક્યોમાં, બરાબર એ જ ક્ષણે આપે છે જ્યારે સવાલ ઊઠે છે.",
    },
  },
  {
    change: {
      en: "A Crash Card for the worst day",
      hi: "सबसे बुरे दिन के लिए एक क्रैश कार्ड",
      gu: "સૌથી ખરાબ દિવસ માટે એક ક્રેશ કાર્ડ",
    },
    why: {
      en: "112, cashless golden-hour treatment worth ₹1.5 lakh, and Good Samaritan protections — all real 2025 entitlements that appear nowhere in the current citizen interface.",
      hi: "112, ₹1.5 लाख तक का कैशलेस गोल्डन-ऑवर इलाज, और Good Samaritan सुरक्षा — ये सभी 2025 के असली अधिकार हैं, जो मौजूदा नागरिक इंटरफ़ेस में कहीं नहीं दिखते।",
      gu: "112, ₹1.5 લાખ સુધીની કેશલેસ ગોલ્ડન-અવર સારવાર, અને Good Samaritan સુરક્ષા — આ બધા 2025 ના સાચા અધિકારો છે, જે હાલના નાગરિક ઇન્ટરફેસમાં ક્યાંય દેખાતા નથી.",
    },
  },
];

export const REAL: Text[] = [
  {
    en: "The complete citizen journey: login, vehicle check, consent unlock, Trust Report, guided transfer, garage, status tracking, Crash Card",
    hi: "पूरी नागरिक यात्रा: लॉगिन, वाहन जांच, सहमति से अनलॉक, ट्रस्ट रिपोर्ट, गाइडेड ट्रांसफर, गैराज, स्थिति ट्रैकिंग, क्रैश कार्ड",
    gu: "સંપૂર્ણ નાગરિક પ્રવાસ: લોગિન, વાહન તપાસ, સંમતિથી અનલૉક, ટ્રસ્ટ રિપોર્ટ, ગાઇડેડ ટ્રાન્સફર, ગેરેજ, સ્થિતિ ટ્રેકિંગ, ક્રેશ કાર્ડ",
  },
  {
    en: "The rule engine that grades a vehicle GOOD / CAUTION / AVOID from its record",
    hi: "वह नियम-इंजन जो रिकॉर्ड से वाहन को GOOD / CAUTION / AVOID श्रेणी देता है",
    gu: "એ નિયમ-એન્જિન જે રેકોર્ડ પરથી વાહનને GOOD / CAUTION / AVOID શ્રેણી આપે છે",
  },
  {
    en: "The EMI calculator",
    hi: "EMI कैलकुलेटर",
    gu: "EMI કેલ્ક્યુલેટર",
  },
  {
    en: "Krishna's multilingual answers — live via an OpenRouter model, grounded in a knowledge base built from primary-source research, with a picker to switch models",
    hi: "कृष्ण के बहुभाषी जवाब — OpenRouter मॉडल से लाइव, प्राथमिक स्रोतों से बने ज्ञान-आधार पर आधारित, और मॉडल बदलने के लिए एक पिकर के साथ",
    gu: "કૃષ્ણના બહુભાષી જવાબો — OpenRouter મોડેલથી લાઇવ, પ્રાથમિક સ્રોતોમાંથી બનેલા જ્ઞાન-આધાર પર આધારિત, અને મોડેલ બદલવા માટે એક પિકર સાથે",
  },
  {
    en: "English, Hindi and Gujarati across the interface",
    hi: "पूरे इंटरफ़ेस में अंग्रेज़ी, हिंदी और गुजराती",
    gu: "આખા ઇન્ટરફેસમાં અંગ્રેજી, હિન્દી અને ગુજરાતી",
  },
  {
    en: "An end-to-end automated test that walks the whole journey on every deploy",
    hi: "एक एंड-टू-एंड स्वचालित टेस्ट जो हर डिप्लॉय पर पूरी यात्रा चलाकर देखता है",
    gu: "એક એન્ડ-ટુ-એન્ડ સ્વયંસંચાલિત ટેસ્ટ જે દરેક ડિપ્લોય પર આખો પ્રવાસ ચલાવીને જુએ છે",
  },
];

export const MOCKED: Text[] = [
  {
    en: "All vehicle, owner, challan and accident data — an eight-vehicle synthetic Gujarat fleet. No real registration number will return anything",
    hi: "सभी वाहन, मालिक, चालान और दुर्घटना डेटा — आठ वाहनों का काल्पनिक गुजरात बेड़ा। कोई असली पंजीकरण नंबर कुछ नहीं लौटाएगा",
    gu: "બધો વાહન, માલિક, ચલણ અને અકસ્માતનો ડેટા — આઠ વાહનોનો કાલ્પનિક ગુજરાત કાફલો. કોઈ સાચો નોંધણી નંબર કંઈ પાછું આપશે નહીં",
  },
  {
    en: "OTPs: a fixed demo code, shown on screen. No SMS is sent",
    hi: "OTP: एक तय डेमो कोड, स्क्रीन पर दिखाया गया। कोई SMS नहीं भेजा जाता",
    gu: "OTP: એક નિશ્ચિત ડેમો કોડ, સ્ક્રીન પર બતાવેલો. કોઈ SMS મોકલાતો નથી",
  },
  {
    en: "Payments: no money moves, no gateway is contacted",
    hi: "भुगतान: कोई पैसा नहीं चलता, किसी गेटवे से संपर्क नहीं होता",
    gu: "ચુકવણી: કોઈ પૈસા ફરતા નથી, કોઈ ગેટવેનો સંપર્ક થતો નથી",
  },
  {
    en: "Seller consent, e-sign and the bank's NOC are simulated",
    hi: "विक्रेता की सहमति, ई-हस्ताक्षर और बैंक की NOC नकली हैं",
    gu: "વેચનારની સંમતિ, ઈ-સહી અને બેંકની NOC નકલી છે",
  },
  {
    en: "RTO appointment slots are not real bookings",
    hi: "RTO अपॉइंटमेंट स्लॉट असली बुकिंग नहीं हैं",
    gu: "RTO એપોઇન્ટમેન્ટ સ્લોટ સાચી બુકિંગ નથી",
  },
  {
    en: "The accident record demonstrates what consented eDAR integration could surface; no such citizen-facing data exists today",
    hi: "दुर्घटना रिकॉर्ड दिखाता है कि सहमति-आधारित eDAR एकीकरण क्या दे सकता है; आज नागरिकों के लिए ऐसा कोई डेटा मौजूद नहीं है",
    gu: "અકસ્માતનો રેકોર્ડ બતાવે છે કે સંમતિ-આધારિત eDAR જોડાણ શું આપી શકે; આજે નાગરિકો માટે એવો કોઈ ડેટા હાજર નથી",
  },
  {
    en: "The AI verdict and Krishna call OpenRouter; without a key, or if the model is slow or down, a deterministic rule engine answers and the screen labels which one replied",
    hi: "AI राय और कृष्ण OpenRouter को कॉल करते हैं; बिना key के, या मॉडल धीमा/बंद होने पर, एक तय नियम-इंजन जवाब देता है और स्क्रीन बताती है कि किसने जवाब दिया",
    gu: "AI અભિપ્રાય અને કૃષ્ણ OpenRouter ને કૉલ કરે છે; key વગર, કે મોડેલ ધીમું/બંધ હોય તો, એક નિશ્ચિત નિયમ-એન્જિન જવાબ આપે છે અને સ્ક્રીન જણાવે છે કે કોણે જવાબ આપ્યો",
  },
];

export const SCALE: { heading: Text; body: Text }[] = [
  {
    heading: {
      en: "Consent, not scraping",
      hi: "सहमति, स्क्रैपिंग नहीं",
      gu: "સંમતિ, સ્ક્રેપિંગ નહીં",
    },
    body: {
      en: "The unlock is modelled on the consent framework in MoRTH's own National Transport Repository data-sharing policy: the current owner authorises the release, the buyer sees the fuller record, and the release is logged. No page of any government site was scraped to build this; the research behind it used public pages read by hand.",
      hi: "अनलॉक MoRTH की अपनी National Transport Repository डेटा-साझा नीति के सहमति ढांचे पर आधारित है: मौजूदा मालिक अनुमति देता है, खरीदार पूरा रिकॉर्ड देखता है, और यह अनुमति दर्ज होती है। इसे बनाने के लिए किसी सरकारी साइट का कोई पेज स्क्रैप नहीं किया गया; इसके पीछे का शोध हाथ से पढ़े गए सार्वजनिक पेजों पर आधारित है।",
      gu: "અનલૉક MoRTH ની પોતાની National Transport Repository ડેટા-શેરિંગ નીતિના સંમતિ માળખા પર આધારિત છે: હાલનો માલિક પરવાનગી આપે છે, ખરીદનાર સંપૂર્ણ રેકોર્ડ જુએ છે, અને એ પરવાનગી નોંધાય છે. આ બનાવવા માટે કોઈ સરકારી સાઇટનું કોઈ પેજ સ્ક્રેપ કરાયું નથી; તેની પાછળનું સંશોધન હાથે વાંચેલા જાહેર પેજ પર આધારિત છે.",
    },
  },
  {
    heading: {
      en: "A read layer, not a second registry",
      hi: "एक रीड लेयर, दूसरी रजिस्ट्री नहीं",
      gu: "એક રીડ લેયર, બીજી રજિસ્ટ્રી નહીં",
    },
    body: {
      en: "Vahan and Sarathi stay the source of truth. This is a citizen-facing read-and-submit layer over consented APIs, so nothing here has to be reconciled with the RTO's records later.",
      hi: "वाहन और सारथी ही सत्य के स्रोत रहते हैं। यह सहमति-आधारित API के ऊपर नागरिकों के लिए एक पढ़ने-और-जमा करने वाली परत है, इसलिए यहां का कुछ भी बाद में RTO के रिकॉर्ड से मिलाना नहीं पड़ता।",
      gu: "વાહન અને સારથી જ સત્યના સ્રોત રહે છે. આ સંમતિ-આધારિત API ઉપર નાગરિકો માટે વાંચવા-અને-જમા કરવાનું એક સ્તર છે, તેથી અહીંનું કંઈ પણ પછીથી RTO ના રેકોર્ડ સાથે મેળવવું પડતું નથી.",
    },
  },
  {
    heading: {
      en: "Charge for the report, not for the service",
      hi: "शुल्क रिपोर्ट का, सेवा का नहीं",
      gu: "ફી રિપોર્ટની, સેવાની નહીં",
    },
    body: {
      en: "A small report fee funds the consent infrastructure and gives buyers a lawful alternative to the private data resellers who exist precisely because the official record is thin.",
      hi: "एक छोटा रिपोर्ट शुल्क सहमति के ढांचे को चलाता है और खरीदारों को उन निजी डेटा बेचने वालों का कानूनी विकल्प देता है, जो मौजूद ही इसलिए हैं क्योंकि सरकारी रिकॉर्ड अधूरा है।",
      gu: "એક નાની રિપોર્ટ ફી સંમતિના માળખાને ચલાવે છે અને ખરીદનારને એ ખાનગી ડેટા વેચનારાઓનો કાયદેસર વિકલ્પ આપે છે, જે અસ્તિત્વમાં જ એટલા માટે છે કારણ કે સરકારી રેકોર્ડ અધૂરો છે.",
    },
  },
  {
    heading: {
      en: "A real database, with a fallback underneath",
      hi: "एक असली डेटाबेस, और उसके नीचे एक फ़ॉलबैक",
      gu: "એક સાચો ડેટાબેઝ, અને તેની નીચે એક ફોલબેક",
    },
    body: {
      en: "The vehicle record — vehicles, owners and challans — lives in Postgres (Supabase), with row-level security so the public can read the vehicle record but only an admin role can write it. Signing in is not authorisation on its own: authority comes from a role row the database checks on every query. Underneath that, the app keeps the synthetic fleet as a fallback and serves it whenever the database is unset, asleep or unreachable — a free-tier project pauses when idle, and this demo has to survive a judge opening it weeks after submission. The admin panel says which source it is reading so nobody is misled. Your own applications and payments are deliberately NOT sent to the server yet: they stay in your browser, so each reviewer gets a clean sandbox instead of sharing one pile of test records. Persisting them per-citizen is the next step, and needs a real identity to attach them to.",
      hi: "वाहन रिकॉर्ड — वाहन, मालिक और चालान — Postgres (Supabase) में रहता है, row-level security के साथ, ताकि जनता वाहन रिकॉर्ड पढ़ सके पर लिख केवल admin भूमिका सके। साइन इन करना अपने आप में अधिकार नहीं है: अधिकार उस role row से आता है जिसे डेटाबेस हर क्वेरी पर जांचता है। इसके नीचे ऐप काल्पनिक बेड़े को फ़ॉलबैक के रूप में रखता है और जब भी डेटाबेस सेट नहीं, सोया हुआ या अनुपलब्ध हो, वही परोसता है — फ्री-टियर प्रोजेक्ट खाली पड़े रहने पर रुक जाता है, और इस डेमो को जमा करने के हफ्तों बाद खोले जाने पर भी चलना है। एडमिन पैनल बताता है कि वह कौन सा स्रोत पढ़ रहा है, ताकि कोई गलतफहमी न हो। आपके अपने आवेदन और भुगतान जानबूझकर अभी सर्वर पर नहीं भेजे जाते: वे आपके ब्राउज़र में रहते हैं, ताकि हर समीक्षक को टेस्ट रिकॉर्ड के साझा ढेर की जगह एक साफ़ सैंडबॉक्स मिले। इन्हें हर नागरिक के लिए सहेजना अगला कदम है, और उसके लिए एक असली पहचान चाहिए जिससे इन्हें जोड़ा जाए।",
      gu: "વાહન રેકોર્ડ — વાહનો, માલિકો અને ચલણ — Postgres (Supabase) માં રહે છે, row-level security સાથે, જેથી જનતા વાહન રેકોર્ડ વાંચી શકે પણ લખી ફક્ત admin ભૂમિકા શકે. સાઇન ઇન કરવું એ પોતે અધિકાર નથી: અધિકાર એ role row માંથી આવે છે જેને ડેટાબેઝ દરેક ક્વેરી પર તપાસે છે. તેની નીચે એપ કાલ્પનિક કાફલાને ફોલબેક તરીકે રાખે છે અને જ્યારે પણ ડેટાબેઝ સેટ ન હોય, સૂતો હોય કે પહોંચ બહાર હોય ત્યારે એ જ પીરસે છે — ફ્રી-ટિયર પ્રોજેક્ટ નવરો પડ્યે અટકી જાય છે, અને આ ડેમોએ સબમિશનના અઠવાડિયાં પછી કોઈ જજ ખોલે તોય ચાલવું પડે. એડમિન પેનલ જણાવે છે કે તે કયો સ્રોત વાંચી રહ્યું છે, જેથી કોઈ ગેરસમજ ન થાય. તમારી પોતાની અરજીઓ અને ચુકવણીઓ જાણીજોઈને હજુ સર્વર પર મોકલાતી નથી: તે તમારા બ્રાઉઝરમાં રહે છે, જેથી દરેક સમીક્ષકને ટેસ્ટ રેકોર્ડના સહિયારા ઢગલાને બદલે એક સ્વચ્છ સેન્ડબોક્સ મળે. તેમને દરેક નાગરિક માટે સાચવવું એ આગળનું પગલું છે, અને તેના માટે એક સાચી ઓળખ જોઈએ જેની સાથે તેમને જોડી શકાય.",
    },
  },
  {
    heading: {
      en: "Degrade instead of failing",
      hi: "फेल होने के बजाय घटकर चलना",
      gu: "નિષ્ફળ થવાને બદલે ઘટીને ચાલવું",
    },
    body: {
      en: "Every dependency here has a fallback: the AI falls back to rules, the data layer falls back to local state. A public service should stay usable when a downstream system is down — which, on the current portals, it frequently is.",
      hi: "यहां हर निर्भरता का एक फ़ॉलबैक है: AI नियमों पर लौटता है, डेटा परत स्थानीय स्थिति पर। जब कोई पिछला सिस्टम बंद हो तब भी सार्वजनिक सेवा चलनी चाहिए — और मौजूदा पोर्टलों पर वह अक्सर बंद रहता है।",
      gu: "અહીં દરેક નિર્ભરતાનું એક ફોલબેક છે: AI નિયમો પર પાછું ફરે છે, ડેટા સ્તર સ્થાનિક સ્થિતિ પર. જ્યારે કોઈ પાછળનું સિસ્ટમ બંધ હોય ત્યારે પણ જાહેર સેવા વાપરી શકાય તેવી રહેવી જોઈએ — અને હાલના પોર્ટલ પર તે વારંવાર બંધ રહે છે.",
    },
  },
  {
    heading: {
      en: "Built for the actual device",
      hi: "उसी डिवाइस के लिए बना जो सचमुच इस्तेमाल होता है",
      gu: "એ જ ડિવાઇસ માટે બનેલું જે ખરેખર વપરાય છે",
    },
    body: {
      en: "Mobile-first layouts, no blocking third-party scripts, and the whole interface in Hindi and Gujarati as well as English, because the citizens who lose most to this problem are not on a desktop with fast broadband.",
      hi: "मोबाइल-पहले लेआउट, कोई ब्लॉक करने वाली थर्ड-पार्टी स्क्रिप्ट नहीं, और पूरा इंटरफ़ेस अंग्रेज़ी के साथ-साथ हिंदी और गुजराती में, क्योंकि इस समस्या में सबसे ज्यादा नुकसान उठाने वाले नागरिक तेज़ ब्रॉडबैंड वाले डेस्कटॉप पर नहीं हैं।",
      gu: "મોબાઇલ-પહેલાં લેઆઉટ, કોઈ બ્લોક કરતી થર્ડ-પાર્ટી સ્ક્રિપ્ટ નહીં, અને આખું ઇન્ટરફેસ અંગ્રેજી ઉપરાંત હિન્દી અને ગુજરાતીમાં, કારણ કે આ સમસ્યામાં સૌથી વધુ નુકસાન વેઠનારા નાગરિકો ઝડપી બ્રોડબેન્ડવાળા ડેસ્કટોપ પર નથી.",
    },
  },
];

/**
 * The roadmap, on the page judges read rather than buried in the changelog.
 *
 * Scoped to Gujarat on purpose: the deep walkthrough in
 * `research/parivahan-gujarat-deep-flows.md` was done with Gujarat selected, so
 * every number below is a Gujarat number we can point at. Nothing here is
 * built — the flow-relevance matrix in that doc marks all of it roadmap.
 */
export const NEXT: { heading: Text; body: Text }[] = [
  {
    heading: {
      en: "Fitness and ATS booking, then tax and permits",
      hi: "पहले फ़िटनेस और ATS बुकिंग, फिर टैक्स और परमिट",
      gu: "પહેલાં ફિટનેસ અને ATS બુકિંગ, પછી ટેક્સ અને પરમિટ",
    },
    body: {
      en: "Gujarat has 65 automated testing stations, more than any other state, out of 309 nationally — and national permits alone move ₹193 crore a year here. A commercial operator books fitness, pays MV tax and renews a permit on three separate portals today. Same account, same stage tracker, one queue.",
      hi: "गुजरात में 65 स्वचालित परीक्षण केंद्र (ATS) हैं, देश के कुल 309 में से सबसे ज़्यादा — और अकेले राष्ट्रीय परमिट यहां साल में ₹193 करोड़ के हैं। आज एक व्यावसायिक ऑपरेटर फ़िटनेस बुक करने, MV टैक्स भरने और परमिट नवीनीकरण के लिए तीन अलग पोर्टल इस्तेमाल करता है। वही खाता, वही चरण-ट्रैकर, एक ही कतार।",
      gu: "ગુજરાતમાં 65 ઓટોમેટેડ ટેસ્ટિંગ સ્ટેશન (ATS) છે, દેશના કુલ 309માંથી સૌથી વધુ — અને એકલા રાષ્ટ્રીય પરમિટ અહીં વર્ષે ₹193 કરોડના છે. આજે એક વ્યાવસાયિક ઓપરેટર ફિટનેસ બુક કરવા, MV ટેક્સ ભરવા અને પરમિટ રિન્યુ કરવા ત્રણ અલગ પોર્ટલ વાપરે છે. એ જ ખાતું, એ જ સ્ટેજ ટ્રેકર, એક જ કતાર.",
    },
  },
  {
    heading: {
      en: "Learner licence and DL renewal",
      hi: "लर्नर लाइसेंस और DL नवीनीकरण",
      gu: "લર્નર લાઇસન્સ અને DL રિન્યુઅલ",
    },
    body: {
      en: "Gujarat already runs about 28 licence services contactless through Aadhaar eKYC, and its learner-licence flow is seven stages — the same shape as our transfer wizard. The gap is the front end: a captcha stands between a citizen and merely viewing slot availability. Renewals after 40 also need a Form 1A doctor, so the wizard would carry an empanelled-doctor finder.",
      hi: "गुजरात पहले से ही लगभग 28 लाइसेंस सेवाएं आधार eKYC से संपर्करहित चलाता है, और उसका लर्नर लाइसेंस फ़्लो सात चरणों का है — हमारे ट्रांसफ़र विज़ार्ड जैसा ही। कमी सामने वाले हिस्से में है: सिर्फ़ स्लॉट देखने के लिए भी कैप्चा सामने आता है। 40 के बाद नवीनीकरण में Form 1A डॉक्टर भी चाहिए, इसलिए विज़ार्ड के साथ सूचीबद्ध डॉक्टर खोजने की सुविधा भी आएगी।",
      gu: "ગુજરાત પહેલેથી જ લગભગ 28 લાઇસન્સ સેવાઓ આધાર eKYC થી સંપર્કરહિત ચલાવે છે, અને તેનો લર્નર લાઇસન્સ ફ્લો સાત તબક્કાનો છે — અમારા ટ્રાન્સફર વિઝાર્ડ જેવો જ. ખામી આગળના ભાગમાં છે: ફક્ત સ્લોટ જોવા માટે પણ કેપ્ચા આવે છે. 40 પછીના રિન્યુઅલમાં Form 1A ડૉક્ટર પણ જોઈએ, તેથી વિઝાર્ડ સાથે સૂચિબદ્ધ ડૉક્ટર શોધવાની સુવિધા પણ આવશે.",
    },
  },
  {
    heading: {
      en: "Fancy numbers you can browse before you log in",
      hi: "फ़ैंसी नंबर, लॉगिन से पहले देख सकें",
      gu: "ફેન્સી નંબર, લોગિન પહેલાં જોઈ શકાય",
    },
    body: {
      en: "Auction cycles run in all 40 Gujarat RTO codes and the calendar is already public, yet the portal asks for a login before it shows you a single number. Browsing first and signing in only to bid is the whole change.",
      hi: "नीलामी चक्र गुजरात के सभी 40 RTO कोड में चलते हैं और कैलेंडर पहले से सार्वजनिक है, फिर भी पोर्टल एक भी नंबर दिखाने से पहले लॉगिन मांगता है। पहले देखने दें, बोली लगाते समय ही साइन इन कराएं — बदलाव बस इतना है।",
      gu: "હરાજી ચક્ર ગુજરાતના બધા 40 RTO કોડમાં ચાલે છે અને કેલેન્ડર પહેલેથી જાહેર છે, છતાં પોર્ટલ એક પણ નંબર બતાવ્યા પહેલાં લોગિન માંગે છે. પહેલાં જોવા દો, બોલી લગાવતી વખતે જ સાઇન ઇન કરાવો — ફેરફાર બસ એટલો જ છે.",
    },
  },
  {
    heading: {
      en: "Scrapping, the mirror of this journey",
      hi: "स्क्रैपिंग, इसी यात्रा का उल्टा सिरा",
      gu: "સ્ક્રેપિંગ, આ જ યાત્રાનો સામો છેડો",
    },
    body: {
      en: "Gujarat has 12 registered scrapping facilities. A vehicle that reaches the end of its life should hand its owner a Certificate of Deposit, and that certificate should turn into a discount on the next registration inside the same account — the buying journey run backwards.",
      hi: "गुजरात में 12 पंजीकृत स्क्रैपिंग केंद्र हैं। जीवन के अंत तक पहुंचा वाहन अपने मालिक को जमा प्रमाणपत्र देना चाहिए, और वह प्रमाणपत्र उसी खाते के भीतर अगले पंजीकरण पर छूट बन जाना चाहिए — यानी खरीद की यात्रा उल्टी दिशा में।",
      gu: "ગુજરાતમાં 12 નોંધાયેલાં સ્ક્રેપિંગ કેન્દ્રો છે. જીવનના અંતે પહોંચેલું વાહન તેના માલિકને જમા પ્રમાણપત્ર આપવું જોઈએ, અને એ પ્રમાણપત્ર એ જ ખાતામાં આગલી નોંધણી પર છૂટ બની જવું જોઈએ — એટલે કે ખરીદીની યાત્રા ઊંધી દિશામાં.",
    },
  },
  {
    heading: {
      en: "One place to complain",
      hi: "शिकायत के लिए एक ही जगह",
      gu: "ફરિયાદ માટે એક જ જગ્યા",
    },
    body: {
      en: "Grievances are spread across four systems today, and Sarathi's asks for a mobile number, a captcha and an OTP before it will even show you the form. Every failure in a unified account should raise one ticket, visible next to the application it came from.",
      hi: "आज शिकायतें चार अलग सिस्टम में बंटी हैं, और सारथी की शिकायत फ़ॉर्म दिखाने से पहले ही मोबाइल नंबर, कैप्चा और OTP मांगता है। एक साझा खाते में हर गड़बड़ी एक ही टिकट बने, और वह उसी आवेदन के बगल में दिखे जिससे वह उठी है।",
      gu: "આજે ફરિયાદો ચાર અલગ સિસ્ટમમાં વહેંચાયેલી છે, અને સારથીનું ફરિયાદ ફોર્મ બતાવ્યા પહેલાં જ મોબાઇલ નંબર, કેપ્ચા અને OTP માંગે છે. એક સહિયારા ખાતામાં દરેક ખામી એક જ ટિકિટ બને, અને એ જ અરજીની બાજુમાં દેખાય જેમાંથી તે ઊભી થઈ છે.",
    },
  },
];
