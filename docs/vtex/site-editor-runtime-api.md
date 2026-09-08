# Leer contenido de Site Editor sin UI: el runtime `__pickRuntime`

Verificado en vivo contra `farma5049` el 2026-09-08, headless, con la sesión de `npm run auth:save` ya capturada. Reemplaza el enfoque de abrir un browser visible y clickear/capturar pantalla para descubrir qué contiene un bloque: es lento, no reproducible, y no da un contrato de datos real.

## El mecanismo

VTEX Store Framework (Render Runtime) expone su estado completo de una página vía querystring, tanto desde el propio storefront como desde el iframe que Site Editor embebe para la vista previa en vivo:

```
GET https://{workspace}--{account}.myvtex.com/?__siteEditor=true&__pickRuntime=appsEtag,blocks,blocksTree,components,contentMap,extensions,messages,page,pages,query,queryData,route,runtimeMeta,settings&__device={desktop|tablet|mobile}
```

Devuelve JSON (para la Home de farma5049, ~2.5MB — la mayor parte son manifests de assets de cada componente de la página, no contenido). Con la sesión ya autenticada (cookies de `.auth/farma5049.json`), un simple `fetch`/`page.goto` headless alcanza — no requiere clickear nada en la UI de Site Editor.

### Cómo se descubrió

Se detectó grabando tráfico de red (`page.on('response')`) mientras se cargaba `/admin/cms/site-editor` con Playwright headless, filtrando respuestas `content-type: application/json`. La URL exacta apareció sola, disparada por el propio Site Editor al renderizar la vista previa — no es un endpoint documentado públicamente por VTEX (la documentación oficial de `developers.vtex.com` no explica el mecanismo de persistencia de Site Editor), pero es tráfico real observado, no inferido.

## Estructura relevante de la respuesta

- `route.id` — el ID de la página resuelta (ej. `store.home`).
- `pages` — diccionario de todas las rutas declaradas en la cuenta (`store.home`, `store.product`, `store.storelocator`, etc.).
- `extensions` — diccionario **`blockPath` → definición del bloque**, donde `blockPath` es la ruta completa desde la raíz de la página hasta el bloque (ver ejemplo abajo). Cada entrada tiene:
  - `component`: `"{app}@{version}/{ComponentName}"` — identifica la app VTEX IO real detrás del bloque.
  - `blockId`: el id declarado en `interfaces.json` de esa app (ej. `farmacityar.regionalizer@0.x:regionalizer`).
  - `contentMapId`: identificador de la instancia de contenido — **dos bloques con distinto `contentMapId` son configurables de forma independiente**, aunque compartan `component`/`blockId`.
  - `contentIds`: `["{contentMapId}~{contentId}"]` — el par que identifica la fila de contenido concreta.
  - `content`: el objeto de configuración real (lo que Site Editor deja editar) tal como está guardado ahora.
- `contentMap` — existe pero en la captura del 2026-09-08 no tenía entradas relevantes para `regionalizer`; el contenido real se leyó desde `extensions[...].content`.

## Ejemplo de uso headless (Playwright)

```ts
const context = await browser.newContext({ storageState: '.auth/farma5049.json' });
const page = await context.newPage();

let runtimeBody: string | null = null;
page.on('response', async (res) => {
  const url = res.url();
  if (url.includes('__siteEditor=true') && url.includes('__pickRuntime')) {
    runtimeBody = await res.text();
  }
});

await page.goto('https://farma5049--farmacityar.myvtex.com/admin/cms/site-editor', {
  waitUntil: 'domcontentloaded',
});
await page.waitForTimeout(20000); // el runtime tarda en dispararse; no hay señal de "listo" confirmada todavia
```

**No confirmado todavía:** un evento/selector que indique de forma confiable "el runtime ya se cargó" en vez de esperar un tiempo fijo. `waitForTimeout` así es exactamente lo que `scripts/lint-tests.js` (RULE-3) corta dentro de `tests/` — este patrón vive fuera de `tests/` mientras tanto, en un helper de investigación. Si se convierte en un helper de producto (`tests/utils/`), hay que resolver esto primero o documentar la supresión con motivo.

**No probado:** el endpoint/contrato de **escritura** (qué dispara APLICAR/GUARDAR). Requiere capturar tráfico durante un guardado real, no solo una lectura.

## Por qué importa para QA

Esto permite, sin tocar la UI:
- Verificar precondiciones de un test case (¿existe ya un chip con tal nombre?) antes de ejecutar.
- Comparar contenido antes/después de una acción de UI (persistencia real, no solo "se ve bien en pantalla").
- Diagnosticar TC-CHIP-18 (relación Desktop/Mobile) con un hecho verificable en vez de una suposición — ver [`regionalizer-block-instances.md`](regionalizer-block-instances.md).
