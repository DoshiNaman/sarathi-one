/**
 * What to offer someone before they have typed anything, per screen.
 *
 * The panel used to show the first four entries of the knowledge base on every
 * route, so a first-time visitor on the landing page was offered "What is Form
 * 35?" before they had entered a registration number. A suggestion is only
 * worth the tap if it is the thing that person was about to ask anyway, and on
 * a used-vehicle site that changes completely between the screen where you are
 * deciding to buy and the screen where you are signing the forms.
 *
 * Three per screen, ordered by what people want most there. The first one on
 * the landing page names a real vehicle on purpose: it is both the commonest
 * question and, because Krishna can steer, the fastest way into the product.
 */
import type { Text } from "./story";

const DEFAULT: Text[] = [
  {
    en: "Is GJ01AB1234 safe to buy?",
    hi: "क्या GJ01AB1234 खरीदना सुरक्षित है?",
    gu: "શું GJ01AB1234 ખરીદવું સુરક્ષિત છે?",
  },
  {
    en: "What should I check before I pay for a used vehicle?",
    hi: "पुराना वाहन खरीदने से पहले क्या-क्या जांचूं?",
    gu: "જૂનું વાહન ખરીદતાં પહેલાં શું શું તપાસું?",
  },
  {
    en: "What can this site tell me that Parivahan cannot?",
    hi: "यह साइट मुझे क्या बता सकती है जो परिवहन नहीं बताता?",
    gu: "આ સાઇટ મને શું કહી શકે જે પરિવહન નથી કહેતું?",
  },
];

const BY_STEP: { prefix: string; asks: Text[] }[] = [
  {
    prefix: "/check",
    asks: [
      {
        en: "What does this free view leave out?",
        hi: "यह मुफ़्त जानकारी क्या-क्या छिपा रही है?",
        gu: "આ મફત માહિતી શું શું છુપાવે છે?",
      },
      {
        en: "Why is the owner's name hidden?",
        hi: "मालिक का नाम क्यों छिपा है?",
        gu: "માલિકનું નામ કેમ છુપાયેલું છે?",
      },
      {
        en: "What am I paying ₹99 for?",
        hi: "₹99 किस चीज़ के लिए दे रहा हूं?",
        gu: "₹99 શેના માટે આપી રહ્યો છું?",
      },
    ],
  },
  {
    prefix: "/report",
    asks: [
      {
        en: "Can I buy this if the loan is still active?",
        hi: "लोन अभी चालू है तो क्या मैं यह खरीद सकता हूं?",
        gu: "લોન હજી ચાલુ છે તો શું હું આ ખરીદી શકું?",
      },
      {
        en: "Is this price fair?",
        hi: "क्या यह कीमत सही है?",
        gu: "શું આ કિંમત યોગ્ય છે?",
      },
      {
        en: "Who pays the pending challans after I buy?",
        hi: "खरीदने के बाद बाकी चालान कौन भरेगा?",
        gu: "ખરીદ્યા પછી બાકી ચલણ કોણ ભરશે?",
      },
    ],
  },
  {
    prefix: "/transfer",
    asks: [
      {
        en: "What is Form 35 and why is it in my way?",
        hi: "Form 35 क्या है और यह बीच में क्यों आया?",
        gu: "Form 35 શું છે અને એ વચ્ચે કેમ આવ્યું?",
      },
      {
        en: "What happens if I never transfer it?",
        hi: "अगर मैंने ट्रांसफ़र कराया ही नहीं तो क्या होगा?",
        gu: "જો મેં ટ્રાન્સફર કરાવ્યું જ નહીં તો શું થશે?",
      },
      {
        en: "How long does the RTO take?",
        hi: "RTO में कितना समय लगता है?",
        gu: "RTO માં કેટલો સમય લાગે છે?",
      },
    ],
  },
  {
    prefix: "/garage",
    asks: [
      {
        en: "What expires next?",
        hi: "अगली एक्सपायरी कौन सी है?",
        gu: "આગળની એક્સપાયરી કઈ છે?",
      },
      {
        en: "What does my application stage mean?",
        hi: "मेरे आवेदन का यह चरण क्या कहता है?",
        gu: "મારી અરજીનો આ તબક્કો શું કહે છે?",
      },
      {
        en: "What happens if my PUC has lapsed?",
        hi: "PUC खत्म हो गया तो क्या होगा?",
        gu: "PUC પૂરું થઈ ગયું તો શું થશે?",
      },
    ],
  },
  {
    prefix: "/crash",
    asks: [
      {
        en: "What do I do right now?",
        hi: "अभी इसी वक्त क्या करूं?",
        gu: "અત્યારે આ જ ક્ષણે શું કરું?",
      },
      {
        en: "Who pays for the hospital?",
        hi: "अस्पताल का खर्च कौन देगा?",
        gu: "હોસ્પિટલનો ખર્ચ કોણ આપશે?",
      },
      {
        en: "Am I protected if I help someone?",
        hi: "किसी की मदद करूं तो क्या मुझे कानूनी सुरक्षा है?",
        gu: "કોઈની મદદ કરું તો શું મને કાયદાકીય રક્ષણ છે?",
      },
    ],
  },
  {
    prefix: "/status",
    asks: [
      {
        en: "What does this stage mean?",
        hi: "यह चरण क्या मतलब रखता है?",
        gu: "આ તબક્કાનો શું અર્થ છે?",
      },
      {
        en: "Why is it taking this long?",
        hi: "इतना समय क्यों लग रहा है?",
        gu: "આટલો સમય કેમ લાગી રહ્યો છે?",
      },
      {
        en: "What do I do if it is stuck?",
        hi: "अगर यह अटक गया तो क्या करूं?",
        gu: "જો આ અટકી ગયું તો શું કરું?",
      },
    ],
  },
  {
    prefix: "/services",
    asks: [
      {
        en: "Which of these do I actually need?",
        hi: "इनमें से मुझे असल में कौन सी चाहिए?",
        gu: "આમાંથી મને ખરેખર કઈ જોઈએ?",
      },
      {
        en: "Does my vehicle need a fitness certificate?",
        hi: "क्या मेरे वाहन को फ़िटनेस प्रमाणपत्र चाहिए?",
        gu: "શું મારા વાહનને ફિટનેસ પ્રમાણપત્ર જોઈએ?",
      },
      {
        en: "How do I book an ATS slot in Gujarat?",
        hi: "गुजरात में ATS स्लॉट कैसे बुक करूं?",
        gu: "ગુજરાતમાં ATS સ્લોટ કેવી રીતે બુક કરું?",
      },
    ],
  },
];

export function asksFor(path: string) {
  return BY_STEP.find((s) => path.startsWith(s.prefix))?.asks ?? DEFAULT;
}
