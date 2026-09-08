"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { DEMO_OTP, REPORT_FEE, inr } from "@/lib/data";
import type { Vehicle } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { MockTag } from "@/components/stage-tracker";
import { useT } from "@/lib/i18n";

/** How long the fake gateway "thinks" for. Long enough to read, short enough to not annoy. */
const SETTLE_MS = 1400;

type Step = "review" | "paying" | "consent";

/**
 * Paying for the Trust Report, and getting the seller's consent — one dialog,
 * because it is one task. Splitting it meant the fee sat in a dialog and the
 * consent OTP appeared back in the card behind it, which loses the thread
 * halfway through a payment.
 *
 * The money is recorded once, at the end, together with the unlock. Abandoning
 * the consent step must never leave a receipt for a report you cannot open —
 * which is why the middle step says "approved", not "paid".
 */
export function UnlockDialog({
  vehicle,
  open,
  onOpenChange,
  onComplete,
}: {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}) {
  const t = useT();
  const [step, setStep] = useState<Step>("review");
  const [otp, setOtp] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the pending gateway on unmount; closing is handled where it happens.
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  // Reopening starts over — a half-finished payment is not somewhere to resume.
  // Done on the close event rather than in an effect watching `open`, so the
  // reset is a consequence of the action instead of a render-time correction.
  function handleOpenChange(next: boolean) {
    if (!next) {
      if (timer.current) clearTimeout(timer.current);
      setStep("review");
      setOtp("");
    }
    onOpenChange(next);
  }

  function pay() {
    setStep("paying");
    timer.current = setTimeout(() => setStep("consent"), SETTLE_MS);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("unlockTitle")}</DialogTitle>
          <DialogDescription>{t("unlockSteps")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* What is being bought, stated once and never restated. */}
          <Item variant="muted">
            <ItemMedia variant="icon">
              <CreditCard />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{t("reportFeeLine")}</ItemTitle>
              <ItemDescription className="font-mono">{vehicle.regNo}</ItemDescription>
            </ItemContent>
            <span className="font-mono text-base font-medium tabular-nums">{inr(REPORT_FEE)}</span>
          </Item>

          {step === "review" && (
            <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <MockTag label={t("mockPayment")} />
              {t("payMock")}
            </p>
          )}

          {step === "paying" && (
            <p
              className="text-muted-foreground flex items-center gap-2 py-6 text-sm"
              role="status"
              data-testid="paying"
            >
              <Spinner />
              {t("payingNow")}
            </p>
          )}

          {step === "consent" && (
            <>
              <Alert variant="success" data-testid="pay-approved">
                <CheckCircle2 />
                <AlertDescription>{t("payApproved")}</AlertDescription>
              </Alert>

              <Field>
                <FieldLabel htmlFor="consent-otp" className="gap-2">
                  <ShieldCheck className="size-4" />
                  {t("otpLabel")}
                  <MockTag label={t("mockConsentOtp")} />
                </FieldLabel>
                <Input
                  id="consent-otp"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  className="font-mono tracking-[0.3em]"
                  placeholder="••••••"
                  data-testid="consent-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
                <FieldDescription>
                  {t("consentExplain")} {t("demoOtpIs")}:{" "}
                  <span className="text-foreground font-mono font-medium">{DEMO_OTP}</span>
                </FieldDescription>
              </Field>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" data-testid="unlock-cancel" />}>
            {t("cancelLabel")}
          </DialogClose>
          {step === "consent" ? (
            <Button
              variant="pop"
              data-testid="unlock-confirm"
              disabled={otp !== DEMO_OTP}
              onClick={onComplete}
            >
              {t("unlockNow")}
            </Button>
          ) : (
            <Button variant="pop" data-testid="pay" disabled={step === "paying"} onClick={pay}>
              {step === "paying" && <Spinner data-icon="inline-start" />}
              {t("payLabel")} {inr(REPORT_FEE)}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
