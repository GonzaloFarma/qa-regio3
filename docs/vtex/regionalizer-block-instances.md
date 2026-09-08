# Las 4 instancias reales del bloque `regionalizer`

Verificado el 2026-09-08 contra `farma5049`, página `store.home`, vía el mecanismo documentado en [`site-editor-runtime-api.md`](site-editor-runtime-api.md). Recapturado dos veces (antes y después de que el usuario hiciera cambios manuales en el workspace) — el contenido fue **idéntico byte a byte** en ambas capturas; ver nota al final.

Componente real: `farmacityar.regionalizer@0.0.94/Regionalizer`. `blockId`: `farmacityar.regionalizer@0.x:regionalizer`.

## Resumen

| # | Ubicación en el árbol | `contentMapId` | Campos de `content` |
|---|---|---|---|
| 1 | Header **desktop** (`header-layout.desktop` → ... → `general__locator`) | `5xYrPDme8jxHyN6UBjGHMJ` | 17 campos — el único con `chips`, `sortRules`, `ordenamientos`, `banner`, `banners` |
| 2 | Dentro de `header-layout.desktop`, bajo un `responsive-layout.mobile#logo` anidado | `undefined` (vacío) | 0 campos — sin contenido configurado |
| 3 | Header **mobile** (`header-layout.mobile` → `sticky-header-wrapper` → ... → `general__locator`) | `e365KuMXoUD831WUDcCdw3` | 6 campos — sin `chips` ni `sortRules` ni `banner` |
| 4 | **Drawer** mobile (`header-layout.mobile` → `mobile-nav-bar` → `menu-logo__drawer` → ... → `general__locator`) | `rEyvswchjmK5TNKPJb9Tpm` | 6 campos — mismo shape que #3, `contentMapId` **distinto** |

**Esto es más granular que "Desktop vs Mobile".** Hay 3 instancias con contenido real y editable de forma independiente (#1, #3, #4), no 2. La #2 existe en el árbol de bloques pero no tiene contenido configurado — no se pudo determinar desde acá si es un remanente sin uso o si se renderiza bajo alguna condición no observada en esta captura.

**Responde TC-CHIP-18** ("¿Desktop y Mobile comparten configuración?"): **no, son independientes** — `contentMapId` distinto en cada uno. Pero la suite debería revisar también la instancia #4 (drawer mobile), que la ficha de casos no distingue de la #3.

## #1 — Desktop (contentMapId `5xYrPDme8jxHyN6UBjGHMJ`)

```json
{
  "title": "Seleccion el método de entrega",
  "customMessage": "La disponibilidad de productos varía según la elección. Si más adelante cambiás de idea, vas a tener que volver a regionalizar tu compra.",
  "shippingMethods": {
    "pickup": { "title": "Puntos de retiro", "label": "Gratis en tiendas Farmacity", "iconName": "FarmacyStore" },
    "delivery": { "title": "Envío a domicilio", "label": "Gratis a partir de $ 85.000", "iconName": "FarmacyShipper" }
  },
  "freeShippingAmount": "8500000",
  "labelPickup": "<strong>auto</strong><em>pickup</em>",
  "iconPickup": "https://farmacityar.vtexassets.com/assets/vtex.file-manager-graphql/images/73547abb-66ef-40cd-b6d0-04f2a98f52fb___e70b05a36e0d535d74bd9df3a296fad7.svg",
  "iconPickupSelected": "",
  "chipsEnabled": true,
  "chips": [],
  "sortRules": [
    {
      "__editorItemTitle": "QA - Más stock primero",
      "province": "Chaco",
      "city": "Resistencia",
      "appliesToGeolocation": false,
      "criteria": [
        { "__editorItemTitle": "1", "source": "masterdata", "masterDataField": "tiendaMasStock", "vtexField": "shippingEstimate", "operator": "equals", "value": "true" }
      ]
    }
  ],
  "extraMasterDataFields": "",
  "banners": [
    {
      "enabled": true,
      "image": "https://farmacityar.vtexassets.com/assets/vtex.file-manager-graphql/images/a1901700-5b71-4066-adde-dbe1a7724eb5___da6f3f91ea740501037c1517ab00ff5a.png",
      "imageAlt": "banner test",
      "startDate": "2026-09-07T16:19:00.000Z",
      "endDate": "2026-09-10T16:19:00.000Z",
      "bannerLink": "/test",
      "openInNewTab": true,
      "activarEventosAnalitics": true,
      "promotionId": "", "promotionName": "", "promotionPosition": ""
    }
  ],
  "chipsSystemEnabled": true,
  "ordenamientos": [
    {
      "__editorItemTitle": "Colegiales",
      "provincia": "", "localidad": "Colegiales", "geolocalizacion": false,
      "criterios": [
        { "__editorItemTitle": "Medicamentos", "origen": "masterdata", "campoMd": "obraSocial", "campoVtex": "shippingEstimate", "operador": "exists", "valor": "" },
        { "__editorItemTitle": "Autopickup", "origen": "masterdata", "campoMd": "autocity", "campoVtex": "shippingEstimate", "operador": "equals", "valor": "true" }
      ]
    }
  ],
  "sortConfig": { "enabled": false, "idOrderField": "idOrden", "idOrderDefault": 9999 },
  "banner": {
    "bannerEnabled": true,
    "bannerId": "regionalizer-shipping-modal-banner",
    "startDate": "", "endDate": "",
    "imageDesktop": "https://farmacityar.vtexassets.com/assets/vtex.file-manager-graphql/images/cfb6ac6c-7b2c-4e01-b1ac-54836ecaefd1___a0165b7f86fad7f1134d2c0de7650c7a.png",
    "imageMobile": "https://farmacityar.vtexassets.com/assets/vtex.file-manager-graphql/images/cfb6ac6c-7b2c-4e01-b1ac-54836ecaefd1___a0165b7f86fad7f1134d2c0de7650c7a.png",
    "imageAlt": "test", "bannerLink": "/ofertas", "openInNewTab": true,
    "activarEventosAnalitics": true, "promotionId": "test", "promotionName": "test", "promotionPosition": "test"
  },
  "text": ""
}
```

**`chips: []` — no hay ningún chip configurado en farma5049 al momento de esta captura**, pese a `chipsEnabled: true` y `chipsSystemEnabled: true`. Confirma que la precondición de TC-CHIP-01 (chip "QA - Retiro sin costo" existente) no se cumple hoy: hay que crearlo primero (TC-CHIP-03).

## #3 — Mobile header (contentMapId `e365KuMXoUD831WUDcCdw3`)

```json
{
  "labelPickup": "Retiro en Auto disponible",
  "iconPickup": "CrossIcon",
  "title": "",
  "shippingMethods": {
    "pickup": { "title": "Puntos de retiro", "iconName": "FarmacyStore", "label": "Gratis en tiendas Farmacity" },
    "delivery": { "title": "Envío a domicilio", "iconName": "FarmacyShipper", "label": "Gratis a partir de $ 50.000" }
  },
  "customMessage": "La disponibilidad de productos varía según la elección. Si más adelante cambiás de idea, vas a tener que volver a regionalizar tu compra.",
  "freeShippingAmount": "50000"
}
```

## #4 — Mobile drawer (contentMapId `rEyvswchjmK5TNKPJb9Tpm`)

Mismo shape de 6 campos que #3 (`labelPickup`, `iconPickup`, `title`, `shippingMethods`, `customMessage`, `freeShippingAmount`), valores no volcados acá por brevedad — extraíbles con el mismo método si hace falta comparar.

**Ninguna de las dos instancias mobile (#3, #4) tiene `chips`, `chipsEnabled`, `sortRules`, `ordenamientos` ni `banner`/`banners` en su `content`.** No se pudo determinar desde esta captura si el campo simplemente no se guardó todavía (nunca se tocó esa sección en mobile) o si el schema de contenido de mobile directamente no expone esas propiedades. Ver [`../issues/2026-09-08-instancias-y-esquemas-regionalizer.md`](../issues/2026-09-08-instancias-y-esquemas-regionalizer.md).

## Nota sobre la recaptura

El usuario mencionó cambios manuales hechos en el workspace de pruebas. Se recapturó el runtime después de ese aviso y el contenido de la instancia #1 (desktop) salió **idéntico byte a byte** a la captura anterior. Posibles explicaciones no verificadas: el cambio se hizo en otra instancia (#3/#4), no se guardó (falta APLICAR/GUARDAR), o hay caché de por medio. No se investigó más a fondo — queda para cuando se retome esta línea de trabajo.
