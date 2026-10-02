import * as THREE from 'three';

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.min(1, Math.max(0, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Rodrigues' rotation formula: rotates vector v around unit vector axis by angle (in radians)
 */
export function rodriguesRotate(v: THREE.Vector3, axis: THREE.Vector3, angle: number): THREE.Vector3 {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const cross = new THREE.Vector3().crossVectors(axis, v);
  const dot = axis.dot(v);

  return new THREE.Vector3()
    .copy(v)
    .multiplyScalar(cosA)
    .addScaledVector(cross, sinA)
    .addScaledVector(axis, dot * (1 - cosA));
}

/**
 * Converts RGB [0,1] to HSL [0,1]
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

/**
 * Converts HSL [0,1] to RGB [0,1]
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return { r, g, b };
}

/**
 * Remaps sampled color according to "THE FIGURE" rules:
 * - If Saturation S < 0.12, keep original (specular highlight).
 * - Otherwise rotate hue to nearer of Scarlet (0.985) or Cobalt (0.625), shortest arc, 85% pull.
 * - Retain lightness.
 */
export function remapColorToSuit(origR: number, origG: number, origB: number): THREE.Color {
  const { h, s, l } = rgbToHsl(origR, origG, origB);

  if (s < 0.12) {
    return new THREE.Color(origR, origG, origB);
  }

  const targetScarlet = 0.985;
  const targetCobalt = 0.625;

  // Shortest arc distance calculation on circular hue [0, 1]
  const distScarlet = Math.abs(((h - targetScarlet + 1.5) % 1) - 0.5);
  const distCobalt = Math.abs(((h - targetCobalt + 1.5) % 1) - 0.5);

  const targetH = distScarlet < distCobalt ? targetScarlet : targetCobalt;

  // Shortest arc delta
  let diff = targetH - h;
  if (diff > 0.5) diff -= 1;
  if (diff < -0.5) diff += 1;

  const newH = (h + diff * 0.85 + 1) % 1;
  const rgb = hslToRgb(newH, s, l);

  return new THREE.Color(rgb.r, rgb.g, rgb.b);
}
