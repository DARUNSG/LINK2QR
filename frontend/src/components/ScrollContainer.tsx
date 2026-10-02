import React, { useEffect, useState } from 'react';
import { SceneCanvas } from './SceneCanvas';
import { DOMOverlay } from './DOMOverlay';
import { computeActGates } from '../utils/actGates';
import { clamp01 } from '../utils/math';
import { ScrollState } from '../types/scroll';

// Initialize global window state objects
window.__SCROLL_STATE = {
  p: 0,
  sp: 0,
  time: 0,
  mouseX: 0,
  mouseY: 0,
  isMobile: false,
  reducedMotion: false,
};

window.ACT_GATES = computeActGates(0, 0);

export const ScrollContainer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Media queries for mobile & reduced motion
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      window.__SCROLL_STATE.isMobile = mobile;
    };

    const mediaQueryRM = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.__SCROLL_STATE.reducedMotion = mediaQueryRM.matches;

    const handleRMChange = (e: MediaQueryListEvent) => {
      window.__SCROLL_STATE.reducedMotion = e.matches;
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    mediaQueryRM.addEventListener('change', handleRMChange);

    // Mouse position tracking for cursor tilt
    const handleMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      window.__SCROLL_STATE.mouseX = mx;
      window.__SCROLL_STATE.mouseY = my;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scroll listener updating window.__SCROLL_STATE once per frame (NO REACT RE-RENDERS!)
    let ticking = false;

    const updateScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);

      const p = clamp01(scrollTop / maxScroll);
      const sp = clamp01(p / 0.82);

      const time = performance.now() * 0.001;

      window.__SCROLL_STATE.p = p;
      window.__SCROLL_STATE.sp = sp;
      window.__SCROLL_STATE.time = time;

      const actGates = computeActGates(sp, p);
      window.ACT_GATES = actGates;

      // Update dev element text if present
      const devElem = document.getElementById('dev-act-info');
      if (devElem) {
        devElem.textContent = `p: ${p.toFixed(3)} | sp: ${sp.toFixed(3)} | A1:${actGates.act1.toFixed(2)} A2:${actGates.act2.toFixed(2)} A3:${actGates.act3.toFixed(2)} A4:${actGates.act4.toFixed(2)} A5:${actGates.act5.toFixed(2)} A6:${actGates.act6.toFixed(2)}`;
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQueryRM.removeEventListener('change', handleRMChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="relative w-full bg-[#150406] text-[#f2f3f5] overflow-x-hidden">
      {/* 2200vh Scroll Track */}
      <div className="w-full h-[2200vh] pointer-events-none" />

      {/* Sticky Stage over the track */}
      <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
        <SceneCanvas isMobile={isMobile} />
        <DOMOverlay />
      </div>
    </div>
  );
};
