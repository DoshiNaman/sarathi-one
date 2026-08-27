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
          command: "bun run dev",
          url: baseURL,
          reuseExistingServer: true,
          timeout: 60_000,
        },
      }),
});
