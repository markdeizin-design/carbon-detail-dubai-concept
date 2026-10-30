import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { renderPage } from '../src/render.mjs';
import { services } from '../src/services.mjs';

const pages = ['home', 'services', 'about', 'contact'];
const pageFiles = new Set(['./', './index.html', './services.html', './about.html', './contact.html']);

for (const page of pages) {
  test(`${page} renders an English page with valid local links and assets`, () => {
    const html = renderPage(page, true);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /Concept website — fictional detailing studio\./);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
    assert.match(html, /<main id="main">/);
    for (const [, target] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      if (target.startsWith('./assets/') || target === './styles.css' || target === './app.mjs') {
        assert.ok(existsSync(new URL(`../dist/${target.slice(2)}`, import.meta.url)), `${page}: missing ${target}`);
      } else if (target.startsWith('#')) {
        assert.ok(html.includes(`id="${target.slice(1)}"`), `${page}: missing anchor ${target}`);
      } else if (target.startsWith('./')) {
        assert.ok(pageFiles.has(target.split('#')[0]), `${page}: unknown local page ${target}`);
      }
    }
    const visibleText = html.replace(/<[^>]*>/g, '');
    assert.ok(!visibleText.includes('971545797649'), `${page}: real WhatsApp destination exposed as text`);
  });
}

test('booking choices use the service IDs and advertised names', () => {
  const html = renderPage('contact');
  const options = [...html.matchAll(/<option value="([^"]*)">([^<]+)<\/option>/g)].slice(1);
  assert.deepEqual(options.map(([, id, label]) => [id, label]), services.map(({ id, name, price }) => [id, `${name} — from AED ${price}`]));
});
