"use client";
import Link from "next/link";
import { WHO, TODAY, CHANGED, REAL, MOCKED, SCALE } from "@/lib/story";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/page-shell";
import { CheckCircle2, Drama } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

/**
 * The essay half of /how-it-works, split out because the page above it exports
 * `metadata` and so must stay a server component, while every sentence here is
 * picked by locale at render time.
 */
export function HowItWorks() {
  const t = useT();
  const locale = useApp((s) => s.locale);

  return (
    <PageShell title={t("howTitle")} description={t("howDesc")}>
      <div className="space-y-10">
        <section className="space-y-2">
          <h2 className="font-display text-2xl">{t("whoHasProblem")}</h2>
          <p className="text-sm leading-relaxed">{WHO[locale]}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl">{t("whatIsHardToday")}</h2>
          {TODAY.map((item) => (
            <Card key={item.problem.en}>
              <CardHeader>
                <CardTitle className="text-base">{item.problem[locale]}</CardTitle>
                <CardDescription className="leading-relaxed">{item.detail[locale]}</CardDescription>
              </CardHeader>
            </Card>
          ))}
          <p className="text-muted-foreground text-xs">{t("sourcesNote")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl">{t("whatWeChanged")}</h2>
          {CHANGED.map((c) => (
            <div key={c.change.en} className="border-l-2 pl-4">
              <p className="font-medium">{c.change[locale]}</p>
              <p className="text-muted-foreground text-sm">{c.why[locale]}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="border-success/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle2 aria-hidden className="text-success size-4" /> {t("worksToday")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
                {REAL.map((r) => (
                  <li key={r.en}>{r[locale]}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-warning/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Drama aria-hidden className="text-warning size-4" /> {t("simulatedLabel")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
                {MOCKED.map((m) => (
                  <li key={m.en}>{m[locale]}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl">{t("atScale")}</h2>
          {SCALE.map((sc) => (
            <div key={sc.heading.en}>
              <p className="font-medium">{sc.heading[locale]}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{sc.body[locale]}</p>
            </div>
          ))}
        </section>

        <section className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
          <p className="text-foreground mb-1 font-medium">{t("notGovProduct")}</p>
          <p>
            {t("notGovBody")} <span className="font-mono">parivahan.gov.in</span>.
          </p>
        </section>

        <p className="text-center text-sm">
          <Link href="/changelog" className="underline">
            {t("seeVersionHistory")}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
