// ============================================================
// MIND ATLAS — 3D Book Model
// Real book geometry: cover, spine, pages, micro elements
// ============================================================

import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class BookModel {
  constructor(subject, textureCache) {
    this.subject = subject;
    this.textureCache = textureCache;
    this.group = new THREE.Group();
    this.group.userData.subject = subject;
    this.group.userData.bookModel = this;

    this.isOpen = false;
    this.openProgress = 0;
    this.hoverIntensity = 0;
    this.targetHover = 0;
    this.dimAmount = 0;
    this.targetDim = 0;

    const s = subject.bookStyle;
    this.colors = {
      cover: new THREE.Color(s.cover),
      spine: new THREE.Color(s.spine),
      page: new THREE.Color(s.page),
      accent: new THREE.Color(s.accent)
    };

    // Dimensions
    // Book dimensions (scaled up for better visibility and clickability)
    this.W = 4.2;
    this.H = 0.85;
    this.D = 3.0;
    this.coverThick = 0.08;

    this._buildPages();
    this._buildCovers();
    this._buildSpine();
    this._buildAccentLines();
    this._buildWarmLight();
    this._buildMicroElements();
    this._buildHitbox();
    this._buildLabel();

    // Position & rotation
    this.group.position.set(subject.position.x, subject.position.y, subject.position.z);
    this._baseRotY = (Math.sin(subject.id.length * 7.3) * 0.25);
    this._baseRotX = (Math.cos(subject.id.length * 5.1) * 0.12);
    this._baseRotZ = (Math.sin(subject.id.length * 3.7) * 0.08);
    this.group.rotation.set(this._baseRotX, this._baseRotY, this._baseRotZ);

    // Float params from subject data
    const f = subject.float;
    this._floatAmp = f.amp;
    this._floatSpeed = f.speed;
    this._floatPhase = f.phase;
    this._rotAmp = f.rotAmp;
    this._rotSpeed = f.rotSpeed;

    this._time = 0;
  }

  _buildPages() {
    const geo = new THREE.BoxGeometry(this.W * 0.94, this.H, this.D * 0.94);
    const mat = new THREE.MeshStandardMaterial({
      color: this.colors.page,
      roughness: 0.95,
      metalness: 0.0
    });
    this.pages = new THREE.Mesh(geo, mat);
    this.group.add(this.pages);

    // Page edge lines for layered paper look
    const lineCount = 5;
    for (let i = 0; i < lineCount; i++) {
      const y = (i / (lineCount - 1) - 0.5) * this.H * 0.85;
      const lineGeo = new THREE.BoxGeometry(this.W * 0.93, 0.002, this.D * 0.93);
      const lineMat = new THREE.MeshBasicMaterial({
        color: 0xb0a890,
        transparent: true,
        opacity: 0.08
      });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.y = y;
      this.pages.add(line);
    }
  }

  _buildCovers() {
    const coverGeo = new THREE.BoxGeometry(this.W, this.coverThick, this.D);
    const coverMat = new THREE.MeshStandardMaterial({
      color: this.colors.cover,
      roughness: 0.62,
      metalness: this.subject.bookStyle.sheen || 0.3
    });

    // Front cover on pivot for opening
    this.coverPivot = new THREE.Group();
    this.coverPivot.position.set(-this.W / 2, this.H / 2 + this.coverThick / 2, 0);
    this.frontCover = new THREE.Mesh(coverGeo, coverMat);
    this.frontCover.position.set(this.W / 2, 0, 0);
    this.frontCover.castShadow = false;
    this.coverPivot.add(this.frontCover);
    this.group.add(this.coverPivot);

    // Back cover
    const backMat = coverMat.clone();
    this.backCover = new THREE.Mesh(coverGeo, backMat);
    this.backCover.position.set(0, -this.H / 2 - this.coverThick / 2, 0);
    this.group.add(this.backCover);

    // Subtle cover decoration: inner border line
    const borderGeo = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(this.W * 0.85, 0.001, this.D * 0.85)
    );
    const borderMat = new THREE.LineBasicMaterial({
      color: this.colors.accent,
      transparent: true,
      opacity: 0.15
    });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.position.set(this.W / 2, this.coverThick / 2 + 0.001, 0);
    this.frontCover.add(border);
  }

  _buildSpine() {
    const spineGeo = new THREE.BoxGeometry(0.05, this.H + this.coverThick * 2, this.D);
    const spineMat = new THREE.MeshStandardMaterial({
      color: this.colors.spine,
      roughness: 0.68,
      metalness: 0.2
    });
    this.spine = new THREE.Mesh(spineGeo, spineMat);
    this.spine.position.set(-this.W / 2 - 0.02, 0, 0);
    this.group.add(this.spine);
  }

  _buildAccentLines() {
    // Gold accent line along spine
    const accentGeo = new THREE.BoxGeometry(0.015, 0.003, this.D * 0.88);
    const accentMat = new THREE.MeshStandardMaterial({
      color: this.colors.accent,
      roughness: 0.3,
      metalness: 0.7,
      emissive: this.colors.accent,
      emissiveIntensity: 0.04
    });
    const accent1 = new THREE.Mesh(accentGeo, accentMat);
    accent1.position.set(this.W / 2 - 0.05, this.coverThick / 2 + 0.002, 0);
    this.frontCover.add(accent1);

    const accent2 = new THREE.Mesh(accentGeo, accentMat.clone());
    accent2.position.set(this.W / 2 - 0.05, -this.coverThick / 2 - 0.002, 0);
    this.frontCover.add(accent2);
  }

  _buildWarmLight() {
    // Warm point light between pages, visible when book opens
    this.warmLight = new THREE.PointLight(0xd4a868, 0, 3, 2);
    this.warmLight.position.set(0, 0, 0);
    this.group.add(this.warmLight);

    // Glowing plane that appears between pages when open
    const glowGeo = new THREE.PlaneGeometry(this.W * 0.8, this.H * 0.8);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xd4a868,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.pageGlow = new THREE.Mesh(glowGeo, glowMat);
    this.pageGlow.rotation.x = -Math.PI / 2;
    this.pageGlow.position.y = this.H / 2;
    this.group.add(this.pageGlow);
  }

  _buildMicroElements() {
    this.microGroup = new THREE.Group();
    const theme = this.subject.micro;
    const accent = this.colors.accent;
    const rng = _seededRng(this.subject.id.charCodeAt(0) * 13 + this.subject.id.charCodeAt(1));

    const elementCount = 2 + Math.floor(rng() * 2);

    for (let i = 0; i < elementCount; i++) {
      const el = this._createMicroElement(theme, accent, rng);
      if (el) {
        const angle = (i / elementCount) * Math.PI * 2 + rng() * 0.5;
        const dist = 1.4 + rng() * 0.6;
        el.position.set(
          Math.cos(angle) * dist,
          (rng() - 0.5) * 0.8,
          Math.sin(angle) * dist
        );
        el.userData.baseY = el.position.y;
        el.userData.floatPhase = rng() * Math.PI * 2;
        el.userData.floatSpeed = 0.2 + rng() * 0.3;
        el.userData.rotSpeed = (rng() - 0.5) * 0.4;
        this.microGroup.add(el);
      }
    }

    this.group.add(this.microGroup);
  }

  _createMicroElement(theme, color, rng) {
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.25
    });
    const wireMat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2
    });

    switch (theme) {
      case 'geometric': {
        const size = 0.08 + rng() * 0.06;
        const geo = new THREE.TetrahedronGeometry(size);
        const mesh = new THREE.Mesh(geo, mat);
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), wireMat);
        mesh.add(edges);
        return mesh;
      }
      case 'manuscript': {
        const w = 0.1 + rng() * 0.06;
        const h = 0.14 + rng() * 0.06;
        const geo = new THREE.PlaneGeometry(w, h);
        const paperMat = new THREE.MeshBasicMaterial({
          color: 0xe8dcc8,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geo, paperMat);
        mesh.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
        return mesh;
      }
      case 'neural': {
        const grp = new THREE.Group();
        const nodeMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });
        for (let j = 0; j < 3; j++) {
          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), nodeMat);
          sphere.position.set((rng() - 0.5) * 0.15, (rng() - 0.5) * 0.15, (rng() - 0.5) * 0.15);
          grp.add(sphere);
        }
        return grp;
      }
      case 'strategy': {
        const size = 0.12;
        const geo = new THREE.BoxGeometry(size, 0.005, size);
        const mesh = new THREE.Mesh(geo, mat);
        const gridMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 });
        for (let j = 1; j < 4; j++) {
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(-size/2, 0.003, -size/2 + j * size/4),
              new THREE.Vector3(size/2, 0.003, -size/2 + j * size/4)
            ]),
            gridMat
          );
          mesh.add(line);
        }
        return mesh;
      }
      case 'starmap': {
        const grp = new THREE.Group();
        const starMat = new THREE.MeshBasicMaterial({ color: 0xc9c94c, transparent: true, opacity: 0.4 });
        for (let j = 0; j < 4; j++) {
          const star = new THREE.Mesh(new THREE.SphereGeometry(0.015, 4, 4), starMat);
          star.position.set((rng() - 0.5) * 0.2, (rng() - 0.5) * 0.2, (rng() - 0.5) * 0.2);
          grp.add(star);
        }
        return grp;
      }
      case 'cloud': {
        const grp = new THREE.Group();
        const ptMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2 });
        for (let j = 0; j < 5; j++) {
          const pt = new THREE.Mesh(new THREE.SphereGeometry(0.018, 4, 4), ptMat);
          pt.position.set((rng() - 0.5) * 0.18, (rng() - 0.5) * 0.12, (rng() - 0.5) * 0.18);
          grp.add(pt);
        }
        return grp;
      }
      case 'network':
      case 'ecosystem': {
        const grp = new THREE.Group();
        const nodeMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25 });
        const pts = [];
        for (let j = 0; j < 4; j++) {
          const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.02, 5, 5), nodeMat);
          const p = new THREE.Vector3((rng() - 0.5) * 0.2, (rng() - 0.5) * 0.15, (rng() - 0.5) * 0.2);
          sphere.position.copy(p);
          pts.push(p);
          grp.add(sphere);
        }
        const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.12 });
        for (let j = 0; j < pts.length; j++) {
          for (let k = j + 1; k < pts.length; k++) {
            const line = new THREE.Line(
              new THREE.BufferGeometry().setFromPoints([pts[j], pts[k]]),
              lineMat
            );
            grp.add(line);
          }
        }
        return grp;
      }
      case 'exchange':
      case 'market': {
        const grp = new THREE.Group();
        const curveMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.2 });
        const pts1 = [];
        const pts2 = [];
        for (let j = 0; j <= 6; j++) {
          const x = -0.06 + j * 0.02;
          pts1.push(new THREE.Vector3(x, 0.02 + j * 0.008, 0));
          pts2.push(new THREE.Vector3(x, 0.06 - j * 0.008, 0));
        }
        grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts1), curveMat));
        grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), curveMat));
        return grp;
      }
      case 'archive':
      case 'framework':
      case 'growth': {
        const size = 0.06 + rng() * 0.04;
        const geo = new THREE.BoxGeometry(size, size * 0.7, 0.005);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.z = rng() * 0.5;
        return mesh;
      }
      case 'silhouette': {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.08);
        shape.bezierCurveTo(0.03, 0.08, 0.03, 0.05, 0.025, 0.03);
        shape.lineTo(0.02, -0.04);
        shape.bezierCurveTo(0.03, -0.06, 0.02, -0.08, 0, -0.08);
        shape.bezierCurveTo(-0.02, -0.08, -0.03, -0.06, -0.02, -0.04);
        shape.lineTo(-0.025, 0.03);
        shape.bezierCurveTo(-0.03, 0.05, -0.03, 0.08, 0, 0.08);
        const geo = new THREE.ShapeGeometry(shape);
        const figMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
        return new THREE.Mesh(geo, figMat);
      }
      case 'pathways':
      case 'fragment':
      case 'dialogue':
      case 'institution':
      case 'cartography':
      case 'oration':
      default: {
        const size = 0.06 + rng() * 0.04;
        const geo = new THREE.PlaneGeometry(size, size * 0.7);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
        return mesh;
      }
    }
  }

  _buildHitbox() {
    // Invisible hitbox for easier clicking — extends above book to cover label area
    const hitboxW = this.W * 1.5;
    const hitboxH = this.H * 4.0;
    const hitboxD = this.D * 1.4;
    const geo = new THREE.BoxGeometry(hitboxW, hitboxH, hitboxD);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.hitbox = new THREE.Mesh(geo, mat);
    this.hitbox.userData._isHitbox = true;
    // Position: extends upward to cover label area, downward for book body
    this.hitbox.position.set(0, this.H * 2.5, 0);
    this.group.add(this.hitbox);
  }

  _buildLabel() {
    const div = document.createElement('div');
    div.className = 'subject-label';

    const inner = document.createElement('div');
    inner.className = 'subject-label-inner';
    inner.textContent = this.subject.title;
    div.appendChild(inner);

    const tagline = document.createElement('div');
    tagline.className = 'subject-tagline';
    tagline.textContent = this.subject.tagline;
    div.appendChild(tagline);

    this.label = new CSS2DObject(div);
    this.label.position.set(0, this.H * 1.2 + 1.0, 0);
    this.group.add(this.label);

    this.labelEl = div;
  }

  // --- Public API ---

  setHover(active) {
    this.targetHover = active ? 1 : 0;
  }

  setDim(amount) {
    this.targetDim = amount;
  }

  open(progress) {
    this.openProgress = Math.max(0, Math.min(1, progress));
    // Cover rotation: 0 to -2.3 radians (~132 degrees)
    const easedOpen = _easeOutCubic(this.openProgress);
    this.coverPivot.rotation.z = -easedOpen * 2.3;

    // Warm light intensity follows opening
    this.warmLight.intensity = this.openProgress * 0.6;
    this.pageGlow.material.opacity = this.openProgress * 0.15;

    this.isOpen = this.openProgress > 0.5;
  }

  close() {
    this.openProgress = 0;
    this.coverPivot.rotation.z = 0;
    this.warmLight.intensity = 0;
    this.pageGlow.material.opacity = 0;
    this.isOpen = false;
  }

  getLabelEl() {
    return this.labelEl;
  }

  update(dt, time) {
    this._time += dt;

    // Sync CSS2D label visibility with group
    if (this.label) {
      this.label.visible = this.group.visible;
    }
    if (!this.group.visible) return;

    // Floating animation
    const floatY = Math.sin(time * this._floatSpeed + this._floatPhase) * this._floatAmp;
    const floatRotY = Math.sin(time * this._rotSpeed + this._floatPhase) * this._rotAmp;
    const floatRotX = Math.cos(time * this._rotSpeed * 0.7 + this._floatPhase) * this._rotAmp * 0.6;

    this.group.position.y = this.subject.position.y + floatY;
    this.group.rotation.y = this._baseRotY + floatRotY;
    this.group.rotation.x = this._baseRotX + floatRotX;

    // Hover lerp
    this.hoverIntensity += (this.targetHover - this.hoverIntensity) * 0.08;
    // Slight upward movement on hover
    this.group.position.y += this.hoverIntensity * 0.15;

    // Dim lerp
    this.dimAmount += (this.targetDim - this.dimAmount) * 0.04;

    // Apply dim to materials
    const dimOpacity = 1 - this.dimAmount * 0.65;
    this._applyOpacity(this.group, dimOpacity);

    // Hover: accent emissive boost
    const hoverGlow = this.hoverIntensity * 0.15;
    this.warmLight.intensity = Math.max(this.warmLight.intensity, hoverGlow * 0.2);

    // Label visibility
    if (this.labelEl) {
      const labelOpacity = 1 - this.dimAmount * 0.8;
      this.labelEl.style.opacity = labelOpacity;
      if (this.hoverIntensity > 0.3 || this.dimAmount < 0.3) {
        if (this.hoverIntensity > 0.5) {
          this.labelEl.classList.add('tagline-visible');
        } else {
          this.labelEl.classList.remove('tagline-visible');
        }
      }
    }

    // Micro elements animation
    this.microGroup.children.forEach(el => {
      el.position.y = (el.userData.baseY || 0) + Math.sin(time * (el.userData.floatSpeed || 0.3) + (el.userData.floatPhase || 0)) * 0.05;
      el.rotation.y += (el.userData.rotSpeed || 0.1) * dt;
      el.rotation.x += (el.userData.rotSpeed || 0.1) * 0.5 * dt;
    });
  }

  _applyOpacity(obj, opacity) {
    obj.traverse(child => {
      if (child.isMesh && child.material && !child.userData._origOpacity) {
        if (!child.userData._opacityInit) {
          child.userData._origOpacity = child.material.opacity || 1;
          child.userData._opacityInit = true;
          if (!child.material.transparent) {
            child.material.transparent = true;
          }
        }
        child.material.opacity = child.userData._origOpacity * opacity;
      }
    });
  }

  // Get world position of book center (for camera targeting)
  getWorldPosition(target) {
    return this.group.getWorldPosition(target);
  }

  // Get position to view the book from (camera position when focusing)
  getViewPosition(target) {
    const wp = new THREE.Vector3();
    this.group.getWorldPosition(wp);
    target.set(wp.x, wp.y + 2.5, wp.z + 3.5);
    return target;
  }

  // Get close-up position (for diving into book)
  getDivePosition(target) {
    const wp = new THREE.Vector3();
    this.group.getWorldPosition(wp);
    target.set(wp.x, wp.y + 0.3, wp.z + 0.5);
    return target;
  }

  dispose() {
    this.group.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
  }
}

// --- Module-level helpers ---
function _seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function _easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
