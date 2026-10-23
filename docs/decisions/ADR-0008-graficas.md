# ADR-0008: Gráficas propias sobre react-native-svg

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

Se necesitan barras, línea y barras horizontales por categoría, accesibles, con la identidad visual de SUMA.

## Problema

Elegir cómo dibujar las gráficas en iOS y Android.

## Alternativas consideradas

1. Victory Native
2. react-native-gifted-charts
3. Skia
4. Componentes propios con react-native-svg

## Decisión

Tres componentes propios (BarChart, LineChart, CategoryBars) construidos con react-native-svg.

## Justificación

Control total del diseño y de la accesibilidad, sin dependencias pesadas ni motores gráficos adicionales. Las gráficas del MVP son sencillas.

## Consecuencias

- Hay que implementar y probar los componentes.
- Se limita el número de puntos (máximo 31) para mantener legibilidad.
- Cada gráfica expone un resumen textual y etiquetas por elemento.

## Riesgos

- Subestimar el esfuerzo de accesibilidad.
- Problemas de rendimiento con muchos puntos (se limita).

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
