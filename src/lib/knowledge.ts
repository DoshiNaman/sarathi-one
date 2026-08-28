/**
 * Plain-language answers to the questions a citizen actually asks mid-journey.
 * Grounded in the statutory forms and rules documented in our Parivahan research.
 * Doubles as the Sahayak fallback when no OpenAI key is configured, and as the
 * grounding context sent to the model when one is.
 */
export type Answer = { en: string; hi: string };

export const KNOWLEDGE: { id: string; keywords: string[]; q: Answer; a: Answer }[] = [
  {
    id: "form35",
    keywords: [
      "form 35",
      "form35",
      "hp termination",
      "hypothecation",
      "loan remove",
      "loan hatana",
      "बैंक",
      "लोन",
    ],
    q: { en: "What is Form 35?", hi: "Form 35 क्या है?" },
    a: {
      en: "Form 35 is how a vehicle loan is removed from the RC. When a bank finances a vehicle, its name is stamped on the RC as hypothecation. After the loan is fully repaid the bank issues a No Objection Certificate, and Form 35 (signed by you and the bank) tells the RTO to erase that entry. Until it is done, the bank still has a legal claim on the vehicle — so as a buyer, never pay in full before Form 35 is cleared.",
      hi: "Form 35 वाहन के RC से लोन हटाने का तरीका है। जब बैंक गाड़ी के लिए लोन देता है, तो RC पर उसका नाम हाइपोथिकेशन के रूप में दर्ज होता है। लोन पूरा चुकाने के बाद बैंक NOC देता है, और Form 35 (आपके और बैंक के हस्ताक्षर सहित) RTO को वह प्रविष्टि हटाने को कहता है। जब तक यह नहीं होता, गाड़ी पर बैंक का कानूनी दावा बना रहता है — इसलिए खरीदार के रूप में, Form 35 पूरा होने से पहले पूरा भुगतान कभी न करें।",
    },
  },
  {
    id: "form2930",
    keywords: [
      "form 29",
      "form 30",
      "transfer",
      "ownership",
      "naam transfer",
      "स्वामित्व",
      "ट्रांसफर",
    ],
    q: { en: "What are Forms 29 and 30?", hi: "Form 29 और 30 क्या हैं?" },
    a: {
      en: "They are the two halves of a vehicle sale. Form 29 is the seller's notice that they have sold the vehicle; Form 30 is the buyer's application to have the RC put in their name. Both must reach the RTO within 14 days of the sale when buyer and seller are in the same state. If you skip this, the vehicle legally stays the seller's — and so does every future challan and liability.",
      hi: "ये वाहन बिक्री के दो हिस्से हैं। Form 29 विक्रेता की सूचना है कि उसने गाड़ी बेच दी; Form 30 खरीदार का आवेदन है कि RC उसके नाम हो। एक ही राज्य में बिक्री पर दोनों 14 दिन के भीतर RTO पहुंचने चाहिए। ऐसा न करने पर गाड़ी कानूनी रूप से विक्रेता की ही रहती है — और भविष्य के सभी चालान और देनदारियां भी।",
    },
  },
  {
    id: "noc",
    keywords: ["noc", "form 28", "another state", "dusre rajya", "एनओसी", "राज्य"],
    q: { en: "When do I need an NOC?", hi: "NOC कब चाहिए?" },
    a: {
      en: "You need a No Objection Certificate (Form 28) when the vehicle is moving out of the RTO that registered it — typically selling across state lines. The issuing RTO checks that road tax is paid, insurance is valid and there are no pending dues or cases, then clears the vehicle to be re-registered elsewhere. Get this before money changes hands; an NOC refusal after payment is a painful place to be.",
      hi: "जब गाड़ी उस RTO के क्षेत्र से बाहर जा रही हो जिसने उसे रजिस्टर किया था — आमतौर पर दूसरे राज्य में बेचते समय — तब NOC (Form 28) चाहिए। RTO जांचता है कि रोड टैक्स भरा है, बीमा वैध है और कोई बकाया या मुकदमा नहीं है, फिर गाड़ी को कहीं और रजिस्टर होने की अनुमति देता है। भुगतान से पहले यह ले लें।",
    },
  },
  {
    id: "challan",
    keywords: ["challan", "fine", "traffic", "चालान", "जुर्माना"],
    q: {
      en: "Who pays a pending challan after I buy?",
      hi: "खरीदने के बाद बकाया चालान कौन भरेगा?",
    },
    a: {
      en: "Challans follow the vehicle, not the person. Once the RC is in your name, an unpaid challan from the previous owner becomes your problem to sort out — and it can block services like fitness or the next transfer. Always make the seller clear pending challans before you complete the purchase, and check them again on the day of transfer.",
      hi: "चालान व्यक्ति के नहीं, वाहन के साथ चलते हैं। RC आपके नाम होने के बाद पिछले मालिक का बकाया चालान आपकी समस्या बन जाता है — और यह फिटनेस या अगले ट्रांसफर जैसी सेवाएं रोक सकता है। खरीद पूरी करने से पहले विक्रेता से चालान भरवाएं, और ट्रांसफर वाले दिन दोबारा जांचें।",
    },
  },
  {
    id: "puc",
    keywords: ["puc", "pollution", "प्रदूषण", "पीयूसी"],
    q: { en: "What is PUC and why does it matter?", hi: "PUC क्या है और क्यों जरूरी है?" },
    a: {
      en: "A Pollution Under Control certificate proves your vehicle's emissions are within legal limits. It must be valid at all times while the vehicle is on the road, and driving without one is a fineable offence. It is also checked during transfer of ownership and NOC, so an expired PUC can stall your paperwork.",
      hi: "PUC प्रमाणपत्र साबित करता है कि आपकी गाड़ी का उत्सर्जन कानूनी सीमा में है। सड़क पर गाड़ी चलने तक यह हमेशा वैध होना चाहिए, और इसके बिना चलाना दंडनीय है। ट्रांसफर और NOC के समय भी यह जांचा जाता है, इसलिए समाप्त PUC आपके कागजी काम को रोक सकता है।",
    },
  },
  {
    id: "owners",
    keywords: ["owner", "how many owners", "kitne malik", "मालिक", "ownership history"],
    q: {
      en: "Why does the number of owners matter?",
      hi: "मालिकों की संख्या क्यों मायने रखती है?",
    },
    a: {
      en: "A vehicle that changed hands many times in a few years is worth asking about — frequent resale can signal a recurring mechanical problem, an accident history, or disputed paperwork. It also affects resale value later. The official public lookup does not show the owner count at all, which is exactly why buyers get surprised.",
      hi: "कुछ ही सालों में कई बार बिकी गाड़ी के बारे में सवाल पूछना चाहिए — बार-बार बिक्री किसी बार-बार आने वाली यांत्रिक समस्या, दुर्घटना के इतिहास या विवादित कागजात का संकेत हो सकती है। यह आगे की रीसेल कीमत को भी प्रभावित करती है। सरकारी सार्वजनिक लुकअप मालिकों की संख्या दिखाता ही नहीं।",
    },
  },
  {
    id: "accident",
    keywords: ["accident", "112", "emergency", "crash", "दुर्घटना", "एम्बुलेंस"],
    q: { en: "What do I do right after an accident?", hi: "दुर्घटना के तुरंत बाद क्या करें?" },
    a: {
      en: "Call 112 first — it reaches police, ambulance and fire. Under the Cashless Treatment of Road Accident Victims Scheme, 2025, a victim gets up to ₹1.5 lakh of treatment for seven days at a designated hospital with no money paid upfront. If you are helping a stranger, you are protected as a Good Samaritan: no legal liability, no obligation to reveal your identity, and there is a ₹25,000 Rahveer reward for taking someone to hospital in the golden hour.",
      hi: "पहले 112 पर कॉल करें — यह पुलिस, एम्बुलेंस और फायर तक पहुंचता है। सड़क दुर्घटना पीड़ितों के कैशलेस उपचार योजना, 2025 के तहत पीड़ित को निर्धारित अस्पताल में सात दिन तक ₹1.5 लाख तक का इलाज बिना पैसे दिए मिलता है। किसी अजनबी की मदद कर रहे हैं तो आप Good Samaritan के रूप में सुरक्षित हैं: कोई कानूनी देनदारी नहीं, पहचान बताना जरूरी नहीं, और गोल्डन ऑवर में अस्पताल पहुंचाने पर ₹25,000 का रहवीर पुरस्कार है।",
    },
  },
  {
    id: "fitness",
    keywords: ["fitness", "commercial", "फिटनेस", "व्यावसायिक"],
    q: { en: "What is a fitness certificate?", hi: "फिटनेस प्रमाणपत्र क्या है?" },
    a: {
      en: "Commercial vehicles need a fitness certificate proving the vehicle is roadworthy. It is renewed periodically at an Automated Testing Station, which inspects brakes, tyres, lights and emissions by machine rather than by eye. Gujarat has 65 such stations, the most of any state. Private cars need fitness only when re-registering after 15 years.",
      hi: "व्यावसायिक वाहनों को फिटनेस प्रमाणपत्र चाहिए जो साबित करे कि गाड़ी सड़क योग्य है। यह समय-समय पर Automated Testing Station पर नवीनीकृत होता है, जहां ब्रेक, टायर, लाइट और उत्सर्जन मशीन से जांचे जाते हैं। गुजरात में ऐसे 65 स्टेशन हैं, जो देश में सबसे ज्यादा हैं। निजी कारों को 15 साल बाद पुनः पंजीकरण पर ही फिटनेस चाहिए।",
    },
  },
];

/** Lightweight keyword match — the fallback brain when no model is configured. */
export function matchAnswer(question: string): Answer | null {
  const q = question.toLowerCase();
  let best: { hits: number; a: Answer } | null = null;
  for (const entry of KNOWLEDGE) {
    const hits = entry.keywords.filter((k) => q.includes(k.toLowerCase())).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { hits, a: entry.a };
  }
  return best?.a ?? null;
}

export const NO_MATCH: Answer = {
  en: 'I can help with buying a used vehicle, transfer of ownership, loans and Form 35, NOCs, challans, PUC, fitness, and what to do after an accident. Try asking about one of those — for example, "what is Form 35?"',
  hi: 'मैं पुरानी गाड़ी खरीदने, स्वामित्व ट्रांसफर, लोन और Form 35, NOC, चालान, PUC, फिटनेस, और दुर्घटना के बाद क्या करें — इनमें मदद कर सकता हूं। इनमें से कुछ पूछें, जैसे "Form 35 क्या है?"',
};
