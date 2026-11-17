/* =========================================================================
   Boneco 3D procedural (busto de porcelana) + pontos de piercing + joias
   ========================================================================= */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const g2 = (dx, dy, sx, sy) => Math.exp(-((dx / sx) ** 2) - ((dy / sy) ** 2));
const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------ geometria ------------------------------ */
function buildHeadGeometry() {
  const geo = new THREE.SphereGeometry(1, 192, 160);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ux = v.x, uy = v.y, uz = v.z;
    let x = ux * 0.74, y = uy * 1.0, z = uz * 0.86;

    // crânio mais cheio atrás, topo levemente achatado
    if (uz < 0) z *= 1.1;
    if (uy > 0.6) y -= (uy - 0.6) * 0.12;

    // mandíbula afinando em direção ao queixo
    const jaw = smooth(-0.05, -0.95, uy);
    x *= 1 - 0.34 * jaw;
    if (uz < 0.2) z *= 1 - 0.3 * jaw * smooth(0.2, -0.6, uz);
    // têmporas
    x *= 1 - 0.05 * g2(uy, 0, 0.35, 1) * smooth(0.3, 0.7, uy + 0.4);

    // traços faciais (apenas na frente)
    const m = smooth(0.15, 0.7, uz);
    if (m > 0) {
      let dz = 0;
      // volume da parte inferior do rosto (boca)
      dz += 0.085 * g2(x, y + 0.47, 0.3, 0.22);
      // achata a face lateralmente
      dz -= 0.06 * smooth(0.25, 0.6, Math.abs(x));
      // órbitas oculares
      dz -= 0.075 * g2(Math.abs(x) - 0.26, y - 0.11, 0.12, 0.08);
      // arcos das sobrancelhas
      dz += 0.04 * g2(Math.abs(x) - 0.26, y - 0.25, 0.2, 0.06);
      // testa
      dz += 0.03 * g2(x, y - 0.5, 0.45, 0.25);
      // nariz
      const sx = 0.035 + 0.055 * smooth(0.08, -0.25, y);
      let prof = 0;
      if (y < 0.2 && y > -0.34) {
        prof = 0.02 + 0.15 * smooth(0.12, -0.2, y);
        prof *= 1 - smooth(-0.24, -0.33, y);
      }
      dz += prof * Math.exp(-((x / sx) ** 2));
      // ponta do nariz
      dz += 0.035 * g2(x, y + 0.2, 0.055, 0.05);
      // asas do nariz
      dz += 0.06 * g2(Math.abs(x) - 0.08, y + 0.255, 0.055, 0.04);
      // bochechas / maçãs
      dz += 0.045 * g2(Math.abs(x) - 0.4, y + 0.06, 0.16, 0.13);
      // filtro + lábio superior
      dz += 0.045 * g2(x, y + 0.405, 0.14, 0.04);
      dz += 0.012 * g2(Math.abs(x) - 0.025, y + 0.355, 0.02, 0.04);
      // lábio inferior
      dz += 0.055 * g2(x, y + 0.488, 0.125, 0.04);
      // linha da boca
      dz -= 0.022 * g2(x, y + 0.447, 0.14, 0.01);
      // sulco abaixo do lábio
      dz -= 0.02 * g2(x, y + 0.585, 0.14, 0.035);
      // queixo
      dz += 0.085 * g2(x, y + 0.72, 0.2, 0.12);
      z += dz * m;
    }
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

function buildEar(material) {
  const ear = new THREE.Group();
  // corpo da orelha (concha)
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 48), material);
  body.scale.set(0.07, 0.29, 0.185);
  body.position.set(0.02, 0.0, -0.01);
  ear.add(body);

  // hélix (borda)
  const helixGeo = new THREE.TorusGeometry(0.19, 0.036, 20, 96, Math.PI * 1.5);
  helixGeo.rotateZ(-0.56 * Math.PI);
  helixGeo.scale(1, 1.42, 1);
  helixGeo.rotateY(Math.PI / 2);
  const helix = new THREE.Mesh(helixGeo, material);
  helix.position.set(0.055, 0.02, -0.02);
  helix.scale.x = 0.75;
  ear.add(helix);

  // anti-hélix (dobra interna)
  const ahGeo = new THREE.TorusGeometry(0.115, 0.024, 16, 64, Math.PI * 0.95);
  ahGeo.rotateZ(-0.2 * Math.PI);
  ahGeo.scale(1, 1.25, 1);
  ahGeo.rotateY(Math.PI / 2);
  const ah = new THREE.Mesh(ahGeo, material);
  ah.position.set(0.05, 0.04, -0.02);
  ah.scale.x = 0.7;
  ear.add(ah);

  // lóbulo
  const lobe = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
  lobe.scale.set(0.04, 0.085, 0.075);
  lobe.position.set(0.04, -0.3, 0.0);
  ear.add(lobe);

  // tragus
  const tragus = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), material);
  tragus.scale.set(0.035, 0.055, 0.04);
  tragus.position.set(0.04, -0.06, 0.15);
  ear.add(tragus);

  // anti-tragus
  const at = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), material);
  at.scale.set(0.035, 0.04, 0.05);
  at.position.set(0.055, -0.19, 0.04);
  ear.add(at);
  return ear;
}

function radialTexture(inner, outer) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------ joias ------------------------------ */
function makeGemMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0, clearcoat: 1,
    iridescence: 1, iridescenceIOR: 1.8, envMapIntensity: 3,
    flatShading: true,
  });
}

function buildJewel(spec, metalMat, gemMat) {
  const g = new THREE.Group();
  const s = (spec.size || 1) * 1.3;
  switch (spec.type) {
    case 'stud': {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.026 * s, 0.018 * s, 0.022 * s, 24), metalMat);
      cup.rotation.x = Math.PI / 2;
      cup.position.z = 0.008 * s;
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.023 * s, 1), gemMat);
      gem.scale.z = 0.7;
      gem.position.z = 0.022 * s;
      g.add(cup, gem);
      break;
    }
    case 'ring': {
      const r = 0.05 * s;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.0095, 20, 64), metalMat);
      ring.rotation.y = Math.PI / 2; // plano yz, atravessa a pele
      ring.position.set(0, -r * 0.82, 0.0);
      g.add(ring);
      break;
    }
    case 'horseshoe': {
      const r = 0.05 * s;
      const geo = new THREE.TorusGeometry(r, 0.009, 16, 48, Math.PI * 1.45);
      geo.rotateZ(Math.PI * 0.775); // abertura voltada para baixo
      const arc = new THREE.Mesh(geo, metalMat);
      const bG = new THREE.SphereGeometry(0.017, 20, 20);
      const a1 = 0.775 * Math.PI, a2 = a1 + 1.45 * Math.PI;
      const b1 = new THREE.Mesh(bG, metalMat);
      b1.position.set(Math.cos(a1) * r, Math.sin(a1) * r, 0);
      const b2 = new THREE.Mesh(bG, metalMat);
      b2.position.set(Math.cos(a2) * r, Math.sin(a2) * r, 0);
      const inner = new THREE.Group();
      inner.add(arc, b1, b2);
      inner.rotation.y = Math.PI / 2;
      inner.position.set(0, -r * 0.65, 0);
      g.add(inner);
      break;
    }
    case 'bar': {
      const len = 0.12 * s;
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, len, 16), metalMat);
      bar.rotation.z = Math.PI / 2;
      const bG = new THREE.SphereGeometry(0.022, 24, 24);
      const b1 = new THREE.Mesh(bG, metalMat);
      b1.position.x = len / 2;
      const b2 = new THREE.Mesh(bG, metalMat);
      b2.position.x = -len / 2;
      g.add(bar, b1, b2);
      g.position.z = 0.012;
      break;
    }
  }
  const outer = new THREE.Group();
  outer.add(g);
  return outer;
}

/* ------------------------------ viewer ------------------------------ */
export class HeadViewer {
  constructor(container, overlay, { onZoneClick } = {}) {
    this.container = container;
    this.overlay = overlay;
    this.onZoneClick = onZoneClick;
    this.zones = [];
    this.hotspots = new Map();
    this.activeZone = null;
    this.tween = null;
    this.visible = true;

    const w = container.clientWidth, h = container.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene = scene;

    const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 50);
    this.homeView = { pos: new THREE.Vector3(2.7, 0.6, 4.9), target: new THREE.Vector3(0, -0.42, 0) };
    camera.position.copy(this.homeView.pos);
    if (w / h < 1) camera.position.sub(this.homeView.target).multiplyScalar(Math.min(1.5, h / w)).add(this.homeView.target);
    this.camera = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(this.homeView.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 8;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 2.2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.rotateSpeed = 0.7;
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
      this.tween = null;
    });
    this.controls = controls;

    // luzes
    scene.add(new THREE.HemisphereLight(0xfff1e6, 0x2a1f33, 0.55));
    const key = new THREE.DirectionalLight(0xfff0e0, 2.1);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9b6ff, 2.4);
    rim.position.set(-4, 2, -4);
    scene.add(rim);
    const rim2 = new THREE.DirectionalLight(0xffd9b0, 1.0);
    rim2.position.set(4, 0.5, -3);
    scene.add(rim2);

    this.buildModel();
    this.metalMat = new THREE.MeshPhysicalMaterial({ color: 0xb9bcc2, metalness: 1, roughness: 0.22, envMapIntensity: 1.6, clearcoat: 0.3 });
    this.gemMat = makeGemMaterial();
    this.jewelGroup = new THREE.Group();
    scene.add(this.jewelGroup);

    this.raycaster = new THREE.Raycaster();
    this.bindEvents();

    const io = new IntersectionObserver((e) => { this.visible = e[0].isIntersecting; }, { threshold: 0 });
    io.observe(container);

    this.clock = new THREE.Clock();
    renderer.setAnimationLoop(() => this.frame());
  }

  buildModel() {
    const skin = new THREE.MeshPhysicalMaterial({
      color: 0xead9cc, roughness: 0.52, metalness: 0,
      sheen: 0.6, sheenColor: new THREE.Color(0xffc9b8), sheenRoughness: 0.6,
      clearcoat: 0.12, clearcoatRoughness: 0.5, envMapIntensity: 0.55,
    });
    this.skin = skin;
    const bust = new THREE.Group();
    this.bust = bust;

    const head = new THREE.Mesh(buildHeadGeometry(), skin);
    bust.add(head);

    // pálpebras fechadas (estilo escultura)
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 40, 40), skin);
      eye.scale.set(1, 0.62, 0.5);
      eye.position.set(0.26 * sx, 0.105, 0.64);
      bust.add(eye);
    }

    const earR = buildEar(skin);
    earR.position.set(0.71, 0.0, -0.06);
    earR.rotation.set(0, -0.12, 0.04);
    bust.add(earR);
    const earL = buildEar(skin);
    earL.scale.x = -1;
    earL.position.set(-0.71, 0.0, -0.06);
    earL.rotation.set(0, 0.12, -0.04);
    bust.add(earL);

    // pescoço + ombros (perfil torneado, achatado na frente/costas)
    const prof = [
      [0.0, -0.4], [0.31, -0.4], [0.32, -0.7], [0.34, -0.95], [0.4, -1.08], [0.56, -1.2],
      [0.8, -1.3], [1.02, -1.42], [1.15, -1.56], [1.21, -1.7], [1.22, -1.8],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const bustGeo = new THREE.LatheGeometry(prof, 128);
    const bp = bustGeo.attributes.position;
    for (let i = 0; i < bp.count; i++) {
      const y = bp.getY(i);
      bp.setZ(i, bp.getZ(i) * (1 - 0.48 * smooth(-0.95, -1.45, y)));
    }
    bustGeo.computeVertexNormals();
    const torso = new THREE.Mesh(bustGeo, skin);
    torso.position.set(0, 0, -0.12);
    bust.add(torso);

    const plinthMat = new THREE.MeshPhysicalMaterial({ color: 0x17131c, roughness: 0.35, metalness: 0.2, clearcoat: 0.6 });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.22, 96), plinthMat);
    plinth.scale.set(1.38, 1, 0.78);
    plinth.position.set(0, -1.915, -0.12);
    bust.add(plinth);
    const ringGold = new THREE.Mesh(new THREE.TorusGeometry(1.002, 0.007, 12, 160),
      new THREE.MeshStandardMaterial({ color: 0xd8b26e, metalness: 1, roughness: 0.25 }));
    ringGold.rotation.x = Math.PI / 2;
    ringGold.scale.set(1.38, 0.78, 1);
    ringGold.position.set(0, -1.805, -0.12);
    bust.add(ringGold);

    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.4),
      new THREE.MeshBasicMaterial({ map: radialTexture('rgba(0,0,0,0.6)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -2.02, -0.12);
    bust.add(shadow);

    this.scene.add(bust);
    this.pickables = [];
    bust.traverse((o) => { if (o.isMesh && o !== shadow) this.pickables.push(o); });
    this.scene.updateMatrixWorld(true);
  }

  /* projeta um ponto aproximado na malha (retorna ponto + normal) */
  snap(at, dir) {
    const p = new THREE.Vector3(...at);
    const d = new THREE.Vector3(...dir).normalize();
    this.raycaster.set(p.clone().addScaledVector(d, 2.5), d.clone().negate());
    this.raycaster.far = 5;
    const hits = this.raycaster.intersectObjects(this.pickables, false);
    for (const h of hits) {
      if (h.point.distanceTo(p) < 0.2) {
        const n = h.face.normal.clone().transformDirection(h.object.matrixWorld).normalize();
        if (n.dot(d) < 0) n.negate();
        return { point: h.point.clone(), normal: n.lerp(d, 0.35).normalize() };
      }
    }
    return { point: p, normal: d };
  }

  setZones(zones) {
    this.zones = zones;
    this.overlay.innerHTML = '';
    this.hotspots.clear();
    for (const z of zones) {
      const s = this.snap(z.anchor.at, z.anchor.dir);
      const btn = document.createElement('button');
      btn.className = 'hotspot';
      btn.type = 'button';
      btn.setAttribute('aria-label', `Piercings: ${z.name}`);
      btn.innerHTML = `<span class="hotspot-dot"></span><span class="hotspot-label">${z.name}</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onZoneClick && this.onZoneClick(z.id);
      });
      this.overlay.appendChild(btn);
      this.hotspots.set(z.id, { el: btn, point: s.point.clone().addScaledVector(s.normal, 0.012), normal: s.normal });
    }
  }

  setActiveZone(id) {
    this.activeZone = id;
    for (const [zid, h] of this.hotspots) h.el.classList.toggle('is-active', zid === id);
  }

  setFilter(regionIds) {
    this.regionFilter = regionIds;
    for (const z of this.zones) {
      const h = this.hotspots.get(z.id);
      if (h) h.el.classList.toggle('is-filtered', !!regionIds && !regionIds.includes(z.region));
    }
  }

  flyTo(pos, target, ms = 1100) {
    this.controls.autoRotate = false;
    // telas em retrato: afasta a câmera para caber o enquadramento
    if (this.camera.aspect < 1) {
      const k = Math.min(1.6, 1 / this.camera.aspect) * 0.95;
      pos = pos.map((v, i) => target[i] + (v - target[i]) * Math.max(1, k));
    }
    this.tween = {
      t0: performance.now(), ms,
      fromPos: this.camera.position.clone(), toPos: new THREE.Vector3(...pos),
      fromTarget: this.controls.target.clone(), toTarget: new THREE.Vector3(...target),
    };
  }

  focusZone(zone) {
    this.flyTo(zone.view.pos, zone.view.target);
  }

  resetView() {
    this.flyTo(this.homeView.pos.toArray(), this.homeView.target.toArray());
  }

  setMetal(metal) {
    this.metalMat.color.setHex(metal.color);
    this.metalMat.roughness = metal.rough;
    this.metalMat.metalness = metal.id === 'preto' ? 0.7 : 1;
  }

  showJewelry(specs) {
    for (const c of [...this.jewelGroup.children]) {
      this.jewelGroup.remove(c);
      c.traverse((o) => o.geometry && o.geometry.dispose());
    }
    const up = new THREE.Vector3(0, 1, 0);
    for (const spec of specs) {
      const s = this.snap(spec.at, spec.dir);
      const z = s.normal.clone();
      let yRef = up.clone().addScaledVector(z, -up.dot(z));
      if (yRef.lengthSq() < 1e-4) yRef = new THREE.Vector3(0, 0, -1);
      yRef.normalize();
      const x = new THREE.Vector3().crossVectors(yRef, z).normalize();
      const m = new THREE.Matrix4().makeBasis(x, yRef, z);
      const jewel = buildJewel(spec, this.metalMat, this.gemMat);
      jewel.quaternion.setFromRotationMatrix(m);
      if (spec.rot) {
        const r = spec.rot.map((d) => THREE.MathUtils.degToRad(d));
        jewel.children[0].rotation.set(r[0], r[1], r[2]);
      }
      jewel.position.copy(s.point);
      jewel.scale.setScalar(0.001);
      jewel.userData.born = performance.now() + Math.random() * 120;
      this.jewelGroup.add(jewel);
    }
  }

  bindEvents() {
    const el = this.renderer.domElement;
    let down = null;
    el.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
    el.addEventListener('pointerup', (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved > 6) return;
      const r = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this.raycaster.setFromCamera(ndc, this.camera);
      this.raycaster.far = 50;
      const hit = this.raycaster.intersectObjects(this.pickables, false)[0];
      if (!hit) return;
      let best = null, bestD = 0.22;
      for (const [id, h] of this.hotspots) {
        if (h.el.classList.contains('is-filtered')) continue;
        const d = h.point.distanceTo(hit.point);
        if (d < bestD) { best = id; bestD = d; }
      }
      if (best && this.onZoneClick) this.onZoneClick(best);
    });
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.container);
  }

  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  frame() {
    if (!this.visible) return;
    const now = performance.now();
    if (this.tween) {
      const t = Math.min(1, (now - this.tween.t0) / this.tween.ms);
      const k = ease(t);
      this.camera.position.lerpVectors(this.tween.fromPos, this.tween.toPos, k);
      this.controls.target.lerpVectors(this.tween.fromTarget, this.tween.toTarget, k);
      if (t >= 1) this.tween = null;
    }
    this.controls.update();

    // joias: animação de entrada + brilho
    for (const j of this.jewelGroup.children) {
      const t = Math.min(1, Math.max(0, (now - j.userData.born) / 450));
      const k = t < 1 ? 1 + 0.25 * Math.sin(t * Math.PI) : 1;
      j.scale.setScalar(Math.max(0.001, ease(t) * k));
    }
    this.gemMat.iridescenceThicknessRange = [100 + 300 * (0.5 + 0.5 * Math.sin(now / 700)), 800];

    this.renderer.render(this.scene, this.camera);
    this.updateHotspots();
  }

  updateHotspots() {
    const w = this.container.clientWidth, h = this.container.clientHeight;
    const camPos = this.camera.position;
    const v = new THREE.Vector3();
    const toCam = new THREE.Vector3();
    for (const [, hs] of this.hotspots) {
      toCam.subVectors(camPos, hs.point);
      const dist = toCam.length();
      toCam.normalize();
      let visible = hs.normal.dot(toCam) > 0.05;
      if (visible) {
        this.raycaster.set(camPos, toCam.clone().negate());
        this.raycaster.far = dist - 0.03;
        visible = this.raycaster.intersectObjects(this.pickables, false).length === 0;
      }
      v.copy(hs.point).project(this.camera);
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      hs.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      hs.el.classList.toggle('is-hidden', !visible);
    }
  }
}
