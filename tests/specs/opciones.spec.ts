import { test } from '../fixtures/farmacity-test';

// Modulo: Opciones
// Cada caso nace `fixme`: el objetivo esta documentado, la implementacion (Page Object
// + selectores reales) queda pendiente de inspeccionar farma5049. Ver TQD-1128/
// TQD-1128_TestCases_Chips_Reformulados.md para precondiciones, pasos y evidencia completos.
test.describe('Opciones', () => {

  // Comprobar que la opción elegida sustituya el valor de comparación y controle el filtro.
  // Referencia: Guía 4.1 y 4.2.
  test.fixme('TC-CHIP-15 @alta — Selección en un chip con opciones manuales', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });

  // Validar opciones desde el catálogo, filtrado por código de obra social y su representación en tarjeta.
  // Referencia: Guía 4.2 y 6.4.
  test.fixme('TC-CHIP-16 @alta — Filtro de obra social y logo en tarjeta', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });

  // Verificar la diferencia entre abrir/cerrar el desplegable y limpiar la opción seleccionada.
  // Referencia: Guía 4.1.
  test.fixme('TC-CHIP-17 @media — Apertura y cierre de la lista de opciones', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });
});
