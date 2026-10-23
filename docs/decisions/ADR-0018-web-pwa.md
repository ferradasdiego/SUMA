# ADR-0018: Canal web/PWA adicional

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador), Agente 4 (arquitectura)
- **Ámbito**: Plataforma

## Contexto

La app nativa requiere Expo Go, simulador o builds. El usuario quiere servirla desde su Mac, abrirla en el móvil e instalarla como aplicación local, sin depender de tiendas.

## Problema

Añadir un canal web instalable sin duplicar la lógica de dominio ni comprometer la app móvil.

## Alternativas consideradas

1. Mantener solo iOS/Android.
2. Crear una web separada con otro modelo de datos (localStorage).
3. Usar SQLite WASM con IndexedDB y un driver web propio.
4. Reutilizar el código con react-native-web y la implementación web oficial de expo-sqlite.

## Decisión

Se añade un canal web/PWA con react-native-web, Expo Router en modo `single`, la implementación web de `expo-sqlite` (wa-sqlite/WASM + OPFS), un manifest y un service worker. Se sirve con un servidor estático propio que aplica COOP/COEP y se prueba con Chrome headless.

## Justificación

- Reutiliza dominio, persistencia, pantallas y pruebas existentes.
- Mantiene una única fuente de verdad de datos y cálculos.
- La PWA se instala desde el navegador y funciona sin conexión tras la primera carga.
- La implementación oficial de SQLite web evita otro driver y otra ruta de datos.

## Consecuencias

- Hay que servir con HTTPS en la red local y con cabeceras de aislamiento.
- Los datos quedan ligados al origen del navegador; no se sincronizan con la app nativa.
- El service worker requiere estrategia de actualización y versionado.
- El HTML de la PWA se post-procesa porque `+html.tsx` no se aplica en `output: 'single'`.
- Se añade Playwright como herramienta de verificación local, no como dependencia de la app.

## Riesgos

- Diferencias de comportamiento entre web y nativo (teclado, gestos, rendimiento).
- Evicción de almacenamiento en iOS.
- Certificados locales mal configurados que impiden el service worker.
- Complejidad adicional de despliegue; se documenta como canal opcional.
