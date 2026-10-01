import { defineConfig, devices } from '@playwright/test';

const PORT = 6007;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // Baselines are platform-specific; CI must render them in the same container image.
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}-{projectName}-{platform}{ext}',
  expect: { toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.002 } },
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], deviceScaleFactor: 1 } }],
  // Serves the static Storybook build (`turbo run test:e2e` builds it first).
  webServer: {
    command: `sirv storybook-static --port ${PORT} --quiet`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
