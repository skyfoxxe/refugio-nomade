/* Refúgio Nômade · v8 — camada de movimento (taste-motion + taste-gsap)
   Contrato: a página é completa sem este arquivo. Tudo o que anima vive em
   gsap.matchMedia('(prefers-reduced-motion: no-preference)'); efeitos pesados
   (pin, scrub, parallax) só a partir de 768px. Só transform e opacity. */
(() => {
  'use strict';

  const root = document.documentElement;
  const endIntro = () => root.classList.remove('is-intro');

  if (!window.gsap || !window.ScrollTrigger) { endIntro(); return; }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const EASE_OUT = 'power3.out';
  const EASE_HERO = 'expo.out';
  const EASE_INOUT = 'power2.inOut';
  const headerH = () => document.querySelector('.site-header').offsetHeight;

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 768px) and (min-height: 640px)',
    }, (context) => {
      const { motion, desktop } = context.conditions;
      if (!motion) { endIntro(); return undefined; }

      /* ---- Rolagem suave (Lenis), ligada ao ScrollTrigger ---- */
      let lenis = null;
      let tick = null;
      if (window.Lenis) {
        lenis = new window.Lenis({ duration: 1.1, anchors: { offset: -headerH() } });
        lenis.on('scroll', ScrollTrigger.update);
        tick = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      /* ---- Hero: uma sequência só, menos de 1,4 s ---- */
      const hero = gsap.timeline({ defaults: { ease: EASE_HERO }, onStart: endIntro });
      hero
        .fromTo('.hero-figure .veil', { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: 'expo.inOut' }, 0)
        .fromTo('.hero-figure img', { scale: 1.12 }, { scale: 1, duration: 1.4 }, 0)
        .fromTo('.hero-copy .label', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, 0.1)
        .fromTo('.hero .line-inner', { opacity: 1, yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.1 }, 0.15)
        .fromTo('.hero-copy .lede, .hero-actions', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.55);

      /* ---- Números da prova: contam uma vez ---- */
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count);
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 1.4,
          ease: EASE_OUT,
          snap: { v: 1 },
          onUpdate: () => { el.textContent = proxy.v.toLocaleString('pt-BR'); },
          scrollTrigger: { trigger: '.proof', start: 'top 88%', once: true },
        });
      });
      gsap.from('.proof-item', {
        opacity: 0, y: 14, duration: 0.8, ease: EASE_OUT, stagger: 0.08,
        scrollTrigger: { trigger: '.proof', start: 'top 88%', once: true },
      });

      /* ---- Revelação por cena: título → texto → ação (2–3 tempos) ---- */
      gsap.utils.toArray('.scene, .close').forEach((scene) => {
        const items = scene.querySelectorAll('[data-reveal]');
        if (!items.length) return;
        gsap.from(items, {
          opacity: 0,
          y: 14,
          duration: 0.9,
          ease: EASE_OUT,
          stagger: 0.09,
          scrollTrigger: { trigger: scene, start: 'top 78%', once: true },
        });
      });

      /* ---- Fios que se desenham ---- */
      gsap.from('[data-draw-v]', {
        scaleY: 0, duration: 1.2, ease: EASE_INOUT,
        scrollTrigger: { trigger: '.pause', start: 'top 70%', once: true },
      });

      /* ---- Fotos que se revelam (véu + leve recuo de escala) ---- */
      gsap.utils.toArray('.cabin-figure, .moment-figure').forEach((fig) => {
        const img = fig.querySelector('img');
        gsap.fromTo(img, { scale: 1.08 }, {
          scale: 1, duration: 1.6, ease: EASE_OUT,
          scrollTrigger: { trigger: fig, start: 'top 85%', once: true },
        });
      });

      /* ---- Relógio do dia: troca de hora com um respiro ---- */
      const clock = document.querySelector('#day-clock');
      const onMoment = () => {
        gsap.fromTo(clock, { opacity: 0.25, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: EASE_OUT, overwrite: true });
      };
      document.addEventListener('day:moment', onMoment);

      /* ---- Relógio do cabeçalho: a hora troca com um respiro ---- */
      const phaseClock = document.querySelector('.phase-clock');
      const onPhase = () => {
        gsap.fromTo(phaseClock, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE_OUT, overwrite: true });
      };
      document.addEventListener('phase:change', onPhase);

      /* ---- Estimativa: o total conta até o novo valor ---- */
      const onEstimate = (e) => {
        const { from, to, el } = e.detail;
        if (!from || from === to) return;
        const proxy = { v: from };
        gsap.to(proxy, {
          v: to,
          duration: 0.5,
          ease: EASE_OUT,
          overwrite: true,
          onUpdate: () => { el.textContent = 'R$ ' + Math.round(proxy.v).toLocaleString('pt-BR'); },
          onComplete: () => { el.textContent = 'R$ ' + to.toLocaleString('pt-BR'); },
        });
      };
      document.addEventListener('estimate:change', onEstimate);

      /* ---- Barra de progresso no cabeçalho ---- */
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
      });

      /* ---- Só desktop: o dia fixado na tela, a foto final em parallax ---- */
      if (desktop) {
        const day = document.querySelector('#dia');
        const pin = day.querySelector('.day-pin');
        const track = day.querySelector('#day-track');
        const viewport = day.querySelector('#day-viewport');
        const fill = day.querySelector('.day-progress-fill');
        const distance = () => track.scrollWidth - viewport.clientWidth;

        day.classList.add('is-pinned');
        viewport.scrollLeft = 0;

        const dayTween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: () => `top ${headerH()}`,
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(fill, { scaleX: Math.max(self.progress, 1 / 6) });
              document.dispatchEvent(new CustomEvent('day:progress', { detail: { progress: self.progress } }));
            },
          },
        });

        // Dentro da faixa, cada foto desliza um pouco menos que a moldura
        gsap.utils.toArray('.moment-figure img').forEach((img) => {
          gsap.fromTo(img, { xPercent: 6 }, {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.moment'),
              containerAnimation: dayTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          });
        });

        gsap.fromTo('.close-figure img', { yPercent: -6, scale: 1.12 }, {
          yPercent: 6,
          scale: 1.12,
          ease: 'none',
          scrollTrigger: { trigger: '.close-stage', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
      }

      // Fontes e fotos mudam a altura das seções: recalcula depois que chegam
      const refresh = () => ScrollTrigger.refresh();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
      window.addEventListener('load', refresh, { once: true });

      return () => {
        document.removeEventListener('day:moment', onMoment);
        document.removeEventListener('estimate:change', onEstimate);
        document.removeEventListener('phase:change', onPhase);
        document.querySelector('#dia').classList.remove('is-pinned');
        if (lenis) {
          gsap.ticker.remove(tick);
          lenis.destroy();
        }
      };
    });
  });

  window.addEventListener('pagehide', () => ctx.revert(), { once: true });
})();
