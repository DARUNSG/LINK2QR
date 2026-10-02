import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { remapColorToSuit } from '../utils/math';

const COUNT = 40000;
const FIGURE_CENTER = new THREE.Vector3(0, 9, 0);

export const InstancedFigure: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate 40,000 bead positions and baked colors ONCE
  const { positions, colors } = useMemo(() => {
    // 1. Draw portrait plate on offscreen canvas
    const canvas = document.createElement('canvas');
    const width = 256;
    const height = 384;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw stylized heroic portrait silhouette
      const cx = width / 2;
      const cy = height * 0.45;

      // Head
      const headGrad = ctx.createRadialGradient(cx, cy - 80, 5, cx, cy - 80, 45);
      headGrad.addColorStop(0, 'rgba(255, 240, 242, 1)');
      headGrad.addColorStop(0.5, 'rgba(224, 32, 43, 0.9)');
      headGrad.addColorStop(1, 'rgba(30, 7, 10, 0)');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 80, 45, 0, Math.PI * 2);
      ctx.fill();

      // Torso / Shoulders
      const torsoGrad = ctx.createLinearGradient(0, cy - 40, 0, cy + 120);
      torsoGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      torsoGrad.addColorStop(0.3, 'rgba(224, 32, 43, 0.85)');
      torsoGrad.addColorStop(0.8, 'rgba(43, 79, 208, 0.7)');
      torsoGrad.addColorStop(1, 'rgba(21, 4, 6, 0)');

      ctx.fillStyle = torsoGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, 75, 110, 0, 0, Math.PI * 2);
      ctx.fill();

      // Arms / Chest details
      ctx.fillStyle = 'rgba(255, 93, 100, 0.95)';
      ctx.beginPath();
      ctx.ellipse(cx - 55, cy + 40, 25, 70, 0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + 55, cy + 40, 25, 70, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const imgData = ctx ? ctx.getImageData(0, 0, width, height) : null;
    const validPixels: { x: number; y: number; r: number; g: number; b: number }[] = [];

    if (imgData) {
      const data = imgData.data;
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          const idx = (y * width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 30) {
            validPixels.push({
              x: (x / width - 0.5) * 9, // X spread [-4.5, 4.5]
              y: (1 - y / height - 0.5) * 14 + 9, // Y spread centered at 9 [-7 + 9, 7 + 9]
              r: data[idx] / 255,
              g: data[idx + 1] / 255,
              b: data[idx + 2] / 255,
            });
          }
        }
      }
    }

    const posArray = new Float32Array(COUNT * 3);
    const colArray = new Float32Array(COUNT * 3);

    const lightDir = new THREE.Vector3(0.5, 1.0, 1.2).normalize();
    const formNormal = new THREE.Vector3();

    for (let i = 0; i < COUNT; i++) {
      let sample = validPixels[Math.floor(Math.random() * validPixels.length)];
      if (!sample) {
        sample = { x: (Math.random() - 0.5) * 6, y: 9 + (Math.random() - 0.5) * 10, r: 0.9, g: 0.2, b: 0.2 };
      }

      // Add 3D volume depth (Z) around figure axis
      const rx = sample.x / 4.5;
      const ry = (sample.y - 9) / 7;
      const maxZ = Math.sqrt(Math.max(0.1, 1 - rx * rx - ry * ry)) * 2.6;
      const z = (Math.random() - 0.5) * 2 * maxZ;

      const x = sample.x + (Math.random() - 0.5) * 0.15;
      const y = sample.y + (Math.random() - 0.5) * 0.15;

      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;

      // Form normal from FIGURE'S OWN AXIS (n = (x, (y-9)*0.15, z).normalize())
      formNormal.set(x, (y - 9) * 0.15, z).normalize();

      // Bake shading ONCE
      const diffuse = Math.max(0.25, formNormal.dot(lightDir));
      const bakedR = sample.r * diffuse;
      const bakedG = sample.g * diffuse;
      const bakedB = sample.b * diffuse;

      // Remap color to Scarlet/Cobalt suit
      const finalColor = remapColorToSuit(bakedR, bakedG, bakedB);

      colArray[i * 3] = finalColor.r;
      colArray[i * 3 + 1] = finalColor.g;
      colArray[i * 3 + 2] = finalColor.b;
    }

    return { positions: posArray, colors: colArray };
  }, []);

  // Initialize Instance Matrices and Colors ONCE
  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      // Small sphere size scale ~0.04 to 0.06
      const scale = 0.045 + Math.random() * 0.02;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
      meshRef.current.setColorAt(i, color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [positions, colors]);

  // Frame update: Idle float + cursor tilt with compensating translation
  useFrame(() => {
    if (!groupRef.current || !window.__SCROLL_STATE) return;

    const { sp, time, mouseX, mouseY } = window.__SCROLL_STATE;
    const act1Gate = window.ACT_GATES?.act1 ?? 1;

    if (act1Gate <= 0.001) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.visible = true;

    // Whole-figure float
    const floatY = Math.sin(time * 1.4) * 0.35 * act1Gate;

    // Cursor tilt around pivot (0, 9, 0)
    const tiltX = mouseX * 0.25 * act1Gate;
    const tiltZ = mouseY * 0.20 * act1Gate;

    // Apply rotation & compensating translation to maintain pivot at (0, 9, 0)
    groupRef.current.position.set(0, FIGURE_CENTER.y + floatY, 0);
    groupRef.current.rotation.set(tiltZ, 0, -tiltX);

    // Fade out as camera advances into corridor
    const scale = act1Gate;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={[0, 9, 0]}>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, COUNT]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshBasicMaterial transparent opacity={0.95} depthWrite={true} />
      </instancedMesh>
    </group>
  );
};
