import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Load local settings. .env is never committed; env.example holds the local Toolshop
// defaults and is the fallback (for example on a machine without a .env yet).
const envFile = fs.existsSync(path.join(__dirname, '.env')) ? '.env' : 'env.example';
process.loadEnvFile(path.join(__dirname, envFile));

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Local Toolshop's API runs only 5 PHP-FPM workers and a cold request can take ~5s.
  // At 4+ browsers the API queue backs up and the Angular route guards resolve late,
  // so tests time out (measured Day 2: 22/48 failed at 4 workers, repeat-each=5).
  // 2 workers keeps the API within capacity. Retries are not used to hide this.
  workers: process.env.CI ? 1 : 2,
  expect: { timeout: 10_000 },
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
  },

  projects: [
    // Logs in once per role and saves .auth/<role>.json.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['setup'],
    },
  ],
});
