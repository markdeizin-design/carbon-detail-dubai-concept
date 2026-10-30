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
    for (const [, rawTarget] of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      const target = rawTarget.split('?')[0];
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
  assert.deepEqual(options.map(([, id, label]) => [id, label]), services.map(({ id, name }) => [id, name]));
});

test('home introduces the studio while prices and service details stay on Services', () => {
  const home = renderPage('home', true);
  assert.match(home, /Care for the way<br> you drive\./);
  assert.doesNotMatch(home, /intro-strip|service-card|Book this service|AED/);
  const servicePage = renderPage('services');
  for (const service of services) {
    assert.ok(servicePage.includes(`id="${service.id}"`));
    assert.ok(servicePage.includes(`AED ${service.price}`));
  }
});

test('page actions have text labels without decorative arrow icons', () => {
  for (const page of pages) {
    const html = renderPage(page, true);
    for (const [, content] of html.matchAll(/<a\b[^>]*class="[^"]*\b(?:button|text-link|mobile-book|scroll-cue)\b[^"]*"[^>]*>([\s\S]*?)<\/a>/g)) {
      assert.doesNotMatch(content, /<svg|[↗→↓]/);
    }
    assert.doesNotMatch(html, /M5 12h14|M6 18 18 6/);
  }
});
