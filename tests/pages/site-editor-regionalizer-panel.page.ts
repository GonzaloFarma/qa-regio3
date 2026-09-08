import type { Page, Locator } from '@playwright/test';

/**
 * Page Object del panel raiz "Regionalizador" en Site Editor (el bloque hoja
 * del arbol, antes de entrar a Chips u Orden). Etiquetas verificadas contra
 * TQD-1128/config-site-editor.png (transcritas en
 * docs/vtex/site-editor-panels-transcripcion.md). Wiring de accesibilidad sin
 * confirmar en vivo, igual que en SiteEditorChipsPage.
 */
export class SiteEditorRegionalizerPanelPage {
  constructor(private readonly page: Page) {}

  get atrasLink(): Locator {
    return this.page.getByRole('link', { name: 'ATRÁS' }).or(
      this.page.getByRole('button', { name: 'ATRÁS' }),
    );
  }

  get versionesLink(): Locator {
    return this.page.getByText('VERSIONES', { exact: true });
  }

  get tituloPrimeraPantallaInput(): Locator {
    return this.page.getByLabel('Título de la primera pantalla');
  }

  get avisoInformativoInput(): Locator {
    return this.page.getByLabel('Aviso informativo');
  }

  get tituloTarjetaPickupInput(): Locator {
    return this.page.getByLabel('Título de la tarjeta').first();
  }

  get bajadaTarjetaPickupInput(): Locator {
    return this.page.getByLabel('Bajada de la tarjeta').first();
  }

  get iconoTarjetaPickupInput(): Locator {
    return this.page.getByLabel('Ícono de la tarjeta').first();
  }

  get tituloTarjetaDeliveryInput(): Locator {
    return this.page.getByLabel('Título de la tarjeta').last();
  }

  get bajadaTarjetaDeliveryInput(): Locator {
    return this.page.getByLabel('Bajada de la tarjeta').last();
  }

  get iconoTarjetaDeliveryInput(): Locator {
    return this.page.getByLabel('Ícono de la tarjeta').last();
  }

  get montoEnvioGratisInput(): Locator {
    return this.page.getByLabel('Monto a partir del cual el envío es gratis');
  }

  get retiroAutoTextoChipInput(): Locator {
    return this.page.getByLabel('Retiro en auto — texto del chip');
  }

  get retiroAutoLogoDropzone(): Locator {
    return this.page.getByLabel('Retiro en auto — logo del chip').first();
  }

  get retiroAutoLogoSeleccionadoDropzone(): Locator {
    return this.page.getByLabel('Retiro en auto — logo del chip seleccionado');
  }

  /** El toggle de TC-CHIP-21. */
  get mostrarBarraDeFiltrosToggle(): Locator {
    return this.page.getByLabel('Mostrar la barra de filtros (chips)');
  }

  /**
   * Este panel tiene tres botones "AGREGAR" (Chips, Orden, Banner) sin otro
   * atributo que los distinga en la captura. Se indexan por el orden visual
   * documentado en docs/vtex/site-editor-panels-transcripcion.md — pendiente
   * de confirmar contra el DOM real antes de confiar en el orden.
   */
  private agregarButtonNth(index: 0 | 1 | 2): Locator {
    return this.page.getByRole('button', { name: 'AGREGAR' }).nth(index);
  }

  get chipsAgregarButton(): Locator {
    return this.agregarButtonNth(0);
  }

  get ordenAgregarButton(): Locator {
    return this.agregarButtonNth(1);
  }

  get camposExtraMasterDataInput(): Locator {
    return this.page.getByLabel('Avanzado — Campos extra de MasterData');
  }

  get bannerAgregarButton(): Locator {
    return this.agregarButtonNth(2);
  }

  get cancelarButton(): Locator {
    return this.page.getByRole('button', { name: 'CANCELAR' });
  }

  get guardarButton(): Locator {
    return this.page.getByRole('button', { name: 'GUARDAR' });
  }
}
