# Convenciones de la suite

Adaptado el 08/09/2026 de `qa-automation-api/playwright-tests/CONVENCIONES.md`
(repo de equipo, otra suite — ver TQD-1128 memoria de proyecto). Se portó lo que
es restricción de **VTEX IO en sí**, no de esa feature puntual. Se descartó todo
lo específico de ese repo: los tags contrato de su API FastAPI (`@smoke`,
`@critical`, `@monitor`), las cuatro personas (`/chechu`, `/genaro`, ...) y su
estructura de `docs/`. Nada de esto fue verificado todavía contra
`farma5049` — son reglas de VTEX IO en general, no una promesa de que ya
funcionan acá.

---

## Restricciones VTEX IO

No negociables, heredadas de la experiencia documentada en el repo de origen:

- **Nunca colocar una orden real** en flujos que toquen checkout.
- **Sin `networkidle`.** VTEX mantiene tráfico HTTP continuo, así que
  `waitForLoadState('networkidle')` no resuelve nunca. Usar
  `domcontentloaded` más un `waitFor` sobre un elemento concreto.
- **Sin CSS versionado** `.vtex-{app}-{version}-x-*`. Se rompe en cada deploy
  mayor de la app. Usar `[class*="handle"]`.
- **`.first()` casi siempre.** VTEX suele renderizar DOM mobile y desktop en
  simultáneo; sin `.first()` salta *strict mode violation*. Excepción: cuando
  el test valida conteos o listas a propósito. **Pendiente de confirmar** si
  el Site Editor y el storefront de `farma5049` tienen este mismo patrón.
- **Sin `waitForTimeout`**, salvo workaround documentado (ver RULE-3 abajo).
- **Sin `page.locator()` en un spec.** El selector va al Page Object
  (`tests/pages/`).
- **No commitear** credenciales, `.env`, storage states, reportes, traces,
  capturas ni videos (ver `.gitignore`).

## El linter

`npm run lint:tests` (`scripts/lint-tests.js`, portado del repo de origen) hace
cumplir cuatro de esas restricciones, que TypeScript no puede ver por sí solo:

| Regla | Qué corta |
|---|---|
| RULE-1 | Clase CSS versionada de VTEX |
| RULE-2 | `waitForLoadState('networkidle')` |
| RULE-3 | `waitForTimeout(` |
| RULE-4 | `page.locator(` dentro de un `*.spec.ts` |

Las cuatro admiten supresión con un comentario en el bloque contiguo que
precede a la línea, con motivo obligatorio por convención:

```ts
// lint-disable: RULE-3 — VTEX no expone señal observable para este paso.
await page.waitForTimeout(500);
```

`npm run verify` corre `typecheck` y `lint:tests` juntos — correrlo antes de
dar por buena cualquier implementación.

## Arquitectura: las dependencias van hacia adentro

```
tests/specs/ → tests/pages/ → tests/domain/ (+ tests/utils/ cuando haga falta)
```

- `tests/specs/` — escenarios (los 30 TC-CHIP), tags, assertions de negocio.
  Sin selectores inline: eso es lo que corta RULE-4.
- `tests/pages/` — Page Objects: selectores, esperas y acciones de UI.
- `tests/domain/` — `chip-cases.ts` (metadata de los 30 casos) y
  `regionalizer-content.ts` (schema del contenido real del bloque, verificado
  contra farma5049 — ver `docs/vtex/`).
- `tests/utils/` — `vtex-runtime.helper.ts`, lectura headless del runtime de
  Site Editor. Agregar más solo cuando haga falta un cliente VTEX, una
  precondición reutilizable o un oráculo nuevo — no antes.

Un Page Object nunca importa un spec.

## Qué va a `tests/domain/` y qué no

Adaptado de la misma fuente que el resto de este documento. `tests/domain/`
modela comportamiento **estable y verificado**, no datos vivos (chips
configurados hoy, stock, sucursales habilitadas — eso se consulta en runtime,
no se hardcodea). Cada archivo lleva encabezado con `@source` (de dónde salió
el dato), `@lastValidated` (fecha de la última verificación real, no de la
última edición del archivo) y `@validatedBy` si corresponde. No inventar un
valor de negocio: si el dato no está verificado, se documenta como pendiente
en vez de adivinarlo. Ver `docs/vtex/` y `docs/issues/` para el detalle de
cómo se verificó cada cosa.

## `test.fixme()` vs `test.skip()`

`test.fixme()` marca una implementación pendiente conocida (es el estado
inicial de los 30 casos de esta suite). `test.skip(condición, motivo)` marca
una precondición de datos que faltó en tiempo de ejecución — el motivo debería
empezar con `precondicion:` cuando se empiece a usar, para distinguirlo de una
regresión real. Ninguno de los dos reemplaza registrar el resultado en
`TQD-1128_TestCases_Chips_Reformulados.md`.

## Sesión y login

`farma5049` es workspace development: exige login + 2FA de VTEX Admin, no
automatizable de punta a punta. `npm run auth:save` abre un browser real,
completás el login a mano, y guarda `storageState` en `.auth/` (gitignorado).
`playwright.config.ts` lo carga solo si el archivo existe. La sesión expira;
cuando el gate de admin-login vuelve a aparecer, repetir `auth:save`. Esto
resuelve correr localmente con un humano presente al inicio — **no** resuelve
CI desatendido (ver README, sección "Uso").

## Antes de sacar un `test.fixme()`

1. Confirmar el locator real contra `farma5049` (Site Editor y storefront) —
   ninguno de los que trae el scaffold inicial fue verificado.
2. Correr `npm run auth:save` si no hay sesión vigente todavía.
3. `npm run verify` en verde.
4. Recién ahí, `test.fixme` → `test`.
