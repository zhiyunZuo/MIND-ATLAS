// ============================================================
// MIND ATLAS — Utility Functions
// ============================================================

// --- Easing functions ---
export const Easing = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  easeOutBack: t => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  // Spring-like easing for organic motion
  spring: t => {
    const c = 2 * Math.PI * 3;
    return 1 - Math.cos(t * c) * Math.exp(-3 * t);
  }
};

// --- Lerp helpers ---
export function lerp(a, b, t) { return a + (b - a) * t; }
export function lerpVec3(a, b, t, out) {
  out.x = lerp(a.x, b.x, t);
  out.y = lerp(a.y, b.y, t);
  out.z = lerp(a.z, b.z, t);
  return out;
}
export function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
export function mapRange(v, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin));
}

// --- Random with seed ---
export function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// --- Smoothstep ---
export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

// --- Damped value for smooth following ---
export class DampedValue {
  constructor(value = 0, lambda = 0.1) {
    this.current = value;
    this.target = value;
    this.lambda = lambda;
  }
  setTarget(v) { this.target = v; }
  set(v) { this.current = v; this.target = v; }
  update(dt) {
    const t = 1 - Math.exp(-this.lambda * dt * 60);
    this.current = lerp(this.current, this.target, t);
    return this.current;
  }
}

// --- Format subject id to display title ---
export function formatPath(path) {
  return path.map(p => p.toUpperCase()).join(' / ');
}

// --- Check if mobile/touch ---
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// --- Throttle ---
export function throttle(fn, limit) {
  let inThrottle = false;
  let lastArgs = null;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

// --- Hex to rgb ---
export function hexToRgb(hex) {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  return { r, g, b };
}
