import { defineConfig, devices } from '@playwright/test';

// QA_BASE_URL apunta al workspace de desarrollo farma5049, no a produccion.
// No hay dotenv como dependencia todavia: si se necesita cargar .env automaticamente,
// agregar `dotenv` como devDependency y llamar a su config() aca antes de leer process.env.
const baseURL = process.env.QA_BASE_URL ?? 'https://farma5049--farmacityar.myvtex.com';

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
