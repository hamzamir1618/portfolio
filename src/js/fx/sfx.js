// SFX SMASH — the page shakes, a katakana sound effect (ドドドド) slams onto it with an impact
// frame, the burst swallows the screen, then the letters blow apart and the burst collapses
// to reveal the next chapter.
import { gsap } from 'gsap';
import { fxLayer } from '../scenes.js';
import { art } from '../env.js';

const R = gsap.utils.random;

export function sfx({ word = 'ドドドド!' } = {}) {
  return {
    build(tl, ctx) {
      const root = document.createElement('div');
      root.className = 'sfx';
      root.innerHTML =
        '<div class="sfx__flash"></div>' +
        '<div class="sfx__burst"><div class="sfx__burst-shape"></div><img class="sfx__burst-img" alt="" /></div>' +
        '<p class="sfx__word"></p>';
      fxLayer().append(root);
      const burst = root.querySelector('.sfx__burst');
      // The impact frame inverts the whole page, so it uses the page-level layer, not the FX layer.
      const flash = document.querySelector('.impact') || root.querySelector('.sfx__flash');
      const text = root.querySelector('.sfx__word');
      const img = root.querySelector('.sfx__burst-img');
      const src = art('burst-sfx');
      if (src) img.src = src;
      else img.remove();

      const chars = [...word].map((c) => {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = c;
        text.append(s);
        return s;
      });

      const cover = () => (Math.hypot(ctx.W, ctx.H) / (0.8 * Math.min(ctx.W, ctx.H))) * 3.4;

      tl.to(ctx.Ain, {
        keyframes: { x: [0, -16, 14, -11, 8, -4, 0], y: [0, 9, -12, 7, -5, 2, 0], rotation: [0, -0.7, 0.6, -0.4, 0.3, 0, 0] },
        duration: 0.22,
      }, 0);
      tl.fromTo(burst, { scale: 0, rotation: -50 }, { scale: 1, rotation: 0, duration: 0.14, ease: 'back.out(2.4)' }, 0.06);
      tl.fromTo(chars, {
        opacity: 0,
        scale: 3.6,
        yPercent: () => R(-90, 90),
        rotation: () => R(-45, 45),
      }, {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        rotation: 0,
        duration: 0.12,
        ease: 'back.out(2)',
        stagger: 0.014,
      }, 0.1);
      tl.set(flash, { opacity: 1 }, 0.27).set(flash, { opacity: 0 }, 0.29).set(flash, { opacity: 1 }, 0.31).set(flash, { opacity: 0 }, 0.33);
      tl.to(burst, { scale: cover, rotation: 30, duration: 0.17, ease: 'power3.in' }, 0.32);
      tl.to(text, { scale: 1.2, duration: 0.17, ease: 'power2.in' }, 0.32);
      tl.to(chars, {
        x: () => R(-0.7, 0.7) * ctx.W,
        y: () => R(-0.7, 0.7) * ctx.H,
        rotation: () => R(-200, 200),
        scale: () => R(0.4, 2.4),
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        stagger: { each: 0.01, from: 'center' },
      }, 0.52);
      tl.to(burst, { scale: 0, rotation: 140, duration: 0.24, ease: 'power3.inOut' }, 0.55);

      return {
        update: (p) => root.classList.toggle('is-on', p > 0 && p < 1),
        hideAt: 0.5,
        introAt: 0.74,
      };
    },
  };
}
