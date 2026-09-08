# qa-regio3

Suite de automatización en Playwright para los **chips del Regionalizador** de farmacity.com — trazabilidad **TQD-1128** (DEV/QA) / **FARMA-5049** (Infra), antecedente FARMA-5020.

## Alcance

Cubre exclusivamente los 30 casos documentados en `TQD-1128_TestCases_Chips_Reformulados.md` (configuración de chips en Site Editor, condiciones VTEX/MasterData, filtrado, estados visuales, opciones, Desktop/Mobile y su convivencia con el ordenamiento de sucursales). **No** cubre banner, promesas, ni el resto de la historia general del Regionalizador — eso pertenece a otras suites.

Este repo es independiente de `qa-automation-api`: ese proyecto automatiza otra historia (FARMA-5084/TQD-1127, contra producción). No se portó código de tests desde ahí, solo convenciones genéricas (ver `CONVENCIONES.md`).

## Estado actual: scaffold, selectores del bloque desktop confirmados

Los 30 casos existen como `test.fixme(...)` en `tests/specs/`, organizados por módulo. **Ningún `test.fixme` fue convertido a `test` todavía** — eso sigue pendiente. Pero a diferencia del scaffold inicial, los selectores de `SiteEditorChipsPage` y `SiteEditorRegionalizerPanelPage` (instancia desktop) ya fueron verificados en vivo contra `farma5049` el 2026-09-08: navegación real del árbol, apertura del panel, y lectura de campos vía el fixture real de Playwright (no solo capturas de pantalla). Ver `docs/vtex/site-editor-panels-transcripcion.md` para el detalle de cómo.

**Sigue pendiente:** `SiteEditorOrderRulesPage` y la variante mobile (header y drawer) no fueron probadas en vivo todavía — mismo patrón (`fieldByCaption` + `findSiteEditorAppFrame`), pero sin confirmar. No había ningún chip existente al verificar (el de la captura vieja ya no está), así que `chipRowByName` tampoco está probado contra un chip real.

Para implementar un caso: abrir `TQD-1128_TestCases_Chips_Reformulados.md` (o `Plan_TestCases_Chips.md` para el detalle de TC-CHIP-01), usar los Page Objects ya confirmados como base, y recién ahí sacar el `test.fixme` por `test(`.

## Uso

```bash
npm install
npx playwright install        # descarga los navegadores la primera vez
cp .env.example .env          # completar datos de prueba reales

npm run auth:save             # abre un browser real: login + 2FA a mano, guarda la sesion
npm run test:list             # listar los 30 casos sin ejecutar
npm test                      # correr la suite (usa la sesion de auth:save si existe)
npm run test:ui               # modo UI interactivo de Playwright
npm run typecheck             # tsc --noEmit
```

`farma5049` es un workspace VTEX de tipo development: exige login + 2FA de VTEX
Admin (Google Authenticator), que no se puede automatizar de punta a punta.
`npm run auth:save` abre un Chromium visible, vos completás el login a mano, y
guarda la sesión (`storageState`) en `.auth/farma5049.json` — gitignoreado,
nunca se commitea. `playwright.config.ts` la carga sola si el archivo existe.
La sesión expira como cualquier sesión de VTEX Admin: cuando vuelva a pedir
login, repetir `npm run auth:save`. Esto no resuelve CI desatendido — sigue
haciendo falta una persona para el login inicial de cada sesión (ver
`qa-automation-api/docs/plans/autenticacion-workspaces-staging.md`, sin
resolver a la fecha de este scaffold).

## Estructura

```
tests/
├── domain/
│   ├── chip-cases.ts              # metadata de los 30 TC-CHIP (snapshot de cases.json, Rev. 2 08/09/2026)
│   └── regionalizer-content.ts    # schema del contenido real del bloque, verificado headless (ver docs/vtex/)
├── utils/vtex-runtime.helper.ts   # lectura headless del runtime de Site Editor (sin clickear UI)
├── fixtures/farmacity-test.ts     # extiende el test base con Page Objects inyectados
├── pages/                         # Page Objects (Site Editor y barra del storefront)
└── specs/                         # un archivo por módulo, con los test.fixme de cada caso

docs/
├── vtex/      # hallazgos técnicos verificados (mecanismo __pickRuntime, instancias reales del bloque)
└── issues/    # discrepancias encontradas (AAAA-MM-DD-slug.md), para que un agente futuro tenga contexto
```

Antes de tocar el Site Editor a ciegas, leer `docs/vtex/README.md` — documenta cómo leer la configuración real de cualquier bloque vía API, sin abrir un browser visible ni clickear.

## Fuente de verdad de los datos de casos

`tests/domain/chip-cases.ts` es una copia adaptada de `TQD-1128/.qa_reformulacion/cases.json` (Revisión 2, 08/09/2026), no una referencia en vivo — este repo se clona solo, sin la carpeta de investigación al lado. Si `cases.json` cambia (nuevos casos, retitulados, etc.), resincronizar a mano.
