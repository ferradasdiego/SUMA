# ADR-0006: Fecha local del registro como clave temporal

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

La app agrupa por día, semana, mes y año. El usuario puede viajar o cambiar de zona horaria, y hay cambios de horario de verano.

## Problema

Definir qué significa que un registro pertenece a un día.

## Alternativas consideradas

1. Guardar solo el instante UTC
2. Guardar solo la fecha local
3. Guardar instante UTC + fecha local + zona

## Decisión

Se guardan occurred_at_utc, occurred_local_date (YYYY-MM-DD) y occurred_tz. La agrupación usa occurred_local_date; el instante UTC se usa para orden y auditoría.

## Justificación

La fecha local capturada en el momento de la decisión es la intención del usuario. Recortar por UTC produciría días desplazados; reinterpretar fechas antiguas al cambiar de zona alteraría el historial.

## Consecuencias

- Los límites de periodo son aritmética de calendario sobre la fecha local, sin depender de la zona.
- Cambiar de zona no reinterpreta registros antiguos.
- No se necesita una librería de fechas: Intl para obtener la fecha local actual y aritmética UTC anclada.

## Riesgos

- Errores en el cálculo del primer día de semana.
- Casos DST si en el futuro se agrupa por hora.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
