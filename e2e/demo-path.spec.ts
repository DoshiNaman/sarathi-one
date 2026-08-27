import { test, expect } from "@playwright/test";

// The one smoke test: the full demo path a hackathon reviewer will walk.
test("citizen journey: login → check → unlock → report → transfer → status", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByRole("button", { name: /Send OTP/ }).click();
  await page.getByLabel("Enter OTP").fill("123456");
  await page.getByRole("button", { name: /Verify/ }).click();
  await expect(page).toHaveURL(/garage/);

  // Check vehicle → free summary
  await page.goto("/check");
  await page.getByPlaceholder(/GJ01AB1234/).fill("GJ01AB1234");
  await page.getByTestId("search").click();
  await expect(page.getByText("Hypothecated")).toBeVisible();

  // Unlock: pay + consent OTP
  await page.getByTestId("unlock").click();
  await page.getByTestId("pay").click();
  await page.getByTestId("consent-otp").fill("123456");
  await page.getByTestId("unlock-confirm").click();

  // Report
  await expect(page).toHaveURL(/report\/GJ01AB1234/);
  await expect(page.getByText("HDFC Bank Ltd").first()).toBeVisible();
  await expect(page.getByText(/CAUTION/).first()).toBeVisible();

  // Transfer wizard
  await page.getByRole("button", { name: /Start guided transfer/ }).click();
  await page.getByLabel("Buyer full name").fill("Ravi Kumar");
  await page.getByLabel("Buyer mobile").fill("9123456780");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /Bundle Form 35/ }).click();
  for (let i = 0; i < 3; i++) await page.getByTestId("upload").first().click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: /Pay \(mock gateway\)/ }).click();
  await page.getByTestId("esign-otp").fill("123456");
  await page.getByRole("button", { name: /e-Sign & continue/ }).click();
  await page.locator('input[type="date"]').fill("2026-09-05");
  await page.getByRole("button", { name: "Book slot" }).click();
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByText("Application submitted")).toBeVisible();
  const appId = (await page.locator("p.font-mono").textContent()) ?? "";
  expect(appId).toMatch(/^GJ2026-/);

  // Status lookup
  await page.goto("/status");
  await page.getByPlaceholder("GJ2026-000001").fill(appId.trim());
  await page.getByRole("button", { name: "Track" }).click();
  await expect(page.getByText("TRANSFER OF OWNERSHIP")).toBeVisible();
});
