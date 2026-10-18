// Chapter II reads left-to-right like a comic strip while the page is held in place.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { docTop } from '../env.js';
import { splitChars } from '../kinetic.js';

export function initExperience({ full, still }) {
  const sec = document.getElementById('experience');
  const track = document.getElementById('expTrack');
  const bar = document.getElementById('expProgress');
  const cards = [...sec.querySelectorAll('.exp-card--job, .exp-card--end')];
  if (still) return;

  if (!full) {
    cards.forEach((card) => {
      gsap.from(card.querySelectorAll('.exp-card__body > *, .exp-card__next, .exp-card__next-title'), {
        y: 40, opacity: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.08,
        scrollTrigger: { trigger: card, start: 'top 80%', once: true },
      });
    });
    return;
  }

  const extra = () => track.scrollWidth - innerWidth;
  const size = () => { sec.style.height = `${innerHeight + extra()}px`; };
  size();
  ScrollTrigger.addEventListener('refreshInit', size);

  const strip = gsap.to(track, {
    x: () => -extra(),
    ease: 'none',
    scrollTrigger: {
      start: () => docTop(sec),
      end: () => docTop(sec) + extra(),
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
    },
  });

  cards.forEach((card) => {
    const st = { containerAnimation: strip, trigger: card, start: 'left 78%', toggleActions: 'play none none reverse' };
    const role = card.querySelector('.exp-card__role');
    const tl = gsap.timeline({ scrollTrigger: st });
    tl.from(card, { rotation: gsap.utils.random(-4, 4), y: 60, duration: 0.7, ease: 'back.out(1.4)' }, 0);
    if (role) tl.from(splitChars(role), { yPercent: () => gsap.utils.random(-120, 120), rotation: () => gsap.utils.random(-30, 30), opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: { each: 0.02, from: 'random' } }, 0.15);
    tl.from(card.querySelectorAll('.exp-card__date, .exp-card__company, .exp-card__notes li, .exp-card__next, .exp-card__next-title, .exp-card--end .caption'), {
      x: 60, opacity: 0, rotation: -3, duration: 0.5, ease: 'back.out(2)', stagger: 0.08,
    }, 0.25);

    const year = card.querySelector('[data-depth]');
    if (year) {
      gsap.fromTo(year, { xPercent: 30 }, {
        xPercent: -40, ease: 'none',
        scrollTrigger: { containerAnimation: strip, trigger: card, start: 'left right', end: 'right left', scrub: true },
      });
    }
    const art = card.querySelector('.exp-card__art');
    if (art) {
      gsap.fromTo(art, { backgroundPosition: '30% 50%' }, {
        backgroundPosition: '70% 50%', ease: 'none',
        scrollTrigger: { containerAnimation: strip, trigger: card, start: 'left right', end: 'right left', scrub: true },
      });
    }
  });

  sec.querySelectorAll('.exp-gutter .caption').forEach((c) => {
    gsap.from(c, { scale: 0.3, rotation: -15, opacity: 0, duration: 0.5, ease: 'back.out(2.5)', scrollTrigger: { containerAnimation: strip, trigger: c, start: 'left 85%', toggleActions: 'play none none reverse' } });
  });
}
