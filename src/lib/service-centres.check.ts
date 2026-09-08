/**
 * Self-check for the service-centre list. Not part of the app bundle.
 *
 *   bun src/lib/service-centres.check.ts
 */
import assert from "node:assert/strict";
import { FLEET } from "./data";
import { cityOf, serviceCentresFor } from "./service-centres";

assert.equal(cityOf("GJ01 - Ahmedabad"), "Ahmedabad");
assert.equal(cityOf("DL08 - Delhi (Wazirpur)"), "Delhi");
// A shape we do not recognise must still give a city rather than an empty label.
assert.equal(cityOf("Somewhere"), "Somewhere");

for (const v of FLEET) {
  const centres = serviceCentresFor(v);
  assert.ok(centres.length > 0, `${v.regNo}: no centres`);

  // The same car must give the same list every time, or the page reshuffles.
  assert.deepEqual(centres, serviceCentresFor(v), `${v.regNo}: list is not stable`);

  for (const c of centres) {
    assert.ok(c.name.startsWith(v.maker), `${v.regNo}: centre is not for this make`);
    assert.match(c.km, /^\d+\.\d km$/, `${v.regNo}: bad distance`);
    // No dialable digits past the country code. A worried buyer must not be
    // able to ring an invented workshop.
    assert.match(c.phone, /^\+91 •••••\d{4}$/, `${v.regNo}: phone is not masked`);
  }

  // Two centres in one city must not be the same address.
  const areas = new Set(centres.map((c) => c.area));
  assert.equal(areas.size, centres.length, `${v.regNo}: duplicate areas`);

  // And an area must never name its city twice.
  for (const c of centres) {
    const [head, tail] = c.area.split(", ");
    assert.notEqual(head, tail, `${v.regNo}: area stutters — "${c.area}"`);
  }
}

console.log("service-centres: ok");
