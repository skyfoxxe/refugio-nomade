/* Refúgio Nômade — v7 · quiet luxury, pacote Estratégico */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SWAP_MS = reducedMotion ? 0 : 160;           // igual a --dur-fast
  const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';  // igual a --ease-out
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Dados ---------- */

  const WHATSAPP = '5565999999999';
  const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  const img = (id, w = 1280) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;
  const srcset = (id) => [640, 960, 1280, 1800].map((w) => `${img(id, w)} ${w}w`).join(', ');

  const CABINS = {
    Orvalho:   { rate: 890,  why: 'A mais leve das quatro, numa clareira voltada para o nascente. Um bom começo para entrar no ritmo do Refúgio.' },
    Horizonte: { rate: 1090, why: 'Fachada inteira de vidro. Para abrir os olhos e encontrar a paisagem antes de qualquer compromisso.' },
    Bruma:     { rate: 1240, why: 'A mais afastada, com banheira externa. Para quem quer diminuir o ritmo sem abrir mão do conforto.' },
    Lua:       { rate: 1480, why: 'A maior, com banheira de imersão e detalhes preparados antes da chegada. Para quando a noite é o motivo.' }
  };

  /* ---------- WhatsApp direto ---------- */

  const waMessages = {
    ajuda: 'Olá! Vim pelo site do Refúgio Nômade e gostaria de ajuda para escolher uma cabin e consultar disponibilidade.'
  };
  $$('[data-wa]').forEach((link) => { link.href = waLink(waMessages[link.dataset.wa] || waMessages.ajuda); });

  /* ---------- Cabeçalho e menu ---------- */

  const header = $('.site-header');
  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');

  const setMenu = (open) => {
    nav?.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    if (toggle) toggle.textContent = open ? 'Fechar' : 'Menu';
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });

  /* ---------- Imagens ---------- */

  const markBroken = (el) => el.closest('.frame')?.classList.add('is-broken');
  $$('.frame img').forEach((el) => {
    if (el.complete && el.naturalWidth > 0) el.classList.add('is-loaded');
    if (el.complete && el.naturalWidth === 0 && el.loading !== 'lazy') markBroken(el);
    el.addEventListener('error', () => { el.classList.add('is-loaded'); markBroken(el); });
    el.addEventListener('load', () => {
      el.classList.add('is-loaded');            // fotos preguiçosas entram com fade, sem "pular"
      el.closest('.frame')?.classList.remove('is-broken');
    });
  });

  /* Título do hero em palavras mascaradas (o texto continua inteiro para leitores de tela) */
  const h1 = $('.hero h1');
  if (h1) {
    let i = 0;
    const label = h1.textContent.replace(/\s+/g, ' ').trim();
    const wrap = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const outer = document.createElement('span');
            outer.className = 'word';
            const inner = document.createElement('span');
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            outer.append(inner);
            frag.append(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrap(child);
        }
      });
    };
    wrap(h1);
    h1.setAttribute('aria-label', label);
    $$('.word', h1).forEach((w) => w.setAttribute('aria-hidden', 'true'));
  }

  // Troca com fade curto, depois que a nova imagem carregou; a última escolha vence.
  const swapImage = (el, id, alt) => {
    const frame = el.closest('.frame');
    el.dataset.target = id;
    const pre = new Image();
    const apply = () => {
      if (el.dataset.target !== id) return;
      el.srcset = srcset(id);
      el.src = img(id);
      el.alt = alt;
      requestAnimationFrame(() => frame?.classList.remove('is-swapping'));
    };
    frame?.classList.add('is-swapping');
    pre.onload = () => setTimeout(apply, SWAP_MS);
    pre.onerror = apply;
    pre.src = img(id, 960);
  };

  /* ---------- II. Cabins em abas ---------- */

  const tabs = $$('.cabin-tab');
  // Pelo teclado a troca é instantânea; no clique, um fade curto evita o "salto" de foto.
  const selectTab = (tab, { focus = false, animate = false } = {}) => {
    if (tab.getAttribute('aria-selected') === 'true') { if (focus) tab.focus(); return; }
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.getAnimations().forEach((a) => a.cancel());
      panel.hidden = !on;
      if (on && animate && panel.animate) {
        const frames = reducedMotion
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }];
        panel.animate(frames, { duration: 220, easing: EASE_OUT });
      }
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', (e) => selectTab(tab, { animate: e.detail > 0 }));
    tab.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      selectTab(tabs[(keys[e.key] + tabs.length) % tabs.length], { focus: true });
    });
  });

  /* ---------- III. Recomendador ---------- */

  const recommend = (vibe, moment) => {
    if (vibe === 'noite' || moment === 'celebrar') return 'Lua';
    if (vibe === 'vista') return 'Horizonte';
    if (vibe === 'mata') return 'Orvalho';
    return 'Bruma';
  };

  const verdict = $('.verdict');
  if (verdict) {
    const state = { vibe: 'isolamento', moment: 'dois' };
    const name = $('#verdict-name');
    const why = $('#verdict-why');
    const cta = $('#verdict-cta');
    let current = 'Bruma';

    const render = () => {
      const pick = recommend(state.vibe, state.moment);
      cta.dataset.plan = pick;
      cta.textContent = `Planejar na ${pick}`;
      if (pick === current) return;
      current = pick;
      verdict.classList.add('is-swapping');
      setTimeout(() => {
        name.textContent = `Cabin ${pick}`;
        why.textContent = CABINS[pick].why;
        verdict.classList.remove('is-swapping');
      }, SWAP_MS);
    };

    $$('.options').forEach((group) => {
      const buttons = $$('.option', group);
      buttons.forEach((b) => b.addEventListener('click', () => {
        buttons.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
        state[group.dataset.group] = b.dataset.value;
        render();
      }));
    });
  }

  /* ---------- IV. Um dia ---------- */

  const DAY = [
    { time: '07:02', copy: 'Você ainda não precisa levantar.', id: 'photo-1529047033375-f402d3da24ca', alt: 'Luz da manhã desenhando a janela na parede, sobre a cama' },
    { time: '08:15', copy: 'Café coado, frutas, pão da região. Tudo na sua porta.', id: 'photo-1552841872-a0841f72a4ee', alt: 'Bandeja de café da manhã com prensa francesa e frutas sobre lençóis' },
    { time: '10:48', copy: 'Os paredões ficam a poucos minutos. A rede, a poucos passos.', id: 'photo-1559562591-6de6f7187f56', alt: 'Vale verde entre paredões de pedra' },
    { time: '16:40', copy: 'A água já está quente. O sol ainda não foi embora.', id: 'photo-1725590137329-f182b5a8fac3', alt: 'Banheira sobre deck de madeira com vista para os morros' },
    { time: '19:18', copy: 'A lenha estava arrumada desde a tarde.', id: 'photo-1627911206549-6c41ed2524de', alt: 'Fogueira acesa no início da noite' },
    { time: '22:03', copy: 'Nenhum compromisso amanhã cedo.', id: 'photo-1601919297600-8ffbfd160d2d', alt: 'Cabin A-frame iluminada por dentro, vista de baixo, à noite' }
  ];
  const steps = $$('.day-step');
  const dayImg = $('#day-image');
  steps.forEach((step) => step.addEventListener('click', () => {
    const d = DAY[Number(step.dataset.step)];
    if (!d) return;
    steps.forEach((s) => s.setAttribute('aria-pressed', String(s === step)));
    $('#day-time').textContent = d.time;
    $('#day-copy').textContent = d.copy;
    if (dayImg) swapImage(dayImg, d.id, d.alt);
  }));

  /* ---------- VII. Planejar estadia ---------- */

  const form = $('#plan-form');
  if (form) {
    const checkin = $('#checkin');
    const checkout = $('#checkout');
    const error = $('#date-error');
    const out = {
      cabin: $('#sum-cabin'), dates: $('#sum-dates'), nights: $('#sum-nights'),
      extras: $('#sum-extras'), total: $('#sum-total')
    };
    const DAY_MS = 86400000;
    const MIN_NIGHTS = 2;
    const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const parse = (v) => (v ? new Date(`${v}T12:00:00`) : null);
    const fmt = (d) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');

    const today = new Date();
    checkin.min = iso(today);
    checkout.min = iso(new Date(today.getTime() + MIN_NIGHTS * DAY_MS));

    const selectedCabin = () => $('input[name="cabin"]:checked', form);

    const read = () => {
      const cabin = selectedCabin();
      const a = parse(checkin.value);
      const b = parse(checkout.value);
      const nights = a && b ? Math.round((b - a) / DAY_MS) : 0;
      const extras = $$('input[name="extra"]:checked', form);
      return { cabin, a, b, nights, extras };
    };

    const dateProblem = ({ a, b, nights }, strict) => {
      if (!a || !b) return strict ? 'Escolha a data de chegada e a de saída.' : '';
      if (a < parse(iso(today))) return 'A chegada precisa ser a partir de hoje.';
      if (nights < 1) return 'A saída precisa ser depois da chegada.';
      if (nights < MIN_NIGHTS) return `A estadia mínima é de ${MIN_NIGHTS} noites.`;
      return '';
    };

    const showError = (msg) => {
      error.textContent = msg;
      const bad = Boolean(msg);
      checkin.setAttribute('aria-invalid', String(bad && (!checkin.value || msg.includes('chegada'))));
      checkout.setAttribute('aria-invalid', String(bad && Boolean(checkin.value) && !msg.includes('chegada precisa')));
    };

    const syncExtras = (cabinName) => {
      $$('.check[data-only]', form).forEach((label) => {
        const ok = label.dataset.only.split(' ').includes(cabinName);
        const input = $('input', label);
        label.classList.toggle('is-unavailable', !ok);
        input.disabled = !ok;
        if (!ok) input.checked = false;
        $('.price', label).textContent = ok ? brl.format(Number(input.dataset.price)) : 'Só Bruma e Lua';
      });
    };

    const update = (touched) => {
      const s = read();
      const name = s.cabin.value;
      syncExtras(name);
      s.extras = $$('input[name="extra"]:checked', form);
      out.cabin.textContent = name;
      out.dates.textContent = s.a && s.b ? `${fmt(s.a)} — ${fmt(s.b)}` : 'Escolha as datas';
      const problem = dateProblem(s, false);
      if (touched) showError(problem);
      const valid = s.a && s.b && !problem;
      out.nights.textContent = valid ? String(s.nights) : '—';
      out.extras.textContent = s.extras.length ? s.extras.map((x) => x.value).join(', ') : 'Nenhum';
      const extrasTotal = s.extras.reduce((sum, x) => sum + Number(x.dataset.price), 0);
      const total = valid ? brl.format(s.nights * Number(s.cabin.dataset.rate) + extrasTotal) : '—';
      if (out.total.textContent !== total) {
        out.total.classList.add('is-updating');
        setTimeout(() => { out.total.textContent = total; out.total.classList.remove('is-updating'); }, SWAP_MS);
        out.total.dataset.value = total;
      }
      return { ...s, valid, extrasTotal };
    };

    checkin.addEventListener('change', () => {
      const a = parse(checkin.value);
      if (a) {
        const minOut = new Date(a.getTime() + MIN_NIGHTS * DAY_MS);
        checkout.min = iso(minOut);
        const b = parse(checkout.value);
        if (!b || b < minOut) checkout.value = iso(minOut);
      }
      update(true);
    });
    checkout.addEventListener('change', () => update(true));
    form.addEventListener('change', (e) => { if (e.target.name !== 'checkin' && e.target.name !== 'checkout') update(false); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const s = update(true);
      const problem = dateProblem(s, true);
      if (problem) {
        showError(problem);
        (s.a ? checkout : checkin).focus();
        return;
      }
      const lines = [
        'Olá! Montei uma estadia pelo site do Refúgio Nômade:',
        `Cabin ${s.cabin.value}`,
        `Chegada ${s.a.toLocaleDateString('pt-BR')} e saída ${s.b.toLocaleDateString('pt-BR')} (${s.nights} noites)`,
        s.extras.length ? `Preparos: ${s.extras.map((x) => x.value).join(', ')}` : 'Sem preparos extras',
        `Estimativa do site: ${out.total.dataset.value || out.total.textContent}`,
        'Podem confirmar a disponibilidade e os valores?'
      ];
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });

    // Links "Planejar na X" escolhem a cabin no formulário.
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-plan]');
      if (!link) return;
      const radio = $(`input[name="cabin"][value="${link.dataset.plan}"]`, form);
      if (radio) { radio.checked = true; update(false); }
    });

    update(false);
  }

  /* ---------- Entrada discreta ---------- */

  // Blocos que entram juntos chegam em cascata de 60 ms (no máximo 240 ms).
  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((n) => n.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      const shown = entries.filter((en) => en.isIntersecting).map((en) => en.target);
      shown.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      shown.forEach((el, i) => {
        if (!reducedMotion) el.style.setProperty('--stagger', `${Math.min(i * 60, 240)}ms`);
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((n) => io.observe(n));
  }

  /* ---------- Filete do cabeçalho e barra do celular ---------- */

  const bar = $('.mobile-bar');
  const watched = { hero: true, planner: false, closing: false };
  const syncBar = () => bar?.classList.toggle('is-visible', !watched.hero && !watched.planner && !watched.closing);
  if ('IntersectionObserver' in window) {
    [['hero', '.hero-copy'], ['planner', '#planejar'], ['closing', '.closing-inner']].forEach(([key, sel]) => {
      const el = $(sel);
      if (!el) return;
      new IntersectionObserver(([en]) => { watched[key] = en.isIntersecting; syncBar(); }).observe(el);
    });
  }
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
