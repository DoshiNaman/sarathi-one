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
    <div className="mx-auto max-w-md pt-8">
      <Card>
        <CardHeader>
          <CardTitle>Staff sign-in</CardTitle>
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
              <Input id="password" name="password" type="password" autoComplete="current-password" required />
            </div>
            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Accounts are created in Supabase and promoted with a role row. Signing in alone grants
            nothing — see <span className="font-mono">supabase/schema.sql</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
