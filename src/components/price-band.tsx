"use client";
import { useState } from "react";
import { inr } from "@/lib/data";
import { buildPriceBand, judgeAsking, scaleDomain, type PriceChannel } from "@/lib/price-band";
import type { Vehicle } from "@/lib/types";
import { useT, type TKey } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MockTag } from "@/components/stage-tracker";

const LABELS = {
  INSURANCE: { title: "channelInsurance", note: "channelInsuranceNote" },
  DEALER: { title: "channelDealer", note: "channelDealerNote" },
  PRIVATE: { title: "channelPrivate", note: "channelPrivateNote" },
  RETAIL: { title: "channelRetail", note: "channelRetailNote" },
} satisfies Record<PriceChannel, { title: TKey; note: TKey }>;

const TONE = {
  good: { text: "text-success", bg: "bg-success", raw: "var(--success)" },
  fair: { text: "text-info", bg: "bg-info", raw: "var(--info)" },
  high: { text: "text-warning", bg: "bg-warning", raw: "var(--warning)" },
} as const;

// Each band gets the tone of what landing there means for the buyer: cheap,
// normal, expensive. So the strip reads as one gradient of "how good is this
// price for me", and the marker's colour matches the band it falls in.
// The scale only plots the three sale channels. Insurance value answers a
// different question and putting it on the same axis invites a comparison that
// does not mean anything.
const SEGMENT = {
  DEALER: "bg-success/35",
  PRIVATE: "bg-info/35",
  RETAIL: "bg-warning/35",
} satisfies Record<"DEALER" | "PRIVATE" | "RETAIL", string>;

export function PriceBand({
  vehicle,
  consented,
  compact = false,
  collapsible = false,
}: {
  vehicle: Vehicle;
  consented: boolean;
  /** Column-width variant: the reasoning folds away so three cards fit a screen. */
  compact?: boolean;
  /** Collapse the whole card behind a summary, off by default. */
  collapsible?: boolean;
}) {
  const t = useT();
  const locale = useApp((s) => s.locale);
  const [asking, setAsking] = useState("");

  const band = buildPriceBand(vehicle, consented);
  const askingNum = Number(asking.replace(/[^\d]/g, ""));
  const verdict = judgeAsking(band, askingNum);

  // The scale stretches to include the asking price. Clamping it to the bands
  // instead would pin an absurd price to the edge, where it reads as "just
  // above retail" rather than "far off the chart".
  const base = scaleDomain(band);
  // A little slack past whichever end the asking price stretches, so the marker
  // never lands flush on the edge where it reads as a border rather than a mark.
  const domain = (() => {
    if (!base) return null;
    if (!verdict) return base;
    const pad = (base.hi - base.lo) * 0.06;
    return {
      lo: Math.min(base.lo, askingNum - pad),
      hi: Math.max(base.hi, askingNum + pad),
    };
  })();
  const pos = (n: number) =>
    domain && domain.hi > domain.lo ? ((n - domain.lo) / (domain.hi - domain.lo)) * 100 : 0;

  // Reaches half again beyond the band at both ends, so "suspiciously cheap"
  // and "walk away" are both draggable rather than only typeable.
  const track = base
    ? { lo: Math.round(base.lo * 0.5), hi: Math.round(base.hi * 1.5), mid: Math.round(base.lo) }
    : { lo: 0, hi: 100, mid: 0 };

  // One body, two frames. The card is either a titled panel or a disclosure; the
  // contents are identical either way, and they used to be written out twice.
  const body = (
    <>
      {/* The chart is the control.
  
                The scale used to be a 40px decoration with the real answer written
                underneath as a sentence, and a separate slider under that — three
                things saying one thing. Now the price bands are the track and the
                asking price is a marker you drag along them, so the question and
                the evidence occupy the same object.
  
                The field stays because a buyer knows the exact number and is
                transcribing it, and because the most useful verdict is for a price
                outside the band — which a marker capped to the chart could not
                reach on its own. */}
      {domain && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="asking" className="text-muted-foreground text-xs">
              {t("askingLabel")}
            </Label>
            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-lg">
                ₹
              </span>
              <Input
                id="asking"
                className="h-11 w-full pl-7 font-mono text-lg tracking-wide tabular-nums"
                inputMode="numeric"
                data-testid="asking-price"
                placeholder="5,20,000"
                // Grouped the Indian way as you type. This field is now the
                // only place the number is shown, so a raw 521635 would make
                // the reader count digits to check what they entered.
                value={askingNum ? askingNum.toLocaleString("en-IN") : asking}
                onChange={(e) => setAsking(e.target.value.replace(/[^\d]/g, ""))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="relative h-2">
              <div className="bg-muted absolute inset-0 overflow-hidden rounded-lg">
                {(["DEALER", "PRIVATE", "RETAIL"] as const).map((channel) => {
                  const b = band.rows.find((r) => r.channel === channel)?.band;
                  if (!b) return null;
                  return (
                    <div
                      key={channel}
                      className={`absolute inset-y-0 ${SEGMENT[channel]}`}
                      style={{ left: `${pos(b.min)}%`, width: `${pos(b.max) - pos(b.min)}%` }}
                    />
                  );
                })}
              </div>
              <input
                type="range"
                aria-label={t("askingLabel")}
                min={track.lo}
                max={track.hi}
                step={5000}
                value={askingNum || track.mid}
                onChange={(e) => setAsking(e.target.value)}
                // SAFETY: CSSProperties carries no index signature for custom
                // properties. `--scrub` is only ever read back by the
                // .price-scrubber rule in globals.css.
                style={
                  {
                    "--scrub": verdict ? TONE[verdict.tone].raw : "var(--muted-foreground)",
                  } as React.CSSProperties
                }
                className="price-scrubber absolute inset-0 h-2 w-full"
              />
            </div>
            <div className="text-muted-foreground flex justify-between text-[11px]">
              <span className="text-success">{t("scaleLow")}</span>
              <span className="text-info">{t("channelPrivate")}</span>
              <span className="text-warning">{t("scaleHigh")}</span>
            </div>
          </div>

          {verdict ? (
            <p className={`flex gap-2 text-xs leading-snug ${TONE[verdict.tone].text}`}>
              <span
                aria-hidden
                className={`mt-1.5 size-1.5 shrink-0 rounded-full ${TONE[verdict.tone].bg}`}
              />
              <span className="font-medium">{verdict.text[locale]}</span>
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">{t("askingHint")}</p>
          )}
        </div>
      )}

      {/* Evidence, not headline. The chart above answered the question; these
                are the numbers behind it, so they get a heading and a quieter
                treatment rather than competing for the same attention. */}
      <div className="space-y-1.5">
        {compact && (
          <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
            {t("priceBandSub")}
          </p>
        )}
        <div data-reveal-scope className="divide-y">
          {band.rows.map((row) => (
            <div
              key={row.channel}
              data-reveal
              // No wrapping in a column. The label had a 160px floor and the
              // range never breaks, so together they overflowed and the price
              // dropped to its own line. The label shrinks instead.
              className={`flex items-baseline justify-between gap-x-3 ${
                compact ? "py-2" : "py-3"
              } ${row.channel === "PRIVATE" ? "font-medium" : ""}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t(LABELS[row.channel].title)}</p>
                {/* The scale above already labels dealer / private / retail, so
                          in a column the explanations are a second telling. */}
                {!compact && (
                  <p className="text-muted-foreground text-xs font-normal">
                    {t(LABELS[row.channel].note)}
                  </p>
                )}
              </div>
              {row.band ? (
                <p
                  className={`shrink-0 text-right font-mono whitespace-nowrap tabular-nums ${
                    compact ? "text-xs" : "text-sm"
                  }`}
                >
                  {inr(row.band.min)} – {inr(row.band.max)}
                </p>
              ) : (
                // A blank insurance row has two different causes and they must
                // not read the same: the car is past the official schedule, or
                // this record simply carries no ex-showroom price to work from.
                <p className="text-muted-foreground max-w-[8.5rem] shrink-0 text-right text-xs">
                  {row.channel === "INSURANCE" && band.pastOfficialSchedule
                    ? t("idvNoSchedule")
                    : t("idvNoAnchor")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stays visible. The missing official number is the point of the
                screen, not a disclaimer to be folded away — except in a column,
                where the whole card has to fit beside two others. */}
      {band.pastOfficialSchedule && !compact && (
        <p className="border-warning/50 text-muted-foreground border-l-2 pl-3 text-xs">
          {t("idvNoScheduleWhy")}
        </p>
      )}

      <div className="text-xs">
        <p className="font-medium">{consented ? t("priceBandNarrow") : t("priceBandWide")}</p>
        {band.reasons.length > 0 && (
          <ul className="text-muted-foreground mt-1 space-y-1">
            {band.reasons.map((r) => (
              <li key={r.en}>· {r[locale]}</li>
            ))}
          </ul>
        )}
        {!consented && !compact && (
          <p className="text-muted-foreground mt-1">{t("priceBandUnlockHint")}</p>
        )}
      </div>

      {/* Folded away by default. It has to be here and it has to be readable,
                but it should not be the tallest thing on a phone screen. */}
      <details className="rounded-md border border-dashed">
        <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
          {t("showWorking")}
        </summary>
        <div className="text-muted-foreground space-y-2 px-3 pb-3 text-xs">
          {compact && band.pastOfficialSchedule && <p>{t("idvNoScheduleWhy")}</p>}
          <p>{t("priceBandHonesty")}</p>
          <p>{t("priceBandSpreads")}</p>
        </div>
      </details>
    </>
  );

  return (
    <Card
      className={
        collapsible
          ? "liquid-glass rounded-2xl"
          : compact
            ? "liquid-glass flex min-h-0 flex-col rounded-2xl"
            : undefined
      }
    >
      {collapsible ? (
        <details className="group" open={false}>
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-0 [&::-webkit-details-marker]:hidden">
            <ChevronRight
              aria-hidden
              className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-90"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-base font-medium">{t("priceBandTitle")}</span>
                <MockTag label="ESTIMATE" />
              </span>
              <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                {t("priceBandSub")}
              </span>
            </span>
            <span className="text-muted-foreground shrink-0 text-xs group-open:hidden">
              {t("priceBandToggle")}
            </span>
            <span className="text-muted-foreground hidden shrink-0 text-xs group-open:inline">
              {t("priceBandHide")}
            </span>
          </summary>
          <div className="mt-2 space-y-5 border-t px-4 py-4">{body}</div>
        </details>
      ) : (
        <>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{t("priceBandTitle")}</CardTitle>
              <MockTag label="ESTIMATE" />
            </div>
            {!compact && <CardDescription>{t("priceBandSub")}</CardDescription>}
          </CardHeader>

          {/* Scrolls inside the card rather than resizing it. Opening the working
              used to push the row taller, then snap back on close. */}
          <CardContent
            className={compact ? "min-h-0 flex-1 space-y-3.5 overflow-y-auto" : "space-y-5"}
          >
            {body}
          </CardContent>
        </>
      )}
    </Card>
  );
}
