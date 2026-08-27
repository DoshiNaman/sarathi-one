import { requireAdmin } from "@/lib/db/auth";
import { getVehicle } from "@/lib/db/vehicles";
import { VehicleForm } from "./form";

export const metadata = { title: "Edit vehicle — Sarathi One" };

export default async function EditVehiclePage({ params }: { params: Promise<{ regNo: string }> }) {
  await requireAdmin();
  const { regNo } = await params;
  const isNew = regNo === "new";
  const { vehicle } = isNew ? { vehicle: undefined } : await getVehicle(regNo);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{isNew ? "New vehicle" : `Edit ${vehicle?.regNo ?? regNo}`}</h1>
      <p className="text-sm text-muted-foreground">
        Synthetic demo records only. Never enter a real registration number, owner name, or any
        real personal data.
      </p>
      <VehicleForm vehicle={vehicle} isNew={isNew} />
    </div>
  );
}
