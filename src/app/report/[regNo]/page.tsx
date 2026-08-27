"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { emi, inr, DEMO_NOW } from "@/lib/data";
import { useVehicle } from "@/lib/use-vehicle";
import { buildVerdict } from "@/lib/verdict";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockTag } from "@/components/stage-tracker";
import { AuthGate } from "@/components/auth-gate";

export default function ReportPage() {
  return (
    <AuthGate message="Login to open a Trust Report.">
      <ReportContent />
    </AuthGate>
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

  if (!vehicle) return <p className="text-muted-foreground py-10 text-center">Unknown vehicle.</p>;
  if (!unlockedReports.includes(vehicle.regNo)) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground mb-4">This report is locked.</p>
        <Button onClick={() => router.push("/check")}>Go to vehicle check</Button>
      </div>
    );
  }

  const verdict = buildVerdict(vehicle);
  const gradeColor =
    verdict.grade === "GOOD"
      ? "bg-green-600"
      : verdict.grade === "CAUTION"
        ? "bg-amber-500"
        : "bg-red-600";
  const pendingChallans = vehicle.challans.filter((c) => c.status === "PENDING");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">
          {t("trustReport")} <span className="font-mono">{vehicle.regNo}</span>
        </h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/crash/${vehicle.regNo}`} />}
          >
            🆘 {t("crashCard")}
          </Button>
          {vehicle.status === "ACTIVE" && (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={`/transfer/${vehicle.regNo}`} />}
            >
              {t("startTransfer")} →
            </Button>
          )}
        </div>
      </div>

      {/* AI verdict */}
      <Card className="overflow-hidden">
        <div className={`${gradeColor} px-4 py-2 text-sm font-bold text-white`}>
          {verdict.grade} — {verdict.headline[locale]}
        </div>
        <CardContent className="pt-4">
          <p className="text-muted-foreground mb-2 text-xs">
            {t("aiVerdict")}{" "}
            <MockTag
              label={aiSource === "ai" ? "AI" : aiSource === "loading" ? "…" : "RULE ENGINE"}
            />
          </p>
          {prose && <p className="mb-3 text-sm leading-relaxed">{prose}</p>}
          <ul className="list-disc space-y-1.5 pl-5 text-sm">
            {verdict.points.map((p, i) => (
              <li key={i}>{p[locale]}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Vehicle + ownership */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("vehicle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              {vehicle.maker} {vehicle.model} · {vehicle.year}
            </p>
            <p className="text-muted-foreground">
              {vehicle.vehicleClass} · {vehicle.fuel} · {vehicle.emission} · {vehicle.color}
            </p>
            <p className="text-muted-foreground">
              Odometer (insurer-reported): {vehicle.odometerKm.toLocaleString("en-IN")} km
            </p>
            <p className="text-muted-foreground font-mono text-xs">
              Chassis {vehicle.chassisMasked} · Engine {vehicle.engineMasked}
            </p>
            <p>
              {t("fairPrice")}:{" "}
              <b>
                {inr(vehicle.fairPrice.min)}–{inr(vehicle.fairPrice.max)}
              </b>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("ownership")}{" "}
              <Badge variant="secondary">
                {vehicle.owners.length} owner{vehicle.owners.length > 1 ? "s" : ""}
              </Badge>
            </CardTitle>
            <CardDescription>
              {t("consented")} <MockTag label="CONSENT" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
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

      {/* Loan panel + EMI */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("loanPanel")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vehicle.hypothecation.active ? (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
              <p className="font-semibold">
                ⚠️ {t("activeLoan")}: {vehicle.hypothecation.financier}
              </p>
              <p className="text-muted-foreground">
                Since {vehicle.hypothecation.since}.{" "}
                {vehicle.hypothecation.form35Pending
                  ? "Form 35 (HP termination) NOT filed — the loan is still on the RC."
                  : "Form 35 filed and cleared."}
              </p>
              <p className="mt-1">{t("onlyYesNo")}</p>
            </div>
          ) : (
            <p className="text-sm text-green-700 dark:text-green-400">✅ {t("noLoan")}</p>
          )}

          <div className="rounded-md border p-3">
            <p className="mb-3 text-sm font-medium">
              {t("emiCalc")} — planning your own loan for this car?
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs">
                  {t("loanAmount")} ({inr(principal)})
                </Label>
                <Input
                  type="number"
                  value={principal}
                  min={50000}
                  step={10000}
                  onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label className="text-xs">{t("interestRate")}</Label>
                <Input
                  type="number"
                  value={rate}
                  step={0.1}
                  onChange={(e) => setRate(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label className="text-xs">{t("tenure")}</Label>
                <Input
                  type="number"
                  value={months}
                  min={6}
                  step={6}
                  onChange={(e) => setMonths(Number(e.target.value) || 1)}
                />
              </div>
            </div>
            <p className="mt-3 text-sm">
              {t("monthlyEmi")}: <b className="text-lg">{inr(monthly)}</b>{" "}
              <span className="text-muted-foreground">
                · {t("totalInterest")} {inr(monthly * months - principal)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Challans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("challans")}{" "}
            {pendingChallans.length > 0 && (
              <Badge variant="destructive">
                {inr(pendingChallans.reduce((s, c) => s + c.amount, 0))} {t("pending")}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vehicle.challans.length === 0 ? (
            <p className="text-muted-foreground text-sm">{t("noChallans")} ✅</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b text-left">
                    <th className="py-1 pr-4">Date</th>
                    <th className="py-1 pr-4">Offense</th>
                    <th className="py-1 pr-4">Amount</th>
                    <th className="py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicle.challans.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-1.5 pr-4">{c.date}</td>
                      <td className="py-1.5 pr-4">{c.offense}</td>
                      <td className="py-1.5 pr-4">{c.amount ? inr(c.amount) : "—"}</td>
                      <td className="py-1.5">
                        <Badge variant={c.status === "PENDING" ? "destructive" : "secondary"}>
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents + accident */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("documents")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            {(
              [
                {
                  label: "Insurance",
                  till: vehicle.insurance.validTill,
                  extra: vehicle.insurance.insurer,
                },
                { label: "PUC", till: vehicle.puc.validTill, extra: "" },
                { label: "Road tax", till: vehicle.tax.paidTill, extra: "" },
                ...(vehicle.fitness
                  ? [{ label: "Fitness", till: vehicle.fitness.validTill, extra: "" }]
                  : []),
              ] satisfies { label: string; till: string; extra: string }[]
            ).map(({ label, till, extra }) => {
              const expired = new Date(till) < DEMO_NOW;
              return (
                <div key={label} className="flex justify-between">
                  <span>
                    {label}
                    {extra ? ` (${extra})` : ""}
                  </span>
                  <span
                    className={
                      expired ? "font-semibold text-red-600" : "text-green-700 dark:text-green-400"
                    }
                  >
                    {till} {expired ? `· ${t("expired")}` : "✓"}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("accidentRecord")} <MockTag label="MOCK eDAR" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {vehicle.accident.flag ? (
              <p className="font-medium text-red-600">🚨 {vehicle.accident.note}</p>
            ) : (
              <p className="text-green-700 dark:text-green-400">✅ {t("noAccident")}</p>
            )}
            <p className="text-muted-foreground mt-2 text-xs">{t("accidentNote")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
