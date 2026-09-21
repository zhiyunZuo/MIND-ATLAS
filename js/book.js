// ============================================================
// MIND ATLAS — 3D Book Model
// Refined book geometry: layered pages, curved spine,
// floating paper pieces, page-flutter animation
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

    // Refined dimensions — taller, more book-like
    this.W = 2.4;
    this.H = 0.52;
    this.D = 3.2;
    this.coverThick = 0.04;
    this.pageCount = 24;

    this._buildPages();
    this._buildCovers();
    this._buildSpine();
    this._buildAccentLines();
    this._buildWarmLight();
    this._buildBookmark();
    this._buildFloatingPapers();
    this._buildMicroElements();
    this._buildHitbox();
    this._buildLabel();

    this.group.position.set(subject.position.x, subject.position.y, subject.position.z);
    this._baseRotY = (Math.sin(subject.id.length * 7.3) * 0.25);
    this._baseRotX = (Math.cos(subject.id.length * 5.1) * 0.12);
    this._baseRotZ = (Math.sin(subject.id.length * 3.7) * 0.08);
    this.group.rotation.set(this._baseRotX, this._baseRotY, this._baseRotZ);

    const f = subject.float;
    this._floatAmp = f.amp;
    this._floatSpeed = f.speed;
    this._floatPhase = f.phase;
    this._rotAmp = f.rotAmp;
    this._rotSpeed = f.rotSpeed;

    this._time = 0;
  }

  // --- Layered page stack with visible edges on three sides ---
  _buildPages() {
    this.pageGroup = new THREE.Group();
    this.pageMeshes = [];

    const pageMat = new THREE.MeshStandardMaterial({
      color: this.colors.page,
      roughness: 0.96,
      metalness: 0.0
    });

    const pageThickness = (this.H - this.coverThick * 2) / this.pageCount;
    for (let i = 0; i < this.pageCount; i++) {
      const y = -this.H / 2 + this.coverThick + i * pageThickness + pageThickness / 2;
      const geo = new THREE.BoxGeometry(this.W * 0.93, pageThickness, this.D * 0.94);
      const mesh = new THREE.Mesh(geo, pageMat);
      mesh.position.y = y;
      mesh.userData.baseY = y;
      mesh.userData.pageIndex = i;
      this.pageMeshes.push(mesh);
      this.pageGroup.add(mesh);
    }
    this.group.add(this.pageGroup);

    // Page edge lines — visible horizontal striations on the sides
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xb0a890,
      transparent: true,
      opacity: 0.12
    });
    // Right edge
    const rightEdgePts = [];
    for (let i = 0; i <= this.pageCount; i++) {
      const y = -this.H / 2 + this.coverThick + i * pageThickness;
      rightEdgePts.push(new THREE.Vector3(this.W * 0.465, y, -this.D * 0.47));
      rightEdgePts.push(new THREE.Vector3(this.W * 0.465, y, this.D * 0.47));
    }
    // Left edge (spine side is covered, so skip)
    // Front edge
    const frontEdgePts = [];
    for (let i = 0; i <= this.pageCount; i++) {
      const y = -this.H / 2 + this.coverThick + i * pageThickness;
      frontEdgePts.push(new THREE.Vector3(-this.W * 0.465, y, this.D * 0.47));
      frontEdgePts.push(new THREE.Vector3(this.W * 0.465, y, this.D * 0.47));
    }
    // Back edge
    const backEdgePts = [];
    for (let i = 0; i <= this.pageCount; i++) {
      const y = -this.H / 2 + this.coverThick + i * pageThickness;
      backEdgePts.push(new THREE.Vector3(-this.W * 0.465, y, -this.D * 0.47));
      backEdgePts.push(new THREE.Vector3(this.W * 0.465, y, -this.D * 0.47));
    }

    const rightEdgeGeo = new THREE.BufferGeometry().setFromPoints(rightEdgePts);
    this.pageGroup.add(new THREE.LineSegments(rightEdgeGeo, edgeMat));

    const frontEdgeGeo = new THREE.BufferGeometry().setFromPoints(frontEdgePts);
    this.pageGroup.add(new THREE.LineSegments(frontEdgeGeo, edgeMat));

    const backEdgeGeo = new THREE.BufferGeometry().setFromPoints(backEdgePts);
    this.pageGroup.add(new THREE.LineSegments(backEdgeGeo, edgeMat));
  }

  _buildCovers() {
    const coverGeo = new THREE.BoxGeometry(this.W, this.coverThick, this.D);
    const coverMat = new THREE.MeshStandardMaterial({
      color: this.colors.cover,
      roughness: 0.55,
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

    // Cover decoration: inner border
    const borderGeo = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(this.W * 0.82, 0.001, this.D * 0.82)
    );
    const borderMat = new THREE.LineBasicMaterial({
      color: this.colors.accent,
      transparent: true,
      opacity: 0.2
    });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.position.set(this.W / 2, this.coverThick / 2 + 0.001, 0);
    this.frontCover.add(border);

    // Second inner border for refinement
    const border2Geo = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(this.W * 0.72, 0.001, this.D * 0.72)
    );
    const border2 = new THREE.LineSegments(border2Geo, borderMat.clone());
    border2.material.opacity = 0.1;
    border2.position.set(this.W / 2, this.coverThick / 2 + 0.001, 0);
    this.frontCover.add(border2);
  }

  _buildSpine() {
    // Slightly curved spine using a thin box with rounded profile
    const spineGeo = new THREE.BoxGeometry(0.04, this.H + this.coverThick * 2, this.D);
    const spineMat = new THREE.MeshStandardMaterial({
      color: this.colors.spine,
      roughness: 0.62,
      metalness: 0.2
    });
    this.spine = new THREE.Mesh(spineGeo, spineMat);
    this.spine.position.set(-this.W / 2 - 0.015, 0, 0);
    this.group.add(this.spine);

    // Spine bands — two thin gold lines on the spine
    const bandGeo = new THREE.BoxGeometry(0.045, 0.008, this.D * 0.15);
    const bandMat = new THREE.MeshStandardMaterial({
      color: this.colors.accent,
      roughness: 0.3,
      metalness: 0.8,
      emissive: this.colors.accent,
      emissiveIntensity: 0.03
    });
    const band1 = new THREE.Mesh(bandGeo, bandMat);
    band1.position.set(-this.W / 2 - 0.02, this.H * 0.28, 0);
    this.group.add(band1);

    const band2 = new THREE.Mesh(bandGeo, bandMat.clone());
    band2.position.set(-this.W / 2 - 0.02, -this.H * 0.28, 0);
    this.group.add(band2);
  }

  _buildAccentLines() {
    // Gold accent line near edges of front cover
    const accentGeo = new THREE.BoxGeometry(0.01, 0.001, this.D * 0.86);
    const accentMat = new THREE.MeshStandardMaterial({
      color: this.colors.accent,
      roughness: 0.3,
      metalness: 0.7,
      emissive: this.colors.accent,
      emissiveIntensity: 0.04
    });
    const accent1 = new THREE.Mesh(accentGeo, accentMat);
    accent1.position.set(this.W * 0.35, this.coverThick / 2 + 0.002, 0);
    this.frontCover.add(accent1);

    const accent2 = new THREE.Mesh(accentGeo, accentMat.clone());
    accent2.position.set(-this.W * 0.35, this.coverThick / 2 + 0.002, 0);
    this.frontCover.add(accent2);
  }

  _buildWarmLight() {
    this.warmLight = new THREE.PointLight(0xd4a868, 0, 3, 2);
    this.warmLight.position.set(0, 0, 0);
    this.group.add(this.warmLight);

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

  _buildBookmark() {
    // A thin ribbon bookmark hanging from the top
    const ribbonGeo = new THREE.PlaneGeometry(0.08, this.D * 0.6);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: this.colors.accent,
      roughness: 0.4,
      metalness: 0.3,
      emissive: this.colors.accent,
      emissiveIntensity: 0.06,
      side: THREE.DoubleSide
    });
    this.bookmark = new THREE.Mesh(ribbonGeo, ribbonMat);
    this.bookmark.position.set(this.W * 0.2, -this.H * 0.05, this.D * 0.1);
    this.bookmark.rotation.x = Math.PI / 2;
    this.bookmark.userData.baseRotX = this.bookmark.rotation.x;
    this.group.add(this.bookmark);
  }

  // --- Small paper pieces that float around the book ---
  _buildFloatingPapers() {
    this.floatingPapers = [];
    const rng = _seededRng(this.subject.id.charCodeAt(0) * 13 + this.subject.id.charCodeAt(1));
    const count = 3 + Math.floor(rng() * 2);

    for (let i = 0; i < count; i++) {
      const w = 0.12 + rng() * 0.1;
      const h = 0.16 + rng() * 0.1;
      const geo = new THREE.PlaneGeometry(w, h);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xe8dcc8,
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        emissive: 0x3a3020,
        emissiveIntensity: 0.02
      });
      const paper = new THREE.Mesh(geo, mat);

      const angle = (i / count) * Math.PI * 2 + rng() * 1.5;
      const dist = 1.0 + rng() * 0.8;
      paper.userData.basePos = new THREE.Vector3(
        Math.cos(angle) * dist,
        (rng() - 0.3) * 0.6,
        Math.sin(angle) * dist
      );
      paper.userData.floatPhase = rng() * Math.PI * 2;
      paper.userData.floatSpeed = 0.15 + rng() * 0.25;
      paper.userData.floatAmp = 0.06 + rng() * 0.08;
      paper.userData.rotSpeed = new THREE.Vector3(
        (rng() - 0.5) * 0.3,
        (rng() - 0.5) * 0.3,
        (rng() - 0.5) * 0.2
      );
      paper.userData.baseRot = new THREE.Euler(
        rng() * Math.PI,
        rng() * Math.PI,
        rng() * Math.PI
      );
      paper.position.copy(paper.userData.basePos);
      paper.rotation.copy(paper.userData.baseRot);

      this.group.add(paper);
      this.floatingPapers.push(paper);
    }
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
    const hitboxW = this.W * 2.2;
    const hitboxH = this.H * 6.0;
    const hitboxD = this.D * 1.5;
    const geo = new THREE.BoxGeometry(hitboxW, hitboxH, hitboxD);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    this.hitbox = new THREE.Mesh(geo, mat);
    this.hitbox.userData._isHitbox = true;
    this.hitbox.position.set(0, this.H * 3.5, 0);
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
    const easedOpen = _easeOutCubic(this.openProgress);
    this.coverPivot.rotation.z = -easedOpen * 2.3;

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
    this.group.position.y += this.hoverIntensity * 0.15;

    // Dim lerp
    this.dimAmount += (this.targetDim - this.dimAmount) * 0.04;
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

    // Page flutter: top few pages wave slightly
    const flutterCount = Math.min(4, this.pageMeshes.length);
    for (let i = 0; i < flutterCount; i++) {
      const pm = this.pageMeshes[this.pageMeshes.length - 1 - i];
      const flutterY = Math.sin(time * 0.8 + i * 0.5) * 0.003 * (i + 1) * 0.5;
      const flutterZ = Math.cos(time * 0.6 + i * 0.7) * 0.004 * (i + 1) * 0.3;
      pm.position.y = pm.userData.baseY + flutterY;
      pm.position.z = flutterZ;
      // Slight rotation for paper bending
      pm.rotation.z = Math.sin(time * 0.5 + i) * 0.003 * (i + 1);
    }

    // Bookmark gentle sway
    if (this.bookmark) {
      this.bookmark.rotation.x = this.bookmark.userData.baseRotX + Math.sin(time * 0.7) * 0.04;
      this.bookmark.rotation.z = Math.cos(time * 0.5) * 0.03;
    }

    // Floating papers drift around the book
    for (const paper of this.floatingPapers) {
      const u = paper.userData;
      paper.position.x = u.basePos.x + Math.sin(time * u.floatSpeed + u.floatPhase) * 0.08;
      paper.position.y = u.basePos.y + Math.sin(time * u.floatSpeed * 1.3 + u.floatPhase) * u.floatAmp;
      paper.position.z = u.basePos.z + Math.cos(time * u.floatSpeed * 0.9 + u.floatPhase) * 0.08;

      paper.rotation.x = u.baseRot.x + time * u.rotSpeed.x;
      paper.rotation.y = u.baseRot.y + time * u.rotSpeed.y;
      paper.rotation.z = u.baseRot.z + time * u.rotSpeed.z * 0.5;
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
      if (child.isMesh && child.material && !child.userData._isHitbox) {
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

  getWorldPosition(target) {
    return this.group.getWorldPosition(target);
  }

  getViewPosition(target) {
    const wp = new THREE.Vector3();
    this.group.getWorldPosition(wp);
    target.set(wp.x, wp.y + 2.5, wp.z + 3.5);
    return target;
  }

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
