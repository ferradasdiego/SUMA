# ADR-0017: Driver SQL abstracto con sql.js para pruebas

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

expo-sqlite es un módulo nativo que no se ejecuta en Jest/Node.

## Problema

Probar persistencia real sin compilar nativo.

## Alternativas consideradas

1. Mockear el repositorio
2. Probar solo en dispositivo
3. Driver abstracto con implementación sql.js

## Decisión

Interfaz SqlDriver con dos implementaciones: expoDriver en la app y sqljsDriver en pruebas.

## Justificación

Permite ejecutar el mismo SQL y las mismas migraciones en Node, incluyendo cierre y reapertura mediante exportación de bytes.

## Consecuencias

- Todo acceso a datos pasa por la interfaz.
- Las pruebas de integración cubren SQL real.
- Cualquier función específica de expo-sqlite debe quedar dentro del driver.

## Riesgos

- Que las dos implementaciones diverjan.
- Comportamientos distintos de SQLite entre versiones.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
