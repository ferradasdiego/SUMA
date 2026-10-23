# SUMA — Estado del proyecto

| Campo | Valor |
|---|---|
| Última actualización | 2026-10-23 |
| Fase actual | **Fase 0 — Preparación (en curso)** |
| Estado global | Especificación analizada y arquitectura/plan definidos. **No hay código de aplicación todavía.** |
| Documento base | [SUMA_MASTER_SPEC.md](../SUMA_MASTER_SPEC.md) v1.0 |
| Plan vigente | [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) |
| Arquitectura vigente | [ARCHITECTURE.md](./ARCHITECTURE.md) |

> Regla de honestidad (spec §0.1 y §22): aquí solo se registra lo que existe y se ha comprobado. Una pantalla o un archivo no equivalen a una función terminada.

---

## 1. Resumen

- La especificación maestra (2.212 líneas, secciones §0–§24) se ha leído y descompuesto en decisiones, fases y tareas.
- Se han creado los tres documentos de trabajo: arquitectura, plan de ejecución y este estado.
- El entorno se ha inspeccionado con comandos reales (§2). Puede instalar dependencias, ejecutar TypeScript y pruebas, y empaquetar bundles. **No puede** compilar iOS (licencia de Xcode pendiente) ni Android (sin JDK/SDK).
- No existe repositorio Git, ni proyecto Expo, ni pruebas ejecutadas. No se ha implementado ninguna función del producto.
- El alcance del MVP está propuesto y congelado en el plan (§2), pendiente de confirmación del fundador.

---

## 2. Entorno verificado

Comprobaciones ejecutadas el 2026-10-23 a las 18:07–18:09 (Europe/Madrid).

| Comprobación | Comando | Resultado real |
|---|---|---|
| Sistema | `sw_vers` | macOS 27.0.1, arm64 |
| Node.js | `node --version` | v24.8.0 |
| npm | `npm --version` | 11.8.0 |
| pnpm | `pnpm --version` | 10.17.0 |
| Corepack | `corepack --version` | 0.34.0 |
| Git | `git --version` | 2.51.0 |
| Repositorio | `git rev-parse --is-inside-work-tree` | `fatal: not a git repository` |
| Xcode | `xcodebuild -version` | Xcode 26.6, build 17F113 |
| Simuladores iOS | `xcrun simctl list devices available` | Bloqueado: licencia de Xcode no aceptada |
| Java | `java -version` | No hay runtime de Java instalado |
| Android SDK | `ls ~/Library/Android/sdk` | No existe |
| adb | `adb version` | No encontrado |
| CocoaPods | `which pod` | No encontrado |
| Expo/EAS global | `which expo eas` | No instalados (se usarán vía `npx`) |
| Red hacia npm | `curl registry.npmjs.org` | HTTP 200 |
| Disco libre | `df -h .` | 102 GB |

### 2.1 Qué puede hacer este entorno

- Crear y modificar archivos dentro del proyecto.
- Instalar dependencias con pnpm/npm desde el registro público.
- Ejecutar TypeScript, ESLint, Prettier, Jest y pruebas de integración.
- Empaquetar el bundle JS de iOS y Android (`expo export`) sin compilar nativo.
- Inicializar y operar un repositorio Git.

### 2.2 Qué no puede hacer (hoy)

- Compilar ni firmar la app para iOS: la licencia de Xcode no está aceptada.
- Abrir simulador iOS o ejecutar pruebas de extremo a extremo.
- Compilar para Android: faltan JDK y Android SDK.
- Publicar en App Store o Google Play: faltan cuentas y credenciales.
- Verificar accesibilidad con lector de pantalla en dispositivo real.
- Validar cumplimiento legal (RGPD/LOPDGDD); solo se puede preparar documentación.

---

## 3. Artefactos existentes

| Archivo | Contenido | Estado |
|---|---|---|
| [../SUMA_MASTER_SPEC.md](../SUMA_MASTER_SPEC.md) | Especificación maestra recibida | Existente |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack, capas, contratos, esquema SQLite, reglas de cálculo, 17 ADR, riesgos | Creado el 2026-10-23 |
| [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) | Alcance del MVP, 8 fases, 54 tareas, hitos, puertas, matriz de aceptación | Creado el 2026-10-23 |
| [STATUS.md](./STATUS.md) | Este documento | Creado el 2026-10-23 |

No existe todavía: `package.json`, `app/`, `src/`, `tests/`, `.git/`, `docs/decisions/` ni los otros diez documentos de memoria.

---

## 4. Estado por fase

| Fase | Estado | Evidencia |
|---|---|---|
| 0 — Preparación | En curso | 3 de 9 tareas cerradas; faltan memoria, repo, ADR y decisiones |
| 1 — Esqueleto técnico | No iniciada | — |
| 2 — Dominio y persistencia | No iniciada | — |
| 3 — Registro e Inicio | No iniciada | — |
| 4 — Historial, estadísticas y objetivos | No iniciada | — |
| 5 — Calidad y accesibilidad | No iniciada | — |
| 6 — Beta privada | No iniciada (bloqueada por cuentas) | — |
| 7 — Monetización y lanzamiento | No iniciada | — |

Progreso: **0 de 8 fases cerradas**. Tareas: **3 de 54 cerradas** (T0.1, T0.2, T0.3) y **1 parcial** (T0.9). Criterios de aceptación verificados: **0 de 35**.

---

## 5. Decisiones tomadas

Detalle completo y consecuencias en [ARCHITECTURE.md §20](./ARCHITECTURE.md#20-registro-de-decisiones-adr).

| ID | Decisión | Estado |
|---|---|---|
| ADR-0001 | React Native 0.88 + Expo SDK 58 + TypeScript estricto | Aprobada |
| ADR-0002 | SQLite con `expo-sqlite` como persistencia | Aprobada |
| ADR-0003 | Modo local sin cuenta obligatoria | Aprobada |
| ADR-0004 | Sin backend en el MVP; Supabase cuando se necesite | Aprobada (revisión en Fase 6) |
| ADR-0005 | Importes en unidades menores enteras | Aprobada |
| ADR-0006 | `occurred_local_date` como clave temporal; UTC conservado | Aprobada |
| ADR-0007 | Context + `dataVersion`; sin Zustand ni TanStack Query | Aprobada |
| ADR-0008 | Gráficas propias con `react-native-svg` | Aprobada |
| ADR-0009 | Sincronización diferida; esquema preparado | Aprobada (diferida) |
| ADR-0010 | Monetización diferida a Fase 7 | Aprobada |
| ADR-0011 | Jest + jest-expo + RNTL + sql.js | Aprobada |
| ADR-0012 | Sin telemetría de terceros en el MVP | Aprobada |
| ADR-0013 | Borrado físico y exportación JSON | Aprobada |
| ADR-0014 | Una moneda por perfil en el MVP | Aprobada (provisional) |
| ADR-0015 | Agregados SQL con prueba de equivalencia | Aprobada |
| ADR-0016 | Sin ORM; SQL tipado con mappers Zod | Aprobada |
| ADR-0017 | Driver SQL abstracto con sql.js para pruebas | Aprobada |

Supuestos aplicados mientras no haya respuesta del fundador: identificador `com.suma.mobile`, español como único idioma, EUR como moneda, notificaciones fuera del MVP, exportación JSON, un solo objetivo activo.

---

## 6. Bloqueos

| ID | Bloqueo | Impacto | Desbloqueo | Responsable |
|---|---|---|---|---|
| B1 | Licencia de Xcode no aceptada | Sin simulador, build iOS ni E2E | `sudo xcodebuild -license` en Terminal | Fundador |
| B2 | Sin JDK ni Android SDK | Sin build Android local | Instalar Temurin 17+ y cmdline-tools, o usar EAS Build | Fundador / Agente 12 |
| B3 | Sin cuentas Apple/Google/Expo | Sin builds distribuibles ni publicación | Alta de cuentas y credenciales | Fundador |
| B4 | Sin repositorio Git | Sin historial, sin CI real | T0.5 | Agente 0 |

B4 no impide trabajar, pero debe resolverse antes de la Fase 1. B1 y B2 solo bloquean la verificación nativa y las fases 6–7.

---

## 7. Riesgos activos

| Riesgo | Estado | Nota |
|---|---|---|
| Verificación nativa imposible hoy | Abierto | Mitigado con pruebas automatizadas y bundle; no sustituye a la prueba en dispositivo |
| Decisiones de producto sin confirmar (P1–P8) | Abierto | Se aplican supuestos documentados; deben confirmarse antes de la fase indicada |
| Alcance del MVP | Controlado | Congelado en EXECUTION_PLAN §2 |
| Deriva de contratos | Controlado | ARCHITECTURE como fuente única |
| Dependencias del SDK 58 | Vigilado | Versiones verificadas en npm; lockfile y `expo-doctor` en CI |

---

## 8. Próximos pasos

Ordenados. Cada uno con su criterio de cierre.

1. **T0.5 — Repositorio Git**: `git init`, `.gitignore` (node_modules, .env, .expo, ios, android, dist), README mínimo y primer commit con `SUMA_MASTER_SPEC.md` y `docs/`. *Hecho cuando* `git log` muestre el commit inicial y `git status` esté limpio.
2. **T0.6 — ADR individuales**: crear `docs/decisions/ADR-0001.md` a `ADR-0017.md` a partir del registro de ARCHITECTURE §20, con contexto, alternativas, decisión, consecuencias y fecha. *Hecho cuando* los 17 archivos existan y el índice enlace a ellos.
3. **T0.4 — Memoria restante**: PROJECT_BRIEF, PRODUCT_REQUIREMENTS, DATA_MODEL, API_CONTRACTS, DESIGN_SYSTEM, SECURITY, TEST_STRATEGY, DEPLOYMENT, AGENT_PROTOCOL, DECISIONS. *Hecho cuando* los diez existan sin contradecir ARCHITECTURE.
4. **T0.7 — Decisiones P1–P8**: confirmar o corregir los supuestos con el fundador. *Hecho cuando* `docs/DECISIONS.md` registre la respuesta y la fecha.
5. **T1.1 — Proyecto Expo SDK 58**: crear el proyecto sin contenido de demo, con TypeScript estricto. *Hecho cuando* `pnpm typecheck` pase y la app arranque en el objetivo disponible.

Acción recomendada al fundador ahora: aceptar la licencia de Xcode para habilitar simulador y verificación real en Fase 1.

---

## 9. Cómo verificar este estado

```bash
# 1. Ver los documentos existentes
ls -la docs

# 2. Comprobar que no hay código de aplicación todavía
find . -maxdepth 2 -name package.json -o -name app

# 3. Comprobar el repositorio
git status

# 4. Comprobar el entorno
node --version && pnpm --version
xcrun simctl list devices available
```

Resultados esperados hoy: `docs/` con tres archivos; sin `package.json`; `git status` falla por ausencia de repositorio; `simctl` falla por la licencia.

---

## 10. Registro de cambios

| Fecha | Cambio | Autor |
|---|---|---|
| 2026-10-23 | Lectura completa de la especificación y descomposición en fases | Agente 0 |
| 2026-10-23 | Inspección real del entorno (Node, pnpm, Git, Xcode, Java, Android, red) | Agente 0 |
| 2026-10-23 | Creación de ARCHITECTURE.md v1.0 | Agente 0 |
| 2026-10-23 | Creación de EXECUTION_PLAN.md v1.0 | Agente 0 |
| 2026-10-23 | Creación de STATUS.md v1.0 | Agente 0 |

---

*Fin de STATUS.md v1.0. Se actualiza al cerrar cada tarea y cada fase, con resultados reales.*
