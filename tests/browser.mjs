import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = 4187;
const url = `http://127.0.0.1:${port}/`;
const vite = spawn(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'ignore' });
let browser;

try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try { const response = await fetch(url); if (response.ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  assert.ok(ready, 'production preview did not start');
  browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', args: ['--no-sandbox'] });
  const screenshotDir = join(root, 'artifacts', 'screenshots');
  await mkdir(screenshotDir, { recursive: true });

  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(dimensions.document <= dimensions.viewport + 1, `horizontal overflow at ${width}px: ${JSON.stringify(dimensions)}`);
    const heroHeadingOnTop = await page.locator('#hero-title').evaluate(node => { const bounds = node.getBoundingClientRect(); const top = document.elementFromPoint(bounds.left + Math.min(60, bounds.width / 2), bounds.top + Math.min(30, bounds.height / 2)); return top === node || node.contains(top); });
    assert.ok(heroHeadingOnTop, `hero heading is covered at ${width}px`);
    assert.deepEqual(pageErrors, [], `runtime errors at ${width}px`);
    if (width <= 430) {
      const imageTop = await page.locator('.hero-image').evaluate(node => node.getBoundingClientRect().top);
      assert.ok(imageTop < 440, `motorcycle enters too late at ${width}px: ${imageTop}px`);
    }
    const ctaHeight = await page.locator('.hero-actions .button').evaluate(node => node.getBoundingClientRect().height);
    assert.ok(ctaHeight >= 44, `hero action too small at ${width}px: ${ctaHeight}px`);
    for (const image of await page.locator('img').all()) {
      if (await image.isVisible()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(async node => { if (!node.complete) await new Promise(resolve => { node.addEventListener('load', resolve, { once: true }); node.addEventListener('error', resolve, { once: true }); }); });
      }
    }
    const failedImages = await page.locator('img').evaluateAll(images => images.filter(image => image.complete && image.naturalWidth === 0).map(image => image.src));
    assert.deepEqual(failedImages, [], `failed images at ${width}px`);
    const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.getAttribute('href').slice(1))).map(link => link.getAttribute('href')));
    assert.deepEqual(brokenAnchors, [], `broken section links at ${width}px`);
    if (width === 375 || width === 1440) {
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let top = 0; top <= height; top += 650) {
        await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top);
        await page.waitForTimeout(75);
      }
      await page.waitForTimeout(850);
      const hidden = await page.locator('[data-reveal]:not(.is-visible)').count();
      assert.equal(hidden, 0, `unrevealed content remained after scrolling at ${width}px`);
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: join(screenshotDir, `home-${width}.png`), fullPage: true });
      await page.screenshot({ path: join(screenshotDir, `hero-${width}.png`) });
    } else {
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: join(screenshotDir, `hero-${width}.png`) });
    }
    await page.close();
    console.log(`${width}px: no overflow, image errors, or runtime errors`);
  }

  const motionPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await motionPage.goto(url, { waitUntil: 'networkidle' });
  const processHeading = motionPage.locator('.process-heading h2');
  assert.equal(await processHeading.evaluate(node => getComputedStyle(node).opacity), '0', 'offscreen section starts hidden for reveal');
  await processHeading.scrollIntoViewIfNeeded();
  await motionPage.waitForFunction(() => getComputedStyle(document.querySelector('.process-heading h2')).opacity === '1');
  await motionPage.close();
  const reducedPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await reducedPage.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await reducedPage.locator('.process-heading h2').evaluate(node => getComputedStyle(node).opacity), '1', 'reduced motion keeps content visible');
  await reducedPage.close();
  const noObserverPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await noObserverPage.addInitScript(() => Object.defineProperty(window, 'IntersectionObserver', { value: undefined }));
  await noObserverPage.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await noObserverPage.locator('.process-heading h2').evaluate(node => getComputedStyle(node).opacity), '1', 'missing IntersectionObserver keeps content visible');
  await noObserverPage.close();
  const noScriptPage = await browser.newPage({ javaScriptEnabled: false });
  await noScriptPage.goto(url, { waitUntil: 'load' });
  assert.ok(await noScriptPage.getByRole('heading', { level: 1, name: /Built different/i }).isVisible(), 'essential site content remains available without JavaScript');
  await noScriptPage.close();
  console.log('motion: one-time reveal and reduced-motion visibility');

  const hoverPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await hoverPage.goto(url, { waitUntil: 'networkidle' });
  const featured = hoverPage.locator('.build-card').first();
  await featured.scrollIntoViewIfNeeded();
  await featured.hover();
  await hoverPage.waitForTimeout(500);
  const imageScale = await featured.locator('.build-photo img').evaluate(node => Number(new DOMMatrix(getComputedStyle(node).transform).a.toFixed(3)));
  assert.ok(imageScale >= 1.03 && imageScale <= 1.04, `gallery hover scale should be subtle, got ${imageScale}`);
  await hoverPage.locator('.desktop-nav a[href="#services"]').click();
  assert.equal(new URL(hoverPage.url()).hash, '#services');
  assert.ok(await hoverPage.locator('.site-header.is-scrolled').isVisible());
  await hoverPage.close();
  console.log('desktop navigation and gallery hover');

  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  assert.equal(await page.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Open navigation');
  await menu.click();
  await page.locator('.mobile-nav a[href="#about"]').click();
  assert.equal(new URL(page.url()).hash, '#about');
  assert.equal(await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'), 'false');
  console.log('mobile menu: open, Escape, focus return');

  const firstConcept = page.getByRole('button', { name: 'View Concept' }).first();
  await firstConcept.click();
  assert.ok(await page.getByRole('dialog').isVisible());
  assert.equal((await page.getByRole('dialog').locator('h2').textContent())?.trim(), 'The Phantom');
  await page.screenshot({ path: join(screenshotDir, 'dialog-375.png') });
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => Boolean(document.activeElement?.closest('dialog'))), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.waitForTimeout(100);
  assert.equal(await firstConcept.evaluate(node => node === document.activeElement), true);
  for (const [index, title] of [[1, 'Dust Runner'], [2, 'Blackline']]) {
    const trigger = page.getByRole('button', { name: 'View Concept' }).nth(index);
    await trigger.click();
    assert.equal((await page.getByRole('dialog').locator('h2').textContent())?.trim(), title);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    assert.equal(await trigger.evaluate(node => node === document.activeElement), true);
  }
  console.log('gallery dialog: open, Escape, focus return');

  await firstConcept.click();
  await page.getByRole('button', { name: 'Discuss a Similar Project' }).click();
  await page.waitForFunction(() => document.querySelector('#projectType')?.value === 'Custom Build' && document.activeElement?.id === 'contact-title');
  assert.equal(await page.locator('#projectType').inputValue(), 'Custom Build');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'contact-title');
  console.log('gallery CTA: closes dialog and preselects Custom Build');

  await page.getByRole('link', { name: 'Discuss Upgrades' }).click();
  await page.waitForFunction(() => document.querySelector('#projectType')?.value === 'Upgrades');
  assert.equal(await page.locator('#projectType').inputValue(), 'Upgrades');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'contact-title');
  let formRequests = 0;
  page.on('request', () => formRequests++);
  await page.getByRole('button', { name: 'Check Project Details' }).click();
  assert.ok(await page.locator('#name-error').isVisible());
  await page.locator('#name').fill('Maxim');
  await page.locator('#email').fill('invalid-email');
  await page.locator('#message').fill('A practical motorcycle for daily rides.');
  await page.getByRole('button', { name: 'Check Project Details' }).click();
  assert.ok(await page.locator('#email-error').isVisible());
  await page.locator('#email').fill('max+build@example.com');
  await page.getByRole('button', { name: 'Check Project Details' }).click();
  assert.match(await page.getByRole('status').innerText(), /nothing has been sent or saved/i);
  assert.equal(formRequests, 0, 'form made a network request');
  assert.deepEqual(await page.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0]);
  console.log('form: prefill, validation, local check, no requests or storage');
  await page.close();
} finally {
  if (browser) await browser.close();
  vite.kill();
}
