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
- `tests/domain/` — `chip-cases.ts`, la metadata de los 30 casos.
- `tests/utils/` — todavía no existe. Crear cuando haga falta un cliente VTEX,
  una precondición reutilizable o un oráculo — no antes.

Un Page Object nunca importa un spec.

## `test.fixme()` vs `test.skip()`

`test.fixme()` marca una implementación pendiente conocida (es el estado
inicial de los 30 casos de esta suite). `test.skip(condición, motivo)` marca
una precondición de datos que faltó en tiempo de ejecución — el motivo debería
empezar con `precondicion:` cuando se empiece a usar, para distinguirlo de una
regresión real. Ninguno de los dos reemplaza registrar el resultado en
`TQD-1128_TestCases_Chips_Reformulados.md`.

## Antes de sacar un `test.fixme()`

1. Confirmar el locator real contra `farma5049` (Site Editor y storefront) —
   ninguno de los que trae el scaffold inicial fue verificado.
2. Confirmar el mecanismo de login real (`.env.example` lo deja pendiente).
3. `npm run verify` en verde.
4. Recién ahí, `test.fixme` → `test`.
