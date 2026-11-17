import { CONFIG, REGIONS, ZONES, POPULAR, GALLERY } from './data.js?v=4';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const REGION = new Map(REGIONS.map((r) => [r.id, r]));
const zoneMode = (z) => REGION.get(z.region).mode;
const ALL = ZONES.flatMap((z) => z.piercings.map((p) => ({ ...p, zone: z })));
const byId = new Map(ALL.map((p) => [p.id, p]));

/* ------------------------------ contato ------------------------------ */
const WA_HELLO = 'Olá! Vi o site da Lorena Lua Piercings e queria mais informações.';
$$('.js-wa').forEach((a) => { a.href = waLink(WA_HELLO); });
$('#c-phone').textContent = CONFIG.whatsappLabel;
$('#c-address').textContent = `${CONFIG.address} · ${CONFIG.city}`;
$('#c-hours').textContent = CONFIG.hours;
$('#c-map').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONFIG.address}, ${CONFIG.city}`)}`;
$('#ig-link').href = `https://instagram.com/${CONFIG.instagram}`;
$('#ig-link span').textContent = '@' + CONFIG.instagram;
$('#year').textContent = new Date().getFullYear();
$('#hero-city').textContent = `No centro · ${CONFIG.city}`;

const wantMsg = (p) => zoneMode(p.zone) === 'intimo'
  ? `Olá! Queria saber sobre o piercing ${p.name} (a partir de ${brl(p.price)}). Tem horário para avaliação?`
  : `Olá! Quero fazer o piercing ${p.name} (a partir de ${brl(p.price)}). Tem horário disponível?`;

/* cartão "mais procurados" */
$('#hero-prices').innerHTML = POPULAR.map((id) => byId.get(id)).filter(Boolean).map((p) => `
  <li><span>${p.name.replace(/ — .*/, '')}</span><b>${brl(p.price)}</b></li>`).join('');

/* ------------------------- escolha + preços ------------------------- */
const state = { tab: 'orelha', zone: null, selected: null, adult: false };
try { state.adult = sessionStorage.getItem('ll-adult') === '1'; } catch { /* sem storage */ }
let viewer = null;
const picker = $('#picker');

const TABS = [
  ...REGIONS.filter((r) => r.mode === 'face').map((r) => ({ id: r.id, name: r.name })),
  { id: 'intimo', name: 'Íntimo', badge: '+18' },
];

function renderTabs() {
  $('#tabs').innerHTML = TABS.map((t) => `
    <button type="button" role="tab" class="tab${t.id === state.tab ? ' is-on' : ''}" data-tab="${t.id}" aria-selected="${t.id === state.tab}">
      ${t.name}${t.badge ? ` <small class="badge18">${t.badge}</small>` : ''}
    </button>`).join('');
  $$('.tab').forEach((b) => b.addEventListener('click', () => setTab(b.dataset.tab, true)));
}

function rowHTML(p, sub) {
  const on = state.selected === p.id;
  const clickable = zoneMode(p.zone) === 'face';
  return `
    <div class="row${on ? ' is-on' : ''}" data-id="${p.id}">
      ${clickable
        ? `<button type="button" class="row-main" aria-label="Ver ${p.name} no boneco">`
        : '<div class="row-main">'}
        <b>${p.name}</b>
        <small>${sub ? `${sub} · ` : ''}cicatriza em ${p.healing}</small>
      ${clickable ? '</button>' : '</div>'}
      <span class="row-price"><small>a partir de</small>${brl(p.price)}</span>
      <a class="row-wa" href="${waLink(wantMsg(p))}" target="_blank" rel="noopener" aria-label="Quero o ${p.name} — chamar no WhatsApp">
        <svg viewBox="0 0 32 32" aria-hidden="true"><use href="#wa"/></svg><span>Quero</span>
      </a>
    </div>`;
}

function renderList() {
  const box = $('#price-list');
  if (state.tab === 'intimo') {
    const groups = REGIONS.filter((r) => r.mode === 'intimo');
    box.innerHTML = groups.map((r) => `
      <div class="group">
        <h3>${r.name}</h3>
        ${ZONES.filter((z) => z.region === r.id).flatMap((z) => z.piercings.map((p) => rowHTML({ ...p, zone: z }, z.name === r.name ? '' : z.name))).join('')}
      </div>`).join('');
    return;
  }
  box.innerHTML = ZONES.filter((z) => z.region === state.tab).map((z) => `
    <div class="group${state.zone === z.id ? ' is-on' : ''}" id="g-${z.id}">
      <h3><button type="button" class="group-go" data-zone="${z.id}">${z.name}</button></h3>
      ${z.piercings.map((p) => rowHTML({ ...p, zone: z })).join('')}
    </div>`).join('');
  $$('.row-main', box).forEach((b) => {
    if (b.tagName !== 'BUTTON') return;
    b.addEventListener('click', () => selectPiercing(b.closest('.row').dataset.id));
  });
  $$('.group-go', box).forEach((b) => b.addEventListener('click', () => selectZone(b.dataset.zone)));
}

/* ---- área íntima: aviso +18 ---- */
const gate = $('#gate');
function setTab(id, user = false) {
  if (id === 'intimo' && !state.adult) {
    gate.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#gate-yes').focus();
    return;
  }
  state.tab = id;
  picker.classList.toggle('is-intimo', id === 'intimo');
  if (id !== 'intimo') {
    state.zone = null;
    const first = ZONES.find((z) => z.region === id);
    if (user && first && viewer) viewer.focusZone(first);
  }
  renderTabs();
  renderList();
  if (viewer) viewer.setActiveZone(null);
}
$('#gate-yes').addEventListener('click', () => {
  state.adult = true;
  try { sessionStorage.setItem('ll-adult', '1'); } catch { /* sem storage */ }
  gate.hidden = true;
  document.body.style.overflow = '';
  setTab('intimo');
});
$('#gate-no').addEventListener('click', () => {
  gate.hidden = true;
  document.body.style.overflow = '';
});

function selectZone(id, scroll = true) {
  const z = ZONES.find((x) => x.id === id);
  if (!z) return;
  if (state.tab !== z.region) setTab(z.region);
  state.zone = id;
  renderList();
  if (viewer) { viewer.setActiveZone(id); viewer.focusZone(z); }
  const g = $(`#g-${id}`);
  if (scroll && g) {
    const list = $('#price-list');
    if (list.scrollHeight > list.clientHeight + 4) list.scrollTo({ top: g.offsetTop - list.offsetTop, behavior: 'smooth' });
    g.classList.remove('flash'); void g.offsetWidth; g.classList.add('flash');
  }
}

function selectPiercing(id) {
  const p = byId.get(id);
  state.selected = state.selected === id ? null : id;
  selectZone(p.zone.id, false);
  if (viewer) viewer.showJewelry(state.selected ? p.render : []);
}

/* girar */
$('#rot-left').addEventListener('click', () => viewer && viewer.rotateBy(-45));
$('#rot-right').addEventListener('click', () => viewer && viewer.rotateBy(45));
$('#viewer').addEventListener('keydown', (e) => {
  if (!viewer) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); viewer.rotateBy(-30); }
  if (e.key === 'ArrowRight') { e.preventDefault(); viewer.rotateBy(30); }
});

renderTabs();
renderList();

/* carrega o 3D só quando a seção chega perto da tela */
function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}
const viewerEl = $('#viewer');
const boot = new IntersectionObserver(async (entries) => {
  if (!entries[0].isIntersecting) return;
  boot.disconnect();
  if (!supportsWebGL()) {
    $('#viewer-loading').textContent = 'Seu celular não abriu o 3D, mas os preços estão todos aqui ao lado.';
    return;
  }
  try {
    const { StudioViewer } = await import('./studio3d.js?v=4');
    const v = new StudioViewer(viewerEl, $('#hotspots'), { onZoneClick: (id) => selectZone(id) });
    await v.ready;
    viewer = v;
    viewer.setZones(ZONES.filter((z) => zoneMode(z) === 'face'));
    if (state.zone) selectZone(state.zone, false);
    if (state.selected) viewer.showJewelry(byId.get(state.selected).render);
    $('#viewer-loading').classList.add('is-gone');
    window.__viewer = viewer;
  } catch (err) {
    console.error(err);
    $('#viewer-loading').textContent = 'Não foi possível carregar o boneco 3D. Os preços estão aqui ao lado.';
  }
}, { rootMargin: '300px' });
boot.observe(viewerEl);

/* ------------------------------ trabalhos ------------------------------ */
const ART = {
  ear: '<path class="ln" d="M118 36c40 0 62 30 60 70-2 32-22 46-32 70-8 20-6 46-30 52-20 5-34-8-32-26 2-14 14-20 14-34 0-10-10-14-14-26C76 106 74 36 118 36z"/><path class="ln th" d="M110 66c24-4 42 14 40 38-2 18-16 26-24 40"/><path class="ln th" d="M100 130c8-6 20-4 22 6"/>',
  nose: '<path class="ln" d="M100 40c0 50-30 90-30 120 0 14 12 22 24 14l6-4 6 4c12 8 24 0 24-14 0-30-30-70-30-120"/><path class="ln th" d="M76 168c6-8 14-8 18 0M124 168c-6-8-14-8-18 0"/>',
  lips: '<path class="ln" d="M40 130c22-26 44-34 60-22 16-12 38-4 60 22-20 30-42 42-60 42s-40-12-60-42z"/><path class="ln th" d="M40 130c30 6 90 6 120 0"/>',
  brow: '<path class="ln" d="M40 100c40-30 100-30 130-6"/><path class="ln" d="M52 150c30 26 86 26 112 0-26-24-86-24-112 0z"/><circle class="ln th" cx="108" cy="150" r="12"/>',
};
const PIECES = {
  'ear-constellation': ['ear', [[96, 218, 'g'], [104, 204, 'g', 4], [112, 192, 'g', 3], [160, 70, 'g'], [170, 92, 'g'], [100, 70, 'g', 3], [100, 82, 'g', 2.5]]],
  'nose-stud': ['nose', [[132, 160, 'g', 5]]],
  'ear-daith': ['ear', [[108, 136, 'r', 12]]],
  'lips-medusa': ['lips', [[100, 104, 'g', 5]]],
  'nose-septum': ['nose', [[100, 186, 'r', 12]]],
  'ear-industrial': ['ear', [[100, 64, 'b'], [168, 82, 'b'], [100, 64, 'bar', 168, 82]]],
  brow: ['brow', [[160, 80, 'b'], [166, 104, 'b'], [160, 80, 'bar', 166, 104]]],
  'ear-conch': ['ear', [[134, 120, 'r', 18]]],
};
function artSVG(key) {
  const [base, marks] = PIECES[key];
  const m = marks.map((d) => {
    if (d[2] === 'g') return `<circle class="gem" cx="${d[0]}" cy="${d[1]}" r="${d[3] || 4.5}"/>`;
    if (d[2] === 'r') return `<circle class="ring" cx="${d[0]}" cy="${d[1] + d[3] * 0.8}" r="${d[3]}"/>`;
    if (d[2] === 'b') return `<circle class="ball" cx="${d[0]}" cy="${d[1]}" r="4.5"/>`;
    if (d[2] === 'bar') return `<line class="bar" x1="${d[0]}" y1="${d[1]}" x2="${d[3]}" y2="${d[4]}"/>`;
    return '';
  }).join('');
  return `<svg viewBox="0 0 200 260" aria-hidden="true">${ART[base]}${m}</svg>`;
}
const gallery = $('#gallery');
gallery.innerHTML = GALLERY.map((g, i) => `
  <figure class="g-item" data-i="${i}" tabindex="0" role="button" aria-label="Ampliar ${g.title}">
    <div class="g-media">${g.img ? `<img src="${g.img}" alt="${g.title}" loading="lazy">` : artSVG(g.art)}</div>
    <figcaption>${g.title}</figcaption>
  </figure>`).join('');
const lb = $('#lightbox');
const openLb = (i) => {
  const g = GALLERY[i];
  $('#lightbox-media').innerHTML = g.img ? `<img src="${g.img}" alt="${g.title}">` : artSVG(g.art);
  $('#lightbox-cap').textContent = g.title;
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  $('.lightbox-close', lb).focus();
};
const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; };
$$('.g-item', gallery).forEach((el) => {
  el.addEventListener('click', () => openLb(+el.dataset.i));
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') openLb(+el.dataset.i); });
});
lb.addEventListener('click', (e) => { if (e.target === lb || e.target.closest('.lightbox-close')) closeLb(); });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!lb.hidden) closeLb();
  if (!gate.hidden) { gate.hidden = true; document.body.style.overflow = ''; }
});

/* atalhos de teste (console) */
window.__select = selectZone;
window.__piercing = selectPiercing;
