# Instalar SUMA y usarla sin el PC

Sí: puedes servirla un rato por HTTPS, instalarla, abrirla **una vez desde el icono** mientras el servidor sigue encendido y después apagar el PC. La app seguirá funcionando en el iPhone.

## Por qué falló antes

La PWA instalada no comparte necesariamente el service worker ni la caché con la pestaña de Safari. Además, la versión anterior solo cacheaba los recursos que se iban pidiendo: el JavaScript, el WASM de SQLite y la fuente se cargaban **antes** de que el service worker tomara el control, así que una sola visita no bastaba. Al apagar el túnel, la primera apertura del icono no tenía de dónde cargar y iOS descargó un archivo vacío (`datos`, 0 KB).

Ahora el build genera una lista de **todos** los recursos y el service worker los precarga en la instalación (`suma-v6`).

## Pasos exactos

1. Sirve la app por HTTPS en el PC:
   ```bash
   cd ~/Desktop/dev/SUMA
   pnpm web:build
   pnpm web:serve:https
   ```
   Es más fiable usar `mkcert` y una IP fija de la red local que un túnel con login. Si usas un túnel, debe ser accesible sin autenticación y conservar la misma URL.

2. En el iPhone, abre la URL en **Safari** y espera a que cargue la app.
3. Compartir → **Añadir a pantalla de inicio**.
4. **Abre SUMA desde el icono nuevo, con el servidor todavía encendido.** Este paso es el que antes faltaba.
5. Espera 10–15 segundos. El service worker está descargando el bundle, SQLite WASM, la fuente y los iconos.
6. Comprueba que ya funciona sin red:
   - activa el **modo avión**;
   - cierra la app y vuelve a abrirla desde el icono;
   - debe aparecer SUMA, no el archivo `datos`.
7. Desactiva el modo avión, cierra la app y **apaga el servidor/túnel**. Vuelve a abrirla: debe seguir funcionando.

Si el paso 6 falla, vuelve a abrir el icono con el servidor encendido, espera más tiempo y repite. No desinstales ni borres los datos del sitio antes de exportar una copia.

## Qué pasa con la URL caída

La app no hace peticiones de red para funcionar. El service worker sirve el shell y todos los recursos desde la caché; SQLite sigue leyendo y escribiendo en el almacenamiento local del iPhone. La URL puede estar caída indefinidamente.

## Datos y copias

- Los datos están ligados al **origen**: misma URL, mismo almacenamiento.
- Si cambias de URL o reinstalas desde otro dominio, verás una app vacía. Exporta el JSON antes y usa **Importar datos → Reemplazar**.
- iOS puede desalojar almacenamiento de sitios poco usados. Abre la app de vez en cuando y exporta una copia si los datos son importantes.

## Problemas frecuentes

### Aparece `datos` de 0 KB

Es la vista previa de un archivo que iOS ha descargado, no SUMA. Ciérrala y bórrala. Luego:
1. vuelve a levantar el servidor en la misma URL;
2. abre el icono de SUMA con conexión;
3. espera a que cargue y a que el service worker se actualice;
4. exporta los datos y repite la prueba de modo avión.

Si el icono sigue abriendo el archivo, elimínalo de la pantalla de inicio, vuelve a añadirlo desde Safari, ábrelo una vez con el servidor encendido y espera.

### El certificado no es de confianza

Sin un certificado válido o instalado como raíz en el iPhone, Safari no registra el service worker y no habrá uso offline. Con `mkcert`, instala y confía en la CA en el iPhone (Ajustes → General → Información → Ajustes de confianza de certificados).

### Un túnel con login

La PWA instalada puede no compartir la sesión de autenticación con Safari. Para la instalación offline es mejor `mkcert` en la red local o un origen sin autenticación.

### He cambiado de URL

Es otro origen: otra base. Recupera el JSON del origen antiguo y impórtalo en el nuevo.
