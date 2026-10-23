# SUMA — Product Requirements Document (MVP)

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Congelado para el MVP (pendiente de confirmación del fundador) |
| Propietario | Agente 1 — Product Manager |
| Alcance | Fase 0 a Fase 5 |

## 1. Alcance

Incluido: onboarding, registro, categorías fijas, inicio, historial con edición y borrado, estadísticas por día/semana/mes/año, un objetivo activo, ajustes básicos, exportación JSON, persistencia local, accesibilidad básica y pruebas.

Fuera: cuentas, sincronización, notificaciones, analítica, IA, funciones sociales, varios objetivos, categorías personalizadas, modo oscuro, CSV, widgets, pagos y publicación.

## 2. Historias de usuario y criterios de aceptación

### US-01 — Onboarding

Como persona que abre SUMA por primera vez, quiero entender qué hace la app y elegir mis preferencias básicas sin leer un manual.

Criterios:

- Se muestra una vez; al completarse no vuelve a aparecer.
- Explica que se registra dinero **no gastado**, no ahorro real.
- Permite elegir moneda (EUR por defecto) y primer día de semana.
- Se puede omitir el registro inicial y empezar en Inicio.
- Si el usuario cierra la app a medias, el onboarding vuelve a mostrarse.

### US-02 — Registrar una decisión

Como usuario, quiero registrar un importe que he decidido no gastar en pocos pasos.

Criterios:

- Importe obligatorio, mayor que cero, con separador decimal del idioma.
- Categoría obligatoria entre las siete disponibles.
- Nota opcional de hasta 280 caracteres.
- Fecha por defecto: hoy; se puede cambiar a una fecha pasada.
- Importes rápidos configurables (por ejemplo 1,50 / 2,50 / 5,00), sin impedir uno personalizado.
- Al guardar: validación, persistencia, recálculo y confirmación visible.
- Un doble toque no crea dos registros.
- Tras guardar, el formulario queda limpio y se permite otro alta.

### US-03 — Ver el progreso en Inicio

Como usuario, quiero ver de un vistazo cuánto he sumado y cómo voy.

Criterios:

- Total acumulado con la mayor jerarquía visual.
- Importe de hoy y de la semana.
- Gráfica de evolución del periodo reciente.
- Últimos movimientos con categoría e importe.
- Objetivo activo con progreso y explicación.
- Botón principal "Registrar una decisión".
- Los cambios se reflejan sin reiniciar la app.

### US-04 — Consultar el historial

Como usuario, quiero revisar mis registros y encontrar uno concreto.

Criterios:

- Orden cronológico descendente por defecto.
- Cada fila muestra categoría, descripción, importe y fecha.
- Filtro por categoría y por rango de fechas.
- Estado vacío claro cuando no hay registros o el filtro no devuelve nada.
- Paginación o carga incremental sin bloquear la interfaz.

### US-05 — Editar un registro

Como usuario, quiero corregir un importe o una nota equivocada.

Criterios:

- El formulario se abre con los valores actuales.
- Las mismas validaciones que el alta.
- Al guardar, el historial y todos los totales se actualizan.
- Si se cancela, no se modifica nada.

### US-06 — Eliminar un registro

Como usuario, quiero borrar un registro que no debería existir.

Criterios:

- Se pide confirmación con texto claro e irreversible.
- Se puede cancelar.
- Al confirmar, el registro desaparece y los totales se recalculan.
- No se muestra ningún total obsoleto.

### US-07 — Estadísticas por periodo

Como usuario, quiero entender mi evolución por día, semana, mes y año.

Criterios:

- Selector de periodo.
- Total del periodo, número de decisiones, promedio diario y mejor día.
- Comparación con el periodo anterior solo si hay datos suficientes; se etiqueta el tramo.
- Distribución por categorías con importes y porcentajes.
- Periodo vacío: cero y estado vacío, sin gráficas engañosas.
- Semana según el primer día configurado; mes y año calendario.

### US-08 — Objetivo activo

Como usuario, quiero fijar una meta y ver cuánto me acerco.

Criterios:

- Un objetivo activo como máximo.
- Campos: nombre, cantidad objetivo, fecha objetivo opcional.
- Progreso calculado desde los registros del periodo del objetivo.
- Se explica que el progreso no implica dinero apartado.
- Se puede editar y eliminar.
- Al crear uno nuevo, el anterior se desactiva.

### US-09 — Ajustes

Como usuario, quiero controlar mis preferencias y mis datos.

Criterios:

- Moneda visible; cambio bloqueado si existen registros, con explicación.
- Primer día de semana editable.
- Enlaces a privacidad y condiciones.
- Restablecer datos locales con doble confirmación.

### US-10 — Exportar datos

Como usuario, quiero una copia de mi información.

Criterios:

- Exportación JSON con todos los registros, categorías y objetivo.
- Se indica claramente que contiene notas personales.
- Se usa la hoja de compartir del sistema.
- Si falla, se muestra un error comprensible sin perder datos.

### US-11 — Estados y accesibilidad

Como usuario con o sin discapacidad, quiero que la app nunca se quede en blanco y que sea comprensible con lector de pantalla.

Criterios:

- Todas las pantallas tienen estado vacío, carga y error.
- Etiquetas accesibles en controles e importes.
- Áreas táctiles de 44 × 44 como mínimo.
- Texto escalable sin recortes.
- La información no depende solo del color.

## 3. Requisitos de pantalla

| Pantalla | Requisitos clave |
|---|---|
| Onboarding | 2–3 pasos, sin registro obligatorio, cierre seguro |
| Inicio | Total, hoy, semana, gráfica, últimos, objetivo, CTA |
| Añadir | Importe, categoría, nota, fecha, guardado único, confirmación |
| Historial | Lista, filtros, edición, borrado confirmado, vacíos |
| Estadísticas | Selector, resumen, comparación, categorías, gráficas |
| Objetivos | Alta, edición, borrado, progreso explicado |
| Ajustes | Preferencias, legales, exportación, restablecimiento |

## 4. Requisitos no funcionales

- Registro completo en menos de 10 segundos para un usuario habituado.
- Persistencia real: los datos sobreviven al cierre.
- Cálculos exactos en unidades menores.
- Respuesta de la interfaz por debajo de 300 ms con 10.000 registros.
- Sin secretos ni datos personales en logs.
- Sin red en el MVP.

## 5. Fuera de alcance

Todo lo listado en EXECUTION_PLAN §2.2. Cualquier propuesta nueva se evalúa contra el criterio "¿es necesario para que el flujo principal sea correcto y fiable?" y, si no, va al backlog.

## 6. Decisiones pendientes

P1 identificador de app, P2 notificaciones, P3 cálculo de objetivo, P4 exportación CSV, P5 moneda única, P6 canales de beta, P7 modo oscuro, P8 textos legales. Ver ARCHITECTURE §22.
