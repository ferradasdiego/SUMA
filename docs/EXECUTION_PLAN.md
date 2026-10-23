# SUMA — Plan de ejecución

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Vigente. Base para la Fase 0. |
| Propietario | Agente 0 — Coordinador y arquitecto principal |
| Documento base | [SUMA_MASTER_SPEC.md](../SUMA_MASTER_SPEC.md) v1.0, §15 y §23 |
| Documentos relacionados | [ARCHITECTURE.md](./ARCHITECTURE.md) · [STATUS.md](./STATUS.md) |

---

## 1. Objetivo

Convertir la especificación en un MVP funcional, verificable y honesto, en este orden: corrección de los cálculos, seguridad y privacidad, experiencia, fiabilidad, mantenibilidad, rendimiento y monetización (spec §0.2).

Este plan define fases, dependencias, responsables, entregables y criterios de salida. No sustituye a la especificación: la implementa. Si hay conflicto, manda la especificación y se actualiza este documento.

Principios de ejecución:

1. Una fase no se cierra sin evidencia real (pruebas ejecutadas, comandos y salidas).
2. No se declara implementada una función porque exista una pantalla.
3. El alcance del MVP está congelado (§2). Lo demás va al backlog (§12).
4. Los contratos de ARCHITECTURE.md son obligatorios para todos los roles.

---

## 2. Alcance congelado del MVP

### 2.1 Incluido

| Área | Incluido en el MVP |
|---|---|
| Onboarding | Bienvenida breve, moneda, idioma y primer día de semana; opción de registrar la primera decisión |
| Registro | Importe, categoría, nota opcional, fecha (hoy por defecto), importes rápidos |
| Categorías | Siete categorías fijas con icono y color de token |
| Inicio | Total acumulado, hoy, semana, gráfica de evolución, últimos movimientos, objetivo activo, CTA |
| Historial | Lista paginada, detalle, edición, borrado con confirmación, filtros por categoría y fecha, orden |
| Estadísticas | Día, semana, mes y año; total, comparación, distribución por categoría, número de decisiones, promedios y mejor día |
| Gráficas | Barras, línea y barras horizontales por categoría |
| Objetivos | Un objetivo activo: crear, editar, borrar, progreso |
| Ajustes | Moneda (bloqueada si hay registros), idioma, primer día de semana, enlaces legales, restablecer datos |
| Datos | SQLite local, migraciones, transacciones, exportación JSON |
| Calidad | TypeScript estricto, linter, formato, pruebas unitarias, integración y componentes, CI |
| Accesibilidad | Etiquetas, roles, tamaños táctiles, escalado de texto, contraste, movimiento reducido |
| Plataformas | iOS y Android con Expo; verificación de arranque y bundle |

### 2.2 Excluido del MVP (backlog, §12)

Cuentas y sincronización, backend Supabase, notificaciones, analítica, IA, funciones sociales, varios objetivos, categorías personalizadas, modo oscuro, exportación CSV, widgets, pagos y suscripciones, versión web pública.

Cualquier propuesta de añadir algo de esta lista durante el MVP se rechaza por defecto y se anota en el backlog con su justificación.

---

## 3. Roles, agentes y propiedad de archivos

El entorno actual **no dispone de un sistema de agentes independientes**. Los roles del spec §13 se ejecutan como fases de trabajo diferenciadas por el mismo agente, o mediante subagentes si se habilitan. Los informes deben decir cuál de las dos cosas ocurrió; nunca se afirmará que un agente independiente hizo un trabajo que no se hizo (spec §23, Paso 6).

| Agente | Rol | Fases | Propiedad principal | Entregables |
|---|---|---|---|---|
| 0 | Coordinador y arquitecto | Todas | `docs/ARCHITECTURE.md`, `docs/STATUS.md`, `docs/EXECUTION_PLAN.md`, `docs/decisions/`, `app/_layout.tsx`, `package.json`, `tsconfig.json`, `app.config.ts` | Plan, ADR, contratos, informes, integración |
| 1 | Product Manager | 0–5 | `docs/PRODUCT_REQUIREMENTS.md`, `docs/PROJECT_BRIEF.md` | PRD, historias, criterios de aceptación |
| 2 | Investigación y negocio | 0, 6 | `docs/RESEARCH.md` (cuando exista) | Hipótesis, guion de entrevistas, plan de validación |
| 3 | UI/UX | 1–5 | `src/theme/`, `src/components/ui/` | Tokens, componentes base, especificación de estados |
| 4 | Arquitecto de software | 0–2 | `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/API_CONTRACTS.md`, `eslint.config.js` | Contratos, ADR, plan de migraciones |
| 5 | Frontend móvil | 1–5 | `app/**` (salvo `_layout.tsx`), `src/features/`, `src/components/forms/`, `src/components/feedback/`, `tests/components/` | Pantallas, formularios, estados |
| 6 | Dominio y cálculos | 2 | `src/domain/`, `tests/unit/` | Entidades, dinero, fechas, cálculos, pruebas |
| 7 | Backend y persistencia | 2 | `src/data/`, `tests/integration/` | Driver, migraciones, repositorios, pruebas |
| 8 | Seguridad y privacidad | 1, 5 | `docs/SECURITY.md` | Modelo de amenazas, checklist, auditoría |
| 9 | Analítica y visualización | 3–4 | `src/components/charts/` | Gráficas, pruebas de agregación |
| 10 | Monetización | 7 | `docs/MONETIZATION.md` | Matriz de planes, especificación de suscripciones |
| 11 | QA y testing | 3–6 | `tests/e2e/`, `docs/TEST_STRATEGY.md` | Plan de pruebas, informes de regresión |
| 12 | DevOps y publicación | 1, 5–7 | `.github/workflows/`, `eas.json`, `docs/DEPLOYMENT.md` | CI, compilaciones, guía de release |
| 13 | Documentación | 4–6 | `README.md`, `docs/` (guías), `docs/DECISIONS.md` | Guías de instalación, ejecución, pruebas y resolución de problemas |

### 3.1 Reglas de conflicto

- Un archivo tiene un solo propietario en cada fase. Cambiar un archivo ajeno requiere coordinación explícita y se registra en el informe.
- Los contratos (`src/domain/entities/`, tipos de repositorio) solo los modifica el Agente 4 con aprobación del Agente 0.
- Ningún rol crea su propio modelo de datos, nombres de campos o convenciones (spec §0.1).
- Los archivos compartidos (`package.json`, `app.config.ts`) los modifica únicamente el Agente 0 o el 12.

### 3.2 Paralelismo permitido

| Puede ir en paralelo | Debe coordinarse |
|---|---|
| Diseño visual y dominio (Fases 1–2) | Interfaz y navegación |
| Preparación de CI y documentación inicial | Repositorios y modelo de datos |
| Cálculos de dominio y pruebas | Estadísticas y reglas temporales |
| Textos legales y modelo de negocio | Suscripciones y permisos premium |

---

## 4. Mapa de dependencias

```
Fase 0 ──► Fase 1 ──► Fase 2 ──► Fase 3 ──► Fase 4 ──► Fase 5 ──► Fase 6 ──► Fase 7
   │           │          │          │          │          │          │
   └─ memoria ─┴─ shell ──┴─ datos ──┴─ flujo ──┴─ calidad ┴─ beta ───┴─ cobro
```

| Fase | Depende de | Bloquea a | Entregable que la cierra |
|---|---|---|---|
| 0 | — | Todas | Memoria, contratos, alcance, toolchain conocida |
| 1 | 0 | 2–5 | App que arranca, navega y pasa CI |
| 2 | 1 | 3–5 | Persistencia y cálculos verificados |
| 3 | 2 | 4–5 | Registro → Inicio funcionando |
| 4 | 3 | 5 | Historial, estadísticas y objetivos completos |
| 5 | 4 | 6 | Candidata a release con matriz de aceptación |
| 6 | 5 | 7 | Beta distribuida con feedback |
| 7 | 6 | — | Monetización y publicación |

Regla: no se abre una fase si la anterior no ha cerrado su criterio de salida. Se puede preparar trabajo de la siguiente en paralelo solo si no toca archivos de la fase en curso.

---

## 5. Fases

Convención de estados: **Hecho**, **Pendiente**, **Bloqueado**, **Parcial**. Las fechas son estimaciones relativas (una sesión = media jornada de trabajo enfocado de un agente); no son compromisos de calendario.

### Fase 0 — Preparación

**Objetivo**: reducir la incertidumbre y dejar contratos, memoria y entorno conocidos.
**Depende de**: nada. **Estimación**: 1 sesión (+ tiempo del fundador).

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T0.1 | Leer y descomponer la especificación completa | 0 | — | Análisis de 2.212 líneas, secciones §0–§24 | Hecho |
| T0.2 | Aprobar arquitectura y contratos | 4 | T0.1 | `docs/ARCHITECTURE.md` | Hecho |
| T0.3 | Escribir el plan de ejecución y el estado | 0 | T0.2 | `docs/EXECUTION_PLAN.md`, `docs/STATUS.md` | Hecho |
| T0.4 | Completar la memoria del proyecto | 13 | T0.3 | 10 documentos restantes + `docs/decisions/` | Pendiente |
| T0.5 | Inicializar repositorio Git, `.gitignore`, README | 0 | T0.3 | Repositorio con primer commit | Pendiente |
| T0.6 | Redactar ADR-0001 a ADR-0017 | 4 | T0.2 | `docs/decisions/ADR-*.md` | Pendiente |
| T0.7 | Resolver preguntas abiertas P1–P8 | 0 + fundador | T0.3 | Decisiones registradas en `docs/DECISIONS.md` | Pendiente |
| T0.8 | Verificar toolchain y desbloquear entorno | 12 | — | Licencia Xcode aceptada; JDK/SDK o decisión de usar EAS | Bloqueado (externo) |
| T0.9 | Congelar alcance del MVP | 1 | T0.2 | §2 de este plan confirmado | Parcial (propuesta congelada; falta confirmación del fundador) |

**Criterio de salida**:

- Arquitectura, modelo de datos, reglas de cálculo y convenciones aprobados.
- Los 13 documentos de memoria existen y no se contradicen.
- El repositorio existe con un primer commit y CI preparada.
- El alcance del MVP está congelado y las preguntas P1–P8 tienen respuesta o supuesto documentado.

**Riesgos**: dependencia de decisiones del fundador; sobre-documentación. Mitigación: documento por rol con fecha límite y contenido mínimo; los documentos se amplían cuando una fase los necesita.

---

### Fase 1 — Esqueleto técnico y sistema visual

**Objetivo**: una app que arranca, navega y pasa el pipeline, con tokens y componentes base.
**Depende de**: Fase 0. **Estimación**: 1–2 sesiones.

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T1.1 | Crear el proyecto Expo SDK 58 con TypeScript estricto (sin contenido de demo) | 5 | T0.5 | `package.json`, `app/`, `tsconfig.json` | Pendiente |
| T1.2 | Configurar ESLint, Prettier, alias de rutas y reglas de capas | 4 | T1.1 | `eslint.config.js`, `.prettierrc`, reglas `no-restricted-imports` | Pendiente |
| T1.3 | `app.config.ts`, `eas.json`, `.env.example` y validación de entorno | 12 | T1.1 | Configuración de app y entornos | Pendiente |
| T1.4 | Estructura de rutas, barra inferior de 4 destinos y gate de onboarding | 5 | T1.1 | Navegación funcional con pantallas vacías | Pendiente |
| T1.5 | Tokens de tema y componentes base | 3 | T1.1 | `src/theme/`, `src/components/ui/` | Pendiente |
| T1.6 | Arranque del harness de pruebas y primeras pruebas | 11 | T1.1 | Jest + RNTL configurados, 5 pruebas verdes | Pendiente |
| T1.7 | Pipeline de CI | 12 | T1.2 | `.github/workflows/ci.yml` en verde | Pendiente |
| T1.8 | Verificar arranque y navegación en el entorno disponible | 11 | T1.4, T1.7 | Evidencia: bundle exportado + pruebas; simulador si B1 se resuelve | Pendiente |

**Criterio de salida**:

- La app arranca y navega entre los cuatro destinos (verificado en simulador, o como mínimo con pruebas de navegación y bundle exportado, indicando qué se pudo verificar).
- TypeScript, lint, formato y pruebas pasan en CI.
- El tema se aplica desde tokens; no hay colores literales en componentes.
- No queda contenido de demostración ni pantallas en blanco.

**Riesgos**: API de Expo Router 58 y peers (`react-native-screens`, `reanimated`); incompatibilidad de Jest 30. Mitigación: seguir el template oficial, `expo-doctor` y pruebas tempranas.

---

### Fase 2 — Dominio y persistencia

**Objetivo**: datos que sobreviven y cálculos correctos, probados antes de la UI.
**Depende de**: Fase 1. **Estimación**: 2 sesiones.

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T2.1 | Errores, `Result`, entidades y esquemas Zod | 6 | T1.2 | `src/domain/entities/`, `src/domain/errors/`, `schemas.ts` | Pendiente |
| T2.2 | Módulo de dinero: parseo, formato, límites | 6 | T2.1 | `src/domain/money/` + pruebas | Pendiente |
| T2.3 | Módulo de tiempo: fechas locales, periodos, DST | 6 | T2.1 | `src/domain/time/` + pruebas | Pendiente |
| T2.4 | Driver SQL: `expo-sqlite` y `sql.js` | 7 | T2.1 | `src/data/local/` | Pendiente |
| T2.5 | Migración 001, runner y semilla de categorías | 7 | T2.4 | `src/data/migrations/` | Pendiente |
| T2.6 | Repositorios y mappers | 7 | T2.5 | `src/data/repositories/` | Pendiente |
| T2.7 | Pruebas de integración: CRUD, restricciones, cierre y reapertura | 7 | T2.6 | `tests/integration/` en verde | Pendiente |

**Criterio de salida**:

- Guardar, leer, editar y borrar funciona contra SQLite real (sql.js en pruebas).
- Los datos sobreviven a cerrar y reabrir la base (exportación y reapertura de bytes).
- Las migraciones funcionan desde base vacía y son idempotentes; una migración fallida revierte.
- Dinero, periodos, comparaciones y objetivos tienen pruebas de casos límite y DST.
- Los totales calculados coinciden con la suma de los registros en los fixtures.

**Riesgos**: limitaciones de `expo-sqlite`; diferencias de SQLite. Mitigación: driver estrecho, SQL estándar, pruebas desde el primer día.

---

### Fase 3 — Experiencia principal: registro e inicio

**Objetivo**: el flujo central de punta a punta.
**Depende de**: Fase 2. **Estimación**: 1,5–2 sesiones.

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T3.1 | `AppProvider`: apertura, migración, perfil, `dataVersion` | 5 | T2.6 | Arranque con estados `booting/ready/failed` | Pendiente |
| T3.2 | Onboarding y persistencia de preferencias | 5 | T3.1 | `app/onboarding.tsx` | Pendiente |
| T3.3 | Formulario de alta con validación y anti-doble-envío | 5 | T3.1, T2.2 | `app/(tabs)/add.tsx` | Pendiente |
| T3.4 | Inicio con totales, últimos movimientos y objetivo | 5 | T3.1 | `app/(tabs)/index.tsx` | Pendiente |
| T3.5 | Ajustes básicos | 5 | T3.1 | `app/settings.tsx` | Pendiente |
| T3.6 | Estados vacíos, de carga y de error en estas pantallas | 3 | T3.3, T3.4 | Componentes de `feedback/` integrados | Pendiente |
| T3.7 | Pruebas de componente y de flujo de registro | 11 | T3.3 | `tests/components/` | Pendiente |

**Criterio de salida**:

- Registrar 2,50 EUR en Café actualiza Inicio sin reiniciar.
- El registro persiste tras cerrar y reabrir la app.
- Los errores de importe (vacío, cero, negativo, exceso de decimales, letras) se muestran comprensibles.
- El doble toque no crea duplicados.
- El onboarding solo aparece la primera vez.
- Navegación con teclado abierto sin ocultar el botón de guardar.

---

### Fase 4 — Historial, estadísticas y objetivos

**Objetivo**: completar las funciones obligatorias del MVP.
**Depende de**: Fase 3. **Estimación**: 2–2,5 sesiones.

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T4.1 | Historial paginado con filtros y orden | 5 | T3.1 | `app/(tabs)/history.tsx` | Pendiente |
| T4.2 | Edición y borrado con confirmación | 5 | T4.1 | Pantalla de edición reutilizando el formulario | Pendiente |
| T4.3 | Resumen estadístico por periodo | 5 | T2.3 | `app/(tabs)/statistics.tsx` | Pendiente |
| T4.4 | Gráficas accesibles | 9 | T4.3 | `src/components/charts/` | Pendiente |
| T4.5 | Objetivo activo: alta, edición, borrado y progreso | 5 | T2.6 | `app/goals.tsx` | Pendiente |
| T4.6 | Pruebas de coherencia tras crear, editar y borrar | 11 | T4.2 | Totales recalculados = suma de registros | Pendiente |

**Criterio de salida**:

- Historial ordena, filtra y pagina correctamente; editar y borrar actualizan totales.
- Los periodos usan límites correctos (semana según preferencia, mes calendario, año, cambio de hora).
- Un periodo vacío muestra 0 y un estado vacío, sin errores.
- Las gráficas tienen resumen textual y no dependen solo del color.
- El objetivo muestra progreso correcto y explica su significado.

---

### Fase 5 — Calidad, accesibilidad y robustez

**Objetivo**: cumplir los criterios de aceptación del MVP y dejar documentación.
**Depende de**: Fase 4. **Estimación**: 1,5–2 sesiones.

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T5.1 | Casos límite del spec §16.5 | 11 | T4 | Suite de casos límite en verde | Pendiente |
| T5.2 | Auditoría de accesibilidad | 8, 3 | T4 | Informe con correcciones aplicadas | Pendiente |
| T5.3 | Rendimiento con 10.000 registros | 11 | T4 | Medición real y optimizaciones | Pendiente |
| T5.4 | Exportación JSON y restablecimiento de datos | 7 | T2.6 | Exportación + borrado seguro | Pendiente |
| T5.5 | Documentación de instalación, ejecución y pruebas | 13 | T4 | README y guías | Pendiente |
| T5.6 | Regresión completa y corrección de errores | 11 | T5.1–T5.5 | Informe de regresión | Pendiente |

**Criterio de salida**:

- La matriz de aceptación (§13) está verificada, salvo los puntos que requieren dispositivo y estén documentados como bloqueados.
- No hay errores bloqueantes conocidos.
- Exportar produce un JSON válido y restaurable (documentado).
- Las limitaciones del entorno están escritas en STATUS.md y README.

---

### Fase 6 — Beta privada

**Objetivo**: validar con usuarios y medir recurrencia.
**Depende de**: Fase 5. **Estimación**: externa (depende de cuentas y tiempos de revisión).

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T6.1 | Proyecto EAS, credenciales y perfiles de build | 12 | T5.6 | `eas.json` operativo | Pendiente |
| T6.2 | Build iOS y distribución TestFlight | 12 | T6.1, B1, B3 | Build instalable | Bloqueado (externo) |
| T6.3 | Build Android y pista interna | 12 | T6.1, B2, B3 | Build instalable | Bloqueado (externo) |
| T6.4 | Programa de beta: guion, consentimiento y recogida de feedback | 2, 11 | T6.1 | Plan de beta y formulario | Pendiente |
| T6.5 | Priorizar y corregir hallazgos | 0, 11 | T6.4 | Versión beta 2 | Pendiente |

**Criterio de salida**: existen builds distribuidos y feedback documentado; hay decisión explícita de qué mejorar antes de lanzar. Sin cuentas de tienda, esta fase no puede cerrarse.

---

### Fase 7 — Monetización y lanzamiento

**Objetivo**: ingresos y publicación, solo con el núcleo gratuito validado.
**Depende de**: Fase 6. **Estimación**: externa.

| ID | Tarea | Propietario | Depende de | Entregable | Estado |
|---|---|---|---|---|---|
| T7.1 | Definir Plus y entitlements a partir del uso real | 10 | T6.5 | `docs/MONETIZATION.md` | Pendiente |
| T7.2 | Integrar compras y restauración | 5, 10 | T7.1 | Flujo de compra probado en sandbox | Pendiente |
| T7.3 | Validar derechos premium en servidor o recibo | 7, 8 | T7.2 | Verificación fiable | Pendiente |
| T7.4 | Términos, privacidad y requisitos de tienda | 8 | T7.1 | Documentos legales revisados | Pendiente |
| T7.5 | Iconos, capturas y fichas de tienda | 3 | T7.4 | Material de publicación | Pendiente |
| T7.6 | Publicación y verificación | 12 | T7.2–T7.5 | App publicada confirmada por las tiendas | Bloqueado (externo) |

**Criterio de salida**: suscripciones funcionando en entorno de prueba, documentación legal revisada y publicación confirmada por Apple/Google. No se afirmará que la app está publicada sin esa confirmación.

---

## 6. Hitos y estimación

| Hito | Al cerrar | Evidencia |
|---|---|---|
| M0 | Fase 0 | Memoria completa, contratos, alcance, repo |
| M1 | Fase 1 | App navega + CI verde + bundle exportado |
| M2 | Fase 2 | Persistencia y cálculos con pruebas verdes |
| M3 | Fase 3 | Flujo registro → Inicio funcional |
| M4 | Fase 4 | MVP funcional completo |
| M5 | Fase 5 | Matriz de aceptación + release candidate |
| M6 | Fase 6 | Beta distribuida |
| M7 | Fase 7 | Monetización y publicación |

Estimación relativa para un agente: F0 1, F1 1–2, F2 2, F3 1,5–2, F4 2–2,5, F5 1,5–2 sesiones. Total aproximado: **10–12 sesiones** de implementación, sin contar esperas externas (licencias, cuentas, revisiones). Es una estimación de esfuerzo, no una promesa de fecha.

---

## 7. Definición de hecho (DoD)

Una tarea está hecha cuando:

1. El código compila con TypeScript estricto y sin `any` implícito.
2. Lint y formato pasan.
3. Hay pruebas que cubren el comportamiento nuevo y pasan en local y en CI.
4. Los estados vacío, carga y error están resueltos cuando la tarea toca una pantalla.
5. La accesibilidad básica está cubierta (etiquetas, roles, tamaño táctil).
6. La documentación afectada está actualizada (ARCHITECTURE, STATUS, DECISIONS o README).
7. El informe de entrega (§8) incluye comandos y resultados reales.
8. No se ha roto ninguna prueba existente.

No se marca como hecha una tarea cuya única evidencia sea un archivo creado o una pantalla visible.

---

## 8. Protocolo de entrega e integración

### 8.1 Antes de empezar una tarea

- Leer la sección relevante de ARCHITECTURE.md y de la especificación.
- Confirmar la propiedad de los archivos.
- Comprobar que las dependencias de la tarea están cerradas.

### 8.2 Informe de entrega (spec §22)

Cada tarea se reporta con este formato:

1. **Estado**: completada, parcial o bloqueada.
2. **Funcionalidades implementadas**: solo lo que funciona de verdad.
3. **Archivos**: rutas exactas creadas o modificadas.
4. **Decisiones técnicas**: qué se decidió y por qué.
5. **Dependencias añadidas**: nombre y versión, con justificación.
6. **Pruebas**: comando ejecutado y resultado real; pruebas no ejecutadas y motivo.
7. **Riesgos y problemas**: priorizados.
8. **Tareas pendientes**: concretas y con su dependencia.
9. **Siguiente fase**: objetivo y criterio de salida.

### 8.3 Integración

- Un cambio por tarea; sin refactorizaciones masivas durante la estabilización.
- Antes de integrar: ejecutar el pipeline completo, no solo las pruebas nuevas.
- Si falla una prueba existente, se corrige o se documenta el bloqueo; no se silencia.
- Los contratos cambian solo con actualización de ARCHITECTURE.md y su ADR.
- Los datos de prueba no contienen información personal real.

### 8.4 Git (cuando T0.5 esté hecho)

- Ramas `feat/<id-tarea>`, `fix/<id-tarea>`, `docs/<tema>`.
- Mensajes en imperativo y referencia a la tarea.
- `main` siempre verde.
- Sin secretos ni `.env` en el historial.

---

## 9. Puertas de decisión

| Puerta | Momento | Quién decide | Evidencia exigida |
|---|---|---|---|
| G0 | Fin de Fase 0 | Coordinador + fundador | Memoria, contratos, alcance, entorno conocido |
| G1 | Fin de Fase 1 | Coordinador | App arranca y navega, CI verde, tokens aplicados |
| G2 | Fin de Fase 2 | Coordinador | Pruebas de persistencia y cálculos verdes |
| G3 | Fin de Fase 3 | Coordinador | Registro → Inicio correcto y persistente |
| G4 | Fin de Fase 4 | Coordinador | Funciones del MVP completas |
| G5 | Fin de Fase 5 | Coordinador + fundador | Matriz de aceptación, cero bloqueantes |
| G6 | Fin de Fase 6 | Fundador | Beta con feedback y decisión de lanzamiento |
| G7 | Fase 7 | Fundador | Compras en sandbox, legal revisado, tiendas |

Si una puerta no se supera, no se avanza: se corrige o se documenta el bloqueo y se replanifica.

---

## 10. Riesgos del plan

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Entorno sin simulador ni SDK de Android | Alta | Alto | Pruebas automatizadas y bundle; el fundador desbloquea; EAS para builds |
| Exceso de alcance | Media | Alto | §2 congelado; backlog explícito; revisión en cada puerta |
| Deriva de contratos entre módulos | Media | Alto | ARCHITECTURE como fuente única; cambios con ADR |
| Deudas de accesibilidad detectadas tarde | Media | Medio | Componentes accesibles desde Fase 1; auditoría en Fase 4 y 5 |
| Errores de cálculo en producción | Baja | Crítico | Unidades enteras, pruebas de dominio, revisión de cada fórmula |
| Pérdida de datos por migración | Baja | Crítico | Transacciones, pruebas desde vacío, exportación |
| Dependencia de cuentas/cuentas de tienda | Media | Alto | Iniciar trámites al final de Fase 5 |
| Contexto del agente limitado | Media | Medio | Tareas pequeñas, documentos de memoria, informes por fase |

---

## 11. Métricas de progreso

Se actualizan en [STATUS.md](./STATUS.md):

- Fases cerradas / 8.
- Tareas cerradas / 54.
- Criterios de aceptación verificados / 35.
- Pruebas automatizadas: total y en verde.
- Bloqueos abiertos.
- Deuda técnica registrada.

---

## 12. Backlog posterior al MVP

| Idea | Origen | Condición para evaluarla |
|---|---|---|
| Cuentas y sincronización | spec §6.4, §10.4, §18.7 | Retención demostrada y necesidad real multi-dispositivo |
| Notificaciones opcionales | spec §6.7, §18.5 | Decisión P2 y permiso explícito del usuario |
| Varios objetivos y asignación de registros | spec §18.8 | Definir regla anti-duplicidad primero |
| Categorías personalizadas | spec §18.10 | Migración de esquema y UI de gestión |
| Exportación CSV | spec §18.6 | Demanda de usuarios |
| Widgets | spec §18.1 | Viabilidad en ambas plataformas |
| Modo oscuro | spec §5.5, §18.11 | Validación de demanda |
| SUMA Plus y compras | spec §12.3, §6.8 | Núcleo gratuito validado (Fase 7) |
| IA para resúmenes | spec §18.12 | Privacidad resuelta y valor demostrado |
| Resumen semanal y logros | spec §18.4, §18.9 | Diseño que no genere ansiedad |
| Inglés | spec §18.14 | Estructura i18n ya preparada |

---

## 13. Matriz de aceptación del MVP (spec §21)

| # | Criterio | Verificación prevista | Fase |
|---|---|---|---|
| 1 | Se introduce una cantidad válida | Pruebas unitarias de dinero + componente | 2, 3 |
| 2 | Se elige una categoría | Componente y flujo E2E | 3 |
| 3 | Se añade una nota opcional | Componente | 3 |
| 4 | El registro persiste | Integración con SQLite + reapertura | 2, 3 |
| 5 | Errores de validación comprensibles | Pruebas de casos límite | 2, 3 |
| 6 | Total acumulado = registros | Pruebas de dominio + integración | 2, 3 |
| 7 | Total diario correcto | Pruebas de periodo | 2 |
| 8 | Últimos movimientos coherentes | Componente y consulta | 3 |
| 9 | Cambios sin reiniciar | Prueba de flujo | 3 |
| 10 | Historial ordenado | Integración `list` | 2, 4 |
| 11 | Registros editables | Integración + componente | 4 |
| 12 | Registros eliminables | Integración + componente | 4 |
| 13 | Totales actualizados tras operar | Pruebas de coherencia | 4 |
| 14 | Límites temporales correctos | Pruebas de calendario y DST | 2 |
| 15 | Importes coinciden con registros | Prueba de agregados | 2, 4 |
| 16 | Categorías bien agregadas | Pruebas de `summarize` | 2, 4 |
| 17 | Periodos vacíos sin errores | Pruebas de dominio + componente | 4 |
| 18 | Se establece una meta | Integración + componente | 4 |
| 19 | Progreso correcto | Pruebas de objetivo | 2, 4 |
| 20 | Cambios de objetivo visibles | Prueba de flujo | 4 |
| 21 | Arranca en iOS y Android | Verificación en dispositivo o build | 6 |
| 22 | Sin errores bloqueantes | Informe de regresión | 5 |
| 23 | Formularios utilizables | Componente + manual | 3, 5 |
| 24 | Interfaz adaptable | Manual en tamaños y orientaciones | 5 |
| 25 | Datos sobreviven al cierre | Integración + manual | 2, 5 |
| 26 | Pruebas críticas pasan | CI | 5 |
| 27 | Sin secretos en el cliente | Revisión de repositorio | 5, 6 |
| 28 | Políticas remotas probadas (si hay backend) | No aplica en el MVP local | 7 |
| 29 | Sin acceso a datos de otros usuarios | No aplica hasta cuentas | 7 |
| 30 | Recopilación de datos documentada | `docs/SECURITY.md` y política | 5, 6 |
| 31 | Guía de instalación | README | 5 |
| 32 | Guía de ejecución | README | 5 |
| 33 | Guía de pruebas | `docs/TEST_STRATEGY.md` | 5 |
| 34 | Limitaciones documentadas | STATUS.md y README | 5 |
| 35 | Estado real registrado | STATUS.md actualizado al cerrar cada fase | Todas |

Los criterios 21, 27 (verificación completa), 28 y 29 requieren entorno o backend que hoy no existen; se documentan como bloqueados y no se marcan como cumplidos.

---

## 14. Limitaciones del entorno y desbloqueo

| ID | Limitación | Efecto | Desbloqueo | Responsable |
|---|---|---|---|---|
| B1 | Licencia de Xcode no aceptada | Sin simulador, sin build iOS local, sin E2E | `sudo xcodebuild -license accept` | Fundador |
| B2 | Sin JDK ni Android SDK | Sin build Android local | Instalar Temurin 17+ y cmdline-tools, o usar EAS | Fundador / Agente 12 |
| B3 | Cuentas Apple/Google y Expo/EAS | Sin builds distribuibles ni publicación | Alta de cuentas y credenciales | Fundador |
| B4 | Sin repositorio Git | Sin historial ni CI real | T0.5 | Agente 0 |
| B5 | Sin dispositivo físico | Accesibilidad y teclado solo estimados | Prueba manual en dispositivo | Fundador |

Mientras B1 y B2 sigan abiertos, las fases 1–5 se pueden completar con pruebas automatizadas y exportación de bundles, pero **no se afirmará** que la app "funciona en iOS y Android" sin evidencia de ejecución.

---

## 15. Primeras acciones concretas

1. T0.5 — Inicializar el repositorio Git y el primer commit con los tres documentos.
2. T0.6 — Redactar los ADR a partir del registro de ARCHITECTURE §20.
3. T0.4 — Completar los 10 documentos de memoria restantes.
4. T0.7 — Cerrar P1–P8 con el fundador (o aplicar los supuestos por defecto).
5. T1.1 — Crear el proyecto Expo SDK 58 y verificar que arranca y pasa CI.

---

*Fin de EXECUTION_PLAN.md v1.0.*
