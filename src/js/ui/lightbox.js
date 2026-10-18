// Gallery viewer: the clicked panel zooms out of the page into the viewer (FLIP) and back.
import { gsap } from 'gsap';
import { lockScroll } from '../smooth.js';

export function initLightbox() {
  const box = document.getElementById('lightbox');
  const stage = document.getElementById('lightboxStage');
  const caption = document.getElementById('lightboxCaption');
  const backdrop = box.querySelector('.lightbox__backdrop');
  const btns = box.querySelectorAll('.lightbox__btn');
  const closeBtn = document.getElementById('lightboxClose');

  let list = [];
  let index = 0;
  let media = null;
  let opener = null;

  const fit = (w, h) => {
    const maxW = innerWidth - (innerWidth < 720 ? 24 : 180);
    const maxH = innerHeight - (innerWidth < 720 ? 160 : 140);
    const s = Math.min(maxW / w, maxH / h, 2.5);
    const width = w * s;
    const height = h * s;
    return { left: (innerWidth - width) / 2, top: (innerHeight - height) / 2 - 10, width, height };
  };

  const build = (item) => {
    let el;
    if (item.video) {
      el = document.createElement('video');
      el.src = item.video;
      el.poster = item.poster;
      el.controls = true;
      el.playsInline = true;
      el.autoplay = true;
    } else {
      el = document.createElement('img');
      el.src = item.sm;
      el.alt = item.title;
      const hi = new Image();
      hi.onload = () => { if (media === el) el.src = item.lg; };
      hi.src = item.lg;
    }
    el.className = `lightbox__media${item.pixel ? ' is-pixel' : ''}`;
    const r = fit(item.width, item.height);
    Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    stage.append(el);
    caption.innerHTML = `${item.title}<b>${index + 1} / ${list.length}</b>`;
    return { el, r };
  };

  // Transform that makes the final rect `r` look like the on-page rect `from`.
  const flipFrom = (from, r) => ({ x: from.left - r.left, y: from.top - r.top, scaleX: from.width / r.width, scaleY: from.height / r.height });

  const open = (items, i, tile) => {
    list = items;
    index = i;
    opener = tile;
    box.hidden = false;
    lockScroll(true);
    const { el, r } = build(list[index]);
    media = el;
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(btns, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.3 });
    gsap.fromTo(caption, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.3 });
    gsap.fromTo(el, flipFrom(tile.getBoundingClientRect(), r), { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.65, ease: 'expo.out' });
    closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    if (box.hidden) return;
    const el = media;
    if (el.tagName === 'VIDEO') el.pause();
    const tile = list[index].tile;
    const tr = tile.getBoundingClientRect();
    const visible = tr.bottom > 0 && tr.top < innerHeight && tile.offsetParent;
    const r = { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
    gsap.to(btns, { opacity: 0, duration: 0.2 });
    gsap.to(caption, { opacity: 0, duration: 0.2 });
    gsap.to(backdrop, { opacity: 0, duration: 0.45, delay: 0.1 });
    gsap.to(el, {
      ...(visible ? flipFrom(tr, r) : { scale: 0.6, opacity: 0 }),
      duration: 0.5,
      ease: 'expo.inOut',
      onComplete: () => {
        stage.innerHTML = '';
        box.hidden = true;
        media = null;
        lockScroll(false);
        (opener || tile).focus({ preventScroll: true });
      },
    });
  };

  const step = (dir) => {
    const old = media;
    if (old.tagName === 'VIDEO') old.pause();
    gsap.to(old, { x: -dir * 120, opacity: 0, rotation: -dir * 4, duration: 0.35, ease: 'power2.in', onComplete: () => old.remove() });
    index = (index + dir + list.length) % list.length;
    const { el } = build(list[index]);
    media = el;
    gsap.from(el, { x: dir * 160, opacity: 0, rotation: dir * 4, duration: 0.55, ease: 'expo.out', delay: 0.1 });
  };

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.getElementById('lightboxPrev').addEventListener('click', () => step(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => step(1));
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  return { open };
}
