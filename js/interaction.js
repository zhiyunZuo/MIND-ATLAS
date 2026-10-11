// ============================================================
// MIND ATLAS — Interaction Manager
// Raycasting hover, click selection, touch support
// ============================================================

import * as THREE from 'three';

export class InteractionManager {
  constructor(camera, domElement, books, network) {
    this.camera = camera;
    this.dom = domElement;
    this.books = books;
    this.network = network;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.hoveredBook = null;
    this.onBookClick = null;
    this.onTopicClick = null;
    this.topicObjects = [];
    this.enabled = true;
    this._touchStartTime = 0;
    this._touchStartPos = { x: 0, y: 0 };
    this._isTouch = false;

    this._bindEvents();
  }

  setTopicObjects(objs) {
    this.topicObjects = objs || [];
  }

  clearTopicObjects() {
    this.topicObjects = [];
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  _bindEvents() {
    this.dom.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: true });
    this.dom.addEventListener('click', this._onClick.bind(this));
    this.dom.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: true });
    this.dom.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: true });
  }

  _getPointer(e) {
    const rect = this.dom.getBoundingClientRect();
    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    this.pointer.x = ((x - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((y - rect.top) / rect.height) * 2 + 1;
  }

  _onPointerMove(e) {
    if (!this.enabled) return;
    this._getPointer(e);
    this._raycastHover();
  }

  _raycastHover() {
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // Check books
    const bookMeshes = [];
    for (const book of this.books) {
      if (book.group.visible) {
        book.group.traverse(child => {
          if (child.isMesh) {
            child.userData._bookRef = book;
            bookMeshes.push(child);
          }
        });
      }
    }

    const bookHits = this.raycaster.intersectObjects(bookMeshes, false);

    // Check topic objects
    const topicMeshes = this.topicObjects.flatMap(obj => {
      const meshes = [];
      obj.traverse(child => {
        if (child.isMesh) {
          child.userData._topicRef = obj.userData.topic;
          meshes.push(child);
        }
      });
      return meshes;
    });

    const topicHits = this.raycaster.intersectObjects(topicMeshes, false);

    // Determine closest hit
    let hit = null;
    let hitType = null;
    if (bookHits.length > 0 && (topicHits.length === 0 || bookHits[0].distance < topicHits[0].distance)) {
      hit = bookHits[0].object.userData._bookRef;
      hitType = 'book';
    } else if (topicHits.length > 0) {
      hit = topicHits[0].object.userData._topicRef;
      hitType = 'topic';
    }

    if (hitType === 'book') {
      if (this.hoveredBook !== hit) {
        if (this.hoveredBook) this.hoveredBook.setHover(false);
        this.hoveredBook = hit;
        hit.setHover(true);
        if (this.network) this.network.setHover(hit.subject.id);
        this.dom.style.cursor = 'pointer';
      }
    } else if (hitType === 'topic') {
      // Topic hover
      if (this.hoveredBook) {
        this.hoveredBook.setHover(false);
        this.hoveredBook = null;
      }
      this.network && this.network.setHover(null);
      this.dom.style.cursor = 'pointer';
      if (hit && hit.onHover) hit.onHover(true);
    } else {
      if (this.hoveredBook) {
        this.hoveredBook.setHover(false);
        this.hoveredBook = null;
      }
      if (this.network) this.network.setHover(null);
      this.dom.style.cursor = 'grab';
    }
  }

  _onClick(e) {
    if (!this.enabled) return;
    this._getPointer(e);
    this._raycastClick();
  }

  _raycastClick() {
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // Check books
    const bookMeshes = [];
    for (const book of this.books) {
      if (book.group.visible) {
        book.group.traverse(child => {
          if (child.isMesh) {
            child.userData._bookRef = book;
            bookMeshes.push(child);
          }
        });
      }
    }
    const bookHits = this.raycaster.intersectObjects(bookMeshes, false);

    // Check topic objects
    const topicMeshes = this.topicObjects.flatMap(obj => {
      const meshes = [];
      obj.traverse(child => {
        if (child.isMesh) {
          child.userData._topicRef = obj;
          meshes.push(child);
        }
      });
      return meshes;
    });
    const topicHits = this.raycaster.intersectObjects(topicMeshes, false);

    if (bookHits.length > 0 && (topicHits.length === 0 || bookHits[0].distance < topicHits[0].distance)) {
      const book = bookHits[0].object.userData._bookRef;
      if (this.onBookClick) this.onBookClick(book);
    } else if (topicHits.length > 0) {
      const topicObj = topicHits[0].object.userData._topicRef;
      if (topicObj && topicObj.userData.topic && this.onTopicClick) {
        this.onTopicClick(topicObj.userData.topic);
      }
    }
  }

  _onTouchStart(e) {
    if (!this.enabled) return;
    this._isTouch = true;
    if (e.touches.length === 1) {
      this._touchStartTime = Date.now();
      this._touchStartPos = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  }

  _onTouchEnd(e) {
    if (!this.enabled) return;
    // Treat as tap if quick and minimal movement
    const elapsed = Date.now() - this._touchStartTime;
    if (elapsed < 300 && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - this._touchStartPos.x;
      const dy = e.changedTouches[0].clientY - this._touchStartPos.y;
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        this._getPointer(e);
        this._raycastClick();
      }
    }
  }
}
