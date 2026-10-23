# SUMA — Seguridad y privacidad

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Vigente para el MVP local |
| Propietario | Agente 8 — Seguridad y privacidad |
| Referencia | SUMA_MASTER_SPEC.md §11 |

## 1. Principios

Privacidad desde el diseño, mínima recogida, mínimos privilegios, secretos fuera del código, validación de entradas, dependencias mantenidas y errores que no filtren datos.

## 2. Inventario de datos

| Dato | Dónde vive | Sensibilidad | Necesario |
|---|---|---|---|
| Importes no gastados | SQLite local | Alta (financiera) | Sí |
| Notas libres | SQLite local | Alta (puede contener datos personales) | Opcional |
| Categoría y fecha | SQLite local | Media | Sí |
| Moneda, idioma, primer día de semana | SQLite local | Baja | Sí |
| Objetivo (nombre, importe, fechas) | SQLite local | Media | Opcional |
| Exportación JSON | Sistema de archivos temporal + hoja de compartir | Alta | Solo a petición |

No se recogen: contactos, ubicación, cuentas bancarias, identificadores publicitarios, datos de salud, correo electrónico.

## 3. Modelo de amenazas (MVP)

| Amenaza | Vector | Impacto | Mitigación |
|---|---|---|---|
| Acceso físico al dispositivo | Teléfono desbloqueado | Alto | Protección del sistema operativo; sin capturas en la app; no hay cifrado adicional en el MVP (limitación documentada) |
| Fuga por logs | Logs de desarrollo o crash | Alto | Prohibido registrar importes, notas o identificadores; solo códigos |
| Dependencia comprometida | Paquete npm malicioso | Alto | Lockfile, pnpm audit, revisión de dependencias nuevas |
| Inyección SQL | Entradas mal validadas | Alto | Consultas parametrizadas; nunca concatenar valores |
| Fuga por exportación | Usuario comparte el JSON | Medio | Aviso explícito antes de compartir |
| Borrado accidental | Acción del usuario | Medio | Confirmación irreversible clara |
| Acceso remoto | Futuro backend | Crítico | RLS y verificación de identidad en servidor (no implementado aún) |

Fuera de alcance del MVP: atacante con acceso root al dispositivo, malware del sistema operativo, ingeniería social.

## 4. Controles técnicos

- SQL siempre parametrizado.
- Validación Zod en los límites (formulario, repositorio, fila).
- Sin red: la app no realiza peticiones salientes en el MVP.
- Sin secretos en el repositorio; .env ignorado; solo variables EXPO_PUBLIC no sensibles (ninguna prevista).
- Dependencias fijadas por lockfile y auditadas en CI.
- Errores de UI genéricos; el detalle técnico no se muestra al usuario.
- Exportación solo bajo acción explícita.

## 5. Registro de eventos

No hay analítica de terceros (ADR-0012). En desarrollo se permite un log con código de error y contexto no personal. En producción, silencio o logs mínimos sin datos del usuario.

## 6. Exportación y borrado

- Exportación JSON completa, iniciada por el usuario, con aviso de contenido personal.
- Borrado de un registro: confirmación y acción irreversible.
- Restablecer datos locales: doble confirmación, texto explícito y recreación del esquema.
- Política futura de cuentas: eliminación de cuenta y datos asociados, con plazo definido.

## 7. Checklist previo al lanzamiento

- [ ] Revisar que no hay secretos en el repositorio ni en el bundle.
- [ ] Verificar que ningún log de producción contiene importes o notas.
- [ ] Revisar dependencias con pnpm audit.
- [ ] Probar exportación y restablecimiento.
- [ ] Redactar política de privacidad real adaptada a los servicios usados.
- [ ] Redactar condiciones de uso.
- [ ] Declaración de privacidad de App Store y Google Play.
- [ ] Revisar RGPD y LOPDGDD con asesoramiento cuando corresponda.
- [ ] Verificar permisos solicitados (el MVP no debería solicitar ninguno).
- [ ] Definir conservación y eliminación de datos.

No se afirmará cumplimiento legal hasta completar esta revisión.

## 8. Respuesta ante incidentes (MVP)

1. Reproducir y contener.
2. Evaluar datos afectados.
3. Corregir y publicar actualización.
4. Documentar en DECISIONS/STATUS.
5. Si hubiera backend, notificar según normativa.

## 9. Limitaciones conocidas

- SQLite local sin cifrado adicional: depende de la protección del dispositivo.
- Sin copia de seguridad automática.
- Sin informe remoto de fallos.
- Sin autenticación porque no hay cuentas.
