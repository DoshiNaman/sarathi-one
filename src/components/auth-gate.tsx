"use client";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";

/**
 * Renders children only for a logged-in citizen. Waits for the persisted store
 * to rehydrate first, so a logged-in reload never flashes the logged-out state.
 */
export function AuthGate({ message, children }: { message: string; children: React.ReactNode }) {
  const hydrated = useApp((s) => s.hydrated);
  const mobile = useApp((s) => s.mobile);

  if (!hydrated) return <p className="py-10 text-center text-muted-foreground">Loading…</p>;
  if (!mobile)
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-muted-foreground">{message}</p>
        <Button nativeButton={false} render={<Link href="/login" />}>
          Login
        </Button>
      </div>
    );
  return <>{children}</>;
}
