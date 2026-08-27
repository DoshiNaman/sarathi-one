"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { DEMO_OTP } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MockTag } from "@/components/stage-tracker";

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const login = useApp((s) => s.login);
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const validMobile = /^[6-9]\d{9}$/.test(mobile);

  return (
    <div className="mx-auto max-w-md pt-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("login")}</CardTitle>
          <CardDescription>
            One account for every service — vehicle checks, transfers, licences, payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">{t("mobileNumber")}</Label>
            <Input
              id="mobile"
              inputMode="numeric"
              maxLength={10}
              placeholder="9876543210"
              value={mobile}
              disabled={otpSent}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {!otpSent ? (
            <Button className="w-full" disabled={!validMobile} onClick={() => setOtpSent(true)}>
              {t("sendOtp")}
            </Button>
          ) : (
            <>
              <div className="rounded-md bg-muted p-3 text-sm">
                <MockTag label="MOCK OTP" /> No SMS is sent in this demo. Your OTP is{" "}
                <span className="font-mono font-bold">{DEMO_OTP}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp">{t("enterOtp")}</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                disabled={otp.length !== 6}
                onClick={() => {
                  if (otp === DEMO_OTP) {
                    login(mobile);
                    router.push("/garage");
                  } else {
                    setError("Wrong OTP. The demo OTP is shown above.");
                  }
                }}
              >
                {t("verify")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
