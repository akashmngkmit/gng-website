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

document.addEventListener('DOMContentLoaded', () => {
    if (typeof APP_CONSTANTS !== 'undefined') {
        const instaPersonal = document.getElementById('link-insta-personal');
        const instaBrand = document.getElementById('link-insta-brand');
        const twitterBrand = document.getElementById('link-twitter-brand');

        if (instaPersonal) instaPersonal.href = APP_CONSTANTS.socials.personalInstagram;
        if (instaBrand) instaBrand.href = APP_CONSTANTS.socials.brandInstagram;
        if (twitterBrand) twitterBrand.href = APP_CONSTANTS.socials.brandTwitter;
    }
});