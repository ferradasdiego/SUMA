# ADR-0009: Sincronización diferida con diseño preparado

- **Estado**: Aceptada (diferida)
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

Varios dispositivos y copias de seguridad son deseables, pero añaden conflictos, duplicados y estados intermedios.

## Problema

Definir la estrategia de sincronización antes de tener usuarios.

## Alternativas consideradas

1. Sincronización completa ahora
2. CRDT desde el inicio
3. Diferir y preparar el esquema

## Decisión

No se implementa sincronización en el MVP. El esquema ya usa UUID generados en cliente y fechas updated_at; al añadirla se incorporarán tumbas (deleted_at) y una cola de operaciones idempotente.

## Justificación

La sincronización sin necesidad real multiplica la complejidad y los modos de fallo. El diseño actual no la impide.

## Consecuencias

- El borrado es físico en el MVP; al sincronizar se migrará a borrado lógico con tumbas.
- Las operaciones futuras deberán ser idempotentes.
- Se documentará la política de conflictos antes de implementarla.

## Riesgos

- Cambio de esquema costoso cuando llegue la sincronización.
- Duplicados en la migración inicial.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
