"use client";
import { useEffect, useState } from "react";
import { findVehicle } from "./data";
import type { Vehicle } from "./types";

export type VehicleState = {
  vehicle: Vehicle | undefined;
  source: "supabase" | "mock" | "loading";
  notFound: boolean;
};

type Loaded = { regNo: string; vehicle: Vehicle; source: "supabase" | "mock" };

/**
 * Reads one vehicle through the API so the citizen sees whatever the admin panel
 * last saved, falling back to the local synthetic record.
 *
 * The loaded record is stored WITH the reg-no it was fetched for. Next re-renders
 * this component when only the route param changes rather than remounting it, so
 * keying on the value is what stops a previous vehicle leaking onto the next
 * one's page — showing the wrong car on a Crash Card is not a cosmetic bug.
 */
export function useVehicle(regNo: string | undefined): VehicleState {
  const seed = regNo ? findVehicle(regNo) : undefined;
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [missing, setMissing] = useState<string | null>(null);

  useEffect(() => {
    if (!regNo) return;
    let cancelled = false;
    fetch(`/api/vehicles/${encodeURIComponent(regNo)}`)
      .then(async (r) => {
        if (cancelled) return;
        if (r.status === 404) {
          // Only believe a 404 when there is no local record either.
          setMissing(findVehicle(regNo) ? null : regNo);
          return;
        }
        const d = await r.json();
        if (cancelled || !d?.vehicle) return;
        setLoaded({ regNo, vehicle: d.vehicle, source: d.source === "supabase" ? "supabase" : "mock" });
      })
      .catch(() => {
        // Network failure: the seed below still renders the synthetic record.
      });
    return () => {
      cancelled = true;
    };
  }, [regNo]);

  const fresh = loaded && loaded.regNo === regNo ? loaded : null;
  return {
    vehicle: fresh?.vehicle ?? seed,
    source: fresh ? fresh.source : seed ? "mock" : "loading",
    notFound: missing === regNo && !seed,
  };
}
