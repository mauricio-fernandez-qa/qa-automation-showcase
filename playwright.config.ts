import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: [
    isCI ? ['github'] : ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'results/results.json' }], // read by the dashboard
  ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: env.apiUrl },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: env.webUrl },
    },
  ],
});
