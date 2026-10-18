// The Art: artwork laid out as comic-page panels, filterable, opening into the lightbox.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { gallery, categories } from '../../data/gallery.js';
import { galleryMedia, url } from '../env.js';

/**
 * Lays visible panels out in justified rows like a comic page: each row's panels share a height
 * and their column spans (out of `cols`) are proportional to the artwork's aspect ratio.
 */
function pack(items, grid, full) {
  const cols = full ? 12 : 6;
  const style = getComputedStyle(grid);
  const gap = parseFloat(style.columnGap) || 0;
  const rowPx = parseFloat(style.gridAutoRows) || 60;
  const colW = (grid.clientWidth - gap * (cols - 1)) / cols;
  const heights = full ? [5, 6, 5, 4] : [4, 3];
  const minSpan = full ? 2 : 2;

  let r = 0;
  let row = [];
  const flush = (last) => {
    if (!row.length) return;
    const units = heights[r % heights.length];
    const h = units * rowPx + (units - 1) * gap;
    const want = row.map((it) => Math.max(minSpan, (it.width / it.height) * h / colW));
    const total = want.reduce((a, b) => a + b, 0);
    // A short final row keeps natural widths instead of stretching panels absurdly wide.
    const target = last && total < cols * 0.6 ? Math.round(total) : cols;
    const exact = want.map((w) => (w / total) * target);
    const spans = exact.map((x) => Math.max(minSpan, Math.floor(x)));
    let left = target - spans.reduce((a, b) => a + b, 0);
    exact.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { spans[i]++; left--; } });
    row.forEach((it, i) => {
      it.tile.style.gridColumn = `span ${Math.min(cols, spans[i])}`;
      it.tile.style.gridRow = `span ${units}`;
    });
    row = [];
    r++;
  };

  let sum = 0;
  items.forEach((it) => {
    const units = heights[r % heights.length];
    const h = units * rowPx + (units - 1) * gap;
    const w = Math.max(minSpan, (it.width / it.height) * h / colW);
    if (row.length && sum + w > cols * 1.15) { flush(false); sum = 0; }
    row.push(it);
    sum += w;
  });
  flush(true);
}

export function initGallery({ full, still, lightbox }) {
  const grid = document.getElementById('galleryGrid');
  const filterBar = document.getElementById('galleryFilters');
  const label = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  [{ id: 'all', label: 'All' }, ...categories].forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `filter${i === 0 ? ' is-active' : ''}`;
    b.dataset.filter = c.id;
    b.textContent = c.label;
    filterBar.append(b);
  });

  const items = gallery
    .map((g) => ({ ...g, ...galleryMedia[g.src] }))
    .filter((g) => g.width)
    .map((g) => ({
      ...g,
      sm: g.sm && url(g.sm),
      lg: g.lg && url(g.lg),
      video: g.video && url(g.video),
      poster: g.poster && url(g.poster),
    }));

  items.forEach((item) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = `tile${item.pixel ? ' tile--pixel' : ''}`;
    tile.dataset.cat = item.cat;
    if (item.video) tile.dataset.video = '';
    tile.setAttribute('aria-label', `${item.title} — ${label[item.cat]}${item.video ? ' (video)' : ''}`);
    tile.innerHTML =
      `<img src="${item.video ? item.poster : item.sm}" alt="" loading="lazy" decoding="async" width="${item.width}" height="${item.height}" />` +
      (item.video ? '<span class="tile__play">▶ Play</span>' : '') +
      `<span class="tile__label">${item.title}<small>${label[item.cat]}</small></span>`;
    item.tile = tile;
    grid.append(tile);

    if (item.video && full) {
      let v = null;
      tile.addEventListener('pointerenter', () => {
        v = document.createElement('video');
        Object.assign(v, { src: item.video, muted: true, loop: true, playsInline: true, autoplay: true });
        v.style.cssText = 'position:absolute;inset:0;';
        tile.insertBefore(v, tile.children[1]);
        v.play().catch(() => {});
      });
      tile.addEventListener('pointerleave', () => { v?.remove(); v = null; });
    }
    tile.addEventListener('click', () => {
      const list = visible();
      lightbox.open(list, list.indexOf(item), tile);
    });
  });

  const tiles = items.map((i) => i.tile);
  const visible = () => items.filter((i) => !i.tile.classList.contains('is-hidden'));
  pack(items, grid, full);
  // Re-pack before ScrollTrigger measures, so page height and triggers stay in sync on resize.
  ScrollTrigger.addEventListener('refreshInit', () => pack(visible(), grid, full));
  const buttons = [...filterBar.children];
  buttons.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
    const state = Flip.getState(tiles);
    tiles.forEach((t) => t.classList.toggle('is-hidden', f !== 'all' && t.dataset.cat !== f));
    pack(visible(), grid, full);
    if (still) { ScrollTrigger.refresh(); return; }
    gsap.set(tiles, { opacity: 1, y: 0, rotation: 0, scale: 1 });
    Flip.from(state, {
      duration: 0.7,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.01,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.4, rotation: () => gsap.utils.random(-12, 12) }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.03 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.4, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }));

  if (still) return;
  gsap.set(tiles, { opacity: 0, y: 60, scale: 0.92, rotation: () => gsap.utils.random(-4, 4) });
  ScrollTrigger.batch(tiles, {
    start: 'top 94%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.5)', stagger: 0.06 }),
  });
}
