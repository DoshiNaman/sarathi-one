"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const t = useT();
  const mobile = useApp((s) => s.mobile);

  const tiles = [
    { href: "/check", emoji: "🔍", title: t("checkVehicle"), desc: { en: "Free official summary + full Trust Report before you buy second-hand.", hi: "खरीदने से पहले मुफ्त सारांश + पूरी ट्रस्ट रिपोर्ट।" } },
    { href: "/garage", emoji: "🚗", title: t("myGarage"), desc: { en: "Your vehicles, applications, payments and expiry alerts in one place.", hi: "आपके वाहन, आवेदन, भुगतान और समय-सीमा अलर्ट एक जगह।" } },
    { href: "/status", emoji: "📄", title: t("status"), desc: { en: "Track any application with a stage-by-stage timeline.", hi: "हर आवेदन की चरण-दर-चरण स्थिति देखें।" } },
    { href: "/how-it-works", emoji: "🧭", title: t("howItWorks"), desc: { en: "The problem, what we changed, and exactly what is real vs simulated.", hi: "समस्या, हमने क्या बदला, और क्या असली है बनाम नकली।" } },
  ];
  const locale = useApp((s) => s.locale);

  return (
    <div className="space-y-8">
      <section className="space-y-3 pt-6 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{t("tagline")}</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {locale === "en"
            ? "Today, one vehicle transaction crosses 8 portals, 4 staff logins and a captcha on every page. This demo shows the same journeys with one account."
            : "आज एक वाहन लेन-देन 8 पोर्टल और हर पेज पर कैप्चा से गुजरता है। यह डेमो वही यात्रा एक खाते से दिखाता है।"}
        </p>
        {!mobile && (
          <Link href="/login" className="inline-block rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground">
            {t("login")} →
          </Link>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>
                  <span className="mr-2">{tile.emoji}</span>
                  {tile.title}
                </CardTitle>
                <CardDescription>{tile.desc[locale]}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demo data cheat-sheet</CardTitle>
            <CardDescription>Synthetic fleet — try these registration numbers</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1 font-mono text-sm sm:grid-cols-2">
            <span>GJ01AB1234 — active bank loan ⚠️</span>
            <span>GJ05CD5678 — clean, 1 owner ✅</span>
            <span>GJ06EF9012 — 3 owners + accident 🚨</span>
            <span>GJ18GH3456 — blacklisted ⛔</span>
            <span>GJ03JK7890 — expired docs (yours)</span>
            <span>GJ12MN2468 — commercial + fitness</span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
