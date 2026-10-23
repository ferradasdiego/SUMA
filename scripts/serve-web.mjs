#!/usr/bin/env node
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { networkInterfaces } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const valueOf = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const port = Number(valueOf('--port', process.env.PORT ?? '8085'));
const useHttps = args.includes('--https');
const root = resolve(valueOf('--dir', 'dist'));
const certPath = resolve(valueOf('--cert', process.env.CERT ?? '.certs/cert.pem'));
const keyPath = resolve(valueOf('--key', process.env.KEY ?? '.certs/key.pem'));
const host = valueOf('--host', '0.0.0.0');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

if (!existsSync(root)) {
  console.error('No existe ' + root + '. Ejecuta primero: pnpm web:build');
  process.exit(1);
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(body);
}

function cacheControl(pathname) {
  if (pathname === '/' || pathname === '/index.html' || pathname === '/sw.js' || pathname === '/manifest.webmanifest') {
    return 'no-cache';
  }
  if (pathname.startsWith('/_expo/static/') || pathname.startsWith('/assets/')) {
    return 'public, max-age=31536000, immutable';
  }
  return 'public, max-age=3600';
}

function resolveFile(pathname) {
  let filePath = join(root, pathname);
  if (!filePath.startsWith(root + sep) && filePath !== root) return null;
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }
  if (!existsSync(filePath)) {
    if (pathname.includes('.')) return null;
    filePath = join(root, 'index.html');
  }
  return filePath;
}

const handler = (req, res) => {
  if (!req.url) return send(res, 400, 'Solicitud inválida');
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);

  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  const filePath = resolveFile(pathname);
  if (!filePath) return send(res, 404, 'No encontrado');

  const type = MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Cache-Control': cacheControl(pathname),
    'Service-Worker-Allowed': '/',
  });

  if (req.method === 'HEAD') return res.end();
  createReadStream(filePath).pipe(res);
};

let server;
if (useHttps) {
  if (!existsSync(certPath) || !existsSync(keyPath)) {
    console.error('Faltan certificados. Genera uno con: pnpm web:cert');
    process.exit(1);
  }
  server = createHttpsServer(
    { cert: readFileSync(certPath), key: readFileSync(keyPath) },
    handler,
  );
} else {
  server = createHttpServer(handler);
}

server.listen(port, host, () => {
  const protocol = useHttps ? 'https' : 'http';
  console.log('');
  console.log('SUMA web servida desde ' + root);
  console.log('  Local:   ' + protocol + '://localhost:' + port);
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.family === 'IPv4' && !address.internal) {
        console.log('  Red:     ' + protocol + '://' + address.address + ':' + port);
      }
    }
  }
  console.log('');
  if (!useHttps) {
    console.log('HTTP solo sirve para probar en este Mac. Para instalar la PWA en el móvil usa HTTPS.');
  }
  console.log('Cabeceras COOP/COEP activas (necesarias para SQLite en web).');
});
