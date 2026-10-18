// Converts source media into web-ready files under public/.
//   node scripts/build-assets.mjs          (only processes what's new or changed)
//   node scripts/build-assets.mjs --force  (rebuilds everything)
//
// - Gallery images  -> public/media/gallery/<slug>-{sm,lg}.webp
// - Gallery videos  -> public/media/video/<slug>.mp4 + <slug>.webp poster (needs ffmpeg on PATH)
// - Art (art-source)-> public/art/<name>.webp
// - Portrait, résumés copied/optimised into public/
// Writes src/data/media.generated.json with dimensions + which art files exist.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { gallery, slugify } from '../src/data/gallery.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');
const r = (...p) => path.join(root, ...p);

const GALLERY_SRC = r('Graphic Design XP');
const ART_SRC = r('art-source');
const OUT = {
  gallery: r('public/media/gallery'),
  video: r('public/media/video'),
  art: r('public/art'),
  img: r('public/img'),
  resume: r('public/resume'),
};
Object.values(OUT).forEach((d) => fs.mkdirSync(d, { recursive: true }));

// Art slots and how to prepare each one:
//   w        max output width
//   mask     luminance mask: greyscale + normalised
//   square   pad onto a white square (shapes the code draws into square sprites); value = gravity
//   unframe  crop away a white margin + panel border the artwork came with
//   whiten   push near-white backgrounds (≥ value on every channel) to pure white
//   tile     make a seamless mirrored tile of this many px from a centre crop
//   trim     crop fractions [top, right, bottom, left] off the edges
//   grey     drop colour (keeps textures neutral)
const ART = {
  'paper-grain': { w: 1024, tile: 512, grey: true },
  'paper-back': { w: 2400 },
  'ink-splat-01': { w: 1600, mask: true, square: 'centre' },
  'ink-splat-02': { w: 1600, mask: true, square: 'centre' },
  'ink-splat-03': { w: 1600, mask: true, square: 'north' },
  'ink-splat-04': { w: 1600, mask: true, square: 'centre' },
  'ink-splat-05': { w: 1600, mask: true, square: 'centre' },
  'burst-sfx': { w: 1600, whiten: 235 },
  'speedlines-radial': { w: 2400, mask: true },
  'cover-islamabad': { w: 2752 },
  'og-cover': { w: 1200, format: 'jpg' },
  'ch1-origin': { w: 1400 },
  'ch2-journey': { w: 2752 },
  'exp-kdd': { w: 1600, unframe: true },
  'exp-mlabs': { w: 1600, unframe: true },
  'exp-societies': { w: 1600 },
  'ch3-arsenal': { w: 2752, unframe: true },
  'ch4-powers': { w: 1000, whiten: 222, trim: [0.02, 0.07, 0.02, 0.06] },
  'epilogue-signal': { w: 2752, unframe: true },
  'back-cover': { w: 2752, unframe: true },
  'proj-echo': { w: 900 }, 'proj-retinaverse': { w: 900 }, 'proj-tumorscope': { w: 900 },
  'proj-emotrack': { w: 900 }, 'proj-resling': { w: 900 }, 'proj-spaceshooter': { w: 900 },
  'proj-pacman': { w: 900 }, 'proj-peersync': { w: 900 }, 'proj-dupcleaner': { w: 900 },
};

const stale = (src, out) => force || !fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs;
const hasFfmpeg = (() => { try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

const manifest = { gallery: {}, art: {} };
let built = 0;

// ---------- Gallery ----------
for (const item of gallery) {
  const src = path.join(GALLERY_SRC, item.src);
  const slug = slugify(path.basename(item.src));
  if (!fs.existsSync(src)) { console.warn(`  missing: ${item.src}`); continue; }

  if (item.video) {
    const out = path.join(OUT.video, `${slug}.mp4`);
    const poster = path.join(OUT.video, `${slug}.webp`);
    if (hasFfmpeg && stale(src, out)) {
      console.log(`  video  ${item.src}`);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src,
        '-vf', "scale='min(1280,iw)':-2,fps=30", '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '96k', out]);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '1', '-i', out, '-frames:v', '1',
        '-vf', "scale='min(900,iw)':-2", poster]);
      built++;
    }
    if (fs.existsSync(poster)) {
      const { width, height } = await sharp(poster).metadata();
      manifest.gallery[item.src] = { slug, width, height, video: `media/video/${slug}.mp4`, poster: `media/video/${slug}.webp` };
    }
    continue;
  }

  const sm = path.join(OUT.gallery, `${slug}-sm.webp`);
  const lg = path.join(OUT.gallery, `${slug}-lg.webp`);
  // MS Paint pieces are pixel art: scale with nearest-neighbour so they stay crisp.
  const kernel = item.pixel ? 'nearest' : 'lanczos3';
  if (stale(src, lg)) {
    console.log(`  image  ${item.src}`);
    const img = sharp(src).rotate();
    await img.clone().resize({ width: 900, withoutEnlargement: !item.pixel, kernel }).webp({ quality: 80 }).toFile(sm);
    await img.clone().resize({ width: 2000, withoutEnlargement: !item.pixel, kernel }).webp({ quality: 84 }).toFile(lg);
    built++;
  }
  const { width, height } = await sharp(sm).metadata();
  manifest.gallery[item.src] = { slug, width, height, sm: `media/gallery/${slug}-sm.webp`, lg: `media/gallery/${slug}-lg.webp` };
}

// ---------- Art ----------
// Files may sit in art-source/ or art-source/assets/, and a few common spellings are accepted.
const ALIASES = { 'ch2-origin': 'ch2-journey' };
const canonical = (base) => {
  const n = base.toLowerCase().replace(/^ink-splat-(\d)$/, 'ink-splat-0$1');
  return ALIASES[n] || n;
};
const artFiles = [ART_SRC, path.join(ART_SRC, 'assets')]
  .filter((d) => fs.existsSync(d))
  .flatMap((d) => fs.readdirSync(d).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).map((f) => path.join(d, f)));

/** Box inside a white margin + panel border (the frame some artwork was generated with). */
async function frameBox(file) {
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const share = (count, at) => { let d = 0; let n = 0; for (let k = 0; k < count; k += 4, n++) if (at(k) < 90) d++; return d / n; };
  const row = (y) => share(W, (x) => data[y * W + x]);
  const col = (x) => share(H, (y) => data[y * W + x]);
  // Walk in from an edge past the margin to the border line, then past the line (≤ 40px thick).
  const inset = (n, line) => {
    let i = 0;
    while (i < n * 0.15 && line(i) <= 0.6) i++;
    if (i >= n * 0.15) return 0;
    const start = i;
    while (i < start + 40 && line(i) > 0.6) i++;
    return i + 4;
  };
  const top = inset(H, row);
  const bottom = inset(H, (i) => row(H - 1 - i));
  const left = inset(W, col);
  const right = inset(W, (i) => col(W - 1 - i));
  return { left, top, width: W - left - right, height: H - top - bottom };
}

/** Pixels that are near-white on every channel become pure white (clean multiply blending). */
async function whiten(img, threshold) {
  const { data, info } = await img.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 3) {
    if (data[i] >= threshold && data[i + 1] >= threshold && data[i + 2] >= threshold) data[i] = data[i + 1] = data[i + 2] = 255;
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).png();
}

/** Seamless 2×2 mirrored tile from a centre square crop. */
async function mirrorTile(file, size) {
  const quad = await sharp(file).resize({ width: size, height: size, fit: 'cover' }).toBuffer();
  const [flop, flip, both] = await Promise.all([
    sharp(quad).flop().toBuffer(),
    sharp(quad).flip().toBuffer(),
    sharp(quad).flip().flop().toBuffer(),
  ]);
  return sharp({ create: { width: size * 2, height: size * 2, channels: 3, background: '#ffffff' } }).composite([
    { input: quad, left: 0, top: 0 },
    { input: flop, left: size, top: 0 },
    { input: flip, left: 0, top: size },
    { input: both, left: size, top: size },
  ]);
}

for (const [name, spec] of Object.entries(ART)) {
  const src = artFiles.find((f) => canonical(path.parse(f).name) === name);
  if (!src) continue;
  const ext = spec.format === 'jpg' ? 'jpg' : 'webp';
  const out = path.join(OUT.art, `${name}.${ext}`);
  if (stale(src, out)) {
    console.log(`  art    ${path.relative(ART_SRC, src)} -> ${name}.${ext}`);
    let img;
    if (spec.tile) img = sharp(await (await mirrorTile(src, spec.tile)).png().toBuffer());
    else {
      img = sharp(src);
      if (spec.unframe) img = img.extract(await frameBox(src));
      if (spec.trim) {
        const { width, height } = await sharp(src).metadata();
        const [t, rr, b, l] = spec.trim;
        img = img.extract({ left: Math.round(width * l), top: Math.round(height * t), width: Math.round(width * (1 - l - rr)), height: Math.round(height * (1 - t - b)) });
      }
      if (spec.square) {
        const { width, height } = await sharp(await img.toBuffer()).metadata();
        const s = Math.max(width, height);
        img = sharp(await img.toBuffer()).resize({ width: s, height: s, fit: 'contain', position: spec.square, background: '#ffffff' });
      }
      if (spec.whiten) img = await whiten(sharp(await img.toBuffer()), spec.whiten);
      img = sharp(await img.toBuffer()).resize({ width: spec.w, withoutEnlargement: true });
    }
    if (spec.mask) img = img.greyscale().normalise();
    else if (spec.grey) img = img.greyscale();
    img = ext === 'jpg' ? img.jpeg({ quality: 85, mozjpeg: true }) : img.webp({ quality: spec.mask ? 90 : 84 });
    await img.toFile(out);
    built++;
  }
  const { width, height } = await sharp(out).metadata();
  manifest.art[name] = { src: `art/${name}.${ext}`, width, height };
}

// ---------- Portrait + résumés ----------
const pfp = r('portfolio_pfp.jpg');
const pfpOut = path.join(OUT.img, 'portrait.webp');
if (fs.existsSync(pfp) && stale(pfp, pfpOut)) {
  await sharp(pfp).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 85 }).toFile(pfpOut);
  built++;
}
for (const [from, to] of [['Hamza Ahmad Mir_Dev.pdf', 'hamza-ahmad-mir-developer.pdf'], ['Hamza Ahmad Mir_GraphicDesign.pdf', 'hamza-ahmad-mir-design.pdf']]) {
  if (fs.existsSync(r(from)) && stale(r(from), path.join(OUT.resume, to))) fs.copyFileSync(r(from), path.join(OUT.resume, to));
}

fs.writeFileSync(r('src/data/media.generated.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`done — ${built} file(s) built, ${Object.keys(manifest.art).length} art slot(s) filled${hasFfmpeg ? '' : ' (ffmpeg not found: videos skipped)'}`);
