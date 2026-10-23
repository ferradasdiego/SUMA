# SUMA — Project Brief

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-10-23 |
| Estado | Vigente (visión estable) |
| Propietario | Agente 1 — Product Manager |
| Fuente | SUMA_MASTER_SPEC.md §1, §2, §12, §24 |

## 1. Qué es SUMA

SUMA es una aplicación móvil para registrar el dinero que una persona decide **no gastar** en decisiones cotidianas: un café que se prepara en casa, una comida que se lleva al trabajo, una compra impulsiva que se evita.

Cada decisión se convierte en un registro y en progreso visible. El usuario puede ver cuánto ha sumado hoy, esta semana, este mes y en total, y entender de dónde procede.

## 2. Qué no es SUMA

- No es una aplicación bancaria ni mueve dinero.
- No es un gestor de gastos tradicional.
- No es una cartera de inversión ni una cuenta de ahorro real.
- No conoce las compras del usuario ni se conecta a sus cuentas.
- No promete rentabilidad ni afirma que el dinero esté apartado.

El importe registrado es una **estimación declarada por el usuario** del gasto que ha evitado. Esta distinción debe mantenerse en la interfaz, las estadísticas, la documentación y la comunicación comercial.

## 3. Problema

Las aplicaciones financieras suelen mostrar lo que se ha gastado. SUMA pone el foco en la conducta opuesta: las ocasiones en que se decide conscientemente no gastar, que normalmente no se registran en ningún sitio.

Esa ausencia de registro impide ver el progreso, mantener el hábito y descubrir patrones.

## 4. Propuesta de valor

> Cada decisión cuenta.

SUMA convierte decisiones pequeñas en un contador acumulado comprensible, y lo acompaña de estadísticas sencillas que refuerzan la constancia sin culpabilizar.

## 5. Público objetivo

Adultos que quieren mejorar sus hábitos financieros sin gestionar un presupuesto complejo, compran café, comida o ropa con frecuencia y prefieren una interacción rápida en el móvil. No se requieren conocimientos financieros.

## 6. Principios de producto

1. **Rapidez**: registrar una decisión en menos de 10 segundos.
2. **Claridad**: hoy, acumulado, evolución y origen visibles de un vistazo.
3. **Honestidad**: nunca confundir dinero no gastado con ahorro disponible.
4. **Motivación saludable**: celebrar la constancia sin penalizar los días sin registros.
5. **Privacidad**: recoger lo mínimo; sin acceso a cuentas bancarias.
6. **Control**: el usuario puede editar, borrar y exportar sus datos.
7. **Simplicidad técnica**: nada que no aporte valor al MVP.

## 7. Modelo de negocio (hipótesis)

Freemium: el registro, el historial, las estadísticas básicas y un objetivo activo son gratuitos. SUMA Plus añadirá estadísticas avanzadas, varios objetivos, categorías personalizadas, widgets y exportación de informes.

Precios iniciales a validar: 2,99 EUR/mes y 19,99 EUR/año. No se implementan pagos en el MVP.

## 8. Métricas de éxito

- Activación: porcentaje de usuarios que registra su primera decisión.
- Recurrencia: retención D1, D7 y D30.
- Uso: registros por usuario activo.
- Valor percibido: entrevistas y disposición a pagar.
- Conversión a Plus (solo tras la Fase 7).

El importe acumulado por los usuarios **no** es ingreso de la empresa y no se presentará como tal.

## 9. Restricciones

- iOS y Android con un único código.
- Español inicial; estructura preparada para inglés.
- MVP local-first, sin cuentas ni backend.
- Corrección de cálculos y privacidad por delante de funcionalidades.

## 10. Criterio de éxito del MVP

Una persona puede abrir SUMA, registrar una decisión en segundos, ver su progreso actualizado, consultar el historial y las estadísticas, fijar un objetivo, cerrar la app y comprobar que todo sigue ahí.
