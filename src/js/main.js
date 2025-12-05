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

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof APP_CONSTANTS === 'undefined') return;

    // Instagram
    const instaPersonal = document.getElementById('link-insta-personal');
    const instaBrand = document.getElementById('link-insta-brand');
    const instaIcon = document.getElementById('icon-insta-brand');

    if (instaPersonal) instaPersonal.href = APP_CONSTANTS.instagram.personalUrl;
    if (instaBrand) instaBrand.href = APP_CONSTANTS.instagram.brandUrl;
    if (instaIcon) instaIcon.src = APP_CONSTANTS.instagram.icon;

    // Twitter / X
    const twitterBrand = document.getElementById('link-twitter-brand');
    const twitterIcon = document.getElementById('icon-twitter-brand');

    if (twitterBrand) twitterBrand.href = APP_CONSTANTS.twitter.brandUrl;
    if (twitterIcon) twitterIcon.src = APP_CONSTANTS.twitter.icon;
});