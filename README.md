# CARBON DETAIL

A complete English-language website concept for a **fictional** automotive detailing studio in Dubai, United Arab Emirates. The studio, service offers, prices, address and example reviews are illustrative.

Four static pages: Home, Services, About, and Contact & Booking. Local photographs and fonts, a silent 30-second hero film, responsive layouts, accessible mobile navigation, service details, reduced-motion support and service-specific WhatsApp enquiry links. The links prepare a message; the visitor sends it, and no booking is automatically confirmed.

## Live website

https://markdeizin-design.github.io/carbon-detail-dubai-concept/

GitHub Pages serves the built site from the root of the `gh-pages` branch. Source files remain on `main`. After editing, rebuild and update the publishing branch with the contents of `dist/`.

## Run

Requires Node.js 20 or newer. No package installation or runtime dependencies.

```sh
npm run build
npm test
npm start
```

Open http://127.0.0.1:4173. The generated `dist/` directory can also be hosted by any static web host. All page links are relative, so subdirectory hosting works.

## Edit

- `src/render.mjs`: page content and shared layout.
- `src/services.mjs`: services, concept prices and WhatsApp message generation.
- `src/app.mjs`: menu, scroll behavior, service selection and media controls.
- `src/styles.css`: responsive styles in the four-colour palette.
- `dist/assets/`: local photos, fonts, favicon, poster and video; keep this directory when rebuilding.
- `scripts/build.mjs`: produces the four HTML pages and copies the browser modules/styles.
- `tests/`: built-in Node tests for booking messages, page integrity and interaction behavior.

Rebuild after changes to `src/`. If the video is removed, the build explicitly switches to a photographic fallback with a film-pending label.

## Media and validation

Photo and font provenance: [ASSETS.md](ASSETS.md). User-supplied video source, inspected scene times and edit parameters: [VIDEO-SOURCES.md](VIDEO-SOURCES.md). The supplied YouTube source does not state a separate reuse licence; independent commercial reuse rights have not been verified. Confirm those rights before using the footage for a real business.

See [CHECKS.md](CHECKS.md) for verification details. This concept does not include payments, accounts, a database, a booking backend or fabricated booking confirmations.
