import Link from "next/link";
import { Car } from "lucide-react";
import { getFleet } from "@/lib/db/vehicles";
import { requireAdmin } from "@/lib/db/auth";
import { deleteVehicle } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { EmptyState } from "@/components/states";
import { PageHeader, SourceBadge, DataTable, Row, Cell } from "@/components/admin-ui";
import { Plus, Pencil } from "lucide-react";

export const metadata = { title: "Vehicles" };

export default async function AdminVehiclesPage() {
  await requireAdmin();
  const { vehicles, source } = await getFleet();

  return (
    <>
      <PageHeader
        title="Vehicles"
        count={vehicles.length}
        description="Synthetic records only. Never enter a real registration number or owner."
        action={
          <div className="flex items-center gap-2">
            <SourceBadge source={source} />
            <Button
              size="sm"
              variant="pop"
              nativeButton={false}
              render={<Link href="/admin/vehicles/new" />}
            >
              <Plus aria-hidden /> New vehicle
            </Button>
          </div>
        }
      />

      <>
        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState
                icon={<Car aria-hidden />}
                title="No vehicles yet"
                description="Seed the database or create one to get started."
                action={
                  <Button
                    size="sm"
                    variant="pop"
                    nativeButton={false}
                    render={<Link href="/admin/vehicles/new" />}
                  >
                    New vehicle
                  </Button>
                }
              />
            </CardContent>
          </Card>
        ) : (
          <DataTable headers={["Reg no", "Vehicle", "Status", "Loan", "Owners", ""]}>
            {vehicles.map((v) => (
              <Row key={v.regNo}>
                <Cell className="font-mono">{v.regNo}</Cell>
                <Cell>
                  {v.maker} {v.model}
                </Cell>
                <Cell>
                  <Badge variant={v.status === "ACTIVE" ? "secondary" : "destructive"}>
                    {v.status}
                  </Badge>
                </Cell>
                <Cell className="text-muted-foreground">
                  {v.hypothecation.active ? v.hypothecation.financier : "—"}
                </Cell>
                <Cell className="tabular-nums">{v.owners.length}</Cell>
                <Cell align="right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="xs"
                      variant="outline"
                      nativeButton={false}
                      render={<Link href={`/admin/vehicles/${v.regNo}`} />}
                    >
                      <Pencil aria-hidden /> Edit
                    </Button>
                    {source === "supabase" && (
                      <form action={deleteVehicle}>
                        <input type="hidden" name="reg_no" value={v.regNo} />
                        <ConfirmSubmit
                          message={`Delete ${v.regNo}? Its owners and challans are deleted too. This cannot be undone.`}
                        >
                          Delete
                        </ConfirmSubmit>
                      </form>
                    )}
                  </div>
                </Cell>
              </Row>
            ))}
          </DataTable>
        )}
      </>
    </>
  );
}
