# Transcripción de los paneles del Site Editor (de capturas reales)

Fuente: capturas de pantalla ya existentes en `TQD-1128/` (`config-site-editor.png`, `chips-site-editor.png`, `orden-chips-site-editor.png`), tomadas por el usuario antes de esta sesión — fecha exacta no registrada en el nombre de archivo. Transcritas a texto acá para que un agente futuro no dependa de releer las imágenes. **Las etiquetas son reales** (texto visible en pantalla).

**Actualización 2026-09-08 — wiring de accesibilidad confirmado en vivo:** abrir el panel real reveló que `getByLabel()` directo NO sirve acá: varios campos tienen texto de ayuda dentro del mismo `<label>`, lo que diluye el nombre accesible que computa el navegador. La solución verificada (`fieldByCaption` en `tests/utils/site-editor-field.helper.ts`) ubica el campo por su caption exacto y sube al `<label>` ancestro por XPath — probada contra los 3 tipos de campo (texto, toggle, select) del panel de chips y el panel raíz, con `count: 1` en cada uno. El panel del bloque desktop completo (navegación de árbol + AGREGAR chip + varios campos) se abrió de punta a punta con el fixture real de Playwright — ver `tests/pages/site-editor-chips.page.ts` y `site-editor-regionalizer-panel.page.ts`.

## Árbol de bloques (confirma la ruta de `docs/vtex/regionalizer-block-instances.md`)

```
Header Desktop
└── Contenedor de menú
    └── Regionalizador
        └── Regionalizador          ← bloque editable

Header Mobile
└── Barra de Navegación Mobile
    └── Menu Mobile
        └── Container Drawer
            └── Regionalizador
                └── Regionalizador  ← esta es la variante DRAWER (instancia #4 del doc de instancias)
```

**Corregido 2026-09-08, navegando el árbol real en vivo:** el nivel intermedio de la captura estaba mal — el hijo directo de "Barra de Navegación Mobile" es **"Menú"**, no "Menu Mobile". "Menu Mobile" existe, pero un nivel más abajo, adentro de "Menú". Árbol real, confirmado clic a clic y con cada `data-tree-path` verificado contra `REGIONALIZER_MOBILE_DRAWER_PATH`:

```
Header Mobile
└── Barra de Navegación Mobile
    └── Menú
        └── Menu Mobile
            └── Container Drawer
                └── Regionalizador
                    └── Regionalizador  ← variante DRAWER, panel abierto y confirmado con el fixture real
```

Ver `tests/domain/regionalizer-content.ts` (`REGIONALIZER_MOBILE_DRAWER_TREE_CHAIN`) y `SiteEditorRegionalizerPanelPage.openMobileDrawer()`. No se encontró todavía una rama separada para la instancia mobile-header (#3, fuera del drawer) — puede estar en otra parte del árbol no explorada.

## Panel raíz "Regionalizador" (config-site-editor.png)

Accedido clickeando el bloque `Regionalizador` hoja en el árbol. Botón "← ATRÁS" y "VERSIONES" arriba.

| Campo | Tipo | Valor visto |
|---|---|---|
| Título de la primera pantalla | input texto | "Seleccion el método de entr..." |
| Aviso informativo | input texto | "La disponibilidad de produc..." |
| Título de la tarjeta (pickup) | input texto | "Puntos de retiro" |
| Bajada de la tarjeta (pickup) | input texto | "Gratis en tiendas Farmacity" |
| Ícono de la tarjeta (pickup) | input texto | "FarmacyStore" |
| Título de la tarjeta (delivery) | input texto | "Envío a domicilio" |
| Bajada de la tarjeta (delivery) | input texto | "Gratis a partir de $ 85.000" |
| Ícono de la tarjeta (delivery) | input texto | "FarmacyShipper" |
| Monto a partir del cual el envío es gratis | input numérico | "8500000" (solo número, sin puntos ni signo $) |
| Retiro en auto — texto del chip | input texto (HTML simple) | `<strong>auto</strong><en...` |
| Retiro en auto — logo del chip | dropzone imagen | ícono auto verde |
| Retiro en auto — logo del chip seleccionado | dropzone imagen | (vacío en la captura) |
| **Mostrar la barra de filtros (chips)** | toggle | activado |
| Chips (filtros del listado de sucursales) | botón **AGREGAR** → abre el panel de chips (ver abajo) |
| Orden del listado de sucursales (retiro) | botón **AGREGAR** → abre el panel de orden (ver abajo) |
| Avanzado — Campos extra de MasterData | input texto (coma-separado) | placeholder ejemplo: "coberturaVacunas,horarioExtendido" |
| Banner promocional del modal | botón **AGREGAR** |
| Botones finales | **CANCELAR** / **GUARDAR** |

Confirma: `Mostrar la barra de filtros (chips)` es el toggle de TC-CHIP-21. `AGREGAR`/`GUARDAR`/`CANCELAR` son los controles que TC-CHIP-01 y TC-CHIP-24 esperan (la ficha de casos menciona "APLICAR" a nivel de chip individual y "GUARDAR" a nivel de panel general — acá se confirma que el panel general usa GUARDAR, no APLICAR).

## Panel "Chips (filtros del listado de sucursales)" (chips-site-editor.png)

Se abre al editar un chip existente o al presionar AGREGAR. Cuatro columnas visibles: la primera es la config funcional del chip; las otras tres son el diseño por variante (normal / seleccionado / tarjeta — **inferido por orden y por el color de fondo verde en la 2ª columna, no hay headers explícitos en la captura que lo confirmen**).

### Columna 1 — Config funcional

| Campo | Tipo | Valor visto |
|---|---|---|
| Nombre del chip (sólo para identificarlo acá) | input texto | "QA - Retiro sin costo" |
| Chip activo | toggle | activado |
| Origen del dato | select | "VTEX (cálculo de envío)" |
| Campo de MasterData (si el origen es MasterData) | input texto | vacío — placeholder lista: obraSocial, abierto24hs, autocity, tiendaMasStock, coberturaAnticonceptivos, idOrden |
| Campo de VTEX (si el origen es VTEX) | select | "Retiro/envío sin costo" |
| Comparación | select | "es igual a" |
| Valor de comparación | input texto | "true" — nota UI: no hace falta para "tiene dato"/"no tiene dato"; acepta `$selectedObraSocial` |
| Este chip abre una lista de opciones | toggle | desactivado |
| Traer las opciones del listado de obras sociales | toggle | desactivado |
| Opciones de la lista (carga manual) | botón **AGREGAR** |
| (preview) | imagen | "Sin imagen" |
| Mostrar también dentro de la tarjeta de la sucursal | select | "No mostrarlo en la tarje..." |

### Columnas 2–4 — Diseño por variante (repetido 3 veces)

| Campo | Tipo | Col. 2 (¿normal?) | Col. 3 (¿seleccionado?) | Col. 4 (¿tarjeta?) |
|---|---|---|---|---|
| Logo | dropzone imagen | vacío | vacío | vacío |
| Texto del chip | input texto | "Retiro sin costo QA" | "Retiro sin costo QA" | vacío |
| Color del texto | color picker | oscuro | oscuro | oscuro |
| Ícono | select | "Sin ícono" | "Sin ícono" | "Sin ícono" |
| Orden de los elementos | input texto | "logo,text,icon" | "logo,text,icon" | "logo,text,icon" |
| Color de fondo | color picker | blanco | **verde claro** | blanco |
| Color del borde | color picker | negro | negro | negro |
| Ancho del borde (en píxeles) | input numérico | "0,5" | "0" | "0,5" |
| Sombra | select | "Estándar (la del diseño)" | "Estándar (la del diseño)" | "Sin sombra" |
| Sombra a medida | input texto | vacío | vacío | vacío |
| (sólo al final de la 4ª columna) | botón **APLICAR** | — | — | ✓ |

**Ojo:** `APLICAR` aparece una sola vez, al final de la última columna — es el botón de todo el formulario del chip, no por columna. Confirma el flujo APLICAR (a nivel chip) → GUARDAR (a nivel panel general) que describen TC-CHIP-01 y varios otros casos.

## Panel "Orden del listado de sucursales (retiro)" (orden-chips-site-editor.png)

Lista de reglas (izquierda, un ítem visto: "CHA - RES") → editor de regla (medio) → editor de criterio (derecha, al AGREGAR uno).

### Editor de regla

| Campo | Tipo | Valor/placeholder visto |
|---|---|---|
| Nombre de la regla (sólo para identificarla acá) | input texto | "Regla de orden" |
| Provincia donde aplica | input texto | vacío — "dejar vacío si la regla no depende de la provincia" |
| Localidad donde aplica | input texto | vacío |
| Aplicar a la búsqueda por dirección | toggle | desactivado |
| Criterios de orden (el primero manda) | botón **AGREGAR** |
| Botón final | **APLICAR** |

### Editor de criterio (al AGREGAR uno)

| Campo | Tipo | Valor visto |
|---|---|---|
| Nombre del criterio (sólo para identificarlo acá) | input texto | "Criterio" |
| Origen del dato | select | "MasterData (datos de..." |
| Campo de MasterData | input texto | vacío — ejemplos: idOrden, obraSocial, abierto24hs, tiendaMasStock, autocity |
| Campo de VTEX (si el origen es VTEX) | select | "Demora de entrega (e..." |
| Cómo ordena este criterio | select | "es igual a" |
| Valor de comparación | input texto | vacío |
| Botón final | **APLICAR** |

**Corrobora la sospecha del issue de esquemas duplicados** (`docs/issues/2026-09-08-instancias-y-esquemas-regionalizer.md`, #3): los labels de este panel real (Provincia/Localidad/Campo de MasterData/Campo de VTEX/Criterios) usan nombres en **español**, que coinciden con el shape de `ordenamientos` (`provincia`, `localidad`, `campoMd`, `campoVtex`, `criterios`) capturado por API — no con `sortRules` (inglés: `province`, `city`, `masterDataField`, `criteria`). **Inferencia, no confirmación 100%:** sugiere fuertemente que `ordenamientos` es el campo vigente que la UI edita hoy, y `sortRules` es un remanente de un esquema anterior. No se abrió DevTools en vivo para confirmar qué campo escribe el guardado real.
