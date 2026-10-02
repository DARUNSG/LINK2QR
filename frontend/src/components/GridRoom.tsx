import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GridRoom: React.FC = () => {
  const innerRef = useRef<THREE.LineSegments>(null);
  const middleRef = useRef<THREE.LineSegments>(null);
  const outerRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Create cylinder wireframe geometry helper
  const createCylinderWireframe = (radius: number, segments: number, length: number) => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const stepZ = 15;
    const rings = Math.floor(length / stepZ);

    // Rings along Z
    for (let r = 0; r <= rings; r++) {
      const z = -r * stepZ + 30;
      for (let s = 0; s < segments; s++) {
        const a1 = (s / segments) * Math.PI * 2;
        const a2 = ((s + 1) / segments) * Math.PI * 2;
        positions.push(
          Math.cos(a1) * radius, Math.sin(a1) * radius, z,
          Math.cos(a2) * radius, Math.sin(a2) * radius, z
        );
      }
    }

    // Longitudinal lines along length
    for (let s = 0; s < segments; s++) {
      const a = (s / segments) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      positions.push(
        x, y, 30,
        x, y, -length + 30
      );
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  };

  const innerGeo = useMemo(() => createCylinderWireframe(9.0, 16, 450), []);
  const middleGeo = useMemo(() => createCylinderWireframe(13.95, 24, 450), []);
  const outerGeo = useMemo(() => createCylinderWireframe(19.8, 32, 450), []);

  useFrame(() => {
    if (!window.__SCROLL_STATE) return;

    const { sp } = window.__SCROLL_STATE;
    const act2Gate = window.ACT_GATES?.act2 ?? 0;
    const act3Gate = window.ACT_GATES?.act3 ?? 0;
    const act4Gate = window.ACT_GATES?.act4 ?? 0;
    const act5Gate = window.ACT_GATES?.act5 ?? 0;

    const roomVisibility = Math.max(act2Gate, act3Gate, act4Gate, act5Gate);

    if (!groupRef.current) return;
    if (roomVisibility <= 0.001) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // Apply differential rotational drift as pure function of sp
    if (innerRef.current) innerRef.current.rotation.z = sp * Math.PI * 2 * 0.055;
    if (middleRef.current) middleRef.current.rotation.z = -sp * Math.PI * 2 * 0.03; // Counter-rotates!
    if (outerRef.current) outerRef.current.rotation.z = sp * Math.PI * 2 * 0.014;
  });

  return (
    <group ref={groupRef} position={[0, 9, 0]}>
      {/* Inner Cylinder r=9.0 */}
      <lineSegments ref={innerRef} geometry={innerGeo}>
        <lineBasicMaterial
          color="#2b4fd0"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </lineSegments>

      {/* Middle Cylinder r=13.95 */}
      <lineSegments ref={middleRef} geometry={middleGeo}>
        <lineBasicMaterial
          color="#2b4fd0"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </lineSegments>

      {/* Outer Cylinder r=19.8 */}
      <lineSegments ref={outerRef} geometry={outerGeo}>
        <lineBasicMaterial
          color="#2b4fd0"
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </lineSegments>

      {/* Single Thin Horizon Bar at Y=0 (relative to cylinder center 9) */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                -40, 0, -200,  40, 0, -200,
                -40, 0, -100,  40, 0, -100,
                -40, 0, -300,  40, 0, -300
              ]),
              3
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#75666a" transparent opacity={0.3} depthWrite={false} />
      </lineSegments>
    </group>
  );
};
