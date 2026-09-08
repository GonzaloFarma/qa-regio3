import { test as base } from '@playwright/test';
import { SiteEditorChipsPage } from '../pages/site-editor-chips.page';
import { RegionalizadorBarPage } from '../pages/regionalizador-bar.page';

interface FarmacityFixtures {
  siteEditorChips: SiteEditorChipsPage;
  regionalizadorBar: RegionalizadorBarPage;
}

/**
 * TODO (pendiente de inspeccion real): este fixture todavia no autentica contra el admin
 * de farma5049. El mecanismo real (SSO, usuario/clave, token de VTEX IO) no esta
 * confirmado - ver .env.example. Hasta resolverlo, los Page Objects reciben la `page` tal
 * cual la entrega Playwright, sin sesion iniciada.
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
