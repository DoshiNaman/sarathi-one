"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { serverClient, supabaseConfigured } from "@/lib/db/client";
import { requireAdmin } from "@/lib/db/auth";

export async function signIn(_prev: unknown, formData: FormData) {
  if (!supabaseConfigured()) return { error: "Supabase is not configured on this deployment." };
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const db = await serverClient();
  const { error } = await db.auth.signInWithPassword({ email, password });
  // Deliberately vague: never reveal whether the address exists.
  if (error) return { error: "Wrong email or password." };
  redirect("/admin");
}

export async function signOut() {
  const db = await serverClient();
  await db.auth.signOut();
  redirect("/admin/login");
}

/** Every mutation re-checks authority server-side; RLS enforces it again in the DB. */
export async function saveVehicle(_prev: unknown, formData: FormData) {
  await requireAdmin();
  const db = await serverClient();

  const regNo = String(formData.get("reg_no") ?? "").toUpperCase().trim();
  if (!/^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{1,4}$/.test(regNo)) {
    return { error: "Registration number looks invalid (e.g. GJ01AB1234)." };
  }

  const num = (k: string) => Number(formData.get(k) ?? 0) || 0;
  const text = (k: string) => String(formData.get(k) ?? "").trim() || null;
  const bool = (k: string) => formData.get(k) === "on";

  const { error } = await db.from("vehicles").upsert({
    reg_no: regNo,
    maker: String(formData.get("maker") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    year: num("year"),
    vehicle_class: String(formData.get("vehicle_class") ?? "Motor Car (LMV)"),
    fuel: String(formData.get("fuel") ?? "PETROL"),
    emission: String(formData.get("emission") ?? "BS6"),
    color: String(formData.get("color") ?? ""),
    rto: String(formData.get("rto") ?? ""),
    reg_date: text("reg_date"),
    chassis_masked: String(formData.get("chassis_masked") ?? ""),
    engine_masked: String(formData.get("engine_masked") ?? ""),
    status: String(formData.get("status") ?? "ACTIVE"),
    hypo_active: bool("hypo_active"),
    hypo_financier: text("hypo_financier"),
    hypo_since: text("hypo_since"),
    hypo_form35_pending: bool("hypo_form35_pending"),
    insurer: text("insurer"),
    insurance_till: text("insurance_till"),
    puc_till: text("puc_till"),
    tax_till: text("tax_till"),
    fitness_till: text("fitness_till"),
    accident_flag: bool("accident_flag"),
    accident_note: text("accident_note"),
    fair_price_min: num("fair_price_min"),
    fair_price_max: num("fair_price_max"),
    odometer_km: num("odometer_km"),
  });

  if (error) return { error: error.message };
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteVehicle(formData: FormData) {
  await requireAdmin();
  const db = await serverClient();
  await db.from("vehicles").delete().eq("reg_no", String(formData.get("reg_no")));
  revalidatePath("/admin");
}
