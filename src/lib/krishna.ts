/**
 * Krishna's steering: how a reply can move the citizen to another screen.
 *
 * The model answers in prose and may append one marker line:
 *
 *   [[goto:/check|prefill:GJ01AB1234]]
 *
 * The server strips that line before the text reaches the panel and hands back
 * a validated action instead. Two rules make this safe enough to ship:
 *
 *  1. The route is checked against the list below. A hallucinated path is
 *     dropped, not followed, so the model cannot invent a destination.
 *  2. An action only ever navigates and fills a field. Nothing here submits a
 *     form, pays a fee or files an application — the citizen still presses the
 *     button. A wrong turn costs a click, never money.
 */

/** Routes Krishna may send someone to. Everything else is ignored. */
const STATIC_ROUTES = [
  "/",
  "/check",
  "/garage",
  "/status",
  "/services",
  "/how-it-works",
  "/changelog",
  "/login",
];

/** Routes with one trailing segment: a registration number or a service slug. */
const DYNAMIC_PREFIXES = ["/report/", "/transfer/", "/crash/", "/services/"];

export type KrishnaAction = { goto?: string; prefill?: string };

/** What a model reply splits into: the sentence, and what to do about it. */
export type ParsedReply = { answer: string; action: KrishnaAction | null };

export function isAllowedRoute(path: string) {
  if (!path.startsWith("/") || path.includes("..") || path.includes("//")) return false;
  if (STATIC_ROUTES.includes(path)) return true;
  return DYNAMIC_PREFIXES.some((p) => path.startsWith(p) && path.slice(p.length).length > 0);
}

const MARKER = /\[\[([^\]]*)\]\]\s*$/;

/**
 * Splits a model reply into the sentence a citizen reads and the action the app
 * performs. A reply with no marker, or with a route we do not allow, comes back
 * as plain text and no action.
 */
export function parseAction(reply: string): ParsedReply {
  const found = reply.match(MARKER);
  if (!found) return { answer: reply.trim(), action: null };

  const answer = reply.replace(MARKER, "").trim();
  const action: KrishnaAction = {};

  for (const part of found[1].split("|")) {
    const [key, ...rest] = part.split(":");
    const value = rest.join(":").trim();
    if (!value) continue;
    if (key.trim() === "goto" && isAllowedRoute(value)) action.goto = value;
    if (key.trim() === "prefill") action.prefill = value.toUpperCase().replace(/\s+/g, "");
  }

  // A prefill with nowhere to go would fill a field the citizen cannot see.
  if (!action.goto) return { answer, action: null };
  return { answer, action };
}

/** The instruction block that teaches the model the marker. */
export const STEERING_PROMPT = [
  "You may steer the app. When the answer would be clearer on another screen, end your reply with a marker line and nothing after it:",
  "[[goto:/check|prefill:GJ01AB1234]]",
  "goto must be one of: / /check /garage /status /services /how-it-works /changelog /login, or /report/<REGNO> /transfer/<REGNO> /crash/<REGNO> /services/<slug>.",
  "Service slugs: fitness-ats permit learner-licence dl-renewal fancy-number scrapping grievance.",
  "prefill is optional and only carries a registration number for /check.",
  "Omit the marker entirely when the citizen is already where they need to be. Never mention the marker in your prose.",
].join("\n");
