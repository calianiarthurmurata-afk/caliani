# Lorena Lua Piercings — site portfólio

Site da **Lorena Lua Piercings**: claro, direto e pensado para o celular.

- **Topo** com os preços mais procurados e botão de WhatsApp.
- **Escolha seu piercing**: boneco 3D simples (sem reflexos, leve para celulares). O cliente gira o boneco, toca num ponto e vê a lista com preço "a partir de" e o botão **Quero**, que abre o WhatsApp com a mensagem pronta.
- **Íntimo (+18)**: aba protegida por confirmação de idade, apenas com a lista escrita e os preços.
- Trabalhos (fotos), cuidados depois de furar, dúvidas e onde estamos.

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
| WhatsApp, Instagram, endereço, horário | `js/data.js` → `CONFIG` |
| Piercings de cada região, preços, cicatrização, joias | `js/data.js` → `ZONES` (abas em `REGIONS`) |
| Cartão "Mais procurados" | `js/data.js` → `POPULAR` |
| Fotos dos trabalhos | `js/data.js` → `GALLERY` (preencha `img` com o caminho da foto, ex.: `assets/trabalhos/foto-01.jpg`) |
| Textos (cuidados, dúvidas) | `index.html` |
| Cores e tipografia | `css/style.css` (variáveis em `:root`) |

## Publicação

O site está no Vercel (projeto `caliani`, ligado a este repositório): cada envio para a branch de produção atualiza o site.

## Estrutura

```
index.html          página
css/style.css       estilos
js/main.js          interface (abas, lista de preços, boneco, galeria)
js/studio3d.js      boneco 3D simples, pontos e joias
js/data.js          conteúdo editável
vendor/three/       three.js r160 (licença MIT)
assets/models/head  modelo 3D da cabeça
assets/             favicon e imagens
```

## Créditos

Boneco 3D baseado no modelo “Lee Perry-Smith” por [Infinite-Realities](https://www.ir-ltd.net), licença [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) (crédito mantido no rodapé do site, como exige a licença).
