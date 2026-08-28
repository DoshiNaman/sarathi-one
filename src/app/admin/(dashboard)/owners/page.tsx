import { Users } from "lucide-react";
import { getFleet } from "@/lib/db/vehicles";
import { requireAdmin } from "@/lib/db/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import { PageHeader, SourceBadge, DataTable } from "@/components/admin-ui";

export const metadata = { title: "Owners" };

export default async function AdminOwnersPage() {
  await requireAdmin();
  const { vehicles, source } = await getFleet();
  const owners = vehicles
    .flatMap((v) => v.owners.map((o) => ({ ...o, regNo: v.regNo })))
    .sort((a, b) => a.regNo.localeCompare(b.regNo) || a.serial - b.serial);

  return (
    <>
      <PageHeader
        title="Owners"
        description="The ownership timeline behind each Trust Report. All names are invented."
        action={<SourceBadge source={source} />}
      />
      <Card>
        <CardContent className={owners.length ? "pt-4" : "p-0"}>
          {owners.length === 0 ? (
            <EmptyState icon={<Users aria-hidden />} title="No owners on record" />
          ) : (
            <DataTable headers={["Vehicle", "#", "Name", "Shown publicly as", "From", "To"]}>
              {owners.map((o) => (
                <tr key={`${o.regNo}-${o.serial}`} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-mono">{o.regNo}</td>
                  <td className="py-2 pr-3 tabular-nums">{o.serial}</td>
                  <td className="py-2 pr-3">{o.name}</td>
                  <td className="text-muted-foreground py-2 pr-3 font-mono text-xs">
                    {o.maskedName}
                  </td>
                  <td className="py-2 pr-3">{o.from}</td>
                  <td className="py-2 pr-3">
                    {o.to ?? <Badge variant="secondary">current</Badge>}
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
