import React, { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Custom Vignette Shader (darkness 1.0, offset 1.3, no negative channel artifacts)
const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 1.3 },
    darkness: { value: 1.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - vec2(0.5)) * vec2(offset);
      float dist = length(uv);
      float factor = clamp(1.0 - dist * dist * darkness, 0.0, 1.0);
      factor = smoothstep(0.0, 1.0, factor);
      gl_FragColor = vec4(texel.rgb * factor, texel.a);
    }
  `,
};

// Display-Space Grain Shader (sits AFTER OutputPass)
const GrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    amount: { value: 0.045 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float amount;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float noise = (rand(vUv + vec2(time * 0.01, time * 0.02)) - 0.5) * amount;
      gl_FragColor = vec4(clamp(texel.rgb + vec3(noise), 0.0, 1.0), texel.a);
    }
  `,
};

export const PostProcessingPipeline: React.FC = () => {
  const { gl, scene, camera, size } = useThree();

  const { composer, grainPass } = useMemo(() => {
    const comp = new EffectComposer(gl);
    comp.setSize(size.width, size.height);

    // 1. Render Pass
    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    // 2. Unreal Bloom Pass
    // Strength 0.55, Radius 0.45, Threshold 1.15
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.55,
      0.45,
      1.15
    );
    // Set smoothWidth to 0.35 to avoid hard cutout clipping!
    const highPass = (bloomPass as unknown as { highPassUniforms: Record<string, { value: number }> }).highPassUniforms;
    if (highPass && highPass.smoothWidth) {
      highPass.smoothWidth.value = 0.35;
    }
    comp.addPass(bloomPass);

    // 3. Custom Vignette Pass
    const vignettePass = new ShaderPass(VignetteShader);
    vignettePass.uniforms.offset.value = 1.3;
    vignettePass.uniforms.darkness.value = 1.0;
    comp.addPass(vignettePass);

    // 4. Tone Mapping Output Pass
    const outputPass = new OutputPass();
    comp.addPass(outputPass);

    // 5. Film Grain Pass (in DISPLAY SPACE after OutputPass!)
    const gPass = new ShaderPass(GrainShader);
    comp.addPass(gPass);

    return { composer: comp, grainPass: gPass };
  }, [gl, scene, camera]);

  // Handle window resize
  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);

  // Execute render loop
  useFrame((_, delta) => {
    if (grainPass.uniforms.time) {
      grainPass.uniforms.time.value += delta;
    }
    composer.render();
  }, 1);

  return null;
};
