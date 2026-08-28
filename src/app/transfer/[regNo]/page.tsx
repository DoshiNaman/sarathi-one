"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TRANSFER_STAGES, TRANSFER_FEE, HP_TERMINATION_FEE, DEMO_OTP, inr } from "@/lib/data";
import { useVehicle } from "@/lib/use-vehicle";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StageTracker, MockTag } from "@/components/stage-tracker";
import { AuthGate } from "@/components/auth-gate";
import { CheckCircle2, AlertTriangle, Paperclip, PartyPopper } from "lucide-react";

const LAST_STAGE = TRANSFER_STAGES.length - 1; // "RC transfer approved", pending at the RTO
const DONE = TRANSFER_STAGES.length; // wizard finished; application handed over

export default function TransferPage() {
  return (
    <AuthGate message="Login required for the transfer journey.">
      <TransferContent />
    </AuthGate>
  );
}

function TransferContent() {
  const t = useT();
  const { regNo } = useParams<{ regNo: string }>();
  const { vehicle } = useVehicle(regNo);
  const addPayment = useApp((s) => s.addPayment);
  const addApplication = useApp((s) => s.addApplication);

  const [stage, setStage] = useState(0);
  const [buyerName, setBuyerName] = useState("");
  const [buyerMobile, setBuyerMobile] = useState("");
  const [sellerOtp, setSellerOtp] = useState("");
  const [docs, setDocs] = useState<string[]>([]);
  const [slotDate, setSlotDate] = useState("");
  const [appId, setAppId] = useState<string | null>(null);

  if (!vehicle) return <p className="text-muted-foreground py-10 text-center">Unknown vehicle.</p>;
  if (vehicle.status !== "ACTIVE")
    return (
      <p className="text-destructive py-10 text-center">
        A {vehicle.status.toLowerCase()} vehicle cannot be transferred.
      </p>
    );

  const hpPending = vehicle.hypothecation.active;
  const requiredDocs = [
    "RC (auto-fetched)",
    "Insurance (auto-fetched)",
    "Seller ID proof",
    "Buyer ID proof",
    "Buyer address proof",
  ];

  function finish() {
    const app = addApplication({
      type: "TRANSFER_OF_OWNERSHIP",
      regNo: vehicle!.regNo,
      stages: TRANSFER_STAGES,
      currentStage: LAST_STAGE,
      slot: { rto: vehicle!.rto, date: slotDate, time: "11:30 AM" },
    });
    setAppId(app.id);
    setStage(DONE);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 py-10">
      <h1 className="font-display text-3xl">
        Transfer of ownership · <span className="font-mono">{vehicle.regNo}</span>
      </h1>
      <p className="text-muted-foreground text-sm">{t("transferIntro")}</p>

      <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm">{t("progress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <StageTracker stages={TRANSFER_STAGES} current={stage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {stage < DONE ? TRANSFER_STAGES[stage] : "Done"}
            </CardTitle>
            {stage === 0 && <CardDescription>{t("formsCombined")}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {stage === 0 && (
              <>
                <div className="space-y-2">
                  <Label>{t("seller")}</Label>
                  <Input
                    disabled
                    value={`${vehicle.owners[vehicle.owners.length - 1].name} (RC holder, logged in)`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bn">{t("buyerName")}</Label>
                  <Input id="bn" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bm">{t("buyerMobile")}</Label>
                  <Input
                    id="bm"
                    inputMode="numeric"
                    maxLength={10}
                    value={buyerMobile}
                    onChange={(e) => setBuyerMobile(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={buyerName.length < 3 || !/^[6-9]\d{9}$/.test(buyerMobile)}
                  onClick={() => setStage(1)}
                >
                  {t("continueBtn")}
                </Button>
              </>
            )}

            {stage === 1 && (
              <>
                {hpPending ? (
                  <div className="border-warning/40 bg-warning-muted rounded-md border p-3 text-sm">
                    <p className="font-semibold">
                      <AlertTriangle aria-hidden className="inline size-4" /> Active loan:{" "}
                      {vehicle.hypothecation.financier}
                    </p>
                    <p className="mt-1">
                      Form 35 must be filed with the financier&apos;s NOC before transfer. We bundle
                      it into this application (+{inr(HP_TERMINATION_FEE)}).{" "}
                      <MockTag label="MOCK BANK NOC" />
                    </p>
                  </div>
                ) : (
                  <p className="text-success text-sm">
                    <CheckCircle2 aria-hidden className="inline size-4" /> {t("noHypo")}
                  </p>
                )}
                <Button className="w-full" variant="pop" onClick={() => setStage(2)}>
                  {hpPending ? t("bundleForm35") : t("continueBtn")}
                </Button>
              </>
            )}

            {stage === 2 && (
              <>
                <p className="text-muted-foreground text-sm">
                  {t("docsIntro")} <MockTag label="MOCK UPLOAD" />
                </p>
                {requiredDocs.map((d) => {
                  const auto = d.includes("auto");
                  const done = auto || docs.includes(d);
                  return (
                    <div
                      key={d}
                      className="flex items-center justify-between rounded border p-2 text-sm"
                    >
                      <span>
                        {done ? (
                          <CheckCircle2 aria-hidden className="text-success inline size-4" />
                        ) : (
                          <Paperclip aria-hidden className="text-muted-foreground inline size-4" />
                        )}{" "}
                        {d}
                      </span>
                      {!auto && !done && (
                        <Button
                          size="xs"
                          variant="outline"
                          data-testid="upload"
                          onClick={() => setDocs((x) => [...x, d])}
                        >
                          {t("upload")}
                        </Button>
                      )}
                    </div>
                  );
                })}
                <Button
                  className="w-full"
                  variant="pop"
                  disabled={docs.length < 3}
                  onClick={() => setStage(3)}
                >
                  {t("continueBtn")}
                </Button>
              </>
            )}

            {stage === 3 && (
              <>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Transfer of ownership fee</span>
                    <span>{inr(TRANSFER_FEE)}</span>
                  </div>
                  {hpPending && (
                    <div className="flex justify-between">
                      <span>HP termination (Form 35)</span>
                      <span>{inr(HP_TERMINATION_FEE)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-1 font-bold">
                    <span>{t("total")}</span>
                    <span>{inr(TRANSFER_FEE + (hpPending ? HP_TERMINATION_FEE : 0))}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  variant="pop"
                  onClick={() => {
                    addPayment({
                      purpose: `Ownership transfer${hpPending ? " + HP termination" : ""}`,
                      regNo: vehicle.regNo,
                      amount: TRANSFER_FEE + (hpPending ? HP_TERMINATION_FEE : 0),
                    });
                    setStage(4);
                  }}
                >
                  {t("payNow")}
                </Button>
              </>
            )}

            {stage === 4 && (
              <>
                <p className="text-sm">
                  {t("esignNote")} <MockTag label="MOCK e-SIGN" /> {t("demoOtpIs")}:{" "}
                  <span className="font-mono font-bold">{DEMO_OTP}</span>
                </p>
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  data-testid="esign-otp"
                  placeholder="OTP"
                  value={sellerOtp}
                  onChange={(e) => setSellerOtp(e.target.value.replace(/\D/g, ""))}
                />
                <Button
                  className="w-full"
                  disabled={sellerOtp !== DEMO_OTP}
                  onClick={() => setStage(5)}
                >
                  {t("esignBtn")}
                </Button>
              </>
            )}

            {stage === 5 && (
              <>
                <p className="text-muted-foreground text-sm">
                  {t("slotNote")} ({vehicle.rto})
                </p>
                <Input
                  type="date"
                  min="2026-08-29"
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                />
                <Button
                  className="w-full"
                  variant="pop"
                  disabled={!slotDate}
                  onClick={() => setStage(6)}
                >
                  {t("bookSlot")}
                </Button>
              </>
            )}

            {stage === LAST_STAGE && (
              <>
                <p className="text-sm">
                  Everything is in. Submit the application to the RTO queue.
                </p>
                <Button className="w-full" variant="pop" onClick={finish}>
                  {t("submitApp")}
                </Button>
              </>
            )}

            {stage === DONE && appId && (
              <div className="space-y-3 text-center">
                <PartyPopper aria-hidden className="text-success mx-auto size-10" />
                <p className="font-semibold">{t("submitted")}</p>
                <p className="font-mono text-lg">{appId}</p>
                <p className="text-muted-foreground text-sm">
                  RTO visit on {slotDate}, 11:30 AM at {vehicle.rto}. Track it anytime — it&apos;s
                  in your garage, not lost behind a lookup form.
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" nativeButton={false} render={<Link href="/status" />}>
                    {t("trackIt")}
                  </Button>
                  <Button nativeButton={false} render={<Link href="/garage" />}>
                    My Garage
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
