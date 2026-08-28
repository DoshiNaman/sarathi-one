import { Users } from "lucide-react";
import { getFleet } from "@/lib/db/vehicles";
import { requireAdmin } from "@/lib/db/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states";
import { PageHeader, SourceBadge, DataTable, Row, Cell } from "@/components/admin-ui";

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
        count={owners.length}
        description="The ownership timeline behind each Trust Report. All names are invented."
        action={<SourceBadge source={source} />}
      />
      <>
        {owners.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState icon={<Users aria-hidden />} title="No owners on record" />
            </CardContent>
          </Card>
        ) : (
          <DataTable headers={["Vehicle", "#", "Name", "Shown publicly as", "From", "To"]}>
            {owners.map((o) => (
              <Row key={`${o.regNo}-${o.serial}`}>
                <Cell className="font-mono">{o.regNo}</Cell>
                <Cell className="tabular-nums">{o.serial}</Cell>
                <Cell>{o.name}</Cell>
                <Cell className="text-muted-foreground font-mono text-xs">{o.maskedName}</Cell>
                <Cell className="text-muted-foreground">{o.from}</Cell>
                <Cell>{o.to ?? <Badge variant="secondary">current</Badge>}</Cell>
              </Row>
            ))}
          </DataTable>
        )}
      </>
    </>
  );
}
