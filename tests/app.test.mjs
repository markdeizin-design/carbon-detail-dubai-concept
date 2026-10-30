import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import { services, whatsappUrl, bookingMessage } from '../src/services.mjs';
import { renderPage } from '../src/render.mjs';

const app = readFileSync(new URL('../src/app.mjs', import.meta.url), 'utf8').replace(/^import[^\n]+\n/, '');
function boot(reducedMotion = false, search = '') {
  const element = () => ({
    listeners: {}, attributes: {}, value: '', textContent: '',
    addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); },
    fire(type, event = {}) { this.listeners[type]?.forEach(fn => fn(event)); },
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; },
    focus() { document.activeElement = this; },
  });
  const select = element(), link = element(), preview = element(), toggle = element(), firstLink = element();
  const nav = Object.assign(element(), { querySelector: () => firstLink });
  const classes = new Set();
  const header = Object.assign(element(), {
    classList: { add: key => classes.add(key), remove: key => classes.delete(key), toggle: (key, on) => on ? classes.add(key) : classes.delete(key) },
    contains: target => [toggle, nav, firstLink].includes(target),
  });
  const source = { src: '', dataset: { src: './assets/hero.mp4' } };
  const label = element(), symbol = element();
  const video = Object.assign(element(), {
    paused: true, autoplay: true, loads: 0,
    querySelector: () => source,
    load() { this.loads++; },
    pause() { this.paused = true; this.fire('pause'); },
    play() { this.paused = false; this.fire('play'); return Promise.resolve(); },
  });
  const control = Object.assign(element(), { querySelector: key => key === '.video-label' ? label : symbol });
  const nodes = { '#service-select': select, '#booking-link': link, '#booking-preview': preview, '#site-header': header, '.menu-toggle': toggle, '#main-nav': nav, '#hero-video': video, '#video-control': control };
  const document = Object.assign(element(), { activeElement: null, querySelector: key => nodes[key] ?? null });
  const reduced = Object.assign(element(), { matches: reducedMotion });
  const mobile = Object.assign(element(), { matches: true });
  const window = Object.assign(element(), { scrollY: 0 });
  runInNewContext(app, { document, window, location: { search }, URLSearchParams, services, whatsappUrl, bookingMessage, matchMedia: query => query.includes('reduced-motion') ? reduced : mobile, requestAnimationFrame: fn => fn() }, { timeout: 1000 });
  return { select, link, preview, nav, toggle, firstLink, document, source, video, control, label, reduced, window, classes };
}

test('reduced motion leaves the video source unattached until an explicit play click', () => {
  const sourceTag = renderPage('home', true).match(/<source\b[^>]*>/)[0];
  assert.match(sourceTag, /data-src="\.\/assets\/hero\.mp4"/);
  assert.doesNotMatch(sourceTag, /\ssrc=/);
  const ui = boot(true);
  assert.equal(ui.source.src, '');
  assert.equal(ui.video.loads, 0);
  assert.equal(ui.video.autoplay, false);
  assert.equal(ui.video.paused, true);
  ui.control.fire('click');
  assert.equal(ui.source.src, './assets/hero.mp4');
  assert.equal(ui.video.paused, false);
});

test('normal motion loads once and video controls keep play/pause labels in sync', () => {
  const ui = boot();
  assert.equal(ui.source.src, './assets/hero.mp4');
  assert.equal(ui.video.loads, 1);
  ui.control.fire('click');
  assert.equal(ui.video.paused, false);
  assert.equal(ui.label.textContent, 'Pause film');
  ui.control.fire('click');
  assert.equal(ui.video.paused, true);
  assert.equal(ui.control.attributes['aria-label'], 'Play background video');
  assert.equal(ui.video.loads, 1);
});

test('mobile navigation is inert while closed and moves focus on open and Escape', () => {
  const ui = boot();
  assert.equal(ui.nav.inert, true);
  ui.toggle.fire('click');
  assert.equal(ui.nav.inert, false);
  assert.equal(ui.document.activeElement, ui.firstLink);
  ui.document.fire('keydown', { key: 'Escape' });
  assert.equal(ui.nav.inert, true);
  assert.equal(ui.document.activeElement, ui.toggle);
});

test('requested service and selection changes update the actual booking link and preview', () => {
  const ui = boot(false, '?service=interior-cleaning');
  assert.equal(ui.select.value, 'interior-cleaning');
  for (const { id } of services) {
    ui.select.value = id;
    ui.select.fire('change');
    assert.equal(ui.link.href, whatsappUrl(id));
    assert.equal(ui.preview.textContent, bookingMessage(id));
  }
});
