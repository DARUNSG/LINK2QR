import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { InstancedFigure } from './InstancedFigure';
import { LatticeCage } from './LatticeCage';
import { GridRoom } from './GridRoom';
import { WebStrands } from './WebStrands';
import { CameraSpine } from './CameraSpine';
import { PostProcessingPipeline } from './PostProcessingPipeline';

interface SceneCanvasProps {
  isMobile: boolean;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({ isMobile }) => {
  // DPR: 1.0 on mobile, 1.5 on desktop
  const dpr = useMemo(() => (isMobile ? 1.0 : 1.5), [isMobile]);

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 9, 28], fov: 55, near: 0.1, far: 500 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#150406', // Red-black raw ink base
      }}
    >
      <CameraSpine />
      <ambientLight intensity={0.15} color="#431a20" />
      <directionalLight position={[10, 20, 15]} intensity={1.2} color="#ff5d64" />
      
      <InstancedFigure />
      <LatticeCage />
      <GridRoom />
      <WebStrands />
      
      <PostProcessingPipeline />
    </Canvas>
  );
};
