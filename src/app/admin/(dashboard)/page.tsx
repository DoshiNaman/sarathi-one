import Link from "next/link";
import { Car, AlertTriangle, Ban, ReceiptText } from "lucide-react";
import { getFleet } from "@/lib/db/vehicles";
import { requireAdmin } from "@/lib/db/auth";
import { inr } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatCard, SourceBadge } from "@/components/admin-ui";

export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();
  const { vehicles, source } = await getFleet();

  const withLoan = vehicles.filter((v) => v.hypothecation.active);
  const blocked = vehicles.filter((v) => v.status !== "ACTIVE");
  const pendingChallans = vehicles.flatMap((v) => v.challans.filter((c) => c.status === "PENDING"));
  const pendingValue = pendingChallans.reduce((sum, c) => sum + c.amount, 0);
  const accidents = vehicles.filter((v) => v.accident.flag);

  return (
    <div className="w-full">
      <PageHeader
        title="Dashboard"
        description="The synthetic dataset behind the citizen demo."
        action={<SourceBadge source={source} />}
      />

      {source === "mock" && (
        <Card className="border-warning/40 mb-6">
          <CardHeader>
            <CardTitle className="text-base">Reading the fallback fleet</CardTitle>
            <CardDescription>
              Supabase is unset, unreachable, or the vehicles table is empty, so the app is serving
              the built-in synthetic fleet. Edits will not persist until the database is reachable.
              This fallback is deliberate — the citizen demo stays up even when the database sleeps.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vehicles" value={vehicles.length} hint="in the demo fleet" />
        <StatCard label="With active loan" value={withLoan.length} hint="hypothecation on the RC" />
        <StatCard
          label="Blacklisted or scrapped"
          value={blocked.length}
          hint="cannot be transferred"
        />
        <StatCard
          label="Pending challans"
          value={pendingChallans.length}
          hint={`${inr(pendingValue)} outstanding`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Needs attention</CardTitle>
            <CardDescription>Records a reviewer is most likely to open.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {blocked.map((v) => (
              <div key={v.regNo} className="flex items-center gap-2">
                <Ban aria-hidden className="text-danger size-4 shrink-0" />
                <span className="font-mono">{v.regNo}</span>
                <span className="text-muted-foreground">{v.status.toLowerCase()}</span>
              </div>
            ))}
            {accidents.map((v) => (
              <div key={v.regNo} className="flex items-center gap-2">
                <AlertTriangle aria-hidden className="text-warning size-4 shrink-0" />
                <span className="font-mono">{v.regNo}</span>
                <span className="text-muted-foreground">accident on record</span>
              </div>
            ))}
            {blocked.length === 0 && accidents.length === 0 && (
              <p className="text-muted-foreground">Nothing flagged.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Manage</CardTitle>
            <CardDescription>Jump straight into a dataset.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/admin/vehicles" />}
            >
              <Car aria-hidden /> Vehicles
            </Button>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/admin/challans" />}
            >
              <ReceiptText aria-hidden /> Challans
            </Button>
            <Button
              size="sm"
              variant="pop"
              nativeButton={false}
              render={<Link href="/admin/vehicles/new" />}
            >
              New vehicle
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
