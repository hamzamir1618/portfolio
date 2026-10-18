import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GRADE = { A: 1, B: 0.8, C: 0.6, D: 0.4, E: 0.2 };
const NS = 'http://www.w3.org/2000/svg';

/** Draws the JoJo-style Stand stats hexagon from `data-stats="Name:A,Name:B,…"`. */
function drawStand(el) {
  const stats = el.dataset.stats.split(',').map((s) => s.split(':'));
  const svg = el.querySelector('svg');
  const c = 110;
  const r = 70;
  const at = (i, k) => {
    const a = -Math.PI / 2 + (i / stats.length) * Math.PI * 2;
    return [c + Math.cos(a) * r * k, c + Math.sin(a) * r * k];
  };
  const add = (tag, attrs, text) => {
    const n = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    if (text) n.textContent = text;
    svg.append(n);
    return n;
  };
  const ring = (k) => stats.map((_, i) => at(i, k).join(',')).join(' ');
  [0.2, 0.4, 0.6, 0.8].forEach((k) => add('polygon', { class: 'grid', points: ring(k) }));
  add('polygon', { class: 'grid grid--outer', points: ring(1) });
  stats.forEach((_, i) => {
    const [x, y] = at(i, 1);
    add('line', { class: 'spoke', x1: c, y1: c, x2: x, y2: y });
  });
  const shape = add('polygon', { class: 'stats', points: stats.map(([, g], i) => at(i, GRADE[g] ?? 0.5).join(',')).join(' ') });
  stats.forEach(([name, g], i) => {
    const [x, y] = at(i, 1.32);
    add('text', { class: 'axis', x, y: y - 3 }, name);
    add('text', { class: 'grade', x, y: y + 13 }, g);
  });
  return shape;
}

export function initSkills({ still }) {
  const sec = document.getElementById('skills');
  const stand = document.getElementById('stand');
  const shape = drawStand(stand);
  if (still) return;

  const card = sec.querySelector('.dossier__card');
  gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 85%', once: true } })
    .from(card, { x: -120, rotation: -14, opacity: 0, duration: 0.8, ease: 'back.out(1.4)' })
    .from(sec.querySelector('.dossier__stamp'), { scale: 3.5, rotation: -30, opacity: 0, duration: 0.45, ease: 'expo.out' }, 0.5)
    .from(sec.querySelectorAll('.dossier__facts > div'), { x: -30, opacity: 0, duration: 0.4, stagger: 0.07, ease: 'back.out(2)' }, 0.6)
    .from(shape, { scale: 0, transformOrigin: '110px 110px', duration: 0.7, ease: 'back.out(2)' }, 0.9)
    .from(stand.querySelectorAll('.grade'), { scale: 2.5, opacity: 0, transformOrigin: 'center', duration: 0.3, ease: 'back.out(3)', stagger: 0.06 }, 1.2);

  const powers = sec.querySelectorAll('.power');
  gsap.set(powers, { opacity: 0, y: 70 });
  ScrollTrigger.batch(powers, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => batch.forEach((p, i) => {
      gsap.timeline({ delay: i * 0.12 })
        .to(p, { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' })
        .fromTo(p.querySelectorAll('li'),
          { scale: 1.9, rotation: () => gsap.utils.random(-25, 25), opacity: 0 },
          { scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.05 }, 0.25);
    }),
  });
}
