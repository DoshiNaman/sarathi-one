import { defineConfig } from "@playwright/test";

// Set BASE_URL to smoke-test a deployed build instead of a local dev server.
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: { baseURL },
  ...(process.env.BASE_URL
    ? {}
    : {
        webServer: {
          // CI has already run `bun run build`, so serve that build. Under
          // `next dev` every route compiles on first hit, and once three.js and
          // the two WebGL fields landed, the six-route journey stopped fitting
          // inside the test timeout. Locally `dev` stays, so a run picks up
          // whatever you are editing.
          command: process.env.CI ? "bun run start" : "bun run dev",
          url: baseURL,
          reuseExistingServer: true,
          timeout: 60_000,
        },
      }),
});
