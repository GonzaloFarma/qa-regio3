import type { Page, Locator } from '@playwright/test';
import { findSiteEditorAppFrame } from '../utils/site-editor-tree.helper';
import { fieldByCaption } from '../utils/site-editor-field.helper';

/**
 * Page Object del panel "Orden del listado de sucursales (retiro)" y su
 * editor de criterio anidado.
 *
 * VERIFICADO en vivo el 2026-09-08 contra la regla real "QA - Más stock
 * primero" (existe en farma5049, no hubo que crearla): reglaPorNombre,
 * nombreDeLaReglaInput, provinciaDondeAplicaInput (="Chaco"),
 * localidadDondeAplicaInput (="Resistencia"), aplicarABusquedaPorDireccionToggle
 * y aplicarReglaButton resolvieron correctamente con valores reales.
 *
 * CORREGIDO 2026-09-08 (ver docs/issues/2026-09-08-instancias-y-esquemas-regionalizer.md
 * #3): la sesion anterior de esta misma fecha infirio por coincidencia de
 * labels que este panel editaba `ordenamientos`. Al abrir el panel real, la
 * regla listada es **"QA - Más stock primero"** — el `__editorItemTitle`
 * real de `sortRules`, no el de `ordenamientos` ("Colegiales"). Es decir:
 * **este panel edita `sortRules`**, no `ordenamientos`.
 *
 * NO VERIFICADO / GAP CONOCIDO (ver docs/issues/2026-09-08-agregar-criterio-sin-efecto.md):
 * `criteriosDeOrdenAgregarButton` no tuvo ningun efecto observable al
 * clickearlo (probado con locator por rol+nth, por bounding box, y por texto
 * cercano - los tres casos, longitud de `body.innerText()` identica antes y
 * despues). No es un problema de hidratacion (se probo con espera previa) ni
 * de selector equivocado (se listaron los 4 AGREGAR presentes y se apunto al
 * correcto por contexto de texto). La causa real no se investigo mas a fondo
 * por costo/beneficio - todo el editor de criterio (nombreDelCriterioInput
 * en adelante) queda SIN VERIFICAR en vivo.
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

  /**
   * `.last()` esta MAL (probado): con la regla abierta hay 4 botones AGREGAR
   * en el DOM (el panel raiz - Chips/Orden/Banner - sigue montado detras),
   * y `.last()` no es el de Criterios de orden. Este locator ubica el
   * correcto por el texto cercano en vez de por posicion/orden - resuelve a
   * count:1, pero el click sobre el resultado no tuvo efecto observable
   * (ver el comentario de clase). No usar sin resolver antes ese gap.
   */
  async criteriosDeOrdenAgregarButton(): Promise<Locator> {
    const frame = await this.frame();
    return frame
      .locator('label, div', { has: frame.getByText('Criterios de orden (el primero manda)', { exact: true }) })
      .getByRole('button', { name: 'AGREGAR' })
      .first();
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
