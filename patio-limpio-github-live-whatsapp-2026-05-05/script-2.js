/* ============================================================
   Patio Limpio PR — Main JS
   ============================================================ */

/* --- Google Sheets endpoint ---
   Replace this URL with your deployed Google Apps Script Web App URL.
   Setup instructions: see /leads/SETUP.md in this project.
   ----------------------------------------------------------- */
const SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

/* --- Language Toggle --- */
const LANG_KEY = 'plpr_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'es';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('lang-visible', el.dataset.lang === lang);
  });

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.set === lang);
  });

  document.documentElement.lang = lang === 'es' ? 'es-PR' : 'en';
}

document.querySelectorAll('.lang-toggle button').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.set));
});

setLang(currentLang);

/* --- Nav scroll shadow --- */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* --- Mobile nav toggle --- */
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');

hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav__mobile a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* --- Scroll-triggered fade-up animations --- */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/* --- Quote Form → WhatsApp Lead Capture --- */
const quoteForm = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
const WHATSAPP_NUMBER = '19394387228';

if (quoteForm) {
  quoteForm.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = quoteForm.querySelector('[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> <span>Enviando…</span>';

    const data = {
      timestamp:     new Date().toLocaleString('es-PR', { timeZone: 'America/Puerto_Rico' }),
      name:          quoteForm.name.value.trim(),
      phone:         quoteForm.phone.value.trim(),
      email:         quoteForm.email.value.trim(),
      service:       quoteForm.service.selectedOptions[0]?.textContent.trim() || '',
      property_type: quoteForm.property_type.selectedOptions[0]?.textContent.trim() || '',
      message:       quoteForm.message.value.trim(),
      source:        'Website — patiolimpio.pr',
    };

    const message = [
      'Hola, me interesa una cotización para mi propiedad.',
      '',
      `Nombre: ${data.name}`,
      `Teléfono: ${data.phone}`,
      `Correo: ${data.email || 'No incluido'}`,
      `Servicio: ${data.service || 'No seleccionado'}`,
      `Tipo de propiedad: ${data.property_type || 'No seleccionado'}`,
      `Mensaje: ${data.message || 'No incluido'}`,
      '',
      `Enviado desde: ${data.source}`,
      `Fecha: ${data.timestamp}`,
    ].join('\n');

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  });
}

/* --- Smooth anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
