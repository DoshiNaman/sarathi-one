"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { findVehicle, TRANSFER_STAGES, TRANSFER_FEE, HP_TERMINATION_FEE, DEMO_OTP } from "@/lib/data";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StageTracker, MockTag } from "@/components/stage-tracker";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function TransferPage() {
  const router = useRouter();
  const { regNo } = useParams<{ regNo: string }>();
  const vehicle = findVehicle(regNo);
  const { mobile, addPayment, addApplication } = useApp();

  const [stage, setStage] = useState(0);
  const [buyerName, setBuyerName] = useState("");
  const [buyerMobile, setBuyerMobile] = useState("");
  const [sellerOtp, setSellerOtp] = useState("");
  const [docs, setDocs] = useState<string[]>([]);
  const [slotDate, setSlotDate] = useState("");
  const [appId, setAppId] = useState<string | null>(null);

  if (!vehicle) return <p className="py-10 text-center text-muted-foreground">Unknown vehicle.</p>;
  if (!mobile)
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-muted-foreground">Login required for the transfer journey.</p>
        <Button onClick={() => router.push("/login")}>Login</Button>
      </div>
    );
  if (vehicle.status !== "ACTIVE")
    return <p className="py-10 text-center text-destructive">A {vehicle.status.toLowerCase()} vehicle cannot be transferred.</p>;

  const hpPending = vehicle.hypothecation.active;
  const requiredDocs = ["RC (auto-fetched)", "Insurance (auto-fetched)", "Seller ID proof", "Buyer ID proof", "Buyer address proof"];

  function finish() {
    const app = addApplication({
      type: "TRANSFER_OF_OWNERSHIP",
      regNo: vehicle!.regNo,
      stages: TRANSFER_STAGES,
      currentStage: 6,
      slot: { rto: vehicle!.rto, date: slotDate, time: "11:30 AM" },
    });
    setAppId(app.id);
    setStage(7);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">
        Transfer of ownership · <span className="font-mono">{vehicle.regNo}</span>
      </h1>
      <p className="text-sm text-muted-foreground">
        Today this journey is 4 disconnected portals (Form 29/30, Form 35, ePayment, slot booking). Here it is one wizard.
      </p>

      <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StageTracker stages={TRANSFER_STAGES} current={stage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{stage < 7 ? TRANSFER_STAGES[stage] : "Done"}</CardTitle>
            {stage === 0 && <CardDescription>Statutory Forms 29 (seller) + 30 (buyer), combined</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {stage === 0 && (
              <>
                <div className="space-y-2">
                  <Label>Seller</Label>
                  <Input disabled value={`${vehicle.owners[vehicle.owners.length - 1].name} (RC holder, logged in)`} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bn">Buyer full name</Label>
                  <Input id="bn" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bm">Buyer mobile</Label>
                  <Input id="bm" inputMode="numeric" maxLength={10} value={buyerMobile} onChange={(e) => setBuyerMobile(e.target.value.replace(/\D/g, ""))} />
                </div>
                <Button className="w-full" disabled={buyerName.length < 3 || !/^[6-9]\d{9}$/.test(buyerMobile)} onClick={() => setStage(1)}>
                  Continue
                </Button>
              </>
            )}

            {stage === 1 && (
              <>
                {hpPending ? (
                  <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
                    <p className="font-semibold">⚠️ Active loan: {vehicle.hypothecation.financier}</p>
                    <p className="mt-1">
                      Form 35 must be filed with the financier&apos;s NOC before transfer. We bundle it into this application
                      (+{inr(HP_TERMINATION_FEE)}). <MockTag label="MOCK BANK NOC" />
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-green-700 dark:text-green-400">✅ No hypothecation on the RC — nothing to terminate.</p>
                )}
                <Button className="w-full" onClick={() => setStage(2)}>
                  {hpPending ? "Bundle Form 35 & continue" : "Continue"}
                </Button>
              </>
            )}

            {stage === 2 && (
              <>
                <p className="text-sm text-muted-foreground">
                  RC and insurance are fetched from the registry — only identity documents are uploaded. <MockTag label="MOCK UPLOAD" />
                </p>
                {requiredDocs.map((d) => {
                  const auto = d.includes("auto");
                  const done = auto || docs.includes(d);
                  return (
                    <div key={d} className="flex items-center justify-between rounded border p-2 text-sm">
                      <span>{done ? "✅" : "📎"} {d}</span>
                      {!auto && !done && (
                        <Button size="xs" variant="outline" onClick={() => setDocs((x) => [...x, d])}>
                          Upload
                        </Button>
                      )}
                    </div>
                  );
                })}
                <Button className="w-full" disabled={docs.length < 3} onClick={() => setStage(3)}>
                  Continue
                </Button>
              </>
            )}

            {stage === 3 && (
              <>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Transfer of ownership fee</span><span>{inr(TRANSFER_FEE)}</span></div>
                  {hpPending && <div className="flex justify-between"><span>HP termination (Form 35)</span><span>{inr(HP_TERMINATION_FEE)}</span></div>}
                  <div className="flex justify-between border-t pt-1 font-bold">
                    <span>Total</span><span>{inr(TRANSFER_FEE + (hpPending ? HP_TERMINATION_FEE : 0))}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    addPayment({
                      purpose: `Ownership transfer${hpPending ? " + HP termination" : ""}`,
                      regNo: vehicle.regNo,
                      amount: TRANSFER_FEE + (hpPending ? HP_TERMINATION_FEE : 0),
                    });
                    setStage(4);
                  }}
                >
                  Pay (mock gateway)
                </Button>
              </>
            )}

            {stage === 4 && (
              <>
                <p className="text-sm">
                  Seller e-signs Form 29 with OTP. <MockTag label="MOCK e-SIGN" /> Demo OTP:{" "}
                  <span className="font-mono font-bold">{DEMO_OTP}</span>
                </p>
                <Input inputMode="numeric" maxLength={6} placeholder="e-sign OTP" value={sellerOtp} onChange={(e) => setSellerOtp(e.target.value.replace(/\D/g, ""))} />
                <Button className="w-full" disabled={sellerOtp !== DEMO_OTP} onClick={() => setStage(5)}>
                  e-Sign & continue
                </Button>
              </>
            )}

            {stage === 5 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Buyer verification visit at {vehicle.rto}. Pick a date — no separate slot portal, no captcha to view availability.
                </p>
                <Input type="date" min="2026-08-29" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
                <Button className="w-full" disabled={!slotDate} onClick={() => setStage(6)}>
                  Book slot
                </Button>
              </>
            )}

            {stage === 6 && (
              <>
                <p className="text-sm">Everything is in. Submit the application to the RTO queue.</p>
                <Button className="w-full" onClick={finish}>Submit application</Button>
              </>
            )}

            {stage === 7 && appId && (
              <div className="space-y-3 text-center">
                <p className="text-4xl">🎉</p>
                <p className="font-semibold">Application submitted</p>
                <p className="font-mono text-lg">{appId}</p>
                <p className="text-sm text-muted-foreground">
                  RTO visit on {slotDate}, 11:30 AM at {vehicle.rto}. Track it anytime — it&apos;s in your garage, not lost behind a lookup form.
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" nativeButton={false} render={<Link href="/status" />}>Track status</Button>
                  <Button nativeButton={false} render={<Link href="/garage" />}>My Garage</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
