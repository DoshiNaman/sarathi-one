import type { Metadata } from "next";
import { requireAdmin } from "@/lib/db/auth";
import { AdminShell } from "@/components/admin-shell";
import { signOut } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Gate the whole section once. Each page and mutation still re-checks, and RLS
  // enforces it again in the database.
  const admin = await requireAdmin();
  return (
    <AdminShell email={admin.email} role={admin.role} signOut={signOut}>
      {children}
    </AdminShell>
  );
}
