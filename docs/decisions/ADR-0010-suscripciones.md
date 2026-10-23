# ADR-0010: Monetización diferida a Fase 7

- **Estado**: Aceptada
- **Fecha**: 2026-10-23
- **Decisores**: Agente 0 (coordinador y arquitecto), Agente 4 (arquitectura de software)
- **Ámbito**: Arquitectura y calidad

## Contexto

El modelo es freemium, pero el valor del producto debe validarse antes de cobrar.

## Problema

Cuándo introducir compras y suscripciones.

## Alternativas consideradas

1. Paywall desde el día 1
2. Suscripción en paralelo al MVP
3. Después de validar el núcleo

## Decisión

Sin pagos en el MVP. En Fase 7 se evaluará RevenueCat con las compras nativas y verificación de recibos en servidor.

## Justificación

Cobrar antes de demostrar recurrencia perjudica la validación y añade obligaciones legales y de tienda.

## Consecuencias

- No hay paywall ni entitlements en el MVP.
- La matriz de funciones premium se definirá con datos de uso.
- La verificación nunca confiará solo en el cliente.

## Riesgos

- Lanzar sin modelo de ingresos.
- Complejidad de las tiendas subestimada.

## Referencias

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [SUMA_MASTER_SPEC.md](../../SUMA_MASTER_SPEC.md) §20
