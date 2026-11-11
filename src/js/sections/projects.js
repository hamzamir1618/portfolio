// The Arsenal: trading cards that tilt toward the cursor and reshuffle when filtered.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { art } from '../env.js';
import { lockScroll } from '../smooth.js';

function initPreviewModal(frontendCards) {
  const modal = document.getElementById('previewModal');
  if (!modal || !frontendCards.length) return;

  const backdrop = document.getElementById('previewBackdrop');
  const shell = document.getElementById('previewShell');
  const badge = document.getElementById('previewBadge');
  const title = document.getElementById('previewTitle');
  const urlLabel = document.getElementById('previewUrl');
  const count = document.getElementById('previewCount');
  const repoBtn = document.getElementById('previewRepo');
  const extBtn = document.getElementById('previewExternal');
  const closeBtn = document.getElementById('previewClose');
  const prevBtn = document.getElementById('previewPrev');
  const nextBtn = document.getElementById('previewNext');
  const loader = document.getElementById('previewLoader');
  const frame = document.getElementById('previewFrame');
  const vpBtns = [...modal.querySelectorAll('.preview__vp')];

  let currentIndex = 0;
  let opener = null;

  const loadProject = (idx) => {
    currentIndex = (idx + frontendCards.length) % frontendCards.length;
    const card = frontendCards[currentIndex];
    const liveUrl = card.dataset.previewUrl;
    const name = card.dataset.previewTitle || card.querySelector('.card__title')?.textContent || 'Live Preview';
    const repoUrl = card.dataset.previewRepo;
    const no = card.querySelector('.card__no')?.textContent || `#0${currentIndex + 1}`;

    badge.textContent = no;
    title.textContent = name;
    try {
      urlLabel.textContent = new URL(liveUrl).host;
    } catch {
      urlLabel.textContent = liveUrl;
    }
    count.textContent = `${currentIndex + 1} / ${frontendCards.length}`;
    extBtn.href = liveUrl;

    if (repoUrl) {
      repoBtn.href = repoUrl;
      repoBtn.hidden = false;
    } else {
      repoBtn.hidden = true;
    }

    loader.classList.remove('is-loaded');
    frame.src = liveUrl;
  };

  frame.addEventListener('load', () => {
    if (frame.src && frame.src !== 'about:blank') {
      loader.classList.add('is-loaded');
    }
  });

  const open = (idx, triggerEl) => {
    opener = triggerEl;
    modal.hidden = false;
    lockScroll(true);
    loadProject(idx);
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(
      shell,
      { scale: 0.88, y: 36, opacity: 0, rotation: -1.5 },
      { scale: 1, y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.6)' },
    );
    closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    if (modal.hidden) return;
    gsap.to(shell, { scale: 0.92, y: 24, opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(backdrop, {
      opacity: 0,
      duration: 0.28,
      onComplete: () => {
        modal.hidden = true;
        frame.src = 'about:blank';
        gsap.set(shell, { clearProps: 'all' });
        lockScroll(false);
        opener?.focus({ preventScroll: true });
      },
    });
  };

  vpBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const vp = btn.dataset.vp;
      vpBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      shell.classList.toggle('is-mobile', vp === 'mobile');
    });
  });

  prevBtn.addEventListener('click', () => loadProject(currentIndex - 1));
  nextBtn.addEventListener('click', () => loadProject(currentIndex + 1));
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
  });

  frontendCards.forEach((card, i) => {
    const liveBtn = card.querySelector('[data-preview-trigger]');
    const artBox = card.querySelector('.card__art--interactive');
    liveBtn?.addEventListener('click', (e) => open(i, e.currentTarget));
    artBox?.addEventListener('click', (e) => open(i, e.currentTarget));
    artBox?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i, e.currentTarget);
      }
    });
  });
}

export function initProjects({ full, still }) {
  const grid = document.getElementById('projectGrid');
  const cards = [...grid.querySelectorAll('.card')];
  const buttons = [...document.querySelectorAll('#projectFilters .filter')];
  const frontendCards = cards.filter((c) => c.dataset.category === 'frontends');

  // Swap the icon placeholder for card art once it's been supplied.
  cards.forEach((card) => {
    const src = art(card.dataset.art);
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    const stamp = card.querySelector('.card__stamp');
    card.querySelector('.card__art').replaceChildren(img, ...(stamp ? [stamp] : []));
  });

  initPreviewModal(frontendCards);

  const shouldShow = (card, filter) => (
    filter === 'all'
      ? card.dataset.category !== 'frontends'
      : card.dataset.category === filter
  );

  buttons.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
    const state = Flip.getState(cards);
    cards.forEach((c) => c.classList.toggle('is-hidden', !shouldShow(c, f)));
    if (still) { ScrollTrigger.refresh(); return; }
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.5, rotation: -10, y: 0 }, { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.55, ease: 'back.out(2)' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.5, rotation: 10, duration: 0.35 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }));

  if (still) return;

  const initialCards = cards.filter((c) => !c.classList.contains('is-hidden'));
  gsap.set(initialCards, { opacity: 0, y: 90, rotation: () => gsap.utils.random(-6, 6) });
  ScrollTrigger.batch(initialCards, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: 'back.out(1.4)', stagger: 0.09 }),
  });

  if (!full) return;
  cards.forEach((card) => {
    const inner = card.querySelector('.card__inner');
    const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.5, ease: 'power3' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * 14);
      ry((px - 0.5) * 16);
      inner.style.setProperty('--gx', `${px * 100}%`);
      inner.style.setProperty('--gy', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}
