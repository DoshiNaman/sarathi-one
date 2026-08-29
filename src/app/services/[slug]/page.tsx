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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Paperclip } from "lucide-react";

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
      regNo: service.needsVehicle ? regNo.toUpperCase() : service.title.en,
      stages: labels,
      currentStage: labels.length - 1,
    };
    // Only the services with a slot stage booked one.
    if (slotDate) draft.slot = { rto: "GJ01 - Ahmedabad", date: slotDate, time: "11:30 AM" };

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
        <div className="space-y-3">
          <Label htmlFor="regNo">{t("enterRegNo")}</Label>
          <Input
            id="regNo"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            placeholder="GJ12MN2468"
            className="font-mono uppercase"
          />
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
        <div className="space-y-4 text-center">
          <CheckCircle2 aria-hidden className="text-success mx-auto size-10" />
          <p className="font-display text-xl">{t("submitted")}</p>
          <p className="font-mono text-sm">{appId}</p>
          <div className="flex justify-center gap-2">
            <Button variant="pop" nativeButton={false} render={<Link href="/garage" />}>
              {t("applications")}
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/status" />}>
              {t("trackIt")}
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  if (gated) {
    return (
      <Shell service={service} labels={labels} stage={stage}>
        <div className="space-y-4 text-center">
          <p className="text-sm">{t("serviceLocked")}</p>
          <Button variant="pop" data-glow nativeButton={false} render={<Link href="/login" />}>
            {t("login")}
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell service={service} labels={labels} stage={stage}>
      {current?.kind === "info" && (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("servicesPreview")} <MockTag />
          </p>
          <Button variant="pop" className="w-full" onClick={next}>
            {t("continueBtn")}
          </Button>
        </div>
      )}

      {current?.kind === "pick" && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{t("pickOne")}</p>
          {current.options?.map((o) => {
            const active = picked[stage]?.label === o.label;
            return (
              <button
                key={o.label}
                type="button"
                onClick={() => setPicked({ ...picked, [stage]: o })}
                className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                  active ? "border-pop bg-muted/60" : "hover:bg-muted/40"
                }`}
              >
                <span>{o.label}</span>
                {o.price !== undefined && <span className="font-medium">{inr(o.price)}</span>}
              </button>
            );
          })}
          <Button variant="pop" className="w-full" disabled={!picked[stage]} onClick={next}>
            {t("continueBtn")}
          </Button>
        </div>
      )}

      {current?.kind === "docs" && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            {t("docsIntro")} <MockTag label={t("mockUpload")} />
          </p>
          {current.docs?.map((d) => (
            <div key={d} className="flex items-center justify-between rounded border p-2 text-sm">
              <span>
                {docs.includes(d) ? (
                  <CheckCircle2 aria-hidden className="text-success inline size-4" />
                ) : (
                  <Paperclip aria-hidden className="text-muted-foreground inline size-4" />
                )}{" "}
                {d}
              </span>
              {!docs.includes(d) && (
                <Button size="xs" variant="outline" onClick={() => setDocs([...docs, d])}>
                  {t("upload")}
                </Button>
              )}
            </div>
          ))}
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
        <div className="space-y-3">
          <div className="flex justify-between border-b pb-2 text-sm">
            <span className="text-muted-foreground">{t("total")}</span>
            <span className="font-medium">{inr(amount)}</span>
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
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm leading-relaxed">{t("slotNote")}</p>
          <Input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
          <Button variant="pop" className="w-full" disabled={!slotDate} onClick={next}>
            {t("bookSlot")}
          </Button>
        </div>
      )}

      {current?.kind === "text" && (
        <div className="space-y-3">
          <Label htmlFor="issue">{t("describeIssue")}</Label>
          <textarea
            id="issue"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            rows={4}
            className="border-input focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent p-3 text-sm outline-none focus-visible:ring-3"
          />
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
    <PageShell title={service.title[locale]} description={service.blurb[locale]} width="narrow">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        <div className="bg-card h-fit rounded-2xl border p-4">
          <StageTracker stages={labels} current={stage} />
        </div>
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
  );
}
