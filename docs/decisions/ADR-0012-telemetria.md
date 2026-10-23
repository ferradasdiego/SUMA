# ADR-0012: Sin telemetría de terceros en el MVP

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

La privacidad es un principio del producto y los datos son financieros y personales.

## Problema

Decidir qué datos de uso se recogen y con qué herramientas.

## Alternativas consideradas

1. Firebase Analytics
2. Sentry
3. Analítica propia alojada
4. Ninguna

## Decisión

El MVP no incorpora analítica ni informes de fallos remotos. Solo logs locales de desarrollo sin datos personales.

## Justificación

Minimiza la recogida y elimina dependencias, consentimientos y transferencias internacionales. La validación se hará con entrevistas y métricas locales agregadas.

## Consecuencias

- No habrá informe remoto de errores.
- Las métricas de negocio se obtendrán de la beta con consentimiento explícito.
- Cualquier analítica futura requerirá actualizar SECURITY, la política de privacidad y este ADR.

## Riesgos

- Detectar errores en producción será más lento.
- Decisiones de producto con menos datos.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
