"use client";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import type { Application } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StageTracker } from "@/components/stage-tracker";
import { PageShell } from "@/components/page-shell";

export default function StatusPage() {
  const t = useT();
  const applications = useApp((s) => s.applications);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Application | null | "none">(null);

  return (
    <PageShell
      title={t("status")}
      description="No date of birth, no captcha — just the application number. Today's portal asks for all three, on a different page per service."
      width="narrow"
    >
      <div className="space-y-6">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setResult(applications.find((a) => a.id === query.trim()) ?? "none");
          }}
        >
          <Input
            placeholder="GJ2026-000001"
            className="font-mono"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
          />
          <Button type="submit" variant="pop">
            Track
          </Button>
        </form>

        {result === "none" && (
          <Card>
            <CardContent className="text-muted-foreground py-6 text-center text-sm">
              No application found. Complete a transfer to generate one, or check My Garage for your
              application numbers.
            </CardContent>
          </Card>
        )}

        {result && result !== "none" && (
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-base">{result.id}</CardTitle>
              <CardDescription>
                {result.type.replaceAll("_", " ")} · {result.regNo} · filed{" "}
                {new Date(result.createdAt).toLocaleDateString("en-IN")}
                {result.slot ? ` · RTO visit ${result.slot.date} ${result.slot.time}` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StageTracker stages={result.stages} current={result.currentStage} />
            </CardContent>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
