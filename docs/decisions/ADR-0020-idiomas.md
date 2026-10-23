# ADR-0020: Cinco idiomas con selector de banderas

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador), Agente 4 (arquitectura)
- **Ámbito**: Producto e interfaz

## Contexto

El MVP estaba solo en español. El usuario quiere inglés, gallego, catalán y portugués, con una bandera por idioma, y poder elegir el idioma al abrir la app por primera vez o desde Ajustes.

## Problema

Añadir cinco idiomas sin reescribir las pantallas, sin depender de una librería pesada y sin dejar textos, errores o la barra de pestañas en el idioma anterior.

## Alternativas consideradas

1. i18next + react-i18next con archivos JSON.
2. Diccionarios propios tipados y una función `t()`.
3. Traducir solo las pantallas principales y dejar los errores en español.
4. Usar emojis de bandera para todos los idiomas.

## Decisión

Se usan diccionarios propios en `src/i18n/locales`, tipados contra las claves del español. `AppProvider` fija el locale activo al cargar o actualizar el perfil. La barra de pestañas se suscribe al contexto para refrescar sus títulos. Los errores de dominio se traducen con un mapa de mensajes en `translateError`.

Las banderas son SVG propios: España, Reino Unido, Galicia, Cataluña y Portugal. No se usan emojis porque Galicia y Cataluña no tienen bandera emoji estándar.

## Justificación

- TypeScript detecta una clave ausente en cualquiera de los cinco diccionarios.
- No se añade una dependencia de i18n para un MVP pequeño.
- El selector con banderas es reconocible y funciona sin red.
- La traducción de errores evita mezclar idiomas en formularios y avisos.

## Consecuencias

- Añadir un idioma exige completar todas las claves y sus marcadores.
- Los tests comprueban paridad de claves y de parámetros, no la calidad lingüística.
- `profile.locale` determina el idioma y el formato de fechas/importes.
- El español es el idioma por defecto; el inglés usa `en-GB` y el portugués `pt-PT`.
- Las banderas se dibujan con `react-native-svg` y son decorativas para lectores de pantalla.

## Riesgos

- Traducciones mejorables; conviene una revisión nativa antes de publicar.
- El cambio de idioma en una pantalla con un mensaje de error ya mostrado puede dejar ese mensaje en el idioma anterior; se limpian los mensajes al cambiar.
- Diferencias de formato regional dentro de un mismo idioma.
