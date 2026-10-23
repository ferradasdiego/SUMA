# ADR-0007: Context + dataVersion para el estado de la aplicación

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

El MVP no tiene capa remota. Los datos viven en SQLite y deben refrescarse tras cada mutación.

## Problema

Elegir el modelo de estado sin introducir dependencias innecesarias.

## Alternativas consideradas

1. Zustand
2. Redux Toolkit
3. TanStack Query
4. React Context + versión de datos

## Decisión

Un AppProvider con Context y un contador dataVersion. Los hooks de datos vuelven a consultar al cambiar la versión.

## Justificación

Es suficiente para el tamaño del MVP, elimina dependencias y evita duplicar los datos de SQLite en un store global.

## Consecuencias

- La invalidación es explícita: toda mutación debe llamar a invalidate().
- No hay caché de totales, por lo que no puede desincronizarse.
- Si la complejidad crece, se revisará con un ADR nuevo.

## Riesgos

- Olvidar invalidar tras una mutación.
- Re-renderizados amplios en cada cambio de versión.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
