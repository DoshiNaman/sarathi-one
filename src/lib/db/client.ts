import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase is OPTIONAL by design. Without env vars the app runs entirely on the
 * synthetic fleet in lib/data.ts, so a paused free-tier project or a missing key
 * can never take the citizen demo down. See /how-it-works.
 */
export const supabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Browser client — carries the signed-in admin's session, subject to RLS. */
export function browserClient() {
  return createBrowserClient(url(), anonKey());
}

/** Server client bound to the request's cookies. Subject to RLS. */
export async function serverClient() {
  const store = await cookies();
  return createServerClient(url(), anonKey(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: middleware refreshes the session instead.
        }
      },
    },
  });
}
