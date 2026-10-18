// The Arsenal: trading cards that tilt toward the cursor and reshuffle when filtered.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { art } from '../env.js';

export function initProjects({ full, still }) {
  const grid = document.getElementById('projectGrid');
  const cards = [...grid.querySelectorAll('.card')];
  const buttons = [...document.querySelectorAll('#projectFilters .filter')];

  // Swap the icon placeholder for card art once it's been supplied.
  cards.forEach((card) => {
    const src = art(card.dataset.art);
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.alt = '';
    img.loading = 'lazy';
    card.querySelector('.card__art').replaceChildren(img);
  });

  buttons.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
    const state = Flip.getState(cards);
    cards.forEach((c) => c.classList.toggle('is-hidden', f !== 'all' && c.dataset.category !== f));
    if (still) { ScrollTrigger.refresh(); return; }
    Flip.from(state, {
      duration: 0.6,
      ease: 'power3.inOut',
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.5, rotation: -10 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(2)' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.5, rotation: 10, duration: 0.35 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }));

  if (still) return;

  gsap.set(cards, { opacity: 0, y: 90, rotation: () => gsap.utils.random(-6, 6) });
  ScrollTrigger.batch(cards, {
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
