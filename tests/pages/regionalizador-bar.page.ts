import type { Page, Locator } from '@playwright/test';

/**
 * Page Object de la barra de chips del Regionalizador en el storefront (no en el editor).
 *
 * TODO (pendiente de inspeccion real en farma5049): igual que en SiteEditorChipsPage, estos
 * locators son mejor esfuerzo por rol/texto y no fueron verificados contra el DOM real de
 * la barra ni de las tarjetas de sucursal.
 */
export class RegionalizadorBarPage {
  constructor(private readonly page: Page) {}

  get barra(): Locator {
    // TODO: confirmar rol/nombre accesible real de la barra de filtros.
    return this.page.getByRole('toolbar', { name: /filtros/i });
  }

  chipByText(texto: string): Locator {
    return this.barra.getByText(texto, { exact: true });
  }

  limpiarFiltroButton(texto: string): Locator {
    // La "X" automatica que aparece al seleccionar un chip.
    return this.chipByText(texto).getByRole('button', { name: /quitar|limpiar/i });
  }

  get listadoSucursales(): Locator {
    // TODO: confirmar el contenedor real del listado de tarjetas de sucursal.
    return this.page.getByTestId('listado-sucursales');
  }

  sucursalCardById(id: string): Locator {
    return this.listadoSucursales.getByTestId(`sucursal-${id}`);
  }

  async seleccionarChip(texto: string): Promise<void> {
    await this.chipByText(texto).click();
  }

  async abrirRegionalizador(): Promise<void> {
    // TODO: confirmar el trigger real (boton "Elegir sucursal", icono de ubicacion, etc.).
    await this.page.getByRole('button', { name: /regionalizador|elegir sucursal/i }).click();
  }
}
