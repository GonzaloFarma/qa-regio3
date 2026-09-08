import { test as base } from '@playwright/test';
import { SiteEditorChipsPage } from '../pages/site-editor-chips.page';
import { RegionalizadorBarPage } from '../pages/regionalizador-bar.page';

interface FarmacityFixtures {
  siteEditorChips: SiteEditorChipsPage;
  regionalizadorBar: RegionalizadorBarPage;
}

/**
 * La autenticacion NO pasa por este fixture: farma5049 exige login + 2FA de
 * VTEX Admin, asi que la sesion se captura a mano una vez con `npm run
 * auth:save` (scripts/save-workspace-auth.js) y playwright.config.ts la carga
 * como `use.storageState` para toda la corrida. Si no se corrio auth:save
 * todavia (o la sesion expiro), la `page` que reciben estos Page Objects va a
 * pegar contra el gate de admin-login.
 */
export const test = base.extend<FarmacityFixtures>({
  siteEditorChips: async ({ page }, use) => {
    await use(new SiteEditorChipsPage(page));
  },
  regionalizadorBar: async ({ page }, use) => {
    await use(new RegionalizadorBarPage(page));
  },
});

export { expect } from '@playwright/test';
