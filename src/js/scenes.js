// Scene framework: holds two adjacent sections still while a transition plays between them.
//
// Layout stays a plain document (no pinning, no overlap). For the boundary A → B we take the
// scroll range from "A's last screen fills the viewport" to "B's top reaches the viewport top",
// lengthened by a spacer. Inside that range A and B are counter-translated so both sit exactly
// in the viewport (A on top), and an effect timeline is scrubbed by the range's progress.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { docTop } from './env.js';
import { chapterIntro, fit } from './kinetic.js';

export const fxLayer = () => document.getElementById('fx');
const boundaries = [];

/**
 * @param {HTMLElement} A outgoing scene
 * @param {HTMLElement} B incoming scene
 * @param {object} effect  { build(tl, ctx) -> { update?(p), refresh?(), hideAt?, introAt? } }
 * @param {number} length  range length in viewport heights (≥ 1)
 */
export function boundary(A, B, effect, { length = 1.8 } = {}) {
  const gap = document.createElement('div');
  gap.className = 'scene-gap';
  gap.setAttribute('aria-hidden', 'true');
  B.before(gap);

  const ctx = {
    A, B,
    Ain: A.querySelector('.scene__inner'),
    Bin: B.querySelector('.scene__inner'),
    W: innerWidth,
    H: innerHeight,
    // A's last screen sits this far down inside A (A is held so this screen is the viewport).
    get aOffset() { return A.offsetHeight - this.H; },
  };

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  const api = effect.build(tl, ctx) || {};

  // Incoming chapter heading smashes in near the end of every transition.
  const head = B.querySelector('[data-intro]');
  if (head && api.intro !== false) tl.add(fit(chapterIntro(head).paused(false), api.introSpan ?? 0.22), api.introAt ?? 0.76);

  // Outgoing scene disappears once the effect fully covers or removes it.
  tl.set(A, { visibility: 'hidden' }, api.hideAt ?? 0.999);
  tl.set({}, {}, 1); // pin timeline length to exactly 1

  let progress = 0;
  const st = ScrollTrigger.create({
    start: () => docTop(A) + A.offsetHeight - innerHeight,
    end: () => docTop(B),
    onUpdate: (self) => apply(self.progress),
  });

  function apply(p) {
    progress = p;
    const L = st.end - st.start;
    const active = p > 0 && p < 1;
    gsap.set(A, { y: p > 0 ? p * L : 0 });
    gsap.set(B, { y: active ? (p - 1) * L : 0 });
    A.classList.toggle('is-held', active);
    tl.progress(p);
    api.update?.(p);
  }

  const b = {
    A, B, gap, st, tl, api, ctx,
    get progress() { return progress; },
    setGap() { gap.style.height = `${Math.max(0, length - 1) * innerHeight}px`; },
    reset() {
      gsap.set([A, B], { y: 0 });
      tl.progress(0);
      api.update?.(0);
    },
    reapply() {
      ctx.W = innerWidth;
      ctx.H = innerHeight;
      api.refresh?.();
      tl.invalidate();
      apply(st.progress);
    },
  };
  b.setGap();
  boundaries.push(b);
  return b;
}

// Measure everything with transforms cleared, then put the holds back.
ScrollTrigger.addEventListener('refreshInit', () => {
  boundaries.forEach((b) => { b.reset(); b.setGap(); });
});
ScrollTrigger.addEventListener('refresh', () => {
  boundaries.forEach((b) => b.reapply());
});

/** Scroll position at which a scene is fully on screen (after its incoming transition). */
export const sceneTop = (scene) => docTop(scene);
export const getBoundaries = () => boundaries;
