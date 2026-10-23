# SUMA — Protocolo de agentes

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Vigente |
| Propietario | Agente 0 — Coordinador |
| Referencia | SUMA_MASTER_SPEC.md §13, §14, §22 |

## 1. Fuente de verdad

Antes de trabajar, cada rol lee los documentos pertinentes:

- Visión: PROJECT_BRIEF.md
- Requisitos: PRODUCT_REQUIREMENTS.md
- Técnica: ARCHITECTURE.md y API_CONTRACTS.md
- Datos: DATA_MODEL.md
- Diseño: DESIGN_SYSTEM.md
- Seguridad: SECURITY.md
- Pruebas: TEST_STRATEGY.md
- Despliegue: DEPLOYMENT.md
- Estado: STATUS.md

El historial de conversación no es fuente de verdad. Si un documento y el código discrepan, se corrige el código o el documento en el mismo cambio.

## 2. Honestidad

- No se declara una función implementada si solo existe la interfaz.
- No se inventan resultados de pruebas, compilaciones o publicaciones.
- Las limitaciones del entorno se documentan.
- Si falta información no crítica, se decide, se documenta el supuesto y se continúa.
- Si falta una decisión que afecta a la arquitectura, se plantean alternativas y se recomienda una.

## 3. Propiedad y conflictos

- Cada archivo tiene un propietario por fase (EXECUTION_PLAN §3).
- Cambiar un archivo ajeno requiere coordinación y registro.
- Los contratos solo cambian con actualización de ARCHITECTURE/API_CONTRACTS y, si aplica, ADR.
- Prohibidas las refactorizaciones masivas durante la estabilización.

## 4. Flujo de trabajo

1. Leer requisitos y contratos.
2. Confirmar dependencias cerradas.
3. Implementar la tarea más pequeña que cumpla el criterio.
4. Escribir o actualizar pruebas.
5. Ejecutar el pipeline completo.
6. Revisar el diff y la coherencia con el dominio.
7. Actualizar la memoria.
8. Entregar el informe.

## 5. Informe de entrega

Formato obligatorio:

- Estado: completada, parcial o bloqueada.
- Funcionalidades realmente implementadas.
- Archivos creados o modificados (rutas exactas).
- Decisiones técnicas y motivos.
- Dependencias añadidas y justificación.
- Pruebas ejecutadas: comando y resultado real.
- Pruebas no ejecutadas y motivo.
- Riesgos y problemas priorizados.
- Tareas pendientes y dependencias.
- Siguiente fase: objetivo y criterio de salida.

## 6. Revisión antes de integrar

Checklist:

- [ ] TypeScript estricto sin errores.
- [ ] Lint y formato.
- [ ] Pruebas nuevas y regresión en verde.
- [ ] Sin secretos ni datos personales.
- [ ] Contratos respetados.
- [ ] Estados vacío/carga/error si toca UI.
- [ ] Accesibilidad básica.
- [ ] Documentación actualizada.
- [ ] Sin cambios no relacionados en el diff.

## 7. Memoria compartida

Se actualiza en el mismo cambio: STATUS tras cada tarea, DECISIONS ante una decisión, ARCHITECTURE ante un cambio de contrato, DATA_MODEL ante un cambio de esquema. No se guardan secretos ni datos personales.

## 8. Agentes en este entorno

No hay un sistema de agentes independientes ejecutándose en paralelo. Los roles se simulan por fases o mediante subagentes, y el informe indica qué ocurrió realmente.
