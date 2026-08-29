/**
 * The interface languages, in one place both halves of the app can read.
 *
 * Deliberately NOT in i18n.ts: that module is "use client", so importing it
 * from a route handler would pull a client-module reference into the server
 * bundle. The API's request schema has to validate the same set of codes the UI
 * can switch to, and the only way to keep those honest is a shared source.
 */
export const LOCALES = [
  { code: "en", label: "English", short: "EN", ai: "simple English" },
  { code: "hi", label: "हिन्दी", short: "हिं", ai: "simple Hindi (Devanagari)" },
  { code: "gu", label: "ગુજરાતી", short: "ગુ", ai: "simple Gujarati (Gujarati script)" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

// z.enum needs a non-empty tuple in the type, and `.map()` erases arity. Taking
// the head separately keeps the non-emptiness provable, so no assertion is
// needed at all.
export const LOCALE_CODES: [Locale, ...Locale[]] = [
  LOCALES[0].code,
  ...LOCALES.slice(1).map((l) => l.code),
];

/** How to name this language to a model. Keyed so a new locale cannot be missed. */
export function aiLanguage(locale: Locale) {
  return LOCALES.find((l) => l.code === locale)!.ai;
}
