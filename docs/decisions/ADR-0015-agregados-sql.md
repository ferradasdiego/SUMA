# ADR-0015: Agregados SQL con prueba de equivalencia

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

El total acumulado puede requerir sumar miles de registros; cargarlos todos para sumarlos en JS es innecesario.

## Problema

Calcular totales en SQL o en el dominio.

## Alternativas consideradas

1. Tabla de totales precalculados
2. Sumar en memoria todos los registros
3. SUM en SQL validado contra la función de dominio

## Decisión

Los totales usan SUM en SQL; la función de dominio suma arrays y ambas se comparan en pruebas con los mismos fixtures.

## Justificación

Obtiene rendimiento sin introducir una segunda fuente de verdad ni tablas que reconciliar.

## Consecuencias

- Toda consulta agregada filtra por moneda y por rango de fecha local.
- Las pruebas de equivalencia son obligatorias al cambiar cualquiera de las dos implementaciones.
- No se almacenan totales.

## Riesgos

- Divergencia entre SQL y dominio si se modifica una sola parte.
- Consultas mal indexadas.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
