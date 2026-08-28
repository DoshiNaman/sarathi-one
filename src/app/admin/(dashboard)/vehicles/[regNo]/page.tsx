import { requireAdmin } from "@/lib/db/auth";
import { getVehicle } from "@/lib/db/vehicles";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin-ui";
import { VehicleForm } from "./form";

export const metadata = { title: "Edit vehicle — Sarathi One" };

export default async function EditVehiclePage({ params }: { params: Promise<{ regNo: string }> }) {
  await requireAdmin();
  const { regNo } = await params;
  const isNew = regNo === "new";
  const { vehicle } = isNew ? { vehicle: undefined } : await getVehicle(regNo);

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={isNew ? "New vehicle" : `Edit ${vehicle?.regNo ?? regNo}`}
        description="Synthetic demo records only. Never enter a real registration number, owner name, or any real personal data."
        action={
          <Button
            size="sm"
            variant="outline"
            nativeButton={false}
            render={<Link href="/admin/vehicles" />}
          >
            <ArrowLeft aria-hidden /> All vehicles
          </Button>
        }
      />
      <VehicleForm vehicle={vehicle} isNew={isNew} />
    </div>
  );
}
