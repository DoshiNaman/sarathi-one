/**
 * Server-side allowlist of models the app may call.
 *
 * The client sends a model id, so this list is a security boundary, not a
 * convenience: without it a caller could name any model on OpenRouter and spend
 * the account's credit. Anything not on this list falls back to DEFAULT_MODEL.
 */
export type ModelOption = {
  id: string;
  label: string;
  /** Free models cost nothing per token; paid ones draw down account credit. */
  free: boolean;
};

export const MODELS: ModelOption[] = [
  { id: "dots-studio/dots-3-note-preview:free", label: "Dots 3 Note — free, default", free: true },
  {
    id: "inclusionai/ling-3.0-flash-fin:free",
    label: "Ling 3.0 Flash — free, fastest",
    free: true,
  },
  // Measured 4+ minutes with no response on 2026-08-28; kept for completeness but
  // it will hit the client timeout and fall back to the rule engine.
  {
    id: "nvidia/nemotron-3.5-lightning:free",
    label: "Nemotron 3.5 — free, often unavailable",
    free: true,
  },
  { id: "openai/gpt-oss-20b", label: "gpt-oss-20b — paid, uses credit", free: false },
];

/** Free by default so a long demo or a judging session cannot drain credit. */
export const DEFAULT_MODEL = "dots-studio/dots-3-note-preview:free";

export function resolveModel(requested: string): string {
  return MODELS.some((m) => m.id === requested) ? requested : DEFAULT_MODEL;
}
