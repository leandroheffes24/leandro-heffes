/* ==============================
   CUSTOM CURSOR
============================== */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* ==============================
   NAVBAR — SCROLL EFFECT
============================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ==============================
   MOBILE MENU
============================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

/* ==============================
   SCROLL REVEAL
============================== */
/* const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el)); */
const reveals = document.querySelectorAll('.reveal');

// Ocultamos por JS, no por CSS — así Clarity y otros tools ven el contenido
reveals.forEach(el => el.classList.add('hidden'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

/* ==============================
   SCROLL SPY — ACTIVE NAV LINK
============================== */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--gold)'
      : '';
  });
});

/* ==============================
   MARQUEE — DUPLICAR CONTENIDO
============================== */
const track = document.querySelector('.statement-track');
if (track) track.innerHTML += track.innerHTML;

function copiarMail() {
  navigator.clipboard.writeText('contacto@leandroheffes.com');
  const texto = document.getElementById('mail-btn-text');
  texto.textContent = '¡Mail copiado!';
  setTimeout(() => {
    texto.textContent = 'contacto@leandroheffes.com';
  }, 2000);
}