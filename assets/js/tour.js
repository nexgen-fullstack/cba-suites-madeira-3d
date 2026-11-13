/* CBA Suites Madeira · walk-through made from real photographs.
   Each photo is displaced by its own depth map (Depth Anything V2, computed offline),
   so the camera can move inside the picture with true parallax. */
import * as THREE from 'three';

const SCENES = window.TOUR_SCENES, DICT = window.TOUR_I18N;
const byId = Object.fromEntries(SCENES.map((s, i) => [s.id, Object.assign(s, { i })]));
let lang = new URLSearchParams(location.search).get('lang');
try { lang = lang || localStorage.getItem('cba-lang'); } catch (e) {}
lang = (lang || navigator.language || 'en').slice(0, 2).toLowerCase();
if (!DICT[lang]) lang = 'en';
const T = DICT[lang];
document.documentElement.lang = lang;
document.querySelectorAll('[data-t]').forEach(el => { if (T[el.dataset.t]) el.textContent = T[el.dataset.t]; });
document.title = `${T.kicker} · 3D`;
const isTouch = matchMedia('(pointer: coarse)').matches;
if (isTouch) document.body.classList.add('t-touch');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- renderer ---------- */
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.autoClear = false;
renderer.setClearColor(0x0a0d14, 1);
const FOV = 38;
const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, .01, 50);
const ANISO = renderer.capabilities.getMaxAnisotropy();

/* ---------- depth-displaced photo ---------- */
const STRENGTH = .3;          // depth relief, in units of photo height
const OVERSCAN = 1.13;        // keep the frame edges hidden while the camera moves
const vert = `
  uniform sampler2D uDepth; uniform float uStrength, uCamDist;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    float d = texture2D(uDepth, uv).r;
    float z = (d - .45) * uStrength;
    vec3 p = position;
    p.xy *= (uCamDist - z) / uCamDist;     // perspective-correct: at rest the view equals the photograph
    p.z = z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
  }`;
const frag = `
  uniform sampler2D uMap; uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uMap, vUv);
    gl_FragColor = vec4(c.rgb, uOpacity);
    #include <colorspace_fragment>
  }`;

const texLoader = new THREE.TextureLoader();
const cache = new Map();
function loadImage(url) { return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = url; }); }
function prepare(id) {
  if (cache.has(id)) return cache.get(id);
  const s = byId[id];
  const p = Promise.all([
    texLoader.loadAsync(`assets/img/${s.img}.webp`),
    loadImage(`assets/depth/${s.img.replace(/-\d+$/, '-depth')}.webp`)
  ]).then(([map, dimg]) => {
    map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = ANISO;
    const depth = new THREE.Texture(dimg); depth.needsUpdate = true; depth.minFilter = THREE.LinearFilter; depth.generateMipmaps = false;
    const c = document.createElement('canvas'); c.width = 160; c.height = Math.round(160 * dimg.height / dimg.width);
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(dimg, 0, 0, c.width, c.height);
    const px = g.getImageData(0, 0, c.width, c.height);
    const aspect = map.image.width / map.image.height;
    const seg = isTouch ? 160 : 240;
    const geo = new THREE.PlaneGeometry(aspect, 1, seg, Math.round(seg / aspect));
    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: map }, uDepth: { value: depth }, uStrength: { value: STRENGTH }, uCamDist: { value: 2 }, uOpacity: { value: 1 } },
      vertexShader: vert, fragmentShader: frag, transparent: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    const sc = new THREE.Scene(); sc.add(mesh);
    return { id, mesh, scene: sc, px, aspect, life: 0 };
  });
  cache.set(id, p);
  return p;
}
function depthAt(v, u, w) {
  const x = Math.min(v.px.width - 1, Math.max(0, Math.round(u * (v.px.width - 1))));
  const y = Math.min(v.px.height - 1, Math.max(0, Math.round(w * (v.px.height - 1))));
  return v.px.data[(y * v.px.width + x) * 4] / 255;
}

let camDist = 2, maxPan = 0, lastTouch = -10;
function fit(view) {
  const va = innerWidth / innerHeight, t = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
  const visH = va > view.aspect ? view.aspect / (OVERSCAN * va) : 1 / OVERSCAN;
  camDist = visH / (2 * t);
  maxPan = Math.max(0, (view.aspect / OVERSCAN - visH * va) / 2);   // portrait screens: room to pan across the photo
  view.mesh.material.uniforms.uCamDist.value = camDist;
}

/* ---------- state ---------- */
let cur = null, prev = null, trans = null;
let auto = false, autoTimer = 0, sceneTime = 0;
const AUTO_SECONDS = 7.5;

/* ---------- UI ---------- */
const $ = (id) => document.getElementById(id);
const card = $('t-card'), hsLayer = $('t-hotspots'), chNav = $('t-chapters');
$('t-total').textContent = String(SCENES.length).padStart(2, '0');
$('t-hint').textContent = isTouch ? T.hintTouch : T.hint;
const chapters = [...new Set(SCENES.map(s => s.ch))];
for (const ch of chapters) {
  const b = document.createElement('button'); b.textContent = T.ch[ch]; b.dataset.ch = ch;
  b.onclick = () => { stopAuto(); go(SCENES.find(s => s.ch === ch).id); };
  chNav.appendChild(b);
}
function setCard(s) {
  card.classList.add('is-swap');
  setTimeout(() => {
    $('t-title').textContent = T.s[s.id][0]; $('t-text').textContent = T.s[s.id][1];
    $('t-count').textContent = String(s.i + 1).padStart(2, '0');
    card.classList.remove('is-swap');
  }, 380);
  chNav.querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b.dataset.ch === s.ch));
  $('t-bar').style.width = `${(s.i + 1) / SCENES.length * 100}%`;
  history.replaceState(null, '', `#${s.id}`);
}
let hsEls = [];
function buildHotspots(view) {
  hsLayer.innerHTML = ''; hsEls = [];
  for (const h of byId[view.id].hs) {
    const b = document.createElement('button'); b.className = 't-hs';
    b.innerHTML = `<i></i><span>${T.s[h.to][0]}</span>`;
    b.setAttribute('aria-label', T.s[h.to][0]);
    b.onclick = (e) => { e.stopPropagation(); stopAuto(); go(h.to, h); };
    hsLayer.appendChild(b);
    const z = (depthAt(view, h.x, h.y) - .45) * STRENGTH, k = (camDist - z) / camDist;
    hsEls.push({ el: b, p: new THREE.Vector3((h.x - .5) * view.aspect * k, (.5 - h.y) * k, z) });
  }
}

/* ---------- navigation ---------- */
let busy = false;
async function go(id, from) {
  if (busy || (cur && cur.id === id)) return;
  busy = true; hsLayer.classList.add('is-off');
  const next = await prepare(id);
  fit(next); next.life = 0;
  if (cur) {
    const h = from || { x: .5, y: .45 };
    const z = (depthAt(cur, h.x, h.y) - .45) * STRENGTH;
    prev = cur; trans = { k: 0, aim: new THREE.Vector3((h.x - .5) * cur.aspect, (.5 - h.y), z), start: prev.mesh.position.clone() };
  } else trans = { k: 0, intro: true };
  cur = next; sceneTime = 0;
  setCard(byId[id]);
  byId[id].hs.forEach(h => prepare(h.to));
  prepare(SCENES[(byId[id].i + 1) % SCENES.length].id);
}
function step(dir) {
  const i = (byId[cur.id].i + dir + SCENES.length) % SCENES.length, target = SCENES[i].id;
  go(target, dir > 0 ? byId[cur.id].hs.find(h => h.to === target) : null);
}
$('t-next').onclick = () => { stopAuto(); step(1); };
$('t-prev').onclick = () => { stopAuto(); step(-1); };
const autoBtn = $('t-auto');
function stopAuto() { auto = false; autoBtn.classList.remove('is-on'); autoBtn.querySelector('span').textContent = T.auto; }
autoBtn.onclick = () => {
  auto = !auto; autoBtn.classList.toggle('is-on', auto); autoBtn.querySelector('span').textContent = auto ? T.stop : T.auto;
  if (auto) { autoTimer = 0; step(1); }
};
addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { stopAuto(); step(1); }
  if (e.key === 'ArrowLeft') { stopAuto(); step(-1); }
  if (e.key === ' ') { e.preventDefault(); autoBtn.click(); }
});

/* ---------- looking around: mouse, drag, tilt ---------- */
const look = { x: 0, y: 0, tx: 0, ty: 0 };
let drag = null;
addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse') { look.tx = (e.clientX / innerWidth - .5) * 2; look.ty = (e.clientY / innerHeight - .5) * 2; return; }
  if (!drag) return;
  look.tx = Math.max(-1, Math.min(1, drag.tx - (e.clientX - drag.x) / innerWidth * (maxPan > .02 ? 1.6 : 3)));
  look.ty = Math.max(-1, Math.min(1, drag.ty - (e.clientY - drag.y) / innerHeight * 3));
});
canvas.addEventListener('pointerdown', e => { lastTouch = performance.now() / 1000; if (e.pointerType !== 'mouse') drag = { x: e.clientX, y: e.clientY, tx: look.tx, ty: look.ty }; });
addEventListener('pointerup', () => { drag = null; lastTouch = performance.now() / 1000; });
let tilt0 = null, tiltOn = false;
function onTilt(e) {
  if (e.gamma == null || drag) return;
  if (!tilt0) tilt0 = { b: e.beta, g: e.gamma };
  if (Math.abs(e.gamma - tilt0.g) > 2) tiltOn = true;
  look.tx = Math.max(-1, Math.min(1, (e.gamma - tilt0.g) / 18));
  look.ty = Math.max(-1, Math.min(1, (e.beta - tilt0.b) / 18));
}
if (isTouch) {
  const ask = () => {
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') DeviceOrientationEvent.requestPermission().then(r => { if (r === 'granted') addEventListener('deviceorientation', onTilt); }).catch(() => {});
    else addEventListener('deviceorientation', onTilt);
    removeEventListener('pointerdown', ask);
  };
  addEventListener('pointerdown', ask);
}

/* ---------- loop ---------- */
const ease = { out: t => 1 - Math.pow(1 - t, 3), in: t => t * t * t, inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 };
const clock = new THREE.Clock();
const v = new THREE.Vector3();
const TRANS = 1.7;
function frame() {
  const dt = Math.min(.05, clock.getDelta());
  sceneTime += dt;
  const amp = reduced ? .25 : 1;
  look.x += (look.tx - look.x) * Math.min(1, dt * 3);
  look.y += (look.ty - look.y) * Math.min(1, dt * 3);
  const breath = Math.sin(sceneTime * .5) * .004;
  if (maxPan > .02) {
    // phone held upright: drag or tilt to look across the whole room; when idle the camera looks around by itself
    if (!drag && performance.now() / 1000 - lastTouch > 4 && !tiltOn) look.tx = Math.sin(sceneTime * .16) * .85;
    const px = look.x * maxPan;
    camera.position.set(px + Math.sin(sceneTime * .23) * .01 * amp, look.y * .03 * amp + breath * amp, camDist);
    camera.lookAt(px * 1.02, -look.y * .01, -.2);
  } else {
    camera.position.set(-look.x * .07 * amp + Math.sin(sceneTime * .23) * .01 * amp, look.y * .045 * amp + breath * amp, camDist);
    camera.lookAt(look.x * .02, -look.y * .015, -.2);
  }

  renderer.clear();
  if (cur) {
    cur.life = Math.min(1, cur.life + dt / 16);
    let z = ease.out(cur.life) * camDist * .07 * amp;
    if (trans) {
      trans.k = Math.min(1, trans.k + dt / (trans.intro ? 2.2 : TRANS));
      const k = trans.k;
      cur.mesh.material.uniforms.uOpacity.value = 1;
      if (trans.intro) z += (1 - ease.out(k)) * camDist * .18;
      else {
        z += (1 - ease.out(Math.max(0, (k - .2) / .8))) * camDist * .22;
        const kout = ease.inOut(Math.min(1, k / .8));
        prev.mesh.position.set(trans.start.x - trans.aim.x * kout * .9, trans.start.y - trans.aim.y * kout * .9, trans.start.z + kout * camDist * .8);
        prev.mesh.material.uniforms.uOpacity.value = 1 - ease.inOut(Math.min(1, Math.max(0, (k - .3) / .45)));
      }
      if (k >= 1) {
        if (prev) { prev.mesh.position.set(0, 0, 0); prev.mesh.material.uniforms.uOpacity.value = 1; prev = null; }
        trans = null; busy = false;
        buildHotspots(cur); hsLayer.classList.remove('is-off');
      }
    }
    cur.mesh.position.set(0, 0, z);
    renderer.render(cur.scene, camera);
    if (prev) { renderer.clearDepth(); renderer.render(prev.scene, camera); }
    if (!trans) for (const h of hsEls) {
      v.copy(h.p); v.z += z; v.project(camera);
      h.el.style.transform = `translate(${(v.x + 1) / 2 * innerWidth - 11}px, ${(1 - v.y) / 2 * innerHeight - 11}px)`;
    }
    if (auto && !trans) { autoTimer += dt; if (autoTimer > AUTO_SECONDS) { autoTimer = 0; step(1); } }
  }
  requestAnimationFrame(frame);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  if (cur) { fit(cur); buildHotspots(cur); }
});

/* ---------- start ---------- */
const startId = byId[location.hash.slice(1)] ? location.hash.slice(1) : 'lobby';
const bar = $('t-prog'); bar.style.width = '30%';
prepare(startId).then(() => {
  bar.style.width = '100%';
  go(startId);
  requestAnimationFrame(frame);
  setTimeout(() => $('t-loader').classList.add('is-done'), 250);
  setTimeout(() => { $('t-hint').style.opacity = '0'; }, 9000);
});
window.__tour = { go, step, get cur() { return cur; } };
