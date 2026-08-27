"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { findVehicle, emi } from "@/lib/data";
import { buildVerdict } from "@/lib/verdict";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockTag } from "@/components/stage-tracker";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function ReportPage() {
  const t = useT();
  const router = useRouter();
  const { regNo } = useParams<{ regNo: string }>();
  const { unlockedReports, locale, mobile } = useApp();
  const vehicle = findVehicle(regNo);

  const [principal, setPrincipal] = useState(400000);
  const [rate, setRate] = useState(9.5);
  const [months, setMonths] = useState(48);
  const monthly = useMemo(() => emi(principal, rate, months), [principal, rate, months]);

  if (!vehicle) return <p className="py-10 text-center text-muted-foreground">Unknown vehicle.</p>;
  if (!mobile || !unlockedReports.includes(vehicle.regNo)) {
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-muted-foreground">This report is locked.</p>
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
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/crash/${vehicle.regNo}`} />}>
            🆘 {t("crashCard")}
          </Button>
          {vehicle.status === "ACTIVE" && (
            <Button size="sm" nativeButton={false} render={<Link href={`/transfer/${vehicle.regNo}`} />}>
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
          <p className="mb-2 text-xs text-muted-foreground">
            {t("aiVerdict")} <MockTag label="RULE-GENERATED (AI-READY)" />
          </p>
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
            <CardTitle className="text-base">Vehicle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>{vehicle.maker} {vehicle.model} · {vehicle.year}</p>
            <p className="text-muted-foreground">{vehicle.vehicleClass} · {vehicle.fuel} · {vehicle.emission} · {vehicle.color}</p>
            <p className="text-muted-foreground">Odometer (insurer-reported): {vehicle.odometerKm.toLocaleString("en-IN")} km</p>
            <p className="font-mono text-xs text-muted-foreground">Chassis {vehicle.chassisMasked} · Engine {vehicle.engineMasked}</p>
            <p>
              Fair price: <b>{inr(vehicle.fairPrice.min)}–{inr(vehicle.fairPrice.max)}</b>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("ownership")} <Badge variant="secondary">{vehicle.owners.length} owner{vehicle.owners.length > 1 ? "s" : ""}</Badge>
            </CardTitle>
            <CardDescription>Full names shown — seller consented <MockTag label="CONSENT" /></CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              {vehicle.owners.map((o) => (
                <li key={o.serial} className="flex justify-between gap-2">
                  <span>{o.serial}. {o.name}</span>
                  <span className="text-muted-foreground">{o.from} → {o.to ?? "present"}</span>
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
              <p className="font-semibold">⚠️ Active hypothecation: {vehicle.hypothecation.financier}</p>
              <p className="text-muted-foreground">
                Since {vehicle.hypothecation.since}.{" "}
                {vehicle.hypothecation.form35Pending
                  ? "Form 35 (HP termination) NOT filed — the loan is still on the RC."
                  : "Form 35 filed and cleared."}
              </p>
              <p className="mt-1">The current portal shows only &quot;Hypothecated: YES&quot;. The financier&apos;s name above is the detail buyers actually need.</p>
            </div>
          ) : (
            <p className="text-sm text-green-700 dark:text-green-400">✅ No active loan on the RC.</p>
          )}

          <div className="rounded-md border p-3">
            <p className="mb-3 text-sm font-medium">{t("emiCalc")} — planning your own loan for this car?</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label className="text-xs">Loan amount ({inr(principal)})</Label>
                <Input type="number" value={principal} min={50000} step={10000} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} />
              </div>
              <div>
                <Label className="text-xs">Interest % / year</Label>
                <Input type="number" value={rate} step={0.1} onChange={(e) => setRate(Number(e.target.value) || 0)} />
              </div>
              <div>
                <Label className="text-xs">Tenure (months)</Label>
                <Input type="number" value={months} min={6} step={6} onChange={(e) => setMonths(Number(e.target.value) || 1)} />
              </div>
            </div>
            <p className="mt-3 text-sm">
              Monthly EMI: <b className="text-lg">{inr(monthly)}</b>{" "}
              <span className="text-muted-foreground">· total interest {inr(monthly * months - principal)}</span>
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
              <Badge variant="destructive">{inr(pendingChallans.reduce((s, c) => s + c.amount, 0))} pending</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vehicle.challans.length === 0 ? (
            <p className="text-sm text-muted-foreground">No challans on record. ✅</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
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
                        <Badge variant={c.status === "PENDING" ? "destructive" : "secondary"}>{c.status}</Badge>
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
            {[
              ["Insurance", vehicle.insurance.validTill, vehicle.insurance.insurer],
              ["PUC", vehicle.puc.validTill, ""],
              ["Road tax", vehicle.tax.paidTill, ""],
              ...(vehicle.fitness ? [["Fitness", vehicle.fitness.validTill, ""] as const] : []),
            ].map(([label, till, extra]) => {
              const expired = new Date(till as string) < new Date("2026-08-28");
              return (
                <div key={label as string} className="flex justify-between">
                  <span>{label}{extra ? ` (${extra})` : ""}</span>
                  <span className={expired ? "font-semibold text-red-600" : "text-green-700 dark:text-green-400"}>
                    {till} {expired ? "· EXPIRED" : "✓"}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accident record <MockTag label="MOCK eDAR" /></CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {vehicle.accident.flag ? (
              <p className="font-medium text-red-600">🚨 {vehicle.accident.note}</p>
            ) : (
              <p className="text-green-700 dark:text-green-400">✅ No accident reports linked to this vehicle.</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              No citizen-facing accident data exists today; this panel demonstrates what consented eDAR integration could surface.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
