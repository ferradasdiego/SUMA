# ADR-0003: Modo local sin cuenta obligatoria

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Producto y plataforma

## Contexto

El producto debe permitir registrar una decisión en segundos. Un registro obligatorio añade fricción y recogida de datos personales.

## Problema

Decidir si el MVP exige cuenta de usuario.

## Alternativas consideradas

1. Cuenta obligatoria desde el inicio
2. Modo invitado con conversión posterior
3. Solo local

## Decisión

El MVP funciona íntegramente en local, sin cuenta ni red. La cuenta y la sincronización se posponen.

## Justificación

Minimiza fricción y datos personales, y permite validar el hábito antes de invertir en infraestructura. El esquema conserva user_id para facilitar la migración futura.

## Consecuencias

- No hay copia de seguridad remota: el usuario debe poder exportar.
- La pérdida o el cambio de dispositivo implica pérdida de datos si no hay exportación.
- La migración a cuenta requerirá conciliación explícita y detección de duplicados.

## Riesgos

- Pérdida de datos percibida como fallo del producto.
- Migración futura mal resuelta que duplique registros.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
