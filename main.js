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

/* ==============================
   PROYECTOS — VER MÁS / COMPRIMIR
============================== */
(function () {
  const grid   = document.getElementById('proyectos-grid');
  const toggle = document.getElementById('projectsToggle');
  const wrap   = document.getElementById('projectsMoreWrap');
  if (!grid || !toggle || !wrap) return;

  // Si no hay proyectos extra, ocultamos el botón
  const extras = grid.querySelectorAll('.project-extra');
  if (extras.length === 0) {
    wrap.style.display = 'none';
    return;
  }

  const label = toggle.querySelector('.projects-toggle-label');

  toggle.addEventListener('click', () => {
    const expanded = grid.classList.toggle('expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? 'Mostrar menos' : 'Ver más proyectos';

    // Al comprimir, volvemos al inicio de la sección para no quedar perdidos
    if (!expanded) {
      document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();

/* ==============================
   FORMULARIO DE CONTACTO
============================== */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // FormSubmit (endpoint AJAX). Tras el primer envío, hay que confirmar el mail una sola vez.
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/contacto@leandroheffes.com';

  const fields = {
    nombre:   form.querySelector('#cf-nombre'),
    email:    form.querySelector('#cf-email'),
    whatsapp: form.querySelector('#cf-whatsapp'),
    mensaje:  form.querySelector('#cf-mensaje'),
  };
  const submitBtn = form.querySelector('#cf-submit');
  const statusEl  = form.querySelector('#cf-status');
  const successEl = document.getElementById('cf-success');
  const honey     = form.querySelector('.form-honey');

  function setError(name, msg) {
    const input = fields[name];
    const errEl = document.getElementById('err-' + name);
    if (errEl) errEl.textContent = msg || '';
    if (input) {
      input.classList.toggle('invalid', !!msg && msg.trim() !== '');
      if (msg && msg.trim() !== '') input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }

  function clearErrors() {
    ['nombre', 'email', 'whatsapp', 'mensaje'].forEach(n => setError(n, ''));
    statusEl.textContent = '';
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function validate() {
    clearErrors();
    let firstInvalid = null;

    const nombre   = fields.nombre.value.trim();
    const email    = fields.email.value.trim();
    const whatsapp = fields.whatsapp.value.trim();
    const mensaje  = fields.mensaje.value.trim();

    if (!nombre) {
      setError('nombre', 'Decime tu nombre así sé cómo dirigirme a vos.');
      firstInvalid = firstInvalid || fields.nombre;
    }

    if (!email && !whatsapp) {
      setError('email', 'Dejá al menos un medio de contacto: email o WhatsApp.');
      setError('whatsapp', ' '); // marca visual sin texto duplicado
      firstInvalid = firstInvalid || fields.email;
    } else if (email && !isValidEmail(email)) {
      setError('email', 'Revisá el email, parece que falta algo.');
      firstInvalid = firstInvalid || fields.email;
    }

    if (!mensaje) {
      setError('mensaje', 'Contame brevemente qué necesitás.');
      firstInvalid = firstInvalid || fields.mensaje;
    }

    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // Limpiar errores a medida que el usuario corrige
  Object.keys(fields).forEach(name => {
    fields[name].addEventListener('input', () => {
      if (fields[name].classList.contains('invalid')) setError(name, '');
      // Error cruzado email/whatsapp: si completa uno, lo limpiamos
      if (name === 'email' || name === 'whatsapp') {
        if (fields.email.value.trim() || fields.whatsapp.value.trim()) {
          const errEmail = document.getElementById('err-email');
          if (errEmail && errEmail.textContent.includes('medio de contacto')) {
            setError('email', '');
            setError('whatsapp', '');
          }
        }
      }
    });
  });

  function setLoading(loading) {
    submitBtn.classList.toggle('is-loading', loading);
    submitBtn.disabled = loading;
  }

  function showSuccess() {
    form.hidden = true;
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: si está completo, es un bot → mostramos éxito sin enviar nada
    if (honey && honey.value) { showSuccess(); return; }

    if (!validate()) return;

    setLoading(true);
    statusEl.textContent = '';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        showSuccess();
      } else {
        throw new Error('Respuesta no válida del servidor.');
      }
    } catch (err) {
      setLoading(false);
      statusEl.textContent = 'Uy, no se pudo enviar el mensaje. Probá de nuevo en un momento o escribime directo por WhatsApp acá abajo.';
    }
  });
})();