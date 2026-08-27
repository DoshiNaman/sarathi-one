import Link from "next/link";
import { requireAdmin } from "@/lib/db/auth";
import { getFleet } from "@/lib/db/vehicles";
import { signOut, deleteVehicle } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmSubmit } from "@/components/confirm-submit";

export const metadata = { title: "Admin — Sarathi One" };

export default async function AdminPage() {
  const admin = await requireAdmin();
  const { vehicles, source } = await getFleet();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Demo data admin</h1>
          <p className="text-muted-foreground text-sm">
            {admin.email} · <Badge variant="secondary">{admin.role}</Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/vehicles/new" />}
          >
            + New vehicle
          </Button>
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {source === "mock" && (
        <Card className="border-amber-500/50">
          <CardHeader>
            <CardTitle className="text-base">
              ⚠️ Reading the built-in fleet, not the database
            </CardTitle>
            <CardDescription>
              Supabase is unset, unreachable, or the vehicles table is empty, so the app is serving
              the synthetic fallback fleet. Edits here will not appear until the database is
              reachable and seeded. This fallback is deliberate: the citizen demo stays up even if
              the database sleeps.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Vehicles <Badge variant="secondary">{vehicles.length}</Badge>{" "}
            <Badge variant={source === "supabase" ? "default" : "secondary"}>{source}</Badge>
          </CardTitle>
          <CardDescription>Synthetic records only. Never enter real citizen data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b text-left">
                  <th className="py-1 pr-3">Reg no</th>
                  <th className="py-1 pr-3">Vehicle</th>
                  <th className="py-1 pr-3">Status</th>
                  <th className="py-1 pr-3">Loan</th>
                  <th className="py-1 pr-3">Owners</th>
                  <th className="py-1"></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.regNo} className="border-b last:border-0">
                    <td className="py-1.5 pr-3 font-mono">{v.regNo}</td>
                    <td className="py-1.5 pr-3">
                      {v.maker} {v.model}
                    </td>
                    <td className="py-1.5 pr-3">
                      <Badge variant={v.status === "ACTIVE" ? "secondary" : "destructive"}>
                        {v.status}
                      </Badge>
                    </td>
                    <td className="py-1.5 pr-3">
                      {v.hypothecation.active ? v.hypothecation.financier : "—"}
                    </td>
                    <td className="py-1.5 pr-3">{v.owners.length}</td>
                    <td className="py-1.5 text-right">
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
