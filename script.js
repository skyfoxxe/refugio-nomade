/* Refúgio Nômade · v8 — comportamento (funciona sem GSAP; o movimento fica em motion.js) */
(() => {
  'use strict';

  const WHATSAPP = '5565999999999';
  const CABINS = {
    ipe: { name: 'Ipê', rate: 890 },
    mirante: { name: 'Mirante', rate: 1090 },
    buriti: { name: 'Buriti', rate: 1240 },
    vereda: { name: 'Vereda', rate: 1480 },
  };
  const MIN_NIGHTS = 2;
  const DEPOSIT = 0.3;

  const brl = (n) => 'R$ ' + n.toLocaleString('pt-BR');
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Cabeçalho e menu ---------- */
  const header = $('.site-header');
  const toggle = $('.menu-toggle');
  const nav = $('#site-nav');

  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    $('.menu-label', toggle).textContent = open ? 'Fechar' : 'Menu';
  };

  toggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Um dia: relógio e progresso (vale para o modo nativo e o fixado) ---------- */
  const clock = $('#day-clock');
  const moments = $$('.moment');
  const dayViewport = $('#day-viewport');
  const dayFill = $('.day-progress-fill');

  const setMoment = (i) => {
    clock.textContent = moments[i].dataset.time;
    document.dispatchEvent(new CustomEvent('day:moment', { detail: { index: i } }));
  };

  const daySection = $('#dia');
  let currentMoment = 0;
  const setMomentOnce = (i) => { if (i !== currentMoment) { currentMoment = i; setMoment(i); } };

  // Modo nativo (celular, movimento reduzido, sem JS de animação): a faixa rola de lado
  dayViewport.addEventListener('scroll', () => {
    if (daySection.classList.contains('is-pinned')) return;
    const max = dayViewport.scrollWidth - dayViewport.clientWidth;
    if (max <= 0) return;
    const p = dayViewport.scrollLeft / max;
    dayFill.style.transform = `scaleX(${Math.max(p, 1 / moments.length)})`;
    setMomentOnce(Math.round(p * (moments.length - 1)));
  }, { passive: true });

  // Modo fixado: motion.js informa o progresso da rolagem
  document.addEventListener('day:progress', (e) => {
    setMomentOnce(Math.round(e.detail.progress * (moments.length - 1)));
  });

  /* ---------- Cabanas: palco fixo acompanha a cabana em foco ---------- */
  const stage = $('.cabin-stage-frame');
  const stageIndex = $('#stage-index');
  const cabins = $$('.cabin');
  const cabinObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      stage.dataset.active = e.target.dataset.cabin;
      stageIndex.textContent = String(cabins.indexOf(e.target) + 1).padStart(2, '0');
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  cabins.forEach((c) => cabinObserver.observe(c));

  /* ---------- Planejador ---------- */
  const form = $('#planner');
  const checkin = $('#checkin');
  const checkout = $('#checkout');
  const dateError = $('#date-error');
  const rateBasis = $('#rate-basis');
  const extras = $$('input[name="extra"]', form);
  const out = {
    cabin: $('#sum-cabin'),
    dates: $('#sum-dates'),
    nights: $('#sum-nights'),
    extras: $('#sum-extras'),
    total: $('#sum-total'),
    deposit: $('#sum-deposit'),
  };

  const iso = (d) => {
    const z = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  };
  const parse = (v) => (v ? new Date(v + 'T12:00:00') : null);
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmt = (d) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');

  const today = new Date();
  checkin.min = iso(today);
  checkout.min = iso(addDays(today, MIN_NIGHTS));

  const nightsBetween = () => {
    const a = parse(checkin.value);
    const b = parse(checkout.value);
    if (!a || !b) return 0;
    return Math.round((b - a) / 86400000);
  };

  const selectedCabin = () => $('input[name="cabin"]:checked', form).value;

  const syncExtras = () => {
    const cabin = selectedCabin();
    extras.forEach((x) => {
      if (!x.dataset.needs) return;
      const ok = x.dataset.needs.split(' ').includes(cabin);
      x.disabled = !ok;
      if (!ok) x.checked = false;
    });
  };

  const clearError = () => {
    dateError.textContent = '';
    checkin.removeAttribute('aria-invalid');
    checkout.removeAttribute('aria-invalid');
  };

  const showError = (msg, field) => {
    dateError.textContent = msg;
    field.setAttribute('aria-invalid', 'true');
    field.focus();
  };

  let lastTotal = 0;

  const update = () => {
    syncExtras();
    const cabinKey = selectedCabin();
    const cabin = CABINS[cabinKey];
    const nights = nightsBetween();
    const chosen = extras.filter((x) => x.checked);
    const extrasSum = chosen.reduce((s, x) => s + Number(x.dataset.price), 0);

    $$('.rate-price', form).forEach((el) => {
      const rate = Number(el.dataset.rate);
      el.textContent = nights >= MIN_NIGHTS ? brl(rate * nights) : brl(rate);
    });
    rateBasis.textContent = nights >= MIN_NIGHTS
      ? `Total para ${nights} noites.`
      : 'Valores por noite. Escolha as datas para ver o total.';

    out.cabin.textContent = cabin.name;
    const a = parse(checkin.value);
    const b = parse(checkout.value);
    out.dates.textContent = a && b ? `${fmt(a)} a ${fmt(b)}` : 'A escolher';
    out.nights.textContent = nights > 0 ? String(nights) : '—';
    out.extras.textContent = chosen.length
      ? chosen.map((x) => x.closest('.extra').querySelector('.extra-name').textContent).join(', ')
      : 'Nenhum';

    if (nights >= MIN_NIGHTS) {
      const total = cabin.rate * nights + extrasSum;
      const from = lastTotal;
      lastTotal = total;
      out.total.textContent = brl(total);
      out.total.dataset.value = String(total);
      out.deposit.textContent = `Sinal de ${brl(Math.round(total * DEPOSIT))} só depois da confirmação.`;
      document.dispatchEvent(new CustomEvent('estimate:change', { detail: { from, to: total, el: out.total } }));
    } else {
      lastTotal = 0;
      out.total.textContent = '—';
      out.total.dataset.value = '0';
      out.deposit.textContent = 'Sinal de 30% só depois da confirmação.';
    }
  };

  checkin.addEventListener('change', () => {
    clearError();
    const a = parse(checkin.value);
    if (!a) return update();
    const minOut = addDays(a, MIN_NIGHTS);
    checkout.min = iso(minOut);
    const b = parse(checkout.value);
    if (!b || b < minOut) checkout.value = iso(minOut);
    update();
  });

  checkout.addEventListener('change', () => { clearError(); update(); });
  form.addEventListener('change', (e) => {
    if (e.target !== checkin && e.target !== checkout) update();
  });

  // Links "Reservar a Ipê" etc. já deixam a cabana escolhida
  $$('[data-pick]').forEach((link) => {
    link.addEventListener('click', () => {
      const radio = $(`input[name="cabin"][value="${link.dataset.pick}"]`, form);
      radio.checked = true;
      update();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    if (!checkin.value) {
      return showError('Falta a data de chegada. Escolha o dia para calcularmos a estadia.', checkin);
    }
    if (!checkout.value) {
      return showError('Falta a data de saída. Escolha o dia para calcularmos a estadia.', checkout);
    }
    if (checkin.value < iso(new Date())) {
      return showError('A data de chegada já passou. Escolha um dia a partir de hoje.', checkin);
    }
    const nights = nightsBetween();
    if (nights < MIN_NIGHTS) {
      return showError('A estadia mínima é de duas noites. Ajuste a data de saída.', checkout);
    }

    const cabin = CABINS[selectedCabin()];
    const name = $('#guest-name').value.trim();
    const guests = $('#guests').value === '1' ? 'uma pessoa' : 'duas pessoas';
    const chosen = extras.filter((x) => x.checked)
      .map((x) => `${x.closest('.extra').querySelector('.extra-name').textContent} (${brl(Number(x.dataset.price))})`);
    const total = Number(out.total.dataset.value);

    const lines = [
      `Olá! ${name ? `Sou ${name} e g` : 'G'}ostaria de reservar no Refúgio Nômade.`,
      '',
      `Cabana: ${cabin.name}`,
      `Chegada: ${fmt(parse(checkin.value))}, às 15h`,
      `Saída: ${fmt(parse(checkout.value))}, às 12h`,
      `Noites: ${nights}`,
      `Hóspedes: ${guests}`,
      `Pedidos: ${chosen.length ? chosen.join('; ') : 'nenhum'}`,
      `Estimativa: ${brl(total)}`,
      '',
      'Vocês confirmam a disponibilidade?',
    ];
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    // Link temporário: abre o WhatsApp numa aba nova sem depender de window.open (que bloqueadores barram)
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
  });

  update();

  /* ---------- Barra móvel: some quando o hero, a reserva ou o fechamento aparecem ---------- */
  const bar = $('#mobile-bar');
  const hidden = new Set();
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? hidden.add(e.target) : hidden.delete(e.target)));
    bar.classList.toggle('is-visible', hidden.size === 0);
  });
  ['.hero', '#reservar', '.close'].forEach((s) => barObserver.observe($(s)));
})();
