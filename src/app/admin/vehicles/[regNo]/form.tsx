"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveVehicle } from "../../actions";
import type { Vehicle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function Field({ name, label, defaultValue, type = "text" }: { name: string; label: string; defaultValue?: string | number; type?: string }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-xs">{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} />
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4" />
      {label}
    </label>
  );
}

export function VehicleForm({ vehicle, isNew }: { vehicle?: Vehicle; isNew: boolean }) {
  const [state, action, pending] = useActionState(saveVehicle, null as { error?: string } | null);

  return (
    <form action={action}>
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="reg_no" label="Registration number *" defaultValue={vehicle?.regNo} />
            <Field name="rto" label="Registering authority" defaultValue={vehicle?.rto} />
            <Field name="maker" label="Maker" defaultValue={vehicle?.maker} />
            <Field name="model" label="Model" defaultValue={vehicle?.model} />
            <Field name="year" label="Year" type="number" defaultValue={vehicle?.year} />
            <Field name="color" label="Colour" defaultValue={vehicle?.color} />
            <Field name="vehicle_class" label="Class" defaultValue={vehicle?.vehicleClass ?? "Motor Car (LMV)"} />
            <Field name="emission" label="Emission norm" defaultValue={vehicle?.emission ?? "BS6"} />
            <div className="space-y-1">
              <Label htmlFor="fuel" className="text-xs">Fuel</Label>
              <select id="fuel" name="fuel" defaultValue={vehicle?.fuel ?? "PETROL"} className="h-8 w-full rounded-lg border bg-background px-2 text-sm">
                {["PETROL", "DIESEL", "CNG", "ELECTRIC"].map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs">Status</Label>
              <select id="status" name="status" defaultValue={vehicle?.status ?? "ACTIVE"} className="h-8 w-full rounded-lg border bg-background px-2 text-sm">
                {["ACTIVE", "BLACKLISTED", "SCRAPPED"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Field name="reg_date" label="Registration date" type="date" defaultValue={vehicle?.regDate} />
            <Field name="odometer_km" label="Odometer (km)" type="number" defaultValue={vehicle?.odometerKm} />
            <Field name="chassis_masked" label="Chassis (masked)" defaultValue={vehicle?.chassisMasked} />
            <Field name="engine_masked" label="Engine (masked)" defaultValue={vehicle?.engineMasked} />
          </div>

          <fieldset className="space-y-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">Loan / hypothecation</legend>
            <Check name="hypo_active" label="Active loan on the RC" defaultChecked={vehicle?.hypothecation.active} />
            <Check name="hypo_form35_pending" label="Form 35 not yet filed" defaultChecked={vehicle?.hypothecation.form35Pending} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="hypo_financier" label="Financier" defaultValue={vehicle?.hypothecation.financier} />
              <Field name="hypo_since" label="Since" type="date" defaultValue={vehicle?.hypothecation.since} />
            </div>
          </fieldset>

          <fieldset className="grid gap-3 rounded-md border p-3 sm:grid-cols-2">
            <legend className="px-1 text-sm font-medium">Documents</legend>
            <Field name="insurer" label="Insurer" defaultValue={vehicle?.insurance.insurer} />
            <Field name="insurance_till" label="Insurance valid till" type="date" defaultValue={vehicle?.insurance.validTill} />
            <Field name="puc_till" label="PUC valid till" type="date" defaultValue={vehicle?.puc.validTill} />
            <Field name="tax_till" label="Road tax till" type="date" defaultValue={vehicle?.tax.paidTill} />
            <Field name="fitness_till" label="Fitness till (commercial)" type="date" defaultValue={vehicle?.fitness?.validTill} />
          </fieldset>

          <fieldset className="space-y-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">Risk signals</legend>
            <Check name="accident_flag" label="Accident on record" defaultChecked={vehicle?.accident.flag} />
            <Field name="accident_note" label="Accident note" defaultValue={vehicle?.accident.note} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="fair_price_min" label="Fair price min (₹)" type="number" defaultValue={vehicle?.fairPrice.min} />
              <Field name="fair_price_max" label="Fair price max (₹)" type="number" defaultValue={vehicle?.fairPrice.max} />
            </div>
          </fieldset>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : isNew ? "Create vehicle" : "Save changes"}
            </Button>
            <Button variant="outline" nativeButton={false} render={<Link href="/admin" />}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
