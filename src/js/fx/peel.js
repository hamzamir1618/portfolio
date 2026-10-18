// PAGE TURN — the outgoing page peels from its bottom-right corner and folds over to the left,
// showing its printed back (inside cover / back cover) while the next page appears underneath.
import { gsap } from 'gsap';
import { fxLayer } from '../scenes.js';

/** Sutherland–Hodgman: keep the part of `poly` where f(x, y) ≥ 0. */
function clipPoly(poly, f) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i];
    const Q = poly[(i + 1) % poly.length];
    const fp = f(P[0], P[1]);
    const fq = f(Q[0], Q[1]);
    if (fp >= 0) out.push(P);
    if (fp >= 0 !== fq >= 0) {
      const t = fp / (fp - fq);
      out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
    }
  }
  return out;
}

const EMPTY = 'polygon(0 0, 0 0, 0 0)';
const poly = (pts, dy = 0) => (pts.length ? `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${(y + dy).toFixed(1)}px`).join(',')})` : EMPTY);

export function peel({ template }) {
  return {
    build(tl, ctx) {
      const root = document.createElement('div');
      root.className = 'peel';
      root.innerHTML =
        '<div class="peel__shade"></div>' +
        '<div class="peel__flapwrap"><div class="peel__flap"><div class="peel__back"></div><div class="peel__sheen"></div></div></div>';
      fxLayer().append(root);
      const shade = root.querySelector('.peel__shade');
      const flap = root.querySelector('.peel__flap');
      const back = root.querySelector('.peel__back');
      const sheen = root.querySelector('.peel__sheen');
      back.append(document.getElementById(template).content.cloneNode(true));

      const ease = gsap.parseEase('power1.inOut');

      const update = (p) => {
        const on = p > 0 && p < 1;
        root.classList.toggle('is-on', on);
        if (!on) {
          ctx.A.style.clipPath = '';
          return;
        }
        const { W, H } = ctx;
        const t = ease(p);
        // The corner C travels to C'; the fold is the perpendicular bisector of C–C'.
        const cx = W - 2.4 * W * t;
        const cy = H - 1.4 * H * Math.pow(t, 1.6);
        let nx = W - cx;
        let ny = H - cy;
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        const mx = (W + cx) / 2;
        const my = (H + cy) / 2;
        const d = mx * nx + my * ny;
        const side = (x, y) => x * nx + y * ny - d; // > 0 → lifted off the page

        const rect = [[0, 0], [W, 0], [W, H], [0, H]];
        const keep = clipPoly(rect, (x, y) => -side(x, y));
        const lifted = clipPoly(rect, side);
        const reflect = ([x, y]) => {
          const s = 2 * (x * nx + y * ny - d);
          return [x - s * nx, y - s * ny];
        };

        ctx.A.style.clipPath = poly(keep, ctx.aOffset);
        flap.style.clipPath = poly(lifted.map(reflect));

        // Back of the page = page reflected across the fold, pre-mirrored so print reads correctly.
        const a = 1 - 2 * nx * nx;
        const b = -2 * nx * ny;
        const dd = 1 - 2 * ny * ny;
        back.style.width = `${W}px`;
        back.style.height = `${H}px`;
        back.style.transform = `matrix(${-a},${-b},${b},${dd},${a * W + 2 * d * nx},${b * W + 2 * d * ny})`;

        // Light bands anchored on the fold line.
        const diag = Math.hypot(W, H);
        const band = (el, angle) => {
          el.style.width = `${diag}px`;
          el.style.height = `${diag * 2}px`;
          el.style.transform = `translate(${mx}px, ${my}px) rotate(${angle}rad) translate(0, ${-diag}px)`;
        };
        band(sheen, Math.atan2(-ny, -nx));
        band(shade, Math.atan2(ny, nx));
        shade.style.opacity = Math.min(1, t * 6) * (1 - t * 0.6);
      };

      return { update, hideAt: 0.999, introAt: 0.66, introSpan: 0.26 };
    },
  };
}
