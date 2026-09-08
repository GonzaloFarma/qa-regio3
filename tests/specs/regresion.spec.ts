import { test } from '../fixtures/farmacity-test';

// Modulo: Regresión
// Cada caso nace `fixme`: el objetivo esta documentado, la implementacion (Page Object
// + selectores reales) queda pendiente de inspeccionar farma5049. Ver TQD-1128/
// TQD-1128_TestCases_Chips_Reformulados.md para precondiciones, pasos y evidencia completos.
test.describe('Regresión', () => {

  // Revalidar el problema reportado de listado vacío al cambiar de ubicación con chips seleccionados.
  // Referencia: FARMA-5049, Actividad D5; TQD-1128, Actividad D4; guía 3.1.
  test.fixme('TC-CHIP-11 @alta — Cambio de ubicación con filtros activos', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });

  // Revalidar el bloqueo reportado al guardar después de permanecer configurando el Site Editor.
  // Referencia: FARMA-5049, Actividad D5; TQD-1128, Actividad D4.
  test.fixme('TC-CHIP-23 @alta — Guardado después de una configuración prolongada', async () => {
    // TODO: implementar contra farma5049 - ver el caso completo en el .md de TQD-1128.
    // Al implementar, tomar siteEditorChips/regionalizadorBar del fixture:
    // async ({ siteEditorChips, regionalizadorBar }) => { ... }
  });
});
