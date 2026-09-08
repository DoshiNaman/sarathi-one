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
import { FileText, Search } from "lucide-react";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check page — the route chunk keeps `ogl` off every other page.
import WavesBg from "@/components/waves-bg";

export default function StatusPage() {
  const t = useT();
  const applications = useApp((s) => s.applications);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Application | null | "none">(null);

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the result. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <PageShell title={t("status")} description={t("statusDesc")} width="narrow" align="center">
        <div className="space-y-6">
          {/* The check page's search bar, reused 1:1 — one pill with the badge,
              the field, and the action. */}
          <form
            className="group relative mx-auto w-full max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              setResult(applications.find((a) => a.id === query.trim()) ?? "none");
            }}
          >
            <div className="border-border/60 bg-card/65 focus-within:border-pop/50 relative flex items-center gap-2.5 rounded-2xl border p-2 shadow-sm backdrop-blur-xl transition-colors">
              <span
                aria-hidden
                className="bg-pop/15 text-pop border-pop/30 ml-1 grid size-7 shrink-0 place-items-center rounded-md border backdrop-blur-md"
              >
                <FileText className="size-4" />
              </span>
              <Input
                placeholder="GJ2026-000001"
                aria-label={t("trackBtn")}
                value={query}
                className="h-9 flex-1 border-0 bg-transparent px-0 font-mono text-base tracking-wider uppercase shadow-none focus-visible:ring-0 sm:text-lg dark:bg-transparent"
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
              />
              <Button
                type="submit"
                variant="pop"
                className="bg-pop/85 border-pop/50 hover:bg-pop h-10 shrink-0 rounded-md border px-4 backdrop-blur-md"
              >
                <Search aria-hidden />
                {t("trackBtn")}
              </Button>
            </div>
          </form>

          {result === "none" && (
            <Card className="border-border/60 bg-card/65 shadow-sm backdrop-blur-xl">
              <CardContent className="text-muted-foreground py-6 text-center text-sm">
                {t("noApplicationFound")}
              </CardContent>
            </Card>
          )}

          {result && result !== "none" && (
            <Card className="border-border/60 bg-card/65 shadow-sm backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="font-mono text-base">{result.id}</CardTitle>
                <CardDescription>
                  {result.type.replaceAll("_", " ")} · {result.regNo} · {t("filedOn")}{" "}
                  {new Date(result.createdAt).toLocaleDateString("en-IN")}
                  {result.slot ? ` · ${t("rtoVisit")} ${result.slot.date} ${result.slot.time}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StageTracker stages={result.stages} current={result.currentStage} />
              </CardContent>
            </Card>
          )}
        </div>
      </PageShell>
    </>
  );
}
