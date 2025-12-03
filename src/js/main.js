const hamburger = document.getElementById('hamburger-menu');
const mobileNav = document.getElementById('mobile-navbar');

function toggleNav() {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
}

function closeNav() {
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', (e) => {
    toggleNav();
  });

  document.addEventListener('click', (e) => {
    if (e.target !== hamburger && !hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      closeNav();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
    }
  });
}