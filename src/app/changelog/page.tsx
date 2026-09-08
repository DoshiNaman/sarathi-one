import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronDown,
  FlaskConical,
  GraduationCap,
  Hash,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Recycle,
  Sparkles,
  Route,
  TrendingUp,
  Truck,
  Wrench,
} from "lucide-react";
import { CHANGELOG, APP_VERSION, type Release } from "@/lib/version";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { BorderGlow } from "@/components/border-glow";
import { PageShell } from "@/components/page-shell";
import { cn } from "@/lib/utils";
// Same background as the report page: the molten field, pinned and inert.
// A client component rendered inside this server page — it only touches WebGL
// inside an effect, and `ogl` is pulled in by this route alone.
import MoltenMetal from "@/components/molten-metal";

export const metadata: Metadata = {
  title: "What's new",
  description:
    "Every release: features, improvements, fixes, and an honesty ledger of exactly what is mocked in each version.",
  alternates: { canonical: "/changelog" },
};

/**
 * The three "what changed" lists. `mocked` is deliberately not here — it is the
 * honesty ledger, it is the reason this page exists, and it reads as one more
 * bullet list when it sits in the same row of headings as the rest. It gets a
 * callout of its own below.
 */
const SECTIONS = [
  { key: "features", label: "Features", icon: Sparkles },
  { key: "improvements", label: "Improvements", icon: TrendingUp },
  { key: "fixes", label: "Fixes", icon: Wrench },
] as const satisfies readonly { key: keyof Release; label: string; icon: LucideIcon }[];

/** Roadmap lines, each with the face its service already wears on /services. */
const ROADMAP: { icon: LucideIcon; text: string }[] = [
  {
    icon: Truck,
    text: "Commercial lane: fitness and ATS booking, MV tax, national and state permits (Gujarat: 65 ATS centres, ₹193 Cr/yr in national permits)",
  },
  {
    icon: GraduationCap,
    text: "Licence journeys: learner licence and DL renewal, on top of Gujarat’s 28 contactless eKYC services, with the Form 1A empanelled-doctor finder",
  },
  {
    icon: Hash,
    text: "Fancy-number auctions you can browse before logging in (40 Gujarat RTO codes)",
  },
  {
    icon: Recycle,
    text: "Scrapping: Certificate of Deposit into a discount on the next registration",
  },
  { icon: Megaphone, text: "One grievance ticket per failure, instead of four separate systems" },
  {
    icon: MessageSquare,
    text: "OpenAI-powered verdict and Krishna chat on live keys; Supabase persistence behind the existing data interface",
  },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-muted-foreground flex gap-2.5 text-sm leading-relaxed">
          <span aria-hidden className="bg-border mt-[0.55rem] size-1 shrink-0 rounded-full" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ReleaseEntry({ release, isCurrent }: { release: Release; isCurrent: boolean }) {
  return (
    <Card className="gap-0 py-0">
      {/* Only the current release is open on arrival. Seven releases expanded is
          a wall of scroll for someone who came to read the newest one, and the
          older entries mostly say "unchanged from v1.2.0". */}
      <Collapsible defaultOpen={isCurrent}>
        <CollapsibleTrigger className="group hover:bg-muted/40 focus-visible:ring-ring flex w-full cursor-pointer items-start gap-4 rounded-xl px-(--card-spacing) py-(--card-spacing) text-left transition-colors focus-visible:ring-2 focus-visible:outline-none">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg leading-none tabular-nums">
                v{release.version}
              </span>
              {isCurrent ? <Badge variant="success">current</Badge> : null}
              <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                {release.date}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-snug">{release.title}</p>
          </div>
          <ChevronDown
            aria-hidden
            className="text-muted-foreground mt-1 size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180"
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="flex flex-col gap-5 px-(--card-spacing) pb-(--card-spacing)">
            <Separator />
            {SECTIONS.map(({ key, label, icon: Icon }) =>
              release[key].length === 0 ? null : (
                <div key={key} className="flex flex-col gap-2">
                  <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
                    <Icon aria-hidden className="size-3.5" strokeWidth={2} />
                    {label}
                    <span className="text-muted-foreground font-normal tabular-nums">
                      {release[key].length}
                    </span>
                  </h3>
                  <Bullets items={release[key]} />
                </div>
              )
            )}

            {release.mocked.length === 0 ? null : (
              <Alert variant="warning">
                <FlaskConical aria-hidden />
                <AlertTitle className="text-xs font-semibold tracking-wider uppercase">
                  Mocked in this release
                </AlertTitle>
                <AlertDescription>
                  <Bullets items={release.mocked} />
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

export default function ChangelogPage() {
  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the list. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <MoltenMetal mouseInteraction={false} />
      </div>
      <PageShell
        title="Versions"
        description="Every version lists what was added, improved and fixed — and exactly what is mocked in it."
      >
        <div className="flex flex-col gap-10">
          {/* A timeline rather than a stack of equal cards: the releases are one
              sequence, and the rail is what says so. */}
          <ol className="flex flex-col">
            {CHANGELOG.map((release, i) => (
              <li key={release.version} className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
                <div className="flex flex-col items-center" aria-hidden>
                  <span
                    className={cn(
                      "mt-5 size-2.5 shrink-0 rounded-full ring-4",
                      release.version === APP_VERSION
                        ? "bg-success ring-success/20"
                        : "bg-border ring-transparent"
                    )}
                  />
                  {/* No tail under the last dot, or the rail runs off the end of
                      the history into nothing. */}
                  {i < CHANGELOG.length - 1 ? <span className="bg-border w-px flex-1" /> : null}
                </div>
                <div className="min-w-0 pb-6">
                  <ReleaseEntry release={release} isCurrent={release.version === APP_VERSION} />
                </div>
              </li>
            ))}
          </ol>

          {/* overflow-x-clip because the glow's halo is absolutely positioned
              outside the card and counts toward scroll width — same guard as
              the services and garage grids. */}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 overflow-x-clip sm:gap-x-6">
            <span aria-hidden className="w-2.5" />
            {/* --rim-radius must match rounded-3xl. Spelled out because this theme
              redefines the radius scale and has no --radius-3xl, so a token
              reference here resolves to nothing and the ring ends up tighter
              than the corner it traces. */}
            <BorderGlow className="rounded-3xl [--rim-radius:1.5rem]">
              <Card className="gap-5 rounded-3xl p-7">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Route aria-hidden className="text-foreground size-5" strokeWidth={1.5} />
                    <h2 className="font-display text-xl leading-tight">Roadmap</h2>
                    <Badge variant="outline" className="ml-auto">
                      previews, not live services
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Scoped to Gujarat, because that is the state the research walked. Each one runs
                    end to end on synthetic data under{" "}
                    <Link href="/services" className="underline underline-offset-3">
                      All services
                    </Link>
                    ; none of them files anything with an RTO. The reasoning and the numbers behind
                    them are on{" "}
                    <Link href="/how-it-works" className="underline underline-offset-3">
                      How it works
                    </Link>
                    .
                  </p>
                </div>

                <Separator />

                <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                  {ROADMAP.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex gap-3">
                      <Icon
                        aria-hidden
                        className="text-muted-foreground mt-0.5 size-4 shrink-0"
                        strokeWidth={1.75}
                      />
                      <span className="text-muted-foreground text-sm leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </BorderGlow>
          </div>
        </div>
      </PageShell>
    </>
  );
}
