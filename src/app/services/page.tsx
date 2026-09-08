"use client";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Eye,
  GraduationCap,
  Hash,
  IdCard,
  Info,
  Megaphone,
  Recycle,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { SERVICES } from "@/lib/services";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { BorderGlow } from "@/components/border-glow";
import { PageShell } from "@/components/page-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server. Same pattern as
// the check and garage pages — the route chunk keeps `ogl` off every other
// page.
import WavesBg from "@/components/waves-bg";

/**
 * A face per service. Kept here rather than in lib/services.ts: which glyph
 * stands for a permit is a decision about this page, not about the data.
 */
const ICONS = new Map<string, LucideIcon>([
  ["fitness-ats", ClipboardCheck],
  ["permit", Truck],
  ["learner-licence", GraduationCap],
  ["dl-renewal", IdCard],
  ["fancy-number", Hash],
  ["scrapping", Recycle],
  ["grievance", Megaphone],
]);

/**
 * One tile per roadmap service. The Gujarat number sits on the card on purpose:
 * a reviewer should be able to see why each of these is worth building without
 * opening it.
 *
 * The whole card is the link. A "Start" button inside a card that is itself
 * clickable gives you two targets for one destination and a tab stop that goes
 * nowhere new, so the title carries a stretched link and the arrow at the foot
 * is a signpost rather than a second control.
 *
 * Solid surfaces, not the frosted glass the check screen uses. These are seven
 * blocks of text side by side, and frosting them turned a grid of arguments
 * into a grid of pale rectangles. The wave field stays behind as atmosphere.
 */
export default function ServicesPage() {
  const t = useT();
  const locale = useApp((s) => s.locale);

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the list. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <WavesBg />
      </div>
      <PageShell title={t("servicesTitle")} description={t("servicesDesc")} width="wide">
        {/* The glow throws 40px past each card's edge, and an absolutely
            positioned layer still counts toward scroll width — on a narrow
            screen that was 20px of horizontal scroll on a page that has none.
            `clip` rather than `hidden`: it trims the overhang without turning
            this into a scroll container. */}
        <div className="flex flex-col gap-6 overflow-x-clip">
          <Alert variant="warning">
            <Info />
            <AlertDescription>{t("servicesPreview")}</AlertDescription>
          </Alert>

          <div className="grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => {
              const Icon = ICONS.get(s.slug) ?? ClipboardCheck;
              return (
                // The glow replaces [data-glow]'s flat halo: same accent, but it
                // tracks the edge the cursor is nearest instead of lighting the
                // whole card at once. Two of them on one element would fight.
                <BorderGlow
                  key={s.slug}
                  // --rim-radius must match rounded-3xl. Spelled out because this
                  // theme redefines the radius scale and has no --radius-3xl, so
                  // a token reference here resolves to nothing and the ring ends
                  // up tighter than the corner it traces.
                  className="h-full rounded-3xl [--rim-radius:1.5rem]"
                >
                  <Card className="group/card relative h-full gap-0 rounded-3xl p-7 transition-shadow">
                    <Icon aria-hidden className="text-foreground size-7" strokeWidth={1.5} />

                    {/* The trigger sits inside the heading so it flows after the
                        last word. As a sibling of the heading it was pushed to
                        the far end of the row the moment a title wrapped, which
                        left it floating away from the words it belongs to. */}
                    <h3 className="font-display mt-5 text-xl leading-tight">
                      {/* Stretched over the whole card, so the card is the target
                          and the title is still the link's accessible name. */}
                      <Link
                        href={`/services/${s.slug}`}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {s.title[locale]}
                      </Link>{" "}
                      {/* The Gujarat evidence lives in here now. It is the reason
                          the service is on the roadmap, but it is a paragraph of
                          it, and printed on every card it doubled the height of
                          the grid. z-10 lifts the trigger over the title's
                          stretched link, which otherwise covers the whole card
                          and would swallow the press. */}
                      <Popover>
                        <PopoverTrigger
                          openOnHover
                          delay={120}
                          aria-label={t("whyThisMatters")}
                          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring relative z-10 -m-1 inline-flex size-6 translate-y-[0.1em] items-center justify-center rounded-full p-1 align-middle transition-colors focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <Info aria-hidden className="size-4" />
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-80">
                          <PopoverTitle className="text-sm">{t("whyThisMatters")}</PopoverTitle>
                          <PopoverDescription className="leading-relaxed">
                            {s.fact[locale]}
                          </PopoverDescription>
                        </PopoverContent>
                      </Popover>
                    </h3>

                    <p className="text-muted-foreground mt-2 leading-relaxed">{s.blurb[locale]}</p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-6">
                      {s.browsable ? (
                        <Badge variant="outline">
                          <Eye data-icon="inline-start" />
                          {t("noLoginToBrowse")}
                        </Badge>
                      ) : (
                        <span />
                      )}
                      <span className="text-pop inline-flex items-center gap-1.5 text-sm font-medium">
                        {t("startService")}
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform group-hover/card:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Card>
                </BorderGlow>
              );
            })}
          </div>
        </div>
      </PageShell>
    </>
  );
}
