"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Languages, LogOut, Menu, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT, LOCALES } from "@/lib/i18n";
import { APP_VERSION } from "@/lib/version";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useT();
  const { mobile, locale, setLocale, logout } = useApp();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  // The sheet is open only while we are still on the route it was opened from,
  // so navigating closes it without an effect writing state during render.
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  // The header sits flush on the hero and only grows a border and blur once you
  // leave the top, so the landing does not open with a line across it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { href: "/check", label: t("navCheck"), full: t("checkVehicle") },
    { href: "/garage", label: t("navGarage"), full: t("myGarage") },
    { href: "/status", label: t("navStatus"), full: t("status") },
    { href: "/how-it-works", label: t("navHow"), full: t("howItWorks") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled ? "bg-background/95 backdrop-blur-xl" : "bg-transparent"
      )}
    >
      <a
        href="#main"
        className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:px-3 focus:py-1.5"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" aria-label={t("appName")} className="group flex items-center">
          <Logo animated name={t("appName")} />
          <span className="text-muted-foreground ml-2 hidden font-mono text-[10px] sm:inline">
            v{APP_VERSION}
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/nav relative rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label}
                {/* underline grows from the centre on hover, pinned when active */}
                <span
                  className={cn(
                    "bg-foreground absolute inset-x-3 -bottom-px h-px origin-center transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <div
            role="group"
            aria-label={t("languageLabel")}
            className="bg-muted/60 mr-0.5 hidden items-center gap-0.5 rounded-lg p-0.5 sm:flex"
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                aria-current={locale === l.code ? "true" : undefined}
                title={l.label}
                className={cn(
                  "rounded-[6px] px-1.5 py-1 text-[11px] leading-none font-medium transition-colors",
                  locale === l.code
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {l.short}
              </button>
            ))}
          </div>

          {/* Below sm the segmented control does not fit, so the same three
              locales cycle from one button. */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden"
            onClick={() => {
              const next =
                LOCALES[(LOCALES.findIndex((l) => l.code === locale) + 1) % LOCALES.length];
              setLocale(next.code);
            }}
            aria-label={t("languageLabel")}
          >
            <Languages aria-hidden />
            <span className="text-xs">{LOCALES.find((l) => l.code === locale)?.short}</span>
          </Button>
          <ThemeToggle />
          {mobile ? (
            <Button variant="outline" size="sm" onClick={logout} className="hidden sm:inline-flex">
              <LogOut aria-hidden />
              {mobile.slice(-4)}
            </Button>
          ) : (
            <Button size="sm" nativeButton={false} render={<Link href="/login" />}>
              {t("login")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 md:hidden",
          open ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]"
        )}
      >
        <nav className="min-h-0" aria-label="Main">
          <div className="flex flex-col p-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="hover:bg-muted rounded-lg px-3 py-2.5 text-sm"
              >
                {n.full}
              </Link>
            ))}
            {mobile && (
              <button
                onClick={logout}
                className="hover:bg-muted rounded-lg px-3 py-2.5 text-left text-sm"
              >
                {t("logout")}
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Stated plainly rather than shouted: a solid black warning bar made the
          product look unfinished, when the honesty is actually a strength. */}
      <div className="bg-muted/80 relative backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-4 py-2 text-center">
          <span
            data-eyebrow
            className="border-pop/40 text-pop bg-pop/10 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] uppercase"
          >
            {t("disclaimerTag")}
          </span>
          <span className="text-muted-foreground text-xs">{t("disclaimer")}</span>
          <Link
            href="/how-it-works"
            className="text-foreground group/what text-xs font-medium whitespace-nowrap"
          >
            <span className="underline-offset-4 group-hover/what:underline">
              {t("disclaimerLink")}
            </span>{" "}
            <span className="inline-block transition-transform duration-200 group-hover/what:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
        {/* the logo's spectrum, restated as the edge of the chrome */}
        <span
          data-spectrum-rule
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 h-px transition-opacity duration-200",
            scrolled ? "opacity-100" : "opacity-70"
          )}
        />
      </div>
    </header>
  );
}
