import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase session cookie so server components see a live session.
 *
 * This is an optimistic check only. Per Next's own guidance, Proxy is not an
 * authorization boundary — every admin page calls requireAdmin(), and the
 * database enforces RLS on top. Do not move the real check here.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) =>
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optimistic redirect only. Without it an unauthenticated /admin request gets a
  // streamed 200 carrying a client-side redirect, which is correct for a browser
  // but reads as an open page to anything else. requireAdmin() on every page and
  // RLS in the database remain the actual boundary — a session proves identity,
  // not authority, and this check cannot see the caller's role.
  const { pathname } = request.nextUrl;
  if (!user && pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
