export const APP_VERSION = "1.4.0";

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
