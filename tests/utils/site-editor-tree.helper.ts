import type { Frame, Page } from '@playwright/test';

/**
 * Navegacion del arbol de bloques del Site Editor. Verificado en vivo el
 * 2026-09-08 contra farma5049 (headless) hasta llegar al panel del bloque
 * regionalizer desktop y abrir AGREGAR de un chip.
 *
 * Hallazgo clave: cada fila del arbol tiene un atributo `data-tree-path` que
 * usa EXACTAMENTE el mismo formato que las claves de `extensions` en el
 * runtime __pickRuntime (ver docs/vtex/site-editor-runtime-api.md) - los
 * mismos strings sirven para las dos tecnicas. Una fila con hijos tiene un
 * `div[role="button"]` hermano (el chevron) que hay que clickear para
 * expandir - el propio `div[role="treeitem"]` de esas filas tiene
 * `cursor: default` y no navega. Una fila hoja (sin hijos) SI tiene
 * `cursor: pointer` en su treeitem y se clickea directamente.
 */

export async function findSiteEditorAppFrame(page: Page, timeoutMs = 15000): Promise<Frame> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const frame = page.frames().find((f) => f.url().includes('/admin/app/cms/site-editor'));
    if (frame && !frame.isDetached()) return frame;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('El frame de admin/app/cms/site-editor nunca aparecio dentro del timeout.');
}

/**
 * Expande y navega la cadena de `data-tree-path` dada (ancestros en orden,
 * terminando en el path del bloque hoja) hasta abrir su panel de edicion.
 * Cada paso espera a que la fila sea visible antes de actuar, en vez de un
 * tiempo fijo (RULE-3, CONVENCIONES.md).
 */
export async function openBlockByTreePath(frame: Frame, treePathChain: string[]): Promise<void> {
  for (let i = 0; i < treePathChain.length; i++) {
    const treePath = treePathChain[i];
    const row = frame.locator(`[data-tree-path="${treePath}"]`).first();
    await row.waitFor({ state: 'visible', timeout: 15000 });
    await row.scrollIntoViewIfNeeded();

    const isLeaf = i === treePathChain.length - 1;
    if (isLeaf) {
      const leaf = frame.locator(`[data-tree-path="${treePath}"][role="treeitem"]`);
      await leaf.click();
    } else {
      const expandButton = row.locator('[role="button"]').first();
      if ((await expandButton.count()) > 0) {
        await expandButton.click();
      }
    }
  }
}
