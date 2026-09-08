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
import Link from "next/link";
import { MockTag } from "@/components/stage-tracker";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check page — the route chunk keeps `ogl` off every other page.
import WavesBg from "@/components/waves-bg";

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
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the form. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <div className="mx-auto max-w-md px-5 py-14">
        <Card className="liquid-glass ring-0">
          <CardHeader>
            <CardTitle className="font-display text-2xl">{t("login")}</CardTitle>
            <CardDescription>{t("loginBlurb")}</CardDescription>
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
              <Button
                className="w-full"
                variant="pop"
                disabled={!validMobile}
                onClick={() => setOtpSent(true)}
              >
                {t("sendOtp")}
              </Button>
            ) : (
              <>
                <div className="bg-muted rounded-md p-3 text-sm">
                  <MockTag label={t("mockOtp")} /> {t("noSmsSent")}{" "}
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
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button
                  className="w-full"
                  variant="pop"
                  disabled={otp.length !== 6}
                  onClick={() => {
                    if (otp === DEMO_OTP) {
                      login(mobile);
                      router.push("/garage");
                    } else {
                      setError(t("wrongOtp"));
                    }
                  }}
                >
                  {t("verify")}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-muted-foreground mt-5 text-center text-xs">
          {t("managingDemoData")}{" "}
          <Link href="/admin/login" className="text-foreground underline underline-offset-4">
            {t("staffSignIn")}
          </Link>
        </p>
      </div>
    </>
  );
}
