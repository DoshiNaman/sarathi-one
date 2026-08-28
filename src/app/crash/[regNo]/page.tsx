"use client";
import { useParams } from "next/navigation";
import { useVehicle } from "@/lib/use-vehicle";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MockTag } from "@/components/stage-tracker";
import { Phone, LifeBuoy, Hospital, HeartHandshake } from "lucide-react";

export default function CrashCardPage() {
  const { regNo } = useParams<{ regNo: string }>();
  const { vehicle } = useVehicle(regNo);
  const mobile = useApp((s) => s.mobile);

  if (!vehicle) return <p className="text-muted-foreground py-10 text-center">Unknown vehicle.</p>;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-center text-2xl font-bold">
        <LifeBuoy aria-hidden className="inline size-6" /> Crash Card
      </h1>
      <p className="text-muted-foreground text-center text-sm">
        Everything a person needs in the first minutes after a road accident. Grounded in the
        Cashless Treatment Scheme, 2025.
      </p>

      <a
        href="tel:112"
        className="block rounded-xl bg-red-600 py-5 text-center text-2xl font-bold text-white active:scale-95"
      >
        <Phone aria-hidden className="inline size-7" /> Call 112 — Emergency
      </a>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Virtual documents <MockTag label="MOCK VIRTUAL RC" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="font-mono text-lg">{vehicle.regNo}</p>
          <p>
            {vehicle.maker} {vehicle.model} · {vehicle.color}
          </p>
          <p className="text-muted-foreground">
            Insurance: {vehicle.insurance.insurer}, valid till {vehicle.insurance.validTill}
          </p>
          {mobile && (
            <p className="text-muted-foreground">Holder mobile: •••••{mobile.slice(-4)}</p>
          )}
          <p className="text-muted-foreground text-xs">
            Virtual RC/DL in mParivahan & DigiLocker are legally valid — no physical papers needed
            at the scene.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Hospital aria-hidden className="inline size-5" /> Golden hour — treatment is cashless
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Up to <b>₹1.5 lakh for 7 days</b> of treatment at designated hospitals under the
            Cashless Treatment of Road Accident Victims Scheme, 2025. No cash, no paperwork at
            admission.
          </p>
          <div className="bg-muted rounded-md p-2">
            Nearest designated hospital <MockTag label="MOCK GPS" />:<br />
            <b>Civil Hospital, Asarwa, Ahmedabad</b> · 3.2 km · Trauma centre 24×7
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <HeartHandshake aria-hidden className="inline size-5" /> Helping someone? You are
            protected.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            Good Samaritans face <b>no legal liability</b> and cannot be forced to disclose
            identity.
          </p>
          <p>
            Taking a victim to a hospital in the golden hour qualifies for the{" "}
            <b>₹25,000 Rahveer reward</b> (MoRTH, 2025).
          </p>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-xs">
        None of this information exists in today&apos;s Parivahan citizen UI — that is the point of
        this screen.
      </p>
    </div>
  );
}
