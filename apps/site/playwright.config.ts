import { defineConfig, devices } from '@playwright/test';

const PORT = 4317;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Serves the static export (`turbo run test:e2e` builds first, producing out/).
  webServer: {
    command: `sirv out --port ${PORT} --quiet`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
