# SUMA — Estado del proyecto

| Campo | Valor |
|---|---|
| Última actualización | 2026-10-23 |
| Fase actual | **Fase 4 — Historial, estadísticas y objetivos** |
| Estado global | Núcleo funcional implementado: persistencia, registro e Inicio. |
| Documento base | [SUMA_MASTER_SPEC.md](../SUMA_MASTER_SPEC.md) v1.0 |
| Plan vigente | [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) |
| Arquitectura vigente | [ARCHITECTURE.md](./ARCHITECTURE.md) |

> Solo se registra lo que existe y se ha comprobado. Una pantalla o un archivo no equivalen a una función terminada.

---

## 1. Resumen

- Fases 0 a 3 cerradas: memoria, esqueleto técnico, dominio/persistencia y flujo registro → Inicio.
- 76 pruebas automatizadas en verde (unitarias, integración con SQLite real y componentes).
- La app empaqueta para iOS y Android; **no se ha ejecutado en simulador** por la licencia de Xcode.
- Persistencia verificada con cierre y reapertura de la base en pruebas de integración.

---

## 2. Artefactos

```
app/                          rutas: onboarding, Inicio, Añadir, Historial, Estadísticas, Ajustes, Objetivo
src/domain/                   dinero, fechas, periodos, cálculos, validación (puro, sin React)
src/data/                     driver SQL, migración 001, repositorios, base de datos
src/features/                 AppProvider, formulario de alta, datos de Inicio
src/components/               UI, feedback, entries, goals
tests/                        14 suites, 76 pruebas
docs/                         memoria + 17 ADR
.github/workflows/ci.yml      pipeline de calidad
```

---

## 3. Entorno

| Recurso | Resultado |
|---|---|
| macOS / Node / pnpm | 27.0.1 arm64 / 24.8.0 / 10.17.0 |
| Expo / RN / React / TS | 58.0.17 / 0.88.0 / 19.3.0 / 6.0.3 |
| Git | Repositorio en `main` |
| Xcode | 26.6, licencia **no aceptada** |
| Simuladores iOS | Bloqueados por la licencia |
| JDK / Android SDK | Ausentes |
| Red npm | Correcta |

Nota de sandbox: Expo se ejecuta con `HOME=$PWD/.home` y `EXPO_NO_TELEMETRY=1`; los comandos se lanzan con `node node_modules/expo/bin/cli` porque el home del usuario no es escribible en este entorno. En CI o en una máquina normal no hace falta.

---

## 4. Estado por fase

| Fase | Estado | Evidencia |
|---|---|---|
| 0 — Preparación | Cerrada | 13 documentos, 17 ADR, repositorio |
| 1 — Esqueleto técnico | Cerrada (nativa pendiente) | 9 pruebas, doctor 20/20, bundles |
| 2 — Dominio y persistencia | Cerrada | 58 pruebas, SQLite real, reapertura |
| 3 — Registro e Inicio | Cerrada | 76 pruebas, formulario, Inicio, onboarding, ajustes |
| 4 — Historial, estadísticas y objetivos | En curso | — |
| 5 — Calidad y accesibilidad | No iniciada | — |
| 6 — Beta | No iniciada (bloqueada) | — |
| 7 — Monetización | No iniciada | — |

Progreso: **4 de 8 fases cerradas**. Tareas: **27 de 54 cerradas**, 3 parciales, 1 bloqueada. Criterios de aceptación con evidencia automatizada: 10 de 35 (falta validación en dispositivo).

---

## 5. Pruebas ejecutadas

| Comprobación | Resultado |
|---|---|
| `pnpm format:check` | Correcto |
| `pnpm lint` | 0 errores, 0 avisos |
| `pnpm typecheck` | 0 errores |
| `pnpm exec jest --runInBand` | 14 suites, 76/76 |
| `pnpm audit --prod --audit-level high --ignore-unfixable` | Sin vulnerabilidades accionables |
| Expo Doctor | 20/20 |
| Bundle iOS | 5,2 MB |
| Bundle Android | 5,2 MB |
| Simulador | Bloqueado por licencia |

Cobertura funcional de las pruebas: dinero (parseo/formato/límites), fechas y DST, periodos y comparaciones, agregados, objetivos, migraciones, CRUD, restricciones, persistencia, reapertura, transacciones, preparación del alta, componentes y accesibilidad básica.

---

## 6. Decisiones

Las 17 decisiones están en [DECISIONS.md](./DECISIONS.md). Supuestos P1–P8 sin cambios: `com.suma.mobile`, español, EUR, sin notificaciones, exportación JSON, un objetivo activo.

---

## 7. Bloqueos

| ID | Bloqueo | Impacto | Desbloqueo |
|---|---|---|---|
| B1 | Licencia de Xcode | Sin simulador, build iOS ni E2E | `sudo xcodebuild -license` |
| B2 | Sin JDK ni Android SDK | Sin build Android local | Temurin + cmdline-tools o EAS |
| B3 | Sin cuentas de tienda | Sin distribución | Alta de cuentas |
| B6 | Sin dispositivo físico | Accesibilidad solo estimada | Prueba manual |

---

## 8. Próximos pasos

1. Fase 4: Historial con filtros, edición y borrado.
2. Fase 4: Estadísticas por periodo con gráficas propias.
3. Fase 4: Objetivo activo (crear, editar, borrar, progreso).
4. Fase 5: casos límite, accesibilidad, exportación y documentación final.

---

## 9. Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-23 | Fase 0: memoria y ADR |
| 2026-10-23 | Fase 1: scaffold, tema, componentes, rutas, CI |
| 2026-10-23 | Fase 2: dominio, SQLite, migraciones, repositorios |
| 2026-10-23 | Fase 3: AppProvider, onboarding, alta, Inicio, ajustes |
| 2026-10-23 | Inicio de Fase 4 |
