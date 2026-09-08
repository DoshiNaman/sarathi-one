export const APP_VERSION = "1.6.0";

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
    version: "1.6.0",
    date: "2026-09-08",
    title: "Every screen redesigned, and glass used where glass belongs",
    features: [
      "Nearby service centres on the Trust Report: a buyer looking at a Honda City in Delhi gets the authorised workshops for that make in that city, so the car can be inspected by someone who does not work for the seller. The numbers are masked and are not dialable — inventing a working phone number for a workshop that does not exist is the one thing on that page somebody could act on",
      "Interstate transfer gate: a car registered in one state and moving to another needs an NOC from the old RTO first, and the report now says so before you pay for anything",
      "The unlock is one dialog end to end — pay, approval, seller consent — and the charge and the unlock only land together at the end, so abandoning it halfway leaves no receipt and nothing unlocked",
      "Transfer documents now go through a mocked DigiLocker handoff instead of a file picker, which is how this would actually work",
      "A cursor-following edge glow on the service and garage cards, built on the app's own palette so it follows the theme",
      "Sixteen vehicles in the demo fleet, up from eight, each with its own 3D model — including an accident car, a car on its fourth owner, and one with every paper lapsed",
    ],
    improvements: [
      "Seven screens redesigned on the shadcn design system: how it works, garage, services and the service wizard, crash card, transfer, Trust Report and this page. The card settled on in the garage is now the same card everywhere",
      "Glass is now used on the surfaces it suits — the floating panels and the sparse showcase screens, where there is something moving behind it to refract — and not on anything you read or fill in. It had been rolled onto document pages, where it did nothing but soften the type",
      "Krishna: the panel is glass, so the page's own field carries on behind it rather than stopping at its edge; the message bubbles stay opaque, because the words are not the thing to see through",
      "Krishna's flute now stops when the panel closes — unless you started it yourself from the header, in which case it is yours and closing a chat panel does not silence it",
      "Older releases on this page start collapsed. Seven expanded at once was a wall of scroll for somebody who came to read the newest one",
      "Transfer and the Trust Report were part English in Hindi and Gujarati; about sixteen strings had never been translated",
      "3D models compressed with meshopt, which took the heaviest car from megabytes to a fraction of it",
    ],
    fixes: [
      "Nothing on the site was blurring. A hand-written -webkit- prefix made the CSS compiler emit only that alias, and this engine does not honour it — so every glass panel in the app was a flat tint",
      "Light mode was getting the dark theme's glass, because a :not() selector compiled down to one that matched everything",
      "Every separator in the app rendered at zero height: the registry shipped selectors for an attribute this version of the primitive does not emit",
      "Warning callouts failed contrast in light mode at 2.8:1 — amber text on its own amber ground, across six pages",
      "The header did not fit a 320px phone and pushed sixteen pixels of sideways scroll onto every page in the app",
      "The 112 button on the crash card was one unbreakable line, wide enough to shove a small phone sideways — the one control on that page that has to work in a panic",
      "Touch targets under 24px in the footer, the disclaimer bar, the language switch and the info buttons",
      "A negative distance to a service centre, from a signed shift on a seed past two billion",
      "End-to-end tests timed out in CI, which was recompiling every route through the dev server instead of running the build",
    ],
    mocked: [
      "Service-centre listings are generated from the vehicle's make and its RTO city. The workshops are not a real directory and the phone numbers are masked, not dialable",
      "DigiLocker is a mock handoff. Nothing is fetched from DigiLocker and no document leaves the browser",
      "Everything else unchanged from v1.5.0 — see below",
    ],
  },
  {
    version: "1.5.0",
    date: "2026-09-06",
    title: "What the car is worth, and who is asking",
    features: [
      "A price estimate on both the free record and the Trust Report, broken down by who is buying: insurance value, dealer buy-in, private sale, certified retail. The same car is worth four different amounts and a seller only ever quotes you the highest one",
      "The insurance row follows the official IDV depreciation schedule (India Motor Tariff GR.8) — which stops at five years. Past that we show no number and say why: the tariff itself leaves it to negotiation, which is exactly why an older car's owner can be quoted anything",
      "The range narrows once the seller consents, and shows its reasons — odometer against the expected distance for the age, owner count, accident history",
      "Krishna and the AI verdict now see all four rows, so advice can compare an asking price against the right counterparty instead of one flat number",
      "Krishna: the assistant formerly called Sahayak, with a new mark, a feather cursor and a flute",
      "Gujarati joins English and Hindi as a full interface language",
    ],
    improvements: [
      "Seven citizen services now converge on the landing page the way the eight portals do",
      "Admin CMS moved onto the shared layout it should have been using",
    ],
    fixes: [
      "Header controls overflowed every page on an iPad",
      "Reopening Krishna turned the flute back on",
      "A demo should not dial 112, or name a sitting minister",
    ],
    mocked: [
      "Dealer, private-sale and certified-retail price rows are our own simulated figures, spread at −15% and +18% of the private-sale number. Only the insurance row follows a published schedule. No marketplace was consulted or named",
      "Everything else unchanged from v1.2.0 — see below",
    ],
  },
  {
    version: "1.4.0",
    date: "2026-08-28",
    title: "A designed product, not a styled prototype",
    features: [
      "New landing page: the pitch told visually — a prism splits the thin official record into the five things that decide a purchase, and eight portals collapse into one on scroll",
      "A prism wordmark: one beam in, a spectrum out — the same idea as the product",
      "A real light/dark theme toggle; the app previously followed the operating system with no way to override it",
      "Editorial display typeface (Eczar) covering both Latin and Devanagari, so Hindi headlines have the same voice as English",
    ],
    improvements: [
      "One accent colour, used once per screen on the action that matters. Its hue flips between themes so both grounds stay legible",
      "Every page moved onto a shared frame; they had each invented their own width, padding and heading size, so the layout shifted as you moved between them",
      "The disclaimer is now a considered line with a link to the evidence, instead of a black warning bar that made the product look unfinished",
      "Sahayak rebuilt: step-aware subtitle, tappable prompts, typing indicator, auto-scroll, and the model picker demoted out of the conversation",
      "Control borders raised to a 3:1 contrast ratio, which the previous palette failed",
    ],
    fixes: [
      "Entrance animations hid content and relied on JavaScript to bring it back, leaving pages blank when a link was opened in a background tab",
    ],
    mocked: ["All data unchanged from v1.2.0 — see below"],
  },
  {
    version: "1.3.0",
    date: "2026-08-28",
    title: "Design system, admin sidebar, and SEO",
    features: [
      "Design system: semantic success/warning/danger/info tokens that work in light and dark",
      "Shared state vocabulary — skeletons, empty states, error states, spinners — plus route-level loading, error and not-found boundaries",
      "Sidebar-first admin with an Overview dashboard and Owners, Challans and Applications screens alongside Vehicles",
      "SVG wordmark replacing the emoji logo, and Lucide icons throughout",
      "Full SEO: per-page metadata, OpenGraph and Twitter cards, generated OG image, sitemap, robots and JSON-LD",
      "Prettier, Husky and a pre-commit hook that formats and lints staged files",
    ],
    improvements: [
      "Hindi finally renders in a real typeface: the previous font shipped no Devanagari subset, so every Hindi string had been falling back to whatever the operating system had",
      "The vehicle search now shows a skeleton while loading and tells 'no such vehicle' apart from 'could not reach the record', with a retry",
      "GSAP eases the Trust Report in, respecting prefers-reduced-motion; every other screen stays on CSS so the bundle stays small for slow connections",
    ],
    fixes: [
      "A signed-out visit to the admin area redirect-looped between the guard and the login page",
      "Admin pages streamed data to anonymous callers: a layout-only guard does not stop a page rendering, so the vehicle table was reachable without signing in",
    ],
    mocked: ["All data unchanged from v1.2.0 — see below"],
  },
  {
    version: "1.2.0",
    date: "2026-08-28",
    title: "Database, real admin auth, and a data admin panel",
    features: [
      "Postgres (Supabase) backs the vehicle record: vehicles, owners and challans. Applications and payments still live in the browser — see How it works",
      "Row-level security: the vehicle record is publicly readable, but only an admin role can write it",
      "Admin panel at /admin — sign in, then create, edit and delete demo vehicles",
      "Role model with super_admin / admin / viewer; signing in alone grants nothing",
      "AI model picker: three free models plus paid gpt-oss-20b, defaulting to free",
    ],
    improvements: [
      "The app falls back to the built-in synthetic fleet whenever the database is unset, asleep or unreachable, so the citizen demo cannot go down with it",
      "The admin panel states which source it is reading, mock or database",
      "AI runs on OpenRouter with a server-side model allowlist, so a caller cannot name an expensive model and spend account credit",
    ],
    fixes: [
      "Raised the AI token ceiling: several free models are reasoning models that returned empty answers when they ran out of tokens mid-thought",
    ],
    mocked: [
      "Every row in the database is synthetic. No real registration numbers, owners or phone numbers",
      "Citizen login is still a demo OTP — real phone auth would mean handling real personal data",
      "Admin accounts are real Supabase Auth accounts, created by us, not by citizens",
      "All other mocks unchanged from v1.0.0 — see below",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-08-28",
    title: "AI help, full Hindi, and an honesty page",
    features: [
      "Sahayak: a helper that knows which step you are on and answers paperwork questions in Hindi or English",
      "AI-written Trust Report verdict via an OpenAI model, with a deterministic rule engine as fallback",
      "Knowledge base of 8 bilingual answers (Forms 29/30/35, NOC, challans, PUC, fitness, accident rights) drawn from primary-source research",
      "'How it works' page: who has the problem, what we changed, what is real vs simulated, and how it could scale safely",
      "Keyboard skip-link to main content",
    ],
    improvements: [
      "Hindi now covers the whole demo path, not just the headings (dictionary grew from 26 to 70 keys)",
      "Every AI answer is labelled with which brain produced it, so nothing overstates what is running",
      "End-to-end test uses stable selectors, so improving the wording no longer breaks CI",
    ],
    fixes: [],
    mocked: [
      "Sahayak and the verdict use the offline rule engine unless OPENAI_API_KEY is set; the screen says which one answered",
      "All other mocks unchanged from v1.0.0 — see below",
    ],
  },
  {
    version: "1.0.1",
    date: "2026-08-28",
    title: "Post-review hardening",
    features: [],
    improvements: [
      "One shared login gate across garage, report and transfer instead of three copies",
      "Single source for the demo date and currency formatting, so no two screens can disagree",
      "Applications can now be advanced to COMPLETE (Simulate RTO approval in My Garage)",
      "Removed 11 unused dependencies and 5 unused components the code never imported",
      "CI now runs the end-to-end smoke test, not just lint and build",
    ],
    fixes: [
      "Design tokens were missing, so every button and card rendered unstyled — the whole UI was flat text",
      "Reloading while logged in caused a React hydration error and a flash of the logged-out screen",
      "Application numbers were 5 digits while the status page asked for 6, so valid lookups failed",
      "Paying then abandoning the consent step charged you with nothing unlocked, and charged again on retry",
      "Submitted transfers were stuck on 'IN PROGRESS' forever and could never complete",
      "A negative loan tenure produced a nonsense EMI presented as real financial guidance",
      "The page language attribute stayed 'en' in Hindi mode, mis-cueing screen readers",
      "Footer floated mid-screen on short pages",
    ],
    mocked: ["Unchanged from v1.0.0 — see below"],
  },
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
