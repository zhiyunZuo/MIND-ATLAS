// ============================================================
// MIND ATLAS — Book World
// Per-subject 3D space with topic nodes, ambient elements
// ============================================================

import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class BookWorld {
  constructor(subject, labelContainer) {
    this.subject = subject;
    this.labelContainer = labelContainer;
    this.group = new THREE.Group();
    this.topicObjects = [];
    this.ambientPoints = null;
    this.titleLabel = null;
    this._time = 0;

    this._buildAmbient();
    this._buildTitle();
    this._buildTopicNodes();
  }

  _buildAmbient() {
    const accent = this.subject.bookStyle.accent;

    // Subtle particle field
    const count = 200;
    const positions = new Float32Array(count * 3);
    const rng = _seededRng(this.subject.id.charCodeAt(0) * 17);

    for (let i = 0; i < count; i++) {
      const r = 8 + rng() * 25;
      const theta = rng() * Math.PI * 2;
      const phi = (rng() - 0.5) * Math.PI * 0.8;
      positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.sin(phi);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: accent,
      size: 0.04,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.ambientPoints = new THREE.Points(geo, mat);
    this.group.add(this.ambientPoints);

    // A few larger ambient elements based on theme
    this._buildAmbientShapes(accent, rng);
  }

  _buildAmbientShapes(color, rng) {
    const theme = this.subject.micro;
    const shapeGroup = new THREE.Group();
    const shapeCount = 6;

    for (let i = 0; i < shapeCount; i++) {
      const shape = this._createAmbientShape(theme, color, rng);
      if (shape) {
        const r = 6 + rng() * 12;
        const theta = rng() * Math.PI * 2;
        const phi = (rng() - 0.5) * 1.2;
        shape.position.set(
          r * Math.cos(theta) * Math.cos(phi),
          r * Math.sin(phi),
          r * Math.sin(theta) * Math.cos(phi)
        );
        shape.userData.baseY = shape.position.y;
        shape.userData.floatPhase = rng() * Math.PI * 2;
        shape.userData.floatSpeed = 0.1 + rng() * 0.15;
        shape.userData.rotSpeed = (rng() - 0.5) * 0.1;
        shapeGroup.add(shape);
      }
    }

    this.ambientShapes = shapeGroup;
    this.group.add(shapeGroup);
  }

  _createAmbientShape(theme, color, rng) {
    const opacity = 0.08 + rng() * 0.06;
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const size = 0.15 + rng() * 0.25;

    switch (theme) {
      case 'geometric':
      case 'framework': {
        const geo = new THREE.TetrahedronGeometry(size);
        return new THREE.Mesh(geo, mat);
      }
      case 'manuscript':
      case 'archive':
      case 'oration': {
        const w = size * 0.8;
        const h = size * 1.2;
        const geo = new THREE.PlaneGeometry(w, h);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
        return mesh;
      }
      case 'neural':
      case 'network':
      case 'ecosystem': {
        const grp = new THREE.Group();
        const sphereMat = mat.clone();
        sphereMat.opacity = opacity * 2;
        for (let j = 0; j < 3; j++) {
          const s = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 6, 6),
            sphereMat
          );
          s.position.set((rng() - 0.5) * size, (rng() - 0.5) * size, (rng() - 0.5) * size);
          grp.add(s);
        }
        return grp;
      }
      case 'strategy': {
        const geo = new THREE.BoxGeometry(size, 0.01, size);
        return new THREE.Mesh(geo, mat);
      }
      case 'starmap':
      case 'cloud': {
        const grp = new THREE.Group();
        for (let j = 0; j < 4; j++) {
          const s = new THREE.Mesh(
            new THREE.SphereGeometry(0.02 + rng() * 0.02, 4, 4),
            mat.clone()
          );
          s.position.set((rng() - 0.5) * size, (rng() - 0.5) * size, (rng() - 0.5) * size);
          grp.add(s);
        }
        return grp;
      }
      default: {
        const geo = new THREE.PlaneGeometry(size, size * 0.7);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
        return mesh;
      }
    }
  }

  _buildTitle() {
    const div = document.createElement('div');
    div.className = 'book-world-title';

    const main = document.createElement('div');
    main.className = 'book-world-title-main';
    main.textContent = this.subject.title;
    div.appendChild(main);

    const sub = document.createElement('div');
    sub.className = 'book-world-title-sub';
    sub.textContent = this.subject.tagline;
    div.appendChild(sub);

    this.titleLabel = new CSS2DObject(div);
    this.titleLabel.position.set(0, 3.5, 0);
    this.group.add(this.titleLabel);
    this.titleLabelEl = div;
  }

  _buildTopicNodes() {
    const topics = this.subject.topics;
    const count = topics.length;
    const accent = this.subject.bookStyle.accent;
    const coverColor = this.subject.bookStyle.cover;
    const pageColor = this.subject.bookStyle.page;

    for (let i = 0; i < count; i++) {
      const topic = topics[i];

      // Spherical distribution with variation
      const goldenAngle = 2.39996;
      const t = i / count;
      const y = 1 - t * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = goldenAngle * i + this.subject.id.charCodeAt(0) * 0.1;

      const dist = 2.8 + (i % 3) * 0.8;
      const x = Math.cos(angle) * radius * dist;
      const z = Math.sin(angle) * radius * dist;
      const yPos = y * (1.5 + (i % 2) * 0.5);

      const node = this._createTopicNode(topic, accent, coverColor, pageColor, i);
      node.position.set(x, yPos, z);
      node.userData.baseY = yPos;
      node.userData.floatPhase = (i / count) * Math.PI * 2;
      node.userData.floatSpeed = 0.2 + (i % 5) * 0.06;
      node.userData.rotSpeed = 0.05 + (i % 3) * 0.03;
      node.userData.topic = topic;
      node.userData.subjectId = this.subject.id;

      // Label
      const div = document.createElement('div');
      div.className = 'topic-label';
      const inner = document.createElement('div');
      inner.className = 'topic-label-inner';
      inner.textContent = topic.title;
      div.appendChild(inner);

      const label = new CSS2DObject(div);
      label.position.set(0, 0.4, 0);
      node.add(label);
      node.userData.labelEl = div;

      this.topicObjects.push(node);
      this.group.add(node);
    }
  }

  _createTopicNode(topic, accent, coverColor, pageColor, index) {
    const group = new THREE.Group();

    // Create a small floating book or bookmark
    const nodeType = index % 3; // Vary types
    const scale = 0.22;

    if (nodeType === 0) {
      // Mini book
      const bodyGeo = new THREE.BoxGeometry(0.4 * scale, 0.08 * scale, 0.3 * scale);
      const pageMat = new THREE.MeshStandardMaterial({
        color: pageColor,
        roughness: 0.9
      });
      const body = new THREE.Mesh(bodyGeo, pageMat);
      group.add(body);

      const coverGeo = new THREE.BoxGeometry(0.42 * scale, 0.01 * scale, 0.32 * scale);
      const coverMat = new THREE.MeshStandardMaterial({
        color: coverColor,
        roughness: 0.6,
        metalness: 0.2
      });
      const cover = new THREE.Mesh(coverGeo, coverMat);
      cover.position.y = 0.045 * scale;
      group.add(cover);

    } else if (nodeType === 1) {
      // Bookmark / paper fragment
      const geo = new THREE.PlaneGeometry(0.15 * scale, 0.4 * scale);
      const mat = new THREE.MeshStandardMaterial({
        color: pageColor,
        roughness: 0.85,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      group.add(mesh);

      // Accent edge
      const edgeGeo = new THREE.PlaneGeometry(0.15 * scale, 0.02 * scale);
      const edgeMat = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.rotation.x = Math.PI / 2;
      edge.position.y = 0.2 * scale;
      group.add(edge);

    } else {
      // Small glowing orb (concept fragment)
      const geo = new THREE.IcosahedronGeometry(0.1 * scale, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: accent,
        roughness: 0.3,
        metalness: 0.5,
        emissive: accent,
        emissiveIntensity: 0.1
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Wireframe overlay
      const wireGeo = new THREE.IcosahedronGeometry(0.12 * scale, 0);
      const wireMat = new THREE.MeshBasicMaterial({
        color: accent,
        wireframe: true,
        transparent: true,
        opacity: 0.15
      });
      group.add(new THREE.Mesh(wireGeo, wireMat));
    }

    return group;
  }

  getTopicObjects() {
    return this.topicObjects;
  }

  getCenter() {
    return new THREE.Vector3(0, 0, 0);
  }

  update(dt, time) {
    this._time += dt;

    // Ambient points slow rotation
    if (this.ambientPoints) {
      this.ambientPoints.rotation.y += dt * 0.02;
    }

    // Ambient shapes floating
    if (this.ambientShapes) {
      this.ambientShapes.children.forEach(shape => {
        shape.position.y = (shape.userData.baseY || 0) +
          Math.sin(time * (shape.userData.floatSpeed || 0.2) + (shape.userData.floatPhase || 0)) * 0.15;
        shape.rotation.y += (shape.userData.rotSpeed || 0.05) * dt;
        shape.rotation.x += (shape.userData.rotSpeed || 0.05) * 0.5 * dt;
      });
    }

    // Title label subtle float
    if (this.titleLabel) {
      this.titleLabel.position.y = 3.5 + Math.sin(time * 0.3) * 0.08;
    }

    // Topic nodes floating
    this.topicObjects.forEach(node => {
      node.position.y = (node.userData.baseY || 0) +
        Math.sin(time * (node.userData.floatSpeed || 0.2) + (node.userData.floatPhase || 0)) * 0.12;
      node.rotation.y += (node.userData.rotSpeed || 0.05) * dt;

      // Subtle rotation
      node.rotation.x = Math.sin(time * 0.15 + (node.userData.floatPhase || 0)) * 0.05;
    });
  }

  show() {
    this.group.visible = true;
  }

  hide() {
    this.group.visible = false;
  }

  dispose() {
    // Remove labels from DOM
    if (this.titleLabelEl && this.titleLabelEl.parentNode) {
      this.titleLabelEl.parentNode.removeChild(this.titleLabelEl);
    }
    this.topicObjects.forEach(node => {
      if (node.userData.labelEl && node.userData.labelEl.parentNode) {
        node.userData.labelEl.parentNode.removeChild(node.userData.labelEl);
      }
    });

    this.group.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
  }
}

function _seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
