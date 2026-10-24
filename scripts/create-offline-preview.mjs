import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const built = join(root, 'dist');
let html = await readFile(join(built, 'index.html'), 'utf8');

const scriptName = html.match(/<script type="module" crossorigin src="\/assets\/([^"]+)"><\/script>/)?.[1];
const styleName = html.match(/<link rel="stylesheet" crossorigin href="\/assets\/([^"]+)">/)?.[1];
if (!scriptName || !styleName) throw new Error('Could not find the production JavaScript and CSS files');

let script = await readFile(join(built, 'assets', scriptName), 'utf8');
let style = await readFile(join(built, 'assets', styleName), 'utf8');

for (const [, name] of script.matchAll(/\/images\/([\w.-]+\.webp)/g)) {
  const data = await readFile(join(built, 'images', name));
  script = script.replaceAll(`/images/${name}`, `data:image/webp;base64,${data.toString('base64')}`);
}

for (const [, name] of style.matchAll(/\/assets\/([\w.-]+\.woff2?)/g)) {
  const data = await readFile(join(built, 'assets', name));
  const mime = name.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
  style = style.replaceAll(`/assets/${name}`, `data:${mime};base64,${data.toString('base64')}`);
}

const favicon = await readFile(join(built, 'favicon.svg'));
html = html
  .replace(/\s*<script>if \(location\.protocol === 'file:'\)[^<]*<\/script>/, '')
  .replace(/<link rel="preload"[^>]+>\s*/g, '')
  .replace('href="/favicon.svg"', `href="data:image/svg+xml;base64,${favicon.toString('base64')}"`)
  .replace(/<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>/, () => `<script type="module">${script.replaceAll('</script', '<\\/script')}</script>`)
  .replace(/<link rel="stylesheet" crossorigin href="\/assets\/[^\"]+">/, () => `<style>${style}</style>`);

const remaining = html.match(/\/(?:images|assets)\/[\w.-]+/g);
if (remaining) throw new Error(`Offline preview still contains external asset paths: ${[...new Set(remaining)].join(', ')}; context: ${html.slice(html.indexOf(remaining[0]) - 70, html.indexOf(remaining[0]) + 100)}`);
await writeFile(join(root, 'offline-preview.html'), html);
console.log('Created offline-preview.html for direct file opening');
