"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Krishna } from "@/components/krishna";
import { FeatherCursor } from "@/components/feather-cursor";
import { useT } from "@/lib/i18n";

/**
 * Citizen chrome — header, help bubble, footer — hidden on /admin.
 *
 * The admin panel is a workspace: its sidebar is the whole navigation, so a
 * second header above it wasted vertical space and gave two competing ways to
 * move around. Staff also have no use for the citizen-facing help bubble.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const t = useT();
  const isAdmin = usePathname().startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <FeatherCursor />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Krishna />
      <footer className="text-muted-foreground mt-12 border-t py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 text-center text-xs">
          <span>{t("footerNote")}</span>
          <Link
            href="/services"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            {t("openServices")}
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            {t("footerWhatIsReal")}
          </Link>
          <Link
            href="/changelog"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            {t("footerVersions")}
          </Link>
          {/* Staff entry point. The citizen journey never needs it, but without a
              link here the only way in is knowing the URL. */}
          <Link
            href="/admin/login"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            {t("staffSignIn")}
          </Link>
        </div>
      </footer>
    </>
  );
}
