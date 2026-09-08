"use client";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Car,
  CheckCircle2,
  FileText,
  LifeBuoy,
  Receipt,
} from "lucide-react";
import { FLEET, MY_VEHICLES, DEMO_NOW, inr } from "@/lib/data";
import type { Vehicle } from "@/lib/types";
import { AuthGate } from "@/components/auth-gate";
import { BorderGlow } from "@/components/border-glow";
import { useApp } from "@/lib/store";
import { useT, type TKey } from "@/lib/i18n";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StageTracker } from "@/components/stage-tracker";
import { PageShell } from "@/components/page-shell";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check page — the route chunk keeps `ogl` off every other page.
import WavesBg from "@/components/waves-bg";

export default function GaragePage() {
  const t = useT();
  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the garage. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <AuthGate message={t("loginToGarage")}>
        <GarageContent />
      </AuthGate>
    </>
  );
}

type Check = { label: TKey; status: string; detail: string; due: boolean };

/**
 * What is due on one vehicle.
 *
 * These used to be collected into a single list at the top of the page, which
 * meant a warning saying "GJ01AB1234: PUC expired" sat several hundred pixels
 * above the card for GJ01AB1234, and that card said nothing. The status belongs
 * on the thing it describes.
 */
function checksFor(v: Vehicle, t: (k: TKey) => string): Check[] {
  const due = (date: string) => new Date(date) < DEMO_NOW;
  // The badge is always one word, so the column of them scans; the specifics go
  // on the line underneath.
  const dated = (label: TKey, validTill: string): Check => ({
    label,
    status: due(validTill) ? t("expiredLabel") : t("clearLabel"),
    detail: `${due(validTill) ? t("expiredOnLabel") : t("validTillLabel")} ${validTill}`,
    due: due(validTill),
  });
  const pending = v.challans.filter((c) => c.status === "PENDING");
  const owed = pending.reduce((sum, c) => sum + c.amount, 0);
  return [
    dated("insuranceLabel", v.insurance.validTill),
    dated("pucLabel", v.puc.validTill),
    ...(v.fitness ? [dated("fitnessLabel", v.fitness.validTill)] : []),
    {
      label: "challansLabel",
      status: pending.length ? t("pendingLabel") : t("clearLabel"),
      // The amount, not just a count — a count alone does not tell you whether
      // to worry.
      detail: pending.length
        ? `${pending.length} ${t("pendingChallanNote")} · ${inr(owed)}`
        : t("noPendingChallans"),
      due: pending.length > 0,
    },
  ];
}

/** A heading and its content, with the rule that separates it from the last. */
function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <Separator className="my-1" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function GarageContent() {
  const t = useT();
  const applications = useApp((s) => s.applications);
  const payments = useApp((s) => s.payments);
  const advanceApplication = useApp((s) => s.advanceApplication);

  const myVehicles = FLEET.filter((v) => MY_VEHICLES.includes(v.regNo));
  const dueCount = myVehicles.reduce((n, v) => n + checksFor(v, t).filter((c) => c.due).length, 0);

  return (
    <PageShell
      title={t("myGarage")}
      description={t("garageDesc")}
      width="wide"
      action={
        <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/services" />}>
          {t("openServices")}
          <ArrowRight data-icon="inline-end" />
        </Button>
      }
    >
      <div className="flex flex-col gap-8">
        {/* One line of summary. The detail is on each card, so repeating every
            item here would be a second telling of the same thing. */}
        {dueCount > 0 ? (
          <Alert variant="warning">
            <AlertTriangle />
            <AlertTitle>{t("nudges")}</AlertTitle>
            <AlertDescription>
              {t("needsAttentionCount").replace("{n}", String(dueCount))}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertDescription>{t("allCurrent")}</AlertDescription>
          </Alert>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl">{t("vehicles")}</h2>
          {myVehicles.length === 0 ? (
            <Empty className="border">
              <EmptyMedia variant="icon">
                <LifeBuoy />
              </EmptyMedia>
              <EmptyTitle>{t("noVehiclesYet")}</EmptyTitle>
            </Empty>
          ) : (
            // The halo throws 40px past each card, and an absolutely positioned
            // layer still counts toward scroll width. `clip` trims the overhang
            // without turning this into a scroll container.
            <div className="grid items-start gap-5 overflow-x-clip sm:grid-cols-2">
              {myVehicles.map((v) => (
                <BorderGlow key={v.regNo} className="h-full rounded-3xl [--rim-radius:1.5rem]">
                  <Card className="h-full gap-0 rounded-3xl p-6">
                    {/* Badge left, name right. The car leads and the plate
                        confirms it, the same order the check screen uses — the
                        plate is how you tell two Swifts apart, not what you
                        look for first. */}
                    <div className="flex items-center gap-4">
                      <span
                        aria-hidden
                        className="bg-muted text-foreground grid size-12 shrink-0 place-items-center rounded-2xl"
                      >
                        <Car className="size-6" strokeWidth={1.5} />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display truncate text-xl leading-tight">
                          {v.maker} {v.model}
                        </h3>
                        <p className="text-muted-foreground mt-0.5 font-mono text-sm">
                          {v.regNo} · {v.year}
                        </p>
                      </div>
                    </div>

                    {/* One row per obligation: what it is on the left, whether
                        it is met on the right, and the date or the amount
                        underneath. Read down the right edge and you have the
                        whole car. */}
                    <dl className="mt-6 flex flex-col gap-3.5">
                      {checksFor(v, t).map((c) => (
                        <div key={c.label} className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between gap-3">
                            <dt className="text-sm font-medium">{t(c.label)}</dt>
                            <dd>
                              <Badge variant={c.due ? "destructive" : "success"}>{c.status}</Badge>
                            </dd>
                          </div>
                          <p className="text-muted-foreground text-xs">{c.detail}</p>
                        </div>
                      ))}
                    </dl>

                    {/* Two destinations, so no stretched link here — the card
                        cannot be one target the way a service tile is. */}
                    <div className="mt-auto pt-6">
                      <Separator />
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          nativeButton={false}
                          render={<Link href={`/crash/${v.regNo}`} />}
                        >
                          <LifeBuoy data-icon="inline-start" />
                          {t("crashCard")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          nativeButton={false}
                          render={<Link href={`/transfer/${v.regNo}`} />}
                        >
                          {t("transfer")}
                          <ArrowRight data-icon="inline-end" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </BorderGlow>
              ))}
            </div>
          )}
        </section>

        <Section title={t("applications")}>
          {applications.length === 0 ? (
            <Empty className="border">
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>{t("noApplicationsYet")}</EmptyTitle>
              <EmptyDescription>
                <Link
                  href="/services"
                  className="inline-flex min-h-6 items-center underline underline-offset-4"
                >
                  {t("openServices")}
                </Link>
              </EmptyDescription>
            </Empty>
          ) : (
            <div className="flex flex-col gap-4">
              {applications.map((a) => {
                const done = a.currentStage >= a.stages.length;
                return (
                  <Card key={a.id}>
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="font-mono text-base">{a.id}</CardTitle>
                        <Badge variant={done ? "success" : "secondary"}>
                          {done ? t("completeLabel") : t("inProgressLabel")}
                        </Badge>
                      </div>
                      <CardDescription>
                        {a.type.replaceAll("_", " ")} · {a.regNo}
                        {a.slot ? ` · ${t("rtoVisit")} ${a.slot.date} ${a.slot.time}` : ""}
                        {a.note ? <span className="mt-1 block italic">“{a.note}”</span> : null}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <StageTracker stages={a.stages} current={a.currentStage} />
                    </CardContent>
                    {!done && (
                      <CardFooter>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => advanceApplication(a.id)}
                        >
                          {t("simulateRto")}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </Section>

        <Section title={t("payments")}>
          {payments.length === 0 ? (
            <Empty className="border">
              <EmptyMedia variant="icon">
                <Receipt />
              </EmptyMedia>
              <EmptyTitle>{t("noPaymentsYet")}</EmptyTitle>
            </Empty>
          ) : (
            <Card>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("receiptLabel")}</TableHead>
                      <TableHead>{t("purposeLabel")}</TableHead>
                      <TableHead>{t("vehicle")}</TableHead>
                      <TableHead className="text-right">{t("amountLabel")}</TableHead>
                      <TableHead>{t("dateLabel")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.receiptNo}</TableCell>
                        <TableCell>{p.purpose}</TableCell>
                        <TableCell className="font-mono">{p.regNo ?? "—"}</TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                          {inr(p.amount)}
                        </TableCell>
                        <TableCell>{new Date(p.date).toLocaleDateString("en-IN")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </Section>
      </div>
    </PageShell>
  );
}
