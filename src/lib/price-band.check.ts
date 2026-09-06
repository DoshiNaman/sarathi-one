/**
 * Self-check for the price band maths. Not part of the app bundle.
 *
 *   bun src/lib/price-band.check.ts
 */
import assert from "node:assert/strict";
import { DEMO_NOW, FLEET } from "./data";
import { buildPriceBand, DEALER_DISCOUNT, RETAIL_MARKUP } from "./price-band";

/**
 * Fixtures are chosen by the property under test, never by registration number.
 * Plate-keyed fixtures broke twice: once when the fleet's plates were
 * reassigned and again when the reports moved between them. Both times the test
 * still passed its own assertions while testing the wrong car.
 */
const age = (v: (typeof FLEET)[number]) => DEMO_NOW.getFullYear() - v.year;
const pick = (label: string, match: (v: (typeof FLEET)[number]) => boolean) => {
  const found = FLEET.find(match);
  if (!found) throw new Error(`no fixture in the fleet for: ${label}`);
  return found;
};

// Well under the ~10,000 km/year the band expects, and nothing else against it.
const lightlyUsed = pick(
  "lightly used",
  (v) => v.fairPrice.max > 0 && !v.accident.flag && v.odometerKm < age(v) * 7500
);
// Everything against it: high mileage, several owners, damage on record.
const hardUsed = pick(
  "hard used",
  (v) => v.fairPrice.max > 0 && v.accident.flag && v.odometerKm > age(v) * 11000
);
const santro = pick("past the GR.8 schedule", (v) => age(v) > 5);
const recent = pick("inside the GR.8 schedule", (v) => age(v) <= 5 && !!v.exShowroomPrice);

const mid = (b: { min: number; max: number } | null) => (b ? (b.min + b.max) / 2 : null);
const row = (v: Parameters<typeof buildPriceBand>[0], consented: boolean, c: string) =>
  buildPriceBand(v, consented).rows.find((r) => r.channel === c)!;

// The rows stay in order: a dealer offers least, retail lists highest.
for (const consented of [false, true]) {
  const d = mid(row(lightlyUsed, consented, "DEALER").band)!;
  const p = mid(row(lightlyUsed, consented, "PRIVATE").band)!;
  const r = mid(row(lightlyUsed, consented, "RETAIL").band)!;
  assert.ok(d < p && p < r, `channels out of order (consented=${consented})`);
  assert.ok(Math.abs(d / p - (1 - DEALER_DISCOUNT)) < 1e-9, "dealer spread drifted");
  assert.ok(Math.abs(r / p - (1 + RETAIL_MARKUP)) < 1e-9, "retail spread drifted");
}

// Consent narrows the band. That narrowing is the whole feature.
const wide = buildPriceBand(lightlyUsed, false).rows.find((r) => r.channel === "PRIVATE")!.band!;
const narrow = buildPriceBand(lightlyUsed, true).rows.find((r) => r.channel === "PRIVATE")!.band!;
assert.ok(narrow.max - narrow.min < wide.max - wide.min, "consent did not narrow the band");
assert.equal(
  buildPriceBand(lightlyUsed, false).reasons.length,
  0,
  "public record must give no reasons"
);
// Consent explains itself in both directions: a well-kept car is worth more,
// a hard-used one less, and each says why.
const priv = (v: Parameters<typeof buildPriceBand>[0], consented: boolean) =>
  mid(buildPriceBand(v, consented).rows.find((r) => r.channel === "PRIVATE")!.band)!;

assert.ok(buildPriceBand(lightlyUsed, true).reasons.length > 0, "light use must be explained");
assert.ok(priv(lightlyUsed, true) > priv(lightlyUsed, false), "low km should lift the band");

assert.ok(buildPriceBand(hardUsed, true).reasons.length > 1, "a bad record must say why");
assert.ok(priv(hardUsed, true) < priv(hardUsed, false), "high km should push the band down");

// Past five years GR.8 stops, so we must show nothing rather than guess.
assert.equal(row(santro, true, "INSURANCE").band, null, "IDV must be blank past 5 years");
assert.equal(buildPriceBand(santro, true).pastOfficialSchedule, true);
assert.notEqual(row(recent, true, "INSURANCE").band, null, "IDV must exist within 5 years");

console.log("price-band: ok");
