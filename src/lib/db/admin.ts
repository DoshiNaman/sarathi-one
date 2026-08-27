import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. BYPASSES row-level security — never import this into a
 * client component, and never expose the key to the browser. Used only for
 * server-side writes of citizen journey records, where there is no signed-in
 * user to attribute the write to.
 */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!key || !url) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
