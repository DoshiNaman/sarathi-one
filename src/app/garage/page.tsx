"use client";
import Link from "next/link";
import { FLEET, MY_VEHICLES, DEMO_NOW, inr } from "@/lib/data";
import { AuthGate } from "@/components/auth-gate";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StageTracker } from "@/components/stage-tracker";

export default function GaragePage() {
  return (
    <AuthGate message="Login to see your garage.">
      <GarageContent />
    </AuthGate>
  );
}

function GarageContent() {
  const t = useT();
  const applications = useApp((s) => s.applications);
  const payments = useApp((s) => s.payments);
  const advanceApplication = useApp((s) => s.advanceApplication);

  const myVehicles = FLEET.filter((v) => MY_VEHICLES.includes(v.regNo));
  const nudges = myVehicles.flatMap((v) => {
    const items: { regNo: string; msg: string }[] = [];
    if (new Date(v.insurance.validTill) < DEMO_NOW)
      items.push({ regNo: v.regNo, msg: `Insurance expired ${v.insurance.validTill}` });
    if (new Date(v.puc.validTill) < DEMO_NOW)
      items.push({ regNo: v.regNo, msg: `PUC expired ${v.puc.validTill}` });
    if (v.fitness && new Date(v.fitness.validTill) < DEMO_NOW)
      items.push({ regNo: v.regNo, msg: `Fitness expired ${v.fitness.validTill}` });
    const pend = v.challans.filter((c) => c.status === "PENDING");
    if (pend.length)
      items.push({
        regNo: v.regNo,
        msg: `${pend.length} pending challan(s) — ${inr(pend.reduce((s, c) => s + c.amount, 0))}`,
      });
    return items;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("myGarage")}</h1>
      <p className="text-muted-foreground text-sm">
        One account, everything in one place — the view that does not exist on the current portals.
      </p>

      {nudges.length > 0 && (
        <Card className="border-amber-300 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-base">⚠️ {t("nudges")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {nudges.map((n, i) => (
              <p key={i}>
                <span className="font-mono">{n.regNo}</span>: {n.msg}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="font-semibold">{t("vehicles")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {myVehicles.map((v) => (
            <Card key={v.regNo}>
              <CardHeader>
                <CardTitle className="font-mono text-base">{v.regNo}</CardTitle>
                <CardDescription>
                  {v.maker} {v.model} · {v.year}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/crash/${v.regNo}`} />}
                >
                  🆘 {t("crashCard")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href={`/transfer/${v.regNo}`} />}
                >
                  {t("transfer")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">{t("applications")}</h2>
        {applications.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No applications yet. Start a transfer from a Trust Report.
          </p>
        ) : (
          applications.map((a) => (
            <Card key={a.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="font-mono text-base">{a.id}</CardTitle>
                  <Badge variant={a.currentStage >= a.stages.length ? "secondary" : "default"}>
                    {a.currentStage >= a.stages.length ? "COMPLETE" : "IN PROGRESS"}
                  </Badge>
                </div>
                <CardDescription>
                  {a.type.replaceAll("_", " ")} · {a.regNo}
                  {a.slot ? ` · RTO visit ${a.slot.date} ${a.slot.time}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <StageTracker stages={a.stages} current={a.currentStage} />
                {a.currentStage < a.stages.length && (
                  <Button size="sm" variant="outline" onClick={() => advanceApplication(a.id)}>
                    Simulate RTO approval →
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">{t("payments")}</h2>
        {payments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No payments yet.</p>
        ) : (
          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground border-b text-left">
                      <th className="py-1 pr-4">Receipt</th>
                      <th className="py-1 pr-4">Purpose</th>
                      <th className="py-1 pr-4">Vehicle</th>
                      <th className="py-1 pr-4">Amount</th>
                      <th className="py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-1.5 pr-4 font-mono text-xs">{p.receiptNo}</td>
                        <td className="py-1.5 pr-4">{p.purpose}</td>
                        <td className="py-1.5 pr-4 font-mono">{p.regNo ?? "—"}</td>
                        <td className="py-1.5 pr-4">{inr(p.amount)}</td>
                        <td className="py-1.5">{new Date(p.date).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
