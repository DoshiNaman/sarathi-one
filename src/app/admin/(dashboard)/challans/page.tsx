import { ReceiptText } from "lucide-react";
import { getFleet } from "@/lib/db/vehicles";
import { requireAdmin } from "@/lib/db/auth";
import { inr } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import { PageHeader, SourceBadge, DataTable, StatCard, Row, Cell } from "@/components/admin-ui";

export const metadata = { title: "Challans" };

export default async function AdminChallansPage() {
  await requireAdmin();
  const { vehicles, source } = await getFleet();
  const challans = vehicles
    .flatMap((v) => v.challans.map((c) => ({ ...c, regNo: v.regNo })))
    .sort((a, b) => b.date.localeCompare(a.date));

  const pending = challans.filter((c) => c.status === "PENDING");

  return (
    <>
      <PageHeader
        title="Challans"
        count={challans.length}
        description="Traffic violations attached to demo vehicles."
        action={<SourceBadge source={source} />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={challans.length} />
        <StatCard label="Pending" value={pending.length} />
        <StatCard label="Outstanding" value={inr(pending.reduce((s, c) => s + c.amount, 0))} />
      </div>

      <>
        {challans.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState icon={<ReceiptText aria-hidden />} title="No challans on record" />
            </CardContent>
          </Card>
        ) : (
          <DataTable headers={["Challan", "Vehicle", "Date", "Offence", "Amount", "Status"]}>
            {challans.map((c) => (
              <Row key={c.id}>
                <Cell className="text-muted-foreground font-mono text-xs">{c.id}</Cell>
                <Cell className="font-mono">{c.regNo}</Cell>
                <Cell className="text-muted-foreground">{c.date}</Cell>
                <Cell>{c.offense}</Cell>
                <Cell className="tabular-nums">{c.amount ? inr(c.amount) : "—"}</Cell>
                <Cell>
                  <Badge variant={c.status === "PENDING" ? "destructive" : "secondary"}>
                    {c.status}
                  </Badge>
                </Cell>
              </Row>
            ))}
          </DataTable>
        )}
      </>
    </>
  );
}
