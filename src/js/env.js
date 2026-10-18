import media from '../data/media.generated.json';

export const BASE = import.meta.env.BASE_URL;
export const url = (path) => `${BASE}${path}`.replace(/\/{2,}/g, '/');

// full  = desktop with pointer + motion: pinned scenes, transition stage, kinetic everything
// lite  = phones/tablets: stacked layout, light reveals
// still = prefers-reduced-motion: no motion at all
const FULL = '(min-width: 900px) and (min-height: 560px) and (hover: hover) and (pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export const mode = matchMedia(REDUCED).matches ? 'still' : matchMedia(FULL).matches ? 'full' : 'lite';
export const isFull = mode === 'full';

// Crossing the breakpoint changes the whole scroll architecture, so just rebuild the page.
[FULL, REDUCED].forEach((q) => matchMedia(q).addEventListener('change', () => location.reload()));

export const art = (name) => (media.art[name] ? url(media.art[name].src) : null);
export const hasArt = (name) => Boolean(media.art[name]);
export const galleryMedia = media.gallery;

/** Exposes every supplied art file as `--art-<name>` + an `.art-<name>` class on <html>. */
export function applyArt() {
  const root = document.documentElement;
  for (const name of Object.keys(media.art)) {
    root.style.setProperty(`--art-${name}`, `url("${art(name)}")`);
    root.classList.add(`art-${name}`);
  }
  document.querySelectorAll('img[data-art]').forEach((img) => {
    const src = art(img.dataset.art);
    if (src) img.src = src;
    else img.remove();
  });
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Deterministic PRNG so scrubbed effects look identical every time you scroll past. */
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Document-space top of an element, ignoring transforms (unlike getBoundingClientRect). */
export function docTop(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}

/** Offset of `el` inside `ancestor`, ignoring transforms. */
export function offsetWithin(el, ancestor) {
  let x = 0;
  let y = 0;
  for (let n = el; n && n !== ancestor; n = n.offsetParent) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}
