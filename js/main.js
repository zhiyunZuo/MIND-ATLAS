// ============================================================
// MIND ATLAS — Main Application
// Orchestrates: scene, books, network, camera, interaction,
// book worlds, navigation, knowledge pages, render loop
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

import { SUBJECTS } from '../data/atlas-data.js';
import { BookModel } from './book.js';
import { KnowledgeNetwork } from './network.js';
import { CameraRig, CameraState } from './camera-rig.js';
import { InteractionManager } from './interaction.js';
import { BookWorld } from './book-world.js';
import { KnowledgePage } from './knowledge-page.js';
import { NavigationManager } from './navigation.js';
import { Easing } from './utils.js';

// ============================================================
// 1. SCENE SETUP
// ============================================================

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05060a, 0.006);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(0, 30, 260); // Start far for intro

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
renderer.setClearColor(0x05060a, 1);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.left = '0';
labelRenderer.domElement.style.pointerEvents = 'none';

document.getElementById('canvas-container').appendChild(renderer.domElement);
document.getElementById('label-container').appendChild(labelRenderer.domElement);

// ============================================================
// 2. CONTROLS
// ============================================================

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.45;
controls.zoomSpeed = 0.55;
controls.enablePan = false;
controls.minDistance = 30;
controls.maxDistance = 140;
controls.target.set(0, 0, 0);
controls.enabled = false; // Disabled during intro

// ============================================================
// 3. LIGHTS
// ============================================================

const ambient = new THREE.AmbientLight(0x404050, 0.28);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xe8e3d8, 0.38);
keyLight.position.set(12, 18, 14);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x3a4a6a, 0.14);
fillLight.position.set(-12, -4, -12);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xc9a84c, 0.08);
rimLight.position.set(0, -8, 5);
scene.add(rimLight);

// ============================================================
// 4. STAR FIELD
// ============================================================

function createStarField() {
  const count = 900;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = 90 + Math.random() * 180;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

    const brightness = 0.3 + Math.random() * 0.5;
    const warmth = Math.random();
    colors[i * 3] = brightness * (0.9 + warmth * 0.1);
    colors[i * 3 + 1] = brightness * (0.85 + warmth * 0.05);
    colors[i * 3 + 2] = brightness * (0.75 + warmth * 0.15);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    fog: false
  });

  return new THREE.Points(geo, mat);
}

const stars = createStarField();
scene.add(stars);

// Distant glow spheres for depth
function createDistantGlows() {
  const grp = new THREE.Group();
  const glowPositions = [
    { x: -40, y: 15, z: -60, r: 8, c: 0x2a2a3a },
    { x: 50, y: -10, z: -50, r: 6, c: 0x2a3a2a },
    { x: 0, y: 20, z: -70, r: 10, c: 0x3a2a2a },
    { x: -30, y: -15, z: 60, r: 7, c: 0x2a2a3a }
  ];
  for (const g of glowPositions) {
    const geo = new THREE.SphereGeometry(g.r, 16, 16);
    const mat = new THREE.MeshBasicMaterial({
      color: g.c,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(g.x, g.y, g.z);
    grp.add(mesh);
  }
  return grp;
}

const glows = createDistantGlows();
scene.add(glows);

// ============================================================
// 5. CREATE BOOKS
// ============================================================

const books = SUBJECTS.map(subject => new BookModel(subject));
books.forEach(book => scene.add(book.group));

// ============================================================
// 6. KNOWLEDGE NETWORK
// ============================================================

const network = new KnowledgeNetwork(SUBJECTS, scene);

// ============================================================
// 7. CAMERA RIG
// ============================================================

const cameraRig = new CameraRig(camera, controls);
const overlay = document.getElementById('transition-overlay');

cameraRig.on('overlay', (data) => {
  if (data.color === 'warm') {
    overlay.style.background = 'radial-gradient(ellipse at center, #e8d8b0 0%, #c4a878 50%, #8a7040 100%)';
  } else {
    overlay.style.background = 'var(--bg-deep)';
  }

  if (data.fadeOut) {
    overlay.style.opacity = String(data.opacity || 0);
  } else if (data.instant) {
    overlay.style.transition = 'none';
    overlay.style.opacity = String(data.opacity || 0);
    requestAnimationFrame(() => {
      overlay.style.transition = 'opacity 0.8s ease';
    });
  } else {
    overlay.style.opacity = String(data.opacity || 0);
  }
});

cameraRig.on(CameraState.FOCUS, () => {
  // Other books dim — handled gradually
});

cameraRig.on(CameraState.BOOK_WORLD, () => {
  // Book world is now active
});

// ============================================================
// 8. INTERACTION, NAVIGATION, KNOWLEDGE PAGE
// ============================================================

const interaction = new InteractionManager(camera, renderer.domElement, books, network);
const nav = new NavigationManager();
const knowledgePage = new KnowledgePage();

// ============================================================
// 9. STATE MANAGEMENT
// ============================================================

let currentBookWorld = null;
let currentSubject = null;
let currentTopic = null;
let isTransitioning = false;
let activeCatalogBook = null;
let catalogMoving = false;

// ============================================================
// 9a. CATALOG SIDEBAR
// ============================================================

const catalogEl = document.getElementById('catalog');
const catalogList = document.getElementById('catalog-list');
const catalogToggle = document.getElementById('catalog-toggle');
const catalogTab = document.getElementById('catalog-tab');

// Build catalog items
SUBJECTS.forEach((subject, i) => {
  const item = document.createElement('div');
  item.className = 'catalog-item';
  item.dataset.subjectId = subject.id;
  item.innerHTML = `<span class="catalog-item-num">${String(i + 1).padStart(2, '0')}</span><span class="catalog-item-title">${subject.shortTitle}</span>`;
  item.addEventListener('click', () => {
    if (catalogMoving || isTransitioning) return;
    const book = books.find(b => b.subject.id === subject.id);
    if (!book) return;
    focusOnBook(book);
  });
  catalogList.appendChild(item);
});

catalogToggle.addEventListener('click', () => {
  catalogEl.classList.toggle('collapsed');
});
catalogTab.addEventListener('click', () => {
  catalogEl.classList.remove('collapsed');
});

// Smooth camera move to a book (without entering it)
function focusOnBook(book) {
  if (cameraRig.getState() !== CameraState.UNIVERSE) return;
  if (!controls.enabled) return;

  // Set active catalog item
  catalogList.querySelectorAll('.catalog-item').forEach(el => {
    el.classList.toggle('active', el.dataset.subjectId === book.subject.id);
  });
  activeCatalogBook = book;

  // Highlight the book
  books.forEach(b => {
    if (b === book) {
      b.setHover(true);
      b.setDim(0);
    } else {
      b.setHover(false);
      b.setDim(0.3);
    }
  });

  // Smooth camera move
  catalogMoving = true;
  controls.enabled = false;

  const bookPos = new THREE.Vector3();
  book.group.getWorldPosition(bookPos);

  const targetCamPos = new THREE.Vector3(
    bookPos.x * 0.75,
    bookPos.y + 1.5,
    bookPos.z + 28
  );
  const startCamPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const targetTarget = bookPos.clone();

  let moveTime = 0;
  const moveDuration = 1.8;

  function animateMove() {
    moveTime += 1 / 60;
    const t = Math.min(1, moveTime / moveDuration);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    camera.position.lerpVectors(startCamPos, targetCamPos, eased);
    controls.target.lerpVectors(startTarget, targetTarget, eased);
    camera.lookAt(controls.target);

    if (t < 1) {
      requestAnimationFrame(animateMove);
    } else {
      controls.enabled = true;
      catalogMoving = false;

      // Reset dim after a moment
      setTimeout(() => {
        if (activeCatalogBook === book) {
          books.forEach(b => {
            b.setHover(false);
            b.setDim(0);
          });
        }
      }, 2000);
    }
  }
  animateMove();
}

// --- Enter a book (from universe) ---
function enterBook(book) {
  if (isTransitioning) return;
  if (cameraRig.getState() !== CameraState.UNIVERSE) return;

  isTransitioning = true;
  currentSubject = book.subject;
  interaction.setEnabled(false);
  nav.hideHint();
  catalogEl.classList.add('collapsed');

  // Capture controls settings
  const savedMinDist = controls.minDistance;
  const savedMaxDist = controls.maxDistance;

  cameraRig.enterBook(book, (subject) => {
    // === onEnterWorld callback ===
    // Hide universe
    books.forEach(b => { b.group.visible = false; });
    network.setAllVisible(false);
    stars.visible = false;
    glows.visible = false;

    // Create and show book world
    currentBookWorld = new BookWorld(subject, document.getElementById('label-container'));
    scene.add(currentBookWorld.group);

    // Adjust fog for book world
    scene.fog.color.setHex(subject.bookStyle.spine);
    scene.fog.density = 0.015;

    // Position camera
    cameraRig.enterBookWorldPosition(currentBookWorld.getCenter());

    // Set controls for book world
    controls.minDistance = 4;
    controls.maxDistance = 22;

    // Setup interaction with topic objects
    interaction.setTopicObjects(currentBookWorld.getTopicObjects());
    interaction.setEnabled(true);

    // Navigation
    nav.showBreadcrumb(['MIND ATLAS', subject.shortTitle]);
    nav.showBack('RETURN TO ATLAS');

    isTransitioning = false;

    setTimeout(() => {
      nav.showHint('click a topic to explore · drag to rotate · scroll to zoom', 6000);
    }, 800);
  });
}

// --- Return to universe (from book world) ---
function returnToUniverse() {
  if (isTransitioning) return;
  if (cameraRig.getState() !== CameraState.BOOK_WORLD &&
      cameraRig.getState() !== CameraState.TOPIC_APPROACH) return;

  // If knowledge page is open, close it first
  if (knowledgePage.isVisible()) {
    knowledgePage.hide();
    cameraRig.returnToBookWorld(currentBookWorld.getCenter(), () => {
      nav.showBreadcrumb(['MIND ATLAS', currentSubject.shortTitle]);
      nav.showBack('RETURN TO ATLAS');
      interaction.setEnabled(true);
    });
    return;
  }

  isTransitioning = true;
  interaction.setEnabled(false);
  nav.hideHint();

  cameraRig.returnToUniverse(() => {
    // === onExitWorld callback ===
    // Dispose book world
    if (currentBookWorld) {
      currentBookWorld.dispose();
      scene.remove(currentBookWorld.group);
      currentBookWorld = null;
    }

    // Show universe
    books.forEach(b => {
      b.group.visible = true;
      b.setDim(0);
    });
    network.setAllVisible(true);
    network.setHover(null);
    stars.visible = true;
    glows.visible = true;

    // Restore fog
    scene.fog.color.setHex(0x05060a);
    scene.fog.density = 0.008;

    // Restore controls
    controls.minDistance = 30;
    controls.maxDistance = 140;

    // Show catalog
    catalogEl.classList.remove('collapsed');

    // Clear interaction
    interaction.setTopicObjects([]);
    interaction.setEnabled(true);

    // Navigation
    nav.hideBreadcrumb();
    nav.hideBack();

    currentSubject = null;
    currentTopic = null;
    isTransitioning = false;

    setTimeout(() => {
      nav.showHint('drag to explore · scroll to zoom · click a book to enter', 5000);
    }, 500);
  });
}

// --- Enter a topic (from book world) ---
function enterTopic(topic) {
  if (isTransitioning) return;
  if (cameraRig.getState() !== CameraState.BOOK_WORLD || !currentBookWorld) return;

  isTransitioning = true;
  currentTopic = topic;
  interaction.setEnabled(false);

  // Find topic object position
  const topicObj = currentBookWorld.getTopicObjects().find(obj =>
    obj.userData.topic && obj.userData.topic.id === topic.id
  );

  if (topicObj) {
    const pos = new THREE.Vector3();
    topicObj.getWorldPosition(pos);

    cameraRig.approachTopic(pos, () => {
      // Show knowledge page
      knowledgePage.show(topic, currentSubject);
      nav.showBreadcrumb(['MIND ATLAS', currentSubject.shortTitle, topic.title.toUpperCase()]);
      nav.showBack('RETURN TO ' + currentSubject.shortTitle);
      isTransitioning = false;
    });
  } else {
    isTransitioning = false;
    interaction.setEnabled(true);
  }
}

// --- Return to book world (from topic/knowledge page) ---
function returnToBookWorld() {
  if (isTransitioning) return;

  if (knowledgePage.isVisible()) {
    knowledgePage.hide();
    isTransitioning = true;

    cameraRig.returnToBookWorld(currentBookWorld.getCenter(), () => {
      nav.showBreadcrumb(['MIND ATLAS', currentSubject.shortTitle]);
      nav.showBack('RETURN TO ATLAS');
      interaction.setEnabled(true);
      isTransitioning = false;
    });
  }
}

// ============================================================
// 10. WIRE UP CALLBACKS
// ============================================================

interaction.onBookClick = (book) => {
  enterBook(book);
};

interaction.onTopicClick = (topic) => {
  enterTopic(topic);
};

nav.onBack = () => {
  if (knowledgePage.isVisible()) {
    returnToBookWorld();
  } else if (cameraRig.getState() === CameraState.BOOK_WORLD ||
             cameraRig.getState() === CameraState.TOPIC_APPROACH) {
    returnToUniverse();
  }
};

knowledgePage.onClose = () => {
  returnToBookWorld();
};

// ============================================================
// DEBUG: Global access for diagnostics
// ============================================================
window.__mindAtlas = {
  books,
  interaction,
  cameraRig,
  network,
  camera,
  controls,
  scene,
  enterBook,
  returnToUniverse,
  getState: () => ({
    isTransitioning,
    cameraState: cameraRig.getState(),
    currentSubject: currentSubject?.title || null,
    currentTopic: currentTopic?.title || null
  })
};

// ============================================================
// 11. INTRO ANIMATION
// ============================================================
// Driven by the main render loop's clock for reliability

let introActive = false;
let introSkipped = false;
let introTime = 0;
let introDuration = 6;
let introFrom = new THREE.Vector3(0, 30, 260);
let introTo = new THREE.Vector3(0, 6, 72);
let introLookFrom = new THREE.Vector3(0, 9, 0);
let introLookTo = new THREE.Vector3(0, 0, 0);

function startIntro() {
  introActive = true;
  introTime = 0;
  interaction.setEnabled(false);
  controls.enabled = false;
  camera.position.copy(introFrom);
  camera.lookAt(introLookFrom);

  // Skip on first click/touch
  const skip = () => { introSkipped = true; };
  renderer.domElement.addEventListener('click', skip, { once: true });
  renderer.domElement.addEventListener('touchend', skip, { once: true });
}

function _easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateIntro(dt) {
  if (!introActive) return false;

  if (introSkipped) {
    introTime = introDuration;
  } else {
    introTime += dt;
  }

  const t = Math.min(1, introTime / introDuration);
  const eased = _easeInOutCubic(t);

  camera.position.lerpVectors(introFrom, introTo, eased);

  const lookTarget = new THREE.Vector3().lerpVectors(introLookFrom, introLookTo, eased);
  camera.lookAt(lookTarget);

  if (t >= 1) {
    introActive = false;
    _finishIntro();
  }

  return true;
}

function _finishIntro() {
  camera.position.copy(introTo);
  camera.lookAt(0, 0, 0);

  controls.target.set(0, 0, 0);
  controls.enabled = true;
  controls.update();

  interaction.setEnabled(true);
  nav.showHint('drag to explore · scroll to zoom · click a book to enter', 6000);

  // Show catalog
  catalogEl.classList.add('visible');
}

// Safety net: ensure interaction is enabled after max 12s
setTimeout(() => {
  if (!interaction.enabled) {
    introActive = false;
    camera.position.copy(introTo);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.enabled = true;
    controls.update();
    interaction.setEnabled(true);
  }
}, 12000);

// ============================================================
// 12. LOADING SCREEN
// ============================================================

function startApp() {
  const loadingScreen = document.getElementById('loading-screen');
  const bar = document.getElementById('loading-bar');
  const hintEl = document.getElementById('loading-hint');

  let progress = 0;
  const stages = [
    { pct: 25, text: 'building the cosmos' },
    { pct: 50, text: 'forging books of knowledge' },
    { pct: 75, text: 'weaving connections' },
    { pct: 100, text: 'entering the atlas' }
  ];

  let stageIdx = 0;

  function updateBar() {
    if (stageIdx >= stages.length) {
      // Done loading
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        startIntro();
      }, 600);
      return;
    }

    const stage = stages[stageIdx];
    hintEl.textContent = stage.text;

    const startPct = progress;
    const targetPct = stage.pct;
    const stepCount = 20;
    let step = 0;

    function animateBar() {
      step++;
      progress = startPct + (targetPct - startPct) * (step / stepCount);
      bar.style.width = progress + '%';

      if (step < stepCount) {
        setTimeout(animateBar, 30);
      } else {
        progress = targetPct;
        stageIdx++;
        setTimeout(updateBar, 200);
      }
    }

    animateBar();
  }

  updateBar();
}

// ============================================================
// 13. RENDER LOOP
// ============================================================

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.1);
  const time = clock.getElapsedTime();

  // Intro animation (runs first, before controls)
  if (introActive) {
    updateIntro(dt);
  }

  // Update controls (only when enabled and not in transition)
  if (controls.enabled && !cameraRig.isInTransition() && !introActive) {
    controls.update();
  }

  // Update camera rig transitions
  cameraRig.update(dt);

  // Update books (always call for label visibility sync)
  books.forEach(book => book.update(dt, time));

  // Update network
  if (network.group.visible) {
    network.update(dt);
  }

  // Update book world
  if (currentBookWorld && currentBookWorld.group.visible) {
    currentBookWorld.update(dt, time);
  }

  // Slow star rotation
  stars.rotation.y += dt * 0.003;

  // Render
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

// ============================================================
// 14. RESIZE
// ============================================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================
// 15. START
// ============================================================

animate();
startApp();
