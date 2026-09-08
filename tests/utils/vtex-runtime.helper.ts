import type { Page } from '@playwright/test';

/**
 * Lee el contenido real de un bloque del Site Editor sin UI, vía el mecanismo
 * __pickRuntime de VTEX Store Framework. Ver docs/vtex/site-editor-runtime-api.md
 * para el detalle de cómo se descubrió y sus limitaciones conocidas.
 *
 * No confirmado: una señal confiable de "runtime ya cargado" distinta de un
 * tiempo fijo de espera. Por eso este helper vive en utils/, no se usa
 * waitForTimeout dentro de un spec (RULE-3 en scripts/lint-tests.js).
 */

export type SiteEditorDevice = 'desktop' | 'mobile' | 'tablet';

const PICK_RUNTIME_FIELDS = [
  'appsEtag',
  'blocks',
  'blocksTree',
  'components',
  'contentMap',
  'extensions',
  'messages',
  'page',
  'pages',
  'query',
  'queryData',
  'route',
  'runtimeMeta',
  'settings',
].join(',');

export interface RuntimeExtension {
  component?: string;
  blockId?: string;
  contentMapId?: string;
  contentIds?: string[];
  content?: Record<string, unknown>;
}

export interface SiteEditorRuntime {
  route?: { id?: string };
  pages?: Record<string, unknown>;
  extensions: Record<string, RuntimeExtension>;
  contentMap?: Record<string, unknown>;
}

/**
 * Navega el storefront con __siteEditor=true y captura el body del primer
 * __pickRuntime que responda para el device pedido. Requiere que `page`
 * pertenezca a un context con una sesion valida (ver scripts/save-workspace-auth.js)
 * si el ambiente exige login - la Home de farma5049 no lo exige para lectura
 * publica, pero otras paginas podrian.
 */
export async function fetchSiteEditorRuntime(
  page: Page,
  options: { baseUrl: string; device?: SiteEditorDevice; timeoutMs?: number } = {
    baseUrl: '',
  },
): Promise<SiteEditorRuntime> {
  const { baseUrl, device = 'desktop', timeoutMs = 20000 } = options;

  const runtimePromise = page.waitForResponse(
    (res) => {
      const url = res.url();
      return url.includes('__siteEditor=true') && url.includes('__pickRuntime');
    },
    { timeout: timeoutMs },
  );

  await page.goto(
    `${baseUrl}/?__siteEditor=true&__pickRuntime=${PICK_RUNTIME_FIELDS}&__device=${device}`,
    { waitUntil: 'domcontentloaded' },
  );

  const res = await runtimePromise;
  const text = await res.text();
  return JSON.parse(text) as SiteEditorRuntime;
}

/**
 * Busca todas las instancias de un componente dado en el runtime (ver
 * docs/vtex/regionalizer-block-instances.md: el mismo componente puede
 * aparecer en varios paths del arbol con contentMapId independientes).
 */
export function findExtensionsByComponent(
  runtime: SiteEditorRuntime,
  component: string,
): Array<{ path: string; extension: RuntimeExtension }> {
  return Object.entries(runtime.extensions)
    .filter(([, ext]) => ext.component === component)
    .map(([path, extension]) => ({ path, extension }));
}
