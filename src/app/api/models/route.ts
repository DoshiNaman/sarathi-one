import { MODELS, DEFAULT_MODEL } from "@/lib/models";
import { aiConfigured } from "@/lib/ai";

/** Lets the client render the model picker without hardcoding the list twice. */
export function GET() {
  return Response.json({ models: MODELS, default: DEFAULT_MODEL, aiConfigured: aiConfigured() });
}
