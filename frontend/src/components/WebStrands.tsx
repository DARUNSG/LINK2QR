import React, { useEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { WEB_TABLE, getWebAnchor, getCameraPose } from '../utils/cameraSpine';
import { clamp01 } from '../utils/math';

const SEGMENTS_PER_STRAND = 20; // 20 sub-segments per strand = 40 vertices per strand
const TOTAL_STRANDS = WEB_TABLE.length;
const TOTAL_SEGMENTS = TOTAL_STRANDS * SEGMENTS_PER_STRAND;

export const WebStrands: React.FC = () => {
  const { size } = useThree();
  const lineObjRef = useRef<LineSegments2 | null>(null);

  // Pre-allocate geometry, positions array, colors array and material
  const { geometry, material, positions, colors } = useMemo(() => {
    const geo = new LineSegmentsGeometry();
    const pos = new Float32Array(TOTAL_SEGMENTS * 6); // [x1,y1,z1, x2,y2,z2] per segment
    const col = new Float32Array(TOTAL_SEGMENTS * 6); // [r1,g1,b1, r2,g2,b2] per segment

    geo.setPositions(pos);
    geo.setColors(col);

    const mat = new LineMaterial({
      color: 0xffffff,
      linewidth: 2.4, // Screen-space fat lines!
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending, // Additive blending for vertex color fade
      depthWrite: false,
      resolution: new THREE.Vector2(size.width, size.height),
    });

    return { geometry: geo, material: mat, positions: pos, colors: col };
  }, []);

  // Mount LineSegments2 object into scene group
  const groupRef = useRef<THREE.Group>(null);
  useEffect(() => {
    const lineMesh = new LineSegments2(geometry, material);
    lineObjRef.current = lineMesh;
    if (groupRef.current) {
      groupRef.current.add(lineMesh);
    }
    return () => {
      if (groupRef.current) {
        groupRef.current.remove(lineMesh);
      }
    };
  }, [geometry, material]);

  useFrame(() => {
    if (!lineObjRef.current || !window.__SCROLL_STATE) return;

    const { sp, reducedMotion } = window.__SCROLL_STATE;
    material.resolution.set(size.width, size.height);

    const pose = getCameraPose(sp, reducedMotion);
    const cameraPos = pose.position;

    let totalActiveStrands = 0;

    for (let sIdx = 0; sIdx < TOTAL_STRANDS; sIdx++) {
      const entry = WEB_TABLE[sIdx];
      const anchor = getWebAnchor(entry);
      const localT = (sp - entry.at) / entry.span;

      const segOffset = sIdx * SEGMENTS_PER_STRAND * 6;

      if (localT < 0 || localT > 1) {
        // Inactive strand: collapse segment positions and zero colors
        for (let k = 0; k < SEGMENTS_PER_STRAND * 6; k++) {
          positions[segOffset + k] = 0;
          colors[segOffset + k] = 0;
        }
        continue;
      }

      totalActiveStrands++;

      // Origin point: near camera suit hand offset
      const origin = new THREE.Vector3(
        cameraPos.x + entry.side * 0.8,
        cameraPos.y - 0.4,
        cameraPos.z - 0.5
      );

      // Phase timing
      // FIRE 0 - 0.12
      // TAUT 0.12 - 0.55
      // RELEASE 0.55 - 0.80
      // FADE 0.80 - 1.00
      let tipTarget = anchor;
      if (localT <= 0.12) {
        const fireProgress = localT / 0.12;
        tipTarget = new THREE.Vector3().lerpVectors(origin, anchor, fireProgress);
      }

      let fadeGain = 1.0;
      if (localT > 0.80) {
        fadeGain = 1.0 - clamp01((localT - 0.80) / 0.20);
      }

      let releaseFactor = 0;
      if (localT > 0.55) {
        releaseFactor = clamp01((localT - 0.55) / 0.25);
      }

      // Compute strand points along curve
      for (let i = 0; i < SEGMENTS_PER_STRAND; i++) {
        const u1 = i / SEGMENTS_PER_STRAND;
        const u2 = (i + 1) / SEGMENTS_PER_STRAND;

        // Point 1
        const p1 = new THREE.Vector3().lerpVectors(origin, tipTarget, u1);
        // Point 2
        const p2 = new THREE.Vector3().lerpVectors(origin, tipTarget, u2);

        // Sag & Traveling wave during release phase
        if (releaseFactor > 0) {
          const sag1 = -3.5 * releaseFactor * Math.sin(Math.PI * u1);
          const wave1 = Math.sin(u1 * 12 - releaseFactor * 8) * releaseFactor * 0.8;
          p1.y += sag1;
          p1.x += wave1 * entry.side;

          const sag2 = -3.5 * releaseFactor * Math.sin(Math.PI * u2);
          const wave2 = Math.sin(u2 * 12 - releaseFactor * 8) * releaseFactor * 0.8;
          p2.y += sag2;
          p2.x += wave2 * entry.side;
        }

        const idx = segOffset + i * 6;
        positions[idx] = p1.x;
        positions[idx + 1] = p1.y;
        positions[idx + 2] = p1.z;
        positions[idx + 3] = p2.x;
        positions[idx + 4] = p2.y;
        positions[idx + 5] = p2.z;

        // Base Bone color at 1.25 gain (deliberately OVER bloom threshold)
        let r = 1.22 * 1.25 * fadeGain;
        let g = 1.20 * 1.25 * fadeGain;
        let b = 1.24 * 1.25 * fadeGain;

        // Scarlet impulse at firing tip edge
        if (localT <= 0.12) {
          const tipDist1 = Math.abs(u1 - localT / 0.12);
          if (tipDist1 < 0.15) {
            const impulse = (1 - tipDist1 / 0.15);
            // Mixes scarlet into bone
            r += 1.6 * impulse;
            g *= (1 - impulse * 0.5);
            b *= (1 - impulse * 0.5);
          }
        }

        colors[idx] = r;
        colors[idx + 1] = g;
        colors[idx + 2] = b;

        colors[idx + 3] = r;
        colors[idx + 4] = g;
        colors[idx + 5] = b;
      }
    }

    if (totalActiveStrands > 0) {
      lineObjRef.current.visible = true;
      geometry.setPositions(positions);
      geometry.setColors(colors);
    } else {
      lineObjRef.current.visible = false;
    }
  });

  return <group ref={groupRef} />;
};
