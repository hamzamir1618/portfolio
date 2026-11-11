import { gsap } from 'gsap';

export function initCursor() {
  const el = document.getElementById('cursor');
  const label = el.firstElementChild;
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });

  window.addEventListener('pointermove', (e) => {
    x(e.clientX);
    y(e.clientY);
    const inIframeStage = e.target.closest?.('.preview__stage');
    el.style.opacity = inIframeStage ? '0' : '1';
    const view = e.target.closest?.('.tile, .card__art--interactive');
    const hover = !view && e.target.closest?.('a, button, .card, .filter');
    el.classList.toggle('is-view', Boolean(view));
    el.classList.toggle('is-hover', Boolean(hover));
    if (view) {
      label.textContent = view.classList.contains('card__art--interactive')
        ? 'Live'
        : view.dataset.video ? 'Play' : 'View';
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.2 }));
  document.addEventListener('pointerenter', () => gsap.to(el, { opacity: 1, duration: 0.2 }));
}
