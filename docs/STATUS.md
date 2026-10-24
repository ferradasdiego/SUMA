# SUMA — Estado del proyecto

| Campo | Valor |
|---|---|
| Última actualización | 2026-10-23 |
| Fase actual | **Fase 6 — Beta privada (no iniciada; requiere cuentas)** |
| Estado global | MVP funcional en código y verificado con pruebas automatizadas. Variante web/PWA instalable. **Sin verificación en dispositivo nativo.** |
| Documento base | [SUMA_MASTER_SPEC.md](../SUMA_MASTER_SPEC.md) v1.0 |
| Plan vigente | [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) |
| Arquitectura vigente | [ARCHITECTURE.md](./ARCHITECTURE.md) |

> Solo se registra lo que existe y se ha comprobado. Una pantalla o un archivo no equivalen a una función terminada.

---

## 1. Resumen

- Fases 0 a 5 cerradas: memoria, esqueleto técnico, dominio y persistencia, registro e Inicio, historial/estadísticas/objetivos y calidad.
- **122 pruebas automatizadas en verde** en 24 suites.
- La app compila el bundle para iOS y Android; **no se ha ejecutado en simulador ni dispositivo** (licencia de Xcode no aceptada; sin JDK/Android SDK).
- Persistencia real verificada en pruebas con SQLite y reapertura de la base.
- Exportación e importación JSON (fusionar o reemplazar), cinco idiomas y accesibilidad básica implementados.
- **Canal web/PWA adicional**: la app se sirve desde el Mac, se instala en el móvil y funciona sin conexión. Verificado en Chrome sobre HTTP local y HTTPS.

---

## 2. Funcionalidades implementadas

| Área | Estado | Evidencia |
|---|---|---|
| Onboarding | Implementado | Idioma, moneda, primer día de semana, persistencia |
| Idiomas | Implementado | ES/EN/GL/CA/PT con banderas, selector en onboarding y Ajustes, errores traducidos |
| Registro | Implementado | Importe, categoría, nota, fecha, **importes rápidos editables**, anti-doble-envío |
| Inicio | Implementado | Total, hoy, semana, últimos movimientos, objetivo, CTA |
| Historial | Implementado | Filtros, orden, paginación, edición, borrado confirmado |
| Estadísticas | Implementado | Día/semana/mes/año, comparación, promedios, mejor día, categorías |
| Gráficas | Implementado | Barras, línea y barras horizontales accesibles |
| Objetivos | Implementado | Un objetivo activo, crear/editar/borrar, progreso |
| Ajustes | Implementado | Idioma, moneda (editable sin registros), semana, exportación e importación JSON, legal, reset |
| Persistencia | Implementado | SQLite, migraciones 001/002, transacciones, reapertura |
| Calidad | Implementado | TypeScript estricto, lint, formato, 122 pruebas, CI |
| Web/PWA | Implementado | Manifest, service worker v5, SQLite WASM, offline, barra superior sin blur, prueba con Chrome |

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

Nota de sandbox: los comandos de Expo se ejecutan con `HOME=$PWD/.home`, `EXPO_NO_TELEMETRY=1` y `node node_modules/expo/bin/cli`, porque el home del usuario no es escribible aquí. No es necesario en CI ni en una máquina normal.

---

## 4. Estado por fase

| Fase | Estado | Evidencia |
|---|---|---|
| 0 — Preparación | Cerrada | 13 documentos, 17 ADR iniciales (20 actuales), repositorio |
| 1 — Esqueleto técnico | Cerrada (nativa pendiente) | Doctor 20/20, bundles, pruebas |
| 2 — Dominio y persistencia | Cerrada | SQLite real, migraciones, reapertura |
| 3 — Registro e Inicio | Cerrada | Formulario, Inicio, onboarding, ajustes |
| 4 — Historial, estadísticas y objetivos | Cerrada | Pantallas, gráficas y pruebas |
| 5 — Calidad y accesibilidad | Cerrada (dispositivo pendiente) | 122 pruebas, exportación, rendimiento |
| 6 — Beta privada | No iniciada (bloqueada) | Requiere cuentas y builds |
| 7 — Monetización y lanzamiento | No iniciada | Requiere beta |

Progreso: **6 de 8 fases cerradas**. Tareas: **38 de 54 cerradas**, 4 parciales, 1 bloqueada. Criterios de aceptación con evidencia: **31 de 35**; los criterios 21 y 24 requieren dispositivo y 28–29 no aplican sin backend.

---

## 5. Pruebas ejecutadas (evidencia real)

| Comprobación | Comando | Resultado |
|---|---|---|
| Formato | `pnpm format:check` | Correcto |
| Lint | `pnpm lint` | 0 errores, 0 avisos |
| TypeScript | `pnpm typecheck` | 0 errores |
| Pruebas | `pnpm exec jest --runInBand` | 24 suites, 122/122 |
| Rendimiento | semilla de 10.000 registros (sql.js) | seed 192 ms; suma 2 ms; página 3 ms |
| Auditoría | `pnpm audit --prod --audit-level high --ignore-unfixable` | Sin vulnerabilidades accionables |
| Expo Doctor | `node node_modules/expo-doctor/bin/expo-doctor.js` | 20/20 |
| Bundle iOS | `expo export --platform ios` | 5,2 MB |
| Bundle Android | `expo export --platform android` | 5,2 MB |
| Build web | `pnpm web:build` | `dist/` con manifest, service worker e iconos |
| Smoke PWA | `node scripts/smoke-web.mjs` | 18/18 en HTTP local y HTTPS |
| Fallback offline | `node scripts/smoke-offline-fallback.mjs` | 1/1: sirve `offline.html`, no un archivo vacío |
| PWA sin conexión | Recarga con red desactivada | Correcta |
| Simulador iOS | `xcrun simctl` | Bloqueado por licencia |

Cobertura: dinero y límites, fechas y DST, periodos y comparaciones, agregados y objetivos, migraciones y CRUD, restricciones, persistencia tras reapertura, transacciones, exportación e importación JSON (fusión y reemplazo), preparación de formularios, diccionarios/idioma, componentes y accesibilidad básica.

No ejecutadas y motivo:

- E2E (Maestro): sin simulador ni dispositivo.
- Lector de pantalla y tamaño de texto: sin dispositivo.
- Builds nativos y publicación: sin toolchain ni cuentas.
- Hoja de compartir real: sin dispositivo.

---

## 6. Decisiones

Las 20 decisiones arquitectónicas están en [DECISIONS.md](./DECISIONS.md) (ADR-0018: canal web/PWA; ADR-0019: importación; ADR-0020: idiomas). Decisiones de implementación relevantes:

- Fecha mediante campo de texto `AAAA-MM-DD` y atajos Hoy/Ayer (sin dependencia de selector nativo).
- Exportación JSON con `expo-file-system` + `expo-sharing`; importación con validación Zod, fusión por identificadores o reemplazo transaccional.
- La moneda se bloquea en el repositorio de perfil si existe cualquier registro.
- El objetivo único se garantiza con índice único parcial.
- Gráficas propias sobre SVG, con resumen accesible y límite de puntos.
- La PWA usa la implementación web oficial de `expo-sqlite` (wa-sqlite/WASM) y requiere COOP/COEP y HTTPS en el móvil.
- El viewport web no usa `viewport-fit=cover`: el contenido queda dentro del área segura y se evita el blur de la barra de estado de iOS 26.
- La UI usa cinco diccionarios tipados y un locale activo; los errores de dominio se traducen con un mapa de mensajes.
- El HTML de la PWA se post-procesa porque `+html.tsx` no aplica con `output: 'single'`.

Supuestos P1–P8 sin confirmar: `com.suma.mobile`, español por defecto (cinco idiomas disponibles), EUR, sin notificaciones, JSON, un objetivo.

---

## 7. Bloqueos

| ID | Bloqueo | Impacto | Desbloqueo |
|---|---|---|---|
| B1 | Licencia de Xcode no aceptada | Sin simulador, build iOS ni E2E | `sudo xcodebuild -license` |
| B2 | Sin JDK ni Android SDK | Sin build Android local | Temurin 17+ y cmdline-tools, o EAS |
| B3 | Sin cuentas Apple/Google/Expo | Sin distribución ni publicación | Alta de cuentas |
| B6 | Sin dispositivo físico | Accesibilidad y compartir sin verificar | Prueba manual |

---

## 8. Limitaciones conocidas

- No hay verificación de ejecución en iOS/Android.
- El selector de fecha es textual; no es la mejor experiencia.
- Un solo objetivo; sin asignación de registros por objetivo.
- Importación JSON sin fusión de monedas distintas; sin CSV.
- Sin notificaciones, cuentas, sincronización, analítica ni modo oscuro.
- El rendimiento se midió en Node/sql.js, no en dispositivo.
- La política de privacidad y los términos siguen pendientes de revisión legal.
- En la PWA, los datos pertenecen al origen del navegador, no se sincronizan con la app nativa y pueden perderse si se borra el sitio; iOS puede desalojar almacenamiento.
- La instalación de la PWA en el móvil requiere HTTPS; para uso sin el PC se documenta el despliegue estático con COOP/COEP (Netlify/Cloudflare/Vercel).
- Un túnel de desarrollo no es un alojamiento permanente: al cerrar el puerto deja de responder y su URL puede cambiar. Para uso diario, desplegar `dist/` en un origen estable.
- La importación se verificó de extremo a extremo en la PWA; el selector de archivos nativo requiere probarse en un dispositivo.

---

## 9. Cómo probar en local

Sigue [LOCAL_TESTING.md](./LOCAL_TESTING.md): pruebas automatizadas, Expo Go en teléfono, simulador iOS, emulador Android, EAS Build o **PWA servida desde el Mac** (incluye HTTPS con mkcert e instalación en el móvil).

## 10. Próximos pasos

1. **Desbloquear el entorno**: aceptar la licencia de Xcode y/o instalar JDK + Android SDK.
2. **Verificación real**: ejecutar en simulador, probar teclado, tamaños de texto, exportación y reinicio.
3. **Fase 6**: cuentas EAS/Apple/Google y builds de beta.
4. **Mejoras opcionales**: selector de fecha nativo, pruebas E2E, más objetivos, más idiomas.

Ninguna de estas acciones se puede completar en este entorno sin intervención externa.

---

## 11. Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-23 | Fase 0: memoria y 17 ADR |
| 2026-10-23 | Fase 1: scaffold, tema, rutas, CI |
| 2026-10-23 | Fase 2: dominio, SQLite, migraciones, repositorios |
| 2026-10-23 | Fase 3: AppProvider, onboarding, alta, Inicio, ajustes |
| 2026-10-23 | Fase 4: historial, estadísticas, gráficas, objetivos |
| 2026-10-23 | Fase 5: exportación, rendimiento, accesibilidad, documentación |
| 2026-10-23 | Canal web/PWA: build estático, SQLite WASM, manifest, service worker, servidor HTTPS local y verificación con Chrome |
| 2026-10-23 | Fix PWA: input de importe adaptable a pantallas estrechas; rutas web síncronas para que editar funcione sin conexión |
| 2026-10-23 | Importes rápidos configurables: lápiz de edición, diálogo de cambio y persistencia en el perfil (migración 002) |
| 2026-10-23 | Importación JSON con validación, fusión sin duplicados y reemplazo transaccional; exportación ampliada con importes rápidos |
| 2026-10-23 | Idiomas ES/EN/GL/CA/PT con banderas, selector en onboarding/Ajustes y errores traducidos |
| 2026-10-23 | PWA: viewport sin `cover`, fondo sólido y sin overscroll para eliminar el blur superior de iOS; service worker v5 |
