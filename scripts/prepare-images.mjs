import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = join(root, 'assets', 'source');
const outputDir = join(root, 'public', 'images');
await mkdir(outputDir, { recursive: true });

const images = [
  ['hero', 1600, 76],
  ['workshop', 1200, 76],
  ['phantom', 1600, 76],
  ['dust-runner', 1200, 76],
  ['blackline', 1200, 76],
];

for (const [name, width, quality] of images) {
  const source = join(sourceDir, `${name}.png`);
  const output = join(outputDir, `${name}.webp`);
  await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(output);
  const meta = await sharp(output).metadata();
  console.log(`${name}: ${meta.width}×${meta.height}, ${((await stat(output)).size / 1024).toFixed(0)} KB`);
}

await sharp(join(sourceDir, 'hero.png')).rotate().resize(960, 720, { fit: 'cover', position: 'right' }).webp({ quality: 75, effort: 6 }).toFile(join(outputDir, 'hero-mobile.webp'));
const mobile = await sharp(join(outputDir, 'hero-mobile.webp')).metadata();
console.log(`hero-mobile: ${mobile.width}×${mobile.height}, ${((await stat(join(outputDir, 'hero-mobile.webp'))).size / 1024).toFixed(0)} KB`);
