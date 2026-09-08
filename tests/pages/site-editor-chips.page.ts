import type { Page, Locator } from '@playwright/test';
import { findSiteEditorAppFrame } from '../utils/site-editor-tree.helper';
import { fieldByCaption } from '../utils/site-editor-field.helper';

/**
 * Page Object del panel "Chips (filtros del listado de sucursales)" en VTEX
 * Site Editor (Header Desktop/Mobile > Contenedor de menú > Regionalizador >
 * Regionalizador > Chips > AGREGAR o editar uno existente).
 *
 * Verificado en vivo el 2026-09-08 contra farma5049 (headless, sesion de
 * auth:save), abriendo AGREGAR de un chip nuevo sin llegar a APLICAR/GUARDAR
 * (no se persistio nada — no habia ningun chip configurado en el ambiente en
 * ese momento). Todos los locators de abajo resolvieron con count=1 cada uno.
 *
 * Los campos viven dentro del iframe admin/app/cms/site-editor, no en la
 * pagina principal — por eso cada getter resuelve el frame primero (ver
 * tests/utils/site-editor-tree.helper.ts). Usan fieldByCaption en vez de
 * getByLabel: varios campos tienen texto de ayuda dentro del mismo <label>
 * que diluye el nombre accesible (ver tests/utils/site-editor-field.helper.ts).
 */
export class SiteEditorChipsPage {
  constructor(private readonly page: Page) {}

  private frame() {
    return findSiteEditorAppFrame(this.page);
  }

  // --- Acciones de nivel panel ---

  /** El AGREGAR de Chips es el primero de los 3 AGREGAR del panel raiz (Chips/Orden/Banner). */
  async agregarChipButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'AGREGAR' }).nth(0);
  }

  /** Único botón APLICAR del formulario de un chip (funcional + las 3 columnas de diseño). */
  async aplicarButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'APLICAR' });
  }

  async chipRowByName(nombreDelChip: string): Promise<Locator> {
    // TODO: confirmar con un chip real existente (no habia ninguno al verificar).
    return (await this.frame()).getByText(nombreDelChip, { exact: true });
  }

  // --- Columna 1: config funcional ---

  async nombreDelChipInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Nombre del chip (sólo para identificarlo acá)');
  }

  async chipActivoToggle(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Chip activo');
  }

  /** Valores vistos: "VTEX (cálculo de envío)", "MasterData (datos de la sucursal)". */
  async origenDelDatoSelect(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Origen del dato');
  }

  async campoDeMasterDataInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Campo de MasterData (si el origen es MasterData)');
  }

  /** Valor visto: "Retiro/envío sin costo". */
  async campoDeVtexSelect(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Campo de VTEX (si el origen es VTEX)');
  }

  /** Valor visto: "es igual a". */
  async comparacionSelect(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Comparación');
  }

  async valorDeComparacionInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Valor de comparación');
  }

  async abreListaDeOpcionesToggle(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Este chip abre una lista de opciones');
  }

  async traerOpcionesObraSocialToggle(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Traer las opciones del listado de obras sociales');
  }

  /** El AGREGAR de opciones manuales, dentro del mismo panel que agregarChipButton. */
  async agregarOpcionButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'AGREGAR' }).nth(1);
  }

  /** Valor visto: "No mostrarlo en la tarjeta". Confirmar las otras dos opciones del select. */
  async mostrarEnTarjetaSelect(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Mostrar también dentro de la tarjeta de la sucursal');
  }

  // --- Columnas 2-4: diseño por variante (normal / seleccionado / tarjeta, orden inferido) ---

  async textoDelChip(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Texto del chip', index);
  }

  async colorDelTexto(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Color del texto', index);
  }

  async icono(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Ícono', index);
  }

  async ordenDeLosElementos(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Orden de los elementos', index);
  }

  async colorDeFondo(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Color de fondo', index);
  }

  async colorDelBorde(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Color del borde', index);
  }

  async anchoDelBorde(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Ancho del borde (en píxeles)', index);
  }

  async sombra(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Sombra', index);
  }

  async sombraAMedida(index: 0 | 1 | 2): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Sombra a medida', index);
  }

  async reloadEditor(): Promise<void> {
    // Sin networkidle (RULE-2, CONVENCIONES.md): VTEX no lo resuelve nunca.
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }
}
