"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  Users,
  ReceiptText,
  FileClock,
  Menu,
  X,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Dashboard must match exactly, or every /admin/* route lights it up too. */
  exact?: boolean;
};

const NAV: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    heading: "Collections",
    items: [
      { href: "/admin/vehicles", label: "Vehicles", icon: Car },
      { href: "/admin/owners", label: "Owners", icon: Users },
      { href: "/admin/challans", label: "Challans", icon: ReceiptText },
      { href: "/admin/applications", label: "Applications", icon: FileClock },
    ],
  },
];

/**
 * Admin workspace shell, in the shape of a CMS: a persistent left rail for
 * navigation, identity and sign-out, and the whole remaining width for the
 * collection you are editing.
 *
 * The citizen header is hidden on these routes (see SiteChrome) — the sidebar is
 * the only navigation, so a second bar above it just ate vertical space and gave
 * two competing ways to move around.
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
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;

  const rail = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-4 py-4">
        <LogoMark className="size-6" />
        <span className="font-display text-[17px] leading-none">
          Sarathi<span className="text-muted-foreground"> Admin</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2" aria-label="Admin sections">
        {NAV.map((group) => (
          <div key={group.heading}>
            <p className="text-muted-foreground px-2.5 pb-1.5 text-[10px] font-medium tracking-[0.16em] uppercase">
              {group.heading}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpenedAt(null)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-pop/10 text-pop font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon aria-hidden className="size-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Identity and sign-out pinned to the bottom of the rail. */}
      <div className="space-y-2 border-t p-3">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-1.5 text-xs transition-colors"
        >
          View the citizen site <ArrowUpRight aria-hidden className="size-3" />
        </Link>
        <div className="px-1.5">
          <p className="truncate text-sm font-medium">{email}</p>
          <p className="text-muted-foreground text-xs capitalize">{role.replace("_", " ")}</p>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm" type="submit" className="w-full justify-start">
            <LogOut aria-hidden /> Sign out
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-dvh">
      {/* Persistent rail: roughly a quarter of the width, capped so it does not
          sprawl on very wide screens. */}
      <aside className="bg-card/50 hidden w-[clamp(220px,22vw,290px)] shrink-0 border-r lg:block">
        <div className="sticky top-0 h-dvh">{rail}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="bg-background/80 absolute inset-0 backdrop-blur-sm"
            onClick={() => setOpenedAt(null)}
          />
          <aside className="bg-card absolute inset-y-0 left-0 w-72 border-r shadow-xl">
            <Button
              size="icon-sm"
              variant="ghost"
              className="absolute top-3 right-3"
              onClick={() => setOpenedAt(null)}
              aria-label="Close"
            >
              <X aria-hidden />
            </Button>
            {rail}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Only on mobile, and only to reach the rail. */}
        <div className="flex items-center gap-2 border-b px-4 py-2.5 lg:hidden">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => setOpenedAt(pathname)}
            aria-label="Open menu"
          >
            <Menu aria-hidden />
          </Button>
          <LogoMark className="size-5" />
          <span className="font-display text-[15px]">Sarathi Admin</span>
        </div>

        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
