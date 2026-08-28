import { ReceiptText } from "lucide-react";
import { getFleet } from "@/lib/db/vehicles";
import { requireAdmin } from "@/lib/db/auth";
import { inr } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import { PageHeader, SourceBadge, DataTable, StatCard } from "@/components/admin-ui";

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
        description="Traffic violations attached to demo vehicles."
        action={<SourceBadge source={source} />}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={challans.length} />
        <StatCard label="Pending" value={pending.length} />
        <StatCard label="Outstanding" value={inr(pending.reduce((s, c) => s + c.amount, 0))} />
      </div>

      <Card>
        <CardContent className={challans.length ? "pt-4" : "p-0"}>
          {challans.length === 0 ? (
            <EmptyState icon={<ReceiptText aria-hidden />} title="No challans on record" />
          ) : (
            <DataTable headers={["Challan", "Vehicle", "Date", "Offence", "Amount", "Status"]}>
              {challans.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-mono text-xs">{c.id}</td>
                  <td className="py-2 pr-3 font-mono">{c.regNo}</td>
                  <td className="py-2 pr-3">{c.date}</td>
                  <td className="py-2 pr-3">{c.offense}</td>
                  <td className="py-2 pr-3 tabular-nums">{c.amount ? inr(c.amount) : "—"}</td>
                  <td className="py-2 pr-3">
                    <Badge variant={c.status === "PENDING" ? "destructive" : "secondary"}>
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </CardContent>
      </Card>
    </>
  );
}
