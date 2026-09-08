import type { Page, Locator } from '@playwright/test';

/**
 * Page Object del panel "Orden del listado de sucursales (retiro)" y su
 * editor de criterio anidado. Etiquetas verificadas contra
 * TQD-1128/orden-chips-site-editor.png (transcritas en
 * docs/vtex/site-editor-panels-transcripcion.md).
 *
 * Importante (ver docs/issues/2026-09-08-instancias-y-esquemas-regionalizer.md
 * #3): este panel edita, con alta probabilidad, el campo `ordenamientos`
 * (nombres de campo en español) y NO `sortRules` (inglés) — evidencia fuerte
 * por coincidencia de labels, no confirmacion 100%.
 */
export class SiteEditorOrderRulesPage {
  constructor(private readonly page: Page) {}

  get agregarReglaButton(): Locator {
    return this.page.getByRole('button', { name: 'AGREGAR' }).first();
  }

  reglaPorNombre(nombre: string): Locator {
    return this.page.getByText(nombre, { exact: true });
  }

  // --- Editor de regla ---

  get nombreDeLaReglaInput(): Locator {
    return this.page.getByLabel('Nombre de la regla (sólo para identificarla acá)');
  }

  get provinciaDondeAplicaInput(): Locator {
    return this.page.getByLabel('Provincia donde aplica');
  }

  get localidadDondeAplicaInput(): Locator {
    return this.page.getByLabel('Localidad donde aplica');
  }

  get aplicarABusquedaPorDireccionToggle(): Locator {
    return this.page.getByLabel('Aplicar a la búsqueda por dirección');
  }

  get criteriosDeOrdenAgregarButton(): Locator {
    return this.page.getByRole('button', { name: 'AGREGAR' }).last();
  }

  /** Único APLICAR visible en el editor de regla (antes de abrir un criterio). */
  get aplicarReglaButton(): Locator {
    return this.page.getByRole('button', { name: 'APLICAR' }).first();
  }

  // --- Editor de criterio (al presionar criteriosDeOrdenAgregarButton) ---

  get nombreDelCriterioInput(): Locator {
    return this.page.getByLabel('Nombre del criterio (sólo para identificarlo acá)');
  }

  /** Valor visto: "MasterData (datos de...)". */
  get origenDelDatoSelect(): Locator {
    return this.page.getByLabel('Origen del dato');
  }

  get campoDeMasterDataInput(): Locator {
    return this.page.getByLabel('Campo de MasterData');
  }

  /** Valor visto: "Demora de entrega (e...)". */
  get campoDeVtexSelect(): Locator {
    return this.page.getByLabel('Campo de VTEX (si el origen es VTEX)');
  }

  /** Valor visto: "es igual a". */
  get comoOrdenaEsteCriterioSelect(): Locator {
    return this.page.getByLabel('Cómo ordena este criterio');
  }

  get valorDeComparacionInput(): Locator {
    return this.page.getByLabel('Valor de comparación');
  }

  get aplicarCriterioButton(): Locator {
    return this.page.getByRole('button', { name: 'APLICAR' }).last();
  }
}
