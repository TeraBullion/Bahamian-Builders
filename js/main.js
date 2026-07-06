/* ================================================================
   BAHAMIAN BUILDERS — main.js
   Shared functionality: Navbar, scroll animations, counters
   ================================================================ */

// ===== NAVBAR SCROLL BEHAVIOR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

function handleNavScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // Run on page load

// ===== MOBILE NAV TOGGLE =====
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav when clicking a link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString() + (current >= target ? '+' : '') + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + '+' + suffix;
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5
});

statNumbers.forEach(el => counterObserver.observe(el));

// ===== ACTIVE NAV LINK =====
const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a:not(.btn)');

navLinks.forEach(link => {
  const href = link.getAttribute('href');
  const isHome = (href === '/' || href === '/index.html');
  const isCurrentHome = (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/'));

  if (isHome && isCurrentHome) {
    link.classList.add('active');
  } else if (!isHome && currentPath.includes(href)) {
    link.classList.add('active');
  } else if (!isHome || !isCurrentHome) {
    // Remove default active from home if we're on another page
    if (isHome && !isCurrentHome) {
      link.classList.remove('active');
    }
  }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// ===== NAVBAR SCROLL - Ensure solid bg on inner pages =====
// Inner pages don't have a hero, so navbar should always be solid
const heroSection = document.getElementById('hero');
if (!heroSection) {
  navbar.classList.add('scrolled');
}

console.log('🏗️ Bahamian Builders — Site loaded successfully');
