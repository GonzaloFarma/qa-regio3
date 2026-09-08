import type { Page, Locator } from '@playwright/test';

/**
 * Page Object del panel "Chips (filtros del listado de sucursales)" en VTEX
 * Site Editor (Header Desktop/Mobile > Contenedor de menú > Regionalizador >
 * Regionalizador > Chips > AGREGAR o editar uno existente).
 *
 * Etiquetas verificadas contra capturas reales del panel
 * (TQD-1128/chips-site-editor.png, transcritas en
 * docs/vtex/site-editor-panels-transcripcion.md) — el texto de cada label es
 * real, no adivinado. Lo que SIGUE sin verificar: la wiring exacta de
 * accesibilidad (si getByLabel resuelve cada campo tal cual, o si vtex.styleguide
 * no asocia <label for> y hace falta otra estrategia) y la estructura de
 * contenedor que distingue las 3 columnas de diseño repetidas (normal/
 * seleccionado/tarjeta) — el orden 0/1/2 abajo es una inferencia visual
 * (columna 2 con fondo verde = seleccionado), no una confirmación.
 */
export class SiteEditorChipsPage {
  constructor(private readonly page: Page) {}

  // --- Acciones de nivel panel ---

  get agregarChipButton(): Locator {
    return this.page.getByRole('button', { name: 'AGREGAR' });
  }

  /** Único botón APLICAR del formulario de un chip (funcional + las 3 columnas de diseño). */
  get aplicarButton(): Locator {
    return this.page.getByRole('button', { name: 'APLICAR' });
  }

  chipRowByName(nombreDelChip: string): Locator {
    // TODO: confirmar si la lista de chips es tabla, tarjetas o acordeon.
    return this.page.getByText(nombreDelChip, { exact: true });
  }

  // --- Columna 1: config funcional ---

  get nombreDelChipInput(): Locator {
    return this.page.getByLabel('Nombre del chip (sólo para identificarlo acá)');
  }

  get chipActivoToggle(): Locator {
    return this.page.getByLabel('Chip activo');
  }

  /** Valores vistos: "VTEX (cálculo de envío)". Falta confirmar el resto del listado. */
  get origenDelDatoSelect(): Locator {
    return this.page.getByLabel('Origen del dato');
  }

  get campoDeMasterDataInput(): Locator {
    return this.page.getByLabel('Campo de MasterData (si el origen es MasterData)');
  }

  /** Valor visto: "Retiro/envío sin costo". */
  get campoDeVtexSelect(): Locator {
    return this.page.getByLabel('Campo de VTEX (si el origen es VTEX)');
  }

  /** Valor visto: "es igual a". */
  get comparacionSelect(): Locator {
    return this.page.getByLabel('Comparación');
  }

  get valorDeComparacionInput(): Locator {
    return this.page.getByLabel('Valor de comparación');
  }

  get abreListaDeOpcionesToggle(): Locator {
    return this.page.getByLabel('Este chip abre una lista de opciones');
  }

  get traerOpcionesObraSocialToggle(): Locator {
    return this.page.getByLabel('Traer las opciones del listado de obras sociales');
  }

  get agregarOpcionButton(): Locator {
    return this.page.getByRole('button', { name: 'AGREGAR' }).nth(1);
  }

  /** Valor visto: "No mostrarlo en la tarjeta". Confirmar las otras dos opciones del select. */
  get mostrarEnTarjetaSelect(): Locator {
    return this.page.getByLabel('Mostrar también dentro de la tarjeta de la sucursal');
  }

  // --- Columnas 2-4: diseño por variante (normal / seleccionado / tarjeta, orden inferido) ---

  private byLabelNth(label: string, index: 0 | 1 | 2): Locator {
    return this.page.getByLabel(label).nth(index);
  }

  textoDelChip(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Texto del chip', index);
  }

  colorDelTexto(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Color del texto', index);
  }

  icono(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Ícono', index);
  }

  ordenDeLosElementos(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Orden de los elementos', index);
  }

  colorDeFondo(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Color de fondo', index);
  }

  colorDelBorde(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Color del borde', index);
  }

  anchoDelBorde(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Ancho del borde (en píxeles)', index);
  }

  sombra(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Sombra', index);
  }

  sombraAMedida(index: 0 | 1 | 2): Locator {
    return this.byLabelNth('Sombra a medida', index);
  }

  async open(): Promise<void> {
    // TODO: navegar hasta Header Desktop/Mobile > Contenedor de menú > Regionalizador
    // > Regionalizador, y desde ahi a Chips. El path del arbol esta documentado en
    // docs/vtex/site-editor-panels-transcripcion.md pero el click-through no esta probado.
    await this.page.goto(`${process.env.QA_SITE_EDITOR_PATH ?? '/admin/cms/site-editor'}`);
  }

  async reloadEditor(): Promise<void> {
    // Sin networkidle (RULE-2, CONVENCIONES.md): VTEX no lo resuelve nunca.
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }
}
