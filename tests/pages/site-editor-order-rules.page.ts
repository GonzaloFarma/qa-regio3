import type { Page, Locator } from '@playwright/test';
import { findSiteEditorAppFrame } from '../utils/site-editor-tree.helper';
import { fieldByCaption } from '../utils/site-editor-field.helper';

/**
 * Page Object del panel "Orden del listado de sucursales (retiro)" y su
 * editor de criterio anidado. Etiquetas verificadas contra
 * TQD-1128/orden-chips-site-editor.png (transcritas en
 * docs/vtex/site-editor-panels-transcripcion.md). No probado en vivo con un
 * criterio real abierto (ver SiteEditorChipsPage/SiteEditorRegionalizerPanelPage
 * para los patrones ya confirmados: fieldByCaption + frame del iframe
 * admin/app/cms/site-editor).
 *
 * CORREGIDO 2026-09-08 (ver docs/issues/2026-09-08-instancias-y-esquemas-regionalizer.md
 * #3): la sesion anterior de esta misma fecha infirio por coincidencia de
 * labels que este panel editaba `ordenamientos`. Al abrir el panel real en
 * vivo, la regla listada es **"QA - Más stock primero"** — el
 * `__editorItemTitle` real de `sortRules`, no el de `ordenamientos`
 * ("Colegiales"). Es decir: **este panel edita `sortRules`**, no
 * `ordenamientos`. Sigue sin confirmarse con desarrollo cual es cual en el
 * codigo del componente.
 */
export class SiteEditorOrderRulesPage {
  constructor(private readonly page: Page) {}

  private frame() {
    return findSiteEditorAppFrame(this.page);
  }

  async agregarReglaButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'AGREGAR' }).first();
  }

  async reglaPorNombre(nombre: string): Promise<Locator> {
    return (await this.frame()).getByText(nombre, { exact: true });
  }

  // --- Editor de regla ---

  async nombreDeLaReglaInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Nombre de la regla (sólo para identificarla acá)');
  }

  async provinciaDondeAplicaInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Provincia donde aplica');
  }

  async localidadDondeAplicaInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Localidad donde aplica');
  }

  async aplicarABusquedaPorDireccionToggle(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Aplicar a la búsqueda por dirección');
  }

  async criteriosDeOrdenAgregarButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'AGREGAR' }).last();
  }

  /** Único APLICAR visible en el editor de regla (antes de abrir un criterio). */
  async aplicarReglaButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'APLICAR' }).first();
  }

  // --- Editor de criterio (al presionar criteriosDeOrdenAgregarButton) ---

  async nombreDelCriterioInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Nombre del criterio (sólo para identificarlo acá)');
  }

  /** Valor visto: "MasterData (datos de...)". */
  async origenDelDatoSelect(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Origen del dato');
  }

  async campoDeMasterDataInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Campo de MasterData');
  }

  /** Valor visto: "Demora de entrega (e...)". */
  async campoDeVtexSelect(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Campo de VTEX (si el origen es VTEX)');
  }

  /** Valor visto: "es igual a". */
  async comoOrdenaEsteCriterioSelect(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Cómo ordena este criterio');
  }

  async valorDeComparacionInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Valor de comparación');
  }

  async aplicarCriterioButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'APLICAR' }).last();
  }
}
