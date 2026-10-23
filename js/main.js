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

// Open screenshot galleries over the current page.
const galleryLinks = [...document.querySelectorAll('.game-screenshot-grid a, .tomorrow-screen-grid a')];
const imageTriggers = [...galleryLinks];

if (imageTriggers.length) {
  const viewer = document.createElement('dialog');
  viewer.className = 'image-viewer';
  viewer.setAttribute('aria-labelledby', 'viewer-title');
  viewer.innerHTML = `
    <div class="viewer-shell">
      <header class="viewer-header"><span class="viewer-label">ARD Digital / Galeri</span><button type="button" class="viewer-close" aria-label="Galeriyi kapat">Kapat <span aria-hidden="true">×</span></button></header>
      <div class="viewer-stage"><button type="button" class="viewer-arrow viewer-prev" aria-label="Önceki görsel">‹</button><img class="viewer-image" alt=""><button type="button" class="viewer-arrow viewer-next" aria-label="Sonraki görsel">›</button></div>
      <footer class="viewer-footer"><div class="viewer-caption" aria-live="polite"><h2 id="viewer-title"></h2><p></p></div><div class="viewer-thumbnails" role="group" aria-label="Galerideki görseller"></div></footer>
    </div>`;
  document.body.append(viewer);
  const largeImage = viewer.querySelector('.viewer-image');
  const title = viewer.querySelector('#viewer-title');
  const description = viewer.querySelector('.viewer-caption p');
  const thumbnails = viewer.querySelector('.viewer-thumbnails');
  const previous = viewer.querySelector('.viewer-prev');
  const next = viewer.querySelector('.viewer-next');
  let group = [];
  let current = 0;
  let opener;
  let savedOverflow;

  function display(index) {
    current = (index + group.length) % group.length;
    const trigger = group[current];
    const img = trigger.querySelector('img');
    const figure = trigger.closest('figure');
    largeImage.src = trigger.tagName === 'A' ? trigger.href : img.currentSrc || img.src;
    largeImage.alt = img.alt;
    title.textContent = figure?.querySelector('h3, figcaption strong')?.textContent || img.alt || 'Görsel';
    description.textContent = figure?.querySelector('figcaption p, figcaption span')?.textContent || '';
    [...thumbnails.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    thumbnails.children[current]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  imageTriggers.forEach(trigger => {
    trigger.setAttribute('aria-haspopup', 'dialog');
    if (trigger.tagName === 'A') trigger.removeAttribute('target');
    trigger.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = trigger;
      const gallery = trigger.closest('.game-gallery, .tomorrow-screens');
      group = gallery ? galleryLinks.filter(link => gallery.contains(link)) : [trigger];
      thumbnails.replaceChildren();
      group.forEach((item, index) => {
        const img = item.querySelector('img');
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', img.alt || 'Görseli göster');
        const thumb = document.createElement('img');
        thumb.src = img.currentSrc || img.src;
        thumb.alt = '';
        thumb.loading = 'lazy';
        button.append(thumb);
        button.addEventListener('click', () => display(index));
        thumbnails.append(button);
      });
      previous.hidden = next.hidden = thumbnails.hidden = group.length < 2;
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      viewer.showModal();
      display(group.indexOf(trigger));
      viewer.querySelector('.viewer-close').focus();
    });
  });
  previous.addEventListener('click', () => display(current - 1));
  next.addEventListener('click', () => display(current + 1));
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      display(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('close', () => {
    document.body.style.overflow = savedOverflow;
    opener?.focus({ preventScroll: true });
    largeImage.removeAttribute('src');
  });
}

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
