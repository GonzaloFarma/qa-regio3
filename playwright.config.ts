import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

import 'dotenv/config';

// QA_BASE_URL apunta al workspace de desarrollo farma5049, no a produccion.
const baseURL = process.env.QA_BASE_URL ?? 'https://farma5049--farmacityar.myvtex.com';

// farma5049 exige login + 2FA de VTEX Admin (no automatizable): la sesion se
// captura a mano una vez con `npm run auth:save` (scripts/save-workspace-auth.js)
// y se reutiliza desde aca. Si el archivo todavia no existe, se corre sin
// sesion — los tests que necesiten estar autenticados van a fallar o quedar
// bloqueados por el gate de admin-login hasta que se corra auth:save.
const storageStatePath = path.resolve(
  __dirname,
  process.env.QA_STORAGE_STATE ?? '.auth/farma5049.json',
);
const storageState = fs.existsSync(storageStatePath) ? storageStatePath : undefined;

export default defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // El admin de VTEX (farma5049) tarda en cargar y despues necesita tiempo de
  // hidratacion antes de responder a clicks (ver site-editor-regionalizer-panel.page.ts).
  // El default de 30s no alcanza para navegar el arbol del Site Editor.
  timeout: 120000,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL,
    storageState,
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
