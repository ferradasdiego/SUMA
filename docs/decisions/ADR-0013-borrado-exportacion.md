# ADR-0013: Borrado físico y exportación JSON

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

El usuario debe poder controlar sus datos: exportarlos y eliminarlos.

## Problema

Definir la política de borrado y el formato de exportación del MVP.

## Alternativas consideradas

1. Borrado lógico
2. Exportación CSV
3. Exportación JSON
4. Sin exportación

## Decisión

Borrado físico de registros y exportación completa en JSON desde Ajustes. CSV se pospone.

## Justificación

El borrado físico es simple, comprensible y coherente con los totales. JSON conserva todos los campos y permite una futura importación sin pérdida.

## Consecuencias

- No hay papelera ni deshacer tras confirmar.
- El JSON contiene notas personales: se advierte antes de compartir.
- La importación no está en el MVP; el formato se documenta para hacerla posible.

## Riesgos

- Borrado accidental (se exige confirmación).
- Exportación con datos sensibles compartida por error.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
