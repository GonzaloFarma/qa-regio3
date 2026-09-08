import type { Page, Locator } from '@playwright/test';

/**
 * Page Object del panel de configuracion de chips en VTEX Site Editor
 * (Header Desktop/Mobile > Regionalizador > Regionalizador > Chips).
 *
 * TODO (pendiente de inspeccion real en farma5049): todos los locators de abajo son
 * mejor esfuerzo por rol/texto visible, tomados de los nombres de campo documentados en
 * TQD-1128/Plan_TestCases_Chips.md. Ninguno fue verificado contra el DOM real del Site
 * Editor. Reemplazar por locators confirmados antes de usar en un test real (sacar el
 * `test.fixme` recien despues de esa verificacion).
 */
export class SiteEditorChipsPage {
  constructor(private readonly page: Page) {}

  get aplicarButton(): Locator {
    return this.page.getByRole('button', { name: 'APLICAR' });
  }

  get guardarButton(): Locator {
    return this.page.getByRole('button', { name: 'GUARDAR' });
  }

  get agregarChipButton(): Locator {
    return this.page.getByRole('button', { name: 'AGREGAR' });
  }

  chipRowByName(nombreInterno: string): Locator {
    // TODO: confirmar si la lista de chips es una tabla, un listado de tarjetas, o un
    // acordeon; ajustar el rol/estructura del locator segun corresponda.
    return this.page.getByText(nombreInterno, { exact: true });
  }

  get nombreInternoInput(): Locator {
    return this.page.getByLabel('Nombre interno');
  }

  get chipActivoToggle(): Locator {
    return this.page.getByLabel('Chip activo');
  }

  get origenSelect(): Locator {
    // Origen de la condicion: VTEX (calculo de envio) o MasterData.
    return this.page.getByLabel('Origen');
  }

  get campoSelect(): Locator {
    return this.page.getByLabel('Campo');
  }

  get comparacionSelect(): Locator {
    return this.page.getByLabel('Comparación');
  }

  get valorComparacionInput(): Locator {
    return this.page.getByLabel('Valor de comparación');
  }

  get textoNormalInput(): Locator {
    return this.page.getByLabel('Texto', { exact: false }).first();
  }

  get textoSeleccionadoInput(): Locator {
    return this.page.getByLabel('Texto', { exact: false }).last();
  }

  async open(): Promise<void> {
    // TODO: navegar hasta Header Desktop/Mobile > Regionalizador > Regionalizador > Chips.
    // El path real dentro del arbol del Site Editor no esta confirmado todavia.
    await this.page.goto(`${process.env.QA_SITE_EDITOR_PATH ?? '/admin/cms/site-editor'}`);
  }

  async reloadEditor(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }
}
