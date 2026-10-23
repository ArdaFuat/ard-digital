const navToggle = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
if (navToggle && navLinks) {
  navLinks.id = 'site-navigation';
  navToggle.setAttribute('aria-controls', navLinks.id);
  navToggle.setAttribute('aria-expanded', 'false');
  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menüyü aç');
  };
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const form = document.querySelector('[data-contact-form]');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const service = data.get('service') || '';
    const budget = data.get('budget') || '';
    const message = data.get('message') || '';
    const body = [
      `Merhaba ARD Digital,`,
      ``,
      `Ad / Marka: ${name}`,
      `İlgilendiğim hizmet: ${service}`,
      `Tahmini bütçe: ${budget}`,
      ``,
      `Proje notu:`,
      `${message}`
    ].join('\n');
    const subject = encodeURIComponent('Web sitesi projesi için teklif');
    const mailBody = encodeURIComponent(body);
    window.location.href = `mailto:ardamevk12@gmail.com?subject=${subject}&body=${mailBody}`;
  });
}
