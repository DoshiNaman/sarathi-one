# Sarathi One

**Live demo: https://sarathi-one-pink.vercel.app**

**Build What Moves India** hackathon prototype — reimagining the citizen experience of India's Parivahan Sewa transport portal. **Not a government product. Not affiliated with MoRTH or NIC. All data is synthetic.**

## The problem

Buying or selling a second-hand vehicle on the official portals today means: a masked 10-field lookup capped at 3/day, a bare hypothecation yes/no with no financier name, no accident or ownership history, and a transfer journey spread across 4 disconnected portals (Form 29/30, Form 35, ePayment, slot booking) — with no citizen account anywhere on the web.

## What this demo does

One responsive web app, one mobile+OTP login:

1. **Vehicle check** — the free summary (exactly what today's portal shows) side-by-side with a consent-unlocked **Trust Report**: ownership timeline, loan panel with financier + EMI calculator, challan history, document validity, accident flag, and a plain-language AI verdict (English/Hindi).
2. **Guided ownership transfer** — one wizard with a persistent stage tracker, bundling HP termination (Form 35) when a loan is active.
3. **My Garage** — vehicles, applications with live stages, payment receipts, expiry nudges.
4. **Crash Card** — 112, cashless-treatment (golden hour) rights, Rahveer reward info.
5. **Versioning** — `/changelog` lists every release's features and its honesty ledger.

## Demo credentials & data

- Login: any 10-digit mobile, OTP **123456** (shown on screen; no SMS).
- Demo fleet: `GJ01AB1234` (active loan), `GJ05CD5678` (clean), `GJ06EF9012` (3 owners + accident), `GJ18GH3456` (blacklisted), `GJ03JK7890` (expired docs, "yours"), `GJ12MN2468` (commercial), `GJ27PQ1357`, `GJ04RS8642` (scrapped).

## What is mocked

Everything that would touch a real system: vehicle/owner/challan/accident data, OTPs, payments, e-sign, RTO slots, bank NOCs. The consent-unlock mirrors the consent framework in MoRTH's NTR Data Sharing Policy — a proposal, not an integration. The AI verdict and Sahayak run on OpenRouter when `OPENROUTER_API_KEY` is set, and on a deterministic rule engine when it is not — the UI labels which one answered. No live government system was accessed, tested, or scraped.

## Run

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # production build (includes typecheck)
bun run test       # E2E smoke over the full demo path
BASE_URL=https://sarathi-one-pink.vercel.app bun run test   # same smoke against the live deploy
```

State persists in `localStorage` (`sarathi-one` key) so every reviewer gets a clean sandbox. See `/how-it-works` for why there is deliberately no database.
