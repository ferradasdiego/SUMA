# SUMA — Probar el proyecto en local

| Campo | Valor |
|---|---|
| Fecha | 2026-10-23 |
| Estado | Verificado: Metro arranca y sirve el bundle |
| Requisitos base | Node.js 24+, pnpm 10+ |

Este documento explica las formas de ejecutar y probar SUMA en un Mac, de la más rápida a la más completa.

---

## 0. Resumen de opciones

| Opción | Necesitas | Verifica |
|---|---|---|
| A. Pruebas automatizadas | Node + pnpm | Dominio, persistencia, componentes |
| B. Expo Go en tu teléfono | iPhone/Android + Expo Go | App completa en un dispositivo real |
| C. Simulador iOS | Xcode + licencia aceptada | App en iOS sin teléfono |
| D. Emulador Android | JDK + Android SDK | App en Android sin teléfono |
| E. EAS Build (nube) | Cuenta Expo (+ Apple para iOS) | Build instalable sin toolchain local |
| F. PWA servida desde el Mac | Build web + HTTPS | App instalable en el móvil, con datos locales |

La opción B es la más rápida para probar la app de verdad si tienes un teléfono a mano.

---

## 1. Preparación

```bash
cd /Users/diego/Desktop/dev/SUMA
pnpm install
```

Comprueba que todo está sano:

```bash
pnpm typecheck
pnpm lint
pnpm exec jest --runInBand
pnpm exec expo-doctor
```

---

## 2. Opción A — Pruebas automatizadas (sin dispositivo)

```bash
pnpm exec jest --runInBand          # 25 suites, 136 pruebas
pnpm test:integration               # persistencia con SQLite real (sql.js)
```

Cubren dinero y redondeos, fechas y cambios de hora, periodos y comparaciones, migraciones, CRUD, restricciones, reapertura de la base, exportación JSON y componentes.

También puedes comprobar que la app empaqueta:

```bash
pnpm exec expo export --platform ios --platform android
```

**Limitación**: estas pruebas no sustituyen a ejecutar la app; no validan gestos, teclado, accesibilidad real ni la hoja de compartir.

---

## 3. Opción B — Expo Go en un teléfono (recomendada)

1. Instala **Expo Go** desde App Store o Google Play.
2. Conecta el teléfono y el Mac a la misma red Wi-Fi.
3. Arranca el servidor:

   ```bash
   pnpm start
   ```

4. Escanea el código QR:
   - iPhone: app Cámara.
   - Android: Expo Go → "Scan QR code".
5. La primera vez, Expo Go descarga el bundle y abre SUMA.

Si la red local bloquea la conexión (Wi-Fi de invitados, VPN, firewall):

```bash
pnpm start --tunnel
```

**Módulos nativos**: SUMA usa `expo-sqlite`, `expo-crypto`, `expo-file-system`, `expo-sharing` y `react-native-svg`, todos incluidos en Expo Go. No hace falta compilar.

**Expo Go y SDK**: Expo Go solo admite la versión de SDK que trae instalada (actualmente SDK 58, la del proyecto). Si tu Expo Go es más antiguo, actualízalo o usa la opción C/E.

### Datos en Expo Go

- La base SQLite y las preferencias viven dentro del sandbox de Expo Go para este proyecto.
- Cerrar y reabrir la app **no** borra los datos (así se prueba la persistencia).
- Desinstalar Expo Go o usar "Restablecer datos locales" en Ajustes sí los borra.

---

## 4. Opción C — Simulador iOS

Requisitos: Xcode instalado (ya está, 26.6) y licencia aceptada.

```bash
sudo xcodebuild -license accept
```

Si no hay runtime de simulador instalado:

```bash
xcodebuild -downloadPlatform iOS
```

Abre el simulador y arranca:

```bash
open -a Simulator
pnpm ios
```

Expo CLI instalará Expo Go en el simulador y abrirá SUMA. **No necesitas CocoaPods** para este camino.

Si más adelante quieres un *development build* nativo:

```bash
brew install cocoapods
npx expo run:ios
```

---

## 5. Opción D — Emulador Android

Requisitos: JDK 17+ y Android SDK.

```bash
brew install --cask temurin@17
# Instala Android Studio y, desde SDK Manager, un Android SDK + emulador
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools"
```

Crea un dispositivo virtual en Android Studio (Device Manager) y ejecuta:

```bash
pnpm android
```

O con un teléfono Android por USB con depuración activada y Expo Go.

---

## 6. Opción E — Build en la nube con EAS

No requiere Xcode ni Android SDK local. Necesita cuenta gratuita de Expo y, para instalar en un iPhone, cuenta de Apple.

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest build --platform android --profile preview
```

- Android: descarga e instala el APK.
- iOS: con cuenta de Apple, distribución interna/TestFlight.

El perfil `preview` ya está definido en `eas.json`.

---

## 7. Comprobación del servidor (evidencia)

Ejecutado el 2026-10-23 sobre este repositorio:

```bash
node node_modules/expo/bin/cli start --port 8083 --offline
```

Resultado:

- `GET /status` → `packager-status:running`
- Manifiesto con `runtimeVersion: exposdk:58.0.0`
- Bundle de desarrollo iOS → **HTTP 200**, 11,87 MB

El aviso `Unable to run simctl` aparece solo porque la licencia de Xcode no está aceptada; no impide usar Expo Go en un teléfono.

---

## 8. Checklist manual de prueba

Hazlo en este orden; cada paso tiene un resultado esperado.

### Onboarding

1. Abre SUMA por primera vez.
2. Debe aparecer la bienvenida, no Inicio.
2.1. Prueba el selector de idioma: English → Galego → Català → Português. La bienvenida, la moneda y el botón deben cambiar de idioma, y la bandera elegida debe quedar marcada.
2.2. Vuelve a Español, elige EUR y "Lunes" → Empezar.
3. Inicio debe mostrar 0,00 €, Hoy 0,00 € y Esta semana 0,00 €.
4. Ajustes → Idioma: cambia a English. Toda la interfaz, incluida la barra inferior, debe pasar a inglés; vuelve a Español.

### Registro

5. Pulsa "Registrar una decisión".
6. Introduce `2,50`, elige Café, nota "Café en casa" → Guardar.
7. Debe aparecer "Decisión registrada" y el formulario limpio.
8. Vuelve a Inicio: total 2,50 €, hoy 2,50 €, semana 2,50 €, un movimiento.

### Importes rápidos

8.1 En Añadir, pulsa el lápiz a la izquierda de "Importes rápidos".
8.2 Toca `1,50`, cámbialo por `4,20` y pulsa Guardar.
8.3 El chip debe mostrar `4,20`; pulsa el lápiz para salir del modo edición.
8.4 Recarga la app: el importe `4,20` debe seguir ahí.

9. Añade `8,00` en Comida.
10. Total 10,50 €.

### Persistencia

11. Cierra la app por completo (no solo a segundo plano).
12. Vuelve a abrirla: los 10,50 € siguen ahí.

### Historial

13. Deben aparecer 2 registros, el más reciente primero.
14. Filtra por Café: queda 1.
15. Cambia el orden a "Antiguos": cambia el orden.
16. Entra en el registro de 2,50 €, cámbialo a `3,00` y guarda.
17. Inicio debe mostrar 11,00 €.
18. Elimina el registro de 8,00 € y confirma.
19. Total 3,00 €; el registro ya no aparece.

### Estadísticas

20. Abre Estadísticas: Mes actual, total 3,00 €, 1 decisión.
21. Cambia a Semana y Año: los totales siguen siendo coherentes.
22. Añade un registro con fecha de ayer y otro del mes pasado; comprueba que aparecen en el periodo correcto.
23. Con datos del periodo anterior, debe mostrarse la comparación; sin ellos, "Sin datos suficientes".

### Objetivo

24. Inicio → "Crear objetivo".
25. Nombre "Viaje", 50,00 € → Crear.
26. Debe mostrar 3,00 € de 50,00 € (6 %) y la explicación de que no es dinero apartado.
27. Edita el objetivo a 10,00 € → el porcentaje sube.
28. Elimínalo y confirma → Inicio muestra "Sin objetivo activo".

### Ajustes y datos

29. Ajustes: cambia el primer día de semana y comprueba que la semana de Inicio se recalcula.
30. Con registros, la moneda debe estar bloqueada.
31.1. Exporta datos: en web se descarga un JSON; en nativo se abre la hoja de compartir.
31.2. Importa ese mismo JSON y elige **Fusionar**: debe indicar 0 añadidos y 1 ya existente; el historial no se duplica.
31.3. Restablece datos y confirma: registros y objetivos desaparecen; el perfil se conserva.
31.4. Importa de nuevo el JSON y elige **Reemplazar todo** → confirma el aviso destructivo: el registro vuelve y el perfil se restaura.
31.5. Importa un archivo ajeno (por ejemplo, un JSON cualquiera): debe mostrar un error legible y no modificar los datos.
32. Restablece de nuevo; sin registros, la moneda debe poder cambiarse.
33. Añade un registro y comprueba que la moneda vuelve a bloquearse. (La fusión de una copia con otra moneda se rechaza en las pruebas automatizadas).

### Accesibilidad

34. Activa VoiceOver (iOS) o TalkBack (Android) y recorre Inicio y Añadir: los botones e importes deben anunciarse con nombre y valor.
35. Sube el tamaño de texto del sistema al máximo: nada debe quedar recortado ni inaccesible.
36. Comprueba que la información no depende solo del color.

### Errores

37. Importe vacío, `0`, negativo, `2,505`, fecha futura, fecha inválida: deben mostrar mensajes claros y no guardar.
38. Pulsa Guardar dos veces rápido: no debe crear duplicados.

---

## 9. PWA: servir la app desde este equipo e instalarla en el móvil

La app también se compila como aplicación web instalable. Usa el mismo código (React Native Web), SQLite en el navegador (wa-sqlite/WASM) y un service worker para abrir sin conexión.

### 9.1 Requisito importante: HTTPS

SQLite web necesita `SharedArrayBuffer`, que solo está disponible en un **contexto seguro**:

- `http://localhost` y `http://127.0.0.1` sí son contextos seguros.
- `http://192.168.x.x:8085` **no** lo es: la app no arrancará en el móvil por HTTP.
- Por eso, para el teléfono hay que servir con HTTPS y un certificado en el que confíe el dispositivo.

### 9.2 Probar en este Mac

```bash
pnpm web:build
pnpm web:serve
```

Abre `http://localhost:8085`. En la consola del navegador debe aparecer `crossOriginIsolated === true`.

Prueba automatizada (Chrome instalado, servidor arrancado):

```bash
pnpm web:smoke
pnpm web:smoke:i18n
pnpm web:smoke:offline
pnpm web:smoke:first-load
```

`web:smoke` comprueba origen aislado, arranque, onboarding, alta, persistencia al recargar, service worker, manifest, historial, estadísticas y funcionamiento sin conexión. `web:smoke:i18n` recorre onboarding multiidioma, cambio a catalán, exportación, fusión, restablecimiento, reemplazo y recuperación del registro. `web:smoke:offline` verifica el fallback `offline.html` cuando falta el shell cacheado. `web:smoke:first-load` simula el caso real: una sola apertura online, red desactivada y recarga; comprueba que el bundle JS y SQLite WASM quedaron precargados.

### 9.3 HTTPS para el móvil con mkcert

```bash
brew install mkcert
mkcert -install
pnpm web:cert
pnpm web:serve:https
```

`pnpm web:cert` crea `.certs/cert.pem` y `.certs/key.pem` para `localhost`, `127.0.0.1`, la IP local del Mac y `suma.local`. El servidor escucha en el puerto **8085**.

La salida de `pnpm web:serve:https` muestra la URL de red, por ejemplo `https://192.168.1.40:8085`.

### 9.4 Confiar en el certificado en el móvil

El móvil debe confiar en la autoridad local de mkcert (`rootCA.pem`). Está en la carpeta que indica `mkcert -CAROOT`.

**iPhone/iPad**

1. Envía `rootCA.pem` al iPhone (AirDrop, correo o archivo).
2. Ajustes → Perfil descargado → Instalar.
3. Ajustes → General → Información → Ajustes de confianza de certificados → activa la confianza total para el certificado de mkcert.
4. Abre la URL HTTPS en Safari.

**Android**

1. Copia `rootCA.pem` al teléfono.
2. Ajustes → Seguridad y privacidad → Más ajustes de seguridad → Cifrado y credenciales → Instalar un certificado → Certificado de CA.
3. Selecciona el archivo y confirma.
4. Abre la URL HTTPS en Chrome.

> El certificado solo sirve para tu red local. No lo compartas ni lo uses en producción.

### 9.5 Instalar la PWA

- **iPhone/iPad (Safari)**: botón Compartir → "Añadir a pantalla de inicio".
- **Android (Chrome)**: menú ⋮ → "Instalar aplicación" o "Añadir a pantalla de inicio".

Requisitos que ya cumple el build: manifest con iconos 192/512 y maskable, service worker `suma-v7`, `display: standalone`, nombre y colores.

El viewport no usa `viewport-fit=cover`: el contenido queda dentro del área segura y la barra de estado translúcida de iOS 26 ya no difumina la parte superior. Si la PWA instalada conserva el HTML anterior, ciérrala, ábrela con conexión y recarga.

### 9.6 Sin conexión y sin servidor

El service worker precarga **todos** los recursos del build. La secuencia para no depender del PC es: abrir en Safari → Añadir a pantalla de inicio → **abrir el icono una vez con el servidor encendido** → esperar → probar modo avión → apagar el servidor. Ver [PWA_OFFLINE.md](./PWA_OFFLINE.md).

Tras la primera visita con conexión, el service worker cachea el shell y los recursos usados. Después:

1. Activa el modo avión.
2. Abre la app desde el icono de la pantalla de inicio.
3. Debe cargar y conservar los registros.

Los datos se guardan en el almacenamiento del navegador (OPFS/IndexedDB) y sobreviven a cerrar y reabrir. No se sincronizan con la app nativa.

Con el bundle único de la PWA también funcionan sin conexión las pantallas que no se hayan visitado antes: editar un registro, ajustes y objetivos.

### 9.7 Dónde están los datos y cómo no perderlos

- Cada **origen** tiene su propia base: `http://localhost:8085`, `https://192.168.1.40:8085` y una URL de túnel son almacenamientos distintos.
- Si cambia la IP del Mac o la URL del túnel, la PWA instalada apuntará a otro origen y verás datos vacíos.
- Para conservar datos: Ajustes → Exportar datos (JSON) y guarda el archivo.
- Borrar datos del sitio en el navegador o desinstalar la PWA puede eliminar los registros.
- iOS puede desalojar almacenamiento de sitios poco usados; exporta periódicamente si son datos importantes.

### 9.8 Actualizar la PWA

```bash
pnpm web:build
```

El servidor sirve los archivos nuevos. Si el service worker conserva una versión antigua, sube `VERSION` en `public/sw.js`, vuelve a compilar y recarga. Para forzar la actualización en el móvil: cierra la PWA, ábrela de nuevo con conexión y recarga. La versión actual es `suma-v7`.

### 9.9 Alternativa rápida: túnel HTTPS

Si no quieres instalar certificados, puedes exponer el servidor local con un túnel HTTPS:

```bash
pnpm web:build
pnpm web:serve
npx localtunnel --port 8085
```

Abre la URL `https://...loca.lt` en el móvil. Sirve para probar, pero la URL cambia y los datos quedan asociados a ese origen. Mantén el túnel abierto solo mientras pruebas.

### 9.10 GitHub Pages

El repositorio incluye un workflow para publicar en GitHub Pages con subruta y aislamiento COOP/COEP mediante service worker. Sigue [DEPLOY_GITHUB_PAGES.md](./DEPLOY_GITHUB_PAGES.md). La primera visita se recarga una vez; en Safari muy antiguo puede no funcionar y conviene Cloudflare Pages.

### 9.11 Usar la PWA sin el PC

Un túnel o un servidor local dejan de responder al cerrar el puerto. Para usar SUMA como app local autónoma, publica `dist/` en un hosting HTTPS estable con COOP/COEP. Sigue [DEPLOY_STATIC.md](./DEPLOY_STATIC.md): incluye Netlify Drop, Cloudflare Pages, migración de datos por JSON y comprobación de cabeceras.

### 9.12 Limitaciones de la PWA

- No hay notificaciones push ni sincronización.
- La instalación y el service worker requieren HTTPS (o localhost).
- El comportamiento offline depende de haber cargado la app al menos una vez.
- El rendimiento y el almacenamiento dependen del navegador; no es la app nativa.
- En iOS, la PWA no tiene acceso a todas las capacidades de una app nativa.

## 10. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| "Unable to run simctl" | Licencia de Xcode | `sudo xcodebuild -license accept` |
| El QR no conecta | Red/VPN/firewall | `pnpm start --tunnel` |
| Puerto 8081 ocupado | Otro Metro | `pnpm start --port 8082` |
| Expo Go no abre el proyecto | SDK distinto | Actualiza Expo Go o usa EAS/dev build |
| Cambios no se reflejan | Caché de Metro | `pnpm start --clear` |
| Los datos no persisten | Se reinstaló Expo Go o se restableció | Es el comportamiento esperado |
| Fallo de tipos tras editar | tsconfig/entorno | `pnpm typecheck` |
| Dependencias incoherentes | Versiones | `pnpm exec expo-doctor` |

### Nota sobre sandbox

Si ejecutas los comandos dentro de un entorno que no permite escribir en `~/.expo`, usa `HOME=$PWD/.home` y lanza Expo con `node node_modules/expo/bin/cli`. En una terminal normal de macOS **no hace falta**.

---

## 11. Qué no se puede probar todavía

- Publicación en App Store o Google Play.
- Compras o suscripciones (no implementadas).
- Notificaciones (fuera del MVP).
- Sincronización entre dispositivos (fuera del MVP).
- Cumplimiento legal (requiere revisión externa).
