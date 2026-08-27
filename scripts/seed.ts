/**
 * Seeds the synthetic fleet into Supabase. Idempotent: safe to re-run.
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from "@supabase/supabase-js";
import { FLEET } from "../src/lib/data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first (see supabase/SETUP.md).");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const vehicles = FLEET.map((v) => ({
  reg_no: v.regNo, maker: v.maker, model: v.model, year: v.year,
  vehicle_class: v.vehicleClass, fuel: v.fuel, emission: v.emission, color: v.color,
  rto: v.rto, reg_date: v.regDate, chassis_masked: v.chassisMasked, engine_masked: v.engineMasked,
  status: v.status,
  hypo_active: v.hypothecation.active, hypo_financier: v.hypothecation.financier ?? null,
  hypo_since: v.hypothecation.since ?? null, hypo_form35_pending: v.hypothecation.form35Pending ?? false,
  insurer: v.insurance.insurer, insurance_till: v.insurance.validTill,
  puc_till: v.puc.validTill, tax_till: v.tax.paidTill, fitness_till: v.fitness?.validTill ?? null,
  accident_flag: v.accident.flag, accident_note: v.accident.note ?? null,
  fair_price_min: v.fairPrice.min, fair_price_max: v.fairPrice.max, odometer_km: v.odometerKm,
}));

const owners = FLEET.flatMap((v) =>
  v.owners.map((o) => ({
    reg_no: v.regNo, serial: o.serial, name: o.name,
    masked_name: o.maskedName, from_date: o.from, to_date: o.to ?? null,
  }))
);

const challans = FLEET.flatMap((v) =>
  v.challans.map((c) => ({
    id: c.id, reg_no: v.regNo, date: c.date, offense: c.offense, amount: c.amount, status: c.status,
  }))
);

const { error: ve } = await db.from("vehicles").upsert(vehicles);
if (ve) throw ve;
const { error: oe } = await db.from("owners").upsert(owners, { onConflict: "reg_no,serial" });
if (oe) throw oe;
const { error: ce } = await db.from("challans").upsert(challans);
if (ce) throw ce;

console.log(`Seeded ${vehicles.length} vehicles, ${owners.length} owners, ${challans.length} challans.`);
