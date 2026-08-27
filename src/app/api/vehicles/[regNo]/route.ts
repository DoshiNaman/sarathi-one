import { getVehicle } from "@/lib/db/vehicles";

/**
 * One vehicle, for the citizen journey. Goes through the same fallback as the
 * admin panel, so an edit made in /admin is what a citizen sees — and a sleeping
 * database still returns the synthetic record instead of an error page.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ regNo: string }> }) {
  const { regNo } = await params;
  const { vehicle, source } = await getVehicle(regNo);
  if (!vehicle) return Response.json({ error: "Not found", source }, { status: 404 });
  return Response.json({ vehicle, source }, { headers: { "Cache-Control": "no-store" } });
}
