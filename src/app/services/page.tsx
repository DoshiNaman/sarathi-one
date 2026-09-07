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
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check and garage pages — the route chunk keeps `ogl` off every other
// page.
import WavesBg from "@/components/waves-bg";

/**
 * One tile per roadmap service. The Gujarat number sits on the card on purpose:
 * a reviewer should be able to see why each of these is worth building without
 * opening it.
 */
export default function ServicesPage() {
  const t = useT();
  const locale = useApp((s) => s.locale);

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the list. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <PageShell title={t("servicesTitle")} description={t("servicesDesc")} width="wide">
        <p className="liquid-glass text-muted-foreground mb-8 rounded-lg p-4 text-sm leading-relaxed [--glass-edge:var(--warning)] [--glass-rim:dashed]">
          {t("servicesPreview")}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Card key={s.slug} data-glow className="liquid-glass flex flex-col ring-0">
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
    </>
  );
}
