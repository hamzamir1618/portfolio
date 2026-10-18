// PANEL DIVE — the camera crashes into a panel on the outgoing page, focus lines rushing past,
// until that panel *is* the next chapter. The panel shows a live copy of B's first screen, so
// the hand-off is seamless.
import { fxLayer } from '../scenes.js';
import { offsetWithin } from '../env.js';

export function dive({ panel, window: win, source }) {
  return {
    build(tl, ctx) {
      const copy = source.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id],[data-intro]').forEach((n) => { n.removeAttribute('id'); n.removeAttribute('data-intro'); });
      copy.setAttribute('aria-hidden', 'true');
      win.append(copy);

      const lines = document.createElement('div');
      lines.className = 'dive__lines';
      fxLayer().append(lines);

      // Geometry of the panel's inner area, in A's coordinates.
      const g = {};
      const measure = () => {
        const o = offsetWithin(panel, ctx.Ain);
        g.iw = panel.clientWidth;
        g.ih = panel.clientHeight;
        g.ix = o.x + panel.clientLeft;
        g.iy = o.y + panel.clientTop;
        g.scale = Math.max(ctx.W / g.iw, ctx.H / g.ih);
        g.ox = g.ix + g.iw / 2;
        g.oy = g.iy + g.ih / 2;
        g.dx = ctx.W / 2 - g.ox;
        g.dy = ctx.H / 2 - (g.oy - ctx.aOffset);
        win.style.transform = `scale(${g.iw / ctx.W}, ${g.ih / ctx.H})`;
      };
      measure();

      const extras = ctx.A.querySelectorAll('.about__finale-cap, .about__finale-hint');
      tl.to(extras, { opacity: 0, y: -20, duration: 0.1 }, 0.02);
      tl.to(ctx.Ain, { scale: 0.95, transformOrigin: () => `${g.ox}px ${g.oy}px`, duration: 0.14, ease: 'power2.out' }, 0);
      tl.to(ctx.Ain, { scale: () => g.scale, x: () => g.dx, y: () => g.dy, duration: 0.64, ease: 'power3.in' }, 0.14);
      tl.fromTo(lines, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.34, ease: 'power2.in' }, 0.36);
      tl.to(lines, { opacity: 0, scale: 0.8, duration: 0.12, ease: 'power2.out' }, 0.8);
      // Hand-off: the zoomed copy and the real chapter now overlap pixel for pixel.
      tl.to(ctx.A, { opacity: 0, duration: 0.05 }, 0.8);

      return {
        update: (p) => lines.classList.toggle('is-on', p > 0 && p < 1),
        refresh: measure,
        hideAt: 0.86,
        intro: false,
      };
    },
  };
}
