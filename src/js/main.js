const hamburger = document.getElementById('hamburger-menu');
const mobileNav = document.getElementById('mobile-navbar');

function toggleNav() {
  if (mobileNav.classList.contains('open')) {
    mobileNav.classList.remove('open');
  } else {
    mobileNav.classList.add('open');
  }
}

function closeNav() {
  mobileNav.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  toggleNav();
});

document.addEventListener('click', (e) => {
  if (e.target !== hamburger && !mobileNav.contains(e.target)) {
    closeNav();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeNav();
  }
});
