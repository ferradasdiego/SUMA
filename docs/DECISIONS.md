# SUMA — Índice de decisiones

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Vigente |
| Propietario | Agente 0 — Coordinador |

## 1. Decisiones arquitectónicas

| ADR | Decisión | Estado |
|---|---|---|
| [ADR-0001](./decisions/ADR-0001-expo-react-native.md) | React Native + Expo + TypeScript | Aceptada |
| [ADR-0002](./decisions/ADR-0002-sqlite-local.md) | SQLite local con expo-sqlite | Aceptada |
| [ADR-0003](./decisions/ADR-0003-modo-local.md) | Modo local sin cuenta | Aceptada |
| [ADR-0004](./decisions/ADR-0004-backend-diferido.md) | Backend diferido; Supabase si se activa | Aceptada (revisión Fase 6) |
| [ADR-0005](./decisions/ADR-0005-unidades-menores.md) | Importes en unidades menores | Aceptada |
| [ADR-0006](./decisions/ADR-0006-fechas-zonas-horarias.md) | Fecha local del registro como clave | Aceptada |
| [ADR-0007](./decisions/ADR-0007-gestion-estado.md) | Context + dataVersion | Aceptada |
| [ADR-0008](./decisions/ADR-0008-graficas.md) | Gráficas propias con react-native-svg | Aceptada |
| [ADR-0009](./decisions/ADR-0009-sincronizacion.md) | Sincronización diferida | Aceptada (diferida) |
| [ADR-0010](./decisions/ADR-0010-suscripciones.md) | Monetización diferida | Aceptada |
| [ADR-0011](./decisions/ADR-0011-testing.md) | Jest + jest-expo + RNTL + sql.js | Aceptada |
| [ADR-0012](./decisions/ADR-0012-telemetria.md) | Sin telemetría en el MVP | Aceptada |
| [ADR-0013](./decisions/ADR-0013-borrado-exportacion.md) | Borrado físico y exportación JSON | Aceptada |
| [ADR-0014](./decisions/ADR-0014-moneda-unica.md) | Una moneda por perfil | Aceptada (provisional) |
| [ADR-0015](./decisions/ADR-0015-agregados-sql.md) | Agregados SQL con equivalencia | Aceptada |
| [ADR-0016](./decisions/ADR-0016-sin-orm.md) | Sin ORM; SQL + mappers Zod | Aceptada |
| [ADR-0017](./decisions/ADR-0017-driver-sql-test.md) | Driver abstracto con sql.js | Aceptada |

## 2. Decisiones de producto pendientes

| ID | Tema | Supuesto aplicado | Necesario antes de | Estado |
|---|---|---|---|---|
| P1 | Identificador de app y titular | com.suma.mobile, suma | Fase 1 | Abierta |
| P2 | Notificaciones en el MVP | Fuera del MVP | Fase 3 | Abierta |
| P3 | Cálculo del objetivo | Suma por periodo | Fase 4 | Abierta |
| P4 | Formato de exportación | JSON | Fase 5 | Abierta |
| P5 | Moneda | Una por perfil | Fase 2 | Abierta |
| P6 | Canales de beta | TestFlight + Play Internal | Fase 6 | Abierta |
| P7 | Modo oscuro | Pospuesto | Fase 6 | Abierta |
| P8 | Textos legales | Borrador y revisión externa | Fase 6 | Abierta |

Si no hay respuesta en la fecha indicada, se aplica el supuesto y se registra aquí con fecha.

## 3. Registro de cambios

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-23 | Se aprueban ADR-0001 a ADR-0017 | Fase 0: reducir incertidumbre antes de implementar |
| 2026-10-23 | Se aplican supuestos P1–P8 | Evitar bloqueo; pendientes de confirmación |
