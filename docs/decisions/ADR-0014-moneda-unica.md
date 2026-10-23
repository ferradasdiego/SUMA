# ADR-0014: Una moneda por perfil en el MVP

- **Estado**: Aceptada (provisional)
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

Sumar monedas distintas sin conversión produce cifras falsas. La conversión añade tipos de cambio y fechas.

## Problema

Permitir varias monedas en el MVP o no.

## Alternativas consideradas

1. Multimoneda con conversión
2. Multimoneda sin conversión (totales separados)
3. Una moneda por perfil

## Decisión

Una sola moneda por perfil (EUR por defecto). Cambiarla con registros existentes está bloqueado con un mensaje claro.

## Justificación

Evita totales incorrectos y conversiones no verificables. El campo currency se conserva por registro para el futuro.

## Consecuencias

- El onboarding fija la moneda.
- Para cambiar de moneda hay que exportar y restablecer los datos.
- Los agregados siempre filtran por moneda.

## Riesgos

- Usuarios que esperan multimoneda.
- Migración futura de datos entre monedas.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
