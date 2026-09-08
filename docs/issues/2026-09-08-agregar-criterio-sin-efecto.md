# 2026-09-08 — AGREGAR de "Criterios de orden" sin efecto observable

Encontrado verificando `SiteEditorOrderRulesPage` en vivo contra la regla real "QA - Más stock primero" en farma5049. No es una conclusión cerrada — quedó sin resolver por costo/beneficio, documentado para no repetir el mismo debugging.

## Qué se probó

Con la regla "QA - Más stock primero" abierta (sus campos de nivel-regla — nombre, provincia, localidad, toggle — se leyeron y confirmaron correctos), se intentó clickear el botón "AGREGAR" de la sección "Criterios de orden (el primero manda)" para abrir el editor de un criterio nuevo. El click no tuvo ningún efecto observable en tres variantes del selector:

1. `getByRole('button', {name:'AGREGAR'}).last()` — **selector incorrecto**, confirmado: con la regla abierta hay **4** botones "AGREGAR" visibles en el DOM (el panel raíz — Chips/Orden/Banner — sigue montado detrás del editor de regla, no se desmonta), y `.last()` no corresponde al de Criterios de orden.
2. El mismo botón ubicado por bounding box (posición x/y).
3. El botón ubicado por contexto de texto cercano (`"Criterios de orden (el primero manda)"` como ancestro), que sí resuelve a `count: 1` correctamente — pero el click sobre ESE resultado tampoco tuvo efecto.

En los tres casos se midió `(await frame.locator('body').innerText()).length` antes y después del click: **valor idéntico**, sin importar si se esperaban 0, 6 u 8 segundos antes de clickear. Se descartó como causa la hidratación de React (que sí era el problema real en la navegación del árbol, ver `site-editor-ui-interaction.md`) porque agregar la misma espera que soluciona ESE caso acá no cambió nada.

## Qué no se investigó

- Si el click sí registra pero el criterio nuevo se agrega en un estado colapsado/oculto que no cambia el texto plano de la página (posible, no verificado).
- Si hace falta un click adicional o un estado previo distinto (ej. la lista de criterios podría necesitar estar "vacía" de cierta forma, o el botón real podría estar en un componente con lógica de apertura distinta al resto del formulario).
- Tráfico de red disparado por el click (no se grabó en este intento).
- El editor de un criterio nuevo NO fue accedido — todos los campos de `SiteEditorOrderRulesPage` a partir de `nombreDelCriterioInput()` (`origenDelDatoSelect`, `campoDeMasterDataInput`, `campoDeVtexSelect`, `comoOrdenaEsteCriterioSelect`, `valorDeComparacionInput`, `aplicarCriterioButton`) siguen sin verificar en vivo — sus labels vienen solo de la transcripción de la captura de pantalla.

## Impacto

Cualquier test case que necesite crear o modificar un criterio de orden (parte de TC-CHIP-22) no se puede automatizar todavía con este Page Object tal cual. Antes de intentarlo: grabar tráfico de red durante un click manual real en el navegador para confirmar si el click dispara algo, y si no, reconsiderar si el selector realmente apunta al elemento que React está escuchando (podría no ser un `<button>` simple sino requerir un evento distinto, como ocurrió con el chevron del árbol).
