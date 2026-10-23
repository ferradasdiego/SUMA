# SUMA — Estado del proyecto

| Campo | Valor |
|---|---|
| Última actualización | 2026-10-23 |
| Fase actual | **Fase 2 — Dominio y persistencia** |
| Estado global | Esqueleto técnico funcionando y verificado. Persistencia en curso. |
| Documento base | [SUMA_MASTER_SPEC.md](../SUMA_MASTER_SPEC.md) v1.0 |
| Plan vigente | [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) |
| Arquitectura vigente | [ARCHITECTURE.md](./ARCHITECTURE.md) |

> Solo se registra lo que existe y se ha comprobado. Una pantalla o un archivo no equivalen a una función terminada.

---

## 1. Resumen

- Fase 0 cerrada: 13 documentos de memoria y 17 ADR.
- Fase 1 cerrada: proyecto Expo SDK 58 con TypeScript estricto, Expo Router, tema, componentes base, pruebas y CI.
- Verificado con comandos reales: typecheck, lint, formato, 9 pruebas, `expo-doctor` 20/20 y bundles iOS/Android.
- La app arranca y navega en el bundle; **no se ha podido ejecutar en simulador** por la licencia de Xcode.
- No hay todavía registro de decisiones ni persistencia: eso es la Fase 2, en curso.

---

## 2. Artefactos

```
SUMA/
├── app/                     # Rutas Expo Router (Inicio, Añadir, Historial, Estadísticas, onboarding, ajustes, objetivo)
├── src/
│   ├── components/ui/       # AppText, Screen, Button, Card, Chip, Divider, SectionHeader
│   ├── components/feedback/ # EmptyState, ErrorState, LoadingState
│   ├── config/env.ts        # Validación de variables públicas
│   └── theme/               # tokens y tipografía
├── tests/                   # 3 suites, 9 pruebas
├── docs/                    # memoria completa + 17 ADR
├── .github/workflows/ci.yml
├── app.config.ts
├── eas.json
├── jest.config.js
├── eslint.config.js
├── .env.example
└── package.json
```

---

## 3. Entorno verificado

| Recurso | Resultado |
|---|---|
| macOS | 27.0.1 arm64 |
| Node.js / pnpm | 24.8.0 / 10.17.0 |
| Expo SDK / RN / React | 58.0.17 / 0.88.0 / 19.3.0 |
| TypeScript | 6.0.3 (estricto) |
| Git | Repositorio inicializado, rama `main` |
| Xcode | 26.6, licencia **no aceptada** |
| Simuladores iOS | Bloqueados por la licencia |
| JDK / Android SDK | Ausentes |
| Red npm | Correcta |
| Disco libre | 102 GB |

### 3.1 Nota de entorno (sandbox de escritura)

El directorio home del usuario no es escribible desde este entorno; Expo escribe `~/.expo`. Para ejecutar comandos de Expo se usa `HOME=$PWD/.home` y `EXPO_NO_TELEMETRY=1`. Con esa variable, `pnpm` (corepack) no funciona, así que los comandos de Expo se lanzan con `node node_modules/expo/bin/cli`. En un entorno normal (CI, máquina del desarrollador) no hace falta este ajuste.

---

## 4. Estado por fase

| Fase | Estado | Evidencia |
|---|---|---|
| 0 — Preparación | Cerrada | 13 documentos, 17 ADR, repositorio |
| 1 — Esqueleto técnico | Cerrada (verificación nativa pendiente) | 9 pruebas, doctor 20/20, bundles iOS/Android |
| 2 — Dominio y persistencia | En curso | — |
| 3 — Registro e Inicio | No iniciada | — |
| 4 — Historial, estadísticas y objetivos | No iniciada | — |
| 5 — Calidad y accesibilidad | No iniciada | — |
| 6 — Beta | No iniciada (bloqueada por cuentas) | — |
| 7 — Monetización y lanzamiento | No iniciada | — |

Progreso: **2 de 8 fases cerradas**. Tareas: **13 de 54 cerradas**, 3 parciales, 1 bloqueada. Criterios de aceptación verificados: **0 de 35**.

---

## 5. Pruebas ejecutadas (evidencia real)

| Comprobación | Comando | Resultado |
|---|---|---|
| Formato | `pnpm format:check` | Correcto |
| Lint | `pnpm lint` | 0 errores, 0 avisos |
| TypeScript | `pnpm typecheck` | 0 errores |
| Unitarias y componentes | `pnpm exec jest --runInBand` | 3 suites, 9/9 pruebas |
| Auditoría de producción | `pnpm audit --prod --audit-level high --ignore-unfixable` | Sin vulnerabilidades accionables |
| Expo Doctor | `node node_modules/expo-doctor/bin/expo-doctor.js` | 20/20 |
| Bundle iOS | `expo export --platform ios` | 3,9 MB |
| Bundle Android | `expo export --platform android` | 3,9 MB |
| Simulador iOS | `xcrun simctl` | Bloqueado: licencia |

Las pruebas cubren tokens de color (contraste AA), Button y EmptyState. Las pruebas de dominio y persistencia llegan en la Fase 2.

---

## 6. Decisiones y supuestos

Las 17 decisiones están en [DECISIONS.md](./DECISIONS.md) y [docs/decisions/](./decisions/). Se aplican los supuestos P1–P8 mientras el fundador no indique lo contrario: `com.suma.mobile`, español, EUR, sin notificaciones, exportación JSON, un objetivo activo.

---

## 7. Bloqueos

| ID | Bloqueo | Impacto | Desbloqueo |
|---|---|---|---|
| B1 | Licencia de Xcode no aceptada | Sin simulador, build iOS ni E2E | `sudo xcodebuild -license` |
| B2 | Sin JDK ni Android SDK | Sin build Android local | Temurin 17+ y cmdline-tools, o EAS |
| B3 | Sin cuentas Apple/Google/Expo | Sin distribución ni publicación | Alta de cuentas |
| B6 | Sin dispositivo físico | Accesibilidad solo estimada | Prueba manual |

---

## 8. Próximos pasos

1. Fase 2: módulos de dinero, fechas, periodos y cálculo de objetivos con pruebas.
2. Fase 2: driver SQLite (expo-sqlite + sql.js), migración 001, repositorios y pruebas de integración.
3. Verificar persistencia tras cierre y reapertura.
4. Actualizar este documento y hacer commit de la fase.

---

## 9. Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-23 | Fase 0: memoria completa y ADR |
| 2026-10-23 | Fase 1: scaffold Expo, tema, componentes, rutas, pruebas, CI |
| 2026-10-23 | Fase 1 verificada: 9 pruebas, doctor 20/20, bundles |
| 2026-10-23 | Inicio de Fase 2 |

---

*Se actualiza al cerrar cada fase con resultados reales.*
