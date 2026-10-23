# SUMA — Despliegue y compilación

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Preparado; compilación nativa bloqueada en el entorno actual |
| Propietario | Agente 12 — DevOps |
| Referencia | SUMA_MASTER_SPEC.md §17 |

## 1. Entornos

| Entorno | Uso | Datos | Distribución |
|---|---|---|---|
| development | Desarrollo local | Sintéticos | Expo dev |
| preview | Pruebas internas | Sintéticos | Build interno |
| production | Usuarios | Reales | App Store / Google Play |

Nunca se usan datos reales de producción en pruebas automáticas.

## 2. Configuración

- app.config.ts con nombre, slug, esquema, identificadores y versión.
- .env.example documenta variables; en el MVP no hay secretos ni variables obligatorias.
- src/config/env.ts valida el entorno al arrancar y falla con un mensaje comprensible.
- Las claves de servicio nunca se incluyen en el cliente.

## 3. Perfiles de compilación (EAS)

| Perfil | Uso | Distribución |
|---|---|---|
| development | Cliente de desarrollo | Interna |
| preview | QA y beta | Interna (TestFlight / pista interna) |
| production | Tiendas | Pública |

## 4. Versionado

- version (semver visible) y buildNumber/versionCode incrementales.
- Un build por release candidate; no se reutiliza el mismo número.
- Los cambios de esquema de datos requieren migración compatible.

## 5. Procedimiento de release

1. Pipeline en verde y matriz de aceptación revisada.
2. Actualizar versión y notas.
3. Build en EAS.
4. Pruebas de humo en dispositivo.
5. Distribución a beta.
6. Revisión de tienda y publicación.
7. Verificación pospublicación.

## 6. Checklist de tiendas

- [ ] Identificadores definitivos.
- [ ] Iconos y capturas en todos los tamaños.
- [ ] Ficha y descripción.
- [ ] Política de privacidad y condiciones.
- [ ] Declaración de privacidad (App Store / Play).
- [ ] Certificados y perfiles de firma.
- [ ] Versión mínima de sistema.
- [ ] Contacto de soporte.

## 7. Rollback

- La app es local: no hay servidor que revertir.
- Si una versión introduce un fallo bloqueante, se detiene la distribución y se publica una corrección.
- Las migraciones deben ser compatibles hacia atrás cuando sea viable; si no, se documenta y se prueba el camino de recuperación.
- Las versiones anteriores no se eliminan de la tienda sin analizar el impacto.

## 8. Limitaciones actuales del entorno

- Licencia de Xcode no aceptada: sin build iOS local ni simulador.
- Sin JDK ni Android SDK: sin build Android local.
- Sin cuentas Apple/Google/Expo: sin firma ni publicación.
- La verificación posible hoy es typecheck, lint, pruebas y exportación de bundles JS.

Desbloqueo: ver EXECUTION_PLAN §14 (B1–B3).
