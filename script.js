/* Refúgio Nômade — v6 quiet luxury */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SWAP_MS = reducedMotion ? 0 : 280;

  /* ---------- WhatsApp: uma única fonte para as mensagens ---------- */

  const WHATSAPP = '5565999999999';
  const waMessages = {
    geral: 'Olá! Vim pelo site do Refúgio Nômade e gostaria de consultar disponibilidade, valores e cabins para uma hospedagem.',
    ajuda: 'Olá! Vim pelo site do Refúgio Nômade e gostaria de ajuda para escolher qual cabin combina mais com a viagem que estou planejando.',
    experiencias: 'Olá! Vim pelo site do Refúgio Nômade e gostaria de conhecer as experiências que podem ser adicionadas à hospedagem.'
  };
  const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const cabinMessage = (name) =>
    `Olá! Vim pelo site do Refúgio Nômade e gostaria de consultar disponibilidade e valores para a Cabin ${name}.`;

  document.querySelectorAll('[data-wa]').forEach((link) => {
    const key = link.dataset.wa;
    link.href = waLink(waMessages[key] || cabinMessage(key));
  });

  /* ---------- Cabeçalho e menu ---------- */

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  const toggleLabel = toggle?.querySelector('.menu-toggle-label');

  const setMenu = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? 'Fechar' : 'Menu';
  };

  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Imagens: falha silenciosa, sem quebrar o layout ---------- */

  const markBroken = (img) => img.closest('.frame')?.classList.add('is-broken');
  document.querySelectorAll('.frame img').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) markBroken(img);
    img.addEventListener('error', () => markBroken(img));
    img.addEventListener('load', () => img.closest('.frame')?.classList.remove('is-broken'));
  });

  /* Troca uma imagem com um fade curto, só depois que a nova carregou. */
  const swapImage = (img, src, alt) => {
    const frame = img.closest('.frame');
    img.dataset.target = src;               // a última escolha sempre vence
    if (img.getAttribute('src') === src) { img.alt = alt; frame?.classList.remove('is-swapping'); return; }
    const preload = new Image();
    const apply = () => {
      if (img.dataset.target !== src) return;
      img.src = src;
      img.alt = alt;
      window.setTimeout(() => frame?.classList.remove('is-swapping'), 20);
    };
    frame?.classList.add('is-swapping');
    preload.onload = () => window.setTimeout(apply, SWAP_MS);
    preload.onerror = apply;
    preload.src = src;
  };

  /* ---------- 02 Sua pausa: recomendação de cabin ---------- */

  const IMG = {
    bruma: 'https://storage.googleapis.com/production-hostgator-brasil-v1-0-9/789/866789/nM4Ek4OJ/6b6874af0d17499ba0085601802a1f6f',
    horizonte: 'https://a0.muscache.com/im/pictures/80597a72-1e64-4705-b9a1-3f32ebe99bbc.jpg',
    orvalho: 'https://exploreturdf.com.br/wp-content/uploads/2022/11/DSC03615-scaled-e1667333240603.jpg',
    lua: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1252503166432124872/original/68f434cc-94cc-4aa7-b6c9-ece641fa9632.jpeg',
    manha: 'https://storage.googleapis.com/production-hostgator-brasil-v1-0-9/789/866789/nM4Ek4OJ/2f94db7997754373a3104445309502f4',
    noite: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQyNDEwNTU1MTg0NjI4MTcyMw%3D%3D/original/e1d58c79-560b-4803-8367-a3b180acc2c5.jpeg'
  };

  const cabins = {
    Bruma: {
      image: IMG.bruma,
      alt: 'Cabin Bruma, reservada entre árvores',
      copy: 'Mais reservada, cercada pela mata e pensada para quem quer diminuir o ritmo sem desaparecer do conforto.',
      traits: ['Mais privacidade', 'Banheira externa', 'Ritmo mais lento']
    },
    Horizonte: {
      image: IMG.horizonte,
      alt: 'Cabin Horizonte, com fachada envidraçada e vista',
      copy: 'Uma cabin para quem quer abrir os olhos e encontrar a paisagem antes de encontrar qualquer compromisso.',
      traits: ['Fachada envidraçada', 'Deck panorâmico', 'Luz natural']
    },
    Orvalho: {
      image: IMG.orvalho,
      alt: 'Cabin Orvalho, cercada pela natureza',
      copy: 'Equilíbrio entre conforto, natureza e simplicidade. Uma boa primeira experiência para entrar no ritmo do Refúgio.',
      traits: ['Deck privativo', 'Café sem pressa', 'Natureza por perto']
    },
    Lua: {
      image: IMG.lua,
      alt: 'Cabin Lua, iluminada ao anoitecer',
      copy: 'Mais espaço, atmosfera noturna e detalhes pensados para quando a própria hospedagem faz parte da ocasião.',
      traits: ['Banheira de imersão', 'Mais espaço', 'Clima para celebrar']
    }
  };

  // A preferência principal decide; a segunda resposta só desempata casos próximos.
  const recommend = (vibe, moment) => {
    if (vibe === 'noite' || moment === 'celebrar') return 'Lua';
    if (vibe === 'vista') return 'Horizonte';
    if (vibe === 'mata') return 'Orvalho';
    return 'Bruma';
  };

  const finder = document.getElementById('pausa');
  if (finder) {
    const state = { vibe: 'isolamento', moment: 'dois' };
    const result = finder.querySelector('.finder-result');
    const el = {
      image: document.getElementById('finder-image'),
      name: document.getElementById('finder-name'),
      text: document.getElementById('finder-text'),
      traits: document.getElementById('finder-traits'),
      cta: document.getElementById('finder-cta')
    };
    let current = 'Bruma';

    const momentText = {
      dois: 'para um fim de semana a dois',
      sozinho: 'para alguns dias só comigo',
      celebrar: 'para celebrar uma data especial',
      'sem-agenda': 'para alguns dias sem agenda'
    };

    const render = () => {
      const name = recommend(state.vibe, state.moment);
      const data = cabins[name];
      const message = `Olá! O site do Refúgio Nômade me recomendou a Cabin ${name} ${momentText[state.moment]}. Gostaria de consultar disponibilidade e valores.`;
      el.cta.href = waLink(message);
      el.cta.textContent = `Consultar a Cabin ${name}`;
      if (name === current) return;
      current = name;

      result.classList.add('is-swapping');
      window.setTimeout(() => {
        el.name.textContent = `Cabin ${name}`;
        el.text.textContent = data.copy;
        el.traits.textContent = data.traits.join(' · ');
        result.classList.remove('is-swapping');
      }, SWAP_MS);
      swapImage(el.image, data.image, data.alt);
    };

    finder.querySelectorAll('.options').forEach((group) => {
      const key = group.dataset.group;
      const buttons = [...group.querySelectorAll('.option')];
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
          state[key] = button.dataset.value;
          render();
        });
      });
    });

    render();
  }

  /* ---------- 04 Um dia aqui ---------- */

  const dayData = [
    { time: '07:02', copy: 'Você ainda não precisa levantar.', image: IMG.manha, alt: 'Luz da manhã entrando em um chalé' },
    { time: '08:15', copy: 'Café quente, frutas, pães e nenhuma fila de buffet.', image: IMG.horizonte, alt: 'Chalé com fachada envidraçada pela manhã' },
    { time: '10:48', copy: 'Talvez uma caminhada. Talvez um livro. Talvez nada.', image: IMG.orvalho, alt: 'Chalé A-frame cercado pelo cerrado' },
    { time: '16:40', copy: 'O ar começa a mudar. É uma boa hora para banho quente.', image: IMG.bruma, alt: 'Chalé com deck e piscina no fim da tarde' },
    { time: '19:18', copy: 'A mata escurece e as luzes do chalé acendem.', image: IMG.lua, alt: 'Chalé A-frame iluminado ao anoitecer' },
    { time: '22:03', copy: 'Nenhum compromisso amanhã cedo.', image: IMG.noite, alt: 'Chalé iluminado entre árvores à noite' }
  ];

  const steps = [...document.querySelectorAll('.day-step')];
  const dayImage = document.getElementById('day-image');
  const dayTime = document.getElementById('day-time');
  const dayCopy = document.getElementById('day-copy');

  steps.forEach((step) => {
    step.addEventListener('click', () => {
      const data = dayData[Number(step.dataset.step)];
      if (!data) return;
      steps.forEach((s) => s.setAttribute('aria-pressed', String(s === step)));
      dayTime.textContent = data.time;
      dayCopy.textContent = data.copy;
      swapImage(dayImage, data.image, data.alt);
    });
  });

  /* ---------- Entrada discreta, uma por bloco ---------- */

  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((node) => node.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((node) => io.observe(node));
  }

  /* ---------- Filete do cabeçalho e barra de contato no celular ---------- */

  const hero = document.querySelector('.hero-copy');
  const closing = document.querySelector('.closing');
  const bar = document.querySelector('.mobile-bar');
  let heroGone = false;
  let closingIn = false;
  const syncBar = () => bar?.classList.toggle('is-visible', heroGone && !closingIn);

  if ('IntersectionObserver' in window) {
    if (hero) {
      new IntersectionObserver(([entry]) => {
        heroGone = !entry.isIntersecting;
        header?.classList.toggle('is-scrolled', heroGone || window.scrollY > 8);
        syncBar();
      }).observe(hero);
    }
    if (closing) {
      new IntersectionObserver(([entry]) => { closingIn = entry.isIntersecting; syncBar(); }).observe(closing);
    }
  }
  window.addEventListener('scroll', () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });
})();
