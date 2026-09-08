import { test, expect } from "@playwright/test";
import { hydrated, login } from "./hydrated";

// The demo path proves the happy route. This one guards the invariant that
// route never exercises: the money is recorded with the unlock, so walking away
// mid-flow must not leave a receipt for a report you cannot open.
test("abandoning the unlock leaves no receipt", async ({ page }) => {
  await login(page);

  await page.goto("/check");
  await hydrated(page);
  await page.getByRole("button", { name: "GJ01AB1234", exact: true }).first().click();
  await page.getByTestId("unlock").click();
  await page.getByTestId("home-state").click();
  await page.getByRole("option", { name: "Gujarat", exact: true }).click();
  await page.getByTestId("transfer-confirm").click();

  await page.getByTestId("pay").click();
  await expect(page.getByTestId("pay-approved")).toBeVisible();
  await page.getByTestId("unlock-cancel").click();

  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("sarathi-one")!).state);
  expect(state.payments).toHaveLength(0);
  expect(state.unlockedReports).toHaveLength(0);

  // Reopening starts at the fee again, not halfway through a payment.
  await page.getByTestId("unlock").click();
  await page.getByTestId("transfer-confirm").click();
  await expect(page.getByTestId("pay")).toBeVisible();
  await expect(page.getByTestId("pay-approved")).toHaveCount(0);
});
