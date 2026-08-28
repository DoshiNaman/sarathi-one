import type { Metadata } from "next";
import Link from "next/link";
import { WHO, TODAY, CHANGED, REAL, MOCKED, SCALE } from "@/lib/story";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How this works — what is real, what is mocked",
  description:
    "The problem, what changed, exactly what works today, exactly what is simulated, and how the idea could run safely at national scale.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How this works — what is real, what is mocked",
    description: "Who has the problem, what we changed, and an explicit works-vs-simulated split.",
    url: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">How this works</h1>
        <p className="text-muted-foreground">
          A prototype is only useful if you can tell what is real. This page is the honest version:
          the problem, what we changed, what actually works, what is simulated, and how it could run
          at scale.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Who has this problem</h2>
        <p className="text-sm leading-relaxed">{WHO}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What is hard about it today</h2>
        {TODAY.map((t) => (
          <Card key={t.problem}>
            <CardHeader>
              <CardTitle className="text-base">{t.problem}</CardTitle>
              <CardDescription className="leading-relaxed">{t.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        <p className="text-muted-foreground text-xs">
          Every claim above comes from reading the live public pages of parivahan.gov.in and its
          portals, plus MoRTH notifications and the National Transport Repository data-sharing
          policy. No government system was accessed, tested or scraped.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What we changed</h2>
        {CHANGED.map((c) => (
          <div key={c.change} className="border-l-2 pl-4">
            <p className="font-medium">{c.change}</p>
            <p className="text-muted-foreground text-sm">{c.why}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="border-green-600/40">
          <CardHeader>
            <CardTitle className="text-base">✅ Works today</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
              {REAL.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-orange-500/40">
          <CardHeader>
            <CardTitle className="text-base">🎭 Simulated</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-disc space-y-1.5 pl-5 text-sm">
              {MOCKED.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How this could work safely at scale</h2>
        {SCALE.map((s) => (
          <div key={s.heading}>
            <p className="font-medium">{s.heading}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">
        <p className="text-foreground mb-1 font-medium">Not a government product</p>
        <p>
          Sarathi One is an independent hackathon prototype. It is not affiliated with, endorsed by,
          or connected to the Ministry of Road Transport and Highways, NIC, or Parivahan Sewa, and
          it uses no government logos or branding. For real services, use{" "}
          <span className="font-mono">parivahan.gov.in</span>.
        </p>
      </section>

      <p className="text-center text-sm">
        <Link href="/changelog" className="underline">
          See the version history →
        </Link>
      </p>
    </div>
  );
}
