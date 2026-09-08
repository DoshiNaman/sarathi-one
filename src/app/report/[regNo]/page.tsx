"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { emi, inr, DEMO_NOW } from "@/lib/data";
import { useVehicle } from "@/lib/use-vehicle";
import { serviceCentresFor } from "@/lib/service-centres";
import { buildVerdict } from "@/lib/verdict";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MockTag } from "@/components/stage-tracker";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Calculator,
  CheckCircle2,
  Car,
  FileText,
  LifeBuoy,
  Phone,
  Receipt,
  ShieldAlert,
  Wrench,
  Users,
} from "lucide-react";
import { AuthGate } from "@/components/auth-gate";
import { Reveal } from "@/components/reveal";
import { PriceBand } from "@/components/price-band";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server, and `ogl` is pulled
// in by this route alone.
import MoltenMetal from "@/components/molten-metal";

/** A card header with its icon in a tile, the shape the rest of the app uses. */
function SectionHeader({
  icon: Icon,
  action,
  children,
}: {
  icon: typeof Car;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-base">
        <span
          aria-hidden
          className="bg-muted text-foreground grid size-9 shrink-0 place-items-center rounded-xl"
        >
          <Icon className="size-4.5" strokeWidth={1.5} />
        </span>
        <span className="flex min-w-0 flex-wrap items-center gap-2">{children}</span>
        {action}
      </CardTitle>
    </CardHeader>
  );
}

export default function ReportPage() {
  const t = useT();

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the report. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <MoltenMetal mouseInteraction={false} />
      </div>
      <AuthGate message={t("loginForReport")}>
        <ReportContent />
      </AuthGate>
    </>
  );
}

function ReportContent() {
  const t = useT();
  const router = useRouter();
  const { regNo } = useParams<{ regNo: string }>();
  const unlockedReports = useApp((s) => s.unlockedReports);
  const locale = useApp((s) => s.locale);
  const model = useApp((s) => s.model);
  const { vehicle } = useVehicle(regNo);

  const [principal, setPrincipal] = useState(400000);
  const [rate, setRate] = useState(9.5);
  const [months, setMonths] = useState(48);
  const monthly = useMemo(() => emi(principal, rate, months), [principal, rate, months]);

  // The verdict paragraph is written by an OpenAI model when a key is configured;
  // the rule engine's bullet points always render, so the report is never empty.
  const [prose, setProse] = useState("");
  const [aiSource, setAiSource] = useState<"loading" | "ai" | "fallback">("loading");
  useEffect(() => {
    let cancelled = false;
    fetch("/api/verdict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regNo, locale, model }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setAiSource(d.source === "ai" ? "ai" : "fallback");
        if (d.source === "ai" && d.prose) setProse(d.prose);
      })
      .catch(() => !cancelled && setAiSource("fallback"));
    return () => {
      cancelled = true;
    };
  }, [regNo, locale, model]);

  if (!vehicle)
    return <p className="text-muted-foreground py-10 text-center">{t("unknownVehicle")}</p>;
  if (!unlockedReports.includes(vehicle.regNo)) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground mb-4">{t("reportLocked")}</p>
        <Button onClick={() => router.push("/check")}>{t("goToCheck")}</Button>
      </div>
    );
  }

  const verdict = buildVerdict(vehicle);
  // Each band carries its own foreground. It used to use text-primary-foreground
  // — near-white — on a light amber CAUTION bar, which failed contrast on the
  // one line of the report that has to be read first.
  const gradeColor =
    verdict.grade === "GOOD"
      ? "bg-success text-success-foreground"
      : verdict.grade === "CAUTION"
        ? "bg-warning text-warning-foreground"
        : "bg-danger text-danger-foreground";
  const pendingChallans = vehicle.challans.filter((c) => c.status === "PENDING");

  return (
    // Solid cards, not the half-frosted ones this had. The report is read end to
    // end, and a translucent surface over a moving field costs contrast on every
    // line of it. The molten field stays behind as atmosphere.
    <Reveal className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-10">
      <div data-reveal className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-3xl">
          {t("trustReport")} <span className="font-mono">{vehicle.regNo}</span>
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/crash/${vehicle.regNo}`} />}
          >
            <LifeBuoy data-icon="inline-start" />
            {t("crashCard")}
          </Button>
          {vehicle.status === "ACTIVE" && (
            <Button
              size="sm"
              variant="pop"
              nativeButton={false}
              render={<Link href={`/transfer/${vehicle.regNo}`} />}
            >
              {t("startTransfer")}
              <ArrowRight data-icon="inline-end" />
            </Button>
          )}
        </div>
      </div>

      {/* AI verdict */}
      {/* The answer. Everything below is the evidence for it, so it gets the
          full width and the only coloured band on the page. */}
      <Card data-reveal className="gap-0 overflow-hidden py-0">
        <div className={`${gradeColor} flex flex-col gap-1 px-5 py-4`}>
          <span className="font-mono text-xs tracking-widest uppercase opacity-80">
            {verdict.grade}
          </span>
          <p className="font-display text-xl leading-tight">{verdict.headline[locale]}</p>
        </div>
        <CardContent className="flex flex-col gap-3 py-5">
          <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            {t("aiVerdict")}
            <MockTag
              label={aiSource === "ai" ? "AI" : aiSource === "loading" ? "…" : "RULE ENGINE"}
            />
          </p>
          {prose && <p className="text-sm leading-relaxed">{prose}</p>}
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed">
            {verdict.points.map((p, i) => (
              <li key={i}>{p[locale]}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Vehicle + ownership */}
      <div data-reveal className="grid gap-4 sm:grid-cols-2">
        <Card className="h-full">
          <SectionHeader icon={Car}>{t("vehicle")}</SectionHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            <p className="font-medium">
              {vehicle.maker} {vehicle.model} · {vehicle.year}
            </p>
            <p className="text-muted-foreground">
              {vehicle.vehicleClass} · {vehicle.fuel} · {vehicle.emission} · {vehicle.color}
            </p>
            <p className="text-muted-foreground">
              {t("odometerLabel")}: {vehicle.odometerKm.toLocaleString("en-IN")} km
            </p>
            <Separator className="my-1" />
            <p className="text-muted-foreground font-mono text-xs">
              {t("chassisLabel")} {vehicle.chassisMasked} · {t("engineLabel")}{" "}
              {vehicle.engineMasked}
            </p>
          </CardContent>
        </Card>

        <Card className="h-full">
          <SectionHeader
            icon={Users}
            action={<Badge variant="secondary">{vehicle.owners.length}</Badge>}
          >
            {t("ownership")}
          </SectionHeader>
          <CardContent className="flex flex-col gap-3">
            <CardDescription className="flex flex-wrap items-center gap-2">
              {t("consented")} <MockTag label="CONSENT" />
            </CardDescription>
            <ol className="flex flex-col gap-2 text-sm">
              {vehicle.owners.map((o) => (
                <li key={o.serial} className="flex justify-between gap-2">
                  <span>
                    {o.serial}. {o.name}
                  </span>
                  <span className="text-muted-foreground">
                    {o.from} → {o.to ?? "present"}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Full width on purpose: the price rows read as a comparison, and in a
          half-width column every label wrapped over four lines. Collapsed by
          default — the verdict up top already answers the buy question, and
          the full band is one tap away. */}
      <div data-reveal>
        <PriceBand vehicle={vehicle} consented collapsible />
      </div>

      {/* Loan panel + EMI */}
      <Card data-reveal>
        <SectionHeader icon={Banknote}>{t("loanPanel")}</SectionHeader>
        <CardContent className="flex flex-col gap-4">
          {vehicle.hypothecation.active ? (
            <Alert variant="warning">
              <AlertTriangle />
              <AlertTitle>
                {t("activeLoan")}: {vehicle.hypothecation.financier}
              </AlertTitle>
              <AlertDescription className="flex flex-col gap-1">
                <span>
                  {t("sinceLabel")} {vehicle.hypothecation.since}.{" "}
                  {vehicle.hypothecation.form35Pending ? t("form35NotFiled") : t("form35Cleared")}
                </span>
                <span>{t("onlyYesNo")}</span>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="success">
              <CheckCircle2 />
              <AlertDescription>{t("noLoan")}</AlertDescription>
            </Alert>
          )}

          {/* Every label was a bare <Label> with no htmlFor, so none of the three
              was tied to its own input. Field pairs them. */}
          <div className="flex flex-col gap-4 rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="bg-muted text-foreground grid size-8 shrink-0 place-items-center rounded-lg"
              >
                <Calculator className="size-4" strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-sm font-medium">{t("emiCalc")}</p>
                <p className="text-muted-foreground text-xs">{t("emiHelp")}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="emi-principal" className="text-xs">
                  {t("loanAmount")}
                </FieldLabel>
                <Input
                  id="emi-principal"
                  type="number"
                  value={principal}
                  min={50000}
                  step={10000}
                  onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="emi-rate" className="text-xs">
                  {t("interestRate")}
                </FieldLabel>
                <Input
                  id="emi-rate"
                  type="number"
                  value={rate}
                  step={0.1}
                  onChange={(e) => setRate(Number(e.target.value) || 0)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="emi-months" className="text-xs">
                  {t("tenure")}
                </FieldLabel>
                <Input
                  id="emi-months"
                  type="number"
                  value={months}
                  min={6}
                  step={6}
                  onChange={(e) => setMonths(Number(e.target.value) || 1)}
                />
              </Field>
            </div>

            <Separator />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-muted-foreground text-sm">{t("monthlyEmi")}</span>
              <span className="flex flex-wrap items-baseline gap-2">
                <b className="font-mono text-xl tabular-nums">{inr(monthly)}</b>
                <span className="text-muted-foreground text-xs">
                  {t("totalInterest")} {inr(monthly * months - principal)}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challans */}
      <Card data-reveal>
        <SectionHeader
          icon={Receipt}
          action={
            pendingChallans.length > 0 ? (
              <Badge variant="destructive">
                {inr(pendingChallans.reduce((sum, c) => sum + c.amount, 0))} {t("pending")}
              </Badge>
            ) : undefined
          }
        >
          {t("challans")}
        </SectionHeader>
        <CardContent className={vehicle.challans.length ? "overflow-x-auto" : undefined}>
          {vehicle.challans.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("noChallans")}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dateLabel")}</TableHead>
                  <TableHead>{t("offenseLabel")}</TableHead>
                  <TableHead className="text-right">{t("amountLabel")}</TableHead>
                  <TableHead>{t("statusLabel")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicle.challans.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">{c.date}</TableCell>
                    <TableCell>{c.offense}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {c.amount ? inr(c.amount) : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === "PENDING" ? "destructive" : "success"}>
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Documents + accident */}
      <div data-reveal className="grid gap-4 sm:grid-cols-2">
        <Card className="h-full">
          <SectionHeader icon={FileText}>{t("documents")}</SectionHeader>
          <CardContent className="flex flex-col gap-3.5 text-sm">
            {(
              [
                {
                  label: t("insuranceLabel"),
                  till: vehicle.insurance.validTill,
                  extra: vehicle.insurance.insurer,
                },
                { label: t("pucLabel"), till: vehicle.puc.validTill, extra: "" },
                { label: t("roadTaxLabel"), till: vehicle.tax.paidTill, extra: "" },
                ...(vehicle.fitness
                  ? [{ label: t("fitnessLabel"), till: vehicle.fitness.validTill, extra: "" }]
                  : []),
              ] satisfies { label: string; till: string; extra: string }[]
            ).map(({ label, till, extra }) => {
              const expired = new Date(till) < DEMO_NOW;
              return (
                // The same shape the garage uses: what it is on the left, whether
                // it is met on the right, the date underneath. A tick glyph and a
                // red date were carrying that on their own before.
                <div key={label} className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{label}</span>
                    <Badge variant={expired ? "destructive" : "success"}>
                      {expired ? t("expiredLabel") : t("clearLabel")}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {expired ? t("expiredOnLabel") : t("validTillLabel")} {till}
                    {extra ? ` · ${extra}` : ""}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="h-full">
          <SectionHeader icon={ShieldAlert}>
            {t("accidentRecord")} <MockTag label={t("mockEdar")} />
          </SectionHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {vehicle.accident.flag ? (
              <Alert variant="danger">
                <AlertTriangle />
                <AlertDescription>{vehicle.accident.note}</AlertDescription>
              </Alert>
            ) : (
              <Alert variant="success">
                <CheckCircle2 />
                <AlertDescription>{t("noAccident")}</AlertDescription>
              </Alert>
            )}
            <p className="text-muted-foreground text-xs leading-relaxed">{t("accidentNote")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Last on purpose. Everything above is the record; this is the one check
          the record cannot make for you, and the last thing to do before money
          moves. */}
      <Card data-reveal>
        <SectionHeader icon={Wrench} action={<MockTag label={t("mockDirectory")} />}>
          {t("serviceCentres")}
        </SectionHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed">{t("inspectWhy")}</p>

          <div className="flex flex-col gap-2">
            {serviceCentresFor(vehicle).map((c) => (
              <Item key={c.area} variant="outline">
                <ItemMedia variant="icon">
                  <Wrench />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{c.name}</ItemTitle>
                  <ItemDescription className="line-clamp-none">
                    {c.area} · {c.km}
                  </ItemDescription>
                </ItemContent>
                {/* Text, not a tel: link. The number is masked because inventing
                    a dialable one for a workshop that does not exist is the one
                    mistake on this page a person could act on. */}
                <ItemActions>
                  <span className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                    <Phone aria-hidden className="size-3.5" />
                    {c.phone}
                  </span>
                </ItemActions>
              </Item>
            ))}
          </div>

          <p className="text-muted-foreground text-xs leading-relaxed">{t("centresNote")}</p>
        </CardContent>
      </Card>
    </Reveal>
  );
}
