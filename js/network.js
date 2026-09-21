// ============================================================
// MIND ATLAS — Knowledge Network
// Thin connection lines + slow flowing light particles
// ============================================================

import * as THREE from 'three';

export class KnowledgeNetwork {
  constructor(subjects, scene) {
    this.subjects = subjects;
    this.scene = scene;
    this.group = new THREE.Group();
    this.lines = [];
    this.particles = [];
    this.hoveredId = null;
    this._time = 0;

    this._buildLines();
    this._buildParticles();

    this.scene.add(this.group);
  }

  _getKey(a, b) {
    return a < b ? `${a}|${b}` : `${b}|${a}`;
  }

  _buildLines() {
    const created = new Set();

    for (const subject of this.subjects) {
      for (const connId of subject.connections) {
        const key = this._getKey(subject.id, connId);
        if (created.has(key)) continue;
        created.add(key);

        const other = this.subjects.find(s => s.id === connId);
        if (!other) continue;

        // Slightly curved line for organic feel
        const p1 = new THREE.Vector3(subject.position.x, subject.position.y, subject.position.z);
        const p2 = new THREE.Vector3(other.position.x, other.position.y, other.position.z);
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        const curveOffset = mid.clone();
        curveOffset.normalize();
        mid.add(curveOffset.multiplyScalar(3));

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        const points = curve.getPoints(24);

        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color: 0x8a7430,
          transparent: true,
          opacity: 0.1,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const line = new THREE.Line(geo, mat);
        line.userData = {
          subjectA: subject.id,
          subjectB: connId,
          baseOpacity: 0.1,
          curve: curve,
          points: points
        };
        this.lines.push(line);
        this.group.add(line);
      }
    }
  }

  _buildParticles() {
    // Create flowing light particles along random connections
    const particleCount = Math.min(this.lines.length, 30);
    const particleGeo = new THREE.SphereGeometry(0.025, 6, 6);

    for (let i = 0; i < particleCount; i++) {
      const line = this.lines[Math.floor(Math.random() * this.lines.length)];
      const mat = new THREE.MeshBasicMaterial({
        color: 0xc9a84c,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const particle = new THREE.Mesh(particleGeo, mat);
      particle.userData = {
        line: line,
        progress: Math.random(),
        speed: 0.02 + Math.random() * 0.03,
        baseOpacity: 0.4
      };
      this.particles.push(particle);
      this.group.add(particle);
    }
  }

  setHover(subjectId) {
    this.hoveredId = subjectId;
  }

  setAllVisible(visible) {
    this.group.visible = visible;
  }

  setDim(amount) {
    for (const line of this.lines) {
      line.userData.baseOpacity = (1 - amount) * 0.1;
    }
    for (const p of this.particles) {
      p.userData.baseOpacity = (1 - amount) * 0.4;
    }
  }

  update(dt) {
    this._time += dt;

    // Update line opacities based on hover
    for (const line of this.lines) {
      const isRelated = this.hoveredId &&
        (line.userData.subjectA === this.hoveredId ||
         line.userData.subjectB === this.hoveredId);

      const target = isRelated ? 0.4 : line.userData.baseOpacity;
      const current = line.material.opacity;
      line.material.opacity = current + (target - current) * 0.05;

      // Subtle pulsing for related lines
      if (isRelated) {
        line.material.opacity *= 0.9 + 0.1 * Math.sin(this._time * 2);
      }
    }

    // Update particle positions
    for (const p of this.particles) {
      p.userData.progress += p.userData.speed * dt;
      if (p.userData.progress > 1) p.userData.progress = 0;

      const point = p.userData.line.userData.curve.getPoint(p.userData.progress);
      p.position.copy(point);

      // Visibility based on connection relevance
      const line = p.userData.line;
      const isRelated = this.hoveredId &&
        (line.userData.subjectA === this.hoveredId ||
         line.userData.subjectB === this.hoveredId);

      const targetOp = isRelated ? 0.8 : p.userData.baseOpacity;
      p.material.opacity += (targetOp - p.material.opacity) * 0.05;
    }
  }

  dispose() {
    this.group.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  }
}
