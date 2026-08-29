import type { Metadata } from "next";
import { CHANGELOG, APP_VERSION } from "@/lib/version";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "What's new",
  description:
    "Every release: features, improvements, fixes, and an honesty ledger of exactly what is mocked in each version.",
  alternates: { canonical: "/changelog" },
};

const SECTIONS = [
  ["features", "✨ Features"],
  ["improvements", "📈 Improvements"],
  ["fixes", "🔧 Fixes"],
  ["mocked", "🎭 Mocked / synthetic (honesty ledger)"],
] as const;

export default function ChangelogPage() {
  return (
    <PageShell
      title="Versions"
      description={`Current release v${APP_VERSION}. Every version lists what was added, improved and fixed — and exactly what is mocked in it.`}
      width="narrow"
    >
      <div className="space-y-6">
        {CHANGELOG.map((release) => (
          <Card key={release.version}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>v{release.version}</CardTitle>
                {release.version === APP_VERSION && <Badge>current</Badge>}
                <span className="text-muted-foreground ml-auto text-sm">{release.date}</span>
              </div>
              <CardDescription>{release.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {SECTIONS.map(([key, label]) =>
                release[key].length === 0 ? null : (
                  <div key={key}>
                    <h3 className="mb-1 text-sm font-semibold">{label}</h3>
                    <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                      {release[key].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Roadmap (walkable previews, not live services)
            </CardTitle>
            <CardDescription>
              Scoped to Gujarat, because that is the state the research walked. Each one runs end to
              end on synthetic data under{" "}
              <Link href="/services" className="underline">
                All services
              </Link>
              ; none of them files anything with an RTO. The reasoning and the numbers behind them
              are on{" "}
              <Link href="/how-it-works" className="underline">
                How it works
              </Link>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>
                Commercial lane: fitness and ATS booking, MV tax, national and state permits
                (Gujarat: 65 ATS centres, ₹193 Cr/yr in national permits)
              </li>
              <li>
                Licence journeys: learner licence and DL renewal, on top of Gujarat&apos;s 28
                contactless eKYC services, with the Form 1A empanelled-doctor finder
              </li>
              <li>Fancy-number auctions you can browse before logging in (40 Gujarat RTO codes)</li>
              <li>Scrapping: Certificate of Deposit into a discount on the next registration</li>
              <li>One grievance ticket per failure, instead of four separate systems</li>
              <li>
                OpenAI-powered verdict and Krishna chat on live keys; Supabase persistence behind
                the existing data interface
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
