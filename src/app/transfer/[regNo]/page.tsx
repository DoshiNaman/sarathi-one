"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TRANSFER_STAGES, TRANSFER_FEE, HP_TERMINATION_FEE, DEMO_OTP, inr } from "@/lib/data";
import { useVehicle } from "@/lib/use-vehicle";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { StageTracker, MockTag } from "@/components/stage-tracker";
import { AuthGate } from "@/components/auth-gate";
import { AlertTriangle, CheckCircle2, FileText, PartyPopper, ShieldCheck } from "lucide-react";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check page — the route chunk keeps `ogl` off every other page.
import WavesBg from "@/components/waves-bg";

const LAST_STAGE = TRANSFER_STAGES.length - 1; // "RC transfer approved", pending at the RTO
const DONE = TRANSFER_STAGES.length; // wizard finished; application handed over

export default function TransferPage() {
  const t = useT();

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the wizard. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <AuthGate message={t("loginForTransfer")}>
        <TransferContent />
      </AuthGate>
    </>
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

  if (!vehicle)
    return <p className="text-muted-foreground py-10 text-center">{t("unknownVehicle")}</p>;
  if (vehicle.status !== "ACTIVE")
    return (
      <div className="mx-auto max-w-md px-5 py-10">
        <Alert variant="danger">
          <AlertTriangle />
          <AlertTitle>{vehicle.status}</AlertTitle>
          <AlertDescription>{t("cannotTransfer")}</AlertDescription>
        </Alert>
      </div>
    );

  const hpPending = vehicle.hypothecation.active;
  // The two the registry already holds arrive on their own; the rest are pulled
  // from DigiLocker, which is where a citizen's issued documents actually live.
  const requiredDocs: { name: string; auto?: boolean }[] = [
    { name: "RC", auto: true },
    { name: "Insurance", auto: true },
    { name: "Seller ID proof (Aadhaar)" },
    { name: "Buyer ID proof (Aadhaar)" },
    { name: "Buyer address proof" },
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
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl leading-tight">
          {t("transferTitle")} · <span className="font-mono">{vehicle.regNo}</span>
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{t("transferIntro")}</p>
      </div>

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
          <CardContent className="flex flex-col gap-4">
            {stage === 0 && (
              <>
                <Field data-disabled>
                  <FieldLabel htmlFor="seller">{t("seller")}</FieldLabel>
                  <Input
                    id="seller"
                    disabled
                    value={`${vehicle.owners[vehicle.owners.length - 1].name} (RC holder, logged in)`}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bn">{t("buyerName")}</FieldLabel>
                  <Input id="bn" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bm">{t("buyerMobile")}</FieldLabel>
                  <Input
                    id="bm"
                    inputMode="numeric"
                    maxLength={10}
                    value={buyerMobile}
                    onChange={(e) => setBuyerMobile(e.target.value.replace(/\D/g, ""))}
                  />
                </Field>
                <Button
                  className="w-full"
                  variant="pop"
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
                  <Alert variant="warning">
                    <AlertTriangle />
                    <AlertTitle>
                      {t("activeLoanLabel")}: {vehicle.hypothecation.financier}
                    </AlertTitle>
                    <AlertDescription className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                      {t("form35Body")} (+{inr(HP_TERMINATION_FEE)}){" "}
                      <MockTag label={t("mockBankNoc")} />
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="success">
                    <CheckCircle2 />
                    <AlertDescription>{t("noHypo")}</AlertDescription>
                  </Alert>
                )}
                <Button className="w-full" variant="pop" onClick={() => setStage(2)}>
                  {hpPending ? t("bundleForm35") : t("continueBtn")}
                </Button>
              </>
            )}

            {stage === 2 && (
              <>
                <Alert>
                  <ShieldCheck />
                  <AlertTitle className="flex flex-wrap items-center gap-2">
                    {t("digilocker")} <MockTag label={t("mockDigiLocker")} />
                  </AlertTitle>
                  <AlertDescription>{t("digiLockerIntro")}</AlertDescription>
                </Alert>
                <div className="flex flex-col gap-2">
                  {requiredDocs.map((d) => {
                    const done = d.auto || docs.includes(d.name);
                    return (
                      <Item key={d.name} variant="outline">
                        <ItemMedia variant="icon">
                          {done ? <CheckCircle2 className="text-success" /> : <FileText />}
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{d.name}</ItemTitle>
                          <ItemDescription>
                            {d.auto ? t("autoFetched") : t("digilocker")}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          {done ? (
                            <span className="text-muted-foreground text-xs">
                              {t("fetchedLabel")}
                            </span>
                          ) : (
                            <Button
                              size="xs"
                              variant="outline"
                              data-testid="upload"
                              onClick={() => setDocs((x) => [...x, d.name])}
                            >
                              {t("fetchFromDigiLocker")}
                            </Button>
                          )}
                        </ItemActions>
                      </Item>
                    );
                  })}
                </div>
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
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{t("transferFee")}</span>
                    <span className="font-mono tabular-nums">{inr(TRANSFER_FEE)}</span>
                  </div>
                  {hpPending && (
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{t("hpTermination")}</span>
                      <span className="font-mono tabular-nums">{inr(HP_TERMINATION_FEE)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between gap-4 font-medium">
                    <span>{t("total")}</span>
                    <span className="font-mono text-base tabular-nums">
                      {inr(TRANSFER_FEE + (hpPending ? HP_TERMINATION_FEE : 0))}
                    </span>
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
                <Field>
                  <FieldLabel htmlFor="esign" className="gap-2">
                    {t("esignBtn")} <MockTag label={t("mockEsign")} />
                  </FieldLabel>
                  <Input
                    id="esign"
                    inputMode="numeric"
                    maxLength={6}
                    data-testid="esign-otp"
                    className="font-mono tracking-[0.3em]"
                    placeholder="••••••"
                    value={sellerOtp}
                    onChange={(e) => setSellerOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <FieldDescription>
                    {t("esignNote")} {t("demoOtpIs")}:{" "}
                    <span className="text-foreground font-mono font-medium">{DEMO_OTP}</span>
                  </FieldDescription>
                </Field>
                <Button
                  className="w-full"
                  variant="pop"
                  disabled={sellerOtp !== DEMO_OTP}
                  onClick={() => setStage(5)}
                >
                  {t("esignBtn")}
                </Button>
              </>
            )}

            {stage === 5 && (
              <>
                <Field>
                  <FieldLabel htmlFor="slot">{t("bookSlot")}</FieldLabel>
                  <Input
                    id="slot"
                    type="date"
                    min="2026-08-29"
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                  />
                  <FieldDescription>
                    {t("slotNote")} ({vehicle.rto})
                  </FieldDescription>
                </Field>
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
                <p className="text-sm leading-relaxed">{t("everythingIsIn")}</p>
                <Button className="w-full" variant="pop" onClick={finish}>
                  {t("submitApp")}
                </Button>
              </>
            )}

            {stage === DONE && appId && (
              <Empty>
                <EmptyMedia variant="icon" className="text-success">
                  <PartyPopper />
                </EmptyMedia>
                <EmptyTitle>{t("submitted")}</EmptyTitle>
                {/* The application number stays a p.font-mono: the demo-path
                    smoke test reads it straight off the page. */}
                <p className="font-mono text-lg">{appId}</p>
                <EmptyDescription>
                  {t("rtoVisitOn")} {slotDate}, 11:30 AM · {vehicle.rto}. {t("trackFromGarage")}
                </EmptyDescription>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" nativeButton={false} render={<Link href="/status" />}>
                    {t("trackIt")}
                  </Button>
                  <Button variant="pop" nativeButton={false} render={<Link href="/garage" />}>
                    {t("myGarage")}
                  </Button>
                </div>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
