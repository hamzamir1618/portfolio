import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { morph, popWords, countUp } from '../kinetic.js';

export function initAbout({ still }) {
  const about = document.getElementById('about');
  if (still) return;

  const m = morph(document.getElementById('aboutMorph'));
  ScrollTrigger.create({ trigger: about, start: 'top 60%', end: 'bottom top', onToggle: (self) => (self.isActive ? m.start() : m.stop()) });

  about.querySelectorAll('[data-words-pop]').forEach((el) => {
    const tw = popWords(el);
    ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => tw.play() });
  });

  about.querySelectorAll('[data-count]').forEach((el) => {
    const tw = countUp(el);
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tw.play() });
  });

  const panels = about.querySelectorAll('.about__p1, .about__art, .stat');
  gsap.set(panels, { opacity: 0, y: 70, rotation: () => gsap.utils.random(-5, 5) });
  ScrollTrigger.batch(panels, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, rotation: 0, duration: 0.8, ease: 'back.out(1.5)', stagger: 0.1 }),
  });

  const cap = about.querySelector('.about__p1 .caption--top');
  gsap.from(cap, { scale: 0.4, rotation: -12, opacity: 0, duration: 0.6, ease: 'back.out(2.5)', scrollTrigger: { trigger: cap, start: 'top 85%', once: true } });
}
