# Refúgio Nômade · v8

Projeto conceitual de portfólio para uma hospedagem fictícia em Chapada dos Guimarães, MT. Nível **Estratégico**.

## Leitura de design
Hospedagem de natureza para casais, quiet luxury com movimento cinematográfico contido. Marfim `#F7F2EA`, tinta quente `#17130F` e um único acento, vermelho-terra `#742D2C` (a pedra da Chapada). EB Garamond nos títulos, com uma palavra em itálico; Manrope no texto. Filetes no lugar de cartões, um botão cheio por tela.

## O dia passando
Conforme a rolagem, o fundo escurece seção a seção, como um dia: amanhecer (hero), manhã, meio do dia, tarde, hora dourada, crepúsculo (reserva) e noite (perguntas e fechamento). Os títulos e os rótulos de cada seção acompanham a hora, e um relógio no cabeçalho mostra em que hora a página está. As cores são tokens registrados com `@property` e trocam em 1,4 s; com movimento reduzido, a troca é imediata. Cada fase foi conferida: texto ≥ 11:1, texto secundário ≥ 4,7:1, acento ≥ 6:1.

## Skills usadas (pacote design-taste)
design-taste, quiet-luxury, taste-landing-page, taste-ux-copy, taste-typography, taste-color, taste-design-system, taste-brand-identity, taste-motion, taste-gsap, cinematic-motion (só como tempero de movimento), taste-web-performance, taste-code-craft. Revisão: taste-design-review, taste-accessibility, taste-code-review e review-animations.

## Estrutura (ordem de venda)
1. Hero: o que é, para quem e um CTA ("Reservar minha estadia")
2. Prova em números (4 cabanas, 8 hóspedes, 300 m, 60 min), com contagem
3. 01 · A pausa: a dor, em três linhas
4. 02 · Um dia: seis momentos de 06:40 a 22:05; no desktop a seção fica fixa e a faixa corre de lado com a rolagem, o relógio acompanha
5. 03 · As cabanas: Ipê, Mirante, Buriti e Vereda; no desktop a foto fica parada à esquerda e troca conforme a cabana lida
6. 04 · Na diária: incluído e pedidos à parte, com preço
7. 05 · Reserva: datas → cabana (tabela com total para as noites, Buriti em destaque) → pedidos → resumo com estimativa e sinal de 30% → mensagem pronta no WhatsApp
8. 06 · Perguntas: `<details>` nativo
9. Fechamento com a mesma chamada do hero

## Movimento
`motion.js` usa GSAP 3.13 + ScrollTrigger e Lenis 1.3.4, servidos de `vendor/`. Tudo vive em `gsap.context` + `gsap.matchMedia`: nada anima com `prefers-reduced-motion: reduce`, e o pin, o scrub e o parallax só existem a partir de 768 px de largura e 640 px de altura. Sem o JS de animação a página fica completa (a faixa do dia vira rolagem lateral nativa com snap).

## Marca
`favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` e `og-image.png` (1200×630). Ideia da marca em duas palavras: abrigo + horizonte.

## Desempenho
Orçamento: LCP < 2,5 s, CLS < 0,1, peso próprio < 500 KB. Medido no Chromium com CPU 4× mais lenta e rede 3G: FCP 0,74 s, LCP 1,3 s, CLS 0. JS próprio + bibliotecas ≈ 55 KB com gzip.

## Fotografias
Unsplash (licença gratuita), carregadas de `images.unsplash.com` com `srcset`.

O projeto é fictício. Valores, WhatsApp, disponibilidade e operação são apenas demonstração de portfólio.
