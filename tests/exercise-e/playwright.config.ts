import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// load .env from repo root
const root = path.resolve(__dirname, '..', '..');
const envFile = fs.existsSync(path.join(root, '.env')) ? '.env' : 'env.example';
process.loadEnvFile(path.join(root, envFile));

export default defineConfig({
  testDir: __dirname,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  expect: { timeout: 10_000 },
  reporter: 'list',
  outputDir: path.join(root, 'test-results', 'exercise-e'),
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
