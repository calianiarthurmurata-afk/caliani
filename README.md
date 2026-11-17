# Lorena Lua Piercings — site portfólio

Site institucional e portfólio do estúdio **Lorena Lua Piercings**, com um **estúdio 3D interativo** em duas áreas:

- **Rosto & Orelhas** — cabeça 3D realista (escaneada, com textura de pele). O cliente gira o boneco (arrastando, pelas setas na tela ou pelo teclado), toca nos pontos dourados (lóbulo, hélix, tragus, daith, narina, septo, lábios, sobrancelha…) e vê os piercings de cada região com a joia aplicada no modelo.
- **Área Íntima (+18)** — protegida por confirmação de idade, com manequim de costura (sem anatomia explícita) nas versões feminina e masculina: mamilos, íntimo feminino e íntimo masculino.

Cada piercing mostra descrição, cicatrização, nível de desconforto, joia indicada e preço de referência. Os escolhidos formam um "Meu projeto" que é enviado pronto pelo WhatsApp.

Site 100% estático (HTML + CSS + JS, three.js incluído em `vendor/`). Não precisa de build.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

(Abrir o `index.html` direto pelo arquivo não funciona por causa dos módulos JS — use um servidor.)

## O que editar

| O quê | Onde |
|---|---|
| WhatsApp, Instagram, endereço, horários | `js/data.js` → `CONFIG` |
| Piercings de cada região, preços, cicatrização, joias | `js/data.js` → `ZONES` (abas em `REGIONS`) |
| Metais do seletor | `js/data.js` → `METALS` |
| Fotos do portfólio | `js/data.js` → `GALLERY` (preencha `img` com o caminho da foto, ex.: `assets/portfolio/helix-01.jpg`) |
| Textos (sobre, FAQ, cuidados) | `index.html` |
| Cores e tipografia | `css/style.css` (variáveis em `:root`) |

## Publicar no GitHub Pages

Settings → Pages → *Deploy from a branch* → escolha a branch e a pasta `/ (root)`.

## Estrutura

```
index.html          página
css/style.css       estilos
js/main.js          interface (estúdio, projeto, portfólio, formulário)
js/studio3d.js      cena 3D: cabeça realista, manequim, pontos e joias
js/data.js          conteúdo editável
vendor/three/       three.js r160 (licença MIT)
assets/models/head  modelo 3D da cabeça + texturas
assets/             favicon e imagens
```

## Créditos

Modelo 3D da cabeça: “Lee Perry-Smith” por [Infinite-Realities](https://www.ir-ltd.net), licença [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) (crédito mantido no rodapé do site, como exige a licença).
