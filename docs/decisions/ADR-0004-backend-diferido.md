# ADR-0004: Backend diferido; Supabase cuando exista necesidad real

- **Estado**: Aceptada (revisión en Fase 6)
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Producto y plataforma

## Contexto

El MVP es local. La sincronización y las cuentas solo tienen sentido si la retención demuestra necesidad.

## Problema

Elegir backend ahora o posponerlo.

## Alternativas consideradas

1. Supabase desde el inicio
2. Backend propio (Node + PostgreSQL)
3. Sin backend en el MVP

## Decisión

Sin backend en el MVP. Si se activa, se usará Supabase con PostgreSQL, autenticación y Row Level Security, con migraciones reproducibles.

## Justificación

Evita coste, complejidad y superficie de seguridad antes de validar el producto. Supabase cubre autenticación y RLS sin mantener servidores propios.

## Consecuencias

- El esquema local incluye user_id y fechas de auditoría para facilitar la migración.
- Las políticas RLS y las pruebas de autorización se añadirán al activar el backend.
- No se implementará sincronización compleja hasta que haya necesidad.

## Riesgos

- Que la migración a la nube llegue tarde y sea costosa.
- Dependencia de un proveedor.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
