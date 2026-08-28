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
import { PageHeader, SourceBadge, DataTable } from "@/components/admin-ui";

export const metadata = { title: "Vehicles" };

export default async function AdminVehiclesPage() {
  await requireAdmin();
  const { vehicles, source } = await getFleet();

  return (
    <>
      <PageHeader
        title="Vehicles"
        description="Synthetic records only. Never enter a real registration number or owner."
        action={
          <div className="flex items-center gap-2">
            <SourceBadge source={source} />
            <Button size="sm" nativeButton={false} render={<Link href="/admin/vehicles/new" />}>
              New vehicle
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className={vehicles.length ? "pt-4" : "p-0"}>
          {vehicles.length === 0 ? (
            <EmptyState
              icon={<Car aria-hidden />}
              title="No vehicles yet"
              description="Seed the database or create one to get started."
              action={
                <Button size="sm" nativeButton={false} render={<Link href="/admin/vehicles/new" />}>
                  New vehicle
                </Button>
              }
            />
          ) : (
            <DataTable headers={["Reg no", "Vehicle", "Status", "Loan", "Owners", ""]}>
              {vehicles.map((v) => (
                <tr key={v.regNo} className="border-b last:border-0">
                  <td className="py-2 pr-3 font-mono">{v.regNo}</td>
                  <td className="py-2 pr-3">
                    {v.maker} {v.model}
                  </td>
                  <td className="py-2 pr-3">
                    <Badge variant={v.status === "ACTIVE" ? "secondary" : "destructive"}>
                      {v.status}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3">
                    {v.hypothecation.active ? v.hypothecation.financier : "—"}
                  </td>
                  <td className="py-2 pr-3 tabular-nums">{v.owners.length}</td>
                  <td className="py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="xs"
                        variant="outline"
                        nativeButton={false}
                        render={<Link href={`/admin/vehicles/${v.regNo}`} />}
                      >
                        Edit
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
