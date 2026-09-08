import type { Page } from "@playwright/test";

/**
 * Wait until this document's React has run.
 *
 * `page.goto` resolves on load, which is before hydration. Everything these
 * tests do — a click that needs a handler, a mousemove that needs a listener —
 * is attached by JavaScript, so acting on the page at that point can be a
 * gesture sent into a document that is not listening yet. That is not a timeout
 * to raise either: waiting longer at the assertion cannot bring back a
 * mousemove that has already happened. It is why these specs passed on a fast
 * laptop and failed on a CI runner, and why a different one failed each run.
 *
 * `data-krishna` is written by the help panel's mount effect, and the panel is
 * in the chrome of every citizen route, so its presence is the signal.
 */
export async function hydrated(page: Page) {
  await page.waitForFunction(() => "krishna" in document.documentElement.dataset);
}

/** The demo login, which every spec but the landing one needs first. */
export async function login(page: Page) {
  await page.goto("/login");
  await hydrated(page);
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByRole("button", { name: /Send OTP/ }).click();
  await page.getByLabel("Enter OTP").fill("123456");
  await page.getByRole("button", { name: /Verify/ }).click();
}
