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
