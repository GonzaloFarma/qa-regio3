# Cómo interactuar con el formulario del Site Editor (lecciones aprendidas)

Verificado en vivo el 2026-09-08 contra `farma5049`, headless, con la sesión de `auth:save`. Esto complementa [`site-editor-runtime-api.md`](site-editor-runtime-api.md) (lectura sin UI) — acá es sobre **interactuar** con el formulario real: navegar el árbol, encontrar campos, y los golpes que costó cada uno. Objetivo: que verificar el próximo panel (Orden, Mobile) tome minutos, no las varias horas que costó el primero.

## 1. Todo vive en un iframe, no en la página principal

`/admin/cms/site-editor` carga varios iframes. El que importa para el árbol y los paneles de edición es el que tiene URL `.../admin/app/cms/site-editor` — **no** el `store-iframe` (esa es la vista previa del storefront) ni la página top-level.

```ts
import { findSiteEditorAppFrame } from '../utils/site-editor-tree.helper';
const frame = await findSiteEditorAppFrame(page); // busca en page.frames() hasta que aparece
```

Confirmado con un experimento directo: `page.getByText('Título de la primera pantalla').count()` daba `0` con el panel abierto y visible en pantalla; `frame.getByText(...)` daba `1`. Cualquier Page Object que use `this.page.getByX(...)` directo para un campo del Site Editor **está mal** — tiene que resolver el frame primero.

## 2. Navegar el árbol: `data-tree-path`, no el texto

Cada fila del árbol tiene un atributo `data-tree-path` que es **exactamente el mismo string** que las claves de `extensions` en el runtime `__pickRuntime` (ver el otro doc). Eso significa que los paths que ya se conocen por la API sirven directo como selector de UI.

El HTML real de una fila con hijos:

```html
<div data-tree-path="...">
  <div role="button" tabindex="0" class="... pointer"><svg><!-- chevron --></svg></div>
  <div data-tree-path="..." role="treeitem" style="cursor: default;"><span>Header Desktop</span></div>
</div>
```

**El texto NO es clickeable para expandir.** El `treeitem` de un nodo con hijos tiene `cursor: default` a propósito. Hay que clickear el `div[role="button"]` hermano (el chevron), no el texto. Clickear el texto no tira error — simplemente no hace nada, lo cual es peor porque parece que funcionó.

Un nodo **hoja** (sin hijos) es distinto: su `treeitem` tiene `cursor: pointer` y ESE sí se clickea directo para abrir el panel.

```ts
// tests/utils/site-editor-tree.helper.ts ya resuelve esto:
await openBlockByTreePath(frame, [ancestro1, ancestro2, ..., pathDelBloqueHoja]);
```

Para armar la cadena de un bloque nuevo: abrir el árbol, ir clickeando manualmente (o con el helper) nivel por nivel, y en cada paso pedirle al elemento su `data-tree-path` real (no asumirlo por analogía con otro bloque — confirmado que "Regionalizador" grupo y "Regionalizador" hoja son DOS filas con paths distintos, uno termina en `.../general__locator` y el otro agrega `/regionalizer`).

## 3. Hay que esperar la hidratación de React, no solo que el DOM exista

Las filas del árbol son visibles en el DOM (y pasan cualquier `waitFor({state:'visible'})`) bastante antes de que React termine de conectar los handlers de click. Un click en esa ventana no tira error, no hace nada — y como "no hace nada" es indistinguible de "el selector está mal", esto costó varias iteraciones de debugging.

No se encontró ninguna señal observable (network idle, un atributo que cambie, un evento) para saber "ya hidrató". La solución verificada es una espera fija de **10 segundos** después de que la primera fila del árbol es visible, documentada con la supresión que exige `CONVENCIONES.md`:

```ts
await frame.getByText('Header Desktop', { exact: true }).waitFor({ state: 'visible', timeout: 45000 });
// lint-disable: RULE-3 — las filas son visibles antes de que React hidrate sus handlers;
// no hay señal observable distinta de esperar. Verificado 2026-09-08.
await page.waitForTimeout(10000);
```

El timeout de carga inicial (`Header Desktop` visible) también es variable — se vio pasar en ~15s y fallar a los 30s en corridas distintas. Se subió a 45s de margen.

## 4. `getByLabel()` no sirve directo — usar `fieldByCaption`

Cada campo SÍ está envuelto en un `<label>` real (a veces con `for`/`id`, a veces por anidamiento), pero **el nombre accesible que computa el navegador no siempre es el texto del caption solo**:

- Varios campos de texto tienen un párrafo de ayuda dentro del mismo `<label>` (ej. "Título de la primera pantalla" + "Encabezado del modal..."). Eso se concatena al nombre accesible: `getByLabel('Título de la primera pantalla', {exact:true})` da `0` porque el nombre real es más largo. Sin `exact`, funciona — pero abre la puerta al problema siguiente.
- Varios captions son substring de otros: "Sombra" de "Sombra a medida", "Ícono" de "Ícono de la tarjeta", "Comparación" de "Valor de comparación", "Texto del chip" de "Retiro en auto — texto del chip". Sin `exact:true`, `getByLabel` los mezcla.

No hay un único valor de `exact` que sirva para todos los campos a la vez — depende de si ESE campo puntual tiene ayuda dentro del label o no, y eso no se puede saber sin abrir el DOM real de cada uno.

**La solución que evita todo esto:** no depender del cálculo de nombre accesible. Ubicar el caption por su texto exacto (que sí es estable, confirmado con `getByText`), subir al `<label>` ancestro más cercano, y buscar el control real adentro:

```ts
// tests/utils/site-editor-field.helper.ts
export function fieldByCaption(scope: Page | Frame, caption: string, nth = 0): Locator {
  const captionEl = scope.getByText(caption, { exact: true }).nth(nth);
  const label = captionEl.locator('xpath=ancestor::label[1]');
  return label.locator('input, select, textarea');
}
```

Probado contra los 3 tipos de campo que existen en estos paneles (texto simple, toggle/checkbox, select/dropdown) — los tres están envueltos en un `<label>`, aunque con estructura interna distinta:

| Tipo | Wrapper | Control real |
|---|---|---|
| Texto (`field-string`, rjsf) | `<label class="vtex-input">` | `<input type="text">` |
| Toggle | `<label for="...">` | `<input type="checkbox">` (visualmente oculto, hay un `div.vtex-toggle` decorativo al lado) |
| Select/Dropdown | `<label>` (sin clase fija) | `<select>` real (aunque visualmente se vea como dropdown custom) |

Para botones (`AGREGAR`, `APLICAR`, `GUARDAR`, `CANCELAR`) el patrón es al revés: **no** usar `exact:true`. El accessible name de `AGREGAR` no es la palabra pelada (probablemente lleva un ícono) — `getByRole('button', {name:'AGREGAR', exact:true})` da `0`, sin `exact` da los 3 esperados (Chips/Orden/Banner, en ese orden).

## 5. El framework es react-jsonschema-form (rjsf)

Se ve en el DOM: `<form class="rjsf">`, wrappers `<div class="form-group field field-string">` / `field-boolean` / `field-object` etc. Esto explica el patrón uniforme de "cada campo es una unidad con label+control+ayuda opcional" — útil sabrelo si hace falta un selector nuevo que `fieldByCaption` no cubra (ej. un array field de rjsf tiene su propio patrón de `+`/`-` para agregar/quitar ítems, no probado todavía acá).

## 6. Valores por defecto que sorprenden

Un chip nuevo (via AGREGAR) **no nace vacío**: el campo "Nombre del chip" viene precompletado con el string literal `"Chip"`, y "Chip activo" nace `true`. Cualquier test que asuma "recién creado = vacío/inactivo" va a fallar contra un falso negativo. Repetir esta verificación para el resto de los campos por defecto antes de escribir asserts de creación.

## 7. Checklist para verificar el próximo panel (Orden, Mobile)

1. `SiteEditorRegionalizerPanelPage.openDesktop()` ya deja el frame listo y el bloque desktop abierto — para Mobile, hace falta el mismo patrón pero con la cadena de `data-tree-path` de `REGIONALIZER_MOBILE_HEADER_PATH`/`REGIONALIZER_MOBILE_DRAWER_PATH` (existen en `tests/domain/regionalizer-content.ts`, pero **sin la cadena de ancestros verificada en vivo** como sí tiene `REGIONALIZER_DESKTOP_TREE_CHAIN` — hay que armarla clickeando, igual que se hizo la primera vez).
2. Para cada campo nuevo: `fieldByCaption(frame, 'Caption exacto')`, confirmar `count() === 1` (o `=== N` si es un campo repetido tipo columnas), antes de asumir que sirve.
3. Si un click "no hace nada" (sin error): sospechar primero de hidratación (¿pasaron los 10s?) antes que del selector.
4. Correr el test real via el fixture (no un script suelto) al menos una vez por panel nuevo — ahí aparecen los problemas de timeout/timing que un script aislado con sleeps generosos no muestra.
