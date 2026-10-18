import { gsap } from 'gsap';
import { lockScroll } from '../smooth.js';

export function initModal() {
  const modal = document.getElementById('resumeModal');
  const card = modal.querySelector('.modal__card');
  const options = modal.querySelectorAll('.modal__option');
  let opener = null;

  const open = (e) => {
    opener = e.currentTarget;
    modal.hidden = false;
    lockScroll(true);
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(card, { scale: 0.6, rotation: -6, y: 40 }, { scale: 1, rotation: 0, y: 0, duration: 0.6, ease: 'back.out(2)' });
    gsap.fromTo(options, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.08, delay: 0.2 });
    options[0].focus({ preventScroll: true });
  };
  const close = () => {
    if (modal.hidden) return;
    gsap.to(card, { scale: 0.8, rotation: 4, opacity: 0, duration: 0.25, ease: 'power2.in' });
    gsap.to(modal, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        modal.hidden = true;
        gsap.set(card, { clearProps: 'opacity' });
        lockScroll(false);
        opener?.focus({ preventScroll: true });
      },
    });
  };

  document.getElementById('resumeNavBtn').addEventListener('click', open);
  document.getElementById('resumeFooterBtn').addEventListener('click', open);
  document.getElementById('modalClose').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
