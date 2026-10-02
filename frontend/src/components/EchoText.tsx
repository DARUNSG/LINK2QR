import React, { useState, useRef, useEffect } from 'react';

interface EchoTextProps {
  text: string;
  className?: string;
  offsetStep?: number; // base offset in em, default 0.04
  interactive?: boolean; // enable cursor proximity animation
}

export const EchoText: React.FC<EchoTextProps> = ({
  text,
  className = '',
  offsetStep = 0.04,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Target coordinates from raw mouse listener
  const targetRef = useRef({ x: 0, y: 0, proximity: 0, isHovered: false });
  // Current LERP interpolated coordinates for 60FPS fluid physics motion
  const currentRef = useRef({ x: 0, y: 0, proximity: 0, isHovered: false });

  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number; proximity: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    proximity: 0,
    isHovered: false,
  });

  const echoColors = ['#d9d9d9', '#d1d1d1', '#c9c9c9', '#bfbfbf'];

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 480; // Expanded proximity activation radius

      const proximity = Math.max(0, 1 - distance / maxDistance);

      const isHovered =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (proximity > 0) {
        const normX = Math.min(Math.max(deltaX / (rect.width / 2 || 1), -1.2), 1.2);
        const normY = Math.min(Math.max(deltaY / (rect.height / 2 || 1), -1.5), 1.2);
        targetRef.current = { x: normX, y: normY, proximity, isHovered };
      } else {
        targetRef.current = { x: 0, y: 0, proximity: 0, isHovered: false };
      }
    };

    const handleMouseLeave = () => {
      targetRef.current = { x: 0, y: 0, proximity: 0, isHovered: false };
    };

    // 60FPS Physics LERP Loop for ultra-smooth fluid text motion
    let animId: number;
    const lerp = (start: number, end: number, speed: number) => start + (end - start) * speed;

    const animationLoop = () => {
      const cur = currentRef.current;
      const tar = targetRef.current;

      cur.x = lerp(cur.x, tar.x, 0.07);
      cur.y = lerp(cur.y, tar.y, 0.07);
      cur.proximity = lerp(cur.proximity, tar.proximity, 0.07);
      cur.isHovered = tar.isHovered;

      setMouseOffset({
        x: cur.x,
        y: cur.y,
        proximity: cur.proximity,
        isHovered: cur.isHovered,
      });

      animId = requestAnimationFrame(animationLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    animId = requestAnimationFrame(animationLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [interactive]);

  // Dynamic subtle letter spacing breathing
  const currentLetterSpacing = `${-0.03 + mouseOffset.proximity * 0.015}em`;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none cursor-default group ${className}`}
    >
      {/* 4 Background Echo Layers (stacked behind) with GPU Hardware Acceleration */}
      {echoColors.map((color, index) => {
        const multiplier = 4 - index;
        const baseOffsetEm = -(multiplier * offsetStep);

        const mouseShiftX = mouseOffset.proximity * (mouseOffset.x * multiplier * 6.5);
        const mouseShiftY = mouseOffset.proximity * (mouseOffset.y * multiplier * 6.5);
        const hoverExpandMultiplier = mouseOffset.isHovered ? 1.35 : 1 + mouseOffset.proximity * 0.45;

        const dynamicOffsetX = baseOffsetEm * hoverExpandMultiplier * 16 + mouseShiftX;
        const dynamicOffsetY = baseOffsetEm * hoverExpandMultiplier * 16 + mouseShiftY;
        const scaleVal = 1 + mouseOffset.proximity * (0.012 * (4 - index));

        return (
          <span
            key={index}
            aria-hidden="true"
            className="absolute top-0 left-0 font-bold leading-[0.9] pointer-events-none will-change-transform"
            style={{
              color: color,
              letterSpacing: currentLetterSpacing,
              wordSpacing: '0.25em',
              opacity: 0.75 + mouseOffset.proximity * 0.25,
              transform: `translate3d(${dynamicOffsetX}px, ${dynamicOffsetY}px, 0px) scale(${scaleVal})`,
              transition: 'letter-spacing 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease-out',
              zIndex: index + 1,
            }}
          >
            {text}
          </span>
        );
      })}

      {/* Top Primary Text Layer with Ambient Drop Shadow & GPU Acceleration */}
      <span
        className="relative z-10 font-bold leading-[0.9] text-[#111111] block will-change-transform"
        style={{
          letterSpacing: currentLetterSpacing,
          wordSpacing: '0.25em',
          filter: mouseOffset.proximity > 0
            ? `drop-shadow(0 ${3 * mouseOffset.proximity}px ${10 * mouseOffset.proximity}px rgba(17,17,17,${0.15 * mouseOffset.proximity}))`
            : 'none',
          transform: `translate3d(${mouseOffset.x * 3.5 * mouseOffset.proximity}px, ${
            mouseOffset.y * 3.5 * mouseOffset.proximity
          }px, 0px) scale(${mouseOffset.isHovered ? 1.018 : 1})`,
          transition: 'letter-spacing 300ms cubic-bezier(0.16, 1, 0.3, 1), filter 300ms ease-out',
        }}
      >
        {text}
      </span>

    </div>
  );
};
