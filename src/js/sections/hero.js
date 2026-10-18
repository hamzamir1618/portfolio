// The cover: the masthead slams in letter by letter, the portrait lands with an impact frame,
// menacing ゴゴゴ hums around it, and a lens follows the cursor to reveal the inked version.
import { gsap } from 'gsap';
import { splitChars, slamIn, flipWords, marquee, proximity, impactFrame } from '../kinetic.js';

export function initHero({ full, still }) {
  const hero = document.getElementById('hero');
  const trim = hero.querySelector('.hero__trim');
  const q = (sel) => hero.querySelectorAll(sel);
  const portrait = document.getElementById('heroPortrait');
  const frame = portrait.querySelector('.hero__portrait-frame');

  if (still) return { intro: gsap.timeline({ paused: true }) };

  const [line1, line2] = q('.hero__mast-line');
  const chars1 = splitChars(line1);
  const chars2 = splitChars(line2);

  marquee(hero.querySelector('[data-marquee]'), { speed: 80, react: full });

  // ---------- Ink lens: the comic version of the photo shows through a circle ----------
  const lens = gsap.quickTo(frame, '--lens-r', { duration: 0.5, ease: 'power3' });
  const lx = gsap.quickTo(frame, '--lx', { duration: 0.25, ease: 'power3' });
  const ly = gsap.quickTo(frame, '--ly', { duration: 0.25, ease: 'power3' });
  gsap.set(frame, { '--lens-r': '0px', '--lx': '50%', '--ly': '45%' });
  frame.addEventListener('pointerenter', () => lens(`${frame.offsetWidth * 0.36}px`));
  frame.addEventListener('pointerleave', () => lens('0px'));
  frame.addEventListener('pointermove', (e) => {
    const r = frame.getBoundingClientRect();
    lx(`${((e.clientX - r.left) / r.width) * 100}%`);
    ly(`${((e.clientY - r.top) / r.height) * 100}%`);
  });

  if (full) {
    // Masthead letters squeeze as the cursor passes over them.
    proximity(hero.querySelector('.hero__mast'), chars1, { radius: 240, near: { wdth: 60 } });

    // Depth: cover layers drift against the cursor.
    const layers = [
      [hero.querySelector('.hero__backdrop'), -18],
      [portrait, 22],
      [hero.querySelector('.hero__mast'), -8],
    ].map(([el, depth]) => ({ x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3' }), y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3' }), depth }));
    hero.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.depth); l.y(ny * l.depth); });
    });
  }

  const intro = gsap.timeline({ paused: true, onComplete: () => flipWords(document.getElementById('heroFlip')) });
  intro
    .from(trim, { scale: 1.06, opacity: 0, duration: 0.5, ease: 'power3.out' })
    .from(q('.hero__sun'), { xPercent: 110, duration: 0.7, ease: 'expo.out' }, 0.1)
    .from(q('.hero__corner'), { xPercent: -120, rotation: -20, duration: 0.5, ease: 'back.out(2)' }, 0.2)
    .from(q('.hero__presents'), { opacity: 0, x: -30, duration: 0.4 }, 0.35)
    .add(slamIn(chars1, trim), 0.4)
    .add(slamIn(chars2, trim), 0.85)
    .from(portrait, { scale: 1.6, rotation: 14, opacity: 0, duration: 0.45, ease: 'expo.in' }, 0.9)
    .add(() => impactFrame(2), 1.35)
    .fromTo(trim, { x: -14, y: 10 }, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' }, 1.35)
    .from(q('.hero__kana'), { yPercent: -120, opacity: 0, duration: 0.6, ease: 'expo.out' }, 1.4)
    .from(q('[data-menace]'), { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.1 }, 1.5)
    .from(q('.hero__copy > *'), { y: 30, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.1 }, 1.45)
    .from(q('.hero__band'), { xPercent: -110, duration: 0.8, ease: 'expo.out' }, 1.7)
    .from(q('.hero__dogear'), { scale: 0, transformOrigin: '100% 100%', duration: 0.5, ease: 'back.out(2)' }, 2);

  return { intro };
}
