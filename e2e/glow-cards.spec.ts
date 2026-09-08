import { test, expect } from "@playwright/test";

// The glow cards on /services and /garage. The pointer maths and the stretched
// link are easy to break silently, and the halo can widen the whole document.

test("the glow follows the nearest edge", async ({ page }) => {
  await page.goto("/services");
  const card = page.locator("[data-border-glow]").first();
  await expect(card).toBeVisible();
  const box = (await card.boundingBox())!;

  await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2);
  await page.waitForTimeout(300);
  const at = (el: HTMLElement) => el.style.getPropertyValue("--edge-proximity");
  expect(Number(await card.evaluate(at))).toBeGreaterThan(80);

  // The centre is the one place it must be dark.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(200);
  expect(Number(await card.evaluate(at))).toBeLessThan(30);

  // Leaving mid-move must not freeze it where the pointer left.
  await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width + 300, box.y - 200);
  await page.waitForTimeout(300);
  expect(Number(await card.evaluate(at))).toBe(0);
});

test("reduced motion keeps it dark", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services");
  const card = page.locator("[data-border-glow]").first();
  await expect(card).toBeVisible();
  const box = (await card.boundingBox())!;
  await page.mouse.move(box.x + box.width - 6, box.y + box.height / 2);
  await page.waitForTimeout(400);
  const edge = await card.evaluate((el: HTMLElement) =>
    el.style.getPropertyValue("--edge-proximity")
  );
  expect(edge === "" || Number(edge) === 0).toBe(true);
});

test("the whole card is the link, and there is only one", async ({ page }) => {
  await page.goto("/services");
  const card = page.locator("[data-border-glow]").first();
  await expect(card).toBeVisible();
  // One tab stop per card. A Start button as well would be a second stop to the
  // same place. The info trigger is a button, not a link, so it does not count.
  await expect(card.getByRole("link")).toHaveCount(1);

  // Click dead space near the foot of the card, far from the title.
  const box = (await card.boundingBox())!;
  await page.mouse.click(box.x + box.width / 2, box.y + box.height - 40);
  await expect(page).toHaveURL(/\/services\/fitness-ats/);
});

test("the note opens on hover and on click, without following the card", async ({ page }) => {
  await page.goto("/services");
  const info = page.locator("[data-border-glow]").first().getByRole("button").first();

  await info.hover();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.mouse.move(0, 0);

  // Tap has no hover to lean on, so the press has to work by itself — and it
  // must not fall through to the link stretched across the whole card.
  await info.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/\/services$/);
});

// The halo is thrown 40px past each card, and an absolutely positioned layer
// still counts toward scroll width — which put 20px of horizontal scroll on a
// phone once already. Every grid that carries these cards needs the clip, so
// each one is checked rather than trusting the shared CSS.
for (const route of ["/services", "/garage"]) {
  test(`the glow does not widen ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1400 });
    if (route === "/garage") {
      await page.goto("/login");
      await page.getByLabel("Mobile number").fill("9876543210");
      await page.getByRole("button", { name: /Send OTP/ }).click();
      await page.getByLabel("Enter OTP").fill("123456");
      await page.getByRole("button", { name: /Verify/ }).click();
    }
    await page.goto(route);
    await expect(page.locator("[data-border-glow]").first()).toBeVisible();
    const m = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: document.documentElement.clientWidth,
    }));
    expect(m.scrollW).toBeLessThanOrEqual(m.vw);
  });
}
