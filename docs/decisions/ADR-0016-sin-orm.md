# ADR-0016: Sin ORM: SQL tipado y mappers Zod

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

El esquema es pequeño y las consultas son pocas y conocidas.

## Problema

Usar un ORM o escribir SQL directamente.

## Alternativas consideradas

1. Drizzle ORM
2. Prisma
3. SQL directo con mappers validados

## Decisión

SQL directo encapsulado en repositorios, con mappers que validan cada fila con Zod.

## Justificación

Menos dependencias, control total de índices y consultas, y validación explícita de filas. El coste de mapeo es bajo para cuatro tablas.

## Consecuencias

- Hay que mantener el SQL y los mappers a mano.
- Las filas inválidas se detectan al leer, no se propagan.
- Los cambios de esquema exigen actualizar mapper y pruebas.

## Riesgos

- Errores de SQL no detectados hasta ejecutar (mitigado con pruebas de integración).
- Trabajo repetitivo de mapeo.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
