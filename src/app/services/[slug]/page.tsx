"use client";
import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findService, type Option, type Stage } from "@/lib/services";
import { inr } from "@/lib/data";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { PageShell } from "@/components/page-shell";
import { StageTracker, MockTag } from "@/components/stage-tracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Info, Lock, Paperclip } from "lucide-react";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check and garage pages — the route chunk keeps `ogl` off every other
// page.
import WavesBg from "@/components/waves-bg";

/**
 * One wizard for all seven roadmap services.
 *
 * Every one of them is the same shape underneath — pick something, upload
 * something, pay, book a slot, get a number back — which is the argument the
 * whole product makes. Writing seven pages would have contradicted it, so the
 * stage list in lib/services.ts drives what renders here.
 *
 * The fancy-number auction is the one service you can walk without signing in:
 * browsing is the fix for a portal that asks for a login before it shows you a
 * single number. The gate falls at the first stage that files or pays.
 */
export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = findService(slug);
  if (!service) notFound();

  return <Wizard key={service.slug} service={service} />;
}

function Wizard({ service }: { service: NonNullable<ReturnType<typeof findService>> }) {
  const t = useT();
  const mobile = useApp((s) => s.mobile);
  const hydrated = useApp((s) => s.hydrated);
  const addPayment = useApp((s) => s.addPayment);
  const addApplication = useApp((s) => s.addApplication);

  const [stage, setStage] = useState(0);
  const [regNo, setRegNo] = useState("");
  const [picked, setPicked] = useState<Record<number, Option>>({});
  const [docs, setDocs] = useState<string[]>([]);
  const [issue, setIssue] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [appId, setAppId] = useState<string | null>(null);
  // Separate from regNo: keying off "is the field empty" would jump to stage 0
  // on the first character typed, before the citizen has finished the number.
  const [started, setStarted] = useState(false);

  const labels = service.stages.map((s) => s.label);
  const done = stage >= service.stages.length;
  const current: Stage | undefined = service.stages[stage];

  // A priced pick (a permit class, a fancy number) overrides the flat fee.
  const amount = Object.values(picked).find((o) => o.price !== undefined)?.price ?? service.fee;

  // Browsing is free; filing is not. Everything up to the first fee or slot is
  // open on a browsable service, and gated everywhere else.
  const gated = !mobile && hydrated && !(service.browsable && current?.kind === "pick");

  function finish() {
    const draft: Parameters<typeof addApplication>[0] = {
      type: service.type,
      // The type already names the service; repeating it here read as
      // "LEARNER LICENCE · Learner licence" in the garage.
      regNo: service.needsVehicle ? regNo.toUpperCase() : "—",
      stages: labels,
      currentStage: labels.length - 1,
    };
    // Only the services with a slot stage booked one.
    if (slotDate) draft.slot = { rto: "GJ01 - Ahmedabad", date: slotDate, time: "11:30 AM" };
    if (issue.trim()) draft.note = issue.trim();

    const app = addApplication(draft);
    setAppId(app.id);
    setStage(service.stages.length);
  }

  function next() {
    if (stage === service.stages.length - 1) finish();
    else setStage(stage + 1);
  }

  if (service.needsVehicle && !started) {
    return (
      <Shell service={service} labels={labels} stage={stage}>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="regNo">{t("enterRegNo")}</FieldLabel>
            <Input
              id="regNo"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="RJ14MN2468"
              className="font-mono uppercase"
            />
          </Field>
          <Button
            variant="pop"
            className="w-full"
            disabled={!regNo.trim()}
            onClick={() => setStarted(true)}
          >
            {t("continueBtn")}
          </Button>
        </div>
      </Shell>
    );
  }

  if (done && appId) {
    return (
      <Shell service={service} labels={labels} stage={labels.length}>
        <Empty>
          <EmptyMedia variant="icon" className="text-success">
            <CheckCircle2 />
          </EmptyMedia>
          <EmptyTitle>{t("submitted")}</EmptyTitle>
          <EmptyDescription className="font-mono">{appId}</EmptyDescription>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="pop" nativeButton={false} render={<Link href="/garage" />}>
              {t("applications")}
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/status" />}>
              {t("trackIt")}
            </Button>
          </div>
        </Empty>
      </Shell>
    );
  }

  if (gated) {
    return (
      <Shell service={service} labels={labels} stage={stage}>
        <Empty>
          <EmptyMedia variant="icon">
            <Lock />
          </EmptyMedia>
          <EmptyTitle>{t("serviceLocked")}</EmptyTitle>
          <Button variant="pop" data-glow nativeButton={false} render={<Link href="/login" />}>
            {t("login")}
          </Button>
        </Empty>
      </Shell>
    );
  }

  return (
    <Shell service={service} labels={labels} stage={stage}>
      {current?.kind === "info" && (
        <div className="flex flex-col gap-4">
          <Alert>
            <Info />
            <AlertDescription className="flex flex-wrap items-center gap-2">
              {t("servicesPreview")} <MockTag />
            </AlertDescription>
          </Alert>
          <Button variant="pop" className="w-full" onClick={next}>
            {t("continueBtn")}
          </Button>
        </div>
      )}

      {current?.kind === "pick" && (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">{t("pickOne")}</p>
          <RadioGroup
            value={picked[stage]?.label ?? null}
            onValueChange={(value) => {
              const option = current.options?.find((o) => o.label === value);
              if (option) setPicked({ ...picked, [stage]: option });
            }}
          >
            {current.options?.map((o) => (
              <FieldLabel key={o.label} htmlFor={`opt-${stage}-${o.label}`}>
                <Field orientation="horizontal">
                  <RadioGroupItem value={o.label} id={`opt-${stage}-${o.label}`} />
                  <FieldContent>
                    <FieldTitle>{o.label}</FieldTitle>
                  </FieldContent>
                  {o.price !== undefined && (
                    <span className="font-mono text-sm tabular-nums">{inr(o.price)}</span>
                  )}
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          <Button variant="pop" className="w-full" disabled={!picked[stage]} onClick={next}>
            {t("continueBtn")}
          </Button>
        </div>
      )}

      {current?.kind === "docs" && (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
            {t("docsIntro")} <MockTag label={t("mockUpload")} />
          </p>
          <div className="flex flex-col gap-2">
            {current.docs?.map((d) => {
              const attached = docs.includes(d);
              return (
                <Item key={d} variant="outline">
                  <ItemMedia variant="icon">
                    {attached ? <CheckCircle2 className="text-success" /> : <Paperclip />}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{d}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    {attached ? (
                      <span className="text-muted-foreground text-xs">{t("uploaded")}</span>
                    ) : (
                      <Button size="xs" variant="outline" onClick={() => setDocs([...docs, d])}>
                        {t("upload")}
                      </Button>
                    )}
                  </ItemActions>
                </Item>
              );
            })}
          </div>
          <Button
            variant="pop"
            className="w-full"
            disabled={docs.length < (current.docs?.length ?? 0)}
            onClick={next}
          >
            {t("continueBtn")}
          </Button>
        </div>
      )}

      {current?.kind === "fee" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-muted-foreground">{t("total")}</span>
              <span className="font-mono text-base font-medium tabular-nums">{inr(amount)}</span>
            </div>
            <Separator />
          </div>
          <Button
            variant="pop"
            className="w-full"
            onClick={() => {
              const receipt: Parameters<typeof addPayment>[0] = {
                purpose: service.title.en,
                amount,
              };
              // A licence or grievance fee has no vehicle to bill it against.
              if (service.needsVehicle) receipt.regNo = regNo.toUpperCase();

              addPayment(receipt);
              next();
            }}
          >
            {t("payNow")}
          </Button>
        </div>
      )}

      {current?.kind === "slot" && (
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="slot-date">{t("bookSlot")}</FieldLabel>
            <Input
              id="slot-date"
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
            />
            <FieldDescription>{t("slotNote")}</FieldDescription>
          </Field>
          <Button variant="pop" className="w-full" disabled={!slotDate} onClick={next}>
            {t("bookSlot")}
          </Button>
        </div>
      )}

      {current?.kind === "text" && (
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="issue">{t("describeIssue")}</FieldLabel>
            <Textarea
              id="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              rows={4}
            />
          </Field>
          <Button variant="pop" className="w-full" disabled={!issue.trim()} onClick={next}>
            {t("continueBtn")}
          </Button>
        </div>
      )}
    </Shell>
  );
}

function Shell({
  service,
  labels,
  stage,
  children,
}: {
  service: NonNullable<ReturnType<typeof findService>>;
  labels: string[];
  stage: number;
  children: React.ReactNode;
}) {
  const locale = useApp((s) => s.locale);
  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the wizard. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <PageShell title={service.title[locale]} description={service.blurb[locale]} width="narrow">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardContent>
              <StageTracker stages={labels} current={stage} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {stage < labels.length ? labels[stage] : "Done"}
              </CardTitle>
              <CardDescription>{service.fact[locale]}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </PageShell>
    </>
  );
}
