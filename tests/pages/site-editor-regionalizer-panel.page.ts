import type { Page, Locator } from '@playwright/test';
import { findSiteEditorAppFrame, openBlockByTreePath } from '../utils/site-editor-tree.helper';
import { fieldByCaption } from '../utils/site-editor-field.helper';
import { REGIONALIZER_DESKTOP_TREE_CHAIN } from '../domain/regionalizer-content';

/**
 * Page Object del panel raiz "Regionalizador" en Site Editor.
 *
 * Verificado en vivo el 2026-09-08 contra farma5049: `openDesktop()` navega
 * el arbol real (Header Desktop > Contenedor de menú > Regionalizador >
 * Regionalizador) y el panel resultante contiene exactamente los campos de
 * abajo, cada uno resuelto via fieldByCaption con count=1 (ver
 * tests/utils/site-editor-field.helper.ts para por que no getByLabel directo).
 * Todo vive en el iframe admin/app/cms/site-editor, no en la pagina principal.
 */
export class SiteEditorRegionalizerPanelPage {
  constructor(private readonly page: Page) {}

  private frame() {
    return findSiteEditorAppFrame(this.page);
  }

  /**
   * Navega desde /admin/cms/site-editor hasta el panel del bloque desktop.
   * Asume que `page` ya esta en /admin/cms/site-editor (o navega a esa URL
   * si no).
   */
  async openDesktop(): Promise<void> {
    if (!this.page.url().includes('/admin/cms/site-editor')) {
      // Ruta relativa: Playwright la resuelve contra use.baseURL del config.
      await this.page.goto(process.env.QA_SITE_EDITOR_PATH ?? '/admin/cms/site-editor', {
        waitUntil: 'domcontentloaded',
      });
    }
    const frame = await this.frame();
    // El tiempo de carga inicial del admin de VTEX es variable (verificado en vivo:
    // a veces resuelve en ~15s, a veces tarda mas) - margen generoso a proposito.
    await frame.getByText('Header Desktop', { exact: true }).waitFor({ state: 'visible', timeout: 45000 });
    // lint-disable: RULE-3 — las filas del arbol son visibles en el DOM antes de que
    // React termine de hidratar sus handlers de click; no se encontro una señal
    // observable de "hidratado" distinta de esperar. Verificado en vivo el 2026-09-08:
    // clicks antes de este punto no tienen ningun efecto (ni error, ni cambio de estado).
    await this.page.waitForTimeout(10000);
    await openBlockByTreePath(frame, REGIONALIZER_DESKTOP_TREE_CHAIN);
  }

  async atrasLink(): Promise<Locator> {
    const frame = await this.frame();
    return frame
      .getByRole('link', { name: 'ATRÁS', exact: true })
      .or(frame.getByRole('button', { name: 'ATRÁS', exact: true }));
  }

  async versionesLink(): Promise<Locator> {
    return (await this.frame()).getByText('VERSIONES', { exact: true });
  }

  async tituloPrimeraPantallaInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Título de la primera pantalla');
  }

  async avisoInformativoInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Aviso informativo');
  }

  async tituloTarjetaPickupInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Título de la tarjeta', 0);
  }

  async bajadaTarjetaPickupInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Bajada de la tarjeta', 0);
  }

  async iconoTarjetaPickupInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Ícono de la tarjeta', 0);
  }

  async tituloTarjetaDeliveryInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Título de la tarjeta', 1);
  }

  async bajadaTarjetaDeliveryInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Bajada de la tarjeta', 1);
  }

  async iconoTarjetaDeliveryInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Ícono de la tarjeta', 1);
  }

  async montoEnvioGratisInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Monto a partir del cual el envío es gratis');
  }

  async retiroAutoTextoChipInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Retiro en auto — texto del chip');
  }

  /** Dropzone de imagen: no confirmado si fieldByCaption resuelve un input[type=file] util para upload. */
  async retiroAutoLogoDropzone(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Retiro en auto — logo del chip', 0);
  }

  async retiroAutoLogoSeleccionadoDropzone(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Retiro en auto — logo del chip seleccionado');
  }

  /** El toggle de TC-CHIP-21. */
  async mostrarBarraDeFiltrosToggle(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Mostrar la barra de filtros (chips)');
  }

  /**
   * Este panel tiene tres botones "AGREGAR" (Chips, Orden, Banner) — orden
   * confirmado en vivo el 2026-09-08 (aparecen en ese orden en el texto plano
   * del panel real). Sin exact:true: el accessible name de estos botones no
   * es la palabra "AGREGAR" pelada (probablemente incluye un icono) y con
   * exact:true no matchea nada.
   */
  private async agregarButtonNth(index: 0 | 1 | 2): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'AGREGAR' }).nth(index);
  }

  chipsAgregarButton(): Promise<Locator> {
    return this.agregarButtonNth(0);
  }

  ordenAgregarButton(): Promise<Locator> {
    return this.agregarButtonNth(1);
  }

  async camposExtraMasterDataInput(): Promise<Locator> {
    return fieldByCaption(await this.frame(), 'Avanzado — Campos extra de MasterData');
  }

  bannerAgregarButton(): Promise<Locator> {
    return this.agregarButtonNth(2);
  }

  async cancelarButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'CANCELAR' });
  }

  async guardarButton(): Promise<Locator> {
    return (await this.frame()).getByRole('button', { name: 'GUARDAR' });
  }
}
