"use client";
import { useMemo } from "react";
import { MapPin, Ban, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { STATES, stateOf, stateName, checkTransfer, type TransferGrade } from "@/lib/interstate";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";

// State codes sorted by name, so the picker reads alphabetically.
const OPTIONS = Object.entries(STATES).sort((a, b) => a[1].localeCompare(b[1]));

const GRADE = {
  FINE: { band: "bg-success", Icon: MapPin },
  UNKNOWN: { band: "bg-muted-foreground", Icon: HelpCircle },
  CHECK_RTO: { band: "bg-warning", Icon: AlertTriangle },
  RESTRICTED: { band: "bg-danger", Icon: Ban },
} satisfies Record<TransferGrade, { band: string; Icon: typeof MapPin }>;

/**
 * "Where can this car actually go?" — the pre-purchase inter-state check. Sits
 * on the check page, visible without unlocking the report: its whole value is
 * warning a buyer BEFORE money changes hands.
 */
export function InterstateCheck({ vehicle }: { vehicle: Vehicle }) {
  const t = useT();
  const locale = useApp((s) => s.locale);
  const homeState = useApp((s) => s.homeState);
  const setHomeState = useApp((s) => s.setHomeState);

  const originState = stateOf(vehicle.regNo);
  const result = useMemo(
    () => (homeState ? checkTransfer(vehicle, homeState) : null),
    [vehicle, homeState]
  );
  const { band, Icon } = result ? GRADE[result.grade] : GRADE.FINE;

  return (
    // A calm, semi-solid card rather than the heavy framing glass used by the
    // panels above — same surface the report's verdict card uses. The full-width
    // liquid-glass version read as too much frost in dark mode, where the glass
    // is a lightening veil and four large panels stacked up.
    <div className="border-border/60 bg-card/80 rounded-2xl border p-5 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl">{t("whereCanItGo")}</h2>
        {originState && (
          <span className="text-muted-foreground text-sm">
            {stateName(originState) ?? originState}{" "}
            <ArrowRight aria-hidden className="inline size-3" />{" "}
            {homeState ? (stateName(homeState) ?? homeState) : "…"}
          </span>
        )}
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{t("interstateIntro")}</p>

      <label className="mt-4 flex flex-col gap-1 text-sm sm:max-w-xs">
        <span className="text-muted-foreground text-xs">{t("registerWhere")}</span>
        <select
          className="border-border/60 bg-card/65 focus-visible:border-pop/50 h-10 rounded-md border px-3 backdrop-blur-md focus-visible:outline-none"
          value={homeState ?? ""}
          onChange={(e) => setHomeState(e.target.value)}
        >
          <option value="" disabled>
            {t("pickState")}
          </option>
          {OPTIONS.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </label>

      {result && (
        <div className="border-border/60 mt-4 overflow-hidden rounded-xl border">
          <div
            className={`${band} text-primary-foreground flex items-center gap-2 px-4 py-2 text-sm font-bold`}
          >
            <Icon aria-hidden className="size-4 shrink-0" />
            {result.grade.replace("_", " ")} — {result.headline[locale]}
          </div>
          <ul className="space-y-2.5 p-4 text-sm">
            {result.points.map((p, i) => (
              <li key={i}>
                <span>{p.text[locale]}</span>
                {p.source && (
                  <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                    {p.source}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground border-border/60 border-t px-4 py-2 text-xs">
            {t("interstateSourcesNote")}
          </p>
        </div>
      )}
    </div>
  );
}
