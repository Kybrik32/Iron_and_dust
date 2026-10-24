import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('opening index.html directly displays the offline site with working images', async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox'],
  });
  try {
    for (const width of [375, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(join(root, 'index.html')).href, { waitUntil: 'load' });
      await page.locator('#hero-title').waitFor({ timeout: 3000 }).catch(async () => {
        throw new Error(`Site did not render at ${page.url()}: ${errors.join('; ')}; ${await page.locator('body').innerText()}`);
      });
      assert.equal(new URL(page.url()).protocol, 'file:');
      assert.ok(await page.locator('#hero-title').isVisible());
      assert.ok(await page.locator('img').first().evaluate(image => image.complete && image.naturalWidth > 0));
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
