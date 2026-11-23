const header = document.querySelector('.site-header');
const desktopAppearance = header.querySelector('.theme-toggle');
const compactTitle = document.querySelector('.compact-title');
const pageLabel = compactTitle.textContent;
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const desktop = matchMedia('(min-width: 768px)');
const icons = {
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  projects: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  connect: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;

const dock = document.createElement('div');
dock.className = 'mobile-dock';
dock.innerHTML = `
  <nav aria-label="Primary">
    <a href="/">${icon('home')}Home</a>
    <a href="/projects.html">${icon('projects')}Projects</a>
    <a href="/connect.html">${icon('connect')}Connect</a>
  </nav>
  <button type="button" aria-label="More" aria-haspopup="dialog" aria-expanded="false">${icon('more')}</button>`;

const panel = document.createElement('dialog');
panel.className = 'portfolio-panel';
panel.setAttribute('aria-labelledby', 'portfolio-panel-title');
panel.innerHTML = `
  <div class="panel-heading">
    <h2 id="portfolio-panel-title">More</h2>
    <button type="button" aria-label="Close" autofocus>×</button>
  </div>
  <div class="panel-links">
    <a href="/#resume">Résumé <span aria-hidden="true">↗</span></a>
  </div>
  <fieldset>
    <legend>Appearance</legend>
    <label><input type="radio" name="appearance" value="system">System</label>
    <label><input type="radio" name="appearance" value="light">Light</label>
    <label><input type="radio" name="appearance" value="dark">Dark</label>
  </fieldset>`;
const resources = header.querySelector('a[href*="portfolio-resource-hub"]').cloneNode(true);
panel.querySelector('.panel-links').append(resources);
document.body.append(dock, panel);
document.documentElement.classList.add('has-dock');

const more = dock.querySelector('button');
desktopAppearance.hidden = false;
desktopAppearance.setAttribute('aria-expanded', 'false');
let opener;
function openPanel(button) {
  opener = button;
  panel.querySelector('h2').textContent = button === more ? 'More' : 'Appearance';
  panel.querySelector('.panel-links').hidden = button !== more;
  panel.showModal();
  opener.setAttribute('aria-expanded', 'true');
}
more.addEventListener('click', () => openPanel(more));
desktopAppearance.addEventListener('click', () => openPanel(desktopAppearance));
panel.querySelector('.panel-heading button').addEventListener('click', () => panel.close());
panel.addEventListener('click', event => {
  if (event.target.closest('a')) panel.close();
  if (event.target !== panel) return;
  const bounds = panel.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) panel.close();
});
panel.addEventListener('close', () => {
  opener?.setAttribute('aria-expanded', 'false');
  if (opener?.getClientRects().length) opener.focus({ preventScroll: true });
});
desktop.addEventListener('change', () => {
  if (panel.open) panel.close();
});

let preference = 'system';
try {
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light' || saved === 'dark') preference = saved;
} catch {}
function applyTheme() {
  document.documentElement.dataset.theme =
    preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
  panel.querySelector(`input[value="${preference}"]`).checked = true;
}
panel.addEventListener('change', event => {
  if (event.target.name !== 'appearance') return;
  preference = event.target.value;
  try { localStorage.setItem('portfolio-theme', preference); } catch {}
  applyTheme();
});
systemTheme.addEventListener('change', applyTheme);
applyTheme();

function updateCurrentPage() {
  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  const isResume = isHome && location.hash === '#resume';
  compactTitle.textContent = isResume ? 'Résumé' : isHome ? 'Aditya Bhardwaj' : pageLabel;
  for (const link of document.querySelectorAll('.site-header nav a:not(.brand), .mobile-dock a, .panel-links a')) {
    const url = new URL(link.href);
    const current = url.origin === location.origin && (url.hash
      ? isResume && url.hash === '#resume'
      : url.pathname === '/' ? isHome && (!isResume || dock.contains(link)) : url.pathname === location.pathname);
    if (current) link.setAttribute('aria-current', url.hash ? 'location' : 'page');
    else link.removeAttribute('aria-current');
  }
}
function updateScrollTitle() {
  compactTitle.classList.toggle('is-visible', scrollY > 100);
}
window.addEventListener('hashchange', updateCurrentPage);
window.addEventListener('scroll', updateScrollTitle, { passive: true });
updateCurrentPage();
updateScrollTitle();
