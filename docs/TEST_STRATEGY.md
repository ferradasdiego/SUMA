# SUMA — Estrategia de pruebas

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Vigente |
| Propietario | Agente 11 — QA y testing |
| Referencia | SUMA_MASTER_SPEC.md §16; ARCHITECTURE.md §17 |

## 1. Enfoque

Prioridad a los flujos críticos y a las reglas de cálculo, no a un porcentaje de cobertura. Cada regla de dominio debe tener casos normales, límite y error. La persistencia se prueba contra SQLite real, no contra mocks.

## 2. Niveles

| Nivel | Herramienta | Qué cubre | Dónde |
|---|---|---|---|
| Unitario | Jest (Node) | Dinero, fechas, periodos, comparaciones, objetivos, esquemas | tests/unit |
| Integración | Jest + sql.js | Migraciones, CRUD, transacciones, restricciones, cierre y reapertura | tests/integration |
| Componentes | jest-expo + RNTL | Formularios, validaciones, estados, diálogos, navegación | tests/components |
| E2E | Maestro | Flujo completo del spec §16.4 | tests/e2e (bloqueado sin simulador) |
| Manual | Dispositivo | Accesibilidad, teclado, tamaños, rendimiento percibido | Fase 5 |

## 3. Casos obligatorios

### Dinero

- 2,50 con coma y con punto según locale.
- Separador de miles (1.234,56) y rechazo de agrupaciones inválidas.
- Cero, negativo, vacío, letras, notación científica.
- Más decimales de los permitidos: rechazo sin redondeo silencioso.
- Importe máximo y superior al máximo.
- Formato de salida con moneda y sin pérdida de precisión.

### Tiempo

- Inicio de semana lunes y domingo.
- Día/mes/año en curso y pasados.
- Mes de 28, 29 (bisiesto), 30 y 31 días.
- Cambio de horario de verano en Europe/Madrid (marzo y octubre).
- Comparación de tramos equivalentes.
- Cambio de zona horaria sin reinterpretar registros.

### Persistencia

- Base vacía: migración completa y semilla.
- CRUD completo con datos válidos.
- Restricciones: importe <= 0, categoría inexistente, dos objetivos activos.
- Transacción revertida ante error.
- Cierre y reapertura: los datos siguen ahí.
- Migración fallida: estado controlado, sin esquema parcial.

### Interfaz

- Validación visible y asociada al campo.
- Doble toque en guardar no duplica.
- Estados vacío, carga y error.
- Confirmación de borrado y cancelación.
- Navegación entre los cuatro destinos.
- Texto escalado sin recortes (manual).

## 4. Datos de prueba

Fixtures deterministas en tests/fixtures: perfil EUR es-ES con semana empezando en lunes; categorías semilla; registros en fechas conocidas (incluidos 29 de febrero y cambios de hora). Ningún dato personal real.

## 5. Comandos

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test --coverage
pnpm test:integration
```

Los resultados que se documenten deben provenir de una ejecución real, con fecha y salida.

## 6. Integración continua

El pipeline ejecuta formato, lint, TypeScript, unitarias, integración, componentes, audit y expo-doctor. Un fallo bloquea la integración. No se silencian pruebas con skip sin justificación escrita.

## 7. Evidencia y honestidad

- Una tarea no se cierra sin prueba ejecutada o justificación explícita de por qué no se pudo.
- Las pruebas no ejecutadas (E2E, manual en dispositivo) se declaran como tales.
- No se declara "funciona en iOS/Android" sin ejecución real.
- No se inventan resultados.

## 8. Criterios de calidad

- Sin errores bloqueantes conocidos.
- Cálculos monetarios y temporales verificados.
- Persistencia y coherencia tras editar y borrar.
- Formularios utilizables y accesibles.
- Regresión verde antes de cada integración.

## 8.1. Verificación de la PWA

Además de Jest, la variante web se prueba con un script de Chrome headless:

```bash
pnpm web:build
pnpm web:serve          # en otra terminal
node scripts/smoke-web.mjs
```

Comprueba 18 puntos: origen aislado, `SharedArrayBuffer`, onboarding, edición y persistencia de un importe rápido, alta, persistencia al recargar, service worker, manifest, historial, estadísticas, ausencia de errores en línea, funcionamiento sin conexión y edición de un registro sin conexión (una ruta que nunca se había abierto). Se ejecutó sobre `http://localhost` y sobre HTTPS con certificado local.

Además se verificó en Chrome un flujo manual automatizado de idioma e importación (`pnpm web:smoke:i18n`): onboarding en español → English, alta de un registro, cambio a catalán en Ajustes, exportación, fusión (0 añadidos, 1 existente), restablecimiento, reemplazo y recuperación del registro. Sin errores de consola.

## 9. Resultados de la ejecución real (2026-10-23)

| Comprobación | Comando | Resultado |
|---|---|---|
| Formato | `pnpm format:check` | Correcto |
| Lint | `pnpm lint` | 0 errores, 0 avisos |
| TypeScript | `pnpm typecheck` | 0 errores |
| Pruebas | `pnpm exec jest --runInBand` | 24 suites, 122/122 |
| Rendimiento (sql.js) | semilla de 10.000 registros | seed 192 ms; suma 2 ms; página de 50 en 3 ms |
| Auditoría | `pnpm audit --prod --audit-level high --ignore-unfixable` | Sin vulnerabilidades accionables |
| Expo Doctor | 20/20 comprobaciones | Correcto |
| Bundles | iOS y Android | Generados (5,2 MB) |
| PWA | `pnpm web:build` + smoke | 18/18 comprobaciones en HTTP y HTTPS |

Cobertura por área: dinero y límites, fechas/DST, periodos y comparaciones, agregados y objetivos, migraciones y CRUD, restricciones, persistencia tras reapertura, transacciones, exportación e importación JSON (validación, fusión y reemplazo), preparación de alta y de objetivo, importes rápidos persistentes, diccionarios completos (claves y marcadores), selector de idioma, componentes y accesibilidad básica.

No ejecutadas (y motivo):

- E2E con Maestro: requiere simulador o dispositivo; la licencia de Xcode no está aceptada.
- Lector de pantalla y tamaño de texto en dispositivo: requiere dispositivo.
- Builds nativos iOS/Android: falta toolchain o cuentas.
- Prueba de la hoja de compartir: requiere dispositivo.
