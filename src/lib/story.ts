/** The submission's argument, kept in code so the app and the write-up cannot drift apart. */

export const WHO =
  "Anyone buying or selling a second-hand vehicle in India — roughly one in every two vehicle sales. The buyer is usually spending several months of income on a machine whose history they cannot see, guided by a seller who has every reason to leave things out.";

export const TODAY: { problem: string; detail: string }[] = [
  {
    problem: "The official record shows a buyer almost nothing",
    detail:
      "The public lookup returns about ten fields with the owner's name masked, and it is capped at three lookups a day. Loan status is a bare yes/no with no bank named. There is no ownership count, no accident history, no challan history.",
  },
  {
    problem: "One sale is spread across four disconnected portals",
    detail:
      "Form 29/30 on Vahan, Form 35 for the loan, a separate ePayment app, a separate slot-booking app. Each has its own design, its own login model, and its own captcha.",
  },
  {
    problem: "There is no citizen account anywhere on the web",
    detail:
      "Every journey restarts at a state dropdown and is tracked only by an application number you must not lose. Your applications, payments and documents are never in one place. The four logins on the portal's own menu are all for staff and dealers.",
  },
  {
    problem: "Nothing tells you what the paperwork means",
    detail:
      "Form 35 decides whether a bank still owns a claim on your car, but nowhere in the flow does anything explain that in plain words, in your language.",
  },
];

export const CHANGED: { change: string; why: string }[] = [
  {
    change: "One mobile login for every service",
    why: "Replaces four staff logins, per-portal accounts, and per-application number lookups. Your vehicles, applications, payments and receipts live in one garage.",
  },
  {
    change: "A Trust Report the seller consents to unlock",
    why: "Ownership timeline, the financier's actual name, challans, accident flag and a fair-price band — the things that decide whether to buy. Consent is what makes it lawful to show more than the masked public view.",
  },
  {
    change: "One guided transfer instead of four portals",
    why: "Form 35 is detected and bundled automatically when a loan is live, so a buyer cannot accidentally pay for a car the bank still has a claim on.",
  },
  {
    change: "Sahayak, a helper that knows which step you are on",
    why: "Answers 'what is Form 35?' in Hindi or English, in four sentences, at the moment the question occurs.",
  },
  {
    change: "A Crash Card for the worst day",
    why: "112, cashless golden-hour treatment worth ₹1.5 lakh, and Good Samaritan protections — all real 2025 entitlements that appear nowhere in the current citizen interface.",
  },
];

export const REAL: string[] = [
  "The complete citizen journey: login, vehicle check, consent unlock, Trust Report, guided transfer, garage, status tracking, Crash Card",
  "The rule engine that grades a vehicle GOOD / CAUTION / AVOID from its record",
  "The EMI calculator",
  "Sahayak's bilingual answers, grounded in a knowledge base built from primary-source research",
  "English and Hindi across the interface",
  "An end-to-end automated test that walks the whole journey on every deploy",
];

export const MOCKED: string[] = [
  "All vehicle, owner, challan and accident data — an eight-vehicle synthetic Gujarat fleet. No real registration number will return anything",
  "OTPs: a fixed demo code, shown on screen. No SMS is sent",
  "Payments: no money moves, no gateway is contacted",
  "Seller consent, e-sign and the bank's NOC are simulated",
  "RTO appointment slots are not real bookings",
  "The accident record demonstrates what consented eDAR integration could surface; no such citizen-facing data exists today",
  "The AI verdict paragraph needs an OpenAI key; without one the rule engine answers and the screen says so",
];

export const SCALE: { heading: string; body: string }[] = [
  {
    heading: "Consent, not scraping",
    body: "The unlock is modelled on the consent framework in MoRTH's own National Transport Repository data-sharing policy: the current owner authorises the release, the buyer sees the fuller record, and the release is logged. No page of any government site was scraped to build this; the research behind it used public pages read by hand.",
  },
  {
    heading: "A read layer, not a second registry",
    body: "Vahan and Sarathi stay the source of truth. This is a citizen-facing read-and-submit layer over consented APIs, so nothing here has to be reconciled with the RTO's records later.",
  },
  {
    heading: "Charge for the report, not for the service",
    body: "A small report fee funds the consent infrastructure and gives buyers a lawful alternative to the private data resellers who exist precisely because the official record is thin.",
  },
  {
    heading: "Degrade instead of failing",
    body: "Every dependency here has a fallback: the AI falls back to rules, the data layer falls back to local state. A public service should stay usable when a downstream system is down — which, on the current portals, it frequently is.",
  },
  {
    heading: "Built for the actual device",
    body: "Mobile-first layouts, no blocking third-party scripts, and the whole interface in Hindi as well as English, because the citizens who lose most to this problem are not on a desktop with fast broadband.",
  },
];
