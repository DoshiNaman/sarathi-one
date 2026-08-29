"use client";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageShell } from "@/components/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";

/**
 * One tile per roadmap service. The Gujarat number sits on the card on purpose:
 * a reviewer should be able to see why each of these is worth building without
 * opening it.
 */
export default function ServicesPage() {
  const t = useT();
  const locale = useApp((s) => s.locale);

  return (
    <PageShell title={t("servicesTitle")} description={t("servicesDesc")} width="wide">
      <p className="text-muted-foreground border-warning/40 mb-8 rounded-lg border border-dashed p-4 text-sm leading-relaxed">
        {t("servicesPreview")}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => (
          <Card key={s.slug} data-glow className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-base">{s.title[locale]}</CardTitle>
                {s.browsable && (
                  <Badge variant="outline" className="shrink-0 gap-1">
                    <Eye aria-hidden className="size-3" /> {t("noLoginToBrowse")}
                  </Badge>
                )}
              </div>
              <CardDescription className="leading-relaxed">{s.blurb[locale]}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              <p className="text-muted-foreground border-l-2 pl-3 text-xs leading-relaxed">
                {s.fact[locale]}
              </p>
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={`/services/${s.slug}`} />}
              >
                {t("startService")} <ArrowRight aria-hidden />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
