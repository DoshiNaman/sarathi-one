"use client";
import { useState } from "react";
import { MapPin, Ban, AlertTriangle, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { STATES, stateOf, stateName, checkTransfer, type TransferGrade } from "@/lib/interstate";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/store";
import { useT, type TKey } from "@/lib/i18n";

/**
 * Three channels per grade — a word, an icon and an Alert variant — so the
 * verdict survives a colour-blind reader and a greyscale screenshot.
 */
const GRADE = {
  FINE: { label: "gradeFine", Icon: MapPin, variant: "success" },
  UNKNOWN: { label: "gradeUnknown", Icon: HelpCircle, variant: "default" },
  CHECK_RTO: { label: "gradeCheckRto", Icon: AlertTriangle, variant: "warning" },
  RESTRICTED: { label: "gradeRestricted", Icon: Ban, variant: "danger" },
} satisfies Record<
  TransferGrade,
  { label: TKey; Icon: typeof MapPin; variant: "success" | "warning" | "danger" | "default" }
>;

/**
 * "Where can this car actually go?" — asked in a dialog, on the way to the
 * Trust Report.
 *
 * It is modal on purpose. A rule that stops a car being re-registered where the
 * buyer lives is exactly what modality exists for: information they must receive,
 * and act on, before money moves. As a section further down the page it was
 * scrolled past by anyone heading for the button.
 *
 * Composed from the design system rather than styled by hand: Dialog for the
 * frame, Field for the question, Alert for the verdict, Collapsible for the rule
 * numbers behind it. Nothing here needs to be a bespoke box.
 */
export function TransferGate({
  vehicle,
  open,
  onOpenChange,
  onConfirm,
  confirmLabel,
}: {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  const t = useT();
  const locale = useApp((s) => s.locale);
  const homeState = useApp((s) => s.homeState);
  const setHomeState = useApp((s) => s.setHomeState);

  // What was acknowledged, not merely that something was: a tick belongs to the
  // warning that was on screen when it was ticked, so it is stored against that
  // destination. Change the destination and it stops matching.
  const [acked, setAcked] = useState<string | null>(null);
  const [whyOpen, setWhyOpen] = useState(false);

  const result = homeState ? checkTransfer(vehicle, homeState) : null;
  const mustAck =
    result !== null && (result.grade === "CHECK_RTO" || result.grade === "RESTRICTED");
  const ack = homeState !== null && acked === homeState;
  const canProceed = result !== null && (!mustAck || ack);
  const grade = result ? GRADE[result.grade] : GRADE.UNKNOWN;
  const origin = stateOf(vehicle.regNo);
  // The library's headline opens with the grade — "Restricted — this car cannot
  // move…" — and that word is the Alert's title. Cut the opening clause so the
  // verdict is not said twice. Headlines with no such clause are untouched.
  const detail = result?.headline[locale].replace(/^[^—.]{0,40}—\s*/, "");

  // Base UI's Select takes its options as data. The leading null is the
  // placeholder row, which is how it renders "nothing chosen yet".
  const items = [
    { label: t("pickState"), value: null },
    ...Object.entries(STATES)
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([value, label]) => ({ label, value })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("registerWhere")}</DialogTitle>
          <DialogDescription>{t("transferDialogIntro")}</DialogDescription>
        </DialogHeader>

        {/* Scrolls between a fixed header and a fixed footer, so the action is
            always reachable however long the reasoning runs. */}
        <div className="no-scrollbar -mx-4 flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-4">
          <Field>
            <FieldLabel htmlFor="home-state">{t("yourState")}</FieldLabel>
            <Select
              items={items}
              value={homeState ?? null}
              onValueChange={(value) => setHomeState(String(value))}
            >
              <SelectTrigger id="home-state" className="w-full" data-testid="home-state">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value ?? "none"} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {!result && <FieldDescription>{t("pickStateFirst")}</FieldDescription>}
          </Field>

          {result && (
            <>
              <Alert variant={grade.variant}>
                <grade.Icon />
                <AlertTitle>
                  {t(grade.label)}
                  {/* The route, but only when it is one. Staying put is not
                      "Delhi → Delhi". */}
                  {origin && !result.sameState && (
                    <span className="text-muted-foreground font-normal">
                      {" · "}
                      {stateName(origin) ?? origin} → {result.destName}
                    </span>
                  )}
                </AlertTitle>
                <AlertDescription>{detail}</AlertDescription>
              </Alert>

              {mustAck && (
                <FieldLabel htmlFor="transfer-ack">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="transfer-ack"
                      data-testid="transfer-ack"
                      checked={ack}
                      onCheckedChange={(checked) => setAcked(checked ? homeState : null)}
                    />
                    <FieldContent>
                      <FieldTitle>{t("transferAck")}</FieldTitle>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              )}

              {/* Controlled, so the chevron follows the panel from state rather
                  than from a CSS selector on an attribute the button owns. */}
              <Collapsible open={whyOpen} onOpenChange={setWhyOpen}>
                <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="-ml-2" />}>
                  {whyOpen ? (
                    <ChevronDown data-icon="inline-start" />
                  ) : (
                    <ChevronRight data-icon="inline-start" />
                  )}
                  {t(result.sameState ? "transferWhySame" : "transferWhy")} ({result.points.length})
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="text-muted-foreground mt-2 flex flex-col gap-3 border-l pl-4 text-xs leading-relaxed">
                    {result.points.map((p) => (
                      <li key={p.text.en}>
                        <span className="text-foreground">{p.text[locale]}</span>
                        {p.source && <span className="mt-1 block font-mono">{p.source}</span>}
                      </li>
                    ))}
                    <li>{t("interstateSourcesNote")}</li>
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" data-testid="transfer-cancel" />}>
            {t("cancelLabel")}
          </DialogClose>
          <Button
            variant="pop"
            data-testid="transfer-confirm"
            disabled={!canProceed}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
