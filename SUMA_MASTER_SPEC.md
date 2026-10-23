SUMA — Documento Maestro de Producto, Arquitectura y Desarrollo
Especificación integral para construir una aplicación móvil de ahorro consciente mediante agentes de IA

Versión: 1.0
Estado: Especificación inicial para desarrollo
Nombre del producto: SUMA
Plataformas: iOS y Android
Idioma inicial: Español
Modelo de negocio: Freemium con suscripción opcional
Tipo de aplicación: Finanzas personales ligeras, seguimiento de hábitos y ahorro consciente
Objetivo: Construir una aplicación móvil funcional, segura, atractiva, mantenible y preparada para escalar.

0. INSTRUCCIONES GENERALES PARA DEEPSEEK

Actúa como arquitecto principal, responsable de producto y coordinador de un equipo de agentes especializados en desarrollo de software.

Tu misión es convertir esta especificación en una aplicación real, no limitarte a proponer código, pantallas, ejemplos aislados o una demostración visual.

Debes coordinar agentes especializados en:

Dirección de producto y análisis funcional.
Investigación de usuarios y estrategia de negocio.
UI/UX y diseño visual.
Arquitectura de software.
Desarrollo móvil.
Backend, base de datos y persistencia.
Seguridad y privacidad.
Analítica y visualización de datos.
Monetización y suscripciones.
QA, testing y accesibilidad.
DevOps, CI/CD y publicación.
Documentación y mantenimiento.
0.1. Reglas de ejecución
Lee el documento completo antes de empezar.
Divide el trabajo en fases con dependencias explícitas.
Asigna a cada agente responsabilidades concretas, entregables y criterios de aceptación.
Mantén un único contrato técnico entre los agentes.
No permitas que distintos agentes inventen modelos de datos, nombres de campos, convenciones o arquitecturas incompatibles.
Designa un agente coordinador que revise las integraciones y resuelva conflictos.
Trabaja sobre un repositorio compartido cuando la plataforma lo permita.
No sobrescribas código funcional sin revisar primero sus dependencias y pruebas.
Ejecuta pruebas reales siempre que el entorno lo permita.
No declares que una función está implementada si solamente existe su interfaz visual.
No inventes resultados de compilación, pruebas, despliegues o publicaciones.
Documenta cualquier limitación del entorno de ejecución.
Si falta información no crítica, toma una decisión razonable, documenta el supuesto y continúa.
Si falta una decisión que afecta a la arquitectura, plantea alternativas y recomienda una antes de implementar.
Prioriza una aplicación pequeña, coherente y completamente funcional frente a una aplicación grande con funciones simuladas.
0.2. Orden de prioridades

En caso de conflicto entre objetivos, utiliza este orden:

Corrección de los datos y cálculos.
Seguridad y privacidad.
Experiencia de usuario.
Fiabilidad y persistencia.
Mantenibilidad.
Rendimiento.
Monetización.
Funcionalidades adicionales.
0.3. Entregables obligatorios

Al finalizar el trabajo deben existir:

Aplicación móvil funcional para iOS y Android.
Código fuente organizado.
Arquitectura documentada.
Base de datos y migraciones.
Sistema de persistencia.
Pruebas unitarias, de integración y de interfaz.
Configuración de compilación.
Configuración de entornos.
Documentación de instalación y ejecución.
Guía de despliegue.
Política de privacidad propuesta.
Documentación del modelo de negocio.
Lista de funciones implementadas, pendientes y bloqueadas.
Informe final con resultados reales de las pruebas.
1. VISIÓN DEL PRODUCTO
1.1. Qué es SUMA

SUMA es una aplicación móvil que permite registrar el dinero que una persona decide no gastar en situaciones cotidianas.

Ejemplos:

No comprar un café de 2,50 €.
Preparar comida en casa en lugar de pedirla.
Evitar una compra impulsiva.
Caminar en lugar de pagar un transporte que no era necesario.
Elegir una actividad gratuita en lugar de una alternativa de pago.

Cada decisión se registra y se incorpora a un contador acumulado.

El usuario puede visualizar sus decisiones por día, semana, mes, año y categoría.

La experiencia debe ser positiva, sencilla, visual y motivadora.

1.2. Qué NO es SUMA

SUMA no debe presentarse inicialmente como:

Una aplicación bancaria.
Un gestor de gastos tradicionales.
Una cartera de inversión.
Una cuenta de ahorro real.
Una aplicación que mueve dinero.
Una herramienta que conoce automáticamente las compras del usuario.

El dinero registrado representa una estimación declarada por el usuario del gasto que ha evitado.

No significa necesariamente que ese dinero se haya transferido a una cuenta de ahorro ni que su patrimonio haya aumentado en esa cantidad.

Esta distinción debe mantenerse en la interfaz, las estadísticas, los mensajes comerciales y la documentación.

1.3. Propuesta de valor

SUMA convierte las pequeñas decisiones de no gastar en un progreso visible.

Mensaje principal:

Cada decisión cuenta.

Mensajes secundarios posibles:

Mira cómo crece tu dinero no gastado.
Pequeñas decisiones, grandes resultados.
Hoy también has sumado.
Tu progreso empieza con una decisión.
No se trata de gastar menos en todo, sino de elegir mejor.
1.4. Problema que resuelve

Muchas aplicaciones financieras muestran principalmente lo que una persona ha gastado.

SUMA pone el foco en una conducta diferente: las ocasiones en las que una persona decide conscientemente no realizar un gasto.

La aplicación pretende ayudar a:

Reconocer decisiones positivas.
Mantener un hábito de ahorro consciente.
Descubrir patrones de consumo evitado.
Establecer objetivos personales.
Visualizar el progreso acumulado.
Reflexionar sobre las decisiones cotidianas.

No debe fomentar privaciones perjudiciales, culpabilidad por gastar ni comportamientos financieros compulsivos.

1.5. Público objetivo inicial

Usuarios adultos que:

Quieren mejorar sus hábitos financieros.
Compran café, comida, ropa u otros productos de manera habitual.
Desean visualizar su progreso sin gestionar un presupuesto complejo.
Prefieren una interfaz rápida y sencilla.
Utilizan un teléfono móvil como herramienta principal.

El producto debe poder utilizarse sin conocimientos financieros.

1.6. Posicionamiento

SUMA debe situarse entre:

Un contador personal.
Una aplicación de seguimiento de hábitos.
Una herramienta de ahorro consciente.
Una aplicación de estadísticas financieras ligeras.

No debe competir inicialmente con aplicaciones bancarias complejas.

2. PRINCIPIOS FUNDAMENTALES DE PRODUCTO

Todo agente debe respetar estos principios.

2.1. Rapidez

Registrar una decisión habitual debe requerir pocos pasos.

Objetivo de diseño: permitir completar un registro sencillo en menos de 10 segundos una vez que el usuario conoce la aplicación.

2.2. Claridad

El usuario debe comprender inmediatamente:

Cuánto ha registrado hoy.
Cuánto lleva acumulado.
Cómo ha evolucionado.
De dónde proceden sus registros.
2.3. Honestidad

No confundir dinero no gastado registrado con ahorro real disponible.

No inventar registros, estadísticas ni predicciones.

2.4. Motivación saludable

Celebrar la constancia sin penalizar los días en los que no se registra nada.

Evitar mensajes culpabilizadores y rachas que generen ansiedad.

2.5. Privacidad

Recoger únicamente la información necesaria.

La aplicación no necesita acceder a las cuentas bancarias del usuario.

2.6. Control del usuario

El usuario debe poder editar, eliminar y exportar sus registros.

2.7. Simplicidad técnica

No introducir servicios, bibliotecas o infraestructura si no aportan una ventaja real al MVP.

3. ALCANCE DEL MVP

El MVP es la primera versión funcional que debe construirse y probarse.

3.1. Funciones obligatorias
Onboarding inicial.
Creación de cuenta opcional o modo local, según la decisión arquitectónica.
Pantalla principal.
Registro de dinero no gastado.
Categorías.
Historial.
Edición y eliminación de registros.
Estadísticas por periodos.
Gráficas.
Objetivos.
Persistencia real.
Configuración personal básica.
Gestión de moneda y fechas.
Estados vacíos, errores y carga.
Accesibilidad básica.
Pruebas automatizadas.
Compilación para iOS y Android.
3.2. Funciones que no deben bloquear el MVP

Dejar fuera de la primera versión salvo que exista una razón técnica justificada:

Conexión bancaria.
Transferencias de dinero.
Funciones sociales.
Clasificaciones públicas.
Retos entre amigos.
Inteligencia artificial integrada.
Recomendaciones financieras personalizadas.
Reconocimiento automático de compras.
Integración con servicios bancarios.
Sistemas de inversión.
Publicidad.
Sincronización compleja entre dispositivos, si impide lanzar una primera versión local fiable.

La arquitectura debe permitir añadir algunas de estas funciones posteriormente, sin desarrollarlas ahora.

4. EXPERIENCIA DE USUARIO Y NAVEGACIÓN
4.1. Navegación principal

Utilizar una barra de navegación inferior con cuatro destinos:

Inicio.
Añadir.
Historial.
Estadísticas.

La sección de objetivos puede estar integrada en Inicio y disponer de una pantalla propia accesible desde esa sección.

La configuración debe ser accesible desde el encabezado de Inicio.

La navegación debe ser consistente entre iOS y Android.

4.2. Pantalla Inicio

Objetivo: mostrar el progreso sin abrumar.

Elementos:

Logotipo y nombre SUMA.
Saludo opcional.
Total acumulado de dinero no gastado registrado.
Importe registrado durante el día actual.
Resumen de la semana.
Gráfica de evolución.
Últimos movimientos.
Objetivo activo.
Botón principal para registrar una decisión.

El total acumulado debe tener la mayor jerarquía visual.

No mostrar demasiadas tarjetas ni indicadores simultáneamente.

Ejemplo de contenido

SUMA

Tu dinero no gastado

326,40 €

Hoy: 8,70 €

Esta semana: 24,50 €

Botón: «Registrar una decisión»

Últimos movimientos:

Café que he preparado en casa: +2,50 €.
Comida que he llevado al trabajo: +8,00 €.

Las cantidades anteriores son ilustrativas.

4.3. Pantalla Añadir

Campos:

Importe.
Categoría.
Motivo opcional.
Fecha.
Nota opcional.

La fecha será hoy por defecto.

La interfaz debe ofrecer importes rápidos configurables o habituales, sin impedir introducir cantidades personalizadas.

Categorías iniciales:

Café.
Comida.
Compras.
Transporte.
Ocio.
Suscripciones.
Otros.

Permitir ampliar o personalizar las categorías en una versión posterior.

Reglas de validación
El importe debe ser mayor que cero.
No aceptar NaN ni infinito.
Limitar los decimales según la moneda.
Evitar entradas excesivamente largas.
Gestionar correctamente el separador decimal utilizado por el idioma.
Mostrar errores comprensibles.
No guardar dos veces por pulsaciones repetidas.
Confirmar visualmente que el registro se ha guardado.
Comportamiento después de guardar
Validar los datos.
Guardar el registro.
Actualizar el estado de la aplicación.
Recalcular los totales afectados.
Mostrar confirmación.
Volver a Inicio o permitir añadir otra decisión.

La navegación final debe validarse con usuarios.

4.4. Pantalla Historial

Mostrar todos los registros ordenados cronológicamente.

Cada registro debe incluir:

Categoría.
Descripción.
Importe.
Fecha.
Acciones disponibles.

Funciones:

Editar.
Eliminar.
Filtrar por categoría.
Filtrar por fechas.
Ordenar por fecha.
Mostrar estados vacíos.

Al eliminar un registro, recalcular las estadísticas desde la fuente de datos.

Si se añade una confirmación de borrado, debe permitir cancelar la operación.

4.5. Pantalla Estadísticas

Permitir seleccionar:

Día.
Semana.
Mes.
Año.
Periodo personalizado, si se incluye dentro del MVP.

Mostrar:

Total del periodo.
Gráfica temporal.
Comparación con el periodo anterior.
Distribución por categorías.
Número de decisiones registradas.
Promedio diario.
Día con mayor importe registrado.

No presentar una comparación si no existe suficiente información.

Cuando un periodo no contiene registros, mostrar cero y un estado vacío adecuado, sin errores ni gráficos engañosos.

4.6. Pantalla Objetivos

Cada objetivo debe incluir:

Nombre.
Cantidad objetivo.
Fecha objetivo opcional.
Progreso.
Estado.
Posibilidad de editarlo o eliminarlo.

Ejemplo:

«Viaje de verano»

Objetivo: 500 €

Dinero no gastado registrado: 180 €

Progreso: 36 %

Es importante explicar que el progreso se calcula a partir de los registros del usuario, no del saldo bancario.

El MVP puede limitarse a un objetivo activo. La arquitectura debe permitir varios en el futuro.

4.7. Configuración

Opciones iniciales:

Moneda.
Idioma.
Primer día de la semana.
Preferencias de notificaciones.
Exportación de datos, si se implementa en el MVP.
Política de privacidad.
Condiciones de uso.
Eliminación de cuenta, si existen cuentas.
Restablecimiento de datos locales, con confirmación.
4.8. Estados que deben diseñarse

Para cada pantalla:

Estado normal.
Estado vacío.
Estado de carga.
Estado de error.
Estado sin conexión, cuando sea relevante.
Estado de éxito.
Estado de datos incompletos.
Estado de permisos denegados, si corresponde.

No dejar pantallas en blanco cuando falle una petición o no existan registros.

5. IDENTIDAD VISUAL Y SISTEMA DE DISEÑO
5.1. Dirección artística

SUMA debe utilizar una estética:

Blanca.
Minimalista.
Luminosa.
Moderna.
Cercana.
Elegante.
Optimista.
Poco recargada.

Evitar la apariencia de una aplicación bancaria corporativa o de una hoja de cálculo.

5.2. Paleta propuesta

Colores iniciales, sujetos a validación visual:

Fondo principal: #FFFFFF.
Fondo secundario: #F6F8F6.
Verde principal: #2D7A4B.
Verde claro: #E8F5EB.
Texto principal: #1B2A20.
Texto secundario: #68756C.
Bordes: #E5EAE6.
Error: #B42318.
Advertencia: #946200.

Los colores deben definirse como tokens centralizados.

No repetir códigos de color arbitrariamente en los componentes.

5.3. Tipografía

Utilizar una tipografía de sistema o una familia legible como Inter, siempre que su incorporación y licencia estén justificadas.

Jerarquía:

Título principal.
Título de sección.
Importe destacado.
Texto normal.
Etiqueta.
Texto auxiliar.

Los importes deben ser fáciles de leer y mantener una alineación visual estable.

5.4. Componentes reutilizables

Crear una biblioteca de componentes que incluya:

Botón primario.
Botón secundario.
Campo de importe.
Campo de texto.
Selector de categoría.
Tarjeta de resumen.
Tarjeta de movimiento.
Tarjeta de objetivo.
Indicador de progreso.
Selector de periodo.
Gráfica.
Estado vacío.
Diálogo de confirmación.
Notificación de éxito.
Barra de navegación.
Indicador de carga.

Los componentes deben aceptar propiedades tipadas y evitar dependencias circulares.

5.5. Accesibilidad
Contraste suficiente.
Compatibilidad con lectores de pantalla.
Etiquetas accesibles.
Tamaños de texto escalables.
Áreas táctiles adecuadas.
No depender exclusivamente del color para comunicar información.
Respetar las preferencias de movimiento reducido.
Probar con tamaños de texto grandes.
Dar soporte al modo oscuro en una fase posterior, sin comprometer el diseño claro inicial.
5.6. Adaptación a dispositivos

La interfaz debe adaptarse a:

Teléfonos pequeños.
Teléfonos grandes.
Distintas densidades de pantalla.
Áreas seguras de iOS.
Barras de sistema de Android.
Teclados virtuales.
Cambios de orientación cuando corresponda.

Evitar dimensiones rígidas que provoquen desbordamientos.

6. ARQUITECTURA TECNOLÓGICA RECOMENDADA

La arquitectura inicial debe ser sencilla, modular y multiplataforma.

6.1. Cliente móvil

Tecnologías recomendadas:

React Native.
Expo.
TypeScript en modo estricto.
Expo Router para navegación.
React Hook Form para formularios.
Zod para validación.
TanStack Query si existe una capa de datos remota.
Zustand únicamente si se necesita estado global compartido.

No utilizar varias bibliotecas para resolver el mismo problema.

Motivo de la elección

React Native con Expo permite compartir una parte sustancial del código entre iOS y Android, acelerar el desarrollo y facilitar la creación de versiones de prueba.

TypeScript mejora la detección temprana de errores y hace más explícitos los contratos entre agentes.

6.2. Persistencia local

Recomendación:

SQLite mediante una biblioteca compatible con la versión de Expo elegida.
Capa de repositorios para acceder a los datos.
Migraciones de base de datos.
Transacciones para operaciones relacionadas.
Versionado del esquema.

No utilizar AsyncStorage como base de datos principal para todos los registros si el producto crece.

Puede utilizarse para preferencias sencillas que no requieran consultas relacionales.

6.3. Backend

Recomendación inicial: Supabase, utilizando PostgreSQL y sus servicios de autenticación cuando se necesite una cuenta de usuario.

Posibles funciones:

Autenticación.
Base de datos remota.
Row Level Security.
Sincronización.
Copias de seguridad según el plan contratado.
Funciones de servidor cuando sean necesarias.

El backend no debe ser obligatorio para registrar decisiones si se decide ofrecer un modo local.

6.4. Cuentas de usuario

Recomendación de producto:

Permitir comenzar sin registro, si la arquitectura lo permite de forma segura.

Cuando se añadan cuentas, ofrecer un flujo claro para sincronizar o migrar los datos locales.

No eliminar ni sobrescribir registros locales al iniciar sesión sin una política de conciliación explícita.

La migración debe detectar posibles duplicados y evitar pérdidas de datos.

6.5. Gestión de estado

Separar:

Estado temporal de interfaz.
Estado de formularios.
Datos persistidos.
Datos derivados.
Estado de autenticación.
Estado de sincronización.

Los totales y estadísticas no deben convertirse en fuentes independientes de verdad.

Deben calcularse desde los registros persistidos o desde agregaciones coherentes.

6.6. Gráficas

Elegir una biblioteca compatible con React Native y la versión de Expo.

Evaluar mantenimiento, accesibilidad, rendimiento y compatibilidad multiplataforma antes de instalarla.

Tipos de gráficas iniciales:

Barras para comparar días.
Línea para observar la evolución.
Barras horizontales para categorías.

No mostrar información excesiva en pantallas pequeñas.

6.7. Notificaciones

Para el MVP, las notificaciones deben ser opcionales.

Ejemplos:

«¿Has tomado alguna decisión que quieras registrar hoy?»
«Tu resumen semanal está disponible».

No enviar recordatorios en exceso.

Solicitar permisos únicamente cuando el usuario active esta función.

6.8. Suscripciones

Cuando llegue el momento de monetizar:

Evaluar RevenueCat para gestionar compras y suscripciones.
Utilizar los mecanismos de compra de Apple y Google que correspondan.
Validar el estado de las suscripciones de forma fiable.
Restaurar compras.
Gestionar cancelaciones, renovaciones y caducidad.
Diseñar un sistema de permisos o entitlements para las funciones premium.

No considerar una compra válida únicamente porque el cliente móvil diga que se ha realizado.

6.9. Herramientas de desarrollo

Propuesta:

Git y GitHub.
Expo.
TypeScript.
ESLint.
Prettier.
Vitest o Jest, según compatibilidad.
React Native Testing Library.
Maestro o Detox para pruebas de extremo a extremo, según el entorno.
GitHub Actions para CI.
EAS Build para compilaciones móviles, si se elige Expo Application Services.

Verificar las versiones compatibles antes de iniciar el proyecto.

No instalar versiones arbitrarias de dependencias ni utilizar APIs obsoletas por copiar ejemplos antiguos.

7. ORGANIZACIÓN DEL CÓDIGO

Propuesta de estructura:

suma/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── add.tsx
│   ├── history.tsx
│   ├── statistics.tsx
│   ├── goals.tsx
│   └── settings.tsx
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── charts/
│   │   └── feedback/
│   ├── features/
│   │   ├── entries/
│   │   ├── categories/
│   │   ├── statistics/
│   │   ├── goals/
│   │   ├── auth/
│   │   └── settings/
│   ├── domain/
│   │   ├── entities/
│   │   ├── services/
│   │   ├── calculations/
│   │   └── validation/
│   ├── data/
│   │   ├── local/
│   │   ├── remote/
│   │   ├── repositories/
│   │   └── migrations/
│   ├── hooks/
│   ├── navigation/
│   ├── theme/
│   ├── config/
│   ├── utils/
│   └── types/
├── assets/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── privacy.md
│   ├── deployment.md
│   └── decisions/
├── supabase/
│   ├── migrations/
│   └── functions/
├── .github/
│   └── workflows/
├── app.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── .env.example


Esta estructura es una propuesta, no una obligación inflexible.

El coordinador debe adaptarla a las versiones actuales de las herramientas elegidas, manteniendo separación entre interfaz, dominio y acceso a datos.

No crear carpetas vacías sin propósito.

8. MODELO DE DATOS

El modelo debe representar el dominio sin depender directamente de la interfaz.

8.1. Entidad Entry

Representa una decisión de dinero no gastado.

Campos propuestos:

id: identificador único.
user_id: identificador del usuario, opcional en modo local.
amount_minor: cantidad expresada en unidades menores de la moneda.
currency: código de moneda ISO 4217.
category_id: categoría asociada.
note: descripción opcional.
occurred_at: fecha y hora de la decisión.
created_at: fecha de creación del registro.
updated_at: fecha de última modificación.
deleted_at: opcional, si se utiliza borrado lógico.

Utilizar unidades menores enteras para evitar errores de precisión de coma flotante en importes monetarios.

Por ejemplo, 2,50 EUR se almacenan como 250 céntimos.

La representación y los decimales admitidos deben depender de la moneda.

8.2. Entidad Category

Campos:

id.
user_id, opcional para categorías globales.
name.
icon.
color.
is_default.
is_active.
created_at.

Categorías iniciales:

Café.
Comida.
Compras.
Transporte.
Ocio.
Suscripciones.
Otros.

Las categorías predeterminadas deben poder traducirse sin perder la identidad interna de sus registros.

8.3. Entidad Goal

Campos:

id.
user_id, cuando corresponda.
title.
target_amount_minor.
currency.
start_date.
target_date, opcional.
is_active.
created_at.
updated_at.

El progreso se calcula desde una regla de negocio definida.

Para el MVP, puede calcularse mediante la suma de los registros incluidos en el objetivo, sin afirmar que ese importe está guardado realmente.

Si en el futuro se permite asociar registros a distintos objetivos, habrá que definir cómo evitar contabilizar la misma decisión varias veces.

8.4. Entidad UserProfile

Campos:

id.
display_name, opcional.
preferred_currency.
locale.
week_starts_on.
onboarding_completed.
created_at.
updated_at.

No almacenar información personal innecesaria.

8.5. Entidad UserSettings

Puede integrarse en el perfil si la complejidad es reducida.

Campos posibles:

Preferencias de notificaciones.
Tema.
Configuración de accesibilidad específica, si procede.
Preferencias de resumen.

No almacenar secretos ni tokens sensibles en una tabla accesible desde el cliente.

8.6. Identificadores y fechas
Utilizar identificadores únicos estables.
En PostgreSQL, utilizar UUID cuando sea apropiado.
Guardar instantes en UTC en los sistemas remotos.
Conservar la semántica de la fecha local de la decisión.
Definir expresamente la zona horaria utilizada para calcular días y semanas.
No interpretar una fecha de un registro antiguo según una zona horaria arbitraria.

La implementación debe documentar cómo se resuelven los cambios de zona horaria y horario de verano.

8.7. Evitar redundancia

No almacenar totales diarios, mensuales y anuales como datos independientes si pueden derivarse de los registros.

Si el rendimiento exige agregaciones precalculadas en el futuro, definir mecanismos de actualización y reconciliación.

9. REGLAS DE NEGOCIO Y CÁLCULOS
9.1. Total acumulado

El total acumulado es la suma de los registros válidos del ámbito correspondiente.

En modo local, será el total de los registros de ese dispositivo o perfil local.

En modo autenticado, será el total de los registros pertenecientes al usuario autenticado.

Los registros eliminados o excluidos por una regla documentada no deben contarse.

9.2. Total diario

Sumar los importes cuya fecha de decisión pertenece al día local seleccionado, según la zona horaria configurada.

9.3. Total semanal

Definir el inicio de semana según las preferencias regionales o del usuario.

No asumir que todas las semanas comienzan el domingo o el lunes.

9.4. Total mensual

Agrupar por mes calendario en la zona horaria de referencia.

No calcular los meses dividiendo entre 30 días.

9.5. Total anual

Agrupar por año calendario, teniendo en cuenta la zona horaria de referencia.

9.6. Comparaciones

La comparación con el periodo anterior debe utilizar periodos equivalentes.

Ejemplo: comparar el mes actual hasta el día de hoy con el mismo tramo del mes anterior cuando esa sea la opción de producto elegida.

No comparar un mes completo con uno incompleto sin indicarlo.

9.7. Promedio diario

Documentar si el promedio se calcula:

Sobre todos los días del periodo.
Solo sobre los días con registros.

Si se muestran ambos, etiquetarlos claramente.

9.8. Cambios y eliminaciones

Cada modificación debe actualizar las estadísticas afectadas.

Evitar mantener un total en pantalla que no coincida con los registros visibles.

9.9. Monedas

La primera versión puede utilizar EUR como moneda predeterminada.

Debe definirse si se permite registrar importes en otras monedas.

No sumar cantidades de monedas diferentes sin conversión explícita.

Si se añade conversión, guardar la moneda original y documentar el tipo de cambio utilizado.

9.10. Validación monetaria
Utilizar aritmética entera en unidades menores.
Validar límites máximos razonables.
Rechazar valores no finitos.
Gestionar redondeos de forma explícita.
Evitar sumar cadenas de texto o números de coma flotante sin normalización.
10. PERSISTENCIA, SINCRONIZACIÓN Y COPIAS DE SEGURIDAD
10.1. Requisito principal

Los datos deben sobrevivir al cierre de la aplicación y al reinicio del dispositivo.

No utilizar únicamente estado en memoria para almacenar los registros.

10.2. Modo local

Si el usuario utiliza la aplicación sin cuenta:

Guardar registros en una base de datos local.
Implementar migraciones.
Permitir editar y eliminar.
Mantener consistencia entre los registros y sus estadísticas.
Explicar las limitaciones de recuperación si se pierde el dispositivo.
10.3. Modo autenticado

Si se incorpora Supabase:

Separar los datos por usuario.
Aplicar Row Level Security.
Verificar la identidad en el servidor.
Evitar confiar en el user_id enviado libremente por el cliente.
Definir políticas de acceso para lectura, escritura y eliminación.
Implementar migraciones reproducibles.
10.4. Sincronización futura

Si se permite trabajar sin conexión y sincronizar posteriormente:

Definir una estrategia de conflictos.
Mantener identificadores estables.
Utilizar operaciones idempotentes.
Evitar duplicados.
Definir qué ocurre si un registro se edita en dos dispositivos.
Gestionar eliminaciones.
Mostrar errores de sincronización.
No perder cambios locales cuando falla la red.

No implementar una sincronización compleja hasta que exista una necesidad real.

10.5. Copias de seguridad

Documentar:

Qué datos se respaldan.
Con qué frecuencia.
Cómo se recuperan.
Cuánto tiempo se conservan.
Qué ocurre al eliminar una cuenta.

Una base de datos remota no debe considerarse automáticamente una estrategia completa de copias de seguridad.

11. SEGURIDAD Y PRIVACIDAD
11.1. Principios
Privacidad desde el diseño.
Mínima recogida de datos.
Mínimos privilegios.
Separación de secretos y código.
Validación de entradas.
Dependencias mantenidas.
Gestión segura de errores.
11.2. Secretos

No incluir en el repositorio:

Contraseñas.
Claves privadas.
Tokens de acceso.
Credenciales de producción.
Secretos de proveedores.

Las variables públicas de configuración deben distinguirse de las credenciales privadas.

Las claves administrativas de Supabase nunca deben incorporarse a la aplicación móvil.

11.3. Acceso a datos
Aplicar autorización en el servidor.
Activar y probar las políticas RLS cuando se utilice Supabase.
Evitar confiar en identificadores enviados por el cliente.
Limitar el acceso de las funciones de servidor.
Comprobar que un usuario no puede leer o modificar datos ajenos.
11.4. Almacenamiento local

Evaluar qué datos requieren protección adicional.

No almacenar contraseñas en texto plano.

Si existen tokens de sesión, utilizar mecanismos de almacenamiento seguro compatibles con cada plataforma.

No registrar datos sensibles en logs de producción.

11.5. Analítica

Recoger únicamente eventos necesarios para entender el uso del producto.

Ejemplos:

onboarding_completed.
entry_created.
entry_deleted.
statistics_viewed.
goal_created.
paywall_viewed.
subscription_started.

No incluir en los eventos:

Notas privadas de los registros.
Descripciones personales.
Importes individuales cuando no sean necesarios.
Identificadores personales innecesarios.
11.6. Cumplimiento normativo

Antes del lanzamiento público, revisar:

RGPD.
LOPDGDD cuando corresponda.
Requisitos de privacidad de Apple y Google.
Obligaciones sobre compras y suscripciones.
Políticas de conservación y eliminación de datos.
Consentimiento y gestión de cookies o tecnologías equivalentes cuando sean aplicables.

No afirmar que SUMA cumple legalmente con una normativa hasta haber revisado la implementación y la documentación.

Preparar una política de privacidad real, adaptada a los servicios efectivamente utilizados.

12. MODELO DE NEGOCIO
12.1. Modelo recomendado

Freemium.

El usuario puede utilizar la función central gratuitamente y pagar por herramientas avanzadas.

12.2. Versión gratuita

Propuesta:

Registro de decisiones.
Categorías básicas.
Total acumulado.
Resumen diario, semanal y mensual.
Historial.
Una meta activa.
Gráficas esenciales.

No bloquear el registro de decisiones detrás de una suscripción.

No utilizar publicidad en la primera versión salvo que una validación de producto demuestre una ventaja clara.

12.3. SUMA Plus

Posibles funciones:

Estadísticas avanzadas.
Historial anual y tendencias.
Comparativas detalladas.
Objetivos múltiples.
Categorías personalizadas.
Widgets.
Exportación de informes.
Personalización.
Copia de seguridad y sincronización, si el coste de infraestructura lo justifica.
12.4. Precios iniciales a validar

Hipótesis comercial:

Mensual: 2,99 €.
Anual: 19,99 €.

Estos importes son puntos de partida para experimentar, no precios definitivos.

Validar:

Disposición real a pagar.
Costes de las tiendas.
Impuestos aplicables.
Costes de infraestructura.
Conversión a pago.
Retención.
Cancelaciones.
Ingresos netos por usuario.
12.5. Métricas de negocio
Usuarios activos diarios y mensuales.
Activación.
Porcentaje de usuarios que registran una primera decisión.
Retención D1, D7 y D30.
Registros por usuario activo.
Conversión a suscripción.
Cancelación.
Ingresos recurrentes.
Coste de adquisición.
Valor de vida del cliente.

No confundir el importe acumulado por los usuarios con los ingresos de la empresa.

12.6. Validación comercial

Antes de invertir mucho en adquisición de usuarios:

Entrevistar a usuarios potenciales.
Lanzar una beta pequeña.
Medir el uso real.
Identificar las funciones que generan recurrencia.
Probar una pantalla de precios.
Preguntar por la disposición a pagar.
Experimentar con precios cuando exista suficiente tráfico.

No añadir una suscripción únicamente porque otras aplicaciones la utilizan.

13. ARQUITECTURA DE AGENTES ESPECIALIZADOS

El coordinador debe organizar el trabajo como un equipo con contratos compartidos.

Agente 0 — Coordinador y arquitecto principal

Responsabilidades:

Mantener la visión global.
Dividir el trabajo.
Resolver conflictos.
Aprobar decisiones técnicas.
Mantener la coherencia del dominio.
Integrar los módulos.
Ejecutar las pruebas globales.
Controlar el alcance.
Documentar riesgos y decisiones.

Entregables:

Plan de ejecución.
Mapa de dependencias.
Registro de decisiones arquitectónicas.
Contratos entre módulos.
Informes de integración.
Informe final.

No debe permitir que cada agente cree su propia arquitectura independiente.

Agente 1 — Product Manager

Responsabilidades:

Definir historias de usuario.
Priorizar funcionalidades.
Delimitar el MVP.
Definir criterios de aceptación.
Resolver ambigüedades funcionales.
Definir métricas de éxito.

Entregables:

PRD.
Historias de usuario.
Backlog priorizado.
Criterios de aceptación.
Mapa de funcionalidades futuras.
Agente 2 — Investigación de usuarios y negocio

Responsabilidades:

Definir segmentos.
Preparar entrevistas.
Identificar necesidades.
Analizar alternativas de mercado.
Formular hipótesis comerciales.
Proponer experimentos de validación.

Entregables:

Hipótesis de usuario.
Guion de entrevistas.
Plan de validación.
Modelo freemium.
Métricas de negocio.

No inventar resultados de entrevistas o estudios.

Agente 3 — UI/UX Designer

Responsabilidades:

Diseñar flujos.
Definir jerarquía visual.
Diseñar pantallas y estados.
Preparar componentes.
Diseñar accesibilidad.
Comprobar adaptación a móviles.
Proponer microinteracciones.

Entregables:

Mapa de navegación.
Wireframes.
Sistema visual.
Especificación de componentes.
Especificación de estados.
Prototipo cuando la herramienta lo permita.

Debe respetar la estética blanca, minimalista y luminosa.

Agente 4 — Arquitecto de software

Responsabilidades:

Definir la estructura.
Establecer límites entre capas.
Diseñar los contratos.
Elegir patrones adecuados.
Definir la estrategia de persistencia.
Revisar dependencias.

Entregables:

Diagrama de arquitectura.
Estructura de carpetas.
Contratos TypeScript.
ADRs.
Plan de migraciones.
Agente 5 — Ingeniero de frontend móvil

Responsabilidades:

Implementar navegación.
Construir componentes.
Implementar formularios.
Integrar estados.
Adaptar iOS y Android.
Manejar errores y carga.
Mantener accesibilidad.

Entregables:

Aplicación móvil.
Componentes reutilizables.
Pruebas de componentes.
Informe de compatibilidad.
Agente 6 — Ingeniero de dominio y cálculos

Responsabilidades:

Implementar entidades.
Validar importes.
Calcular periodos.
Resolver zonas horarias.
Calcular estadísticas.
Gestionar objetivos.
Evitar inconsistencias monetarias.

Entregables:

Modelos.
Servicios de dominio.
Funciones de cálculo.
Pruebas unitarias.
Documentación de reglas.
Agente 7 — Backend y base de datos

Responsabilidades:

Crear el esquema.
Preparar migraciones.
Implementar acceso remoto.
Configurar autenticación.
Aplicar RLS.
Definir copias de seguridad.
Preparar sincronización futura.

Entregables:

Migraciones.
Políticas de acceso.
Repositorios.
Configuración de entornos.
Pruebas de integración.

Si el MVP es exclusivamente local, debe preparar una arquitectura compatible con esa decisión sin desarrollar innecesariamente un backend completo.

Agente 8 — Seguridad y privacidad

Responsabilidades:

Revisar secretos.
Revisar permisos.
Auditar autorización.
Analizar dependencias.
Revisar datos recogidos.
Detectar posibles filtraciones.
Revisar borrado y exportación.

Entregables:

Modelo de amenazas.
Lista de riesgos.
Pruebas de autorización.
Recomendaciones de mitigación.
Checklist previo al lanzamiento.
Agente 9 — Analítica y visualización

Responsabilidades:

Definir métricas.
Implementar gráficas.
Verificar cálculos.
Definir eventos de producto.
Evitar recopilación innecesaria de datos.

Entregables:

Especificación de eventos.
Componentes gráficos.
Pruebas de agregación.
Diccionario de métricas.
Agente 10 — Monetización

Responsabilidades:

Diseñar planes.
Proponer funciones premium.
Evaluar precios.
Definir entitlements.
Diseñar flujos de compra y restauración.

Entregables:

Matriz de funcionalidades.
Hipótesis de precios.
Especificación de suscripciones.
Plan de validación comercial.

No implementar pagos hasta que el núcleo gratuito funcione correctamente.

Agente 11 — QA y testing

Responsabilidades:

Diseñar casos de prueba.
Ejecutar pruebas.
Revisar errores.
Probar dispositivos y tamaños.
Verificar persistencia.
Validar accesibilidad.
Comprobar regresiones.

Entregables:

Plan de pruebas.
Pruebas automatizadas.
Informe de errores.
Informe de regresión.
Recomendación de lanzamiento.
Agente 12 — DevOps y publicación

Responsabilidades:

Configurar CI.
Gestionar entornos.
Preparar compilaciones.
Documentar certificados.
Preparar versiones de prueba.
Configurar publicación.

Entregables:

Pipeline CI.
Configuración de compilación.
Guía de release.
Checklist de App Store y Google Play.
Procedimiento de rollback cuando corresponda.
Agente 13 — Documentación

Responsabilidades:

Mantener el README.
Documentar instalación.
Documentar variables de entorno.
Explicar la arquitectura.
Registrar cambios.
Documentar operaciones habituales.

Entregables:

README.
Guía de desarrollo.
Guía de pruebas.
Guía de despliegue.
Guía de resolución de problemas.
14. COORDINACIÓN ENTRE AGENTES
14.1. Fuente única de verdad

Antes de desarrollar, el coordinador debe aprobar:

Modelo de datos.
Convenciones de nombres.
Rutas.
Contratos TypeScript.
Estrategia de persistencia.
Reglas de cálculo.
Sistema visual.
Estructura del proyecto.

Todos los agentes deben utilizar estos contratos.

14.2. Protocolo de entrega

Cada agente debe entregar:

Objetivo.
Archivos creados o modificados.
Decisiones técnicas.
Dependencias añadidas.
Pruebas ejecutadas.
Resultados reales.
Limitaciones.
Riesgos.
Instrucciones de integración.
14.3. Evitar conflictos de código
Asignar archivos o módulos concretos.
Evitar modificaciones simultáneas no coordinadas.
Revisar cambios antes de integrarlos.
Ejecutar pruebas tras cada integración.
Mantener contratos estables.
No permitir refactorizaciones masivas durante una fase de estabilización.
14.4. Trabajo paralelo

Pueden desarrollarse en paralelo:

Investigación de usuarios y definición de negocio.
Diseño visual y definición de componentes.
Diseño del dominio y pruebas de cálculo.
Preparación de CI y documentación inicial.

Deben coordinarse estrechamente:

Interfaz y navegación.
Repositorios y modelos de datos.
Backend y autenticación.
Estadísticas y reglas temporales.
Suscripciones y permisos premium.
14.5. Memoria compartida del proyecto

Crear una memoria persistente dentro del repositorio:

docs/
├── PROJECT_BRIEF.md
├── PRODUCT_REQUIREMENTS.md
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── API_CONTRACTS.md
├── DESIGN_SYSTEM.md
├── SECURITY.md
├── TEST_STRATEGY.md
├── DEPLOYMENT.md
├── AGENT_PROTOCOL.md
├── STATUS.md
├── DECISIONS.md
└── decisions/

Reglas de memoria
PROJECT_BRIEF.md: visión estable del producto.
PRODUCT_REQUIREMENTS.md: funcionalidades y criterios de aceptación.
ARCHITECTURE.md: decisiones arquitectónicas vigentes.
DATA_MODEL.md: entidades, campos y relaciones.
API_CONTRACTS.md: interfaces entre módulos.
DESIGN_SYSTEM.md: colores, tipografía y componentes.
SECURITY.md: amenazas, permisos y medidas de protección.
TEST_STRATEGY.md: estrategia de calidad.
DEPLOYMENT.md: compilación y publicación.
AGENT_PROTOCOL.md: reglas para los agentes.
STATUS.md: estado actual, tareas completadas y pendientes.
DECISIONS.md: índice de decisiones.
decisions/: documentos de decisiones arquitectónicas individuales.

Los agentes deben leer los documentos pertinentes antes de empezar una tarea.

Cuando se modifique una decisión relevante, actualizar la memoria en el mismo cambio de código o tarea.

No utilizar el historial de conversación como única fuente de verdad.

No guardar secretos, credenciales ni datos personales reales en estos documentos.

15. PLAN DE DESARROLLO POR FASES
Fase 0 — Preparación

Objetivo: reducir incertidumbre.

Tareas:

Revisar esta especificación.
Resolver decisiones arquitectónicas.
Confirmar herramientas disponibles.
Definir el MVP.
Crear el repositorio.
Preparar la memoria del proyecto.
Aprobar el modelo de datos.

Criterio de salida:

Los agentes pueden trabajar sin contradicciones fundamentales.

Fase 1 — Diseño y esqueleto técnico

Tareas:

Crear el proyecto Expo.
Configurar TypeScript.
Configurar navegación.
Definir tokens visuales.
Crear componentes básicos.
Crear pruebas iniciales.
Preparar integración continua.

Criterio de salida:

La aplicación arranca y navega correctamente en los entornos disponibles.

Fase 2 — Dominio y persistencia

Tareas:

Implementar entidades.
Implementar SQLite.
Crear migraciones.
Implementar repositorios.
Implementar validaciones.
Implementar operaciones CRUD.
Escribir pruebas unitarias.

Criterio de salida:

Los registros permanecen guardados y los cálculos son correctos.

Fase 3 — Experiencia principal

Tareas:

Construir Inicio.
Construir Añadir.
Construir Historial.
Construir Estadísticas.
Implementar Objetivos.
Integrar navegación.
Añadir estados vacíos y errores.

Criterio de salida:

El flujo principal funciona de principio a fin.

Fase 4 — Calidad y robustez

Tareas:

Probar errores de entrada.
Probar registros duplicados.
Probar edición y borrado.
Probar periodos y zonas horarias.
Probar cierre y reinicio.
Revisar accesibilidad.
Revisar rendimiento.
Corregir regresiones.

Criterio de salida:

Se cumplen los criterios de aceptación del MVP.

Fase 5 — Beta privada

Tareas:

Preparar compilaciones de prueba.
Incorporar usuarios voluntarios.
Recoger feedback.
Medir activación y recurrencia.
Detectar problemas de comprensión.
Corregir errores prioritarios.

Criterio de salida:

Existe evidencia suficiente para decidir qué mejorar antes del lanzamiento.

Fase 6 — Monetización

Tareas posteriores:

Definir funciones premium.
Implementar compras.
Implementar restauración.
Validar derechos premium.
Probar cancelaciones.
Preparar términos y condiciones.
Revisar políticas de las tiendas.

Criterio de salida:

El sistema de suscripciones funciona correctamente en entornos de prueba.

Fase 7 — Lanzamiento

Tareas:

Preparar iconos.
Preparar capturas.
Preparar fichas de las tiendas.
Configurar privacidad.
Preparar soporte.
Verificar certificados.
Compilar versiones de producción.
Ejecutar pruebas finales.
Publicar mediante los procedimientos oficiales.

La publicación requiere las cuentas, credenciales y aprobaciones correspondientes. No se debe afirmar que la aplicación está publicada hasta que las tiendas lo confirmen.

16. PLAN DE PRUEBAS
16.1. Pruebas unitarias

Cubrir:

Validación de importes.
Sumas.
Redondeos.
Totales diarios.
Totales semanales.
Totales mensuales.
Totales anuales.
Comparaciones de periodos.
Objetivos.
Cambios de categoría.
Eliminación de registros.
16.2. Pruebas de integración

Cubrir:

Guardar un registro.
Leerlo posteriormente.
Editarlo.
Eliminarlo.
Actualizar las estadísticas.
Reiniciar la aplicación.
Migrar el esquema.
Gestionar errores de almacenamiento.
16.3. Pruebas de interfaz

Cubrir:

Navegación.
Validación.
Teclado.
Estados vacíos.
Errores.
Confirmaciones.
Accesibilidad.
Adaptación a pantallas.
16.4. Pruebas de extremo a extremo

Escenario principal:

Abrir SUMA.
Acceder a Añadir.
Registrar 2,50 € en Café.
Guardar.
Comprobar el incremento del total.
Comprobar el registro en Historial.
Abrir Estadísticas.
Verificar el total de la categoría.
Cerrar y volver a abrir la app.
Confirmar que el registro sigue existiendo.
Eliminar el registro.
Comprobar que los totales se actualizan.
16.5. Casos límite
Importe cero.
Importe negativo.
Valor extremadamente grande.
Separador decimal incorrecto.
Pulsaciones repetidas.
Fecha futura.
Cambio de zona horaria.
Cambio de horario de verano.
Mes con diferente número de días.
Año bisiesto.
Base de datos vacía.
Error de almacenamiento.
Falta de espacio.
Migración fallida.
Pérdida de conexión.
Usuario sin sesión.
Usuario que intenta acceder a datos ajenos.
16.6. Criterios de calidad
No existen errores bloqueantes conocidos.
Los cálculos monetarios pasan las pruebas.
Los registros persisten.
Los datos se mantienen coherentes después de editar y borrar.
No se puede acceder a datos de otros usuarios.
La interfaz se adapta a los dispositivos objetivo.
Los flujos principales son accesibles.
La compilación se verifica en los entornos disponibles.

No exigir un porcentaje de cobertura arbitrario como sustituto de pruebas de calidad. Priorizar la cobertura de los flujos críticos.

17. CI/CD Y DESPLIEGUE
17.1. Integración continua

Configurar un pipeline que ejecute:

Instalación reproducible de dependencias.
Comprobación de formato.
Linter.
TypeScript.
Pruebas unitarias.
Pruebas de integración que puedan ejecutarse en CI.
Comprobaciones de seguridad de dependencias.
Verificación de compilación cuando sea viable.

Las compilaciones móviles completas pueden ejecutarse en una fase específica del pipeline.

17.2. Entornos

Separar:

Desarrollo.
Pruebas.
Producción.

No utilizar datos reales de producción para pruebas automáticas.

17.3. Configuración

Crear .env.example con los nombres de las variables necesarias, pero sin secretos reales.

Validar las variables de entorno al iniciar.

Fallar con mensajes comprensibles si falta una variable obligatoria.

17.4. Publicación

Documentar:

Identificadores de aplicación.
Certificados.
Perfiles de firma.
Versionado.
Número de compilación.
Capturas.
Iconos.
Permisos.
Información de privacidad.
Proceso de revisión.
Procedimiento de actualización.

No guardar credenciales de publicación en el repositorio.

18. FUNCIONES FUTURAS Y POSIBLES MEJORAS

Estas ideas deben evaluarse según el uso real, no añadirse todas al MVP.

18.1. Widgets

Mostrar el total acumulado en la pantalla de inicio del móvil.

Ventaja: reforzar el hábito sin abrir la aplicación.

18.2. Registro rápido

Permitir crear registros desde accesos directos.

Ejemplo: un botón para registrar un café no comprado con un importe habitual.

18.3. Plantillas

Permitir guardar decisiones frecuentes:

Café de casa.
Comida preparada.
Compra evitada.
Transporte alternativo.
18.4. Resumen semanal

Generar un informe visual con:

Total de la semana.
Categoría principal.
Día más activo.
Comparación con la semana anterior.
Logro destacado.
18.5. Recordatorios inteligentes

Permitir que el usuario configure un recordatorio opcional.

No inferir hábitos personales sin consentimiento.

18.6. Exportación

Exportar datos en CSV o JSON.

El usuario debe poder acceder a su información de forma sencilla.

18.7. Sincronización

Permitir utilizar SUMA en varios dispositivos.

Debe implementarse con control de acceso y gestión de conflictos.

18.8. Objetivos múltiples

Permitir crear varios objetivos y decidir qué registros contribuyen a cada uno.

Evitar duplicidades en los cálculos.

18.9. Gamificación

Posibles elementos:

Hitos.
Insignias.
Rachas flexibles.
Resúmenes de logros.
Celebraciones discretas.

No penalizar los días sin actividad.

18.10. Categorías personalizadas

Permitir que cada usuario defina nombres, iconos y colores.

18.11. Temas

Añadir un modo oscuro si los usuarios lo solicitan.

18.12. Inteligencia artificial

Posibles usos futuros:

Resumir patrones de comportamiento.
Sugerir categorías.
Ayudar a describir decisiones.
Generar resúmenes personalizados.

No es necesaria para el MVP.

No enviar notas privadas a servicios externos sin una justificación clara, transparencia y las medidas de protección adecuadas.

18.13. Compartir logros

Permitir generar imágenes de resumen que el usuario decida compartir.

No compartir datos personales automáticamente.

18.14. Internacionalización

Preparar el sistema para:

Español.
Inglés.
Otras lenguas futuras.
Formatos monetarios regionales.
Diferentes inicios de semana.
Formatos de fecha.
19. RIESGOS DEL PRODUCTO Y CÓMO MITIGARLOS
Riesgo 1: el usuario deja de registrar decisiones

Mitigación:

Registro rápido.
Importes habituales.
Recordatorios opcionales.
Resúmenes atractivos.
Evitar formularios largos.
Riesgo 2: el contador se percibe como dinero ficticio

Mitigación:

Explicar qué representa.
Usar el término «dinero no gastado registrado».
No prometer rentabilidad.
No afirmar que el dinero está guardado.
Mantener la distinción en las comunicaciones comerciales.
Riesgo 3: el producto parece demasiado simple para pagar

Mitigación:

Validar qué estadísticas aportan valor.
Probar objetivos avanzados.
Medir la retención antes de definir la oferta premium.
No añadir funciones sin comprobar su utilidad.
Riesgo 4: errores en los cálculos

Mitigación:

Unidades monetarias enteras.
Funciones de dominio centralizadas.
Pruebas de límites.
Una única fuente de verdad.
Recalcular tras cambios.
Riesgo 5: exceso de funcionalidades

Mitigación:

Congelar el alcance del MVP.
Priorizar por valor.
Mantener una lista de ideas futuras.
No incorporar funciones nuevas sin evaluar su impacto.
Riesgo 6: pérdida de datos

Mitigación:

Persistencia real.
Migraciones.
Copias de seguridad cuando corresponda.
Pruebas de reinicio.
Exportación.
Estrategia de recuperación.
Riesgo 7: complejidad innecesaria

Mitigación:

Arquitectura modular, no distribuida por defecto.
Backend solo cuando sea necesario.
Evitar microservicios.
Evitar bibliotecas redundantes.
Mantener un conjunto reducido de dependencias.
20. DECISIONES ARQUITECTÓNICAS QUE DEBEN QUEDAR DOCUMENTADAS

El coordinador debe crear registros de decisiones arquitectónicas, conocidos como ADR, para los asuntos relevantes.

Cada ADR debe contener:

Contexto.
Problema.
Alternativas.
Decisión.
Justificación.
Consecuencias.
Riesgos.
Fecha.

Decisiones iniciales:

React Native con Expo frente a Flutter o desarrollo nativo.
SQLite como persistencia local.
Modo local frente a cuenta obligatoria.
Supabase frente a un backend propio.
Unidades monetarias enteras.
Estrategia de fechas y zonas horarias.
Gestión de estado.
Biblioteca de gráficas.
Estrategia de sincronización.
Gestión de suscripciones.
Herramientas de testing.
Política de telemetría.
Política de borrado y exportación.

No es necesario generar un ADR para cada detalle menor de implementación.

21. CRITERIOS DE ACEPTACIÓN DEL MVP

La aplicación se considera funcional cuando se cumplen todos estos criterios:

Registro
Se puede introducir una cantidad válida.
Se puede elegir una categoría.
Se puede añadir una nota opcional.
El registro se guarda de forma persistente.
Los errores de validación se muestran correctamente.
Inicio
El total acumulado coincide con los registros.
El total diario es correcto.
Los últimos movimientos son coherentes.
Los cambios se reflejan sin reiniciar la app.
Historial
Los registros aparecen ordenados.
Se pueden editar.
Se pueden eliminar.
Los totales se actualizan después de cada operación.
Estadísticas
Los periodos utilizan límites temporales correctos.
Los importes coinciden con los registros.
Las categorías están correctamente agregadas.
Los periodos vacíos no provocan errores.
Objetivos
Se puede establecer una meta.
El progreso se calcula correctamente.
Los cambios de objetivo se reflejan en pantalla.
Calidad
La app arranca en iOS y Android en los entornos probados.
No hay errores bloqueantes conocidos.
Los formularios son utilizables.
La interfaz es adaptable.
Los datos sobreviven al cierre.
Las pruebas críticas pasan.
Seguridad
No hay secretos incrustados en el cliente.
Las políticas de acceso remoto se prueban si existe backend.
No se exponen registros de otros usuarios.
La recopilación de datos está documentada.
Documentación
Existe una guía de instalación.
Existe una guía de ejecución.
Existe una guía de pruebas.
Se documentan las limitaciones.
Se registra el estado real del proyecto.
22. FORMATO DEL INFORME FINAL DE LOS AGENTES

Al finalizar una fase, el coordinador debe entregar un informe con este formato:

Estado de la fase

Completada, parcial o bloqueada.

Funcionalidades implementadas

Lista de funciones realmente desarrolladas.

Archivos relevantes

Rutas exactas de los archivos creados o modificados.

Decisiones técnicas

Decisiones y motivos.

Pruebas
Comando ejecutado.
Resultado real.
Errores detectados.
Pruebas no ejecutadas y motivo.
Riesgos y problemas

Lista priorizada.

Tareas pendientes

Tareas concretas y su dependencia.

Siguiente fase

Objetivo y criterio de salida.

No marcar una tarea como completada solo porque exista un archivo o una pantalla.

23. PROMPT DE EJECUCIÓN PARA DEEPSEEK

Utiliza el documento completo como especificación maestra.

A partir de ahora, ejecuta el proyecto de forma coordinada.

Paso 1 — Inspección del entorno

Comprueba:

Qué herramientas tienes disponibles.
Si puedes crear y modificar archivos.
Si existe un repositorio.
Si puedes ejecutar comandos.
Si puedes instalar dependencias.
Si puedes ejecutar pruebas.
Si puedes compilar para iOS y Android.
Qué limitaciones existen.

No afirmes que puedes realizar operaciones que no estén disponibles en tu entorno.

Paso 2 — Plan de trabajo

Crea un plan con:

Fases.
Dependencias.
Agentes.
Entregables.
Criterios de aceptación.
Riesgos.

Prioriza el MVP.

Paso 3 — Decisiones técnicas

Confirma la arquitectura recomendada y documenta las decisiones que afecten al desarrollo.

Si el proyecto ya existe, inspecciona su estructura antes de reemplazar archivos.

No reconstruyas todo desde cero sin una razón documentada.

Paso 4 — Preparación de memoria

Crea los documentos de memoria del proyecto.

Registra las decisiones iniciales y el estado de cada tarea.

Paso 5 — Implementación

Construye el MVP funcional en el siguiente orden:

Esqueleto técnico.
Modelo de dominio.
Persistencia.
Registro de decisiones.
Inicio.
Historial.
Estadísticas.
Objetivos.
Pruebas.
Seguridad.
Compilación y documentación.
Paso 6 — Coordinación de agentes

Si existe un sistema real de agentes, delega los módulos en agentes especializados.

Si no existe, simula los roles mediante fases de trabajo diferenciadas, sin afirmar que se han ejecutado agentes independientes.

Todos deben utilizar los mismos contratos.

Paso 7 — Verificación

Ejecuta las pruebas disponibles.

Corrige los errores antes de avanzar a la siguiente fase.

No sustituyas las pruebas por una revisión visual del código.

Paso 8 — Entrega

Entrega:

Código fuente.
Estructura del proyecto.
Instrucciones para ejecutar.
Pruebas.
Informe de resultados.
Limitaciones conocidas.
Próximas tareas.

Si el entorno permite generar un repositorio, crea los archivos reales en él.

Si permite compilar la aplicación, genera los artefactos de compilación disponibles.

Si no permite alguna operación, explica exactamente qué falta para realizarla.

Regla final

No te limites a describir cómo construir SUMA. Construye la versión funcional más completa que permita el entorno, comprueba su funcionamiento y documenta con honestidad qué se ha terminado y qué no.

24. RECOMENDACIÓN FINAL DEL FUNDADOR

SUMA debe empezar siendo extraordinariamente buena en una sola cosa: convertir una decisión cotidiana de no gastar en un registro sencillo y en una sensación visible de progreso.

La prioridad no es añadir inteligencia artificial, funciones sociales, sistemas complejos de suscripción o integraciones bancarias.

La prioridad es comprobar que las personas quieren volver a utilizarla.

La estrategia recomendada es:

Construir un MVP fiable.
Probarlo con usuarios reales.
Medir la recurrencia.
Mejorar el registro y las estadísticas.
Validar la disposición a pagar.
Introducir funciones premium.
Escalar únicamente cuando existan señales de demanda.

SUMA no debe convertirse en otra aplicación financiera complicada. Debe ser el lugar al que vuelves para descubrir cuánto has conseguido no gastar.

Fin del documento maestro.