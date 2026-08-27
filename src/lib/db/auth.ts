import "server-only";
import { redirect } from "next/navigation";
import { serverClient, supabaseConfigured } from "./client";

export type AdminProfile = { id: string; email: string; role: "super_admin" | "admin" | "viewer" };

/**
 * Reads the caller's admin profile, or null.
 *
 * Signing in is NOT authorization: a session only proves identity. Authority
 * comes from a row in public.profiles with an admin role, which the database
 * also enforces via RLS. Both layers check — the UI check is convenience, the
 * RLS policy is the boundary.
 */
export async function getAdmin(): Promise<AdminProfile | null> {
  if (!supabaseConfigured()) return null;
  try {
    const db = await serverClient();
    const { data: auth } = await db.auth.getUser();
    if (!auth?.user) return null;
    const { data: profile } = await db
      .from("profiles")
      .select("id, email, role")
      .eq("id", auth.user.id)
      .single();
    if (!profile) return null;
    // SAFETY: the select above names exactly id, email and role, and the role
    // column is constrained by a CHECK to the three values in AdminProfile.
    return profile as AdminProfile;
  } catch {
    return null;
  }
}

/** Server-side gate for every admin page and mutation. Redirects when refused. */
export async function requireAdmin(): Promise<AdminProfile> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.role !== "admin" && admin.role !== "super_admin") redirect("/admin/login?denied=1");
  return admin;
}
