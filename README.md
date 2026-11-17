# Lorena Lua Piercings — site portfólio

Site institucional e portfólio do estúdio **Lorena Lua Piercings**, com um **estúdio 3D interativo**: o cliente gira um busto 3D, toca nos pontos da cabeça/rosto (lóbulo, hélix, tragus, daith, narina, septo, lábios, sobrancelha…) e vê os piercings disponíveis em cada região — com a joia aplicada no boneco, troca de metal, tempo de cicatrização, nível de desconforto e preço de referência. Os piercings escolhidos formam um "Meu projeto" que é enviado pronto pelo WhatsApp.

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
| Piercings de cada região, preços, cicatrização, joias | `js/data.js` → `ZONES` |
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
js/head3d.js        busto 3D procedural, pontos clicáveis e joias
js/data.js          conteúdo editável
vendor/three/       three.js r160 (licença MIT)
assets/             favicon e imagens
```
