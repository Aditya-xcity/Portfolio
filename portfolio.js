const header = document.querySelector('.site-header');
const desktopAppearance = header.querySelector('.theme-toggle');
const compactTitle = document.querySelector('.compact-title');
const pageLabel = compactTitle.textContent;
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const desktop = matchMedia('(min-width: 768px)');
const icons = {
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  projects: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  games: '<rect x="2" y="6" width="20" height="12" rx="5"/><path d="M6 12h5m-2.5-2.5v5m7-3.5h.01m3 2h.01"/>',
  book: '<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zm0 0v14"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  location: '<path d="M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0Z"/><circle cx="12" cy="9" r="2"/>',
  file: '<path d="M13 3H5v18h14V9zm0 0v6h6M8 13h8m-8 4h8"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};
const icon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;

const dock = document.createElement('div');
dock.className = 'mobile-dock';
dock.innerHTML = `
  <nav aria-label="Primary">
    <a href="/">${icon('home')}Home</a>
    <a href="/projects.html">${icon('projects')}Projects</a>
    <a href="/#games">${icon('games')}Games</a>
    <button type="button" aria-haspopup="dialog" aria-expanded="false">${icon('more')}More</button>
  </nav>`;

const panel = document.createElement('dialog');
panel.className = 'portfolio-panel';
panel.setAttribute('aria-labelledby', 'portfolio-panel-title');
panel.innerHTML = `
  <div class="panel-heading">
    <h2 id="portfolio-panel-title">More</h2>
    <button type="button" aria-label="Close" autofocus>×</button>
  </div>
  <div class="panel-links">
    <a href="/connect.html">Connect <span aria-hidden="true">↗</span></a>
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

const homeHero = document.querySelector('.home-hero');
if (homeHero) addPhoneHome(homeHero);

function addPhoneHome(hero) {
  const main = hero.parentElement;
  const phoneHome = document.createElement('section');
  phoneHome.className = 'phone-home';
  phoneHome.innerHTML = `
    <h1>Home</h1>
    <div class="phone-profile">
      <div>
        <h2></h2>
        <p class="phone-location">${icon('location')} Dehradun, India</p>
        <p class="intro"></p>
        <span class="phone-quote"></span>
      </div>
    </div>
    <p class="phone-bio"></p>
    <section><h2>Want Study Material?</h2><div class="phone-group"></div></section>
    <section><h2>Recent Work</h2><div class="phone-group"></div></section>`;
  phoneHome.querySelector('.phone-profile').prepend(hero.querySelector('img').cloneNode());
  phoneHome.querySelector('.phone-profile h2').textContent = hero.querySelector('h1').textContent;
  phoneHome.querySelector('.intro').textContent = hero.querySelector('.intro').textContent;
  phoneHome.querySelector('.phone-quote').textContent = hero.querySelector('figcaption').textContent;
  const bio = phoneHome.querySelector('.phone-bio');
  bio.textContent = hero.querySelector('.intro + p').textContent;

  const resume = main.querySelector('#resume .download').cloneNode();
  resume.className = 'phone-resume';
  resume.innerHTML = icon('file') + 'Download Resume';
  bio.after(resume);

  const [studyGroup, workGroup] = phoneHome.querySelectorAll('.phone-group');
  studyGroup.append(phoneRow(resources.href, 'Study Material', 'book'));
  const [khelo, pyq] = hero.nextElementSibling.querySelectorAll('.card');
  for (const [card, glyph, color] of [[khelo, 'games', 'khelo'], [pyq, 'layers', 'pyq']]) {
    const link = card.querySelector('.actions a');
    const row = phoneRow(link.href, card.querySelector('h3').textContent, glyph);
    row.querySelector('.phone-icon').classList.add(color);
    const description = card.querySelector('h3 + p').cloneNode(true);
    const stack = document.createElement('small');
    stack.textContent = card.querySelector('.muted').textContent;
    row.querySelector('.phone-row-copy').append(description, stack);
    workGroup.append(row);
  }

  const games = document.createElement('section');
  games.className = 'phone-games';
  games.id = 'games';
  games.innerHTML = '<h1 tabindex="-1">Games</h1>';
  main.prepend(phoneHome, games);
  document.documentElement.classList.add('has-phone-home');
}

function phoneRow(href, title, glyph) {
  const row = document.createElement('a');
  row.className = 'phone-row';
  row.href = href;
  row.innerHTML = `
    <span class="phone-icon">${icon(glyph)}</span>
    <span class="phone-row-copy"><strong></strong></span>
    <span class="phone-chevron">${icon('chevron')}</span>`;
  row.querySelector('strong').textContent = title;
  return row;
}

function updateCurrentPage() {
  const isHome = location.pathname === '/' || location.pathname === '/index.html';
  const isResume = isHome && location.hash === '#resume';
  const isGames = isHome && location.hash === '#games' && !desktop.matches;
  document.documentElement.classList.toggle('games-active', isGames);
  compactTitle.textContent = isGames ? 'Games' : isResume ? 'Résumé' : isHome ? 'Aditya Bhardwaj' : pageLabel;
  for (const link of document.querySelectorAll('.site-header nav a:not(.brand), .mobile-dock a, .panel-links a')) {
    const url = new URL(link.href);
    const current = url.origin === location.origin && (url.hash
      ? (isResume && url.hash === '#resume') || (isGames && url.hash === '#games')
      : url.pathname === '/' ? isHome && (!isResume || dock.contains(link)) && (!isGames || !dock.contains(link)) : url.pathname === location.pathname);
    if (current) link.setAttribute('aria-current', url.hash ? 'location' : 'page');
    else link.removeAttribute('aria-current');
  }
}
function updateScrollTitle() {
  compactTitle.classList.toggle('is-visible', scrollY > 100);
}
window.addEventListener('hashchange', () => {
  updateCurrentPage();
  if (document.documentElement.classList.contains('games-active')) {
    document.querySelector('.phone-games h1').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  } else if (!location.hash && homeHero && !desktop.matches) {
    window.scrollTo(0, 0);
  }
});
desktop.addEventListener('change', updateCurrentPage);
window.addEventListener('scroll', updateScrollTitle, { passive: true });
updateCurrentPage();
updateScrollTitle();
