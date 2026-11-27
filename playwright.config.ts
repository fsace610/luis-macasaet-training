import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const envFile = fs.existsSync(path.join(__dirname, '.env')) ? '.env' : 'env.example';
process.loadEnvFile(path.join(__dirname, envFile));

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
