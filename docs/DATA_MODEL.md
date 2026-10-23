# SUMA — Modelo de datos

| Campo | Valor |
|---|---|
| Versión | 1.0 (esquema v1) |
| Fecha | 2026-10-23 |
| Estado | Aprobado para Fase 2 |
| Propietario | Agente 4 — Arquitectura / Agente 7 — Persistencia |
| Implementación de referencia | ARCHITECTURE.md §7 |

## 1. Principios

- Los importes son enteros en unidades menores.
- La fecha local del registro es la clave de agrupación temporal.
- No se almacenan totales ni estadísticas.
- Los identificadores se generan en el cliente (UUID v4) para permitir sincronización futura.
- El esquema se versiona con migraciones reproducibles.
- En modo local, user_id es NULL.

## 2. Entidades

### Entry

| Campo | Tipo | Nulo | Reglas |
|---|---|---|---|
| id | TEXT | No | UUID v4, clave primaria |
| user_id | TEXT | Sí | NULL en modo local |
| amount_minor | INTEGER | No | > 0 y <= 100.000.000 |
| currency | TEXT | No | ISO 4217, 3 letras |
| category_id | TEXT | No | FK a categories, RESTRICT |
| note | TEXT | Sí | Máximo 280 caracteres |
| occurred_at_utc | TEXT | No | ISO-8601 UTC |
| occurred_local_date | TEXT | No | YYYY-MM-DD, fecha de la decisión |
| occurred_tz | TEXT | No | Zona IANA usada al registrar |
| created_at | TEXT | No | ISO-8601 UTC |
| updated_at | TEXT | No | ISO-8601 UTC |

Invariantes: el importe nunca es cero ni negativo; la moneda no cambia tras crear el registro en el MVP; occurred_local_date corresponde a occurred_at_utc en occurred_tz.

### Category

| Campo | Tipo | Nulo | Reglas |
|---|---|---|---|
| id | TEXT | No | Identificador estable (cat_coffee…) |
| user_id | TEXT | Sí | Reservado para categorías propias |
| name_key | TEXT | No | Clave i18n |
| icon | TEXT | No | Nombre de Ionicons |
| color_token | TEXT | No | Token del tema, no hex |
| is_default | INTEGER | No | 0/1 |
| is_active | INTEGER | No | 0/1 |
| sort_order | INTEGER | No | Orden de presentación |
| created_at | TEXT | No | ISO-8601 UTC |

Semilla: café, comida, compras, transporte, ocio, suscripciones, otros.

### Goal

| Campo | Tipo | Nulo | Reglas |
|---|---|---|---|
| id | TEXT | No | UUID |
| user_id | TEXT | Sí | NULL en modo local |
| title | TEXT | No | 1–80 caracteres tras trim |
| target_amount_minor | INTEGER | No | > 0 y <= 1.000.000.000 |
| currency | TEXT | No | ISO 4217 |
| start_date | TEXT | No | YYYY-MM-DD |
| target_date | TEXT | Sí | >= start_date |
| is_active | INTEGER | No | 0/1; índice único parcial |
| created_at | TEXT | No | ISO-8601 UTC |
| updated_at | TEXT | No | ISO-8601 UTC |

### UserProfile

| Campo | Tipo | Nulo | Reglas |
|---|---|---|---|
| id | TEXT | No | 'local' en el MVP |
| display_name | TEXT | Sí | Opcional |
| preferred_currency | TEXT | No | ISO 4217 |
| locale | TEXT | No | BCP 47 (es-ES) |
| week_starts_on | INTEGER | No | 0 = domingo, 1 = lunes |
| onboarding_completed | INTEGER | No | 0/1 |
| created_at | TEXT | No | ISO-8601 UTC |
| updated_at | TEXT | No | ISO-8601 UTC |

## 3. Relaciones

- categories 1 — N entries (RESTRICT al borrar una categoría con registros).
- goals son independientes de entries; el progreso se calcula por periodo, no por asignación.
- user_profile es una fila única en el MVP.

## 4. Índices

- entries(occurred_local_date DESC) para historial y rangos.
- entries(category_id, occurred_local_date DESC) para filtros y distribución.
- goals: índice único parcial sobre is_active = 1.

## 5. Ciclo de vida

1. Alta: se valida en dominio, se inserta en una transacción y se actualiza updated_at.
2. Edición: se valida el patch, se actualiza la fila y updated_at; no se permite cambiar de moneda.
3. Borrado: físico, con confirmación en la UI.
4. Restablecer: se eliminan las filas y se vuelve a sembrar el esquema y las categorías.

## 6. Fechas y zonas horarias

- occurred_at_utc se genera con new Date().toISOString().
- occurred_local_date se obtiene con Intl.DateTimeFormat sobre el instante y la zona del perfil.
- occurred_tz se guarda para auditoría.
- Cambiar de zona horaria no modifica registros antiguos.
- Los límites de periodo se calculan sobre fechas locales (YYYY-MM-DD).

## 7. Migraciones

- Tabla schema_migrations como fuente de verdad.
- Migración 001: esquema completo + semilla de categorías.
- Cada migración se ejecuta dentro de una transacción.
- Se prueban desde base vacía; las futuras, también desde cada versión anterior.

## 8. Exportación

El JSON de exportación incluye:

- versión del formato (1).
- exported_at.
- profile (sin secretos).
- categories.
- entries (todos los campos, incluida la nota).
- goals.

No se exportan tokens, credenciales ni metadatos del dispositivo.

## 9. Lo que no se guarda

- Totales diarios, semanales, mensuales o anuales.
- Estadísticas precalculadas.
- Contraseñas o tokens (no existen en el MVP).
- Datos de localización.
