# Usar SUMA en el iPhone sin depender del PC

## 1. Qué está pasando

La PWA no se "descarga" al iPhone como un archivo: se instala desde un **origen HTTPS** y sigue apuntando a ese origen. El service worker guarda una copia para abrirla sin conexión, pero:

- el servidor local y el túnel solo existen mientras el proceso y el puerto están vivos;
- un túnel de desarrollo puede cambiar de URL entre sesiones;
- los datos de la PWA están ligados al **origen** (esquema + dominio + puerto);
- si el túnel devuelve un archivo vacío en vez de HTML, iOS puede abrir una vista previa de un archivo de 0 KB llamado `datos`, que no es la app.

La captura con `datos - 0 KB` es la vista previa de ese archivo, no SUMA. Ciérrala y bórrala de Archivos/Descargas. Si el icono antiguo apunta al túnel, quítalo de la pantalla de inicio cuando ya no lo necesites.

Para usarla como app local de verdad hace falta un **origen HTTPS estable** que siga disponible cuando el PC esté apagado. La app es estática: no necesita backend ni sube los datos.

## 2. Antes de migrar: recupera los datos del origen antiguo

Los datos de la PWA antigua viven en el almacenamiento del origen del túnel. No aparecen automáticamente en el origen nuevo.

1. Vuelve a levantar el servidor y el túnel **con la misma URL** que tenías, si es posible.
2. Abre la PWA antigua en el iPhone.
3. Ajustes → **Exportar datos (JSON)** y guarda el archivo en Archivos.
4. No borres los datos del sitio ni el icono antiguo hasta comprobar que la copia se ha exportado.

Si la PWA antigua mostraba el archivo `datos` de 0 KB, vuelve a levantar el servidor y el túnel en la misma URL y ábrela de nuevo: el service worker antiguo pedía la red primero y, si el túnel responde HTML, repara el `index.html` cacheado. Exporta en cuanto cargue. No borres los datos del sitio: eso eliminaría también la base OPFS.

Si ya no puedes recuperar el origen antiguo, los datos pueden ser irrecuperables; no los borres por si acaso.

## 3. Opción recomendada: Netlify Drop

Netlify Drop permite publicar la carpeta `dist` sin configurar un servidor. El plan gratuito es suficiente.

### 3.1 Compilar

```bash
cd ~/Desktop/dev/SUMA
pnpm install
pnpm web:build
```

Debe existir `dist/_headers`, `dist/_redirects`, `dist/offline.html` y `dist/sw.js`. `_redirects` hace que recargar una ruta como `/settings` devuelva la app y no un 404.

### 3.2 Publicar

1. Entra en <https://app.netlify.com/drop>.
2. Arrastra la carpeta **`dist`** completa (no el repositorio).
3. Netlify te dará una URL estable, por ejemplo `https://suma-abc123.netlify.app`.
4. Comprueba las cabeceras:

```bash
curl -I https://TU-SITIO.netlify.app/ | grep -i cross-origin
```

Deben aparecer:

```
cross-origin-opener-policy: same-origin
cross-origin-embedder-policy: credentialless
```

Sin esas cabeceras, SQLite WASM no arranca. Si no aparecen, confirma que `_headers` está en la raíz del sitio publicado (Netlify lo lee del directorio publicado).

### 3.3 Instalar en el iPhone

1. Abre la URL de Netlify en **Safari** (no en Chrome).
2. Espera a que cargue del todo; abre Inicio y Ajustes una vez.
3. Compartir → **Añadir a pantalla de inicio**.
4. Abre SUMA desde el icono, con conexión, y espera unos segundos.
5. Prueba el modo avión y ábrela de nuevo: debe aparecer la app, no el archivo `datos`.

El primer arranque online es imprescindible: es cuando se instala el service worker y se cachea el shell.

## 4. Alternativas

### Cloudflare Pages

1. `pnpm web:build`.
2. En Cloudflare Pages, crea un proyecto de **Direct Upload** y sube `dist`.
3. Cloudflare respeta `_headers` (COOP/COEP) y `_redirects` (SPA) y da una URL `*.pages.dev` estable.
4. Instala desde Safari igual que en Netlify.

También puedes conectar el repositorio con:
- comando de build: `pnpm web:build`
- directorio de salida: `dist`

### Vercel

El repositorio incluye `vercel.json` con las cabeceras y el rewrite SPA. Desde la raíz:

```bash
pnpm dlx vercel --prod
```

Comprueba las cabeceras con `curl -I` antes de instalar.

### GitHub Pages

No sirve para esta app: no permite configurar COOP/COEP y SQLite WASM no puede usar `SharedArrayBuffer`.

## 5. Migrar los datos a la nueva URL

1. Abre la PWA nueva en el iPhone.
2. Ajustes → **Importar datos (JSON)**.
3. Elige el archivo exportado del origen antiguo.
4. **Reemplazar todo** restaura perfil, idioma, moneda, importes rápidos, registros y objetivos. **Fusionar** conserva el perfil nuevo y añade lo que no exista (misma moneda).
5. Comprueba Inicio e Historial.

## 6. Actualizar la app

Vuelve a compilar y publica en **el mismo sitio** (misma URL):

```bash
pnpm web:build
# vuelve a arrastrar dist a Netlify/Cloudflare o despliega con Vercel
```

En el iPhone: abre la PWA con conexión, ciérrala y vuelve a abrirla; si sigue la versión anterior, repite una vez. El service worker actual es `suma-v5`.

No cambies de dominio ni de subdominio: sería otro origen, con otra base vacía.

## 7. Privacidad

- El hosting solo sirve el código de la app; no hay backend ni cuentas.
- Los registros y notas se guardan en el almacenamiento local del iPhone (OPFS/IndexedDB).
- La exportación JSON contiene notas personales: guárdala y compártela con cuidado.
- iOS puede desalojar almacenamiento de sitios poco usados; exporta una copia periódicamente.

## 8. Si no quieres usar hosting

Las alternativas son:
- mantener el Mac y el túnel encendidos (no es una app local autónoma);
- un servidor siempre encendido en la red local con HTTPS y una URL estable (NAS/Raspberry Pi);
- un build nativo de iOS (TestFlight/App Store), que requiere cuenta de Apple y toolchain.
