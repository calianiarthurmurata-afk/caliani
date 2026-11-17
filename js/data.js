/* =========================================================================
   Lorena Lua Piercings — dados do site
   -------------------------------------------------------------------------
   Tudo o que a loja precisa editar fica neste arquivo:
   - CONFIG: contato, endereço, redes sociais
   - REGIONS / ZONES: regiões do boneco 3D (rosto e área íntima), pontos
            clicáveis e os piercings de cada uma (preço, cicatrização, joia...)
   - METALS: materiais exibidos no seletor de joias
   - GALLERY: trabalhos do portfólio (troque por fotos reais em /assets)
   ========================================================================= */

export const CONFIG = {
  brand: 'Lorena Lua Piercings',
  whatsapp: '5500000000000',            // DDI + DDD + número, só dígitos
  whatsappLabel: '(00) 00000-0000',
  instagram: 'lorenaluapiercings',      // sem o @
  address: 'Rua Exemplo, 123 — Centro',
  city: 'Sua cidade — UF',
  hours: [
    ['Terça a sexta', '10h às 19h'],
    ['Sábado', '10h às 16h'],
    ['Domingo e segunda', 'Fechado'],
  ],
  email: 'contato@lorenaluapiercings.com.br',
};

export const METALS = [
  { id: 'titanio', name: 'Titânio F136', short: 'Titânio', color: 0xb9bcc2, rough: 0.22, hex: '#b9bcc2' },
  { id: 'ouro', name: 'Ouro 18k', short: 'Ouro', color: 0xe3b25a, rough: 0.16, hex: '#e3b25a' },
  { id: 'rose', name: 'Ouro Rosé 18k', short: 'Rosé', color: 0xe2a08a, rough: 0.16, hex: '#e2a08a' },
  { id: 'preto', name: 'Titânio Black', short: 'Black', color: 0x2b2b30, rough: 0.28, hex: '#2b2b30' },
];

/* -------------------------------------------------------------------------
   Estúdio 3D
   - REGIONS: abas do painel. mode 'face' = cabeça realista;
              mode 'intimo' = manequim da área íntima (+18).
   - ZONES:   pontos clicáveis do boneco e os piercings de cada um.
       anchor / render[].f: [x, y]  -> ponto projetado de FRENTE no modelo
       anchor / render[].s: [y, z]  -> ponto projetado pela LATERAL (orelha)
       render[].type: 'stud' | 'ring' | 'bar' | 'horseshoe'
       render[].size: escala da joia   render[].rot: rotação extra [x,y,z]°
       view: câmera ao focar a zona (pos / target, no espaço do modelo)
   ------------------------------------------------------------------------- */
export const REGIONS = [
  { id: 'orelha', mode: 'face', name: 'Orelha', icon: 'ear' },
  { id: 'nariz', mode: 'face', name: 'Nariz', icon: 'nose' },
  { id: 'boca', mode: 'face', name: 'Boca & Lábios', icon: 'lips' },
  { id: 'rosto', mode: 'face', name: 'Sobrancelha & Rosto', icon: 'brow' },
  { id: 'mamilos', mode: 'intimo', name: 'Mamilos', icon: 'chest' },
  { id: 'feminino', mode: 'intimo', gender: 'fem', name: 'Íntimo Feminino', icon: 'fem' },
  { id: 'masculino', mode: 'intimo', gender: 'masc', name: 'Íntimo Masculino', icon: 'masc' },
];

const V_EAR = { pos: [8.2, 1.7, 1.2], target: [1.55, 1.3, 0.25] };
const V_MOUTH = { pos: [1.6, 0.1, 7.6], target: [-0.08, 0.45, 2.0] };
const V_CHEST = { pos: [1.3, 1.0, 3.9], target: [0.1, 0.72, 0.3] };
const V_INT = { pos: [1.0, -0.55, 3.6], target: [0, -0.8, 0.25] };

export const ZONES = [
  /* ------------------------------ ORELHA ------------------------------ */
  {
    id: 'lobulo', region: 'orelha', name: 'Lóbulo',
    anchor: { s: [0.84, 0.42] },
    view: { pos: [8.0, 1.3, 1.6], target: [1.55, 1.1, 0.3] },
    blurb: 'A parte macia da orelha. O ponto de partida ideal — cicatrização rápida e infinitas combinações.',
    piercings: [
      { id: 'lobulo-1', name: 'Lóbulo', pain: 1, healing: '6 a 8 semanas', price: 80,
        jewelry: 'Labret de rosca interna ou argola 8mm',
        desc: 'O clássico. Perfeito para o primeiro piercing ou para começar uma curadoria de orelha.',
        render: [{ type: 'stud', s: [0.84, 0.42], size: 1 }] },
      { id: 'lobulo-2', name: 'Lóbulo Duplo', pain: 1, healing: '6 a 8 semanas', price: 140,
        jewelry: 'Dois labrets com pontos de luz em tamanhos escalonados',
        desc: 'Dois furos alinhados no lóbulo, criando uma composição delicada e equilibrada.',
        render: [{ type: 'stud', s: [0.84, 0.42], size: 1 }, { type: 'stud', s: [0.93, 0.35], size: 0.8 }] },
      { id: 'lobulo-3', name: 'Lóbulo Triplo', pain: 1, healing: '6 a 8 semanas', price: 190,
        jewelry: 'Três labrets ou combinação com argola',
        desc: 'Composição em escada no lóbulo, ótima base para quem gosta de orelha cheia.',
        render: [{ type: 'ring', s: [0.83, 0.43], size: 0.9 }, { type: 'stud', s: [0.92, 0.36], size: 0.8 }, { type: 'stud', s: [1.0, 0.3], size: 0.65 }] },
      { id: 'lobulo-transversal', name: 'Lóbulo Transversal', pain: 2, healing: '3 a 6 meses', price: 150,
        jewelry: 'Barbell reto em titânio',
        desc: 'Atravessa o lóbulo horizontalmente, mostrando as duas pontas da joia. Moderno e discreto.',
        render: [{ type: 'bar', s: [0.84, 0.42], size: 0.75 }] },
    ],
  },
  {
    id: 'helix', region: 'orelha', name: 'Hélix',
    anchor: { s: [1.8, -0.06] },
    view: { pos: [7.4, 3.6, -1.6], target: [1.5, 1.55, 0.1] },
    blurb: 'A borda de cartilagem na parte superior da orelha. Versátil e elegante com argolas ou pontos de luz.',
    piercings: [
      { id: 'helix-1', name: 'Hélix', pain: 2, healing: '6 a 12 meses', price: 120,
        jewelry: 'Labret com ponto de luz (downsize após inchaço)',
        desc: 'Um dos piercings de cartilagem mais pedidos. Combina com tudo.',
        render: [{ type: 'stud', s: [1.8, -0.06], size: 0.85 }] },
      { id: 'helix-2', name: 'Hélix Duplo', pain: 2, healing: '6 a 12 meses', price: 210,
        jewelry: 'Dois labrets alinhados na borda',
        desc: 'Dois furos seguindo a curva da borda — efeito de constelação.',
        render: [{ type: 'stud', s: [1.8, -0.06], size: 0.8 }, { type: 'stud', s: [1.64, -0.16], size: 0.8 }] },
      { id: 'industrial', name: 'Industrial', pain: 3, healing: '9 a 12 meses', price: 190,
        jewelry: 'Barbell longo em titânio unindo dois furos',
        desc: 'Dois furos na cartilagem superior conectados por uma única barra. Marcante e gráfico.',
        render: [{ type: 'bar', s: [1.8, 0.17], size: 2.0, rot: [0, 0, -6], lift: 0.03 }] },
    ],
  },
  {
    id: 'forward', region: 'orelha', name: 'Forward Hélix',
    anchor: { s: [1.68, 0.47] },
    view: { pos: [6.3, 2.4, 4.8], target: [1.4, 1.55, 0.45] },
    blurb: 'A cartilagem na frente da orelha, junto ao rosto. Delicado e cheio de personalidade.',
    piercings: [
      { id: 'forward-1', name: 'Forward Hélix', pain: 2, healing: '6 a 12 meses', price: 120,
        jewelry: 'Labret com ponto de luz pequeno (2–3mm)',
        desc: 'Fica rente à linha do rosto e aparece lindamente em fotos de perfil.',
        render: [{ type: 'stud', s: [1.68, 0.47], size: 0.7 }] },
      { id: 'forward-2', name: 'Forward Duplo', pain: 2, healing: '6 a 12 meses', price: 210,
        jewelry: 'Dois labrets verticais em escala',
        desc: 'Dois pontos empilhados — um dos detalhes mais pedidos em curadoria de orelha.',
        render: [{ type: 'stud', s: [1.71, 0.46], size: 0.65 }, { type: 'stud', s: [1.6, 0.5], size: 0.55 }] },
    ],
  },
  {
    id: 'tragus', region: 'orelha', name: 'Tragus',
    anchor: { s: [1.25, 0.5] },
    view: { pos: [6.6, 1.5, 4.2], target: [1.4, 1.2, 0.5] },
    blurb: 'A pequena aba de cartilagem que cobre a entrada do ouvido.',
    piercings: [
      { id: 'tragus-1', name: 'Tragus', pain: 2, healing: '6 a 12 meses', price: 130,
        jewelry: 'Labret de rosca interna com ponto de luz',
        desc: 'Pequeno, sofisticado e muito fotogênico — um destaque discreto.',
        render: [{ type: 'stud', s: [1.25, 0.5], size: 0.75 }] },
      { id: 'antitragus', name: 'Anti-tragus', pain: 3, healing: '9 a 12 meses', price: 140,
        jewelry: 'Argola fina ou labret curto',
        desc: 'A cartilagem oposta ao tragus, logo acima do lóbulo. Para quem quer algo diferente.',
        render: [{ type: 'ring', s: [1.05, 0.36], size: 0.6, rot: [0, 0, 30] }] },
    ],
  },
  {
    id: 'concha', region: 'orelha', name: 'Concha',
    anchor: { s: [1.3, 0.22] },
    view: V_EAR,
    blurb: 'A área central em formato de concha. Permite ponto de luz interno ou argola envolvendo a borda.',
    piercings: [
      { id: 'concha-int', name: 'Concha Interna', pain: 3, healing: '9 a 12 meses', price: 140,
        jewelry: 'Labret com cravejado ou ponto de luz',
        desc: 'Joia no centro da orelha, como um brinco que parece flutuar.',
        render: [{ type: 'stud', s: [1.28, 0.24], size: 1 }] },
      { id: 'concha-ext', name: 'Concha Externa (Orbital)', pain: 3, healing: '9 a 12 meses', price: 150,
        jewelry: 'Argola de segmento envolvendo a borda',
        desc: 'Furo na concha com argola abraçando a borda — impacto máximo.',
        render: [{ type: 'ring', s: [1.4, 0.04], size: 1.2, rot: [0, 0, -35] }] },
    ],
  },
  {
    id: 'antihelix', region: 'orelha', name: 'Daith & Rook',
    anchor: { s: [1.5, 0.36] },
    view: V_EAR,
    blurb: 'As dobras internas da cartilagem: daith, rook e snug. Os favoritos de quem já tem experiência.',
    piercings: [
      { id: 'daith', name: 'Daith', pain: 3, healing: '9 a 12 meses', price: 160,
        jewelry: 'Clicker ou argola cravejada',
        desc: 'Passa pela dobra mais interna da cartilagem, junto ao canal auditivo.',
        render: [{ type: 'ring', s: [1.45, 0.4], size: 0.85, rot: [0, 0, 20] }] },
      { id: 'rook', name: 'Rook', pain: 3, healing: '9 a 12 meses', price: 160,
        jewelry: 'Barbell curvo ou ferradura',
        desc: 'Vertical na dobra superior da anti-hélix. Charmoso e pouco comum.',
        render: [{ type: 'horseshoe', s: [1.62, 0.32], size: 0.7, rot: [0, 0, 90] }] },
      { id: 'snug', name: 'Snug', pain: 4, healing: '9 a 12 meses', price: 170,
        jewelry: 'Barbell curvo curto',
        desc: 'Na anti-hélix, a crista interna paralela à borda. Exige anatomia adequada — avaliamos antes.',
        render: [{ type: 'horseshoe', s: [1.2, 0.1], size: 0.6, rot: [0, 0, 60] }] },
    ],
  },

  /* ------------------------------- NARIZ ------------------------------ */
  {
    id: 'narina', region: 'nariz', name: 'Narina',
    anchor: { f: [0.15, 1.0] },
    view: { pos: [2.8, 0.9, 7.6], target: [0.0, 1.05, 2.2] },
    blurb: 'Um dos piercings faciais mais elegantes. Do ponto de luz minimalista à argola.',
    piercings: [
      { id: 'nostril', name: 'Nostril — Ponto de Luz', pain: 2, healing: '4 a 6 meses', price: 100,
        jewelry: 'Labret com ponto de luz 2–3mm',
        desc: 'Minimalista e luminoso. Escolhemos a posição ideal de acordo com a anatomia do seu nariz.',
        render: [{ type: 'stud', f: [0.15, 1.0], size: 0.7 }] },
      { id: 'nostril-argola', name: 'Nostril — Argola', pain: 2, healing: '4 a 6 meses', price: 110,
        jewelry: 'Argola de segmento 8mm (troca após cicatrização)',
        desc: 'Argola abraçando a narina. Iniciamos com labret e trocamos quando a cicatrização permitir.',
        render: [{ type: 'ring', f: [0.17, 0.98], size: 0.7 }] },
      { id: 'high-nostril', name: 'High Nostril', pain: 3, healing: '6 a 9 meses', price: 130,
        jewelry: 'Labret com ponto de luz pequeno',
        desc: 'Posicionado mais acima, na curva do nariz. Moderno e sofisticado.',
        render: [{ type: 'stud', f: [0.11, 1.12], size: 0.6 }] },
      { id: 'nostril-duplo', name: 'Nostril Duplo', pain: 2, healing: '4 a 6 meses', price: 180,
        jewelry: 'Dois labrets ou labret + argola',
        desc: 'Dois furos na mesma narina, compondo um conjunto delicado.',
        render: [{ type: 'stud', f: [0.15, 1.0], size: 0.65 }, { type: 'stud', f: [0.11, 1.12], size: 0.55 }] },
    ],
  },
  {
    id: 'septo', region: 'nariz', name: 'Septo',
    anchor: { f: [-0.11, 0.99] },
    view: { pos: [0.9, -1.4, 7.4], target: [-0.1, 0.95, 2.2] },
    blurb: 'Passa pelo "sweet spot" entre a cartilagem e a ponta do nariz. Pode ser escondido com a joia certa.',
    piercings: [
      { id: 'septo-1', name: 'Septo', pain: 2, healing: '2 a 3 meses', price: 140,
        jewelry: 'Ferradura ou clicker cravejado',
        desc: 'Elegante e versátil: com ferradura, pode ser virado para cima e ficar oculto quando preciso.',
        render: [{ type: 'horseshoe', f: [-0.11, 0.99], size: 0.8, rot: [0, 90, 0] }] },
    ],
  },
  {
    id: 'bridge', region: 'nariz', name: 'Bridge',
    anchor: { f: [-0.1, 1.72] },
    view: { pos: [1.4, 1.9, 8.4], target: [-0.1, 1.55, 2.0] },
    blurb: 'Superficial, entre os olhos, no topo do nariz.',
    piercings: [
      { id: 'bridge-1', name: 'Bridge', pain: 2, healing: '2 a 3 meses', price: 150,
        jewelry: 'Barbell reto ou curvo em titânio',
        desc: 'Piercing de superfície horizontal. Avaliamos a anatomia para garantir boa fixação.',
        render: [{ type: 'bar', f: [-0.1, 1.72], size: 0.8 }] },
    ],
  },

  /* -------------------------------- BOCA ------------------------------ */
  {
    id: 'labio-sup', region: 'boca', name: 'Lábio Superior',
    anchor: { f: [-0.08, 0.69] },
    view: V_MOUTH,
    blurb: 'Acima do lábio superior: medusa, monroe e madonna.',
    piercings: [
      { id: 'medusa', name: 'Medusa', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Labret com disco interno e ponto de luz',
        desc: 'Centralizado no arco do cupido. Destaca e alonga o desenho dos lábios.',
        render: [{ type: 'stud', f: [-0.08, 0.68], size: 0.65 }] },
      { id: 'monroe', name: 'Monroe', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Labret com ponto de luz',
        desc: 'Inspirado na pinta clássica, acima do lábio do lado esquerdo.',
        render: [{ type: 'stud', f: [0.2, 0.7], size: 0.65 }] },
      { id: 'madonna', name: 'Madonna', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Labret com ponto de luz',
        desc: 'Como o Monroe, porém do lado direito.',
        render: [{ type: 'stud', f: [-0.36, 0.7], size: 0.65 }] },
    ],
  },
  {
    id: 'labio-inf', region: 'boca', name: 'Lábio Inferior',
    anchor: { f: [-0.08, 0.24] },
    view: V_MOUTH,
    blurb: 'Labret e combinações: snake bites, spider bites e vertical.',
    piercings: [
      { id: 'labret', name: 'Labret', pain: 2, healing: '3 a 6 meses', price: 120,
        jewelry: 'Labret com disco interno',
        desc: 'Centralizado abaixo do lábio inferior. Clássico e atemporal.',
        render: [{ type: 'stud', f: [-0.08, 0.24], size: 0.7 }] },
      { id: 'labret-vertical', name: 'Labret Vertical', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Barbell curvo',
        desc: 'Atravessa o lábio de cima para baixo, aparecendo as duas pontas.',
        render: [{ type: 'bar', f: [-0.08, 0.36], size: 0.55, rot: [0, 0, 90] }] },
      { id: 'snake', name: 'Snake Bites', pain: 3, healing: '3 a 6 meses', price: 220,
        jewelry: 'Duas argolas ou dois labrets',
        desc: 'Par simétrico nos cantos do lábio inferior.',
        render: [{ type: 'ring', f: [0.12, 0.31], size: 0.6 }, { type: 'ring', f: [-0.28, 0.31], size: 0.6 }] },
      { id: 'spider', name: 'Spider Bites', pain: 3, healing: '3 a 6 meses', price: 220,
        jewelry: 'Dois labrets ou duas argolas lado a lado',
        desc: 'Dois furos próximos de um mesmo lado do lábio.',
        render: [{ type: 'ring', f: [0.07, 0.31], size: 0.5 }, { type: 'ring', f: [0.17, 0.32], size: 0.5 }] },
    ],
  },
  {
    id: 'boca-int', region: 'boca', name: 'Língua & Frênulo',
    anchor: { f: [-0.08, 0.44] },
    view: V_MOUTH,
    blurb: 'Piercings internos: língua, smiley e frowny. Discretos, só aparecem quando você quer.',
    piercings: [
      { id: 'lingua', name: 'Língua', pain: 2, healing: '4 a 6 semanas', price: 130,
        jewelry: 'Barbell reto longo (downsize após o inchaço)',
        desc: 'Centralizado na língua. Inchaço inicial é normal — orientamos todo o processo.',
        render: [{ type: 'stud', f: [-0.08, 0.44], size: 0.8 }] },
      { id: 'smiley', name: 'Smiley', pain: 1, healing: '4 a 12 semanas', price: 110,
        jewelry: 'Argola fina ou ferradura',
        desc: 'No frênulo do lábio superior — aparece só quando você sorri.',
        render: [{ type: 'horseshoe', f: [-0.08, 0.47], size: 0.45, rot: [0, 90, 0] }] },
      { id: 'frowny', name: 'Frowny', pain: 1, healing: '4 a 12 semanas', price: 110,
        jewelry: 'Ferradura fina',
        desc: 'No frênulo do lábio inferior. Um segredo bem guardado.',
        render: [{ type: 'horseshoe', f: [-0.08, 0.41], size: 0.45, rot: [0, 90, 0] }] },
    ],
  },

  /* --------------------------- SOBRANCELHA / ROSTO -------------------- */
  {
    id: 'sobrancelha', region: 'rosto', name: 'Sobrancelha',
    anchor: { f: [0.85, 1.97] },
    view: { pos: [4.0, 2.4, 7.4], target: [0.6, 1.75, 1.6] },
    blurb: 'Na extremidade externa da sobrancelha, acompanhando o arco natural.',
    piercings: [
      { id: 'sobrancelha-1', name: 'Sobrancelha', pain: 2, healing: '2 a 3 meses', price: 120,
        jewelry: 'Barbell curvo com esferas',
        desc: 'Vertical ou levemente inclinado no fim da sobrancelha. Atitude na medida.',
        render: [{ type: 'bar', f: [0.85, 1.97], size: 0.6, rot: [0, 0, 75] }] },
      { id: 'anti-sobrancelha', name: 'Anti-sobrancelha', pain: 3, healing: '3 a 6 meses', price: 150,
        jewelry: 'Barbell de superfície',
        desc: 'Na parte superior da maçã do rosto, abaixo do canto externo do olho.',
        render: [{ type: 'bar', f: [0.85, 1.45], size: 0.5, rot: [0, 0, 35] }] },
    ],
  },
  {
    id: 'bochecha', region: 'rosto', name: 'Bochecha',
    anchor: { f: [0.45, 0.5] },
    view: { pos: [3.4, 0.7, 7.6], target: [0.1, 0.55, 1.6] },
    blurb: 'Dimple: o "furinho" da bochecha, onde se formam as covinhas.',
    piercings: [
      { id: 'dimple', name: 'Dimple (Covinha)', pain: 3, healing: '6 a 12 meses', price: 260,
        jewelry: 'Labret com ponto de luz (par)',
        desc: 'Simula covinhas com pontos de luz. Realizado aos pares e com avaliação prévia.',
        render: [{ type: 'stud', f: [0.45, 0.5], size: 0.7 }, { type: 'stud', f: [-0.61, 0.5], size: 0.7 }] },
    ],
  },

  /* ============================ ÁREA ÍNTIMA (+18) ===================== */
  {
    id: 'mamilo', region: 'mamilos', name: 'Mamilos',
    anchor: { f: [0.3, 0.72] },
    view: V_CHEST,
    blurb: 'Perfurações horizontais, verticais ou cruzadas. Realizadas em qualquer gênero, com joia sob medida para a sua anatomia.',
    piercings: [
      { id: 'mamilo-h', name: 'Mamilo Horizontal', pain: 3, healing: '6 a 12 meses', price: 160,
        jewelry: 'Barbell reto em titânio F136 (par)',
        desc: 'O mais tradicional. Pode ser feito em um ou nos dois lados — o valor indicado é por unidade.',
        render: [{ type: 'bar', f: [0.3, 0.72], size: 1 }, { type: 'bar', f: [-0.3, 0.72], size: 1 }] },
      { id: 'mamilo-v', name: 'Mamilo Vertical', pain: 3, healing: '6 a 12 meses', price: 160,
        jewelry: 'Barbell reto vertical',
        desc: 'Orientação vertical, ideal conforme a anatomia. Avaliamos antes de definir a direção.',
        render: [{ type: 'bar', f: [0.3, 0.72], size: 1, rot: [0, 0, 90] }, { type: 'bar', f: [-0.3, 0.72], size: 1, rot: [0, 0, 90] }] },
      { id: 'mamilo-x', name: 'Mamilo Duplo (Cruz)', pain: 4, healing: '9 a 12 meses', price: 290,
        jewelry: 'Dois barbells cruzados',
        desc: 'Combinação horizontal + vertical no mesmo mamilo, formando uma cruz.',
        render: [{ type: 'bar', f: [0.3, 0.72], size: 1 }, { type: 'bar', f: [0.3, 0.72], size: 1, rot: [0, 0, 90], lift: 0.012 }] },
      { id: 'mamilo-argola', name: 'Mamilo com Argola', pain: 3, healing: '6 a 12 meses', price: 170,
        jewelry: 'Barbell inicial; argola após cicatrização',
        desc: 'Começamos com barbell para cicatrizar melhor e trocamos por argola depois da liberação.',
        render: [{ type: 'ring', f: [0.3, 0.72], size: 1.3 }, { type: 'ring', f: [-0.3, 0.72], size: 1.3 }] },
    ],
  },
  /* femininos */
  {
    id: 'f-pubis', region: 'feminino', name: 'Púbis',
    anchor: { f: [0, -0.6] },
    view: V_INT,
    blurb: 'Perfurações de superfície na região do monte púbico, acima da área genital.',
    piercings: [
      { id: 'christina', name: 'Christina', pain: 3, healing: '3 a 6 meses', price: 260,
        jewelry: 'Barbell em L ou curvo de superfície',
        desc: 'Vertical, na junção dos grandes lábios com o monte púbico. Exige anatomia adequada — avaliação obrigatória.',
        render: [] },
      { id: 'nefertiti', name: 'Nefertiti', pain: 4, healing: '6 a 12 meses', price: 320,
        jewelry: 'Barbell curvo longo',
        desc: 'Variação vertical que une capuz e monte púbico. Indicado apenas após avaliação anatômica.',
        render: [] },
    ],
  },
  {
    id: 'f-capuz', region: 'feminino', name: 'Capuz Clitoriano',
    anchor: { f: [0, -0.8] },
    view: V_INT,
    blurb: 'Os piercings íntimos femininos mais procurados. Passam pelo capuz, sem atravessar o clitóris.',
    piercings: [
      { id: 'vch', name: 'VCH — Capuz Vertical', pain: 2, healing: '4 a 8 semanas', price: 240,
        jewelry: 'J-bar ou barbell curvo em titânio',
        desc: 'O mais popular. Cicatrização rápida e conforto no dia a dia. Precisa de anatomia compatível.',
        render: [] },
      { id: 'hch', name: 'HCH — Capuz Horizontal', pain: 2, healing: '6 a 8 semanas', price: 240,
        jewelry: 'Argola ou barbell curvo',
        desc: 'Horizontal na base do capuz. Ótima opção quando a anatomia não favorece o VCH.',
        render: [] },
      { id: 'triangulo', name: 'Triângulo', pain: 4, healing: '2 a 4 meses', price: 300,
        jewelry: 'Argola ou barbell curvo',
        desc: 'Horizontal sob a base do capuz. Altamente dependente de anatomia — apenas com avaliação.',
        render: [] },
    ],
  },
  {
    id: 'f-labios', region: 'feminino', name: 'Lábios & Fourchette',
    anchor: { f: [0, -0.93] },
    view: V_INT,
    blurb: 'Lábios internos, externos e a região posterior. Possibilidades delicadas e personalizadas.',
    piercings: [
      { id: 'labio-interno', name: 'Lábio Interno', pain: 2, healing: '4 a 8 semanas', price: 220,
        jewelry: 'Argola fina ou ferradura',
        desc: 'Nos pequenos lábios. Cicatrização rápida; pode ser feito em pares ou em escada.',
        render: [] },
      { id: 'labio-externo', name: 'Lábio Externo', pain: 3, healing: '2 a 4 meses', price: 240,
        jewelry: 'Argola ou barbell curvo',
        desc: 'Nos grandes lábios. Tecido mais espesso, cicatrização um pouco mais longa.',
        render: [] },
      { id: 'fourchette', name: 'Fourchette', pain: 3, healing: '6 a 8 semanas', price: 260,
        jewelry: 'Barbell curvo ou argola',
        desc: 'Na borda posterior da vulva. Depende de anatomia — avaliamos antes.',
        render: [] },
      { id: 'princess-albertina', name: 'Princess Albertina', pain: 3, healing: '2 a 4 meses', price: 300,
        jewelry: 'Argola ou barbell curvo',
        desc: 'Passa pela uretra e sai na região interna. Procedimento avançado, com avaliação obrigatória.',
        render: [] },
    ],
  },
  /* masculinos */
  {
    id: 'm-pubis', region: 'masculino', name: 'Púbis',
    anchor: { f: [0, -0.58] },
    view: V_INT,
    blurb: 'Perfuração de superfície na base, acima da região genital.',
    piercings: [
      { id: 'pubic', name: 'Pubic', pain: 3, healing: '6 a 12 meses', price: 260,
        jewelry: 'Barbell curvo de superfície',
        desc: 'Na junção entre o púbis e a base do pênis. Requer avaliação anatômica.',
        render: [] },
    ],
  },
  {
    id: 'm-glande', region: 'masculino', name: 'Glande',
    anchor: { f: [0, -0.78] },
    view: V_INT,
    blurb: 'Perfurações na glande e na coroa: das clássicas às mais avançadas.',
    piercings: [
      { id: 'prince-albert', name: 'Prince Albert', pain: 3, healing: '4 a 8 semanas', price: 280,
        jewelry: 'Argola ou barbell curvo de calibre maior',
        desc: 'O piercing íntimo masculino mais conhecido. Cicatrização rápida pela região uretral.',
        render: [] },
      { id: 'reverse-pa', name: 'Reverse PA', pain: 4, healing: '4 a 6 meses', price: 320,
        jewelry: 'Barbell curvo',
        desc: 'Variação do Prince Albert que sai na parte superior da glande.',
        render: [] },
      { id: 'ampallang', name: 'Ampallang', pain: 5, healing: '6 a 12 meses', price: 360,
        jewelry: 'Barbell reto',
        desc: 'Horizontal através da glande. Procedimento avançado, indicado para quem já tem experiência.',
        render: [] },
      { id: 'apadravya', name: 'Apadravya', pain: 5, healing: '6 a 12 meses', price: 360,
        jewelry: 'Barbell reto',
        desc: 'Vertical através da glande. Avaliação anatômica obrigatória.',
        render: [] },
      { id: 'dydoe', name: 'Dydoe', pain: 3, healing: '2 a 4 meses', price: 260,
        jewelry: 'Barbell curvo',
        desc: 'Atravessa a borda da coroa da glande. Pode ser feito em pares.',
        render: [] },
    ],
  },
  {
    id: 'm-haste', region: 'masculino', name: 'Frênulo & Haste',
    anchor: { f: [0, -0.88] },
    view: V_INT,
    blurb: 'Perfurações na pele da parte inferior: frênulo, escada e lorum.',
    piercings: [
      { id: 'frenulo', name: 'Frênulo', pain: 2, healing: '2 a 3 meses', price: 240,
        jewelry: 'Barbell reto ou curvo',
        desc: 'Superficial, na pele logo abaixo da glande. Pode evoluir para uma "escada" (ladder).',
        render: [] },
      { id: 'lorum', name: 'Lorum', pain: 2, healing: '2 a 3 meses', price: 240,
        jewelry: 'Barbell reto',
        desc: 'Na base inferior, na transição para o escroto.',
        render: [] },
    ],
  },
  {
    id: 'm-escroto', region: 'masculino', name: 'Escroto & Períneo',
    anchor: { f: [0, -0.98] },
    view: V_INT,
    blurb: 'Perfurações de pele na região inferior, discretas e de cicatrização tranquila.',
    piercings: [
      { id: 'hafada', name: 'Hafada', pain: 2, healing: '2 a 3 meses', price: 220,
        jewelry: 'Argola ou barbell',
        desc: 'Na pele do escroto. Pode ser feito em sequência.',
        render: [] },
      { id: 'guiche', name: 'Guiche', pain: 3, healing: '3 a 6 meses', price: 260,
        jewelry: 'Argola ou barbell curvo',
        desc: 'Horizontal no períneo, entre o escroto e o ânus.',
        render: [] },
    ],
  },
];

export const GALLERY = [
  // Troque `img` por fotos reais (ex.: 'assets/portfolio/helix-01.jpg').
  { cat: 'orelha', title: 'Curadoria Constelação', detail: 'Lóbulo triplo + hélix duplo + forward', img: '', art: 'ear-constellation' },
  { cat: 'nariz', title: 'Nostril Ponto de Luz', detail: 'Titânio F136 com zircônia 2mm', img: '', art: 'nose-stud' },
  { cat: 'orelha', title: 'Daith Cravejado', detail: 'Clicker em ouro 18k', img: '', art: 'ear-daith' },
  { cat: 'boca', title: 'Medusa Delicado', detail: 'Labret com cristal', img: '', art: 'lips-medusa' },
  { cat: 'nariz', title: 'Septo Clicker', detail: 'Ouro rosé 18k', img: '', art: 'nose-septum' },
  { cat: 'orelha', title: 'Industrial Gráfico', detail: 'Barbell titânio black', img: '', art: 'ear-industrial' },
  { cat: 'rosto', title: 'Sobrancelha Curva', detail: 'Barbell curvo titânio', img: '', art: 'brow' },
  { cat: 'orelha', title: 'Conch Orbital', detail: 'Argola de segmento 10mm', img: '', art: 'ear-conch' },
];
