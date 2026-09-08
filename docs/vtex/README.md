# Documentación técnica VTEX

Hallazgos verificados contra `farma5049` (headless, vía API de runtime — nunca clickeando la UI a ciegas), para que cualquier agente que retome este repo tenga contexto actual sin repetir la investigación.

| Documento | Contenido |
|---|---|
| [`site-editor-runtime-api.md`](site-editor-runtime-api.md) | Cómo leer la configuración de cualquier bloque del Site Editor sin abrir un browser visible ni clickear — el mecanismo `__pickRuntime`. |
| [`regionalizer-block-instances.md`](regionalizer-block-instances.md) | Las 4 instancias reales del bloque `regionalizer` en la Home, sus `contentMapId`, y el contenido completo verificado de cada una (2026-09-08). |
| [`site-editor-panels-transcripcion.md`](site-editor-panels-transcripcion.md) | Transcripción a texto de las capturas reales del panel de edición (`TQD-1128/*.png`): etiquetas exactas de cada campo, para no depender de releer imágenes. |
| [`site-editor-ui-interaction.md`](site-editor-ui-interaction.md) | **Leer antes de verificar un panel nuevo.** Metodología: arquitectura de iframes, navegación del árbol, hidratación de React, por qué `getByLabel` directo no sirve y qué usar en su lugar, valores por defecto sorpresivos. |

Ver también [`../issues/`](../issues/) para discrepancias y ambigüedades encontradas durante esta investigación, y [`../guia-visual-regionalizador.md`](../guia-visual-regionalizador.md) para el resumen funcional de la guía original.

**Regla de estos documentos:** todo lo que dice "verificado" viene de una respuesta real de la API, con fecha. Si releés esto más adelante y algo no coincide con lo que ves en `farma5049`, confiá en lo que ves ahora — esto es una foto, no una fuente viva.
