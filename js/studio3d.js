/* =========================================================================
   Estúdio 3D — cabeça realista (scan), pontos clicáveis e joias
   aplicadas na superfície.
   ========================================================================= */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const HEAD_DIR = 'assets/models/head/';
const V3 = THREE.Vector3;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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

/* pedestal escuro com filete dourado + sombra de contato */
function buildPlinth(topY, rx, rz, h = 0.24) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1a1520, roughness: 0.75, metalness: 0.0, envMapIntensity: 0.15 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.04, h, 96), mat);
  base.scale.set(rx, 1, rz);
  base.position.y = topY - h / 2;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.002, 0.004, 12, 160),
    new THREE.MeshStandardMaterial({ color: 0xd8b26e, metalness: 1, roughness: 0.25 }));
  ring.rotation.x = Math.PI / 2;
  ring.scale.set(rx, rz, 1);
  ring.position.y = topY - 0.01;
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(rx * 3.6, rz * 3.6),
    new THREE.MeshBasicMaterial({ map: radialTexture('rgba(0,0,0,0.6)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = topY - h - 0.005;
  g.add(base, ring, shadow);
  return g;
}

/* --------------------------------- joias --------------------------------- */
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
      ring.rotation.y = Math.PI / 2;
      ring.position.set(0, -r * 0.82, 0);
      g.add(ring);
      break;
    }
    case 'horseshoe': {
      const r = 0.05 * s;
      const geo = new THREE.TorusGeometry(r, 0.009, 16, 48, Math.PI * 1.45);
      geo.rotateZ(Math.PI * 0.775);
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
      g.position.z = 0.012 + (spec.lift || 0);
      break;
    }
  }
  const outer = new THREE.Group();
  outer.add(g);
  return outer;
}

/* normal suavizada (interpolada) no ponto atingido */
const _a = new V3(), _b = new V3(), _c = new V3(), _bary = new V3(), _tri = new THREE.Triangle(), _nm = new THREE.Matrix3();
function hitNormal(hit) {
  const geo = hit.object.geometry;
  const N = geo.attributes.normal, P = geo.attributes.position;
  if (!N || !hit.face) return hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
  const { a, b, c } = hit.face;
  const local = hit.object.worldToLocal(hit.point.clone());
  _tri.set(_a.fromBufferAttribute(P, a), _b.fromBufferAttribute(P, b), _c.fromBufferAttribute(P, c));
  _tri.getBarycoord(local, _bary);
  const n = new V3()
    .addScaledVector(_a.fromBufferAttribute(N, a), _bary.x)
    .addScaledVector(_b.fromBufferAttribute(N, b), _bary.y)
    .addScaledVector(_c.fromBufferAttribute(N, c), _bary.z);
  return n.applyMatrix3(_nm.getNormalMatrix(hit.object.matrixWorld)).normalize();
}

/* ================================ viewer ================================ */
export class StudioViewer {
  constructor(container, overlay, { onZoneClick } = {}) {
    this.container = container;
    this.overlay = overlay;
    this.onZoneClick = onZoneClick;
    this.hotspots = new Map();
    this.tween = null;
    this.visible = true;
    this.mode = 'face';
    this.models = {};

    const w = container.clientWidth, h = container.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    const scene = new THREE.Scene();
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene = scene;

    this.camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 80);
    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 1.6;
    controls.maxDistance = 13;
    controls.minPolarAngle = 0.3;
    controls.maxPolarAngle = 2.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.rotateSpeed = 0.7;
    controls.addEventListener('start', () => {
      this.setAutoRotate(false);
      this.tween = null;
    });
    this.controls = controls;

    scene.add(new THREE.HemisphereLight(0xfff4ea, 0x2a1f33, 0.5));
    const key = new THREE.DirectionalLight(0xfff0e2, 2.4);
    key.position.set(3, 4, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffe7da, 0.6);
    fill.position.set(-5, 1, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc9b6ff, 2.2);
    rim.position.set(-4, 3, -5);
    scene.add(rim);
    const rim2 = new THREE.DirectionalLight(0xffd9b0, 1.1);
    rim2.position.set(5, 1, -3);
    scene.add(rim2);

    this.metalMat = new THREE.MeshPhysicalMaterial({ color: 0xb9bcc2, metalness: 1, roughness: 0.22, envMapIntensity: 1.6, clearcoat: 0.3 });
    this.gemMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0, clearcoat: 1,
      iridescence: 1, iridescenceIOR: 1.8, envMapIntensity: 3, flatShading: true,
    });
    this.jewelGroup = new THREE.Group();
    scene.add(this.jewelGroup);
    this.raycaster = new THREE.Raycaster();

    this.bindEvents();
    new IntersectionObserver((e) => { this.visible = e[0].isIntersecting; }).observe(container);

    this.ready = this.loadHead().then(() => {
      this.setMode('face', true);
      renderer.setAnimationLoop(() => this.frame());
    });
  }

  /* ---------------------------- modelos ---------------------------- */
  async loadHead() {
    const tl = new THREE.TextureLoader();
    const load = (f) => new Promise((res, rej) => tl.load(HEAD_DIR + f, res, undefined, rej));
    const [gltf, map, normal, rough] = await Promise.all([
      new GLTFLoader().loadAsync(HEAD_DIR + 'head.glb'),
      load('color.jpg'), load('normal.jpg'), load('rough.jpg'),
    ]);
    map.colorSpace = THREE.SRGBColorSpace;
    const aniso = this.renderer.capabilities.getMaxAnisotropy();
    map.anisotropy = normal.anisotropy = Math.min(8, aniso);
    const skin = new THREE.MeshPhysicalMaterial({
      map, normalMap: normal, normalScale: new THREE.Vector2(0.9, 0.9),
      roughnessMap: rough, roughness: 1, metalness: 0,
      sheen: 0.35, sheenRoughness: 0.55, sheenColor: new THREE.Color(0xff9e8a),
      clearcoat: 0.06, clearcoatRoughness: 0.6, envMapIntensity: 0.6,
    });
    const mesh = gltf.scene.getObjectByProperty('type', 'Mesh');
    mesh.material = skin;
    mesh.geometry.computeBoundingBox();

    const root = new THREE.Group();
    root.add(mesh);
    root.scale.setScalar(0.5);
    root.position.set(0.05, -0.75, -0.2);
    const group = new THREE.Group();
    group.add(root);
    const bottom = mesh.geometry.boundingBox.min.y * 0.5 - 0.75;
    group.add(buildPlinth(bottom + 0.005, 2.35, 1.5, 0.26));
    this.scene.add(group);
    this.models.face = {
      group, root, pickables: [mesh],
      home: { pos: new V3(3.9, 0.7, 8.4), target: new V3(0, -0.5, 0) },
    };
  }

  get current() { return this.models[this.mode]; }
  get pickables() { return this.current.pickables; }

  setMode(mode, instant = false) {
    this.mode = mode;
    for (const [k, m] of Object.entries(this.models)) m.group.visible = k === mode;
    this.showJewelry([]);
    const h = this.current.home;
    if (instant) {
      this.camera.position.copy(this.fitPortrait(h.pos.clone(), h.target));
      this.controls.target.copy(h.target);
    } else {
      this.flyTo(h.pos, h.target);
    }
  }

  /* ---------------------------- pontos ---------------------------- */
  // f: [x, y] -> projeção frontal; s: [y, z] -> projeção lateral (+x)
  snap(p) {
    const m = this.current;
    m.root.updateMatrixWorld(true);
    let o, d;
    if (p.s) { o = new V3(60, p.s[0], p.s[1]); d = new V3(-1, 0, 0); }
    else { o = new V3(p.f[0], p.f[1], 60); d = new V3(0, 0, -1); }
    const ow = m.root.localToWorld(o.clone());
    const dw = d.transformDirection(m.root.matrixWorld);
    this.raycaster.set(ow, dw);
    this.raycaster.far = 200;
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0];
    if (!hit) return null;
    const n = hitNormal(hit);
    if (n.dot(dw) > 0) n.negate();
    return { point: hit.point.clone(), normal: n };
  }

  toWorld(arr) {
    return this.current.root.localToWorld(new V3(...arr));
  }

  setZones(zones) {
    this.overlay.innerHTML = '';
    this.hotspots.clear();
    for (const z of zones) {
      const s = this.snap(z.anchor);
      if (!s) continue;
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
      this.hotspots.set(z.id, { el: btn, point: s.point.addScaledVector(s.normal, 0.012), normal: s.normal });
    }
    if (this.activeZone) this.setActiveZone(this.activeZone);
  }

  setActiveZone(id) {
    this.activeZone = id;
    for (const [zid, h] of this.hotspots) h.el.classList.toggle('is-active', zid === id);
  }

  /* ---------------------------- câmera ---------------------------- */
  fitPortrait(pos, target) {
    const a = this.camera.aspect;
    if (a >= 1) return pos;
    const k = Math.min(1.55, 1 / a) * 0.95;
    return pos.sub(target).multiplyScalar(Math.max(1, k)).add(target);
  }

  flyTo(pos, target, ms = 1100, fit = true) {
    const p = fit ? this.fitPortrait(pos.clone(), target) : pos.clone();
    this.setAutoRotate(false);
    this.tween = {
      t0: performance.now(), ms,
      fromPos: this.camera.position.clone(), toPos: p,
      fromTarget: this.controls.target.clone(), toTarget: target.clone(),
    };
  }

  focusZone(zone) {
    this.flyTo(this.toWorld(zone.view.pos), this.toWorld(zone.view.target));
  }

  resetView() {
    const h = this.current.home;
    this.flyTo(h.pos, h.target);
  }

  rotateBy(deg) {
    const t = this.tween ? this.tween.toTarget : this.controls.target;
    const from = this.tween ? this.tween.toPos : this.camera.position;
    const off = from.clone().sub(t);
    off.applyAxisAngle(new V3(0, 1, 0), THREE.MathUtils.degToRad(deg));
    this.flyTo(off.add(t), t.clone(), 650, false);
  }

  setAutoRotate(on) {
    this.controls.autoRotate = on;
    this.onAutoRotate && this.onAutoRotate(on);
  }

  /* ---------------------------- joias ---------------------------- */
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
    const up = new V3(0, 1, 0);
    for (const spec of specs) {
      const s = this.snap(spec);
      if (!s) continue;
      const z = s.normal.clone();
      let yRef = up.clone().addScaledVector(z, -up.dot(z));
      if (yRef.lengthSq() < 1e-4) yRef = new V3(0, 0, -1);
      yRef.normalize();
      const x = new V3().crossVectors(yRef, z).normalize();
      const jewel = buildJewel(spec, this.metalMat, this.gemMat);
      jewel.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, yRef, z));
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

  /* ---------------------------- eventos ---------------------------- */
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
      this.raycaster.far = 100;
      const hit = this.raycaster.intersectObjects(this.pickables, false)[0];
      if (!hit) return;
      let best = null, bestD = 0.25;
      for (const [id, h] of this.hotspots) {
        const d = h.point.distanceTo(hit.point);
        if (d < bestD) { best = id; bestD = d; }
      }
      if (best && this.onZoneClick) this.onZoneClick(best);
    });
    new ResizeObserver(() => this.resize()).observe(this.container);
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
    const v = new V3(), toCam = new V3();
    // teste de oclusão a cada 3 quadros (economiza CPU em celulares)
    this._occ = ((this._occ || 0) + 1) % 3;
    const moving = !!this.tween;
    for (const [, hs] of this.hotspots) {
      toCam.subVectors(camPos, hs.point);
      const dist = toCam.length();
      toCam.normalize();
      let visible = hs.normal.dot(toCam) > 0.05;
      if (visible && this._occ !== 0 && hs.visible !== undefined && !moving) visible = hs.visible;
      else if (visible) {
        this.raycaster.set(camPos, toCam.clone().negate());
        this.raycaster.far = dist - 0.03;
        visible = this.raycaster.intersectObjects(this.pickables, false).length === 0;
      }
      v.copy(hs.point).project(this.camera);
      hs.el.style.transform = `translate3d(${((v.x * 0.5 + 0.5) * w).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * h).toFixed(1)}px, 0)`;
      hs.visible = visible;
      hs.el.classList.toggle('is-hidden', !visible);
    }
  }
}
