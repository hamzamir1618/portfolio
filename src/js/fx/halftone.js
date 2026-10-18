// HALFTONE DISSOLVE — screentone dots swell in a diagonal wave until the page is solid ink,
// then shrink away in the same direction to reveal the next chapter.
import { fxLayer } from '../scenes.js';
import { clamp } from '../env.js';

export function halftone({ spacing = 20, color = '#e00b25', key = '#111111', origin = [0, 1] } = {}) {
  return {
    build(tl, ctx) {
      const canvas = document.createElement('canvas');
      fxLayer().append(canvas);
      const g = canvas.getContext('2d');
      let dots = [];
      let dpr = 1;
      const rMax = spacing * 0.62; // hex grid is fully covered at spacing / √3

      const resize = () => {
        dpr = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = ctx.W * dpr;
        canvas.height = ctx.H * dpr;
        const ox = origin[0] * ctx.W;
        const oy = origin[1] * ctx.H;
        const far = Math.hypot(Math.max(ox, ctx.W - ox), Math.max(oy, ctx.H - oy));
        const rowH = spacing * 0.866;
        dots = [];
        for (let j = 0, y = 0; y < ctx.H + rowH; j++, y = j * rowH) {
          for (let x = j % 2 ? spacing / 2 : 0; x < ctx.W + spacing; x += spacing) {
            dots.push([x, y, Math.hypot(x - ox, y - oy) / far]);
          }
        }
      };
      resize();

      const layer = (radius, fill, dx) => {
        g.fillStyle = fill;
        g.beginPath();
        for (const [x, y, d] of dots) {
          const r = radius(d);
          if (r <= 0.3) continue;
          g.moveTo(x + dx + r, y + dx);
          g.arc(x + dx, y + dx, r, 0, Math.PI * 2);
        }
        g.fill();
      };

      const update = (p) => {
        const on = p > 0 && p < 1;
        canvas.classList.toggle('is-on', on);
        if (!on) return;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.clearRect(0, 0, ctx.W, ctx.H);
        const radius = p <= 0.5
          ? (d) => clamp((p / 0.5) * 1.7 - d * 0.7) * rMax
          : (d) => clamp(1 - (((p - 0.5) / 0.5) * 1.7 - d * 0.7)) * rMax;
        layer((d) => radius(d) * 0.94, key, 2.5); // misregistered key plate
        layer(radius, color, 0);
      };

      tl.to(ctx.Ain, { scale: 0.97, transformOrigin: () => `50% ${ctx.aOffset + ctx.H / 2}px`, duration: 0.5, ease: 'power1.in' }, 0);

      return { update, refresh: resize, hideAt: 0.5, introAt: 0.72 };
    },
  };
}
