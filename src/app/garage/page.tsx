"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FLEET, MY_VEHICLES } from "@/lib/data";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StageTracker } from "@/components/stage-tracker";

const NOW = new Date("2026-08-28");
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function GaragePage() {
  const t = useT();
  const router = useRouter();
  const { mobile, applications, payments } = useApp();

  if (!mobile)
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-muted-foreground">Login to see your garage.</p>
        <Button onClick={() => router.push("/login")}>{t("login")}</Button>
      </div>
    );

  const myVehicles = FLEET.filter((v) => MY_VEHICLES.includes(v.regNo));
  const nudges = myVehicles.flatMap((v) => {
    const items: { regNo: string; msg: string }[] = [];
    if (new Date(v.insurance.validTill) < NOW) items.push({ regNo: v.regNo, msg: `Insurance expired ${v.insurance.validTill}` });
    if (new Date(v.puc.validTill) < NOW) items.push({ regNo: v.regNo, msg: `PUC expired ${v.puc.validTill}` });
    if (v.fitness && new Date(v.fitness.validTill) < NOW) items.push({ regNo: v.regNo, msg: `Fitness expired ${v.fitness.validTill}` });
    const pend = v.challans.filter((c) => c.status === "PENDING");
    if (pend.length) items.push({ regNo: v.regNo, msg: `${pend.length} pending challan(s) — ${inr(pend.reduce((s, c) => s + c.amount, 0))}` });
    return items;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("myGarage")}</h1>
      <p className="text-sm text-muted-foreground">
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
                <CardDescription>{v.maker} {v.model} · {v.year}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/crash/${v.regNo}`} />}>
                  🆘 {t("crashCard")}
                </Button>
                <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`/transfer/${v.regNo}`} />}>
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
          <p className="text-sm text-muted-foreground">No applications yet. Start a transfer from a Trust Report.</p>
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
              <CardContent>
                <StageTracker stages={a.stages} current={a.currentStage} />
              </CardContent>
            </Card>
          ))
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">{t("payments")}</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payments yet.</p>
        ) : (
          <Card>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
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
