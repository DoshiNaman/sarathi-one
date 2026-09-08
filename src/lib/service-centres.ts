import type { Vehicle } from "./types";

/**
 * Example authorised service centres for a vehicle's make, in the city its RTO
 * sits in. For the one thing a paper record cannot tell you: what the car is
 * like on a lift.
 *
 * Everything here is generated, and deliberately so. Naming a real workshop
 * beside an invented distance would be a false statement about a third party,
 * and printing an invented phone number that a worried buyer might actually
 * dial is worse than useless. So the numbers are masked the way the app masks
 * every other personal number, and the screen says plainly that no centre was
 * contacted. In production this list is the manufacturer's own dealer network.
 *
 * Derived from the registration number so a given car always shows the same
 * centres — a list that reshuffled on every render would read as noise.
 */
export type ServiceCentre = {
  name: string;
  area: string;
  km: string;
  /** Masked on purpose: see the note above. */
  phone: string;
};

/** A few real localities per city, so the areas at least sound like the place. */
const AREAS = new Map<string, string[]>([
  ["Ahmedabad", ["Naranpura", "Bopal", "Vastrapur"]],
  ["Vadodara", ["Gotri", "Akota", "Manjalpur"]],
  ["Rajkot", ["Kalawad Road", "Mavdi", "Gondal Road"]],
  ["Surat", ["Adajan", "Vesu", "Katargam"]],
  ["Gandhinagar", ["Sector 21", "Kudasan", "Infocity"]],
  ["Jamnagar", ["Indira Marg", "Patel Colony", "Summair Club Road"]],
  ["Bhavnagar", ["Kaliyabid", "Waghawadi Road", "Ghogha Circle"]],
  ["Delhi", ["Moti Nagar", "Okhla", "Wazirpur"]],
  ["Mumbai", ["Andheri East", "Chembur", "Kandivali"]],
  ["Bengaluru", ["Whitefield", "Jayanagar", "Hebbal"]],
  ["Jaipur", ["Vaishali Nagar", "Malviya Nagar", "Tonk Road"]],
]);

/**
 * "GJ01 - Ahmedabad" → "Ahmedabad", and "DL08 - Delhi (Wazirpur)" → "Delhi".
 *
 * Some RTO strings name the specific office in brackets. Keeping that made the
 * city miss the area table and fall back to itself, so the Delhi car offered a
 * centre in "Delhi (Wazirpur), Delhi (Wazirpur)".
 */
export function cityOf(rto: string): string {
  const [, named] = rto.split(" - ");
  return (named ?? rto).replace(/\s*\(.*\)\s*$/, "").trim();
}

/** Stable small integer from a string, so one car keeps one list. */
function seed(text: string): number {
  let n = 0;
  for (const ch of text) n = (n * 31 + ch.charCodeAt(0)) >>> 0;
  return n;
}

export function serviceCentresFor(v: Vehicle, count = 2): ServiceCentre[] {
  const city = cityOf(v.rto);
  const areas = AREAS.get(city) ?? [city];
  const n = seed(v.regNo);
  return Array.from({ length: Math.min(count, areas.length) }, (_, i) => {
    // >>> keeps this unsigned. A signed shift on a seed past 2^31 turned the
    // distance negative — "-2.1 km" shipped straight out of the first run.
    const step = (n + i * 7919) >>> 0;
    const area = areas[(n + i) % areas.length];
    return {
      name: `${v.maker} Authorised Service`,
      // No ", City" when the area *is* the city — that is the fallback path for
      // a place we have no localities for, and it read as a stutter.
      area: area === city ? city : `${area}, ${city}`,
      // 2.0-9.5 km, one decimal, stable per car.
      km: `${(2 + ((step >>> 3) % 76) / 10).toFixed(1)} km`,
      // Masked, like every other number the app shows. Not dialable, on purpose.
      phone: `+91 •••••${String(10000 + (step % 90000)).slice(-4)}`,
    };
  });
}
