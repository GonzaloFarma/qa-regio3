/**
 * @source docs/vtex/regionalizer-block-instances.md — captura headless real
 *         contra farma5049, pagina store.home, via __pickRuntime.
 * @lastValidated 2026-09-08
 * @validatedBy Berta (sesion de scaffolding qa-regio3), sin revision humana todavia
 *
 * Contrato de contenido del bloque farmacityar.regionalizer@0.0.94/Regionalizer.
 * NO es un contrato de negocio decidido: es lo que se observo en runtime en una
 * fecha puntual. Los campos marcados "esquema en disputa" conviven ambos en el
 * dato real (ver docs/issues/2026-09-08-instancias-y-esquemas-regionalizer.md) -
 * no asumir cual esta vigente sin confirmar con desarrollo.
 */

export type RegionalizerBlockPath =
  | typeof REGIONALIZER_DESKTOP_PATH
  | typeof REGIONALIZER_DESKTOP_RESPONSIVE_EMPTY_PATH
  | typeof REGIONALIZER_MOBILE_HEADER_PATH
  | typeof REGIONALIZER_MOBILE_DRAWER_PATH;

/** Instancia con contenido completo (17 campos): chips, sortRules/ordenamientos, banner/banners. */
export const REGIONALIZER_DESKTOP_PATH =
  'store.home/$before_header.full/header-layout.desktop/sticky-layout#desktop__header/flex-layout.row#desktop__container-menu/flex-layout.col#desktop__container-menu_header-icons/flex-layout.row#desktop__container-menu_header-icons/flex-layout.col#general__locator/regionalizer';

/**
 * Cadena de data-tree-path para llegar al panel del bloque desktop desde el
 * Site Editor, en orden (ancestros primero, termina en REGIONALIZER_DESKTOP_PATH).
 * Verificada en vivo el 2026-09-08 contra farma5049 con
 * tests/utils/site-editor-tree.helper.ts#openBlockByTreePath - los 4 clicks
 * (3 expansiones + 1 click de hoja) llegaron al panel real ("Título de la
 * primera pantalla", "GUARDAR" presentes). Las etiquetas visibles de cada
 * nivel: Header Desktop -> Contenedor de menú -> Regionalizador (grupo) ->
 * Regionalizador (hoja).
 */
export const REGIONALIZER_DESKTOP_TREE_CHAIN: string[] = [
  'store.home/$before_header.full/header-layout.desktop',
  'store.home/$before_header.full/header-layout.desktop/sticky-layout#desktop__header/flex-layout.row#desktop__container-menu',
  'store.home/$before_header.full/header-layout.desktop/sticky-layout#desktop__header/flex-layout.row#desktop__container-menu/flex-layout.col#desktop__container-menu_header-icons/flex-layout.row#desktop__container-menu_header-icons/flex-layout.col#general__locator',
  REGIONALIZER_DESKTOP_PATH,
];

/**
 * Instancia sin contentMapId ni contenido (content: {}), anidada dentro del
 * arbol desktop bajo un responsive-layout.mobile#logo. No confirmado si es
 * codigo muerto o se activa bajo alguna condicion no observada (ver issue).
 */
export const REGIONALIZER_DESKTOP_RESPONSIVE_EMPTY_PATH =
  'store.home/$before_header.full/header-layout.desktop/sticky-layout#desktop__header/flex-layout.row#desktop__container-menu/flex-layout.col#general__logo/responsive-layout.mobile#logo/flex-layout.row#general__locator/flex-layout.col#general__locator/regionalizer';

/** Instancia mobile, header. Solo 6 campos: sin chips/sortRules/banner en el content. */
export const REGIONALIZER_MOBILE_HEADER_PATH =
  'store.home/$before_header.full/header-layout.mobile/sticky-header-wrapper#mobile__header/flex-layout.row#mobile__container-menu/flex-layout.row#menu-logo/flex-layout.col#general__logo/responsive-layout.mobile#logo/flex-layout.row#general__locator/flex-layout.col#general__locator/regionalizer';

/** Instancia mobile, drawer. contentMapId propio y distinto de MOBILE_HEADER pese al mismo shape de 6 campos. */
export const REGIONALIZER_MOBILE_DRAWER_PATH =
  'store.home/$before_header.full/header-layout.mobile/flex-layout.row#mobile-nav-bar/flex-layout.col#mobile-menu-drawer-btn/flex-layout.col#menu-logo__drawer/drawer#menu-logo__drawer/flex-layout.row#menu-logo__drawer--container/flex-layout.col#drawer__container--items/flex-layout.col#general__locator/regionalizer';

/**
 * Cadena de data-tree-path para llegar al panel del bloque mobile-drawer,
 * verificada en vivo el 2026-09-08 (mismo metodo que REGIONALIZER_DESKTOP_TREE_CHAIN).
 * Etiquetas reales del arbol, distintas de lo que sugeria la captura vieja
 * (TQD-1128/config-site-editor.png decia "Menu Mobile" como hijo directo de
 * "Barra de Navegación Mobile"; en vivo el hijo real es "Menú", y "Menu Mobile"
 * aparece un nivel mas abajo, dentro de "Menú"):
 * Header Mobile -> Barra de Navegación Mobile -> Menú -> Menu Mobile ->
 * Container Drawer -> Regionalizador (grupo) -> Regionalizador (hoja).
 *
 * El panel resultante SI ofrece las secciones Chips/Orden/Banner en el
 * formulario (mismo schema que desktop) - contradice la sospecha anterior
 * (issue #5) de que mobile no exponia esas secciones. Lo que pasa es mas
 * simple: nadie guardo contenido en esas secciones para esta instancia
 * todavia, por eso el content vía API viene con solo 6 campos.
 */
export const REGIONALIZER_MOBILE_DRAWER_TREE_CHAIN: string[] = [
  'store.home/$before_header.full/header-layout.mobile',
  'store.home/$before_header.full/header-layout.mobile/flex-layout.row#mobile-nav-bar',
  'store.home/$before_header.full/header-layout.mobile/flex-layout.row#mobile-nav-bar/flex-layout.col#mobile-menu-drawer-btn',
  'store.home/$before_header.full/header-layout.mobile/flex-layout.row#mobile-nav-bar/flex-layout.col#mobile-menu-drawer-btn/flex-layout.col#menu-logo__drawer',
  'store.home/$before_header.full/header-layout.mobile/flex-layout.row#mobile-nav-bar/flex-layout.col#mobile-menu-drawer-btn/flex-layout.col#menu-logo__drawer/drawer#menu-logo__drawer/flex-layout.row#menu-logo__drawer--container',
  'store.home/$before_header.full/header-layout.mobile/flex-layout.row#mobile-nav-bar/flex-layout.col#mobile-menu-drawer-btn/flex-layout.col#menu-logo__drawer/drawer#menu-logo__drawer/flex-layout.row#menu-logo__drawer--container/flex-layout.col#drawer__container--items/flex-layout.col#general__locator',
  REGIONALIZER_MOBILE_DRAWER_PATH,
];

export const REGIONALIZER_COMPONENT = 'farmacityar.regionalizer@0.0.94/Regionalizer';

interface ShippingMethodContent {
  title: string;
  label: string;
  iconName: string;
}

/** Shape observado en las 3 instancias con contenido (desktop, mobile header, mobile drawer). */
export interface RegionalizerContentBase {
  title: string;
  customMessage: string;
  shippingMethods: {
    pickup: ShippingMethodContent;
    delivery: ShippingMethodContent;
  };
  freeShippingAmount: string;
  labelPickup: string;
  iconPickup: string;
}

/**
 * Campos vistos SOLO en la instancia desktop al 2026-09-08. No confirmado si
 * mobile los soporta y simplemente no se guardaron, o si el schema de mobile
 * no los expone. Ver docs/issues/2026-09-08-instancias-y-esquemas-regionalizer.md #5.
 */
export interface RegionalizerContentDesktopExtra {
  iconPickupSelected: string;
  chipsEnabled: boolean;
  chipsSystemEnabled: boolean;
  /** Shape del objeto de cada chip: desconocido — chips estaba vacio ([]) en la captura. Completar con TC-CHIP-03. */
  chips: unknown[];
  extraMasterDataFields: string;
  text: string;

  /** Esquema en disputa (issue #3): coexiste con `ordenamientos`. */
  sortRules: Array<{
    __editorItemTitle: string;
    province: string;
    city: string;
    appliesToGeolocation: boolean;
    criteria: Array<{
      __editorItemTitle: string;
      source: string;
      masterDataField: string;
      vtexField: string;
      operator: string;
      value: string;
    }>;
  }>;
  /** Esquema en disputa (issue #3): coexiste con `sortRules`. */
  ordenamientos: Array<{
    __editorItemTitle: string;
    provincia: string;
    localidad: string;
    geolocalizacion: boolean;
    criterios: Array<{
      __editorItemTitle: string;
      origen: string;
      campoMd: string;
      campoVtex: string;
      operador: string;
      valor: string;
    }>;
  }>;
  sortConfig: {
    enabled: boolean;
    idOrderField: string;
    idOrderDefault: number;
  };

  /** Esquema en disputa (issue #4): coexiste con `banners`. */
  banner: {
    bannerEnabled: boolean;
    bannerId: string;
    startDate: string;
    endDate: string;
    imageDesktop: string;
    imageMobile: string;
    imageAlt: string;
    bannerLink: string;
    openInNewTab: boolean;
    activarEventosAnalitics: boolean;
    promotionId: string;
    promotionName: string;
    promotionPosition: string;
  };
  /** Esquema en disputa (issue #4): coexiste con `banner`. */
  banners: Array<{
    enabled: boolean;
    image: string;
    imageAlt: string;
    startDate: string;
    endDate: string;
    bannerLink: string;
    openInNewTab: boolean;
    activarEventosAnalitics: boolean;
    promotionId: string;
    promotionName: string;
    promotionPosition: string;
  }>;
}

export type RegionalizerDesktopContent = RegionalizerContentBase & RegionalizerContentDesktopExtra;
export type RegionalizerMobileContent = RegionalizerContentBase;
