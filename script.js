/* ============================================================
   PORTFOLIO — SCRIPT
   Typing animation · Scroll reveals · Project filters · Nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     NAVBAR — scroll effect + active link tracking
     ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const updateNav = () => {
    const scrollY = window.scrollY;

    // Solid background after scroll
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Active link
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ----------------------------------------------------------
     MOBILE NAV TOGGLE
     ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
  });

  // Close on link click
  navLinksContainer.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     TYPING ANIMATION
     ---------------------------------------------------------- */
  const taglineEl = document.getElementById('heroTagline');
  const phrases = [
    'Developer.',
    'Designer.',
    'Problem Solver.',
    'Creative Thinker.',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  const type = () => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      taglineEl.innerHTML = currentPhrase.substring(0, charIndex - 1) + '<span class="cursor"></span>';
      charIndex--;
    } else {
      taglineEl.innerHTML = currentPhrase.substring(0, charIndex + 1) + '<span class="cursor"></span>';
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next word
    } else {
      typingSpeed = isDeleting ? 40 : 80;
    }

    setTimeout(type, typingSpeed);
  };

  type();

  /* ----------------------------------------------------------
     SCROLL REVEAL — Intersection Observer
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  /* ----------------------------------------------------------
     PROJECT FILTERS
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.classList.remove('visible');
          void card.offsetWidth; // Force reflow
          card.classList.add('visible');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     RESUME MODAL
     ---------------------------------------------------------- */
  const modal = document.getElementById('resumeModal');
  const modalClose = document.getElementById('modalClose');
  const resumeNavBtn = document.getElementById('resumeNavBtn');
  const resumeFooterBtn = document.getElementById('resumeFooterBtn');

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  resumeNavBtn.addEventListener('click', openModal);
  resumeFooterBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ----------------------------------------------------------
     DESIGN GALLERY FILTERS
     ---------------------------------------------------------- */
  const designFilterBtns = document.querySelectorAll('[data-design-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');

  designFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.designFilter;

      // Update active state
      designFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items
      galleryItems.forEach(item => {
        const cat = item.dataset.designCat;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.classList.remove('visible');
          void item.offsetWidth;
          item.classList.add('visible');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     LIGHTBOX
     ---------------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentLightboxItems = [];
  let currentLightboxIndex = 0;

  const openLightbox = (item) => {
    // Collect only visible items
    currentLightboxItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    currentLightboxIndex = currentLightboxItems.indexOf(item);
    showLightboxItem();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Pause any playing videos
    const vid = lightboxContent.querySelector('video');
    if (vid) vid.pause();
  };

  const showLightboxItem = () => {
    const item = currentLightboxItems[currentLightboxIndex];
    const img = item.querySelector('img');
    const video = item.querySelector('video');

    if (video) {
      lightboxContent.innerHTML = `<video src="${video.src}" controls autoplay style="max-width:90vw;max-height:85vh;border:4px solid #fff;box-shadow:0 0 60px rgba(0,0,0,0.5)"></video>`;
    } else if (img) {
      lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width:90vw;max-height:85vh;border:4px solid #fff;box-shadow:0 0 60px rgba(0,0,0,0.5)" />`;
    }

    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxItems.length}`;
  };

  const nextLightbox = () => {
    const vid = lightboxContent.querySelector('video');
    if (vid) vid.pause();
    currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxItems.length;
    showLightboxItem();
  };

  const prevLightbox = () => {
    const vid = lightboxContent.querySelector('video');
    if (vid) vid.pause();
    currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxItems.length) % currentLightboxItems.length;
    showLightboxItem();
  };

  // Click handlers
  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't open lightbox if clicking video controls
      if (e.target.tagName === 'VIDEO') return;
      openLightbox(item);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

  // Close on overlay click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard support — update existing Escape handler
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

});
