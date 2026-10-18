import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis = null;

export function initSmooth() {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.85, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;
export const velocity = () => (lenis ? lenis.velocity : 0);

export function scrollToY(y, { immediate = false } = {}) {
  if (lenis) lenis.scrollTo(y, { immediate, force: true, lock: !immediate, duration: 1.4 });
  else window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
