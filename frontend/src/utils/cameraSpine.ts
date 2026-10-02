import * as THREE from 'three';
import { clamp01, smoothstep, rodriguesRotate } from './math';

export interface WebEntry {
  at: number; // sp trigger
  span: number; // sp duration of web strand
  side: number; // +1 (right) or -1 (left)
  lead: number; // distance ahead along -Z
  radius: number; // radial distance from spine
  lift: number; // vertical elevation
}

// 6 Web entries with tightening spacing across the run
export const WEB_TABLE: WebEntry[] = [
  { at: 0.220, span: 0.100, side: 1,  radius: 4.2, lead: 4.2 * 3.8, lift: 2.8 },
  { at: 0.265, span: 0.095, side: -1, radius: 4.0, lead: 4.0 * 3.8, lift: 3.0 },
  { at: 0.310, span: 0.090, side: 1,  radius: 3.8, lead: 3.8 * 3.8, lift: 2.7 },
  { at: 0.348, span: 0.085, side: -1, radius: 3.6, lead: 3.6 * 3.8, lift: 3.1 },
  { at: 0.383, span: 0.080, side: 1,  radius: 3.4, lead: 3.4 * 3.8, lift: 2.9 },
  { at: 0.414, span: 0.075, side: -1, radius: 3.2, lead: 3.2 * 3.8, lift: 3.2 },
];

export interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
  up: THREE.Vector3;
  bankAngle: number;
}

/**
 * Computes base camera spine position (without swing offset) at sp
 */
export function getBaseSpinePosition(sp: number): THREE.Vector3 {
  // Act 1 (sp 0.0 -> 0.18): Camera holds/approaches figure at (0, 9, 0)
  if (sp <= 0.18) {
    const t = smoothstep(0, 0.18, sp);
    const z = THREE.MathUtils.lerp(28, 0, t);
    const y = THREE.MathUtils.lerp(9, 9, t);
    return new THREE.Vector3(0, y, z);
  }

  // Corridor legs: Linear distance accumulation with gear changes
  // Gear speeds (units per sp unit):
  // Leg 1 (0.18 to 0.33): speed 300
  // Leg 2 (0.33 to 0.52): speed 150
  // Leg 3 (0.52 to 0.82): speed 360
  let z = 0;
  if (sp <= 0.33) {
    z = -((sp - 0.18) * 300);
  } else if (sp <= 0.52) {
    z = -((0.33 - 0.18) * 300 + (sp - 0.33) * 150);
  } else {
    z = -((0.33 - 0.18) * 300 + (0.52 - 0.33) * 150 + (sp - 0.52) * 360);
  }

  // Slight gentle curvature down corridor
  const x = Math.sin((sp - 0.18) * Math.PI * 2) * 0.8;
  const y = 9 + Math.cos((sp - 0.18) * Math.PI * 1.5) * 0.4;

  return new THREE.Vector3(x, y, z);
}

/**
 * Computes base camera spine target (lookAt target without swing)
 */
export function getBaseSpineTarget(sp: number): THREE.Vector3 {
  if (sp <= 0.18) {
    return new THREE.Vector3(0, 9, 0);
  }
  const basePos = getBaseSpinePosition(sp);
  // Look forward along -Z corridor
  return new THREE.Vector3(basePos.x, basePos.y, basePos.z - 25);
}

/**
 * Computes full camera pose including swing offsets derived from WEB_TABLE
 */
export function getCameraPose(sp: number, reducedMotion: boolean = false): CameraPose {
  const basePos = getBaseSpinePosition(sp);
  const target = getBaseSpineTarget(sp);

  let swingX = 0;
  let swingY = 0;
  let bankAngle = 0;

  if (!reducedMotion) {
    for (const web of WEB_TABLE) {
      if (sp >= web.at && sp <= web.at + web.span) {
        const localT = (sp - web.at) / web.span;
        // u runs 0.08 - 0.82 of strand's life
        if (localT >= 0.08 && localT <= 0.82) {
          const u = (localT - 0.08) / (0.82 - 0.08);
          const env = Math.sin(Math.PI * u);
          swingX += web.side * 3.2 * env;
          swingY -= 1.5 * env; // dip under anchor
          bankAngle += web.side * 0.15 * env; // 0.15 rad bank into turn
        }
      }
    }
  }

  // Swing added to POSITION ONLY, never to look target
  const position = new THREE.Vector3(
    basePos.x + swingX,
    basePos.y + swingY,
    basePos.z
  );

  // Compute view vector and Rodrigues rotation for UP vector
  const viewDir = new THREE.Vector3().subVectors(target, position).normalize();
  const defaultUp = new THREE.Vector3(0, 1, 0);

  // Rotate UP vector about view axis (Rodrigues)
  const up = rodriguesRotate(defaultUp, viewDir, bankAngle);

  return { position, target, up, bankAngle };
}

/**
 * Computes anchor world position for web strand i: derived from spine(at) + (side * radius, lift, -lead)
 */
export function getWebAnchor(entry: WebEntry): THREE.Vector3 {
  const spineAt = getBaseSpinePosition(entry.at);
  return new THREE.Vector3(
    spineAt.x + entry.side * entry.radius,
    spineAt.y + entry.lift,
    spineAt.z - entry.lead
  );
}
