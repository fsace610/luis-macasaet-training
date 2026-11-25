import { defineConfig, devices } from '@playwright/test';

// Inherited suite for Day 6. Run: npx playwright test -c legacy-suite/playwright.legacy.config.ts
export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { outputFolder: '../playwright-report-legacy', open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4200',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
