"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useVehicle } from "@/lib/use-vehicle";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockTag } from "@/components/stage-tracker";
import { Phone, LifeBuoy, Hospital, HeartHandshake } from "lucide-react";
import { useT } from "@/lib/i18n";

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
    <div className="mx-auto max-w-md space-y-4 px-5 py-10">
      <h1 className="font-display text-center text-3xl">
        <LifeBuoy aria-hidden className="inline size-6" /> {t("crashCard")}
      </h1>
      <p className="text-muted-foreground text-center text-sm">{t("crashIntro")}</p>

      <a
        href="tel:112"
        onClick={(e) => {
          if (armed) return;
          e.preventDefault();
          setArmed(true);
        }}
        className="bg-danger text-danger-foreground focus-visible:ring-danger/40 block rounded-2xl py-6 text-center text-2xl font-bold transition-transform focus-visible:ring-3 focus-visible:outline-none active:scale-[0.98]"
      >
        <Phone aria-hidden className="inline size-7" /> {armed ? t("call112Confirm") : t("call112")}
      </a>
      {armed && (
        <p role="status" className="text-muted-foreground -mt-2 text-center text-xs">
          {t("call112Note")}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("virtualDocs")} <MockTag label={t("mockVirtualRc")} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
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
          <p className="text-muted-foreground text-xs">{t("virtualRcNote")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Hospital aria-hidden className="inline size-5" /> {t("goldenHour")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            {t("upTo")} <b>{t("lakhSevenDays")}</b> {t("goldenHourBody")}
          </p>
          <div className="bg-muted rounded-md p-2">
            {t("nearestHospital")} <MockTag label={t("mockGps")} />:<br />
            <b>Civil Hospital, Asarwa, Ahmedabad</b> · 3.2 km · {t("traumaCentre")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <HeartHandshake aria-hidden className="inline size-5" /> {t("helpingSomeone")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            {t("goodSamaritanA")} <b>{t("noLegalLiability")}</b> {t("goodSamaritanB")}
          </p>
          <p>
            {t("rahveerA")} <b>{t("rahveerReward")}</b> (MoRTH, 2025).
          </p>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-xs">{t("crashOutro")}</p>
    </div>
  );
}
