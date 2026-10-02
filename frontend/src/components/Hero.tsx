import React, { useState, useRef, useEffect } from 'react';
import { EchoText } from './EchoText';
import { DigitalHeroTimer } from './DigitalHeroTimer';
import { ArrowDownRight } from 'lucide-react';

interface HeroProps {
  onStartPlanning: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartPlanning }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Target position from mouse tracking across full hero section
  const targetPos = useRef({ x: 0, y: 0, tiltX: 0, tiltY: 0, isHovered: false, active: false });
  // Current LERP position for 60FPS fluid physics movement
  const currentPos = useRef({ x: 0, y: 0, tiltX: 0, tiltY: 0, isHovered: false, active: false });

  const [buttonTransform, setButtonTransform] = useState({
    x: 0,
    y: 0,
    tiltX: 0,
    tiltY: 0,
    isHovered: false,
    active: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current || !buttonRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();

      // Check if mouse is inside the Hero page region (from top of screen 0 down to section bottom)
      const isInsideHeroZone =
        e.clientX >= 0 &&
        e.clientX <= window.innerWidth &&
        e.clientY >= 0 &&
        e.clientY <= sectionRect.bottom;

      if (isInsideHeroZone) {
        // Calculate button home center position
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const homeCenterX = buttonRect.left + buttonRect.width / 2 - currentPos.current.x;
        const homeCenterY = buttonRect.top + buttonRect.height / 2 - currentPos.current.y;

        const rawDeltaX = e.clientX - homeCenterX;
        const rawDeltaY = e.clientY - homeCenterY;

        // Unrestricted Full Screen X Bounds (from 60px near left edge to 60px near right edge)
        const minMoveX = -(homeCenterX - 60);
        const maxMoveX = window.innerWidth - homeCenterX - 60;

        // Unrestricted Full Screen Y Bounds (from 30px near screen top to 50px above section bottom hairline)
        const minMoveY = -(homeCenterY - 30);
        const maxMoveY = Math.max(0, sectionRect.bottom - homeCenterY - 50);

        const moveX = Math.min(Math.max(rawDeltaX, minMoveX), maxMoveX);
        const moveY = Math.min(Math.max(rawDeltaY, minMoveY), maxMoveY);

        // 3D Tilt calculations based on travel offset
        const maxSpanX = Math.max(100, window.innerWidth / 2);
        const tiltY = Math.min(Math.max((moveX / maxSpanX) * 14, -14), 14);
        const tiltX = Math.min(Math.max(-(moveY / (homeCenterY || 1)) * 14, -14), 14);

        targetPos.current = {
          x: moveX,
          y: moveY,
          tiltX,
          tiltY,
          isHovered: true,
          active: true,
        };
      } else {
        targetPos.current = { x: 0, y: 0, tiltX: 0, tiltY: 0, isHovered: false, active: false };
      }
    };

    const handleMouseLeave = () => {
      targetPos.current = { x: 0, y: 0, tiltX: 0, tiltY: 0, isHovered: false, active: false };
    };

    let animId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const physicsLoop = () => {
      const cur = currentPos.current;
      const tar = targetPos.current;

      cur.x = lerp(cur.x, tar.x, 0.08);
      cur.y = lerp(cur.y, tar.y, 0.08);
      cur.tiltX = lerp(cur.tiltX, tar.tiltX, 0.08);
      cur.tiltY = lerp(cur.tiltY, tar.tiltY, 0.08);
      cur.isHovered = tar.isHovered;
      cur.active = tar.active;

      setButtonTransform({
        x: cur.x,
        y: cur.y,
        tiltX: cur.tiltX,
        tiltY: cur.tiltY,
        isHovered: cur.isHovered,
        active: cur.active,
      });

      animId = requestAnimationFrame(physicsLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    animId = requestAnimationFrame(physicsLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 w-full min-h-[75vh] md:min-h-[85vh] lg:min-h-[90vh] flex flex-col items-center justify-center px-6 py-16 text-center border-b border-[#1e1e1e]/10 bg-[#f2f2f2] [perspective:1000px] overflow-hidden"
    >
      {/* Soft Ambient Radial Glow Behind Hero Title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-sky-500/10 rounded-full blur-3xl pointer-events-none animate-aura-glow" />

      {/* Subtle Background Structural Hairlines */}
      <div className="absolute inset-0 pointer-events-none flex justify-between max-w-7xl mx-auto px-6 opacity-30">
        <div className="w-[1px] h-full bg-[#1e1e1e]/10"></div>
        <div className="w-[1px] h-full bg-[#1e1e1e]/10 hidden md:block"></div>
        <div className="w-[1px] h-full bg-[#1e1e1e]/10"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Hero Headline with Opening Stagger Fade */}
        <div className="w-full my-4 overflow-visible py-4 flex flex-col items-center gap-2 animate-opening-fade">
          <EchoText
            text="MEET"
            className="text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[85px] xl:text-[100px] font-intro-rust tracking-wide"
            offsetStep={0.035}
          />
          <EchoText
            text="ACROSS TIME"
            className="text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[85px] xl:text-[100px] font-intro-rust tracking-wide"
            offsetStep={0.035}
          />
        </div>

        {/* Live Digital Timer with Opening Entrance */}
        <div className="animate-opening-fade [animation-delay:200ms]">
          <DigitalHeroTimer />
        </div>

        {/* Sub-headline Description with Opening Entrance */}
        <p className="mt-6 max-w-2xl text-lg sm:text-xl md:text-2xl font-satoshi font-medium text-[#838282] tracking-tight leading-relaxed animate-opening-fade [animation-delay:400ms]">
          Find a meeting time that works across time zones.
        </p>

        {/* Magnetic Interactive CTA Box with Opening Entrance */}
        <div className="mt-12 relative z-30 animate-opening-fade [animation-delay:600ms]">
          <button
            ref={buttonRef}
            type="button"
            onClick={onStartPlanning}
            style={{
              transform: `translate3d(${buttonTransform.x}px, ${buttonTransform.y}px, 0px) rotateX(${buttonTransform.tiltX}deg) rotateY(${buttonTransform.tiltY}deg) scale(${
                buttonTransform.isHovered ? 1.07 : 1
              })`,
              boxShadow: buttonTransform.active
                ? `${-buttonTransform.x * 0.2}px ${14 - buttonTransform.y * 0.2}px 32px rgba(17, 17, 17, 0.25)`
                : '0 10px 25px rgba(17, 17, 17, 0.12)',
              willChange: 'transform, box-shadow',
            }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#111111] text-[#f2f2f2] text-sm font-satoshi font-bold tracking-[0.18em] uppercase rounded-full hover:bg-[#1e1e1e] border-2 border-transparent hover:border-[#ffffff]/30 transition-colors duration-300 cursor-pointer overflow-hidden shadow-2xl"
          >
            {/* Subtle Shimmer Sweep Line */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            <span>START PLANNING</span>
            <ArrowDownRight className="w-5 h-5 text-[#f2f2f2] group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </section>
  );
};
