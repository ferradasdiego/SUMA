# ADR-0019: Importación JSON con fusión o reemplazo

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador), Agente 4 (arquitectura)
- **Ámbito**: Datos y experiencia

## Contexto

La app ya exportaba una copia JSON, pero no permitía restaurarla. El usuario quiere importar una copia y decidir si se fusiona con los datos actuales o si se reemplazan todos.

## Problema

Restaurar datos sin duplicar registros, sin romper las restricciones de moneda/objetivo y sin dejar la base a medias si el archivo es inválido.

## Alternativas consideradas

1. Importar siempre reemplazando, sin preguntar.
2. Fusionar siempre, sin opción destructiva.
3. Importar sin validar y confiar en las restricciones SQL.
4. Validar el archivo y ofrecer ambas operaciones en una transacción.

## Decisión

Se valida el archivo completo con Zod y comprobaciones de invariantes antes de escribir. La UI pregunta **Fusionar** o **Reemplazar**; el reemplazo pide una segunda confirmación. La escritura se hace en una única transacción.

- Fusionar: conserva el perfil local, exige la misma moneda, inserta categorías que falten, omite registros/objetivos con el mismo identificador y deja inactivos los objetivos importados si ya hay uno activo.
- Reemplazar: borra registros, objetivos, categorías y perfil; restaura la copia completa, incluidos locale, moneda e importes rápidos.

## Justificación

- Los identificadores UUID permiten distinguir registros existentes sin heurísticas por importe/fecha.
- La validación previa evita transacciones parciales y mensajes SQL incomprensibles.
- La fusión es segura para restaurar una copia sobre datos vivos; el reemplazo cubre el caso de recuperación total.
- La moneda única del MVP impide fusionar copias de otra moneda sin conversión.

## Consecuencias

- Se añade `expo-document-picker` y un lector de archivos por plataforma.
- La exportación debe incluir el perfil completo para que el reemplazo restaure idioma y preferencias.
- El reemplazo es destructivo y requiere confirmación explícita.
- Un archivo ajeno o una versión futura se rechazan sin tocar la base.
- La fusión no actualiza registros existentes: conserva la versión local.

## Riesgos

- El usuario puede elegir reemplazar por error; se mitiga con el resumen, el texto de advertencia y la segunda confirmación.
- Archivos muy grandes; se limita el tamaño y el número de elementos.
- Diferencias de MIME/tipo de archivo entre iOS, Android y web.
