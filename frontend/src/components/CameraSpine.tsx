import React, { useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getCameraPose } from '../utils/cameraSpine';

export const CameraSpine: React.FC = () => {
  const { camera, scene } = useThree();

  // Initialize scene fog with red-black ink color #150406
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#150406', 0.005);
    camera.rotation.order = 'YXZ'; // Guard against Euler roll leakage!
  }, [scene, camera]);

  useFrame(() => {
    if (!window.__SCROLL_STATE) return;

    const { sp, p, reducedMotion } = window.__SCROLL_STATE;

    // Get pure functional camera pose derived from sp
    const pose = getCameraPose(sp, reducedMotion);

    camera.position.copy(pose.position);
    camera.up.copy(pose.up);
    camera.lookAt(pose.target);

    // Fog closes far distance for Act 6 wipe on real p
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      if (p > 0.82) {
        // Density ramps up from 0.005 to 0.18 as p goes 0.82 -> 1.0
        const wipeProgress = (p - 0.82) / 0.18;
        scene.fog.density = THREE.MathUtils.lerp(0.005, 0.18, wipeProgress);
      } else {
        scene.fog.density = 0.005;
      }
    }
  });

  return null;
};
