# Refúgio Nômade — v6 quiet luxury

Projeto conceitual de portfólio para uma hospedagem fictícia em Chapada dos Guimarães — MT.

## Direção
Quiet luxury: o relatório anual de um banco privado, não um anúncio. Marfim `#F7F2EA` e tinta quente `#17130F`, um único acento verde-floresta `#2E4436`, Cormorant Garamond com itálico em uma palavra por título, Manrope leve no texto, filetes finos no lugar de caixas e muito espaço entre as seções. Sem gradientes, sem emoji, um só botão cheio por tela.

## Estrutura
1. Hero com coluna-índice (cabins, entorno, manhã, estadia) e imagem em letterbox
2. 01 Chegada — "Durma no meio da mata."
3. 02 Sua pausa — recomendador de cabin (duas perguntas, mensagem de WhatsApp contextual)
4. 03 Cabins — Orvalho, Horizonte, Bruma e Lua com ficha técnica em filetes
5. 04 Um dia aqui — linha do tempo com imagem que acompanha o horário
6. 05 O luxo aqui não é excesso — espaço, silêncio, tempo
7. 06 Antes de chegar — experiências em lista
8. 07 Escala — "Poucos chalés. Mais espaço entre eles."
9. 08 Perguntas — `<details>` nativo
10. Fechamento e rodapé

## O que saiu da v5
- Ciclo de cor dia→noite guiado pelo scroll, parallax do hero, luz que segue o mouse e tilt de card.
- Seção "O que você quer viver" (duplicava o recomendador; as intenções continuam na pergunta "Como você imagina esses dias?").
- Botão flutuante permanente: no celular virou uma barra discreta que aparece só depois do hero e some no fechamento.

## Técnico
- HTML, CSS e JS puros, sem dependências. Mensagens de WhatsApp centralizadas em `script.js` (`data-wa`).
- Acessibilidade: skip link, foco visível, `aria-pressed` nas opções, menu com Esc, contraste AA (texto secundário 5,1:1), `prefers-reduced-motion`.
- Imagens com moldura de proporção fixa; se uma imagem externa falhar, a moldura mostra o nome da marca em vez de quebrar o layout.

O projeto é fictício. WhatsApp, disponibilidade e operação comercial são apenas demonstrações de portfólio.
