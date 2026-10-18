import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

import { mode, isFull, applyArt, url, art } from './js/env.js';
import { initSmooth, getLenis } from './js/smooth.js';
import { boundary, getBoundaries } from './js/scenes.js';
import { chapterIntro, menace } from './js/kinetic.js';
import { peel } from './js/fx/peel.js';
import { dive } from './js/fx/dive.js';
import { sfx } from './js/fx/sfx.js';
import { halftone } from './js/fx/halftone.js';
import { ink } from './js/fx/ink.js';
import { initNav } from './js/ui/nav.js';
import { initLightbox } from './js/ui/lightbox.js';
import { initModal } from './js/ui/modal.js';
import { initCursor } from './js/ui/cursor.js';
import { initHero } from './js/sections/hero.js';
import { initAbout } from './js/sections/about.js';
import { initExperience } from './js/sections/experience.js';
import { initProjects } from './js/sections/projects.js';
import { initGallery } from './js/sections/gallery.js';
import { initSkills } from './js/sections/skills.js';
import { initContact } from './js/sections/contact.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const root = document.documentElement;
root.classList.add(`mode-${mode}`);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
applyArt();
root.style.setProperty('--photo', `url("${url('img/portrait.webp')}")`);

const $ = (id) => document.getElementById(id);
const scenes = [...document.querySelectorAll('[data-scene]')];
// Earlier pages sit on top of later ones so each transition can uncover the next page.
scenes.forEach((s, i) => { s.style.zIndex = String(50 - i); });

const full = isFull;
const still = mode === 'still';

/** Wait for fonts + cover imagery (with a ceiling) while the loader bar fills. */
async function preload() {
  const bar = $('loaderBar');
  const jobs = [
    document.fonts.ready,
    $('hero').querySelector('.hero__photo').decode().catch(() => {}),
    ...['cover-islamabad', 'paper-grain'].map((n) => art(n)).filter(Boolean).map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => {});
    }),
  ];
  let done = 0;
  jobs.forEach((j) => j.then(() => { bar.style.width = `${(++done / jobs.length) * 100}%`; }));
  await Promise.race([Promise.all(jobs), new Promise((r) => setTimeout(r, 4000))]);
}

function liteChapters() {
  const captions = ['And so it began…', 'Some time later…', 'Meanwhile, in the armoury…', 'Elsewhere, the ink was still wet…', 'That same night…', 'And finally…'];
  scenes.slice(1).forEach((scene, i) => {
    const g = document.createElement('div');
    g.className = 'lite-gutter';
    g.setAttribute('aria-hidden', 'true');
    g.innerHTML = `<p class="caption caption--small">${captions[i]}</p>`;
    scene.before(g);
    gsap.from(g.firstElementChild, { scale: 0.4, rotation: -10, opacity: 0, duration: 0.5, ease: 'back.out(2.4)', scrollTrigger: { trigger: g, start: 'top 85%', once: true } });
  });
  document.querySelectorAll('[data-intro]').forEach((head) => {
    const tl = chapterIntro(head);
    ScrollTrigger.create({ trigger: head, start: 'top 80%', once: true, onEnter: () => tl.play() });
  });
}

async function boot() {
  await preload();
  if (full) initSmooth();

  const lightbox = initLightbox();
  initModal();
  const opts = { full, still };
  const hero = initHero(opts);
  if (!still) document.querySelectorAll('[data-menace]').forEach(menace);
  initAbout(opts);
  initExperience(opts);
  initProjects(opts);
  initGallery({ ...opts, lightbox });
  initSkills(opts);
  initContact(opts);

  if (full) {
    initCursor();
    const [cover, about, experience, projects, design, skills, contact] = scenes;
    boundary(cover, about, peel({ template: 'tpl-inside-cover' }), { length: 1.9 });
    boundary(about, experience, dive({ panel: $('divePanel'), window: $('diveWindow'), source: $('expTitleCard') }), { length: 1.7 });
    boundary(experience, projects, sfx({ word: 'ドドドド!' }), { length: 1.8 });
    boundary(projects, design, halftone(), { length: 1.8 });
    boundary(design, skills, ink(), { length: 1.9 });
    boundary(skills, contact, peel({ template: 'tpl-back-cover' }), { length: 1.9 });
  } else if (!still) {
    liteChapters();
  }

  initNav(scenes);
  window.scrollTo(0, 0);
  ScrollTrigger.refresh();
  if (import.meta.env.DEV) window.__dbg = { ScrollTrigger, getBoundaries, lenis: getLenis() };

  const loader = $('loader');
  if (still) {
    loader.remove();
    return;
  }
  gsap.timeline()
    .to(loader.firstElementChild, { scale: 0.9, opacity: 0, duration: 0.35, ease: 'power2.in' })
    .to(loader, { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', duration: 0.7, ease: 'power4.inOut' })
    .add(() => hero.intro.play(), '-=0.35')
    .add(() => loader.remove());
}

boot();
