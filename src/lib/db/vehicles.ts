import "server-only";
import { serverClient, supabaseConfigured } from "./client";
import { FLEET } from "../data";
import type { Vehicle } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Maps a database row (snake_case, flat) onto the app's Vehicle shape. */
function rowToVehicle(v: any, owners: any[], challans: any[]): Vehicle {
  return {
    regNo: v.reg_no,
    maker: v.maker,
    model: v.model,
    year: v.year,
    vehicleClass: v.vehicle_class,
    fuel: v.fuel,
    emission: v.emission,
    color: v.color,
    rto: v.rto,
    regDate: v.reg_date,
    chassisMasked: v.chassis_masked,
    engineMasked: v.engine_masked,
    status: v.status,
    owners: owners
      .filter((o) => o.reg_no === v.reg_no)
      .sort((a, b) => a.serial - b.serial)
      .map((o) => ({
        serial: o.serial,
        name: o.name,
        maskedName: o.masked_name,
        from: o.from_date,
        to: o.to_date ?? undefined,
      })),
    hypothecation: {
      active: v.hypo_active,
      financier: v.hypo_financier ?? undefined,
      since: v.hypo_since ?? undefined,
      form35Pending: v.hypo_form35_pending,
    },
    insurance: { insurer: v.insurer ?? "—", validTill: v.insurance_till ?? "" },
    puc: { validTill: v.puc_till ?? "" },
    tax: { paidTill: v.tax_till ?? "" },
    fitness: v.fitness_till ? { validTill: v.fitness_till } : undefined,
    challans: challans
      .filter((c) => c.reg_no === v.reg_no)
      .map((c) => ({ id: c.id, date: c.date, offense: c.offense, amount: c.amount, status: c.status })),
    accident: { flag: v.accident_flag, note: v.accident_note ?? undefined },
    fairPrice: { min: v.fair_price_min, max: v.fair_price_max },
    odometerKm: v.odometer_km,
  };
}

export type FleetResult = { vehicles: Vehicle[]; source: "supabase" | "mock" };

/**
 * The single read path for vehicle data.
 *
 * Tries Supabase, falls back to the synthetic fleet on ANY failure — unset env,
 * paused project, network error, empty table. The demo must survive a judge
 * opening it weeks after submission, when a free-tier database may have slept.
 */
export async function getFleet(): Promise<FleetResult> {
  if (!supabaseConfigured()) return { vehicles: FLEET, source: "mock" };
  try {
    const db = await serverClient();
    const [v, o, c] = await Promise.all([
      db.from("vehicles").select("*"),
      db.from("owners").select("*"),
      db.from("challans").select("*"),
    ]);
    if (v.error || !v.data?.length) return { vehicles: FLEET, source: "mock" };
    return {
      vehicles: v.data.map((row) => rowToVehicle(row, o.data ?? [], c.data ?? [])),
      source: "supabase",
    };
  } catch {
    return { vehicles: FLEET, source: "mock" };
  }
}

export async function getVehicle(regNo: string): Promise<{ vehicle?: Vehicle; source: string }> {
  const { vehicles, source } = await getFleet();
  const key = regNo.toUpperCase().replace(/\s/g, "");
  return { vehicle: vehicles.find((x) => x.regNo.toUpperCase().replace(/\s/g, "") === key), source };
}
