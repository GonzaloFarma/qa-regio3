import { test } from '../fixtures/farmacity-test';

// Modulo: Diseño
// Cada caso nace `fixme`: el objetivo esta documentado, la implementacion (Page Object
// + selectores reales) queda pendiente de inspeccionar farma5049. Ver TQD-1128/
// TQD-1128_TestCases_Chips_Reformulados.md para precondiciones, pasos y evidencia completos.
test.describe('Diseño', () => {

  // Verificar que un chip simple use el diseño configurado para normal y seleccionado.
  // Referencia: UH, tres estados de chip; guía 3.2.
  test.fixme('TC-CHIP-12 @media — Estados visuales normal y seleccionado', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });

  // Validar los tres modos de presentación de un chip simple dentro de las tarjetas de sucursal.
  // Referencia: Guía 3.2 y 3.4.
  test.fixme('TC-CHIP-13 @media — Visibilidad del chip dentro de la tarjeta', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });

  // Verificar texto, logo e ícono según su orden configurado y la herencia del diseño normal cuando el seleccionado está vacío.
  // Referencia: Guía 3.5 y preguntas frecuentes.
  test.fixme('TC-CHIP-14 @media — Contenido y orden de los elementos del chip', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });

  // Validar las propiedades visuales configurables y la dependencia entre color y ancho del borde.
  // Referencia: Guía 3.5 y preguntas frecuentes.
  test.fixme('TC-CHIP-29 @media — Colores bordes y sombras del chip', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });
});
