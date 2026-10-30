import assert from 'node:assert/strict';
import test from 'node:test';
import { services, bookingMessage, whatsappUrl } from '../src/services.mjs';

const offers = [
  ['hand-wash', 'Signature Hand Wash', '150'],
  ['interior-cleaning', 'Interior Deep Cleaning', '450'],
  ['paint-correction', 'Paint Correction', '900'],
  ['ceramic-coating', 'Ceramic Coating', '1,500'],
];

test('the four selectable service IDs map to the advertised names and prices', () => {
  assert.deepEqual(services.map(({ id, name, price }) => [id, name, price]), offers);
  assert.equal(new Set(services.map(service => service.id)).size, 4);
});

for (const [id, name, price] of offers) {
  test(`selecting ${id} prepares the matching WhatsApp message`, () => {
    const message = `Hi CARBON DETAIL! I’d like to book ${name}, shown from AED ${price} on your concept website. Please let me know your availability.`;
    const url = new URL(whatsappUrl(id));
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/971545797649');
    assert.deepEqual([...url.searchParams.keys()], ['text']);
    assert.equal(url.searchParams.get('text'), message);
    assert.equal(bookingMessage(id), message);
    assert.equal(url.search.slice(1), `text=${encodeURIComponent(message)}`);
  });
}

test('general booking and unknown selections ask for service advice', () => {
  const message = 'Hi CARBON DETAIL! I found your concept website and would like help choosing a detailing service. Please let me know your availability.';
  for (const selection of [undefined, '', 'unknown', 'Interior Deep Cleaning', 'hand-wash&text=other']) {
    assert.equal(bookingMessage(selection), message);
    assert.equal(new URL(whatsappUrl(selection)).searchParams.get('text'), message);
  }
});
