/** Emits seed SQL for the synthetic fleet, so the data can be loaded from the
 *  Supabase SQL editor without anyone handling a secret key. */
import { FLEET } from "../src/lib/data";

const q = (v: string | number | boolean | null | undefined) =>
  v === null || v === undefined || v === "" ? "null" : typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : String(v);

const lines: string[] = [
  "-- Synthetic demo fleet. Safe to re-run (upserts).",
  "-- Generated from src/lib/data.ts — no real vehicles, owners or people.",
  "",
];

lines.push("insert into public.vehicles (reg_no,maker,model,year,vehicle_class,fuel,emission,color,rto,reg_date,chassis_masked,engine_masked,status,hypo_active,hypo_financier,hypo_since,hypo_form35_pending,insurer,insurance_till,puc_till,tax_till,fitness_till,accident_flag,accident_note,fair_price_min,fair_price_max,odometer_km) values");
lines.push(
  FLEET.map((v) =>
    `(${[q(v.regNo),q(v.maker),q(v.model),v.year,q(v.vehicleClass),q(v.fuel),q(v.emission),q(v.color),q(v.rto),q(v.regDate),q(v.chassisMasked),q(v.engineMasked),q(v.status),v.hypothecation.active,q(v.hypothecation.financier),q(v.hypothecation.since),v.hypothecation.form35Pending ?? false,q(v.insurance.insurer),q(v.insurance.validTill),q(v.puc.validTill),q(v.tax.paidTill),q(v.fitness?.validTill),v.accident.flag,q(v.accident.note),v.fairPrice.min,v.fairPrice.max,v.odometerKm].join(",")})`
  ).join(",\n")
);
lines.push("on conflict (reg_no) do update set maker=excluded.maker, model=excluded.model, year=excluded.year, status=excluded.status, hypo_active=excluded.hypo_active, hypo_financier=excluded.hypo_financier, hypo_form35_pending=excluded.hypo_form35_pending, accident_flag=excluded.accident_flag, accident_note=excluded.accident_note, fair_price_min=excluded.fair_price_min, fair_price_max=excluded.fair_price_max, odometer_km=excluded.odometer_km;");
lines.push("");

lines.push("insert into public.owners (reg_no,serial,name,masked_name,from_date,to_date) values");
lines.push(
  FLEET.flatMap((v) => v.owners.map((o) => `(${[q(v.regNo),o.serial,q(o.name),q(o.maskedName),q(o.from),q(o.to)].join(",")})`)).join(",\n")
);
lines.push("on conflict (reg_no,serial) do update set name=excluded.name, masked_name=excluded.masked_name, from_date=excluded.from_date, to_date=excluded.to_date;");
lines.push("");

const challans = FLEET.flatMap((v) => v.challans.map((c) => `(${[q(c.id),q(v.regNo),q(c.date),q(c.offense),c.amount,q(c.status)].join(",")})`));
lines.push("insert into public.challans (id,reg_no,date,offense,amount,status) values");
lines.push(challans.join(",\n"));
lines.push("on conflict (id) do update set status=excluded.status, amount=excluded.amount;");

console.log(lines.join("\n"));
