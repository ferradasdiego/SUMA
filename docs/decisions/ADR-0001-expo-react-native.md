# ADR-0001: React Native con Expo y TypeScript para iOS y Android

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Producto y plataforma

## Contexto

El MVP debe funcionar en iOS y Android con un equipo pequeño y un único repositorio. El plazo y el mantenimiento importan más que exprimir capacidades nativas.

## Problema

Elegir la tecnología del cliente móvil sin generar dos bases de código divergentes.

## Alternativas consideradas

1. Flutter (Dart)
2. Desarrollo nativo separado (Swift + Kotlin)
3. React Native sin Expo (bare)

## Decisión

React Native 0.88 sobre Expo SDK 58, con TypeScript en modo estricto y Expo Router.

## Justificación

Compartir código y conocimiento entre plataformas, aprovechar EAS para compilaciones y actualizaciones, y disponer de un ecosistema maduro de SQLite, SVG y pruebas. TypeScript hace explícitos los contratos entre módulos.

## Consecuencias

- Un solo código para las dos plataformas y una única navegación.
- El rendimiento depende del runtime JS: hay que medir y evitar cálculos en render.
- Algunas capacidades nativas requerirán módulos específicos o prebuild.
- Se adopta el ciclo de versiones de Expo (una actualización de SDK al año, como mínimo).

## Riesgos

- Dependencia del ecosistema Expo.
- Cambios de API entre SDKs.
- Limitaciones de Hermes con Intl (se verificará en Fase 1).

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
