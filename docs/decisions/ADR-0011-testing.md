# ADR-0011: Jest, jest-expo, Testing Library y SQLite real en pruebas

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

Se necesita verificar dominio, persistencia y componentes sin compilar nativo en CI.

## Problema

Elegir herramientas de prueba compatibles con Expo y ejecutables en este entorno.

## Alternativas consideradas

1. Detox
2. Vitest
3. Mock de repositorios
4. Jest + jest-expo + RNTL + sql.js

## Decisión

Jest 30 con jest-expo para componentes, RNTL para interfaz, y sql.js como driver SQLite en pruebas de integración. Maestro para E2E cuando haya simulador.

## Justificación

Es la combinación soportada por Expo y se ejecuta en Node sin Xcode ni Android SDK. Probar contra SQLite real evita mocks que oculten errores de SQL.

## Consecuencias

- El driver SQL debe ser abstracto para soportar expo-sqlite y sql.js.
- El E2E queda bloqueado hasta que exista simulador o dispositivo.
- No se usan porcentajes de cobertura como sustituto de pruebas de flujos críticos.

## Riesgos

- Diferencias entre sql.js y SQLite nativo.
- Pruebas de componentes frágiles por sobreespecificar la UI.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
