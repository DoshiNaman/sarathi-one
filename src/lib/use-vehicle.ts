"use client";
import { useEffect, useState } from "react";
import { findVehicle } from "./data";
import type { Vehicle } from "./types";

export type VehicleState = {
  vehicle: Vehicle | undefined;
  source: "supabase" | "mock" | "loading";
  notFound: boolean;
};

/**
 * Reads one vehicle through the API so the citizen sees whatever the admin panel
 * last saved. Seeds from the local synthetic fleet first, so the page renders
 * instantly and still works if the request fails.
 */
export function useVehicle(regNo: string | undefined): VehicleState {
  const seed = regNo ? findVehicle(regNo) : undefined;
  const [vehicle, setVehicle] = useState<Vehicle | undefined>(seed);
  const [source, setSource] = useState<VehicleState["source"]>("loading");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!regNo) return;
    let cancelled = false;
    fetch(`/api/vehicles/${encodeURIComponent(regNo)}`)
      .then(async (r) => {
        if (cancelled) return;
        if (r.status === 404) {
          // Only trust a 404 when we also have no local record for it.
          setNotFound(!findVehicle(regNo));
          setSource("mock");
          return;
        }
        setNotFound(false);
        const d = await r.json();
        if (cancelled || !d?.vehicle) return;
        setVehicle(d.vehicle);
        setSource(d.source === "supabase" ? "supabase" : "mock");
      })
      .catch(() => !cancelled && setSource("mock"));
    return () => {
      cancelled = true;
    };
  }, [regNo]);

  return { vehicle: vehicle ?? seed, source, notFound };
}
