// Top bar chapter indicator, Contents overlay, and "Meanwhile…" jump transitions.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { docTop, isFull } from '../env.js';
import { scrollToY, lockScroll } from '../smooth.js';

export function initNav(scenes) {
  const pageNo = document.getElementById('pageNo');
  const chapterName = document.getElementById('chapterName');
  const menuBtn = document.getElementById('menuBtn');
  const contents = document.getElementById('contents');
  const items = [...contents.querySelectorAll('li')];
  const names = items.map((li) => li.querySelector('.contents__name'));

  // ---------- Chapter indicator ----------
  let current = -1;
  const setChapter = (i) => {
    if (i === current) return;
    current = i;
    const label = scenes[i].dataset.chapter;
    const pg = `PG. ${String(i + 1).padStart(2, '0')}`;
    gsap.timeline()
      .to(chapterName, { yPercent: -110, opacity: 0, duration: 0.18, ease: 'power2.in' })
      .add(() => { chapterName.textContent = label; pageNo.textContent = pg; })
      .fromTo(chapterName, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
  };
  const track = () => {
    const y = window.scrollY + innerHeight * 0.5;
    let i = 0;
    scenes.forEach((s, k) => { if (docTop(s) <= y) i = k; });
    setChapter(i);
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: track });
  track();

  // ---------- Contents overlay ----------
  let open = false;
  const toggleMenu = (state = !open) => {
    open = state;
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      contents.hidden = false;
      lockScroll(true);
      const r = menuBtn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      gsap.fromTo(contents, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${Math.hypot(innerWidth, innerHeight)}px at ${cx}px ${cy}px)`, duration: 0.7, ease: 'power3.inOut' });
      gsap.fromTo(names, { yPercent: 100, opacity: 0, '--wdth': 50 }, { yPercent: 0, opacity: 1, '--wdth': 90, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.05, delay: 0.2 });
      items[0].querySelector('a').focus({ preventScroll: true });
    } else {
      gsap.to(contents, {
        clipPath: 'circle(0px at 100% 0%)',
        duration: 0.45,
        ease: 'power3.in',
        onComplete: () => { contents.hidden = true; lockScroll(false); },
      });
    }
  };
  menuBtn.addEventListener('click', () => toggleMenu());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) toggleMenu(false); });

  names.forEach((n) => {
    const a = n.closest('a');
    const set = (w) => () => gsap.to(n, { '--wdth': w, duration: 0.5, ease: 'power3.out' });
    a.addEventListener('pointerenter', set(150));
    a.addEventListener('pointerleave', set(90));
    a.addEventListener('focus', set(150));
    a.addEventListener('blur', set(90));
  });

  // ---------- Jumps ----------
  // Freeze-frame, the "To Be Continued" arrow slides in, then a black panel cuts to the target.
  const book = document.getElementById('book');
  const wipe = document.createElement('div');
  wipe.className = 'jump';
  wipe.innerHTML = '<div class="jump__wipe"><p class="caption"></p></div><div class="tbc-wrap"><div class="tbc"><span>To Be Continued</span></div></div>';
  document.body.append(wipe);
  const panel = wipe.querySelector('.jump__wipe');
  const wipeCap = wipe.querySelector('.caption');
  const arrow = wipe.querySelector('.tbc-wrap');
  let jumping = false;

  const jumpTo = (id) => {
    const target = document.getElementById(id);
    if (!target || jumping) return;
    const y = docTop(target);
    if (!isFull) { scrollToY(y); return; }
    jumping = true;
    const name = target.dataset.chapter;
    wipeCap.textContent = id === 'hero' ? 'Back to the cover…' : `Meanwhile, in “${name}”…`;
    gsap.timeline({ onComplete: () => { jumping = false; } })
      .set(wipe, { visibility: 'visible' })
      .set(panel, { clipPath: 'polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)' })
      .add(() => book.classList.add('is-frozen'))
      .fromTo(arrow, { xPercent: 160, x: innerWidth }, { xPercent: 0, x: 0, duration: 0.5, ease: 'power4.out' })
      .to(panel, { clipPath: 'polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)', duration: 0.45, ease: 'power3.inOut' }, '+=0.45')
      .to(arrow, { opacity: 0, duration: 0.2 }, '<')
      .from(wipeCap, { scale: 0.6, rotation: -6, opacity: 0, duration: 0.35, ease: 'back.out(2.5)' }, '-=0.15')
      .add(() => { book.classList.remove('is-frozen'); scrollToY(y, { immediate: true }); ScrollTrigger.update(); })
      .to(panel, { clipPath: 'polygon(120% 0%, 120% 0%, 100% 100%, 100% 100%)', duration: 0.5, ease: 'power3.inOut' }, '+=0.3')
      .set(wipe, { visibility: 'hidden' })
      .set(arrow, { opacity: 1 });
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-jump]');
    if (!link) return;
    e.preventDefault();
    const id = link.dataset.jump;
    if (open) {
      toggleMenu(false);
      gsap.delayedCall(0.3, () => jumpTo(id));
    } else jumpTo(id);
  });

  return { jumpTo };
}
