// ============================================================
// MIND ATLAS — Cinematic Camera Rig
// Multi-stage camera transitions: approach → focus → open → dive → book world
// ============================================================

import * as THREE from 'three';
import { Easing } from './utils.js';

const STATE = {
  UNIVERSE: 'universe',
  APPROACH: 'approach',
  FOCUS: 'focus',
  OPENING: 'opening',
  DIVING: 'diving',
  TRANSITION: 'transition',
  BOOK_WORLD: 'book_world',
  TOPIC_APPROACH: 'topic_approach',
  RETURNING: 'returning'
};

export class CameraRig {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.state = STATE.UNIVERSE;
    this._lookAt = new THREE.Vector3(0, 0, 0);
    this._transition = null;
    this._queue = [];
    this._savedUniversePos = null;
    this._savedUniverseLook = null;
    this._currentBook = null;
    this._callbacks = {}; // state change callbacks

    // Init lookAt
    if (controls && controls.target) {
      this._lookAt.copy(controls.target);
    }
  }

  on(state, cb) {
    if (!this._callbacks[state]) this._callbacks[state] = [];
    this._callbacks[state].push(cb);
  }

  _fireState(state, data) {
    const cbs = this._callbacks[state];
    if (cbs) cbs.forEach(cb => cb(data));
  }

  getState() { return this.state; }

  _setState(state, data) {
    this.state = state;
    this._fireState(state, data);
  }

  // Start a single transition
  _startTransition(toPos, toLook, duration, easing, onUpdate, onComplete) {
    this._transition = {
      fromPos: this.camera.position.clone(),
      toPos: toPos.clone(),
      fromLook: this._lookAt.clone(),
      toLook: toLook.clone(),
      duration: duration,
      elapsed: 0,
      easing: easing || Easing.easeInOutCubic,
      onUpdate: onUpdate || null,
      onComplete: onComplete || null
    };
    if (this.controls) this.controls.enabled = false;
  }

  _queueTransition(toPos, toLook, duration, easing, onUpdate, onComplete) {
    this._queue.push({ toPos, toLook, duration, easing, onUpdate, onComplete });
  }

  _processQueue() {
    if (this._queue.length > 0) {
      const next = this._queue.shift();
      this._startTransition(next.toPos, next.toLook, next.duration, next.easing, next.onUpdate, next.onComplete);
    } else {
      // Queue empty — check state
      if (this.state === STATE.APPROACH || this.state === STATE.FOCUS ||
          this.state === STATE.OPENING || this.state === STATE.DIVING ||
          this.state === STATE.TRANSITION) {
        // These are handled by the enterBook sequence
      }
    }
  }

  // --- Enter a book: full cinematic sequence ---
  enterBook(book, onEnterWorld) {
    if (this.state !== STATE.UNIVERSE) return;

    this._currentBook = book;
    this._savedUniversePos = this.camera.position.clone();
    this._savedUniverseLook = this._lookAt.clone();

    const bookPos = new THREE.Vector3();
    book.getWorldPosition(bookPos);

    const viewPos = new THREE.Vector3();
    book.getViewPosition(viewPos);

    const divePos = new THREE.Vector3();
    book.getDivePosition(divePos);

    this._queue = [];

    // Stage 1: Approach the book (2.5s)
    this._queueTransition(viewPos, bookPos, 2.5, Easing.easeInOutCubic,
      null,
      () => {
        this._setState(STATE.FOCUS);
        // Dim other books handled by callback
      }
    );

    // Stage 2: Focus hold (0.7s) — others dim, book highlights
    this._queueTransition(viewPos, bookPos, 0.7, Easing.easeInOutSine,
      (t) => {
        // Gradual dimming happens in main via FOCUS state callback
      },
      () => {
        this._setState(STATE.OPENING);
      }
    );

    // Stage 3: Book opens (1.8s)
    this._queueTransition(viewPos, bookPos, 1.8, Easing.easeInOutSine,
      (t, eased) => {
        book.open(eased * 0.65);
      },
      () => {
        this._setState(STATE.DIVING);
      }
    );

    // Stage 4: Dive into pages (2.2s)
    this._queueTransition(divePos, bookPos, 2.2, Easing.easeInCubic,
      (t, eased) => {
        book.open(0.65 + eased * 0.35);
        // Warm overlay fades in during second half
        if (eased > 0.4) {
          const overlayProgress = (eased - 0.4) / 0.6;
          this._fireState('overlay', { opacity: overlayProgress, color: 'warm' });
        }
      },
      () => {
        this._setState(STATE.TRANSITION);
        // Switch to book world
        if (onEnterWorld) onEnterWorld(book.subject);
        // Overlay fades out
        this._fireState('overlay', { opacity: 0, color: 'warm', fadeOut: true });
        this._setState(STATE.BOOK_WORLD);
        this._currentBook = book;
      }
    );

    // Start first transition
    this._setState(STATE.APPROACH);
    const first = this._queue.shift();
    this._startTransition(first.toPos, first.toLook, first.duration, first.easing, first.onUpdate, first.onComplete);
  }

  // --- Return from book world to universe ---
  returnToUniverse(onExitWorld) {
    if (this.state !== STATE.BOOK_WORLD && this.state !== STATE.TOPIC_APPROACH) return;

    const book = this._currentBook;
    if (!book) return;

    const bookPos = new THREE.Vector3();
    book.getWorldPosition(bookPos);

    const divePos = new THREE.Vector3();
    book.getDivePosition(divePos);

    const viewPos = new THREE.Vector3();
    book.getViewPosition(viewPos);

    this._queue = [];

    // Fade in overlay
    this._fireState('overlay', { opacity: 1, color: 'warm', instant: true });

    // Stage 1: Exit book world (0.8s)
    this._queueTransition(divePos, bookPos, 0.8, Easing.easeOutCubic,
      null,
      () => {
        if (onExitWorld) onExitWorld();
        this._fireState('overlay', { opacity: 0.3, color: 'warm', fadeOut: true });
      }
    );

    // Stage 2: Pull back from book (2.0s)
    this._queueTransition(viewPos, bookPos, 2.0, Easing.easeInOutCubic,
      (t, eased) => {
        // Book closes gradually
        book.open(1 - eased * 0.6);
      },
      null
    );

    // Stage 3: Restore universe (2.0s)
    this._queueTransition(this._savedUniversePos, this._savedUniverseLook, 2.0, Easing.easeInOutCubic,
      (t, eased) => {
        book.open(0.4 - eased * 0.4);
        // Overlay fully gone
        if (eased > 0.3) {
          this._fireState('overlay', { opacity: 0, color: 'warm', fadeOut: true });
        }
      },
      () => {
        book.close();
        this._setState(STATE.UNIVERSE);
        if (this.controls) {
          this.controls.enabled = true;
          this.controls.target.copy(this._savedUniverseLook);
          this.controls.update();
        }
        this._currentBook = null;
      }
    );

    // Start
    this._setState(STATE.RETURNING);
    const first = this._queue.shift();
    this._startTransition(first.toPos, first.toLook, first.duration, first.easing, first.onUpdate, first.onComplete);
  }

  // --- Enter a topic within book world ---
  approachTopic(topicPosition, onComplete) {
    if (this.state !== STATE.BOOK_WORLD) return;

    const approachPos = topicPosition.clone();
    approachPos.z += 1.5;
    approachPos.y += 0.8;

    this._setState(STATE.TOPIC_APPROACH);
    this._startTransition(approachPos, topicPosition, 1.5, Easing.easeInOutCubic, null, onComplete);
  }

  // --- Return from topic to book world overview ---
  returnToBookWorld(bookWorldCenter, onComplete) {
    const overviewPos = bookWorldCenter.clone();
    overviewPos.z += 8;
    overviewPos.y += 3;

    this._startTransition(overviewPos, bookWorldCenter, 1.5, Easing.easeInOutCubic, null, () => {
      this._setState(STATE.BOOK_WORLD);
      if (this.controls) {
        this.controls.enabled = true;
        this.controls.target.copy(bookWorldCenter);
        this.controls.update();
      }
      if (onComplete) onComplete();
    });
  }

  // --- Setup book world camera ---
  enterBookWorldPosition(centerPos) {
    const startPos = centerPos.clone();
    startPos.z += 6;
    startPos.y += 3;

    this.camera.position.copy(startPos);
    this._lookAt.copy(centerPos);
    this.camera.lookAt(this._lookAt);

    if (this.controls) {
      this.controls.enabled = true;
      this.controls.target.copy(centerPos);
      this.controls.minDistance = 3;
      this.controls.maxDistance = 20;
      this.controls.update();
    }
  }

  // --- Update loop ---
  update(dt) {
    if (this._transition) {
      const tr = this._transition;
      tr.elapsed += dt;
      const t = Math.min(1, tr.elapsed / tr.duration);
      const eased = tr.easing(t);

      this.camera.position.lerpVectors(tr.fromPos, tr.toPos, eased);
      this._lookAt.lerpVectors(tr.fromLook, tr.toLook, eased);
      this.camera.lookAt(this._lookAt);

      if (tr.onUpdate) tr.onUpdate(t, eased);

      if (t >= 1) {
        const cb = tr.onComplete;
        this._transition = null;
        if (cb) cb();
        this._processQueue();
      }
    }
  }

  getLookAt() {
    return this._lookAt;
  }

  isInTransition() {
    return this._transition !== null || this._queue.length > 0;
  }
}

export { STATE as CameraState };
