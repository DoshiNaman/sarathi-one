"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { APP_VERSION } from "@/lib/version";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useT();
  const { mobile, locale, setLocale, logout } = useApp();
  const pathname = usePathname();

  const nav = [
    { href: "/check", label: t("checkVehicle") },
    { href: "/garage", label: t("myGarage") },
    { href: "/status", label: t("status") },
    { href: "/how-it-works", label: t("howItWorks") },
    { href: "/changelog", label: t("changelog") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2">
        <div className="flex items-baseline gap-2 font-bold">
          <Link href="/" className="text-lg">🛣️ {t("appName")}</Link>
          <Link href="/changelog" className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            v{APP_VERSION}
          </Link>
        </div>
        <nav className="ml-4 hidden items-center gap-1 sm:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded px-2 py-1 text-sm ${pathname.startsWith(n.href) ? "bg-muted font-medium" : "text-muted-foreground hover:text-foreground"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setLocale(locale === "en" ? "hi" : "en")}>
            {locale === "en" ? "हिं" : "EN"}
          </Button>
          {mobile ? (
            <Button variant="outline" size="sm" onClick={logout}>
              {t("logout")} ({mobile.slice(-4)})
            </Button>
          ) : (
            <Button size="sm" nativeButton={false} render={<Link href="/login" />}>
              {t("login")}
            </Button>
          )}
        </div>
      </div>
      <div className="bg-amber-100 px-4 py-1 text-center text-[11px] text-amber-900 dark:bg-amber-950 dark:text-amber-200">
        {t("disclaimer")}
      </div>
      <nav className="flex justify-around border-t py-1 sm:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={`px-2 py-1 text-xs ${pathname.startsWith(n.href) ? "font-semibold" : "text-muted-foreground"}`}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
