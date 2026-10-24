# Desplegar SUMA en GitHub Pages

La app se puede publicar en GitHub Pages, pero **Pages no permite configurar COOP/COEP**. SQLite WASM necesita `SharedArrayBuffer` y, por tanto, aislamiento de origen. La solución implementada es que el **service worker** añada `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: require-corp` a las respuestas de navegación. La primera visita se recarga una vez para activar el aislamiento.

> Probado en Chrome con un servidor sin cabeceras (simulando Pages). En iPhone se ha preparado para Safari moderno; si el aislamiento fallara, usa Cloudflare Pages/Netlify, que permiten cabeceras nativas (ver [DEPLOY_STATIC.md](./DEPLOY_STATIC.md)).

## 1. Activar Pages

En el repositorio:

1. **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions** (no "Deploy from a branch").
3. El workflow `.github/workflows/pages.yml` ya está en el repo y se ejecuta al hacer push a `main`.

Si el repositorio es privado, GitHub Pages puede requerir un plan de pago; con un repo público funciona en el plan gratuito.

## 2. Publicar

```bash
git push origin main
```

El workflow:

- instala dependencias;
- compila con `pnpm web:build:gh`;
- usa la subruta del repositorio (`/SUMA/` en `ferradasdiego.github.io/SUMA/`);
- genera `404.html` y `.nojekyll`;
- publica `dist`.

La URL será:

```
https://<usuario>.github.io/SUMA/
```

El workflow toma el nombre del repositorio, así que si lo renombras la subruta cambia y también el origen de los datos.

## 3. Primera apertura en el iPhone

1. Abre la URL en **Safari** y espera. La primera visita puede recargarse sola una vez: el service worker necesita controlar la página para inyectar COOP/COEP.
2. Comprueba que ya carga la app.
3. Compartir → **Añadir a pantalla de inicio**.
4. **Abre SUMA desde el icono con la app todavía online** y espera 10–15 segundos (precache de JS, WASM, fuente e iconos).
5. Prueba el modo avión: cierra y vuelve a abrir el icono. Debe aparecer SUMA.
6. Si funciona, ya puedes usar la PWA sin depender de GitHub Pages.

El primer arranque desde el icono es imprescindible; ver [PWA_OFFLINE.md](./PWA_OFFLINE.md).

## 4. Comprobar el aislamiento

Con la app cargada, en una consola de escritorio:

```js
crossOriginIsolated // true
typeof SharedArrayBuffer // "function"
navigator.serviceWorker.controller.scriptURL // .../SUMA/sw.js
```

El service worker debe estar en `/SUMA/sw.js` con scope `/SUMA/`. El manifest apunta a `/SUMA/manifest.webmanifest` y `start_url` es `/SUMA/`.

## 5. Datos y migración

GitHub Pages es un **origen nuevo** respecto al túnel o a localhost. Si tenías datos:

1. Abre la PWA antigua con su servidor encendido.
2. Ajustes → **Exportar datos (JSON)**.
3. En la PWA de Pages: Ajustes → **Importar datos (JSON)** → **Reemplazar todo**.

No cambies de URL después: sería otro origen con otra base vacía.

## 6. Actualizaciones

Cada push a `main` vuelve a desplegar. Abre la PWA con conexión, ciérrala y vuelve a abrirla para que el service worker `suma-v7` se actualice y vuelva a precargar.

## 7. Si no funciona

- **La página se queda en blanco o `crossOriginIsolated` es false**: espera la recarga inicial; si no ocurre, comprueba que el service worker está activo y que la URL es `/SUMA/`.
- **Safari antiguo**: el aislamiento por service worker requiere una versión moderna. Usa Cloudflare Pages.
- **Error de SQLite/SharedArrayBuffer**: confirma que el documento tiene COOP/COEP tras la recarga. En Cloudflare/Netlify se envían desde el servidor y no hace falta el workaround.
- **404 al recargar una ruta**: el workflow copia `index.html` a `404.html`; verifica que `.nojekyll` existe en el artefacto.
- **Datos vacíos**: estás en otro origen; exporta/importa.

## 8. Alternativa recomendada si quieres evitar el workaround

Conecta el mismo repositorio a **Cloudflare Pages** o **Netlify**:

- build: `pnpm web:build`
- output: `dist`
- cabeceras: `_headers` ya está en el repo.

Tendrás HTTPS, COOP/COEP nativos y una URL estable, sin la recarga inicial de COI. Ver [DEPLOY_STATIC.md](./DEPLOY_STATIC.md).
