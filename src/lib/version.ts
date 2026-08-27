export const APP_VERSION = "1.0.0";

export type Release = {
  version: string;
  date: string;
  title: string;
  features: string[];
  improvements: string[];
  fixes: string[];
  mocked: string[]; // honesty ledger per release
};

export const CHANGELOG: Release[] = [
  {
    version: "1.0.0",
    date: "2026-08-28",
    title: "Hackathon v1 — the used-vehicle citizen journey",
    features: [
      "One citizen account: single mobile + OTP login shared across every service (demo OTP)",
      "Vehicle check: free summary card mirroring today's official masked lookup (~10 fields)",
      "Trust Report: consent-unlocked full report — ownership timeline, loan/hypothecation panel with financier, challan history, insurance/PUC/tax/fitness validity, accident flag, fair-price band",
      "EMI affordability calculator inside the loan panel",
      "AI verdict: plain-language buy/don't-buy explanation of the report (English/Hindi)",
      "Guided transfer of ownership: one wizard for Form 29/30 + HP termination (Form 35) + fee + e-sign + RTO slot, with a persistent stage tracker",
      "My Garage: my vehicles, applications with live stages, payment history with receipts, expiry nudges (insurance/PUC/tax/fitness)",
      "Crash Card: virtual doc view, 112 one-tap, nearest cashless-scheme hospital, Good Samaritan (Rahveer) rights",
      "Application status lookup by application number",
      "English/Hindi language toggle",
      "In-app changelog and versioning (this page)",
    ],
    improvements: [
      "Replaces 8 disconnected portals, 4 staff-only logins, per-portal state gates, and captcha-on-every-lookup with one responsive web app",
    ],
    fixes: [],
    mocked: [
      "All vehicle, owner, challan, and accident data is synthetic (8-vehicle demo fleet)",
      "OTP is a fixed demo code; no SMS is sent",
      "Payments simulate a gateway; no money moves",
      "Seller-consent unlock mirrors the MoRTH Data Sharing Policy consent model — proposed, not a live integration",
      "AI verdict is rule-generated in the demo; OpenAI-powered when an API key is configured",
    ],
  },
];
