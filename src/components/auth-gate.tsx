"use client";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { EmptyState, Spinner } from "@/components/states";
import { useT } from "@/lib/i18n";
import { DEMO_OTP } from "@/lib/data";

/**
 * Renders children only for a logged-in citizen. Waits for the persisted store
 * to rehydrate first, so a logged-in reload never flashes the logged-out state.
 *
 * The locked state used to be a bare sentence and a button floating on an empty
 * page. It now uses the same empty-state vocabulary as every other screen, and
 * says the demo OTP out loud — a reviewer who hits this wall has no way to guess
 * it, and bouncing them to a login form that also has to explain itself is a
 * step nobody needs.
 */
export function AuthGate({ message, children }: { message: string; children: React.ReactNode }) {
  const t = useT();
  const hydrated = useApp((s) => s.hydrated);
  const mobile = useApp((s) => s.mobile);

  if (!hydrated)
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 py-24 text-sm">
        <Spinner label={t("loading")} /> {t("loading")}…
      </div>
    );

  if (!mobile)
    return (
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="bg-card rounded-2xl border p-2">
          <EmptyState
            icon={<Lock aria-hidden />}
            title={message}
            description={`${t("mobileNumber")} · ${t("demoOtpIs")} ${DEMO_OTP}`}
            action={
              <Button variant="pop" data-glow nativeButton={false} render={<Link href="/login" />}>
                {t("login")}
              </Button>
            }
          />
        </div>
      </div>
    );

  return <>{children}</>;
}
