# ADR-0005: Importes en unidades menores enteras

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

Los importes monetarios se suman, comparan y agrupan con frecuencia. Los errores de coma flotante son inaceptables en finanzas.

## Problema

Representar dinero sin pérdida de precisión.

## Alternativas consideradas

1. number en coma flotante
2. Decimal/bignumber
3. Enteros en unidades menores

## Decisión

Todos los importes se almacenan y calculan como enteros en unidades menores (2,50 EUR = 250).

## Justificación

La aritmética entera es exacta y suficiente. Los decimales por moneda se resuelven en los límites (parseo y formato).

## Consecuencias

- Toda la UI pasa por parseAmount y formatAmount.
- Las divisiones solo se usan para ratios de presentación, con redondeo explícito al mostrar.
- El esquema impone límites con CHECK.

## Riesgos

- Parseo incorrecto de separadores locales.
- Desbordamiento por encima del límite permitido (se valida).

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
