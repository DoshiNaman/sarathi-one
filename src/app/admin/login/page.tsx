"use client";
import type { FormResult } from "@/lib/forms";
import { useActionState } from "react";
import { signIn } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<FormResult, FormData>(signIn, null);

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Staff sign-in</CardTitle>
          <CardDescription>
            Admin panel for managing the demo dataset. Citizens never see this — reviewers should
            use the main app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {state?.error && <p className="text-destructive text-sm">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <div className="bg-muted/60 mt-5 rounded-lg border p-3">
            <p className="mb-1.5 text-xs font-medium">Demo credentials</p>
            <dl className="space-y-0.5 font-mono text-xs">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Email</dt>
                <dd>admin@gmail.com</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Password</dt>
                <dd>admin</dd>
              </div>
            </dl>
            <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
              Reviewer access to the demo dataset. Every row is synthetic, and the citizen site
              falls back to its built-in fleet if this data is ever emptied.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
