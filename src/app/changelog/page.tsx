import type { Metadata } from "next";
import { CHANGELOG, APP_VERSION } from "@/lib/version";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Versions</h1>
        <p className="text-muted-foreground text-sm">
          Current: v{APP_VERSION}. Every release lists what was added, improved, fixed — and what is
          mocked.
        </p>
      </div>

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
          <CardTitle className="text-base">Roadmap (not yet built)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            <li>
              Commercial lane: fitness booking, MV tax, national/AITP permits (Gujarat: 65 ATS
              centres, ₹193 Cr/yr permits)
            </li>
            <li>Licence journeys: LL/DL application with Gujarat&apos;s 28 contactless services</li>
            <li>Unified grievance across services</li>
            <li>
              OpenAI-powered verdict & Sahayak chat on live keys; Supabase persistence behind the
              existing data interface
            </li>
            <li>Gujarati locale (states first: hi, gu)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
