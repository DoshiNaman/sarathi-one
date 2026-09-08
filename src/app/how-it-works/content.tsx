"use client";
import Link from "next/link";
import { ArrowRight, Check, CircleAlert, Info } from "lucide-react";
import { WHO, TODAY, CHANGED, REAL, MOCKED, SCALE, NEXT } from "@/lib/story";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { PageShell } from "@/components/page-shell";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check page — the route chunk keeps `ogl` off every other page.
import WavesBg from "@/components/waves-bg";

/** One heading and its content, with the rule that separates it from the last. */
function Section({
  title,
  first = false,
  children,
}: {
  title: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      {!first && <Separator className="my-2" />}
      <h2 className="font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

/**
 * The essay half of /how-it-works, split out because the page above it exports
 * `metadata` and so must stay a server component, while every sentence here is
 * picked by locale at render time.
 *
 * Solid surfaces, not the frosted glass the product screens use. This is a page
 * you read end to end, like the report and the changelog, and a wall of
 * translucent panels over a pale ground turned into washed-out boxes. The wave
 * field stays behind it as atmosphere.
 *
 * Every "heading plus body" block on the page is an Item, so the four sections
 * that used to be a card, a left rail, bare text and a dashed rail now read as
 * one page. The variant carries the meaning instead: outlined for a problem
 * that stands today, muted with a tick for something already built, outlined
 * with a badge for what is only planned.
 */
export function HowItWorks() {
  const t = useT();
  const locale = useApp((s) => s.locale);

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the essay. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <PageShell title={t("howTitle")} description={t("howDesc")}>
        <div className="flex flex-col gap-8">
          <Section title={t("whoHasProblem")} first>
            <p className="leading-relaxed">{WHO[locale]}</p>
          </Section>

          <Section title={t("whatIsHardToday")}>
            <ItemGroup className="gap-3">
              {TODAY.map((item) => (
                <Item key={item.problem.en} variant="outline" className="items-start">
                  <ItemMedia variant="icon">
                    <CircleAlert className="text-muted-foreground" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.problem[locale]}</ItemTitle>
                    <ItemDescription className="line-clamp-none leading-relaxed">
                      {item.detail[locale]}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
            <p className="text-muted-foreground text-xs leading-relaxed">{t("sourcesNote")}</p>
          </Section>

          <Section title={t("whatWeChanged")}>
            <ItemGroup className="gap-3">
              {CHANGED.map((c) => (
                <Item key={c.change.en} variant="muted" className="items-start">
                  <ItemMedia variant="icon">
                    <Check className="text-success" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{c.change[locale]}</ItemTitle>
                    <ItemDescription className="line-clamp-none leading-relaxed">
                      {c.why[locale]}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </Section>

          <Section title={t("whatIsReal")}>
            {/* items-start so the shorter column stops stretching to match the
                longer one and leaving a block of empty card. */}
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {t("worksToday")}
                    <Badge variant="success">{REAL.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-4 text-sm leading-relaxed">
                    {REAL.map((r) => (
                      <li key={r.en}>{r[locale]}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {t("simulatedLabel")}
                    <Badge variant="warning">{MOCKED.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-4 text-sm leading-relaxed">
                    {MOCKED.map((m) => (
                      <li key={m.en}>{m[locale]}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title={t("atScale")}>
            <ItemGroup className="gap-3">
              {SCALE.map((sc) => (
                <Item key={sc.heading.en} className="items-start px-0">
                  <ItemContent>
                    <ItemTitle>{sc.heading[locale]}</ItemTitle>
                    <ItemDescription className="line-clamp-none leading-relaxed">
                      {sc.body[locale]}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </Section>

          <Section title={t("whatIsNext")}>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("nextScope")}{" "}
              <Link href="/services" className="underline underline-offset-4">
                {t("openServices")}
              </Link>
            </p>
            <ItemGroup className="gap-3">
              {NEXT.map((n) => (
                <Item key={n.heading.en} variant="outline" className="items-start">
                  <ItemContent>
                    <ItemTitle className="gap-2">
                      {n.heading[locale]}
                      <Badge variant="outline">{t("plannedLabel")}</Badge>
                    </ItemTitle>
                    <ItemDescription className="line-clamp-none leading-relaxed">
                      {n.body[locale]}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </Section>

          <Alert>
            <Info />
            <AlertTitle>{t("notGovProduct")}</AlertTitle>
            <AlertDescription>
              {t("notGovBody")} <span className="font-mono">parivahan.gov.in</span>.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button variant="ghost" nativeButton={false} render={<Link href="/changelog" />}>
              {t("seeVersionHistory")}
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </PageShell>
    </>
  );
}
