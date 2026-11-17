/* =========================================================================
   Lorena Lua Piercings — dados do site
   -------------------------------------------------------------------------
   Tudo o que a loja precisa editar fica neste arquivo:
   - CONFIG: contato, endereço, redes sociais
   - ZONES: regiões da cabeça, pontos clicáveis do boneco 3D e os
            piercings disponíveis em cada uma (preço, cicatrização, joia...)
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
  { id: 'titanio', name: 'Titânio F136', color: 0xb9bcc2, rough: 0.22, hex: '#b9bcc2' },
  { id: 'ouro', name: 'Ouro 18k', color: 0xe3b25a, rough: 0.16, hex: '#e3b25a' },
  { id: 'rose', name: 'Ouro Rosé 18k', color: 0xe2a08a, rough: 0.16, hex: '#e2a08a' },
  { id: 'preto', name: 'Titânio Black', color: 0x2b2b30, rough: 0.28, hex: '#2b2b30' },
];

/* Cada zona:
   - anchor: ponto aproximado na superfície + direção de onde o raio "chega"
             (o ponto é projetado na malha 3D automaticamente)
   - view:   posição da câmera ao focar na zona
   - piercings[].render: joias desenhadas no boneco
        type: 'ring' | 'stud' | 'bar' | 'horseshoe'
        at:   ponto [x,y,z] próximo da superfície; dir: de onde vem o raio
        size: escala; rot: rotação extra opcional [x,y,z] em graus
*/
const EAR = { x: 0.86 }; // lateral direita do boneco (lado visível)

export const REGIONS = [
  { id: 'orelha', name: 'Orelha', icon: 'ear' },
  { id: 'nariz', name: 'Nariz', icon: 'nose' },
  { id: 'boca', name: 'Boca & Lábios', icon: 'lips' },
  { id: 'rosto', name: 'Sobrancelha & Rosto', icon: 'brow' },
];

const SIDE = [1, 0, 0];
const FRONT = [0, 0, 1];
const VIEW_EAR = { pos: [3.1, 0.25, 0.35], target: [0.75, 0.02, -0.02] };
const VIEW_FACE = { pos: [0.7, 0.05, 3.3], target: [0, -0.1, 0.3] };
const VIEW_NOSE = { pos: [0.9, -0.15, 2.7], target: [0, -0.18, 0.6] };
const VIEW_MOUTH = { pos: [0.6, -0.4, 2.7], target: [0, -0.45, 0.55] };

export const ZONES = [
  /* ------------------------------ ORELHA ------------------------------ */
  {
    id: 'lobulo', region: 'orelha', name: 'Lóbulo',
    anchor: { at: [EAR.x, -0.32, 0.0], dir: SIDE },
    view: VIEW_EAR,
    blurb: 'A parte macia da orelha. O ponto de partida ideal — cicatrização rápida e infinitas combinações.',
    piercings: [
      {
        id: 'lobulo-1', name: 'Lóbulo', pain: 1, healing: '6 a 8 semanas', price: 80,
        jewelry: 'Labret de rosca interna ou argola 8mm',
        desc: 'O clássico. Perfeito para o primeiro piercing ou para começar uma curadoria de orelha.',
        render: [{ type: 'stud', at: [EAR.x, -0.32, 0.0], dir: SIDE, size: 1 }],
      },
      {
        id: 'lobulo-2', name: 'Lóbulo Duplo', pain: 1, healing: '6 a 8 semanas', price: 140,
        jewelry: 'Dois labrets com pontos de luz em tamanhos escalonados',
        desc: 'Dois furos alinhados no lóbulo, criando uma composição delicada e equilibrada.',
        render: [
          { type: 'stud', at: [EAR.x, -0.32, 0.0], dir: SIDE, size: 1 },
          { type: 'stud', at: [EAR.x, -0.25, -0.06], dir: SIDE, size: 0.8 },
        ],
      },
      {
        id: 'lobulo-3', name: 'Lóbulo Triplo', pain: 1, healing: '6 a 8 semanas', price: 190,
        jewelry: 'Três labrets ou combinação com argola',
        desc: 'Composição em escada no lóbulo, ótima base para quem gosta de orelha cheia.',
        render: [
          { type: 'ring', at: [EAR.x, -0.33, 0.01], dir: SIDE, size: 0.9 },
          { type: 'stud', at: [EAR.x, -0.26, -0.06], dir: SIDE, size: 0.8 },
          { type: 'stud', at: [EAR.x, -0.19, -0.1], dir: SIDE, size: 0.65 },
        ],
      },
      {
        id: 'lobulo-transversal', name: 'Lóbulo Transversal', pain: 2, healing: '3 a 6 meses', price: 150,
        jewelry: 'Barbell reto em titânio',
        desc: 'Atravessa o lóbulo horizontalmente, mostrando as duas pontas da joia. Moderno e discreto.',
        render: [{ type: 'bar', at: [EAR.x, -0.31, 0.0], dir: SIDE, size: 0.7 }],
      },
    ],
  },
  {
    id: 'helix', region: 'orelha', name: 'Hélix',
    anchor: { at: [EAR.x - 0.02, 0.28, -0.14], dir: [0.6, 0.6, -0.4] },
    view: { pos: [2.8, 1.0, -0.4], target: [0.75, 0.15, -0.08] },
    blurb: 'A borda de cartilagem na parte superior da orelha. Versátil e elegante com argolas ou pontos de luz.',
    piercings: [
      {
        id: 'helix-1', name: 'Hélix', pain: 2, healing: '6 a 12 meses', price: 120,
        jewelry: 'Labret com ponto de luz (downsize após inchaço)',
        desc: 'Um dos piercings de cartilagem mais pedidos. Combina com tudo.',
        render: [{ type: 'stud', at: [EAR.x - 0.02, 0.28, -0.14], dir: [0.6, 0.6, -0.4], size: 0.85 }],
      },
      {
        id: 'helix-2', name: 'Hélix Duplo', pain: 2, healing: '6 a 12 meses', price: 210,
        jewelry: 'Dois labrets alinhados na borda',
        desc: 'Dois furos seguindo a curva da borda — efeito de constelação.',
        render: [
          { type: 'stud', at: [EAR.x - 0.02, 0.28, -0.14], dir: [0.6, 0.6, -0.4], size: 0.8 },
          { type: 'stud', at: [EAR.x - 0.02, 0.17, -0.2], dir: [0.6, 0.2, -0.7], size: 0.8 },
        ],
      },
      {
        id: 'industrial', name: 'Industrial', pain: 3, healing: '9 a 12 meses', price: 190,
        jewelry: 'Barbell longo em titânio unindo dois furos',
        desc: 'Dois furos na cartilagem superior conectados por uma única barra. Marcante e gráfico.',
        render: [{ type: 'bar', at: [EAR.x + 0.03, 0.27, -0.03], dir: SIDE, size: 1.9, rot: [0, 0, 12] }],
      },
    ],
  },
  {
    id: 'forward', region: 'orelha', name: 'Forward Hélix',
    anchor: { at: [EAR.x - 0.03, 0.2, 0.12], dir: [0.8, 0.2, 0.55] },
    view: { pos: [2.4, 0.5, 1.9], target: [0.72, 0.12, 0.05] },
    blurb: 'A cartilagem na frente da orelha, junto ao rosto. Delicado e cheio de personalidade.',
    piercings: [
      {
        id: 'forward-1', name: 'Forward Hélix', pain: 2, healing: '6 a 12 meses', price: 120,
        jewelry: 'Labret com ponto de luz pequeno (2–3mm)',
        desc: 'Fica rente à linha do rosto e aparece lindamente em fotos de perfil.',
        render: [{ type: 'stud', at: [EAR.x - 0.03, 0.2, 0.12], dir: [0.8, 0.2, 0.55], size: 0.7 }],
      },
      {
        id: 'forward-2', name: 'Forward Duplo', pain: 2, healing: '6 a 12 meses', price: 210,
        jewelry: 'Dois labrets verticais em escala',
        desc: 'Dois pontos empilhados — um dos detalhes mais pedidos em curadoria de orelha.',
        render: [
          { type: 'stud', at: [EAR.x - 0.03, 0.22, 0.11], dir: [0.8, 0.2, 0.55], size: 0.65 },
          { type: 'stud', at: [EAR.x - 0.03, 0.15, 0.12], dir: [0.8, 0.0, 0.55], size: 0.55 },
        ],
      },
    ],
  },
  {
    id: 'tragus', region: 'orelha', name: 'Tragus',
    anchor: { at: [EAR.x - 0.01, -0.06, 0.14], dir: [0.7, 0, 0.7] },
    view: { pos: [2.5, 0.0, 1.6], target: [0.72, -0.05, 0.05] },
    blurb: 'A pequena aba de cartilagem que cobre a entrada do ouvido.',
    piercings: [
      {
        id: 'tragus-1', name: 'Tragus', pain: 2, healing: '6 a 12 meses', price: 130,
        jewelry: 'Labret de rosca interna com ponto de luz',
        desc: 'Pequeno, sofisticado e muito fotogênico — um destaque discreto.',
        render: [{ type: 'stud', at: [EAR.x - 0.01, -0.06, 0.14], dir: [0.7, 0, 0.7], size: 0.75 }],
      },
      {
        id: 'antitragus', name: 'Anti-tragus', pain: 3, healing: '9 a 12 meses', price: 140,
        jewelry: 'Argola fina ou labret curto',
        desc: 'A cartilagem oposta ao tragus, logo acima do lóbulo. Para quem quer algo diferente.',
        render: [{ type: 'ring', at: [EAR.x + 0.02, -0.19, 0.04], dir: SIDE, size: 0.6, rot: [0, 0, 30] }],
      },
    ],
  },
  {
    id: 'concha', region: 'orelha', name: 'Concha',
    anchor: { at: [EAR.x + 0.0, 0.0, -0.04], dir: SIDE },
    view: VIEW_EAR,
    blurb: 'A área central em formato de concha. Permite ponto de luz interno ou argola envolvendo a borda.',
    piercings: [
      {
        id: 'concha-int', name: 'Concha Interna', pain: 3, healing: '9 a 12 meses', price: 140,
        jewelry: 'Labret com cravejado ou ponto de luz',
        desc: 'Joia no centro da orelha, como um brinco que parece flutuar.',
        render: [{ type: 'stud', at: [EAR.x + 0.0, 0.0, -0.04], dir: SIDE, size: 1 }],
      },
      {
        id: 'concha-ext', name: 'Concha Externa (Orbital)', pain: 3, healing: '9 a 12 meses', price: 150,
        jewelry: 'Argola de segmento envolvendo a borda',
        desc: 'Furo na concha com argola abraçando a borda — impacto máximo.',
        render: [{ type: 'ring', at: [EAR.x + 0.03, 0.07, -0.13], dir: SIDE, size: 1.25, rot: [0, 0, -35] }],
      },
    ],
  },
  {
    id: 'antihelix', region: 'orelha', name: 'Daith & Rook',
    anchor: { at: [EAR.x + 0.01, 0.1, 0.06], dir: SIDE },
    view: VIEW_EAR,
    blurb: 'As dobras internas da cartilagem: daith, rook e snug. Os favoritos de quem já tem experiência.',
    piercings: [
      {
        id: 'daith', name: 'Daith', pain: 3, healing: '9 a 12 meses', price: 160,
        jewelry: 'Clicker ou argola cravejada',
        desc: 'Passa pela dobra mais interna da cartilagem, junto ao canal auditivo.',
        render: [{ type: 'ring', at: [EAR.x - 0.0, 0.02, 0.09], dir: SIDE, size: 0.85, rot: [0, 0, 20] }],
      },
      {
        id: 'rook', name: 'Rook', pain: 3, healing: '9 a 12 meses', price: 160,
        jewelry: 'Barbell curvo ou ferradura',
        desc: 'Vertical na dobra superior da anti-hélix. Charmoso e pouco comum.',
        render: [{ type: 'horseshoe', at: [EAR.x + 0.01, 0.12, 0.04], dir: SIDE, size: 0.7, rot: [0, 0, 90] }],
      },
      {
        id: 'snug', name: 'Snug', pain: 4, healing: '9 a 12 meses', price: 170,
        jewelry: 'Barbell curvo curto',
        desc: 'Na anti-hélix, a crista interna paralela à borda. Exige anatomia adequada — avaliamos antes.',
        render: [{ type: 'horseshoe', at: [EAR.x + 0.03, -0.06, -0.08], dir: SIDE, size: 0.6, rot: [0, 0, 60] }],
      },
    ],
  },

  /* ------------------------------- NARIZ ------------------------------ */
  {
    id: 'narina', region: 'nariz', name: 'Narina',
    anchor: { at: [0.1, -0.23, 0.86], dir: [0.6, 0, 0.8] },
    view: VIEW_NOSE,
    blurb: 'Um dos piercings faciais mais elegantes. Do ponto de luz minimalista à argola.',
    piercings: [
      {
        id: 'nostril', name: 'Nostril — Ponto de Luz', pain: 2, healing: '4 a 6 meses', price: 100,
        jewelry: 'Labret com ponto de luz 2–3mm',
        desc: 'Minimalista e luminoso. Escolhemos a posição ideal de acordo com a anatomia do seu nariz.',
        render: [{ type: 'stud', at: [0.1, -0.23, 0.86], dir: [0.6, 0, 0.8], size: 0.7 }],
      },
      {
        id: 'nostril-argola', name: 'Nostril — Argola', pain: 2, healing: '4 a 6 meses', price: 110,
        jewelry: 'Argola de segmento 8mm (troca após cicatrização)',
        desc: 'Argola abraçando a narina. Iniciamos com labret e trocamos quando a cicatrização permitir.',
        render: [{ type: 'ring', at: [0.11, -0.27, 0.85], dir: [0.6, -0.3, 0.75], size: 0.75, rot: [0, 0, 0] }],
      },
      {
        id: 'high-nostril', name: 'High Nostril', pain: 3, healing: '6 a 9 meses', price: 130,
        jewelry: 'Labret com ponto de luz pequeno',
        desc: 'Posicionado mais acima, na curva do nariz. Moderno e sofisticado.',
        render: [{ type: 'stud', at: [0.08, -0.15, 0.9], dir: [0.6, 0.1, 0.8], size: 0.6 }],
      },
      {
        id: 'nostril-duplo', name: 'Nostril Duplo', pain: 2, healing: '4 a 6 meses', price: 180,
        jewelry: 'Dois labrets ou labret + argola',
        desc: 'Dois furos na mesma narina, compondo um conjunto delicado.',
        render: [
          { type: 'stud', at: [0.1, -0.23, 0.86], dir: [0.6, 0, 0.8], size: 0.65 },
          { type: 'stud', at: [0.08, -0.16, 0.9], dir: [0.6, 0.1, 0.8], size: 0.55 },
        ],
      },
    ],
  },
  {
    id: 'septo', region: 'nariz', name: 'Septo',
    anchor: { at: [0, -0.29, 0.88], dir: [0, -0.6, 0.8] },
    view: { pos: [0.4, -0.9, 2.6], target: [0, -0.3, 0.6] },
    blurb: 'Passa pelo "sweet spot" entre a cartilagem e a ponta do nariz. Pode ser escondido com a joia certa.',
    piercings: [
      {
        id: 'septo-1', name: 'Septo', pain: 2, healing: '2 a 3 meses', price: 140,
        jewelry: 'Ferradura ou clicker cravejado',
        desc: 'Elegante e versátil: com ferradura, pode ser virado para cima e ficar oculto quando preciso.',
        render: [{ type: 'horseshoe', at: [0, -0.3, 0.86], dir: [0, -0.5, 0.85], size: 0.8, rot: [0, 90, 0] }],
      },
    ],
  },
  {
    id: 'bridge', region: 'nariz', name: 'Bridge',
    anchor: { at: [0, 0.09, 0.84], dir: FRONT },
    view: VIEW_FACE,
    blurb: 'Superficial, entre os olhos, no topo do nariz.',
    piercings: [
      {
        id: 'bridge-1', name: 'Bridge', pain: 2, healing: '2 a 3 meses', price: 150,
        jewelry: 'Barbell reto ou curvo em titânio',
        desc: 'Piercing de superfície horizontal. Avaliamos a anatomia para garantir boa fixação.',
        render: [{ type: 'bar', at: [0, 0.09, 0.84], dir: FRONT, size: 0.75 }],
      },
    ],
  },

  /* -------------------------------- BOCA ------------------------------ */
  {
    id: 'labio-sup', region: 'boca', name: 'Lábio Superior',
    anchor: { at: [0, -0.37, 0.84], dir: FRONT },
    view: VIEW_MOUTH,
    blurb: 'Acima do lábio superior: medusa, monroe e madonna.',
    piercings: [
      {
        id: 'medusa', name: 'Medusa', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Labret com disco interno e ponto de luz',
        desc: 'Centralizado no arco do cupido. Destaca e alonga o desenho dos lábios.',
        render: [{ type: 'stud', at: [0, -0.36, 0.84], dir: FRONT, size: 0.65 }],
      },
      {
        id: 'monroe', name: 'Monroe', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Labret com ponto de luz',
        desc: 'Inspirado na pinta clássica, acima do lábio do lado esquerdo.',
        render: [{ type: 'stud', at: [0.15, -0.35, 0.8], dir: [0.3, 0, 0.95], size: 0.65 }],
      },
      {
        id: 'madonna', name: 'Madonna', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Labret com ponto de luz',
        desc: 'Como o Monroe, porém do lado direito.',
        render: [{ type: 'stud', at: [-0.15, -0.35, 0.8], dir: [-0.3, 0, 0.95], size: 0.65 }],
      },
    ],
  },
  {
    id: 'labio-inf', region: 'boca', name: 'Lábio Inferior',
    anchor: { at: [0, -0.56, 0.8], dir: FRONT },
    view: VIEW_MOUTH,
    blurb: 'Labret e combinações: snake bites, spider bites e vertical.',
    piercings: [
      {
        id: 'labret', name: 'Labret', pain: 2, healing: '3 a 6 meses', price: 120,
        jewelry: 'Labret com disco interno',
        desc: 'Centralizado abaixo do lábio inferior. Clássico e atemporal.',
        render: [{ type: 'stud', at: [0, -0.57, 0.8], dir: FRONT, size: 0.7 }],
      },
      {
        id: 'labret-vertical', name: 'Labret Vertical', pain: 3, healing: '3 a 6 meses', price: 140,
        jewelry: 'Barbell curvo',
        desc: 'Atravessa o lábio de cima para baixo, aparecendo as duas pontas.',
        render: [{ type: 'bar', at: [0, -0.5, 0.86], dir: FRONT, size: 0.55, rot: [0, 0, 90] }],
      },
      {
        id: 'snake', name: 'Snake Bites', pain: 3, healing: '3 a 6 meses', price: 220,
        jewelry: 'Duas argolas ou dois labrets',
        desc: 'Par simétrico nos cantos do lábio inferior.',
        render: [
          { type: 'ring', at: [0.11, -0.53, 0.83], dir: [0.15, -0.3, 0.95], size: 0.6, rot: [0, 0, 0] },
          { type: 'ring', at: [-0.11, -0.53, 0.83], dir: [-0.15, -0.3, 0.95], size: 0.6, rot: [0, 0, 0] },
        ],
      },
      {
        id: 'spider', name: 'Spider Bites', pain: 3, healing: '3 a 6 meses', price: 220,
        jewelry: 'Dois labrets ou duas argolas lado a lado',
        desc: 'Dois furos próximos de um mesmo lado do lábio.',
        render: [
          { type: 'ring', at: [0.08, -0.53, 0.84], dir: [0.1, -0.3, 0.95], size: 0.5 },
          { type: 'ring', at: [0.15, -0.52, 0.81], dir: [0.2, -0.3, 0.93], size: 0.5 },
        ],
      },
    ],
  },
  {
    id: 'boca-int', region: 'boca', name: 'Língua & Frênulo',
    anchor: { at: [0, -0.45, 0.88], dir: FRONT },
    view: VIEW_MOUTH,
    blurb: 'Piercings internos: língua, smiley e frowny. Discretos, só aparecem quando você quer.',
    piercings: [
      {
        id: 'lingua', name: 'Língua', pain: 2, healing: '4 a 6 semanas', price: 130,
        jewelry: 'Barbell reto longo (downsize após o inchaço)',
        desc: 'Centralizado na língua. Inchaço inicial é normal — orientamos todo o processo.',
        render: [{ type: 'stud', at: [0, -0.45, 0.88], dir: FRONT, size: 0.8 }],
      },
      {
        id: 'smiley', name: 'Smiley', pain: 1, healing: '4 a 12 semanas', price: 110,
        jewelry: 'Argola fina ou ferradura',
        desc: 'No frênulo do lábio superior — aparece só quando você sorri.',
        render: [{ type: 'horseshoe', at: [0, -0.41, 0.88], dir: FRONT, size: 0.45, rot: [0, 90, 0] }],
      },
      {
        id: 'frowny', name: 'Frowny', pain: 1, healing: '4 a 12 semanas', price: 110,
        jewelry: 'Ferradura fina',
        desc: 'No frênulo do lábio inferior. Um segredo bem guardado.',
        render: [{ type: 'horseshoe', at: [0, -0.49, 0.88], dir: FRONT, size: 0.45, rot: [0, 90, 0] }],
      },
    ],
  },

  /* --------------------------- SOBRANCELHA / ROSTO -------------------- */
  {
    id: 'sobrancelha', region: 'rosto', name: 'Sobrancelha',
    anchor: { at: [0.42, 0.24, 0.72], dir: [0.45, 0.2, 0.85] },
    view: { pos: [1.7, 0.4, 2.7], target: [0.3, 0.15, 0.5] },
    blurb: 'Na extremidade externa da sobrancelha, acompanhando o arco natural.',
    piercings: [
      {
        id: 'sobrancelha-1', name: 'Sobrancelha', pain: 2, healing: '2 a 3 meses', price: 120,
        jewelry: 'Barbell curvo com esferas',
        desc: 'Vertical ou levemente inclinado no fim da sobrancelha. Atitude na medida.',
        render: [{ type: 'bar', at: [0.42, 0.25, 0.72], dir: [0.45, 0.2, 0.85], size: 0.6, rot: [0, 0, 75] }],
      },
      {
        id: 'anti-sobrancelha', name: 'Anti-sobrancelha', pain: 3, healing: '3 a 6 meses', price: 150,
        jewelry: 'Barbell de superfície',
        desc: 'Na parte superior da maçã do rosto, abaixo do canto externo do olho.',
        render: [{ type: 'bar', at: [0.45, -0.01, 0.75], dir: [0.5, 0, 0.85], size: 0.5, rot: [0, 0, 35] }],
      },
    ],
  },
  {
    id: 'bochecha', region: 'rosto', name: 'Bochecha',
    anchor: { at: [0.33, -0.38, 0.72], dir: [0.45, 0, 0.85] },
    view: { pos: [1.6, -0.2, 2.6], target: [0.25, -0.3, 0.5] },
    blurb: 'Dimple: o "furinho" da bochecha, onde se formam as covinhas.',
    piercings: [
      {
        id: 'dimple', name: 'Dimple (Covinha)', pain: 3, healing: '6 a 12 meses', price: 260,
        jewelry: 'Labret com ponto de luz (par)',
        desc: 'Simula covinhas com pontos de luz. Realizado aos pares e com avaliação prévia.',
        render: [
          { type: 'stud', at: [0.33, -0.38, 0.72], dir: [0.45, 0, 0.85], size: 0.7 },
          { type: 'stud', at: [-0.33, -0.38, 0.72], dir: [-0.45, 0, 0.85], size: 0.7 },
        ],
      },
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
