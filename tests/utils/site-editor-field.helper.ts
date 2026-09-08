import type { Frame, Locator, Page } from '@playwright/test';

/**
 * Localizador de campos del formulario de Site Editor (react-jsonschema-form
 * + vtex.styleguide). Verificado en vivo el 2026-09-08 contra farma5049.
 *
 * Por que no usar `getByLabel()` directo: cada campo esta envuelto en un
 * <label> real (a veces con for/id, a veces por anidamiento), pero varios
 * campos de texto tienen un parrafo de ayuda DENTRO del mismo <label>
 * (ej. "Título de la primera pantalla" + "Encabezado del modal..."), lo que
 * diluye el nombre accesible que Playwright computa: `exact:true` deja de
 * matchear, y sin exact aparecen falsos positivos por substring entre
 * campos distintos (ej. "Sombra" matchea tambien "Sombra a medida").
 *
 * Esta funcion evita todo eso: ubica el span/texto exacto del caption con
 * `getByText(caption, {exact:true})`, sube al <label> ancestro mas cercano
 * por XPath, y devuelve el control real (input/select/textarea) dentro de
 * ese label especifico. No depende del calculo de nombre accesible.
 */
export function fieldByCaption(scope: Page | Frame, caption: string, nth = 0): Locator {
  const captionEl = scope.getByText(caption, { exact: true }).nth(nth);
  const label = captionEl.locator('xpath=ancestor::label[1]');
  return label.locator('input, select, textarea');
}
