import { mkdir, writeFile, copyFile, access } from 'node:fs/promises';
import { renderPage } from '../src/render.mjs';

await mkdir('dist', { recursive: true });
let hasVideo = false;
try { await access('dist/assets/hero.mp4'); hasVideo = true; } catch {}
for (const [page, file] of Object.entries({ home: 'index.html', services: 'services.html', about: 'about.html', contact: 'contact.html' })) {
  await writeFile(`dist/${file}`, renderPage(page, hasVideo));
}
for (const file of ['styles.css', 'app.mjs', 'services.mjs']) await copyFile(`src/${file}`, `dist/${file}`);
console.log(`Built 4 static pages. Hero: ${hasVideo ? 'source video' : 'photographic fallback; source video pending'}.`);
