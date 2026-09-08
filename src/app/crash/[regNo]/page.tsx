"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  HeartHandshake,
  Hospital,
  IdCard,
  Info,
  LifeBuoy,
  MapPin,
  Phone,
} from "lucide-react";
import { useVehicle } from "@/lib/use-vehicle";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { MockTag } from "@/components/stage-tracker";
// Same background as the report page: the molten field, pinned and inert.
// `ogl` is pulled in by this route alone.
import MoltenMetal from "@/components/molten-metal";

/**
 * The rule number, the scheme name, the legal citation — the part that matters
 * once and then never again. Behind an icon, so the card can say the one thing
 * a person at a crash scene actually needs and stop there.
 *
 * Opens on hover and on press, so it works with a mouse, a keyboard and a thumb.
 */
function MoreDetail({ title, children }: { title: string; children: React.ReactNode }) {
  const t = useT();
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={120}
        aria-label={t("moreInfo")}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring -m-1 ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <Info aria-hidden className="size-4" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverTitle className="text-sm">{title}</PopoverTitle>
        <PopoverDescription className="leading-relaxed">{children}</PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

/** A card header with its icon in a tile, the shape the garage and services use. */
function SectionHeader({
  icon: Icon,
  info,
  children,
}: {
  icon: typeof Hospital;
  info?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-base">
        <span
          aria-hidden
          className="bg-muted text-foreground grid size-9 shrink-0 place-items-center rounded-xl"
        >
          <Icon className="size-4.5" strokeWidth={1.5} />
        </span>
        <span className="flex min-w-0 flex-wrap items-center gap-2">{children}</span>
        {info}
      </CardTitle>
    </CardHeader>
  );
}

/**
 * The screen someone opens at the worst moment of their day.
 *
 * Laid out in the order the moment demands rather than the order the content
 * was written: call, then where to go, then what to show, then who pays, then
 * what protects a bystander. The first two are the only things anyone does in
 * the first minute, so they take the top row on their own and everything else
 * sits underneath in one band of three.
 *
 * It has to fit a desktop screen without scrolling. Someone reading this is not
 * going to scroll to find the ambulance number.
 *
 * Solid surfaces, no frosted glass. Every other consideration loses to being
 * readable one-handed, at night, by someone whose hands are shaking.
 */
export default function CrashCardPage() {
  const t = useT();
  const { regNo } = useParams<{ regNo: string }>();
  const { vehicle } = useVehicle(regNo);
  const mobile = useApp((s) => s.mobile);
  // 112 is the live national emergency number, and this is a prototype people
  // open out of curiosity. One stray tap on a phone would ring a real control
  // room, so the first tap arms the button and only the second dials.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const disarm = setTimeout(() => setArmed(false), 6000);
    return () => clearTimeout(disarm);
  }, [armed]);

  if (!vehicle)
    return <p className="text-muted-foreground py-10 text-center">{t("unknownVehicle")}</p>;

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the card. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <MoltenMetal mouseInteraction={false} />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-6">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <span
            aria-hidden
            className="bg-danger/10 text-danger grid size-11 place-items-center rounded-2xl"
          >
            <LifeBuoy className="size-5.5" strokeWidth={1.5} />
          </span>
          <h1 className="font-display text-3xl leading-tight">{t("crashCard")}</h1>
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
            {t("crashIntro")}
          </p>
        </div>

        {/* The first minute: ring for help, and know where you are going. */}
        <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex flex-col gap-3">
            {/* A bare anchor wearing the button's own styles, not <Button render>:
                Base UI stamps role="button" on whatever it renders, and this
                thing dials a number. That is navigation, so it has to announce
                as a link and respond to Enter, not to Space. */}
            <a
              href="tel:112"
              onClick={(e) => {
                if (armed) return;
                e.preventDefault();
                setArmed(true);
              }}
              className={cn(
                buttonVariants({ variant: "danger" }),
                // whitespace-normal because the button base sets nowrap, and
                // "Call 112 — Emergency" at text-3xl is 340px on one line — it
                // pushed a 320px phone sideways. The one control on this page
                // that has to work in a panic is not allowed to run off it.
                "h-full min-h-32 w-full flex-col gap-2 rounded-2xl px-4 py-7 text-center text-2xl font-bold text-balance whitespace-normal active:scale-[0.99] sm:text-3xl"
              )}
            >
              <Phone aria-hidden className="size-8" />
              {armed ? t("call112Confirm") : t("call112")}
            </a>
            {armed && (
              <Alert variant="warning" role="status">
                <Phone />
                <AlertDescription>{t("call112Note")}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Where to go, and the one thing that decides whether someone
              hesitates about going there. A designated hospital is where the
              cashless scheme applies, so the two facts belong on one card
              rather than a screen apart. */}
          <Card className="justify-center">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="bg-danger/10 text-danger grid size-11 shrink-0 place-items-center rounded-xl"
                >
                  <MapPin className="size-5" strokeWidth={1.5} />
                </span>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-muted-foreground text-xs">{t("nearestHospital")}</p>
                    <MockTag label={t("mockGps")} />
                  </div>
                  <p className="font-display text-2xl leading-tight">Civil Hospital, Asarwa</p>
                  <p className="text-muted-foreground text-sm">Ahmedabad</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">3.2 km</Badge>
                    <Badge variant="success">{t("traumaCentre")}</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <p className="text-success flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 aria-hidden className="size-4 shrink-0" />
                {t("cashlessHere")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Everything the first minute does not need: what to show, who pays,
            and what protects someone who stops to help. */}
        <div className="grid items-start gap-4 lg:grid-cols-3">
          <Card className="h-full">
            <SectionHeader
              icon={IdCard}
              info={<MoreDetail title={t("virtualDocs")}>{t("virtualRcNote")}</MoreDetail>}
            >
              {t("virtualDocs")} <MockTag label={t("mockVirtualRc")} />
            </SectionHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="font-mono text-lg">{vehicle.regNo}</p>
              <p>
                {vehicle.maker} {vehicle.model} · {vehicle.color}
              </p>
              <p className="text-muted-foreground">
                {t("insuranceLine")}: {vehicle.insurance.insurer}, {t("validTill")}{" "}
                {vehicle.insurance.validTill}
              </p>
              {mobile && (
                <p className="text-muted-foreground">
                  {t("holderMobile")}: •••••{mobile.slice(-4)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="h-full">
            <SectionHeader
              icon={Hospital}
              info={
                // goldenHourBody is a fragment that continues from the amount —
                // on its own it opened with "of treatment at…". The card shows
                // the number, so the note has to carry it too.
                <MoreDetail title={t("goldenHour")}>
                  {t("upTo")} {t("lakhSevenDays")} {t("goldenHourBody")}
                </MoreDetail>
              }
            >
              {t("goldenHour")}
            </SectionHeader>
            <CardContent className="flex flex-col gap-1">
              <p className="text-muted-foreground text-xs">{t("upTo")}</p>
              <p className="font-display text-2xl leading-tight">{t("lakhSevenDays")}</p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <SectionHeader
              icon={HeartHandshake}
              info={
                <MoreDetail title={t("helpingSomeone")}>
                  {t("rahveerA")} <b>{t("rahveerReward")}</b> (MoRTH, 2025).
                </MoreDetail>
              }
            >
              {t("helpingSomeone")}
            </SectionHeader>
            <CardContent className="text-sm leading-relaxed">
              <p>
                {t("goodSamaritanA")} <b>{t("noLegalLiability")}</b> {t("goodSamaritanB")}
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          {t("crashOutro")}
        </p>
      </div>
    </>
  );
}
