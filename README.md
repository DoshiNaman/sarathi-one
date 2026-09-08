# Sarathi One

**Live demo: https://sarathi-one-pink.vercel.app**

**Build What Moves India** hackathon prototype — reimagining the citizen experience of India's Parivahan Sewa transport portal. **Not a government product. Not affiliated with MoRTH or NIC. All data is synthetic.**

## How this was built

This project was **vibe coded**. Every line of it was written by AI coding
agents — Cursor, often on the same branch — steered by
one person describing what they wanted and reviewing the result in the browser.
The primary-source research in `research/` came first and the code followed it.

Saying so plainly is the same instinct as the honesty ledger on `/changelog`: it
is more useful to know how a thing was made than to have it implied.

What that means in practice, and it is worth knowing before reading the diff:

- **Comments explain decisions, not syntax.** Where something looks odd there is
  usually a paragraph saying which bug it is there to prevent. `memory/03-gotchas.md`
  in the parent folder is the longer version.
- **Several agents touched the same files.** Duplicated helpers and two comments
  disagreeing about the same line have both happened. Trust the code over a
  comment when they conflict.
- **Every check runs before a commit** — typecheck, format, lint, an
  over-engineering lint, build and end-to-end tests — because a fast writer needs
  a strict reader.

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
- Demo fleet: 16 vehicles, each with a reason to exist. The ones worth typing in:

| Plate | Vehicle | Why it is there |
|---|---|---|
| `GJ01AB1234` | Honda City ZX | The main path — active loan, so the transfer bundles Form 35 |
| `KA05EF9012` | Maruti Suzuki Swift VXI | Three owners **and** an accident on record |
| `GJ18GH3456` | Tata Safari XZ+ | Blacklisted |
| `GJ04RS8642` | Hyundai Santro Xing | Scrapped |
| `TN09CT4188` | Honda City ZX | On its fourth owner |
| `WB06IN2270` | Hyundai i20 N Line | Accident history |
| `UP32WR9034` | Maruti Suzuki WagonR LXI | Every document lapsed |
| `RJ14MN2468` | Mahindra Bolero Pik-Up | A goods carrier, not a car |
| `DL8CAF2358` | Tata Safari DICOR | Registered in Delhi — trips the interstate NOC gate |

  The rest: `MH12CD5678`, `GJ03JK7890`, `DL03PQ1357`, `MH14CV2019`,
  `GJ05JZ4471`, `KA03AC7788`, `GJ01ER5566`.

## What is mocked

Everything that would touch a real system: vehicle/owner/challan/accident data, OTPs, payments, e-sign, RTO slots, bank NOCs. The consent-unlock mirrors the consent framework in MoRTH's NTR Data Sharing Policy — a proposal, not an integration. The AI verdict and Krishna run on OpenRouter when `OPENROUTER_API_KEY` is set, and on a deterministic rule engine when it is not — the UI labels which one answered. No live government system was accessed, tested, or scraped.

The Krishna illustrations in `public/krishna/` and the flute loop in
`public/krishna/flute.mp3` are royalty-free assets; the originals sit in
`ref assets/` outside the app. The flute is trimmed to 45 seconds, re-encoded to
356KB, off by default, and fetched only when a visitor presses play.

## Run

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # production build (includes typecheck)
bun run test       # E2E smoke over the full demo path
BASE_URL=https://sarathi-one-pink.vercel.app bun run test   # same smoke against the live deploy
```

Vehicles, owners and challans live in Postgres (Supabase), publicly readable and
writable only by an admin role; `supabase/seed.sql` is generated from the fleet by
`bun tools/gen-seed.ts` and should never be edited by hand. If the database is
unset or unreachable the app falls back to the built-in synthetic fleet, so the
citizen demo cannot go down with it.

Applications and payments are still browser-local (`localStorage`, key
`sarathi-one`), which also means every reviewer gets a clean sandbox. See
`/how-it-works` for what is real and what is not.
