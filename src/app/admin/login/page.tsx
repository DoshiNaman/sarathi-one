"use client";
import type { FormResult } from "@/lib/forms";
import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Wand2 } from "lucide-react";
import { signIn } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

const DEMO = { email: "admin@gmail.com", password: "admin" };

/**
 * Staff sign-in.
 *
 * This used to be a bare card floating in an empty page: no logo, no way back
 * to the citizen site, and credentials a reviewer had to retype by hand. It now
 * matches the landing page it sits behind — same grid-and-glow ground, same
 * spectrum edge — and it says out loud what the panel is for, because a judge
 * landing here from the footer has no other context.
 */
export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<FormResult, FormData>(signIn, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div data-ground className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
      {/* The argument, on the ink ground the rest of the app uses for its
          dark sections. Hidden below lg, where it would push the form off
          the first screen. */}
      <aside className="bg-ink text-ink-foreground relative hidden flex-col justify-between p-10 lg:flex">
        <Logo className="text-ink-foreground" />

        <div className="max-w-md">
          <p className="text-ink-muted mb-3 text-[11px] font-medium tracking-[0.18em] uppercase">
            Staff workspace
          </p>
          <h1 className="font-display text-[clamp(1.9rem,3vw,2.7rem)] leading-tight text-balance">
            The record behind the Trust Report.
          </h1>
          <p className="text-ink-muted mt-5 leading-relaxed">
            Vehicles, owners, challans and applications, edited in one place. Everything a citizen
            reads on the public site is served from these rows.
          </p>
        </div>

        <div className="text-ink-muted flex items-start gap-2.5 text-xs leading-relaxed">
          <ShieldCheck aria-hidden className="mt-px size-4 shrink-0" />
          <p className="max-w-sm">
            Signing in is not authorisation on its own. Write access comes from a role the database
            checks on every query, so a signed-in account with no role can still only read.
          </p>
        </div>

        {/* the spectrum as the seam between the two halves */}
        <span
          data-spectrum-rule="vertical"
          aria-hidden
          className="absolute inset-y-0 right-0 w-px opacity-80"
        />
      </aside>

      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h2 className="font-display text-2xl">Staff sign-in</h2>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            For managing the demo dataset. Citizens never see this — to review the product, use the
            main app.
          </p>

          <form action={action} className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {state?.error && (
              <p role="alert" className="text-destructive text-sm">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              variant="pop"
              size="lg"
              data-glow
              className="w-full"
              disabled={pending}
            >
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* One tap instead of retyping. A judge opens this once, on a phone,
              and every second spent copying a password out of a paragraph is a
              second not spent looking at the product. */}
          <div className="bg-muted/50 mt-6 rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Demo credentials</p>
                <dl className="mt-2 space-y-1 font-mono text-xs">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground w-16">Email</dt>
                    <dd>{DEMO.email}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground w-16">Password</dt>
                    <dd>{DEMO.password}</dd>
                  </div>
                </dl>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => {
                  setEmail(DEMO.email);
                  setPassword(DEMO.password);
                }}
              >
                <Wand2 aria-hidden /> Fill
              </Button>
            </div>
            <p className="text-muted-foreground mt-3 text-[11px] leading-relaxed">
              Every row is synthetic, and the citizen site falls back to its built-in fleet if this
              data is ever emptied.
            </p>
          </div>

          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground group/back mt-6 inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <ArrowLeft
              aria-hidden
              className="size-3 transition-transform duration-200 group-hover/back:-translate-x-0.5"
            />
            Back to the citizen site
          </Link>
        </div>
      </main>
    </div>
  );
}
