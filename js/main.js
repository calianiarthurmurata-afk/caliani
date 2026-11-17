import { CONFIG, METALS, REGIONS, ZONES, GALLERY } from './data.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const ALL_PIERCINGS = ZONES.flatMap((z) => z.piercings.map((p) => ({ ...p, zone: z })));
const byId = new Map(ALL_PIERCINGS.map((p) => [p.id, p]));

/* ------------------------------ header ------------------------------ */
const header = $('.site-header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
const navToggle = $('.nav-toggle');
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  document.body.classList.toggle('nav-open', !open);
});
$$('#nav-list a').forEach((a) => a.addEventListener('click', () => {
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}));

/* reveal on scroll */
const ro = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach((el) => ro.observe(el));

/* ------------------------------ contato ------------------------------ */
$('#year').textContent = new Date().getFullYear();
$('#c-address').innerHTML = `${CONFIG.address}<br>${CONFIG.city}`;
const whats = $('#c-whats');
whats.href = waLink('Olá, Lorena! Vim pelo site e gostaria de mais informações.');
whats.textContent = CONFIG.whatsappLabel;
$('#float-whats').href = whats.href;
const ig = `https://instagram.com/${CONFIG.instagram}`;
$('#c-ig').href = ig; $('#c-ig').textContent = '@' + CONFIG.instagram;
$('#ig-link').href = ig; $('#ig-link').textContent = '@' + CONFIG.instagram;
$('#c-hours').innerHTML = CONFIG.hours.map(([d, h]) => `<li><span>${d}</span><span>${h}</span></li>`).join('');

const formSelect = $('#form-piercing');
for (const r of REGIONS) {
  const og = document.createElement('optgroup');
  og.label = r.name;
  for (const p of ALL_PIERCINGS.filter((p) => p.zone.region === r.id)) {
    const o = document.createElement('option');
    o.value = p.name; o.textContent = p.name;
    og.appendChild(o);
  }
  formSelect.appendChild(og);
}
$('#contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const nome = (f.get('nome') || '').trim();
  if (!nome) {
    $('#form-error').textContent = 'Por favor, informe seu nome.';
    e.target.nome.focus();
    return;
  }
  $('#form-error').textContent = '';
  let dia = f.get('dia');
  if (dia) dia = new Date(dia + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  const lines = [
    `Olá, Lorena! Me chamo ${nome}.`,
    `Gostaria de agendar: ${f.get('piercing') || 'uma avaliação'}.`,
    dia ? `Preferência: ${dia}, período da ${String(f.get('periodo')).toLowerCase()}.` : `Período de preferência: ${String(f.get('periodo')).toLowerCase()}.`,
    f.get('menor') ? 'Sou menor de idade e irei com meu responsável.' : '',
    f.get('msg') ? `\n${f.get('msg')}` : '',
  ].filter(Boolean);
  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});

/* ------------------------------ estúdio 3D ------------------------------ */
const REGION = new Map(REGIONS.map((r) => [r.id, r]));
const zoneMode = (z) => REGION.get(z.region).mode;
const state = {
  mode: 'face',      // 'face' = boneco 3D | 'intimo' = área íntima (somente texto)
  region: 'orelha',
  zone: null,
  preview: null,
  project: new Set(),
  metal: METALS[0],
  adult: false,
};
try { state.adult = sessionStorage.getItem('ll-adult') === '1'; } catch { /* sem storage */ }
let viewer = null;
const studio = $('#estudio');

const ICONS = {
  ear: '<path d="M15 20c3 0 3-4 5-6 3-3 2-11-5-11S8 8 8 10" /><path d="M11 11a3 3 0 0 1 6 0c0 2-2 2-2 4"/>',
  nose: '<path d="M12 3c0 6-4 9-4 13a2 2 0 0 0 3 2l1-1 1 1a2 2 0 0 0 3-2c0-4-4-7-4-13"/>',
  lips: '<path d="M3 12c3-4 6-5 9-3 3-2 6-1 9 3-3 4-6 6-9 6s-6-2-9-6z"/><path d="M3 12h18"/>',
  brow: '<path d="M3 10c4-4 12-4 18 0"/><path d="M5 15c3 3 11 3 14 0-3-3-11-3-14 0z"/>',
  chest: '<path d="M4 5c1 4 0 8 2 12M20 5c-1 4 0 8-2 12"/><circle cx="8.5" cy="12" r="1.2"/><circle cx="15.5" cy="12" r="1.2"/>',
  fem: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>',
  masc: '<circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/>',
};

const faceZones = () => ZONES.filter((z) => zoneMode(z) === 'face');

function renderRegionTabs() {
  const tabs = $('#region-tabs');
  tabs.innerHTML = '';
  const regs = REGIONS.filter((r) => r.mode === state.mode);
  tabs.style.setProperty('--n', regs.length);
  for (const r of regs) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'region-tab' + (r.id === state.region ? ' is-on' : '');
    b.dataset.region = r.id;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(r.id === state.region));
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[r.icon]}</svg><span>${r.name}</span>`;
    b.addEventListener('click', () => setRegion(r.id, true));
    tabs.appendChild(b);
  }
}

function setRegion(id, focusFirst = false) {
  state.region = id;
  renderRegionTabs();
  renderZoneList();
  if (state.mode === 'intimo') {
    state.zone = null;
    renderIntimo();
    return;
  }
  if (focusFirst) {
    const first = ZONES.find((z) => z.region === id);
    if (first) selectZone(first.id);
  }
}

/* troca entre o boneco 3D e a área íntima (+18, somente texto) */
const gate = $('#gate');
function setMode(mode, after) {
  if (mode === 'intimo' && !state.adult) {
    gate.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#gate-yes').focus();
    gate._after = after;
    return;
  }
  if (mode === state.mode) { after && after(); return; }
  state.mode = mode;
  state.zone = null;
  state.preview = null;
  state.region = REGIONS.find((r) => r.mode === mode).id;
  $$('.mode-btn').forEach((b) => {
    const on = b.dataset.mode === mode;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-selected', String(on));
  });
  studio.classList.toggle('is-intimo', mode === 'intimo');
  renderRegionTabs();
  renderZoneList();
  if (mode === 'intimo') renderIntimo();
  else {
    renderEmpty();
    if (viewer) { viewer.setActiveZone(null); viewer.resetView(); updateJewelry(); }
  }
  after && after();
}
$$('.mode-btn').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
$('#gate-yes').addEventListener('click', () => {
  state.adult = true;
  try { sessionStorage.setItem('ll-adult', '1'); } catch { /* sem storage */ }
  gate.hidden = true;
  document.body.style.overflow = '';
  const after = gate._after;
  gate._after = null;
  setMode('intimo', after);
});
$('#gate-no').addEventListener('click', () => {
  gate.hidden = true;
  document.body.style.overflow = '';
  gate._after = null;
});

function renderEmpty() {
  $('#zone-detail').innerHTML = `
    <div class="zone-empty">
      <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="6" fill="none" stroke="currentColor"/><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-dasharray="2 4"/></svg>
      <p>Gire o boneco e toque em um ponto dourado, ou escolha uma região acima para ver os piercings disponíveis.</p>
    </div>`;
}

function renderZoneList() {
  const list = $('#zone-list');
  list.innerHTML = '';
  const zs = ZONES.filter((z) => z.region === state.region);
  list.classList.toggle('is-single', zs.length < 2);
  for (const z of zs) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'zone-chip' + (state.zone === z.id ? ' is-on' : '');
    const count = z.piercings.filter((p) => state.project.has(p.id)).length;
    b.innerHTML = `${z.name}<small>${z.piercings.length}</small>${count ? `<i>${count}</i>` : ''}`;
    b.addEventListener('click', () => selectZone(z.id));
    list.appendChild(b);
  }
}

function pain(n) {
  return `<span class="pain" aria-label="Desconforto ${n} de 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;
}

function selectZone(id) {
  const z = ZONES.find((z) => z.id === id);
  if (!z) return;
  if (zoneMode(z) === 'intimo') {
    const go = () => {
      if (state.region !== z.region) setRegion(z.region);
      state.zone = id;
      renderZoneList();
      const sec = document.getElementById(`int-${id}`);
      if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        sec.classList.remove('is-flash'); void sec.offsetWidth; sec.classList.add('is-flash');
      }
    };
    setMode('intimo', go);
    return;
  }
  const go = () => {
    state.region = z.region;
    state.zone = id;
    renderRegionTabs();
    renderZoneList();
    if (viewer) { viewer.setActiveZone(id); viewer.focusZone(z); }
    $('#viewer-hint').classList.add('is-gone');
    const inProject = z.piercings.find((p) => state.project.has(p.id));
    state.preview = (inProject || z.piercings[0]).id;
    renderDetail();
    updateJewelry();
  };
  setMode('face', go);
}

const waMsg = (p) => zoneMode(p.zone) === 'intimo'
  ? `Olá, Lorena! Gostaria de informações sobre o piercing ${p.name}. Pode me passar os horários disponíveis para avaliação?`
  : `Olá, Lorena! Tenho interesse no piercing ${p.name} (${p.zone.name}). Pode me passar os horários disponíveis?`;

function cardHTML(p, z, open) {
  const on = state.project.has(p.id);
  const intimo = zoneMode(z) === 'intimo';
  const prev = !open && state.preview === p.id;
  return `
    <article class="p-card${prev ? ' is-preview' : ''}${open ? ' is-open' : ''}${on ? ' is-added' : ''}" data-id="${p.id}"${open ? '' : ` tabindex="0" aria-label="Ver detalhes de ${p.name}"`}>
      <div class="p-top">
        <h4>${p.name}</h4>
        <span class="p-price">a partir de <b>${brl(p.price)}</b></span>
      </div>
      <p class="p-desc">${p.desc}</p>
      <dl class="p-meta">
        <div><dt>Cicatrização</dt><dd>${p.healing}</dd></div>
        <div><dt>Desconforto</dt><dd>${pain(p.pain)}</dd></div>
        <div class="wide"><dt>Joia indicada</dt><dd>${p.jewelry}</dd></div>
      </dl>
      <div class="p-actions">
        <button type="button" class="btn btn-sm ${on ? 'btn-ghost' : 'btn-gold'} js-add" aria-pressed="${on}">${on ? '✓ No projeto' : '+ Adicionar ao projeto'}</button>
        <a class="link-sm" target="_blank" rel="noopener" href="${waLink(waMsg({ ...p, zone: z }))}">${intimo ? 'Agendar avaliação' : 'Agendar este'}</a>
      </div>
    </article>`;
}

function bindCards(box) {
  $$('.p-card', box).forEach((card) => {
    const id = card.dataset.id;
    $('.js-add', card).addEventListener('click', () => toggleProject(id));
    if (card.classList.contains('is-open')) return;
    const preview = () => { state.preview = id; renderDetail(); updateJewelry(); };
    card.addEventListener('click', (e) => { if (!e.target.closest('a, .js-add')) preview(); });
    card.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === card) { e.preventDefault(); preview(); } });
  });
}

function renderDetail() {
  if (state.mode === 'intimo') { renderIntimo(); return; }
  const z = ZONES.find((z) => z.id === state.zone);
  const box = $('#zone-detail');
  if (!z) return;
  box.innerHTML = `
    <div class="zone-head">
      <h3>${z.name}</h3>
      <p>${z.blurb}</p>
    </div>
    <div class="p-cards">${z.piercings.map((p) => cardHTML(p, z, false)).join('')}</div>`;
  bindCards(box);
}

/* área íntima: todas as opções da aba atual, por escrito */
function renderIntimo() {
  const box = $('#zone-detail');
  const zones = ZONES.filter((z) => z.region === state.region);
  box.innerHTML = zones.map((z) => `
    <section class="int-zone" id="int-${z.id}">
      <div class="zone-head">
        <h3>${z.name}</h3>
        <p>${z.blurb}</p>
      </div>
      <div class="p-cards int-cards">${z.piercings.map((p) => cardHTML(p, z, true)).join('')}</div>
    </section>`).join('');
  bindCards(box);
}

function toggleProject(id) {
  if (state.project.has(id)) state.project.delete(id);
  else { state.project.add(id); if (state.mode === 'face') state.preview = id; }
  renderDetail();
  renderZoneList();
  renderProject();
  updateJewelry();
}

function renderProject() {
  const box = $('#project');
  const items = [...state.project].map((id) => byId.get(id));
  box.hidden = items.length === 0;
  const total = items.reduce((s, p) => s + p.price, 0);
  $('#project-count').textContent = `${items.length} piercing${items.length === 1 ? '' : 's'}`;
  $('#project-total').textContent = brl(total);
  $('#project-chips').innerHTML = items.map((p) => `
    <li><button type="button" data-zone="${p.zone.id}" class="pc-go">${p.name} <small>${p.zone.name}</small></button>
    <button type="button" class="pc-x" data-id="${p.id}" aria-label="Remover ${p.name}">×</button></li>`).join('');
  $$('.pc-x').forEach((b) => b.addEventListener('click', () => toggleProject(b.dataset.id)));
  $$('.pc-go').forEach((b) => b.addEventListener('click', () => selectZone(b.dataset.zone)));
  const msg = [
    'Olá, Lorena! Montei meu projeto no site:',
    ...items.map((p) => `• ${p.name} (${p.zone.name})`),
    `Metal preferido: ${state.metal.name}.`,
    `Estimativa: a partir de ${brl(total)}.`,
    'Gostaria de agendar uma avaliação!',
  ].join('\n');
  $('#project-send').href = waLink(msg);
}
$('#project-clear').addEventListener('click', () => {
  state.project.clear();
  renderProject(); renderZoneList(); renderDetail(); updateJewelry();
});

/* joias no boneco: somente piercings do rosto/orelha */
function updateJewelry() {
  if (!viewer) return;
  const ids = new Set(state.project);
  if (state.preview) ids.add(state.preview);
  viewer.showJewelry([...ids].map((id) => byId.get(id)).filter((p) => zoneMode(p.zone) === 'face' && p.render).flatMap((p) => p.render));
}

/* seletor de metal */
const mp = $('#metal-picker');
for (const m of METALS) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'metal' + (m === state.metal ? ' is-on' : '');
  b.setAttribute('role', 'radio');
  b.setAttribute('aria-checked', String(m === state.metal));
  b.title = m.name;
  b.setAttribute('aria-label', m.name);
  b.innerHTML = `<span style="--c:${m.hex}"></span>${m.short || m.name}`;
  b.addEventListener('click', () => {
    state.metal = m;
    $$('.metal', mp).forEach((x) => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-checked', String(on)); });
    viewer && viewer.setMetal(m);
    renderProject();
  });
  mp.appendChild(b);
}

/* controles de giro */
const autoBtn = $('#rot-auto');
const setAutoUI = (on) => { autoBtn.setAttribute('aria-pressed', String(on)); autoBtn.classList.toggle('is-on', on); };
$('#rot-left').addEventListener('click', () => viewer && viewer.rotateBy(-45));
$('#rot-right').addEventListener('click', () => viewer && viewer.rotateBy(45));
autoBtn.addEventListener('click', () => viewer && viewer.setAutoRotate(!viewer.controls.autoRotate));
$('#reset-view').addEventListener('click', () => viewer && viewer.resetView());
$('#viewer').addEventListener('keydown', (e) => {
  if (!viewer) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); viewer.rotateBy(-30); }
  if (e.key === 'ArrowRight') { e.preventDefault(); viewer.rotateBy(30); }
});

renderRegionTabs();
renderZoneList();
renderEmpty();

/* inicia o 3D somente quando a seção se aproxima da tela */
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
    $('#viewer-loading').innerHTML = 'Seu navegador não suporta 3D. Use a lista ao lado para explorar os piercings.';
    return;
  }
  try {
    const { StudioViewer } = await import('./studio3d.js');
    const v = new StudioViewer(viewerEl, $('#hotspots'), { onZoneClick: selectZone });
    v.onAutoRotate = setAutoUI;
    await v.ready;
    viewer = v;
    viewer.setMetal(state.metal);
    viewer.setZones(faceZones());
    updateJewelry();
    const cur = ZONES.find((z) => z.id === state.zone);
    if (cur && zoneMode(cur) === 'face') { viewer.setActiveZone(cur.id); viewer.focusZone(cur); }
    setAutoUI(viewer.controls.autoRotate);
    $('#viewer-loading').classList.add('is-gone');
    window.__viewer = viewer;
  } catch (err) {
    console.error(err);
    $('#viewer-loading').textContent = 'Não foi possível carregar o estúdio 3D.';
  }
}, { rootMargin: '300px' });
boot.observe(viewerEl);

/* ------------------------------ portfólio ------------------------------ */
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
  <figure class="g-item reveal" data-cat="${g.cat}" data-i="${i}" tabindex="0" role="button" aria-label="Ampliar ${g.title}">
    <div class="g-media">${g.img ? `<img src="${g.img}" alt="${g.title}" loading="lazy">` : artSVG(g.art)}</div>
    <figcaption><b>${g.title}</b><span>${g.detail}</span></figcaption>
  </figure>`).join('');
$$('.g-item', gallery).forEach((el) => ro.observe(el));
$$('#gallery-filters .chip').forEach((c) => c.addEventListener('click', () => {
  $$('#gallery-filters .chip').forEach((x) => { x.classList.toggle('is-on', x === c); x.setAttribute('aria-selected', String(x === c)); });
  $$('.g-item', gallery).forEach((it) => { it.hidden = c.dataset.cat !== 'all' && it.dataset.cat !== c.dataset.cat; });
}));
const lb = $('#lightbox');
const openLb = (i) => {
  const g = GALLERY[i];
  $('#lightbox-media').innerHTML = g.img ? `<img src="${g.img}" alt="${g.title}">` : artSVG(g.art);
  $('#lightbox-cap').innerHTML = `<b>${g.title}</b> — ${g.detail}`;
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
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

/* atalhos de depuração (console) */
window.__select = selectZone;
window.__byId = (id) => byId.get(id);
window.__preview = (id) => { const p = byId.get(id); selectZone(p.zone.id); state.preview = id; renderDetail(); updateJewelry(); };
