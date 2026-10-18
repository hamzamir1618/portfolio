// Kinetic typography toolkit: lettering that hits like manga SFX.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { velocity } from './smooth.js';
import { clamp, lerp } from './env.js';

const R = gsap.utils.random;

export function splitChars(el) {
  if (el._split) return el._split.chars;
  el._split = SplitText.create(el, { type: 'words,chars', wordsClass: 'word', charsClass: 'char', aria: 'auto' });
  return el._split.chars;
}

export function splitWords(el) {
  if (el._splitW) return el._splitW.words;
  el._splitW = SplitText.create(el, { type: 'words', wordsClass: 'word', aria: 'auto' });
  return el._splitW.words;
}

/** Resting width/weight axes for a display char. */
export function restAxes(c) {
  if (c.closest('.hero__mast-line--2')) return { wdth: 150, wght: 900 };
  if (c.closest('.hero__mast')) return { wdth: 120, wght: 900 };
  if (c.closest('.signal')) return { wdth: 95, wght: 900 };
  return { wdth: 100, wght: 900 };
}

/**
 * Chapter heading entrance: letters slam in from scattered positions like a sound effect,
 * squashed thin and springing out to full width as they land.
 * Uses fromTo throughout: these timelines get invalidated on resize, and an invalidated
 * from() would re-read its already-hidden start state as its end state.
 * Titles are white-space: nowrap, so animating the width axis never changes line wrapping.
 */
export function chapterIntro(head) {
  const tl = gsap.timeline({ paused: true });
  const title = head.querySelector('.chapter-title');
  const label = head.querySelector('.chapter-label');
  const menace = head.querySelector('.menace');
  const extras = head.querySelectorAll('.chapter-aside, .caption');
  if (label) tl.fromTo(label, { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.35, ease: 'power4.out' }, 0);
  if (title && !title.querySelector('.morph')) {
    const chars = splitChars(title);
    tl.fromTo(chars, {
      opacity: 0,
      yPercent: () => R(-160, 160),
      xPercent: () => R(-80, 80),
      rotation: () => R(-50, 50),
      scale: () => R(2, 3.2),
      '--wdth': 50,
    }, {
      opacity: 1,
      yPercent: 0,
      xPercent: 0,
      rotation: 0,
      scale: 1,
      '--wdth': (i, c) => restAxes(c).wdth,
      duration: 0.55,
      ease: 'back.out(1.8)',
      stagger: { each: 0.03, from: 'random' },
    }, 0.05);
  }
  if (menace) tl.fromTo(menace.children, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2.6)', stagger: 0.06 }, 0.3);
  if (extras.length) {
    tl.fromTo(extras, { y: 24, opacity: 0, rotation: -3 }, { y: 0, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.08 }, '-=0.25');
  }
  return tl;
}

/** Squeeze a nested timeline into `span` units of a parent timeline. */
export function fit(tl, span) {
  return tl.timeScale(tl.duration() / span);
}

/** Masthead stamp: each letter slams down and shakes the cover. */
export function slamIn(chars, shakeTarget) {
  return gsap.fromTo(chars, {
    opacity: 0,
    scale: 3,
    yPercent: () => R(-60, 20),
    rotation: () => R(-28, 28),
    '--wdth': 50,
  }, {
    opacity: 1,
    scale: 1,
    yPercent: 0,
    rotation: 0,
    '--wdth': (i, c) => restAxes(c).wdth,
    duration: 0.5,
    ease: 'expo.out',
    stagger: {
      each: 0.065,
      onComplete() {
        if (!shakeTarget) return;
        gsap.fromTo(shakeTarget, { x: R(-7, 7), y: R(-6, 6) }, { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
      },
    },
  });
}

/** Full-screen inversion flash, like an anime impact frame. */
export function impactFrame(times = 2) {
  const el = document.querySelector('.impact');
  if (!el) return;
  const tl = gsap.timeline();
  for (let i = 0; i < times; i++) tl.set(el, { opacity: 1 }).set(el, { opacity: 0 }, '+=0.06').set({}, {}, '+=0.05');
  return tl;
}

/**
 * Menacing katakana (ゴゴゴゴ): each glyph throbs and drifts on its own loop, offset from its
 * neighbours, so the block looks like it's humming with pressure.
 */
export function menace(el) {
  const glyphs = [...el.children];
  glyphs.forEach((g, i) => {
    gsap.timeline({ repeat: -1, yoyo: true, delay: i * 0.18 })
      .to(g, { y: () => R(-14, -6), rotation: () => R(-8, 8), skewX: () => R(-8, 8), duration: () => R(0.5, 0.8), ease: 'sine.inOut' });
  });
  gsap.to(el, { x: R(-12, 12), duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true });
}

/** Rotating word that flips letter by letter, like a split-flap board. */
export function flipWords(el, { hold = 2.4 } = {}) {
  const words = el.dataset.words.split('|');
  let i = 0;
  const render = (word) => {
    el.innerHTML = '';
    return [...word].map((c) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = c === ' ' ? ' ' : c;
      el.append(s);
      return s;
    });
  };
  el.setAttribute('aria-label', words.join(' '));
  let chars = render(words[0]);
  const next = () => {
    i = (i + 1) % words.length;
    gsap.to(chars, {
      rotationX: -95,
      opacity: 0,
      duration: 0.28,
      ease: 'power2.in',
      stagger: 0.03,
      onComplete: () => {
        chars = render(words[i]);
        gsap.from(chars, { rotationX: 95, opacity: 0, yPercent: 30, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.035 });
      },
    });
  };
  return gsap.delayedCall(hold, function loop() { next(); gsap.delayedCall(hold, loop); });
}

/**
 * Word morph: letters physically travel to their place in the next word
 * (DEVELOPER ⇄ DESIGNER), unmatched letters drop out / slam in.
 */
export function morph(el, { hold = 2.6 } = {}) {
  const words = el.dataset.words.split('|');
  el.textContent = '';
  el.style.position = 'relative';

  const layout = (word) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0';
    const spans = [...word].map((c) => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = c;
      probe.append(s);
      return s;
    });
    el.append(probe);
    const out = { xs: spans.map((s) => s.offsetLeft), width: probe.offsetWidth, height: probe.offsetHeight };
    probe.remove();
    return out;
  };

  let index = 0;
  let geo = words.map(layout);
  let live = [];
  const make = (c, x) => {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = c;
    s.style.cssText = 'position:absolute;left:0;top:0';
    gsap.set(s, { x });
    el.append(s);
    return { c, el: s, x };
  };
  const size = (g) => gsap.set(el, { width: g.width, height: g.height });

  live = [...words[0]].map((c, i) => make(c, geo[0].xs[i]));
  size(geo[0]);

  const go = () => {
    const nextIndex = (index + 1) % words.length;
    const target = words[nextIndex];
    const g = geo[nextIndex];
    const used = new Set();
    const nextLive = [];
    [...target].forEach((c, i) => {
      let best = -1;
      live.forEach((l, j) => {
        if (used.has(j) || l.c !== c) return;
        if (best < 0 || Math.abs(l.x - g.xs[i]) < Math.abs(live[best].x - g.xs[i])) best = j;
      });
      if (best >= 0) {
        used.add(best);
        const l = live[best];
        const lift = R(0.25, 0.6) * g.height * (i % 2 ? 1 : -1);
        gsap.timeline()
          .to(l.el, { x: g.xs[i], duration: 0.7, ease: 'power3.inOut' }, 0)
          .to(l.el, { y: lift, rotation: R(-14, 14), duration: 0.35, ease: 'power2.out' }, 0)
          .to(l.el, { y: 0, rotation: 0, duration: 0.45, ease: 'back.out(3)' }, 0.35);
        l.x = g.xs[i];
        nextLive.push(l);
      } else {
        const n = make(c, g.xs[i]);
        gsap.from(n.el, { yPercent: -180, rotation: R(-60, 60), scale: 2, opacity: 0, duration: 0.6, delay: 0.35, ease: 'back.out(2)' });
        nextLive.push(n);
      }
    });
    live.forEach((l, j) => {
      if (used.has(j)) return;
      gsap.to(l.el, { yPercent: 160, rotation: R(-90, 90), opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: () => l.el.remove() });
    });
    gsap.to(el, { width: g.width, duration: 0.7, ease: 'power3.inOut' });
    live = nextLive;
    index = nextIndex;
  };

  const onResize = () => {
    geo = words.map(layout);
    live.forEach((l, i) => { l.x = geo[index].xs[i]; gsap.set(l.el, { x: l.x }); });
    size(geo[index]);
  };
  window.addEventListener('resize', onResize);

  let call = null;
  return {
    start() { if (!call) call = gsap.delayedCall(hold, function loop() { go(); call = gsap.delayedCall(hold, loop); }); },
    stop() { call?.kill(); call = null; },
  };
}

/** Infinite band whose speed, skew and stretch react to scroll velocity. */
export function marquee(el, { speed = 70, react = true } = {}) {
  const unit = el.firstElementChild;
  while (el.scrollWidth < window.innerWidth * 1.3) el.append(unit.cloneNode(true));
  [...el.children].forEach((c) => el.append(c.cloneNode(true)));
  const half = () => el.scrollWidth / 2;
  const wrap = (x) => gsap.utils.wrap(-half(), 0, x);
  let x = 0;
  const skew = gsap.quickTo(el, 'skewX', { duration: 0.4, ease: 'power3' });
  const stretch = gsap.quickTo(el, 'scaleY', { duration: 0.4, ease: 'power3' });
  gsap.ticker.add((_, dt) => {
    const v = react ? velocity() : 0;
    x = wrap(x - (speed + Math.abs(v) * 14) * (dt / 1000));
    gsap.set(el, { x });
    if (react) {
      skew(clamp(-v * 0.9, -18, 18));
      stretch(1 + clamp(Math.abs(v) * 0.012, 0, 0.25));
    }
  });
}

/** Letters stretch or squeeze (width axis) as the cursor approaches. */
export function proximity(el, chars, { radius = 280, near = { wdth: 150 } } = {}) {
  // Setters are created on first use so they don't fight intro tweens on the same properties.
  let setters = null;
  const make = () => chars.map((c) => ({ c, rest: restAxes(c), w: gsap.quickTo(c, '--wdth', { duration: 0.5, ease: 'power3' }) }));
  let px = -9999;
  let py = -9999;
  let raf = 0;
  const update = () => {
    raf = 0;
    if (!setters) {
      if (chars.some((c) => gsap.isTweening(c))) return;
      setters = make();
    }
    setters.forEach(({ c, rest, w }) => {
      const r = c.getBoundingClientRect();
      const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2));
      const f = Math.pow(1 - clamp(d / radius), 1.6);
      w(lerp(rest.wdth, near.wdth, f));
    });
  };
  const queue = (e) => {
    px = e.clientX;
    py = e.clientY;
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('pointermove', queue, { passive: true });
  el.addEventListener('pointerleave', () => { px = py = -9999; if (setters) update(); });
  chars.forEach((c) => gsap.set(c, { '--wdth': restAxes(c).wdth }));
}

/** Lettering that pops into the balloon word by word. Returns a paused tween. */
export function popWords(el) {
  const words = splitWords(el);
  return gsap.fromTo(words, { opacity: 0, y: 14, scale: 0.8, rotation: () => R(-8, 8) }, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotation: 0,
    duration: 0.45,
    ease: 'back.out(2.2)',
    stagger: 0.022,
    paused: true,
  });
}

export function countUp(el) {
  const to = Number(el.dataset.count);
  const obj = { v: 0 };
  return gsap.to(obj, {
    v: to,
    duration: 1.4,
    ease: 'power3.out',
    paused: true,
    onUpdate: () => { el.textContent = Math.round(obj.v); },
    onStart: () => gsap.fromTo(el, { '--wdth': 50 }, { '--wdth': 110, duration: 1.4, ease: 'elastic.out(1, 0.4)' }),
  });
}
