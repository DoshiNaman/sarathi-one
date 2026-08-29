import { z } from "zod";
import { MODELS, DEFAULT_MODEL } from "./models";
import { LOCALE_CODES } from "./locales";

/**
 * Schemas for untrusted request bodies.
 *
 * A schema is the boundary: handlers downstream receive domain values they can
 * trust instead of re-checking shapes. Unrecognised fields fall back to safe
 * defaults, and a malformed body yields a 400 rather than throwing a 500.
 */

// Derived, not hand-listed: a hardcoded ["en","hi"] silently coerced every
// Gujarati request back to English, so the help panel answered in the wrong
// language with no error anywhere.
const localeSchema = z.enum(LOCALE_CODES).catch("en");

/** Clamped to the allowlist so a client cannot name a model we do not pay for. */
const modelSchema = z
  .string()
  .refine((id) => MODELS.some((m) => m.id === id))
  .catch(DEFAULT_MODEL);

export const krishnaSchema = z.object({
  question: z.string().trim().min(2),
  locale: localeSchema.default("en"),
  context: z.string().default(""),
  model: modelSchema.default(DEFAULT_MODEL),
});

export const verdictSchema = z.object({
  regNo: z.string().trim().min(1),
  locale: localeSchema.default("en"),
  model: modelSchema.default(DEFAULT_MODEL),
});

export type KrishnaRequest = z.infer<typeof krishnaSchema>;
export type VerdictRequest = z.infer<typeof verdictSchema>;

/** Parses a JSON body against a schema. Returns null for malformed input. */
export async function parseBody<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<z.infer<T> | null> {
  try {
    const result = schema.safeParse(await request.json());
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
