# SUMA — Sistema de diseño

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Aprobado para Fase 1 |
| Propietario | Agente 3 — UI/UX |
| Referencia | SUMA_MASTER_SPEC.md §5; ARCHITECTURE.md §13 |

## 1. Dirección artística

Blanca, minimalista, luminosa, moderna, cercana, elegante y optimista. Sin apariencia bancaria ni de hoja de cálculo. El total acumulado es el protagonista visual; no se acumulan tarjetas ni indicadores.

## 2. Color

Tokens centralizados en src/theme/tokens.ts. Ningún hex en componentes.

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| background | #FFFFFF | Fondo principal | — |
| surface | #F6F8F6 | Tarjetas y fondos secundarios | — |
| primary | #2D7A4B | Acción principal, acentos | 5,25:1 sobre blanco |
| primarySoft | #E8F5EB | Fondo de énfasis | 4,68:1 con primary |
| text | #1B2A20 | Texto principal | 15,01:1 sobre blanco |
| textMuted | #68756C | Texto secundario | 4,83:1 sobre blanco; 4,52:1 sobre surface |
| border | #E5EAE6 | Bordes | — |
| danger | #B42318 | Error | 6,57:1 sobre blanco |
| warning | #946200 | Advertencia | 5,24:1 sobre blanco |

Colores de categoría: el sistema define tokens (amber, green, rose, blue, violet, slate, stone) que se validarán en Fase 1. Se usan como acento, nunca como único indicador.

## 3. Tipografía

- Familia del sistema (SF Pro / Roboto). Sin fuentes externas en el MVP.
- Escala: display 40/44, título 28/34, sección 20/26, cuerpo 16/24, etiqueta 14/20, auxiliar 12/16.
- Pesos: 700 para importes y títulos, 600 para etiquetas, 400 para cuerpo.
- Importes con tabular-nums y alineación estable.

## 4. Espaciado, radios y sombras

- Espaciado en múltiplos de 4: 4, 8, 12, 16, 20, 24, 32.
- Radios: 12 (campos), 16 (tarjetas), 24 (hojas), 999 (chips).
- Sombras discretas o ninguna; se prioriza borde y contraste de superficie.

## 5. Componentes

| Componente | Variantes / estados | Requisitos |
|---|---|---|
| Button | primario, secundario, ghost; normal, pressed, disabled, loading | 44 pt de alto mínimo; etiqueta clara |
| AmountInput | normal, focus, error, disabled | Teclado numérico; separador local; error asociado |
| TextField | normal, focus, error | Contador si hay límite; etiqueta visible |
| CategoryPicker | seleccionada, no seleccionada | accessibleState selected; icono + texto |
| SummaryCard | normal, vacío | Importe tabular; etiqueta secundaria |
| EntryCard | normal, eliminando | Categoría, nota, importe, fecha |
| GoalCard | sin objetivo, con progreso, alcanzado | Porcentaje y explicación |
| ProgressBar | 0–100 %, excedido | Texto alternativo |
| PeriodSelector | día, semana, mes, año | accessibleRole tab |
| BarChart / LineChart / CategoryBars | con datos, vacío | Resumen textual; máximo 31 puntos |
| EmptyState | informativo, accionable | Título, descripción, acción opcional |
| ErrorState | reintentable | Mensaje y botón |
| ConfirmDialog | destructivo, informativo | Cancelar siempre disponible |
| Snackbar | éxito, error | No bloquea; se anuncia al lector |
| TabBar | 4 destinos | Etiquetas visibles; estado seleccionado |
| LoadingState | pantalla, inline | Sin saltos de layout |

## 6. Patrones de pantalla

- **Inicio**: saludo opcional, total grande, hoy y semana, gráfica breve, últimos 3 movimientos, objetivo, CTA fijo.
- **Añadir**: importe primero, importes rápidos, categoría, fecha, nota plegable, guardar fijo sobre el teclado.
- **Historial**: filtros compactos, lista agrupada por día, acciones por fila.
- **Estadísticas**: selector de periodo, tarjetas de resumen, comparación, gráfica, categorías.
- **Objetivos**: una tarjeta grande, edición en hoja, explicación del cálculo.
- **Ajustes**: secciones con separadores; acciones destructivas al final y en danger.

## 7. Estados

Toda pantalla con datos debe definir: normal, vacío, carga, error, éxito cuando aplique, datos incompletos, permisos denegados si aplica. Nunca una pantalla en blanco.

## 8. Accesibilidad

- Etiquetas y roles en todos los controles; importes anunciados con moneda.
- Orden de lectura coherente; foco devuelto al cerrar diálogos.
- 44 × 44 mínimo; contraste AA; texto escalable hasta 200 %.
- Movimiento reducido respetado.
- No depender del color: añadir texto o icono.

## 9. Movimiento

Animaciones cortas (150–250 ms) y funcionales: transición de tab, aparición de snackbar, progreso de objetivo. Sin animaciones que retrasen el registro. Se desactivan con reducción de movimiento.

## 10. Prohibiciones

- Colores literales fuera de tokens.
- Más de una acción primaria por pantalla.
- Textos culpabilizadores ("llevas 3 días sin ahorrar").
- Gráficas sin resumen textual.
- Mostrar importes con decimales incorrectos o sin moneda.

## 11. Skins visuales

La identidad visual es seleccionable desde Ajustes. La skin **Clásica** conserva exactamente la dirección artística de las secciones 1–10 y es la opción por defecto; la skin **Kawaii cozy** es la primera identidad adicional.

- Contrato y registro: `src/theme/skins/types.ts`, `src/theme/skins/registry.ts`.
- Consumo en componentes: `useTheme()`; ningún componente de producto importa colores estáticos.
- Persistencia: `user_profile.skin`, incluida en las copias de seguridad JSON (las copias antiguas se importan como Clásica).
- Superficies pastel opcionales: `Card tone`.
- Decoración de papel y doodles: solo cuando `skin.decoration === 'paper'`.
- Contraste: todas las skins pasan AA en el test `tests/unit/tokens.test.ts`.

La guía completa de la nueva skin, su paleta, tipografía, arquitectura y proceso de verificación está en [SKINS.md](SKINS.md).
