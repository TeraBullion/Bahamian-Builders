/* ================================================================
   BAHAMIAN BUILDERS — projects.js
   Project filtering and lightbox functionality
   ================================================================ */

// ===== FILTER FUNCTIONALITY =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach((card, index) => {
      const category = card.dataset.category;

      if (filter === 'all' || category === filter) {
        // Show card
        card.classList.remove('hidden');
        card.classList.add('showing');
        card.style.transitionDelay = `${index * 60}ms`;

        // Remove showing class after animation
        setTimeout(() => {
          card.classList.remove('showing');
          card.style.transitionDelay = '';
        }, 500);
      } else {
        // Hide card
        card.classList.add('hidden');
        card.classList.remove('showing');
        card.style.transitionDelay = '';
      }
    });
  });
});

// ===== LIGHTBOX FUNCTIONALITY =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(card) {
  const title = card.dataset.title;
  const description = card.dataset.description;
  // Use the card's rendered image: the build rewrites <img src> asset URLs
  // but not data-image attributes, which 404 in production
  const image = card.querySelector('img') ? card.querySelector('img').src : card.dataset.image;
  const category = card.querySelector('.project-card-category').textContent;

  lightboxImage.src = image;
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  lightboxDescription.textContent = description;
  lightboxCategory.textContent = category;

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

// Click on project card to open lightbox
projectCards.forEach(card => {
  card.addEventListener('click', () => {
    if (!card.classList.contains('hidden')) {
      openLightbox(card);
    }
  });
});

// Close lightbox — X button
if (lightboxClose) {
  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
}

// Close lightbox — overlay click
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    // Only close if clicking the overlay, not the content
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Close lightbox — Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

console.log('🏗️ Bahamian Builders — Projects page loaded');
