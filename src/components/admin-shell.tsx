"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Car, Users, ReceiptText, FileClock, Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/owners", label: "Owners", icon: Users },
  { href: "/admin/challans", label: "Challans", icon: ReceiptText },
  { href: "/admin/applications", label: "Applications", icon: FileClock },
];

/**
 * Sidebar-first admin shell. There is deliberately no second header: the sidebar
 * carries identity, navigation and the sign-out action, so the content column is
 * entirely the screen you came for.
 */
export function AdminShell({
  email,
  role,
  signOut,
  children,
}: {
  email: string;
  role: string;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-0.5" aria-label="Admin sections">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
              active
                ? "bg-muted text-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon aria-hidden className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="bg-card/40 hidden w-60 shrink-0 flex-col justify-between border-r p-3 lg:flex">
        <div className="space-y-5">
          <Link href="/" className="block px-1.5 py-1">
            <Logo />
          </Link>
          {nav}
        </div>
        <div className="space-y-2 border-t pt-3">
          <div className="px-1.5">
            <p className="truncate text-sm font-medium">{email}</p>
            <p className="text-muted-foreground text-xs capitalize">{role.replace("_", " ")}</p>
          </div>
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="bg-background/80 absolute inset-0"
            onClick={() => setOpen(false)}
          />
          <aside className="bg-card absolute inset-y-0 left-0 flex w-64 flex-col justify-between border-r p-3">
            <div className="space-y-5">
              <div className="flex items-center justify-between px-1.5 py-1">
                <Logo />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X aria-hidden />
                </Button>
              </div>
              {nav}
            </div>
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
                Sign out
              </Button>
            </form>
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 border-b p-3 lg:hidden">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu aria-hidden />
          </Button>
          <Logo />
        </div>
        <main className="mx-auto max-w-5xl p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
