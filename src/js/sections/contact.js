import { gsap } from 'gsap';
import { splitChars, marquee, proximity, restAxes } from '../kinetic.js';

export function initContact({ full, still }) {
  const sec = document.getElementById('contact');
  if (still) return;

  const title = document.getElementById('signalTitle');
  const chars = splitChars(title);
  if (full) proximity(title, chars, { radius: 320, near: { wdth: 150 } });
  else chars.forEach((c) => gsap.set(c, { '--wdth': restAxes(c).wdth }));

  marquee(sec.querySelector('[data-marquee]'), { speed: 60, react: full });

  gsap.from(sec.querySelectorAll('.letters, .contact__cta > *'), {
    y: 60, rotation: () => gsap.utils.random(-5, 5), opacity: 0, duration: 0.7, ease: 'back.out(1.5)', stagger: 0.1,
    scrollTrigger: { trigger: sec.querySelector('.contact__grid'), start: 'top 90%', once: true },
  });
}
