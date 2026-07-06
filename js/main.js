const navToggle = document.querySelector('[data-menu-toggle]');
const navLinks = document.querySelector('[data-nav-links]');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));
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
    window.location.href = `mailto:info@ard-digital.com?subject=${subject}&body=${mailBody}`;
  });
}
