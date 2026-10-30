import { services, whatsappUrl, bookingMessage } from './services.mjs';

const select = document.querySelector('#service-select');
if (select) {
  const requested = new URLSearchParams(location.search).get('service');
  if (services.some(service => service.id === requested)) select.value = requested;
  const updateBooking = () => {
    document.querySelector('#booking-link').href = whatsappUrl(select.value);
    document.querySelector('#booking-preview').textContent = bookingMessage(select.value);
  };
  select.addEventListener('change', updateBooking);
  updateBooking();
}

const header = document.querySelector('#site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const mobile = matchMedia('(max-width: 900px)');
let menuOpen = false;
function setMenu(open) {
  menuOpen = open;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  header.classList.toggle('menu-open', open);
  header.classList.remove('header-hidden');
  nav.inert = mobile.matches && !open;
}
setMenu(false);
toggle.addEventListener('click', () => {
  setMenu(!menuOpen);
  if (menuOpen) nav.querySelector('a').focus();
});
mobile.addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuOpen) { setMenu(false); toggle.focus(); }
});
document.addEventListener('click', event => {
  if (menuOpen && !header.contains(event.target)) setMenu(false);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
header.addEventListener('focusin', () => header.classList.remove('header-hidden'));

let lastY = window.scrollY;
let travel = 0;
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    if (Math.sign(delta) !== Math.sign(travel)) travel = 0;
    travel += delta;
    if (y < 100 || menuOpen || header.contains(document.activeElement)) {
      header.classList.remove('header-hidden'); travel = 0;
    } else if (travel > 70) {
      header.classList.add('header-hidden');
    } else if (travel < -25) {
      header.classList.remove('header-hidden');
    }
    lastY = y;
    ticking = false;
  });
}, { passive: true });

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
if (!reduced.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('will-reveal'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight) el.classList.add('will-reveal');
    observer.observe(el);
  });
}

const video = document.querySelector('#hero-video');
const videoControl = document.querySelector('#video-control');
if (video && videoControl) {
  const loadVideo = () => {
    const source = video.querySelector('source');
    if (!source.src) { source.src = source.dataset.src; video.load(); }
  };
  const syncVideoControl = () => {
    videoControl.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
    videoControl.querySelector('.video-label').textContent = video.paused ? 'Play film' : 'Pause film';
    videoControl.querySelector('.pause-symbol').textContent = video.paused ? '▷' : 'Ⅱ';
  };
  const applyMotionPreference = () => {
    if (reduced.matches) { video.autoplay = false; video.pause(); video.removeAttribute('autoplay'); }
    else { loadVideo(); }
    syncVideoControl();
  };
  video.addEventListener('play', syncVideoControl);
  video.addEventListener('pause', syncVideoControl);
  video.addEventListener('error', () => { videoControl.hidden = true; });
  videoControl.addEventListener('click', () => {
    if (video.paused) { loadVideo(); video.play().catch(() => { videoControl.querySelector('.video-label').textContent = 'Film unavailable'; }); }
    else video.pause();
  });
  reduced.addEventListener('change', applyMotionPreference);
  applyMotionPreference();
}
