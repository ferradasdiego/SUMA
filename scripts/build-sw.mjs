#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve, sep } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const swPath = join(root, 'sw.js');
const base = (process.env.SUMA_BASE_PATH ?? '').replace(/\/+$/, '');
const prefix = (path) => base + path;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

const files = await walk(root);
const precache = files
  .map((file) => prefix('/' + relative(root, file).split(sep).join('/')))
  .filter((path) => path !== prefix('/sw.js'))
  .filter((path) => !path.endsWith('.map'))
  .filter((path) => path !== prefix('/_headers') && path !== prefix('/_redirects'))
  .filter((path) => path !== prefix('/.nojekyll') && path !== prefix('/404.html'))
  .sort();

if (!precache.includes(prefix('/index.html'))) {
  throw new Error('El build no contiene index.html');
}
if (!precache.includes(prefix('/offline.html'))) {
  throw new Error('El build no contiene offline.html');
}
if (!precache.some((path) => path.endsWith('.js'))) {
  throw new Error('El build no contiene el bundle JavaScript');
}

let sw = await readFile(swPath, 'utf8');
const marker = /const PRECACHE = \[[\s\S]*?\];/;
if (!marker.test(sw)) {
  throw new Error('sw.js no contiene el marcador PRECACHE');
}

sw = sw.replace(marker, 'const PRECACHE = ' + JSON.stringify([prefix('/'), ...precache], null, 2) + ';');
await writeFile(swPath, sw, 'utf8');
console.log('Service worker preparado con ' + (precache.length + 1) + ' recursos precargados' + (base ? ' en ' + base : '') + '.');
