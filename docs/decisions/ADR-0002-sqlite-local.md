# ADR-0002: SQLite local como persistencia principal

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Producto y plataforma

## Contexto

Los registros son datos relacionales (entradas, categorías, objetivos) que deben sobrevivir al cierre de la app, consultarse por rangos de fecha y agregarse.

## Problema

Elegir el almacenamiento local del MVP sin sacrificar consultas ni integridad.

## Alternativas consideradas

1. AsyncStorage
2. MMKV
3. Ficheros JSON
4. SQLite con expo-sqlite

## Decisión

SQLite mediante expo-sqlite, con migraciones versionadas, transacciones y una capa de repositorios.

## Justificación

Permite consultas por rango e índices, transacciones y restricciones de integridad. AsyncStorage y los ficheros JSON obligarían a reimplementar consultas y a cargar todo en memoria.

## Consecuencias

- Hay que versionar el esquema y probar migraciones desde cero.
- El SQL vive encapsulado en data/; la UI no lo conoce.
- Las pruebas usan un driver SQLite real (sql.js) para no simular la persistencia.

## Riesgos

- Migraciones defectuosas que pierdan datos.
- Diferencias entre SQLite del dispositivo y el de pruebas.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
