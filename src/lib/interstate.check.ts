/**
 * Self-check for the inter-state re-registration gates — the money path.
 * Not part of the app bundle.
 *
 *   bun src/lib/interstate.check.ts
 */
import assert from "node:assert/strict";
import { FLEET } from "./data";
import { checkTransfer, stateOf } from "./interstate";

// Fixtures are derived from a real fleet car by property, then spread-overridden
// for the cases the fleet does not carry — so no `as Vehicle` casts are needed.
const anyCar = FLEET[0];
const car = (regNo: string, regDate: string, fuel: (typeof FLEET)[number]["fuel"] = "DIESEL") => ({
  ...anyCar,
  regNo,
  regDate,
  fuel,
  hypothecation: { active: false },
});

// The plate parser is the whole feature's foundation.
assert.equal(stateOf("DL8CAF2358"), "DL", "DL plate → DL");
assert.equal(stateOf("GJ01AB1234"), "GJ", "GJ plate → GJ");
assert.equal(stateOf("ZZ01AB1234"), null, "unknown prefix → null");

// Delhi diesel, 15+ yrs, to Gujarat → RESTRICTED (cannot leave Delhi).
assert.equal(
  checkTransfer(car("DL8CAF2358", "2011-06-01"), "GJ").grade,
  "RESTRICTED",
  "old Delhi diesel should be RESTRICTED"
);
// Delhi diesel, 11-15 yrs → CHECK_RTO (conditional NOC).
assert.equal(
  checkTransfer(car("DL3CAB1111", "2014-01-01"), "GJ").grade,
  "CHECK_RTO",
  "11-15yr Delhi diesel should be CHECK_RTO"
);
// Young petrol, Gujarat → Maharashtra → UNKNOWN, with the interstate basics.
const young = checkTransfer(car("GJ01AB1234", "2022-01-01", "PETROL"), "MH");
assert.equal(young.grade, "UNKNOWN", "young GJ→MH petrol should be UNKNOWN");
assert.ok(young.points.length >= 4, "interstate basics should be listed");
// Same state → FINE.
assert.equal(
  checkTransfer(car("GJ01AB1234", "2022-01-01", "PETROL"), "GJ").grade,
  "FINE",
  "same-state should be FINE"
);
// Diesel >10yr moving INTO Delhi → CHECK_RTO on the destination gate.
assert.equal(
  checkTransfer(car("MH12AB2222", "2012-01-01"), "DL").grade,
  "CHECK_RTO",
  "old diesel into DL should be CHECK_RTO"
);

console.log("interstate: ok");
