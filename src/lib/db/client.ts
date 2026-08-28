import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase is OPTIONAL by design. Without env vars the app runs entirely on the
 * synthetic fleet in lib/data.ts, so a paused free-tier project or a missing key
 * can never take the citizen demo down. See /how-it-works.
 */
/**
 * Supabase renamed its browser key: `sb_publishable_...` replaces the legacy
 * anon JWT. Accept either so the app works on both old and new projects.
 */
export const publicKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && publicKey());

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = () => publicKey()!;

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
