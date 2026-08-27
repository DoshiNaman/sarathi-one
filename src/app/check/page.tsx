"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { findVehicle, REPORT_FEE, DEMO_OTP } from "@/lib/data";
import type { Vehicle } from "@/lib/types";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MockTag } from "@/components/stage-tracker";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

export default function CheckPage() {
  const t = useT();
  const router = useRouter();
  const { mobile, unlockedReports, unlockReport, addPayment } = useApp();
  const [regNo, setRegNo] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [notFound, setNotFound] = useState(false);
  // unlock flow state: idle -> paying -> consent -> done(redirect)
  const [step, setStep] = useState<"idle" | "paying" | "consent">("idle");
  const [consentOtp, setConsentOtp] = useState("");

  // Reads through the API so the citizen sees what the admin panel last saved,
  // falling back to the local synthetic record if the database is unreachable.
  async function search() {
    setStep("idle");
    const local = findVehicle(regNo);
    try {
      const res = await fetch(`/api/vehicles/${encodeURIComponent(regNo)}`);
      if (res.ok) {
        const d = await res.json();
        setVehicle(d.vehicle);
        setNotFound(false);
        return;
      }
    } catch {
      // fall through to the local record
    }
    setVehicle(local ?? null);
    setNotFound(!local);
  }

  const unlocked = vehicle && unlockedReports.includes(vehicle.regNo);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{t("checkVehicle")}</h1>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <Input
          placeholder={t("regNoPlaceholder")}
          value={regNo}
          className="font-mono uppercase"
          onChange={(e) => setRegNo(e.target.value.toUpperCase())}
        />
        <Button type="submit" data-testid="search">🔍</Button>
      </form>
      <p className="text-xs text-muted-foreground">
        {t("demoFleet")}: GJ01AB1234 · GJ05CD5678 · GJ06EF9012 · GJ18GH3456 · GJ03JK7890 · GJ12MN2468 · GJ27PQ1357 · GJ04RS8642
      </p>

      {notFound && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            {t("noVehicle")} <span className="font-mono">{regNo}</span>
          </CardContent>
        </Card>
      )}

      {vehicle && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono">{vehicle.regNo}</CardTitle>
              <Badge variant={vehicle.status === "ACTIVE" ? "secondary" : "destructive"}>{vehicle.status}</Badge>
            </div>
            <CardDescription>{t("freeSummary")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Row k="Maker / model" v={`${vehicle.maker} ${vehicle.model}`} />
            <Row k="Owner" v={vehicle.owners[vehicle.owners.length - 1].maskedName} />
            <Row k="Registering authority" v={vehicle.rto} />
            <Row k="Class / fuel / emission" v={`${vehicle.vehicleClass} · ${vehicle.fuel} · ${vehicle.emission}`} />
            <Row k="Registration date" v={vehicle.regDate} />
            <Row k="Hypothecated" v={vehicle.hypothecation.active ? "YES" : "NO"} />
            <Row k="Insurance valid till" v={vehicle.insurance.validTill} />
            <Row k="PUC valid till" v={vehicle.puc.validTill} />

            <div className="mt-4 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              {t("officialLimit")}
            </div>

            <div className="mt-4">
              {unlocked ? (
                <Button className="w-full" nativeButton={false} render={<Link href={`/report/${vehicle.regNo}`} />}>
                  {t("openReport")} →
                </Button>
              ) : step === "idle" ? (
                <Button
                  className="w-full"
                  data-testid="unlock"
                  onClick={() => (mobile ? setStep("paying") : router.push("/login"))}
                >
                  {t("unlockReport")} — ₹{REPORT_FEE}
                </Button>
              ) : step === "paying" ? (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="text-sm font-medium">
                    Pay ₹{REPORT_FEE} <MockTag label="MOCK PAYMENT" />
                  </p>
                  <p className="text-xs text-muted-foreground">{t("payMock")}</p>
                  <Button className="w-full" data-testid="pay" onClick={() => setStep("consent")}>
                    Pay ₹{REPORT_FEE} (mock)
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 rounded-md border p-3">
                  <p className="text-sm font-medium">
                    {t("sellerConsent")} <MockTag label="MOCK CONSENT OTP" />
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("consentExplain")} {t("demoOtpIs")}: <span className="font-mono font-bold">{DEMO_OTP}</span>
                  </p>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder={t("sellerConsent")}
                    data-testid="consent-otp"
                    value={consentOtp}
                    onChange={(e) => setConsentOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <Button
                    className="w-full"
                    data-testid="unlock-confirm"
                    disabled={consentOtp !== DEMO_OTP}
                    onClick={() => {
                      // Charge and unlock together: abandoning the consent step
                      // must never leave a receipt for a report you cannot open.
                      addPayment({ purpose: "Trust Report", regNo: vehicle.regNo, amount: REPORT_FEE });
                      unlockReport(vehicle.regNo);
                      router.push(`/report/${vehicle.regNo}`);
                    }}
                  >
                    {t("unlockNow")}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
