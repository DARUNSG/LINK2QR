import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { clamp01, smoothstep } from '../utils/math';

interface SegmentPair {
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  rnd: number;
}

export const LatticeCage: React.FC = () => {
  const lineRef = useRef<THREE.LineSegments>(null);

  // Generate wireframe cage segments around figure at (0, 9, 0)
  const { originalSegments, bufferPositions } = useMemo(() => {
    const segments: SegmentPair[] = [];
    const radius = 6.8;
    const height = 16.0;
    const minY = 1.0;
    const sides = 12;
    const rings = 8;

    // Ring vertices
    const grid: THREE.Vector3[][] = [];
    for (let r = 0; r <= rings; r++) {
      const ringY = minY + (r / rings) * height;
      const ringRadius = radius * (1 - Math.pow((r / rings - 0.5) * 1.4, 2));
      const ring: THREE.Vector3[] = [];
      for (let s = 0; s < sides; s++) {
        const angle = (s / sides) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        ring.push(new THREE.Vector3(x, ringY, z));
      }
      grid.push(ring);
    }

    // Connect rings horizontally and vertically
    for (let r = 0; r <= rings; r++) {
      for (let s = 0; s < sides; s++) {
        const p1 = grid[r][s];
        const p2 = grid[r][(s + 1) % sides];
        segments.push({ p1, p2, rnd: Math.random() });

        if (r < rings) {
          const p3 = grid[r + 1][s];
          segments.push({ p1, p2: p3, rnd: Math.random() });

          // Cross braces
          const p4 = grid[r + 1][(s + 1) % sides];
          segments.push({ p1, p2: p4, rnd: Math.random() });
        }
      }
    }

    const posArray = new Float32Array(segments.length * 6);
    return { originalSegments: segments, bufferPositions: posArray };
  }, []);

  useFrame(() => {
    if (!lineRef.current || !window.__SCROLL_STATE) return;

    const { sp } = window.__SCROLL_STATE;
    const act1Gate = window.ACT_GATES?.act1 ?? 0;

    if (act1Gate <= 0.001) {
      lineRef.current.visible = false;
      return;
    }
    lineRef.current.visible = true;

    // Build scalar: weaves in 0.0 -> 0.10, un-weaves 0.12 -> 0.20
    const weaveIn = smoothstep(0, 0.10, sp);
    const weaveOut = 1 - smoothstep(0.12, 0.20, sp);
    const buildScalar = Math.min(weaveIn, weaveOut);

    const geo = lineRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < originalSegments.length; i++) {
      const seg = originalSegments[i];
      const threshold = seg.rnd * 0.7; // staggered threshold across build scalar
      const localT = clamp01((buildScalar - threshold) / 0.3);

      const x1 = seg.p1.x;
      const y1 = seg.p1.y;
      const z1 = seg.p1.z;

      // Segment draws itself from p1 to p2 as localT increases
      const x2 = THREE.MathUtils.lerp(x1, seg.p2.x, localT);
      const y2 = THREE.MathUtils.lerp(y1, seg.p2.y, localT);
      const z2 = THREE.MathUtils.lerp(z1, seg.p2.z, localT);

      posAttr.setXYZ(i * 2, x1, y1, z1);
      posAttr.setXYZ(i * 2 + 1, x2, y2, z2);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[bufferPositions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#2b4fd0"
        transparent
        opacity={0.35}
        depthWrite={false}
      >
      </lineBasicMaterial>
    </lineSegments>
  );
};
