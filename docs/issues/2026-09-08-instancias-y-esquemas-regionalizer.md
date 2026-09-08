# 2026-09-08 — Instancias sin distinguir y esquemas duplicados en `regionalizer`

Encontrado durante la investigación headless documentada en [`../vtex/regionalizer-block-instances.md`](../vtex/regionalizer-block-instances.md). Son hallazgos para discutir con el equipo/desarrollo, no conclusiones cerradas — no se investigó el código fuente de `farmacityar.regionalizer`, solo el contenido servido en runtime.

## 1. Hay 3 instancias de contenido independientes, la suite distingue 2

TC-CHIP-18 pregunta si Desktop y Mobile comparten configuración. La respuesta real es más fina: hay **desktop**, **mobile-header** y **mobile-drawer**, cada uno con `contentMapId` propio. La ficha de test cases no distingue mobile-header de mobile-drawer como configuraciones potencialmente distintas.

**Impacto:** TC-CHIP-18 y TC-CHIP-19 (uso de la barra en Desktop/Mobile) podrían necesitar una tercera variante, o alguien de producto/desarrollo podría confirmar que el drawer siempre refleja el mismo contenido que el header mobile por diseño (no verificado acá).

## 2. Una cuarta ubicación del bloque sin contenido configurado

Dentro del árbol de `header-layout.desktop` hay un `regionalizer` anidado bajo un `responsive-layout.mobile#logo` con `contentMapId: undefined` y `content: {}`. No se determinó si:
- es código/bloque muerto (declarado pero nunca usado en ningún viewport real), o
- se activa bajo alguna condición no observada (ej. un breakpoint específico que la captura no ejercitó).

**Impacto:** si es código muerto, no afecta la suite. Si no lo es, podría ser una cuarta superficie a probar. Requiere confirmación de desarrollo antes de decidir.

## 3. Dos esquemas de ordenamiento coexistiendo: `sortRules` vs `ordenamientos`

El content de desktop tiene **ambos** al mismo tiempo:
- `sortRules`: campos en inglés (`province`, `city`, `criteria`, `masterDataField`, `vtexField`, `operator`, `value`), un único registro de ejemplo ("QA - Más stock primero").
- `ordenamientos`: campos en español (`provincia`, `localidad`, `criterios`, `campoMd`, `campoVtex`, `operador`, `valor`), un único registro de ejemplo ("Colegiales").

Esto coincide con lo que `Plan_TestCases_Chips.md` (en `TQD-1128/`) ya señalaba como diferencia sin reconciliar entre la UH y la guía funcional — acá queda confirmado que **ambos campos existen simultáneamente en el dato real**, no es solo una diferencia documental.

**Pregunta abierta:** ¿cuál de los dos lee el componente en runtime? ¿Es `ordenamientos` un reemplazo en progreso de `sortRules` (o viceversa)? TC-CHIP-22 (convivencia filtro/orden) no debería asumir cuál de los dos está activo sin esa confirmación.

## 4. Dos esquemas de banner coexistiendo: `banner` vs `banners`

Mismo patrón: `banner` es un objeto singular (`bannerEnabled`, `bannerId`, `imageDesktop`, `imageMobile`, ...) y `banners` es un array (`enabled`, `image`, `imageAlt`, ...) con un elemento. Campos con nombres distintos para conceptos equivalentes (ej. `bannerEnabled` vs `enabled`, `imageDesktop`/`imageMobile` vs `image` único).

La guía visual (`docs/guia-visual-regionalizador.md`, sección 10) describe el comportamiento como si fuera una **lista** ("se muestra el primer banner de la lista que cumpla..."), lo que sugiere `banners` (array) es el modelo vigente y `banner` (singular) podría ser legacy — pero esto es una inferencia, no algo verificado contra código.

**Impacto:** cualquier test case de banner debería confirmar con desarrollo cuál campo controla el comportamiento real antes de automatizarse, para no terminar validando un campo que ya no tiene efecto.

## 5. Las instancias mobile no exponen `chips`/`sortRules`/`banner` en absoluto

A diferencia de desktop (17 campos), ambas instancias mobile solo tienen 6 campos (`labelPickup`, `iconPickup`, `title`, `shippingMethods`, `customMessage`, `freeShippingAmount`). No hay evidencia en el dato de que el schema de contenido mobile permita configurar chips, orden o banner — podría ser que nunca se tocó esa sección en mobile (los campos simplemente no se guardaron todavía) o que el schema declarado para esas instancias es distinto/más chico.

**Impacto:** antes de dar por buena una automatización de TC-CHIP-19 en mobile, confirmar si la barra de chips existe conceptualmente en mobile o si es exclusiva de desktop.
