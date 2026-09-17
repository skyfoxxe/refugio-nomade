const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const motiveItems = document.querySelectorAll('.motive-item');
const motiveImage = document.getElementById('motive-image');
const motiveNumber = document.getElementById('motive-number');
const motiveTitle = document.getElementById('motive-title');
const motiveCopy = document.getElementById('motive-copy');
const motiveLink = document.getElementById('motive-link');

motiveItems.forEach((item, index) => {
  item.querySelector('button').addEventListener('click', () => {
    motiveItems.forEach(other => other.classList.remove('active'));
    item.classList.add('active');

    motiveNumber.textContent = String(index + 1).padStart(2, '0');
    motiveTitle.textContent = item.dataset.title;
    motiveCopy.textContent = item.dataset.copy;
    motiveLink.href = item.dataset.link;
    motiveLink.textContent = item.dataset.cta;
    motiveImage.src = item.dataset.image;
    motiveImage.alt = item.dataset.title;

    if (window.innerWidth <= 720) {
      setTimeout(() => {
        document.querySelector('.motive-stage')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 80);
    }
  });
});

const daySteps = document.querySelectorAll('.day-step');
const dayImage = document.getElementById('day-image');
const dayTime = document.getElementById('day-time');
const dayCopy = document.getElementById('day-copy');

const dayData = [
  {
    time: '07:02',
    copy: 'Você ainda não precisa levantar.',
    image: 'https://storage.googleapis.com/production-hostgator-brasil-v1-0-9/789/866789/nM4Ek4OJ/2f94db7997754373a3104445309502f4'
  },
  {
    time: '08:15',
    copy: 'Café quente, frutas, pães e nenhuma fila de buffet.',
    image: 'https://a0.muscache.com/im/pictures/80597a72-1e64-4705-b9a1-3f32ebe99bbc.jpg'
  },
  {
    time: '10:48',
    copy: 'Talvez uma caminhada. Talvez um livro. Talvez nada.',
    image: 'https://exploreturdf.com.br/wp-content/uploads/2022/11/DSC03615-scaled-e1667333240603.jpg'
  },
  {
    time: '16:40',
    copy: 'O ar começa a mudar. É uma boa hora para banho quente.',
    image: 'https://storage.googleapis.com/production-hostgator-brasil-v1-0-9/789/866789/nM4Ek4OJ/6b6874af0d17499ba0085601802a1f6f'
  },
  {
    time: '19:18',
    copy: 'A mata escurece e as luzes do chalé acendem.',
    image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1252503166432124872/original/68f434cc-94cc-4aa7-b6c9-ece641fa9632.jpeg'
  },
  {
    time: '22:03',
    copy: 'Nenhum compromisso amanhã cedo.',
    image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQyNDEwNTU1MTg0NjI4MTcyMw%3D%3D/original/e1d58c79-560b-4803-8367-a3b180acc2c5.jpeg'
  }
];

daySteps.forEach(step => {
  step.addEventListener('click', () => {
    daySteps.forEach(other => other.classList.remove('active'));
    step.classList.add('active');

    const data = dayData[Number(step.dataset.step)];
    dayTime.textContent = data.time;
    dayCopy.textContent = data.copy;
    dayImage.src = data.image;
    dayImage.alt = `Chalé A-frame no Refúgio Nômade — ${data.time}`;
  });
});

document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
});

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    const hero = img.closest('.hero-photo');
    if (hero) hero.classList.add('image-error');

    const wrap = img.parentElement;
    if (wrap) {
      wrap.style.background = 'linear-gradient(135deg,#18211C,#6A4B35)';
      img.style.display = 'none';
    }
  });
});

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}


// =========================================================
// ESTRATÉGICO V4 — motion and contextual experience
// =========================================================
const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

// Ambient hero: slow breathing lives in CSS; pointer only adds a few pixels of depth.
const heroScene = document.querySelector('[data-depth-scene]');
if (heroScene && finePointer && !motionReduced) {
  heroScene.addEventListener('pointermove', (event) => {
    const rect = heroScene.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - .5;
    const ny = (event.clientY - rect.top) / rect.height - .5;
    heroScene.style.setProperty('--hero-x', `${nx * -7}px`);
    heroScene.style.setProperty('--hero-y', `${ny * -5}px`);
    heroScene.style.setProperty('--hero-light-x', `${(nx + .5) * 100}%`);
    heroScene.style.setProperty('--hero-light-y', `${(ny + .5) * 100}%`);
  });
  heroScene.addEventListener('pointerleave', () => {
    heroScene.style.setProperty('--hero-x', '0px');
    heroScene.style.setProperty('--hero-y', '0px');
    heroScene.style.setProperty('--hero-light-x', '45%');
    heroScene.style.setProperty('--hero-light-y', '38%');
  });
}

// Ambient light follows the pointer only inside the strategic selector.
document.querySelectorAll('[data-pointer-ambient]').forEach(section => {
  if (!finePointer || motionReduced) return;
  section.addEventListener('pointermove', event => {
    const rect = section.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    section.style.setProperty('--ambient-x', `${x}%`);
    section.style.setProperty('--ambient-y', `${y}%`);
  });
});

// Small photographic depth on the result card.
document.querySelectorAll('[data-tilt-card]').forEach(card => {
  if (!finePointer || motionReduced) return;
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - .5;
    const ny = (event.clientY - rect.top) / rect.height - .5;
    card.style.setProperty('--tilt-x', `${nx * -9}px`);
    card.style.setProperty('--tilt-y', `${ny * -7}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0px');
    card.style.setProperty('--tilt-y', '0px');
  });
});

// Cabin recommender.
const finder = document.querySelector('.finder-section');
if (finder) {
  const result = document.getElementById('finder-result');
  const title = document.getElementById('finder-title');
  const copy = document.getElementById('finder-copy');
  const image = document.getElementById('finder-image');
  const badge = document.getElementById('finder-badge');
  const reasons = document.getElementById('finder-reasons');
  const cta = document.getElementById('finder-cta');

  let vibe = finder.querySelector('[data-vibe].active')?.dataset.vibe || 'isolamento';
  let moment = finder.querySelector('[data-moment].active')?.dataset.moment || 'dois';

  const cabins = {
    Bruma: {
      image: 'https://storage.googleapis.com/production-hostgator-brasil-v1-0-9/789/866789/nM4Ek4OJ/6b6874af0d17499ba0085601802a1f6f',
      alt: 'Cabin Bruma reservada entre árvores',
      badge: 'mais reservada',
      copy: 'Mais reservada, cercada pela mata e pensada para quem quer diminuir o ritmo sem desaparecer do conforto.',
      reasons: ['mais privacidade','banheira externa','ritmo mais lento']
    },
    Horizonte: {
      image: 'https://a0.muscache.com/im/pictures/80597a72-1e64-4705-b9a1-3f32ebe99bbc.jpg',
      alt: 'Cabin Horizonte com fachada envidraçada e vista',
      badge: 'vista e luz',
      copy: 'Uma cabin para quem quer abrir os olhos e encontrar a paisagem antes de encontrar qualquer compromisso.',
      reasons: ['fachada envidraçada','deck panorâmico','luz natural']
    },
    Orvalho: {
      image: 'https://exploreturdf.com.br/wp-content/uploads/2022/11/DSC03615-scaled-e1667333240603.jpg',
      alt: 'Cabin Orvalho cercada pela natureza',
      badge: 'perto da mata',
      copy: 'Equilíbrio entre conforto, natureza e simplicidade. Uma boa primeira experiência para entrar no ritmo do Refúgio.',
      reasons: ['deck privativo','café sem pressa','natureza por perto']
    },
    Lua: {
      image: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1252503166432124872/original/68f434cc-94cc-4aa7-b6c9-ece641fa9632.jpeg',
      alt: 'Cabin Lua iluminada ao anoitecer',
      badge: 'noite especial',
      copy: 'Mais espaço, atmosfera noturna e detalhes pensados para quando a própria hospedagem faz parte da ocasião.',
      reasons: ['banheira de imersão','mais espaço','clima para celebrar']
    }
  };

  function recommendation(v, m) {
    // Strong preference comes first, with the second answer refining close cases.
    if (v === 'noite' || m === 'celebrar') return 'Lua';
    if (v === 'vista') return m === 'sozinho' ? 'Horizonte' : 'Horizonte';
    if (v === 'mata') return m === 'celebrar' ? 'Lua' : 'Orvalho';
    if (v === 'isolamento') return m === 'sem-agenda' || m === 'sozinho' || m === 'dois' ? 'Bruma' : 'Lua';
    return 'Bruma';
  }

  function updateFinder() {
    const name = recommendation(vibe, moment);
    const data = cabins[name];
    result?.classList.add('is-changing');
    window.setTimeout(() => {
      title.textContent = `Cabin ${name}`;
      copy.textContent = data.copy;
      image.src = data.image;
      image.alt = data.alt;
      badge.textContent = data.badge;
      reasons.innerHTML = data.reasons.map(reason => `<span>${reason}</span>`).join('');
      const msg = encodeURIComponent(`Olá! O site me recomendou a Cabin ${name} e gostaria de consultar disponibilidade e valores.`);
      cta.href = `https://wa.me/5565999999999?text=${msg}`;
      cta.textContent = `Consultar a Cabin ${name} pelo WhatsApp ↗`;
      requestAnimationFrame(() => result?.classList.remove('is-changing'));
    }, motionReduced ? 0 : 190);
  }

  finder.querySelectorAll('[data-vibe]').forEach(button => {
    button.addEventListener('click', () => {
      finder.querySelectorAll('[data-vibe]').forEach(other => other.classList.remove('active'));
      button.classList.add('active');
      vibe = button.dataset.vibe;
      updateFinder();
    });
  });

  finder.querySelectorAll('[data-moment]').forEach(button => {
    button.addEventListener('click', () => {
      finder.querySelectorAll('[data-moment]').forEach(other => other.classList.remove('active'));
      button.classList.add('active');
      moment = button.dataset.moment;
      updateFinder();
    });
  });
}

// Day-stage transition: different warmth along the day.
const dayStage = document.querySelector('.day-stage');
const dayWarmth = [0.06,0.10,0.03,0.12,0.18,0.07];
if (dayStage && daySteps.length) {
  daySteps.forEach(step => {
    step.addEventListener('click', () => {
      const idx = Number(step.dataset.step);
      dayStage.classList.add('day-changing');
      dayStage.style.setProperty('--day-warmth', String(dayWarmth[idx] ?? .05));
      window.setTimeout(() => dayStage.classList.remove('day-changing'), motionReduced ? 0 : 320);
    });
  });
}

// Stillness sequence: the scrolling itself slows the narrative down.
const stillness = document.querySelector('.stillness-section');
if (stillness && !motionReduced && window.innerWidth > 720) {
  const phrases = [...stillness.querySelectorAll('.stillness-phrases p')];
  const imageStage = stillness.querySelector('.stillness-sticky');
  let ticking = false;

  const updateStillness = () => {
    const rect = stillness.getBoundingClientRect();
    const travel = Math.max(1, stillness.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -rect.top / travel));
    const index = Math.min(phrases.length - 1, Math.floor(progress * phrases.length));
    phrases.forEach((p, i) => p.classList.toggle('active', i === index));
    imageStage?.style.setProperty('--still-y', `${(progress - .5) * -22}px`);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateStillness);
    }
  };
  updateStillness();
  window.addEventListener('scroll', onScroll, { passive: true });
}


// =========================================================
// ESTRATÉGICO V5 — ciclo de luz guiado pelo scroll
// A passagem começa em "Um dia por aqui" para preservar os
// estados visuais das áreas já utilizadas no portfólio.
// =========================================================
(() => {
  const startSection = document.querySelector('.day-section');
  const endSection = document.querySelector('.final-cta');
  const dayStageEl = document.querySelector('.day-stage');

  if (!startSection || !endSection) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Morning -> warm dusk -> deep green -> night.
  const stops = [
    { p: 0.00, c: [43, 54, 43], warm: 0.05, night: 0.00 },
    { p: 0.22, c: [60, 47, 34], warm: 0.17, night: 0.12 },
    { p: 0.45, c: [34, 39, 31], warm: 0.11, night: 0.30 },
    { p: 0.68, c: [20, 27, 22], warm: 0.055, night: 0.54 },
    { p: 0.84, c: [12, 17, 14], warm: 0.025, night: 0.74 },
    { p: 1.00, c: [6, 9, 7], warm: 0.00, night: 0.94 }
  ];

  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const lerp = (a, b, t) => a + (b - a) * t;

  function sample(progress) {
    const p = clamp(progress);
    let a = stops[0], b = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
      if (p >= stops[i].p && p <= stops[i + 1].p) {
        a = stops[i];
        b = stops[i + 1];
        break;
      }
    }

    const span = Math.max(.0001, b.p - a.p);
    const t = clamp((p - a.p) / span);

    return {
      c: a.c.map((v, i) => Math.round(lerp(v, b.c[i], t))),
      warm: lerp(a.warm, b.warm, t),
      night: lerp(a.night, b.night, t)
    };
  }

  let raf = 0;

  function updateCycle() {
    raf = 0;

    if (reducedMotion) {
      root.style.setProperty('--cycle-bg-r', '18');
      root.style.setProperty('--cycle-bg-g', '24');
      root.style.setProperty('--cycle-bg-b', '20');
      root.style.setProperty('--cycle-warmth', '.03');
      root.style.setProperty('--cycle-night', '.55');
      dayStageEl?.style.setProperty('--scroll-dim', '.45');
      return;
    }

    const start = startSection.offsetTop - window.innerHeight * 0.55;
    const end = endSection.offsetTop + endSection.offsetHeight - window.innerHeight * 0.45;
    const progress = clamp((window.scrollY - start) / Math.max(1, end - start));

    const state = sample(progress);
    root.style.setProperty('--cycle-bg-r', String(state.c[0]));
    root.style.setProperty('--cycle-bg-g', String(state.c[1]));
    root.style.setProperty('--cycle-bg-b', String(state.c[2]));
    root.style.setProperty('--cycle-warmth', state.warm.toFixed(3));
    root.style.setProperty('--cycle-night', state.night.toFixed(3));

    // Extra darkening inside the "day" visual itself so the passage is
    // perceptible even before reaching the next section.
    if (dayStageEl) {
      const rect = startSection.getBoundingClientRect();
      const localTravel = Math.max(1, startSection.offsetHeight + window.innerHeight * .25);
      const local = clamp((-rect.top + window.innerHeight * .55) / localTravel);
      dayStageEl.style.setProperty('--scroll-dim', local.toFixed(3));
    }
  }

  function onScroll() {
    if (!raf) raf = requestAnimationFrame(updateCycle);
  }

  updateCycle();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
})();
