import { getFleet } from "@/lib/db/vehicles";

/** The whole fleet. Falls back to the synthetic fleet when the DB is unreachable. */
export async function GET() {
  const { vehicles, source } = await getFleet();
  return Response.json(
    { vehicles: vehicles.map((v) => v.regNo), source },
    { headers: { "Cache-Control": "no-store" } }
  );
}
