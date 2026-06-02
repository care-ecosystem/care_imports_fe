import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/globalSetup",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: process.env.CARE_BASE_URL || "http://localhost:4000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Setup project — runs serially because setup specs have ordering dependencies
    { name: "setup", testMatch: /.*\.setup\.ts/, fullyParallel: false },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: process.env.CI ? [] : ["setup"],
    },
  ],
});
