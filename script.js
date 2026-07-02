const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const revealEls = document.querySelectorAll('.reveal');
const cursorGlow = document.querySelector('.cursor-glow');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 18);
});

menuButton?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});


const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealEls.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 5, 4) * 65}ms`;
  revealObserver.observe(el);
});

window.addEventListener('pointermove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const form = document.querySelector('.contact-form');
form?.addEventListener('submit', () => {
  const button = form.querySelector('button');
  const original = button.textContent;
  button.textContent = 'Enquiry captured';
  setTimeout(() => { button.textContent = original; }, 1800);
});

const teamFilters = document.querySelectorAll('.team-filter');
const teamCards = document.querySelectorAll('.employee-grid .employee-card');
teamFilters.forEach((filterButton) => {
  filterButton.addEventListener('click', () => {
    const selected = filterButton.dataset.filter;
    teamFilters.forEach((button) => button.classList.remove('is-active'));
    filterButton.classList.add('is-active');
    teamCards.forEach((card) => {
      const match = selected === 'all' || card.dataset.team === selected;
      card.classList.toggle('is-hidden', !match);
    });
  });
});


// V9 team tab switching with deep-link support.
const teamTabs = document.querySelectorAll('[data-team-tab]');
const teamPanels = document.querySelectorAll('[data-team-panel]');
function activateTeamPanel(panelName) {
  if (panelName === 'employees') panelName = 'team';
  if (!panelName || !document.querySelector(`[data-team-panel="${panelName}"]`)) return;
  teamTabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.teamTab === panelName));
  teamPanels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.teamPanel === panelName));

  document.body.classList.remove('team-tab-founders', 'team-tab-directors-poc', 'team-tab-team');
  document.body.classList.add(`team-tab-${panelName}`);
}
teamTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activateTeamPanel(tab.dataset.teamTab);
    const target = document.getElementById(tab.dataset.teamTab);
    if (target) history.replaceState(null, '', `#${tab.dataset.teamTab}`);
  });
});
const initialPanel = window.location.hash.replace('#','');
if (initialPanel) activateTeamPanel(initialPanel);
window.addEventListener('hashchange', () => activateTeamPanel(window.location.hash.replace('#','')));

// Running investor text pause / play control.
const runningTextToggles = document.querySelectorAll('.running-text-toggle');
runningTextToggles.forEach((button) => {
  button.addEventListener('click', () => {
    const ticker = button.closest('.official-running-text');
    if (!ticker) return;
    const paused = ticker.classList.toggle('is-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.setAttribute('aria-label', paused ? 'Play investor information ticker' : 'Pause investor information ticker');
    button.textContent = paused ? 'Play' : 'Pause';
  });
});


// Default team page hero state when opening Meet Our Team without a hash.
if (document.querySelector('.team-tabs-section') && !document.body.classList.contains('team-tab-founders') && !document.body.classList.contains('team-tab-directors-poc') && !document.body.classList.contains('team-tab-team')) {
  activateTeamPanel(window.location.hash.replace('#','') || 'founders');
}

// Light / dark theme toggle. Dark (navy accent panels) is the default look;
// the inline head script already applied 'light' before first paint if saved.
const THEME_KEY = 'vq-theme';
const themeToggle = document.getElementById('themeToggle');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isLight = theme === 'light';
  if (themeToggle) {
    themeToggle.setAttribute('aria-checked', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  }
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', isLight ? '#f7f1e2' : '#061a35');
  }
}

if (themeToggle) {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme(next);
  });
}
