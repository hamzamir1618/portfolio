// INK BLEED — ink splashes onto the page (a red plate bleeding just ahead of the black) and
// floods it; then the ink is lifted away in splash-shaped holes to reveal the next chapter.
// Splash shapes come from art-source/ink-splat-0X (black ink on white). Until those exist a
// plain placeholder blot is used.
import { fxLayer } from '../scenes.js';
import { art, clamp, lerp, rng } from '../env.js';

const SPRITES = ['ink-splat-01', 'ink-splat-02', 'ink-splat-03', 'ink-splat-04', 'ink-splat-05'];

/** Black-on-white artwork → canvas whose alpha is the ink, tinted `rgb`. */
function toMask(img, rgb) {
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0, size, size);
  const data = g.getImageData(0, 0, size, size);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const lum = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255;
    px[i] = rgb[0];
    px[i + 1] = rgb[1];
    px[i + 2] = rgb[2];
    px[i + 3] = Math.round(clamp((1 - lum - 0.08) * 1.25) * 255);
  }
  g.putImageData(data, 0, 0);
  return c;
}

/** Placeholder blot used only until the ink-splat artwork is supplied. */
function placeholder(seed, rgb) {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const rand = rng(seed);
  g.fillStyle = `rgb(${rgb.join(',')})`;
  g.beginPath();
  const k = [rand() * 6, rand() * 6, rand() * 6];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const r = size * (0.3 + 0.05 * Math.sin(a * 3 + k[0]) + 0.04 * Math.sin(a * 7 + k[1]) + 0.025 * Math.sin(a * 13 + k[2]));
    g.lineTo(size / 2 + Math.cos(a) * r, size / 2 + Math.sin(a) * r);
  }
  g.fill();
  for (let i = 0; i < 22; i++) {
    const a = rand() * Math.PI * 2;
    const dist = size * (0.33 + rand() * 0.15);
    g.beginPath();
    g.arc(size / 2 + Math.cos(a) * dist, size / 2 + Math.sin(a) * dist, 2 + rand() * 9, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

const RED = [224, 11, 37];
const BLACK = [17, 17, 17];

export function ink({ seed = 11 } = {}) {
  return {
    build(tl, ctx) {
      const canvas = document.createElement('canvas');
      fxLayer().append(canvas);
      const g = canvas.getContext('2d');
      let dpr = 1;

      const sprites = SPRITES.map((name, i) => {
        const s = { black: placeholder(seed + i, BLACK), red: placeholder(seed + i, RED) };
        const src = art(name);
        if (src) {
          const img = new Image();
          img.onload = () => { s.black = toMask(img, BLACK); s.red = toMask(img, RED); };
          img.src = src;
        }
        return s;
      });

      // Deterministic splash plan: [sprite, x, y, startSize, endSize, t0, t1, rotation]
      const rand = rng(seed);
      const flood = [
        [4, 0.5, 0.48, 0.2, 1.1, 0.0, 0.18],
        [0, 0.3, 0.6, 0.12, 2.6, 0.02, 0.48],
        [2, 0.62, 0.0, 0.3, 2.0, 0.06, 0.44],
        [1, 0.84, 0.32, 0.1, 2.2, 0.1, 0.47],
        [3, 0.12, 0.18, 0.1, 1.9, 0.14, 0.5],
      ].map((s) => [...s, rand() * Math.PI * 2]);
      const lift = [
        [3, 0.7, 0.55, 0.0, 2.9, 0.52, 0.96],
        [0, 0.22, 0.3, 0.0, 2.4, 0.56, 0.98],
        [1, 0.5, 0.95, 0.0, 2.2, 0.6, 1.0],
      ].map((s) => [...s, rand() * Math.PI * 2]);

      const resize = () => {
        dpr = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = ctx.W * dpr;
        canvas.height = ctx.H * dpr;
      };
      resize();

      const stamp = (img, x, y, size, rot) => {
        g.save();
        g.translate(x, y);
        g.rotate(rot);
        g.drawImage(img, -size / 2, -size / 2, size, size);
        g.restore();
      };
      const sizeAt = (plan, p) => {
        const q = clamp((p - plan[5]) / (plan[6] - plan[5]));
        return q <= 0 ? 0 : lerp(plan[3], plan[4], q * q * (3 - 2 * q)) * Math.max(ctx.W, ctx.H);
      };

      const update = (p) => {
        const on = p > 0 && p < 1;
        canvas.classList.toggle('is-on', on);
        if (!on) return;
        const { W, H } = ctx;
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.globalCompositeOperation = 'source-over';
        g.clearRect(0, 0, W, H);

        if (p <= 0.5) {
          for (const s of flood) { const z = sizeAt(s, p); if (z) stamp(sprites[s[0]].red, s[1] * W, s[2] * H, z * 1.07, s[7]); }
          for (const s of flood) { const z = sizeAt(s, p); if (z) stamp(sprites[s[0]].black, s[1] * W, s[2] * H, z, s[7]); }
          const solid = clamp((p - 0.42) / 0.08);
          if (solid) { g.globalAlpha = solid; g.fillStyle = '#111'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
          return;
        }

        g.fillStyle = '#111';
        g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'destination-out';
        for (const s of lift) { const z = sizeAt(s, p); if (z) stamp(sprites[s[0]].black, s[1] * W, s[2] * H, z, s[7]); }
        const clear = clamp((p - 0.9) / 0.1);
        if (clear) { g.globalAlpha = clear; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
        g.globalCompositeOperation = 'source-over';
      };

      tl.to(ctx.Ain, { rotation: -1.2, scale: 0.98, transformOrigin: () => `50% ${ctx.aOffset + ctx.H / 2}px`, duration: 0.5, ease: 'power1.in' }, 0);

      return { update, refresh: resize, hideAt: 0.5, introAt: 0.7 };
    },
  };
}
